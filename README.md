# Personal Resume Website: mcantow.github.io

This repository contains the code for my personal resume website, a simple and fully serverless single-page application (SPA) built with vanilla HTML, CSS, and JavaScript. The site is deployed using GitHub Pages and enhanced with Cloudflare services for performance and security.

My goal with this project is to keep the implementation as simple as possible, so that a non technical person could feasibly fork my repo and build their own personal website! 

Since starting the project, I pivoted towards MC-AI, which will replace 99% of personal websites with an AI Agent that's your biggest fan. Stay tuned!

## Architecture

### GitHub Pages and Cloudflare
The website is hosted on GitHub Pages and utilizes Cloudflare for DNS management and additional functionalities. This architecture provides a seamless, low-maintenance deployment process:
- **GitHub Pages** serves the static files (HTML, CSS, JS) directly from the repository.
- **Cloudflare** manages the DNS and can be configured to provide additional features such as caching, security, and serverless functions via Cloudflare Workers.

### Single-Page Application
The site is a single-page application (SPA) that uses JavaScript to manipulate the DOM for subpage navigations. This approach makes the site:
- **Easy to Preview:** Simply open the `index.html` file from your machine's files to see the site in action.
- **Easy to Deploy:** Cloudflare DNS points to the GitHub Pages URL, ensuring that the latest version of your site is always available.

## Additional Functionality

### Cloudflare Workers
For added functionality, Cloudflare Workers can be configured to proxy requests to APIs while maintaining the integrity of sensitive information such as API keys. For example, my personal site uses Cloudflare Workers to proxy API requests to an LLM model for the chat feature.

### Example Worker Script
Here is a basic example of a Cloudflare Worker script that proxies API requests:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const apiKey = 'YOUR_API_KEY'
  const apiUrl = 'https://api.example.com/endpoint'

  const requestBody = await request.json()
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  })

  const responseData = await response.json()
  
  return new Response(JSON.stringify(responseData), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## Notes, Enhancement Opportunities

### Jekyll Integration
[Jekyll](https://jekyllrb.com/) is a popular static site generator that easily integrates into this deployment architecture. For a larger-scale personal site, you may want to consider using Jekyll to manage your content more efficiently.

### DockMed Server Architecture
If you are looking to run a server, check out the DockMed server architecture I published in my MEng thesis: [DockMed Server Architecture](https://dspace.mit.edu/bitstream/handle/1721.1/151277/cantow-mcantow-meng-eecs-2023-thesis.pdf?sequence=1&isAllowed=y).

## License
This project is licensed under the MIT License - see the LICENSE.md file for details. 
