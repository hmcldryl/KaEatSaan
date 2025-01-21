# Contributing to KaEatSaan

Salamat for considering contributing to KaEatSaan! Your help in making this app better is greatly appreciated.

## Quick Guide

1. Check Issues tab for existing bugs/features
2. Fork the repo
3. Create your feature branch (`git checkout -b feature/malupet-na-feature`)
4. Commit your changes (`git commit -m 'feat: add some malupet na feature'`)
5. Push to your branch (`git push origin feature/malupet-na-feature`)
6. Open a Pull Request

## Development Setup

### Install required tools

- Flutter SDK (latest stable version)
- Dart SDK
- Android Studio / VS Code
- iOS development tools (for Mac users)

### Clone your fork
    git clone https://github.com/hmcldryl/KaEatSaan.git
### Navigate to project
    cd KaEatSaan
### Install dependencies
    flutter pub get
    
### Run the app
    flutter run

## Development Process

- We use `main` branch for production releases
- `develop` branch for development
- Create feature branches from `develop`
- Submit PRs back to `develop`

## Branch Naming

-  `feature/*` - New features
-  `bugfix/*` - Bug fixes
-  `hotfix/*` - Critical production fixes
-  `release/*` - Release preparation
-  `docs/*` - Documentation updates

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) spec:

    <type>: <description>
    [optional body]
    [optional footer]

## Types:

-  `feat`: New feature
-  `fix`: Bug fix
-  `docs`: Documentation
-  `style`: Formatting
-  `refactor`: Code restructuring
-  `test`: Tests
-  `chore`: Maintenance

Example:

    feat: add restaurant price filter
    - Add price range component
    - Implement filter logic
    - Update tests

## Pull Request Process

1. Follow the PR template
2. Reference any relevant issues
3. Add appropriate labels
4. Update documentation
5. Add/update tests
6. Get approval from maintainers

## Code Style

- Use Dart
- Follow ESLint rules
- Run `npm run lint` before committing
- Write clear comments
- Keep functions small and focused

## Testing

- Write unit tests for new features
- Maintain test coverage
- Run `npm test` locally
- Fix any failing tests

## Documentation

Update these when making changes:
- README.md
- Code comments

## Need Help?

- Check our [documentation](#)
- Ask in GitHub Discussions
- Join our [Discord](#) server
- Email: daryl.homecillo@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.