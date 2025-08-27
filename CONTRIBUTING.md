# Contributing to Who Am I? 🤝

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/yourusername/who-am-i/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/who-am-i/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/who-am-i.git
   cd who-am-i
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Set up Supabase**
   - Create a Supabase project
   - Run database migrations: `supabase db push`
   - Set up edge function secrets in Supabase dashboard

5. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Properly type your components and functions
- Use interfaces for object types
- Use enums for constants when appropriate

### React

- Use functional components with hooks
- Use custom hooks for shared logic
- Keep components small and focused
- Use proper prop types and default props

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use semantic color tokens from the design system
- Ensure responsive design

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

## Commit Messages

Follow conventional commit format:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add user profile analytics dashboard
fix: resolve payment processing timeout issue
docs: update API documentation for new endpoints
```

## Areas Where We Need Help

### High Priority
- UI/UX improvements and accessibility enhancements
- Performance optimizations
- Mobile responsiveness improvements
- Test coverage expansion

### Medium Priority
- Additional personality assessment categories
- Data visualization improvements
- New AI analysis features
- Internationalization (i18n)

### Documentation
- API documentation improvements
- User guide and tutorials
- Developer onboarding guides
- Code examples and demos

## Testing

Before submitting a PR, make sure to:

1. **Run linting**
   ```bash
   npm run lint
   ```

2. **Type check**
   ```bash
   npm run type-check
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test your changes manually**
   - Test the feature/fix you implemented
   - Test on different screen sizes
   - Test both light and dark themes

## Security

If you discover a security vulnerability, please follow our [Security Policy](SECURITY.md).

## Questions?

Don't hesitate to reach out! You can:

- Open an issue with the `question` label
- Join our discussions in GitHub Discussions
- Contact the maintainers directly

## Recognition

Contributors will be recognized in:
- The project's README
- Release notes for significant contributions
- GitHub contributor insights

Thank you for contributing to Who Am I?! 🎉