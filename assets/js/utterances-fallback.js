/**
 * Fallback implementation for Utterances comments
 * This provides a direct implementation that doesn't rely on dynamic loading
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for the blog post to load (give it 3 seconds)
  setTimeout(function() {
    const container = document.getElementById('utterances-container');

    if (container && !document.querySelector('.utterances')) {
      console.log('Using fallback Utterances implementation');

      // Clear any loading message
      container.innerHTML = '';

      // Create the script element directly
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', 'pdlmanoj/pdlmanoj.github.io');
      // Get the post ID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('id');

      if (postId) {
        script.setAttribute('issue-term', `blogpost-${postId}`);
      } else {
        console.error('No post ID found in URL, falling back to pathname');
        script.setAttribute('issue-term', 'pathname');
      }
      script.setAttribute('theme', 'github-light');
      script.setAttribute('crossorigin', 'anonymous');
      script.async = true;

      // Append to container
      container.appendChild(script);

      console.log('Fallback Utterances script added to page');
    }
  }, 3000);
});
