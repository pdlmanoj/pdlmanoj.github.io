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
    `;
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
