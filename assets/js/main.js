/* Update copyright year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');

    // Animate burger
    burger.classList.toggle('toggle');

    // Check if nav is open
    const isOpen = nav.classList.contains('active');

    // Set aria-expanded attribute for accessibility
    burger.setAttribute('aria-expanded', isOpen);
  });
}

/* Close mobile nav when clicking outside */
document.addEventListener('click', (e) => {
  if (nav && !nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
    nav.classList.remove('active');
    burger.classList.remove('toggle');
    burger.setAttribute('aria-expanded', false);
  }
});

/* Close mobile nav when escape key is pressed */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
    nav.classList.remove('active');
    burger.classList.remove('toggle');
    burger.setAttribute('aria-expanded', false);
  }
});

/* Smooth scrolling for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});
