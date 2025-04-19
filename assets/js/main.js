/* Update copyright year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const burger = document.querySelector('.burger');
  
  nav.classList.toggle('active');
  burger.classList.toggle('toggle');
  
  console.log('Menu toggled');
}

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

/* Close mobile nav when escape key is pressed */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const nav = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    
    if (nav && burger && nav.classList.contains('active')) {
      nav.classList.remove('active');
      burger.classList.remove('toggle');
    }
  }
});

/* Close mobile menu when a link is clicked */
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-links li a');
  const nav = document.querySelector('.nav-links');
  const burger = document.querySelector('.burger');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav && burger) {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
      }
    });
  });

  /* Close mobile nav when clicking outside */
  document.addEventListener('click', (e) => {
    if (nav && burger && !nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('active')) {
      nav.classList.remove('active');
      burger.classList.remove('toggle');
    }
  });
});
