document.addEventListener("DOMContentLoaded", function () {
    const tocContainer = document.getElementById("toc");
    const postContent = document.querySelector(".post-content");

    if (!tocContainer || !postContent) return;

    // Scan H2 and H3 (Main Headings and Subheadings) per user intent
    const headings = postContent.querySelectorAll("h2, h3");
    if (headings.length === 0) return;

    const tocList = document.createElement("ul");
    tocList.className = "toc-list";

    // Stack to track nested lists. 
    // We initialize with a "virtual" level 1 root to nicely accept H2s as top-level items.
    // Structure: [{ level: 1, element: tocList }]
    const stack = [{ level: 1, element: tocList }];

    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;

        // Use strict integer levels: H2=2, H3=3
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent;

        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = text;
        link.className = "toc-link";

        // Smooth scroll
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(link.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
            history.pushState(null, null, link.getAttribute("href"));
        });

        const listItem = document.createElement("li");
        listItem.className = `toc-item toc-item-${heading.tagName.toLowerCase()}`;
        listItem.appendChild(link);

        // 1. Pop stack if we are moving back up (e.g., H3 -> H2)
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        // 2. Logic to nest H3 under H2
        if (level === 2) {
            // Treat as root item (Top level in this TOC)
            while (stack.length > 1) stack.pop(); // Reset to root
            stack[0].element.appendChild(listItem);

            // Push this H2's context onto the stack.
            stack.push({ level: 2, element: null, lastItem: listItem });
        } else if (level === 3) {
            // Treat as child of H2
            // Ensure we have an H2 context (stack top is level 2)
            if (stack.length > 1 && stack[stack.length - 1].level === 2) {
                const h2Context = stack[stack.length - 1];
                let ul = h2Context.element;
                if (!ul) {
                    // Create sublist lazily
                    ul = document.createElement("ul");
                    ul.className = "toc-sublist";
                    h2Context.lastItem.appendChild(ul);
                    h2Context.element = ul;
                }
                ul.appendChild(listItem);
            } else {
                // Orphan H3, append to root
                stack[0].element.appendChild(listItem);
            }
        } else {
            // Fallback
            stack[0].element.appendChild(listItem);
        }
    });

    tocContainer.appendChild(tocList);

    // Observer Logic for Collapsing/Expanding
    const observerOptions = {
        root: null,
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 1. Remove Active from ALL links
                document.querySelectorAll(".toc-link").forEach((link) => {
                    link.classList.remove("active");
                });
                // Remove Open/Active classes from all items
                document.querySelectorAll(".toc-item").forEach((item) => {
                    item.classList.remove("active-item");
                    item.classList.remove("open-parent");
                });

                // 2. Find current active link
                const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add("active");

                    // 3. Highlight the parent LI
                    const listItem = activeLink.closest("li");
                    if (listItem) {
                        listItem.classList.add("active-item");

                        // 4. Traverse UP to keep parents open
                        let parent = listItem.parentElement; // ul
                        while (parent) {
                            if (parent.classList.contains("toc-sublist")) {
                                const parentItem = parent.closest("li");
                                if (parentItem) {
                                    parentItem.classList.add("open-parent");
                                }
                            }
                            parent = parent.parentElement ? parent.parentElement.closest("ul") : null;
                        }
                    }

                    // Auto-scroll logic
                    const tocWrapper = document.querySelector(".toc-wrapper");
                    if (tocWrapper) {
                        const linkRect = activeLink.getBoundingClientRect();
                        const wrapperRect = tocWrapper.getBoundingClientRect();
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
