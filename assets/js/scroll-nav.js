/**
 * Scroll-aware navigation bar
 * Hides the navbar when scrolling down
 * Shows the navbar when scrolling up
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the navbar element
  const navbar = document.querySelector('.navbar');

  // Exit if navbar doesn't exist
  if (!navbar) {
    console.error('Navbar not found');
    return;
  }

  console.log('Scroll-aware navbar initialized');

  // Variables to track scroll position and direction
  let prevScrollPos = window.pageYOffset;

  // Function to handle scroll events
  function handleScroll() {
    const currentScrollPos = window.pageYOffset;

    // Check if at the top of the page (increased threshold to 50px)
    if (currentScrollPos <= 50) {
      navbar.classList.remove('navbar-hidden');
      navbar.classList.add('navbar-visible');
    }
    // Check if at the bottom of the page
    else if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 10) {
      navbar.classList.remove('navbar-hidden');
      navbar.classList.add('navbar-visible');
    }
    // Otherwise, determine scroll direction
    else if (prevScrollPos > currentScrollPos) {
      // Scrolling UP - show navbar
      navbar.classList.remove('navbar-hidden');
      navbar.classList.add('navbar-visible');
    } else {
      // Scrolling DOWN - hide navbar
      navbar.classList.remove('navbar-visible');
      navbar.classList.add('navbar-hidden');
    }

    // Update previous scroll position
    prevScrollPos = currentScrollPos;
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Initialize navbar as visible
  navbar.classList.remove('navbar-hidden');
  navbar.classList.add('navbar-visible');

  // Run initial check to ensure navbar is visible at the top
  handleScroll();
});
