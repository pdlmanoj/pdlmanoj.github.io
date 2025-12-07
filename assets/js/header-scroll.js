document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    const masthead = document.querySelector(".masthead");

    if (!masthead) return;

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop < 0) scrollTop = 0; // Prevent negative scroll (iOS bounce)

        // Threshold of 10px to avoid jitter
        if (Math.abs(lastScrollTop - scrollTop) <= 10) return;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // Scroll Down > Hide
            masthead.classList.add("scroll-hide");
            document.body.classList.add("header-hidden"); // Add hook for TOC
        } else {
            // Scroll Up > Show
            masthead.classList.remove("scroll-hide");
            document.body.classList.remove("header-hidden"); // Remove hook
        }

        lastScrollTop = scrollTop;
    }, { passive: true });
});
