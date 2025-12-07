document.addEventListener("DOMContentLoaded", function () {
    const tocContainer = document.getElementById("toc");
    const postContent = document.querySelector(".post-content");

    if (!tocContainer || !postContent) return;

    // Changed selector to h1, h2 per user request
    const headings = postContent.querySelectorAll("h1, h2");
    if (headings.length === 0) return;

    const tocList = document.createElement("ul");
    tocList.className = "toc-list";

    headings.forEach((heading, index) => {
        // Ensure id exists
        const id = heading.id || `heading-${index}`;
        heading.id = id;

        const listItem = document.createElement("li");
        // Add specific class for h1 vs h2 indenting
        listItem.className = `toc-item toc-item-${heading.tagName.toLowerCase()}`;

        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.className = "toc-link";

        // Smooth scroll
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
            history.pushState(null, null, link.getAttribute("href"));
        });

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    tocContainer.appendChild(tocList);

    // Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                document.querySelectorAll(".toc-link").forEach((link) => {
                    link.classList.remove("active");
                });

                const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");

                    // Auto-scroll the TOC container to keep active link in view
                    const tocWrapper = document.querySelector(".toc-wrapper");
                    if (tocWrapper) {
                        const linkRect = activeLink.getBoundingClientRect();
                        const wrapperRect = tocWrapper.getBoundingClientRect();

                        // Check if link is out of view
                        if (linkRect.top < wrapperRect.top || linkRect.bottom > wrapperRect.bottom) {
                            activeLink.scrollIntoView({ block: "center", behavior: "smooth" });
                        }
                    }
                }
            }
        });
    }, observerOptions);

    headings.forEach((heading) => {
        observer.observe(heading);
    });
});
