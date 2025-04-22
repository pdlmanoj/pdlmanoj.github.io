/**
 * Blog post system that loads and displays individual blog posts
 */

// DOM elements
const blogPostContainer = document.getElementById('blog-post');

// Function to get URL parameters
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Function to fetch blog post content
async function fetchBlogPost() {
  try {
    // Get the post ID from URL
    const postId = getUrlParameter('id');

    if (!postId) {
      throw new Error('No blog post ID specified');
    }

    // First, fetch the blog index to get the post metadata
    const indexResponse = await fetch('/blogs/index.json');
    if (!indexResponse.ok) throw new Error('Failed to load blog index');

    const indexData = await indexResponse.json();
    const post = indexData.posts.find(p => p.id === postId);

    if (!post) {
      throw new Error(`Blog post with ID "${postId}" not found`);
    }

    // Set the page title and meta description
    document.title = `${post.title} | Data Science Portfolio`;
    document.querySelector('meta[name="description"]').content = post.preview;

    // Fetch the actual markdown content
    const contentResponse = await fetch(`/blogs/${post.filename}`);
    if (!contentResponse.ok) throw new Error(`Failed to load blog post content from ${post.filename}`);

    const markdownContent = await contentResponse.text();

    // Format the date
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create tag elements
    const tagsHtml = post.tags ? post.tags.map(tag =>
      `<span class="blog-tag">${tag}</span>`
    ).join('') : '';

    // Configure marked.js to use highlight.js for code syntax highlighting
    marked.setOptions({
      highlight: function(code, lang) {
        // Normalize language name for bash/shell scripts
        if (lang === 'sh' || lang === 'shell' || lang === 'console') {
          lang = 'bash';
        }

        // If a language is specified and it's supported by highlight.js
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight.js error:', err);
          }
        }
        // Use automatic language detection if no language is specified
        try {
          return hljs.highlightAuto(code).value;
        } catch (err) {
          console.error('Highlight.js auto-detection error:', err);
        }
        // Return the original code if highlighting fails
        return code;
      },
      langPrefix: 'hljs language-' // Add the hljs class for better styling
    });

    // Parse markdown to HTML using marked.js
    const htmlContent = marked.parse(markdownContent);

    // Generate table of contents
    const { tocHtml, contentWithIds } = generateTableOfContents(htmlContent);

    // Update the blog post container
    blogPostContainer.innerHTML = `
      <div class="blog-post-header">
        <h1>${post.title}</h1>
        <div class="blog-meta">
          <span class="blog-date">
            <i class="far fa-calendar-alt"></i> ${formattedDate}
          </span>
          <div class="blog-tags">
            ${tagsHtml}
          </div>
        </div>
      </div>
      <div class="blog-post-content">
        ${contentWithIds}
      </div>
      <div id="comments" class="blog-comments">
        <div id="giscus-container" class="giscus-container"></div>
      </div>
    `;

    // Update the sidebar with TOC
    const sidebar = document.getElementById('blog-sidebar');
    if (tocHtml) {
      sidebar.innerHTML = `
        <div class="blog-toc" id="blog-toc">
          <div class="sidebar-title">Contents</div>
          <div class="toc-content">
            ${tocHtml}
          </div>
        </div>
      `;
    } else {
      sidebar.style.display = 'none';
    }

    // Get the comments section
    const commentsSection = document.getElementById('comments');
    const giscusContainer = document.getElementById('giscus-container');

    // Use Intersection Observer to lazy load Giscus only when scrolled into view
    const loadGiscusComments = () => {
      // Create the Giscus script with optimized settings
      const giscusScript = document.createElement('script');
      giscusScript.src = 'https://giscus.app/client.js';
      giscusScript.setAttribute('data-repo', 'pdlmanoj/pdlmanoj.github.io');
      giscusScript.setAttribute('data-repo-id', 'R_kgDOObQeYA'); // Replace with your actual repo ID
      giscusScript.setAttribute('data-category', 'Announcements');
      giscusScript.setAttribute('data-category-id', 'DIC_kwDOObQeYM4CpRvV'); // Replace with your actual category ID
      giscusScript.setAttribute('data-mapping', 'specific');
      giscusScript.setAttribute('data-term', `blog-${postId}`); // Use the post ID as a unique identifier
      giscusScript.setAttribute('data-strict', '0');

      // Enable reactions as requested
      giscusScript.setAttribute('data-reactions-enabled', '1'); // Enable reactions
      giscusScript.setAttribute('data-emit-metadata', '0');
      giscusScript.setAttribute('data-input-position', 'top');
      giscusScript.setAttribute('data-theme', 'light');
      giscusScript.setAttribute('data-lang', 'en');

      // Performance attributes
      giscusScript.setAttribute('data-loading', 'lazy');
      giscusScript.setAttribute('crossorigin', 'anonymous');
      giscusScript.async = true;
      giscusScript.defer = true; // Add defer for non-blocking loading

      // Add error handling
      giscusScript.onerror = () => {
        // Show error message if Giscus fails to load
        giscusContainer.innerHTML = `
          <div class="comments-error">
            <p>Unable to load comments. Please check your internet connection or try again later.</p>
            <button id="retry-comments" class="retry-btn">Retry</button>
          </div>
        `;

        // Add retry button functionality
        const retryBtn = document.getElementById('retry-comments');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            giscusContainer.innerHTML = ''; // Clear the container
            loadGiscusComments();
          });
        }
      };

      // Append the script to the giscus container
      giscusContainer.appendChild(giscusScript);
    };

    // No loading message, direct loading from Giscus
    giscusContainer.innerHTML = '';

    // Preload the Giscus script to speed up loading
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://giscus.app/client.js';
    preloadLink.as = 'script';
    document.head.appendChild(preloadLink);

    // Use Intersection Observer for optimized lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadGiscusComments();
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '200px', // Increased to 200px to load earlier
        threshold: 0.1 // Start loading when 10% of the element is visible
      });

      observer.observe(commentsSection);

      // Set a timeout to load comments anyway if they haven't loaded after 3 seconds
      // This helps on long pages where the user might not scroll to comments immediately
      setTimeout(() => {
        if (!giscusContainer.querySelector('iframe')) {
          loadGiscusComments();
          if (observer) {
            observer.disconnect();
          }
        }
      }, 3000);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      loadGiscusComments();
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    blogPostContainer.innerHTML = `
      <div class="error-message">
        <h1>Error Loading Blog Post</h1>
        <p>${error.message}</p>
        <a href="blog.html" class="cta-btn">Back to Blog List</a>
      </div>
    `;
    throw error; // Re-throw to allow promise chaining
  }
  return Promise.resolve(); // Return a resolved promise for chaining
}

// Function to generate table of contents from HTML content
function generateTableOfContents(htmlContent) {
  // Create a temporary div to parse the HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Find all headings (h2, h3, h4, etc.)
  const headings = tempDiv.querySelectorAll('h2, h3, h4, h5, h6');

  // If no headings found, return empty TOC
  if (headings.length === 0) {
    return { tocHtml: '', contentWithIds: htmlContent };
  }

  // Create a map to track which headings have children
  const headingChildren = {};
  let lastLevelHeadings = {};

  // First pass: identify parent-child relationships
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const headingId = heading.id || `heading-${index}-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // Set this heading as a child of the nearest higher-level heading
    for (let i = level - 1; i >= 2; i--) {
      if (lastLevelHeadings[i]) {
        if (!headingChildren[lastLevelHeadings[i]]) {
          headingChildren[lastLevelHeadings[i]] = [];
        }
        headingChildren[lastLevelHeadings[i]].push(headingId);
        break;
      }
    }

    // Update the last heading we've seen at this level
    lastLevelHeadings[level] = headingId;
  });

  // Create TOC structure
  let tocHtml = '<ul class="toc-list">';
  let lastLevel = 2; // Start with h2 as the top level
  let openLists = 0;

  // Process each heading
  headings.forEach((heading, index) => {
    // Get heading level (2 for h2, 3 for h3, etc.)
    const level = parseInt(heading.tagName.substring(1));

    // Create an ID for the heading if it doesn't have one
    const headingText = heading.textContent;
    const headingId = heading.id || `heading-${index}-${headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    heading.id = headingId;

    // Handle nesting based on heading level
    if (level > lastLevel) {
      // Open a new nested list for each level increase
      const levelsToAdd = level - lastLevel;
      for (let i = 0; i < levelsToAdd; i++) {
        tocHtml += '<ul class="toc-sublist">';
        openLists++;
      }
    } else if (level < lastLevel) {
      // Close lists when going back up the hierarchy
      const levelsToRemove = lastLevel - level;
      for (let i = 0; i < levelsToRemove && openLists > 0; i++) {
        tocHtml += '</ul>';
        openLists--;
      }
    }

    // Add the TOC entry with has-children class if applicable
    const hasChildren = headingChildren[headingId] && headingChildren[headingId].length > 0;
    const hasChildrenClass = hasChildren ? 'has-children' : '';
    tocHtml += `<li class="toc-item toc-level-${level}"><a href="#${headingId}" class="toc-link ${hasChildrenClass}">${headingText}</a></li>`;

    lastLevel = level;
  });

  // Close any remaining open lists
  for (let i = 0; i < openLists; i++) {
    tocHtml += '</ul>';
  }

  tocHtml += '</ul>';

  // Return the TOC HTML and the content with IDs added to headings
  return {
    tocHtml,
    contentWithIds: tempDiv.innerHTML
  };
}

// Function to setup TOC functionality with active state highlighting and subsection expansion
function setupTocHighlighting() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('.blog-post-content h2, .blog-post-content h3, .blog-post-content h4, .blog-post-content h5, .blog-post-content h6');
  const tocSublists = document.querySelectorAll('.toc-sublist');
  const sidebar = document.getElementById('blog-sidebar');

  if (!tocLinks.length || !headings.length) return;

  // Create a map of heading levels and their parent-child relationships
  const headingMap = [];
  let lastHeadingByLevel = {};

  // Process headings to build a hierarchy
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    const headingInfo = {
      id: heading.id,
      top: heading.offsetTop - 100, // Offset to trigger slightly before the heading
      element: heading,
      level: level,
      children: [],
      parent: null
    };

    // Set parent-child relationships
    for (let i = level - 1; i >= 2; i--) {
      if (lastHeadingByLevel[i]) {
        headingInfo.parent = lastHeadingByLevel[i];
        lastHeadingByLevel[i].children.push(headingInfo);
        break;
      }
    }

    headingMap.push(headingInfo);
    lastHeadingByLevel[level] = headingInfo;
  });

  // Function to find the current active heading based on scroll position
  function findActiveHeading() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const middleOfScreen = scrollPosition + (windowHeight / 3); // Focus on the top third of the screen

    // First try to find a heading near the middle of the screen
    for (let i = 0; i < headingMap.length; i++) {
      const heading = headingMap[i];
      const headingTop = heading.top;
      const nextHeadingTop = (i < headingMap.length - 1) ? headingMap[i + 1].top : Infinity;

      if (middleOfScreen >= headingTop && middleOfScreen < nextHeadingTop) {
        return heading;
      }
    }

    // If no heading is in the middle, find the last heading above the current scroll position
    for (let i = headingMap.length - 1; i >= 0; i--) {
      if (scrollPosition >= headingMap[i].top) {
        return headingMap[i];
      }
    }

    // If no heading is found, return the first one
    return headingMap.length > 0 ? headingMap[0] : null;
  }

  // Function to expand all parent sublists of an element
  function expandParentSublists(element) {
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains('toc-sublist')) {
        parent.classList.add('expanded');
      }
      parent = parent.parentElement;
    }
  }

  // Function to expand child sublists of an active heading
  function expandChildSublists(activeHeadingInfo) {
    if (!activeHeadingInfo || !activeHeadingInfo.children.length) return;

    // Find all direct child sublists of the active heading
    activeHeadingInfo.children.forEach(childInfo => {
      const childLink = document.querySelector(`.toc-link[href="#${childInfo.id}"]`);
      if (childLink) {
        const parentLi = childLink.closest('li');
        if (parentLi) {
          const childSublist = parentLi.querySelector('.toc-sublist');
          if (childSublist) {
            childSublist.classList.add('expanded');
          }
        }
      }
    });
  }

  // Function to update active TOC link and expand/collapse sublists
  function updateActiveTocLink() {
    const activeHeadingInfo = findActiveHeading();
    if (!activeHeadingInfo) return;

    // Remove active class from all links
    tocLinks.forEach(link => link.classList.remove('active'));

    // Find the corresponding TOC link and add active class
    const activeLink = document.querySelector(`.toc-link[href="#${activeHeadingInfo.id}"]`);
    if (activeLink) {
      activeLink.classList.add('active');

      // Make sure the active link is visible in the sidebar, but only on desktop
      if (sidebar && window.innerWidth > 768) {
        const linkRect = activeLink.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();

        if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
          activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      // First collapse all sublists
      tocSublists.forEach(sublist => {
        sublist.classList.remove('expanded');
      });

      // Then expand parent sublists of the active link
      expandParentSublists(activeLink);

      // Also expand immediate child sublists of the active heading
      expandChildSublists(activeHeadingInfo);
    }
  }

  // Add smooth scrolling and click behavior to TOC links
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to the target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust offset as needed
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, `#${targetId}`);

        // Update active state immediately
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Find the heading info for this link
        const headingInfo = headingMap.find(h => h.id === targetId);
        if (headingInfo) {
          // Expand parent sublists
          expandParentSublists(link);

          // Expand child sublists
          expandChildSublists(headingInfo);
        }
      }
    });
  });

  // Use throttled scroll event for better performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    // Skip on mobile to prevent scroll issues
    if (window.innerWidth <= 768) return;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveTocLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Also update on window resize as heading positions may change
  window.addEventListener('resize', () => {
    // Recalculate heading positions
    headingMap.forEach(heading => {
      heading.top = heading.element.offsetTop - 100;
    });
    updateActiveTocLink();
  }, { passive: true });

  // Initial update
  updateActiveTocLink();
}

// Initialize blog post
document.addEventListener('DOMContentLoaded', () => {
  fetchBlogPost().then(() => {
    // Set up TOC highlighting after content is loaded
    setTimeout(() => {
      setupTocHighlighting();
    }, 100); // Small delay to ensure DOM is fully updated
  });

  // Initialize highlight.js if it hasn't been done by marked.js
  setTimeout(() => {
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('pre code').forEach((block) => {
        // Check if this is a bash code block that needs highlighting
        const isBashBlock = block.className.includes('language-bash') ||
                           block.className.includes('language-sh') ||
                           block.className.includes('language-shell') ||
                           block.className.includes('language-console');

        // Apply highlighting if needed
        if (!block.classList.contains('hljs') || isBashBlock) {
          // For bash blocks, explicitly set the language
          if (isBashBlock) {
            block.className = 'language-bash';
          }
          hljs.highlightElement(block);
        }

        // Add copy button to each code block
        const pre = block.parentNode;
        if (pre && pre.tagName === 'PRE' && !pre.querySelector('.copy-code-button')) {
          const button = document.createElement('button');
          button.className = 'copy-code-button';
          button.innerHTML = '<i class="fas fa-copy"></i>';

          button.addEventListener('click', () => {
            // Copy the code to clipboard
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
              // Visual feedback
              button.innerHTML = '<i class="fas fa-check"></i>';
              button.classList.add('copied');

              // Reset after 2 seconds
              setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.classList.remove('copied');
              }, 2000);
            }).catch(err => {
              console.error('Failed to copy code: ', err);
              button.innerHTML = '<i class="fas fa-times"></i>';
              button.classList.add('error');

              // Reset after 2 seconds
              setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.classList.remove('error');
              }, 2000);
            });
          });

           pre.appendChild(button);
        }
      });
    }
  }, 500); // Small delay to ensure content is loaded
});
