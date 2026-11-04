#!/usr/bin/env python3
"""Public-repo guard for michaelcantow.com.

Blocks anything that should not be published from a public repository:
secrets and keys, personal contact details, local machine paths, internal
notes, crude language, risky file types, oversized files, photos carrying
GPS location, and commits authored under anything but a GitHub no-reply
address.

    public_guard.py --staged          scan what is about to be committed
    public_guard.py --all             scan every tracked file
    public_guard.py --commits A..B    check commit author/committer emails
    public_guard.py --range A..B      both: emails, plus files changed in A..B

A line containing "public-guard: allow" is skipped (use sparingly).

Personal strings to block (your own email, phone, street) go in the
untracked file .git/info/public-guard-private, one per line. They are
never committed, so the list itself stays private.
"""
import base64
import os
import re
import subprocess
import sys

ROOT = subprocess.run(["git", "rev-parse", "--show-toplevel"],
                      capture_output=True, text=True).stdout.strip() or "."
SELF = ".githooks/public_guard.py"
MAX_BYTES = 10 * 1024 * 1024
ALLOW = "public-guard: allow"

# ---- file names that never belong in a public repo ----
BAD_NAMES = re.compile(
    r"(^|/)(\.env(\..*)?|id_rsa.*|id_ed25519.*|.*\.pem|.*\.key|.*\.p12|.*\.pfx|"
    r".*\.keystore|credentials.*\.json|service-account.*\.json|\.npmrc|\.pypirc|"
    r"\.netrc|.*\.sqlite3?|.*\.db|.*\.log|.*\.bak|.*~|\.DS_Store|Thumbs\.db|"
    r".*\.swp|node_modules/.*|__pycache__/.*|\.vscode/.*|\.idea/.*|"
    r".*\.(psd|ai|sketch|fig|xd)|.*\.(zip|tar|gz|7z|rar))$", re.I)

TEXT_EXT = re.compile(r"\.(html?|css|js|mjs|json|md|txt|xml|svg|yml|yaml|py|sh|toml|csv|webmanifest)$|"
                      r"(^|/)(CNAME|robots\.txt|LICENSE[^/]*)$", re.I)
PHOTO_EXT = re.compile(r"\.(jpe?g|png|webp|heic|tiff?)$", re.I)

# ---- content rules: (label, pattern) ----
RULES = [
    ("secret: private key", r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    ("secret: AWS key", r"\b(AKIA|ASIA)[0-9A-Z]{16}\b"),
    ("secret: GitHub token", r"\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}"),
    ("secret: API key", r"\bsk-(ant-|proj-)?[A-Za-z0-9_\-]{20,}|\bAIza[0-9A-Za-z_\-]{35}\b|"
                        r"\bxox[abprs]-[A-Za-z0-9\-]{10,}|\b(sk|rk)_live_[A-Za-z0-9]{20,}|"
                        r"\bSG\.[A-Za-z0-9_\-]{20,}\.[A-Za-z0-9_\-]{20,}"),
    ("secret: hard-coded credential",
     r"(?i)\b(api[_-]?key|secret|passw(or)?d|access[_-]?token|auth[_-]?token|client[_-]?secret)\b"
     r"\s*[:=]\s*['\"][^'\"\s]{12,}['\"]"),
    ("secret: credentials in URL", r"[a-z]+://[^/\s:@'\"]+:[^/\s@'\"]+@"),
    ("personal: phone number", r"(?<![\d.\-])(\+?1[ .\-])?\(?\b\d{3}\)?[ .\-]\d{3}[ .\-]\d{4}\b(?![\d.])"),
    ("personal: email address", r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b"),
    ("local: machine path", r"(/home/[a-z_][\w.\-]*/|/Users/[\w.\-]+/|[A-Za-z]:\\Users\\|file:///)"),
    ("local: dev server address", r"\b(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?\b"),
    ("internal note", r"\b(TODO|FIXME|XXX|HACK|TEMP|WIP)\b"),
    ("internal note", r"(?i)\b(do not (ship|commit|publish)|internal[ -]only|confidential|"
                      r"not for (public|release)|uncommitted in)\b"),
]
RULES = [(label, re.compile(p)) for label, p in RULES]

# Email addresses that are fine to publish.
EMAIL_OK = re.compile(r"(?i)@(users\.noreply\.github\.com|example\.(com|org|net)|acme\.com|"
                      r"[\w.\-]*customernode\.com)$|^(git|noreply|no-reply)@|"
                      r"\.(png|jpe?g|webp|svg|gif|js|css)$|@\d+x\b|@media|@import")

# Crude words, stored encoded so this file reads cleanly itself.
CRUDE = [w for w in base64.b64decode(
    "ZnVja3xzaGl0fGJpdGNofGFzc2hvbGV8YmFzdGFyZHxkaWNrfGN1bnR8Y3JhcHxkYW1u"
    "fHd0Znxzb2J8cGlzc3xzbHV0fHdob3JlfHJldGFyZHxpZGlvdHxzdHVwaWR8ZHVtYmFzc3xtb3Jvbg=="
).decode().split("|")]
CRUDE_RE = re.compile(r"(?i)(?<![a-z])(" + "|".join(CRUDE) + r")(s|ed|ing|ty|py)?(?![a-z])")


def private_strings():
    p = os.path.join(ROOT, ".git", "info", "public-guard-private")
    try:
        with open(p) as f:
            return [l.strip() for l in f if l.strip() and not l.startswith("#")]
    except OSError:
        return []


def git(*a, binary=False):
    r = subprocess.run(["git", *a], capture_output=True, cwd=ROOT)
    return r.stdout if binary else r.stdout.decode("utf-8", "replace")


def gps_in(data):
    """True if a JPEG/PNG/WebP/TIFF carries EXIF GPS coordinates."""
    try:
        from PIL import Image
        import io
        im = Image.open(io.BytesIO(data))
        gps = im.getexif().get_ifd(0x8825)
        return bool(gps)
    except Exception:
        return b"GPSLatitude" in data or b"GPSInfo" in data


def scan_file(path, data, private, problems):
    if BAD_NAMES.search(path):
        problems.append(f"{path}: file type should not be in a public repo")
    if len(data) > MAX_BYTES:
        problems.append(f"{path}: {len(data)//1048576} MB file (limit 10 MB)")
    if PHOTO_EXT.search(path) and gps_in(data):
        problems.append(f"{path}: photo contains GPS location; strip metadata first")
    if path == SELF or not TEXT_EXT.search(path):
        return
    text = data.decode("utf-8", "replace")
    for n, line in enumerate(text.splitlines(), 1):
        if ALLOW in line:
            continue
        # Skip long minified / SVG path lines for the noisy number rules.
        for label, pat in RULES:
            for m in pat.finditer(line):
                hit = m.group(0)
                if label == "personal: email address" and EMAIL_OK.search(hit):
                    continue
                if label == "personal: phone number" and re.search(r"[A-Za-z]\d|\d\.\d", line[max(0, m.start()-3):m.end()+3]):
                    continue  # coordinates / SVG path data, not a phone number
                problems.append(f"{path}:{n}: {label}: {hit[:60]}")
        for m in CRUDE_RE.finditer(line):
            problems.append(f"{path}:{n}: unprofessional language: {m.group(0)}")
        low = line.lower()
        for s in private:
            if s.lower() in low:
                problems.append(f"{path}:{n}: personal detail from your private block list")


def check_commits(rng, problems):
    for row in git("log", "--format=%h%x09%ae%x09%ce", rng).splitlines():
        h, a, c = row.split("\t")
        for who, e in (("author", a), ("committer", c)):
            if not e.lower().endswith("@users.noreply.github.com"):
                problems.append(f"commit {h}: {who} email {e} is not your GitHub no-reply address")


def main(argv):
    problems, private = [], private_strings()
    if "--commits" in argv:
        check_commits(argv[argv.index("--commits") + 1], problems)
    if "--staged" in argv:
        files = git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z").split("\0")
        for f in filter(None, files):
            scan_file(f, git("show", f":{f}", binary=True), private, problems)
        ident = git("var", "GIT_AUTHOR_IDENT") + git("var", "GIT_COMMITTER_IDENT")
        if ident.count("@users.noreply.github.com") < 2:
            problems.append("commit identity is not your GitHub no-reply address "
                            "(git config user.email 48968649+mcantow@users.noreply.github.com)")
    if "--range" in argv:
        rng = argv[argv.index("--range") + 1]
        tip = rng.split("..")[-1]
        check_commits(rng, problems)
        files = git("diff", "--name-only", "--diff-filter=ACMR", "-z", *rng.split("..")).split("\0") \
            if ".." in rng else git("ls-tree", "-r", "--name-only", "-z", tip).split("\0")
        for f in filter(None, files):
            scan_file(f, git("show", f"{tip}:{f}", binary=True), private, problems)
    if "--all" in argv:
        for f in filter(None, git("ls-files", "-z").split("\0")):
            try:
                with open(os.path.join(ROOT, f), "rb") as fh:
                    scan_file(f, fh.read(), private, problems)
            except OSError:
                pass
    if problems:
        print("Public-repo guard blocked this:\n  " + "\n  ".join(problems[:60]), file=sys.stderr)
        if len(problems) > 60:
            print(f"  ...and {len(problems)-60} more", file=sys.stderr)
        print(f"\nFix these, or mark a deliberate line with '{ALLOW}'.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
