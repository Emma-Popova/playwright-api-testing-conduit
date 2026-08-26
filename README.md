# Playwright API Testing - Conduit

Educational API testing project created as part of a Udemy course.

## Overview

This project demonstrates API testing and API-related browser automation using Playwright with TypeScript against the Conduit application.

The project focuses on working with REST APIs, authentication, CRUD operations, response validation, and API mocking.

## Technologies

- Playwright
- TypeScript
- JavaScript
- Node.js
- REST API
- Git
- GitHub
- GitHub Actions

## What is covered

- API requests with Playwright
- User authentication
- Creating articles
- Deleting articles
- Response status validation
- Working with API response data
- API mocking with `page.route()`
- Test data management
- Environment variables with `.env`
- Cross-browser testing
- Automated test execution with GitHub Actions

## Project structure

```text
tests/          # Playwright tests
test-data/      # Test data
.env.example    # Example environment variables
playwright.config.ts
```

## Environment Variables

Sensitive test credentials are stored locally in `.env` and are not committed to the repository.

Use `.env.example` as a template:

```text
TEST_EMAIL=your-test-email
TEST_PASSWORD=your-test-password
TEST_USERNAME=your-test-username
```

## Running the tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npx playwright test
```

Run tests in UI mode:

```bash
npx playwright test --ui
```

Run tests in a specific browser:

```bash
npx playwright test --project=chromium
```

## CI

The project uses GitHub Actions to automatically execute Playwright tests on pushes and pull requests.

## Disclaimer

This is an educational project created for learning and practicing QA Automation and API testing with Playwright.