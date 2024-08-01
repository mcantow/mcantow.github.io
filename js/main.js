///////////////////////////////////
// MAIN JS FOR michaelcantow.com //
//                               //
//                               //
///////////////////////////////////


var fadeTime = 500

////////////////////////////////////
// DOCUMENT READY EVENT LISTENERS //
////////////////////////////////////

document.addEventListener("DOMContentLoaded", function() {

    // setup the video background
    const video = document.getElementById('background-video');
    const repeatStartTime = 0; // Time in seconds to start the repeat from
    video.addEventListener('ended', () => {
        video.currentTime = repeatStartTime;
        video.play();
    });
    
    // set the nav menu as a variable
    let expandedNavContainer = document.getElementById("expandedNavContainer")

    // open the nav menu
    document.getElementById("topnavContainer").onclick = function(){
        expandedNavContainer.classList.add("expanded");
    };

    // close the nav menu
    document.getElementById("closeExpandedNavSvg").onclick = function(){
        expandedNavContainer.classList.remove("expanded");
    };

});




//////////////////////////////
// SUBPAGE NAVIGATION (SPA) //
//////////////////////////////

function navigateTo(page) {
    /**
     * Docstring TODO
     */
    // Remove 'active' class from all nav links
    const navLinks = document.querySelectorAll('.expandedNav a');
    navLinks.forEach(navLink => {
        navLink.classList.remove('active');
    });
    // Update browser history
    history.pushState({ page }, "", `#${page}`);
    // Add 'active' class to the clicked nav link
    let selector = document.getElementById('navL_' + page);
    selector.classList.add('active');
    // Show the specified page
    showPage(page, selector.innerHTML);
    // close the menu
    let expandedNavContainer = document.getElementById("expandedNavContainer")
    expandedNavContainer.classList.remove("expanded");
}

function showPage(page, selectorInnerHTML) {
    /**
     * Docstring TODO
     */
    if (page == 'home'){formatHomeHeader()}
    else {formatOtherHeader()};
    const subpages = document.querySelectorAll('.subpage');
    subpages.forEach(subpage => {
        if (page === 'home') {
            $('#subpageTitleContainer').fadeOut(fadeTime);
            setTimeout(function(){
                $('#subpageTitleContainer').html('');
            }, fadeTime)
            $(subpage).fadeOut(fadeTime);
        }else{
            $('#subpageTitleContainer').fadeOut(fadeTime);

            if (subpage.getAttribute('data-subpagename') === page) {

                setTimeout(function(){
                    $('#subpageTitleContainer').html(selectorInnerHTML);
                    $(subpage).fadeIn(fadeTime);
                    $('#subpageTitleContainer').fadeIn(fadeTime);
                }, fadeTime)
            } else {
                $(subpage).fadeOut(fadeTime);
            }
        }
    });

}

function formatHomeHeader(){
    document.getElementById('headerElement').classList.remove('minify');
    document.getElementById('mainElement').classList.remove('minify');
}

function formatOtherHeader(){
    document.getElementById('headerElement').classList.add('minify');
    document.getElementById('mainElement').classList.add('minify');
}

window.onpopstate = function(event) {
    /**
     * Docstring TODO
     */
    if (event.state && event.state.page) {
        navigateTo(event.state.page);
    } else {
        navigateTo('home');
    }
};

window.onload = function() {
        /**
     * Docstring TODO
     */
    const initialPage = location.hash.replace('#', '') || 'home';
    navigateTo(initialPage);
};