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

    // Parse markdown to HTML using marked.js
    const htmlContent = marked.parse(markdownContent);

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
        ${htmlContent}
      </div>
      <div id="comments" class="blog-comments">
        <h2>Comments</h2>
        <div id="giscus-container" class="giscus-container"></div>
      </div>
    `;

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
  }
}

// Initialize blog post
document.addEventListener('DOMContentLoaded', fetchBlogPost);
