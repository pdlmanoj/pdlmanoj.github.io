/**
 * Blog system that parses and displays blog posts from markdown files
 */

// Blog data structure
let blogPosts = [];
let filteredPosts = [];

// DOM elements
const blogList = document.getElementById('blog-list');
const searchInput = document.getElementById('blog-search');
const searchBtn = document.getElementById('search-btn');

// Function to fetch all blog posts
async function fetchBlogPosts() {
  try {
    // Fetch the blog index
    const response = await fetch('/blogs/index.json');
    if (!response.ok) throw new Error('Failed to load blog index');

    const data = await response.json();
    blogPosts = data.posts;

    // Sort blog posts by date (newest first)
    blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredPosts = [...blogPosts];

    // Display all blog posts
    displayBlogPosts(filteredPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogList.innerHTML = `
      <div class="error-message">
        <p>Could not load blog posts. Please try again later.</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;
  }
}

// Function to display blog posts
function displayBlogPosts(posts) {
  if (posts.length === 0) {
    blogList.innerHTML = '<div class="no-results">No blog posts found matching your search.</div>';
    return;
  }

  // Clear the blog list
  blogList.innerHTML = '';

  // Loop through posts and create cards
  posts.forEach(post => {
    const postElement = document.createElement('article');
    postElement.className = 'blog-card';

    // Format date
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

    // Add post content
    postElement.innerHTML = `
      <h2 class="blog-title">
        <a href="blog-post.html?id=${post.id}">${post.title}</a>
      </h2>
      <div class="blog-meta">
        <span class="blog-date">
          <i class="far fa-calendar-alt"></i> ${formattedDate}
        </span>
        <div class="blog-tags">
          ${tagsHtml}
        </div>
      </div>
      <div class="blog-preview">
        ${post.preview}
      </div>
      <a href="blog-post.html?id=${post.id}" class="read-more">
        Read More <i class="fas fa-arrow-right"></i>
      </a>
    `;

    blogList.appendChild(postElement);
  });
}

// Function to filter blog posts
function filterBlogPosts(query) {
  query = query.toLowerCase().trim();

  if (!query) {
    filteredPosts = [...blogPosts];
  } else {
    filteredPosts = blogPosts.filter(post => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.preview.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });

    // No need to sort again as the original blogPosts array is already sorted
    // and we're filtering from that sorted array
  }

  displayBlogPosts(filteredPosts);
}

// Add event listener for search input
if (searchInput && searchBtn) {
  searchBtn.addEventListener('click', () => {
    filterBlogPosts(searchInput.value);
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      filterBlogPosts(searchInput.value);
    }
  });
}

// Initialize blog system
document.addEventListener('DOMContentLoaded', fetchBlogPosts);
