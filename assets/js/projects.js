/**
 * Projects system that loads and displays projects from a JSON file
 */

// DOM elements
const projectsGrid = document.getElementById('projects-grid');

// Function to fetch projects
async function fetchProjects() {
  try {
    // Fetch the projects data file
    const response = await fetch('/projects.json');
    if (!response.ok) throw new Error('Failed to load projects data');

    const data = await response.json();
    displayProjects(data.projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    projectsGrid.innerHTML = `
      <div class="error-message">
        <p>Could not load projects. Please try again later.</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;
  }
}

// Function to display projects
function displayProjects(projects) {
  if (!projects || projects.length === 0) {
    projectsGrid.innerHTML = '<div class="no-results">No projects found.</div>';
    return;
  }

  // Clear the projects grid
  projectsGrid.innerHTML = '';

  // Loop through projects and create cards
  projects.forEach(project => {
    const projectElement = document.createElement('article');
    projectElement.className = 'project-card';

    // Prepare link elements
    let linksHtml = '';

    if (project.githubUrl) {
      linksHtml += `
        <a href="${project.githubUrl}" target="_blank" rel="noopener" class="project-link">
          <i class="fab fa-github"></i> GitHub
        </a>
      `;
    }

    if (project.liveUrl) {
      linksHtml += `
        <a href="${project.liveUrl}" target="_blank" rel="noopener" class="project-link">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>
      `;
    }

    // Add project content
    projectElement.innerHTML = `
      <h2 class="project-title">${project.title}</h2>
      <div class="project-description">
        <p>${project.description}</p>
      </div>
      <div class="project-links">
        ${linksHtml}
      </div>
    `;

    projectsGrid.appendChild(projectElement);
  });
}

// Initialize projects system
document.addEventListener('DOMContentLoaded', fetchProjects);
