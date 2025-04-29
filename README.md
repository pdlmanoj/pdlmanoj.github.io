# Personal Blog

This is my personal blog built with Jekyll and the Minimal Mistakes theme. Visit the live site at [https://pdlmanoj.com.np](https://pdlmanoj.com.np).

## Features

- Responsive design using Minimal Mistakes theme
- Category and tag-based content organization
- Comments system using Giscus
- Social media integration

## For Local Development

### Prerequisites
- 1. Docker and Docker Compose
- 2. Alternatively: Ruby, Bundler, and Jekyll

### Running Locally

Clone the repository:
```shell
git clone https://github.com/pdlmanoj/pdlmanoj.github.io.git
```

#### Option 1: Using Docker
Start the development server:
```shell
docker-compose up
```

#### Option 2: Using Ruby/Jekyll
Install dependencies:
```shell
bundle install
```

Start the development server:
```shell
bundle exec jekyll serve --incremental --future

# OR for live (autoreload)
bundle exec jekyll serve --livereload
```

Visit [http://localhost:4000](http://localhost:4000) to preview the site.

## To add new blog content
Create new blog posts in the `_posts` directory using the format:
```
YYYY-MM-DD-title-of-post.md
```

## License

The source code for this blog is under MIT License. Content is copyrighted.

## Contact

If you have any questions, you can [email me](mailto:mpsandip12@gmail.com).
