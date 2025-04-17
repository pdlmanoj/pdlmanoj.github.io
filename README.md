# Portfolio Website

A simple, clean, and responsive portfolio website for showcasing your data science projects and sharing blog posts. This website is designed to be easy to maintain, even for beginners.

## Features

- Responsive design that works well on desktop, tablet, and mobile devices
- Home page with profile information and social links
- Projects page that loads project information from a JSON file
- Blog system that displays posts written in Markdown format
- Blog search functionality to find posts by title or keywords
- Easy to update without coding knowledge

## Setup Instructions

### 1. Fork or Clone This Repository

First, fork this repository to your GitHub account or clone it locally.

### 2. Personalize Your Website

#### Update Profile Information

Edit the following files to personalize your portfolio:

- **index.html**: Update your name, tagline, and social media links
- **blog.html**: Update the page title if needed
- **projects.html**: Update the page title if needed

#### Add Your Profile Picture

Replace the placeholder image at `assets/images/profile-image.jpg` with your own profile picture. Make sure to keep the same filename or update it in `index.html`.

### 3. Add Your Projects

Edit the `projects.json` file to add your own projects:

```json
{
  "projects": [
    {
      "id": "unique-project-id",
      "title": "Your Project Title",
      "description": "A brief description of your project.",
      "githubUrl": "https://github.com/yourusername/your-project",
      "liveUrl": "https://your-live-demo-url.com"
    },
    // Add more projects...
  ]
}
```

### 4. Add Blog Posts

#### Create a New Blog Post

1. Create a new Markdown file in the `blogs` folder (e.g., `my-new-post.md`)
2. Write your blog post in Markdown format
3. Add your post to the blog index file

#### Update the Blog Index

Edit the `blogs/index.json` file to include your new blog post:

```json
{
  "posts": [
    {
      "id": "unique-post-id",
      "title": "Your Blog Post Title",
      "date": "YYYY-MM-DD",
      "filename": "my-new-post.md",
      "preview": "A brief preview or summary of your blog post.",
      "tags": ["Tag1", "Tag2", "Tag3"]
    },
    // Add more posts...
  ]
}
```


## Markdown Guide for Blog Posts

When writing your blog posts in Markdown, you can use the following syntax:

```markdown
# Main Title

## Subheading

### Smaller Heading

Regular paragraph text goes here.

**Bold text** and *italic text*.

[Link text](https://www.example.com)

![Image alt text](image-url.jpg)

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

> This is a blockquote

```code
This is a code block
```
```

