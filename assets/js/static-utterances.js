/**
 * Static fallback for Utterances comments
 * This will show a static comments section if the dynamic one fails to load
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for 5 seconds to see if the dynamic comments load
  setTimeout(function() {
    // Check if the dynamic comments have loaded
    const dynamicComments = document.querySelector('.utterances');
    const staticComments = document.getElementById('static-comments');

    // If dynamic comments haven't loaded, show the static fallback
    if (!dynamicComments && staticComments) {
      console.log('Dynamic comments not detected, showing static fallback');

      // Show the static comments section
      staticComments.style.display = 'block';

      // Get the post ID from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('id');

      if (postId) {
        console.log('Creating Utterances script with post ID:', postId);

        // Create the script element with the correct post ID
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'pdlmanoj/pdlmanoj.github.io');
        script.setAttribute('issue-term', `blogpost-${postId}`);
        script.setAttribute('theme', 'github-light');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;

        // Replace the placeholder with the script
        const container = document.getElementById('static-utterances-container');
        if (container) {
          container.innerHTML = '';
          container.appendChild(script);
          console.log('Static Utterances script added with post ID');
        }
      } else {
        console.error('No post ID found in URL');
      }
    }
  }, 5000);
});
