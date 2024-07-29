document.addEventListener("DOMContentLoaded", function() {
    // the video
    const video = document.getElementById('background-video');
    const repeatStartTime = 5; // Time in seconds to start the repeat from
    video.addEventListener('ended', () => {
        video.currentTime = repeatStartTime;
        video.play();
    });
    let expandedNavContainer = document.getElementById("expandedNavContainer")
    // open the nav menu
    document.getElementById("burger").onclick = function(){
        expandedNavContainer.classList.add("expanded");
    };
    // close the nav menu
    document.getElementById("closeExpandedNavSvg").onclick = function(){
        expandedNavContainer.classList.remove("expanded");
    };
});
