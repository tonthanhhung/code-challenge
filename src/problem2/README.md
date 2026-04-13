# Problem 2: Interactive Web Application

## 🚀 Live Demo

**[View Live Application →](https://tonthanhhung.github.io/code-challenge/currency-swap/)**

---

## 🌐 Deployment

This application is configured for automatic deployment to **GitHub Pages** with a custom subdirectory (`/currency-swap/`).

> ⚠️ **Important:** If you previously had a Gatsby site or other content on the `gh-pages` branch, you need to clear it first.

### First-Time Setup (Clear Existing gh-pages)

```bash
# Delete the existing gh-pages branch
npm run deploy:clean

# Or manually:
# git push origin --delete gh-pages
```

### Deploy to GitHub Pages

```bash
# Install dependencies (includes gh-pages package)
npm install

# Build and deploy to GitHub Pages (with subdirectory structure)
npm run deploy
```

The deploy script will:
1. Build the production app
2. Create a `deploy/currency-swap/` directory structure
3. Copy all build files to the subdirectory
4. Force deploy to the `gh-pages` branch (overwrites any existing content)

### GitHub Pages Settings

Ensure your repository settings are configured correctly:

1. Go to **Settings → Pages** in your GitHub repository
2. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` / `/(root)`
3. Click **Save**

Wait a few minutes for GitHub to build the site, then visit:
`https://tonthanhhung.github.io/code-challenge/currency-swap/`

---

### Manual Build

```bash
# Create production build
npm run build

# Preview locally
npm run preview
```

---

## 📋 Exercise Description

Build a **modern interactive web application** using **React**, **TypeScript**, and **Vite**.

This exercise demonstrates proficiency in:

- Frontend development with React
- Type-safe code with TypeScript
- Modern build tooling with Vite
- Code quality with ESLint

---

## ✅ Requirements

### Tech Stack

| Layer      | Technology    |
|------------|---------------|
| Framework  | React 19+     |
| Language   | TypeScript 5+ |
| Build Tool | Vite 6+       |
| Linting    | ESLint 9+     |

### Setup Requirements

1. Initialize a Vite project with React + TypeScript template
2. Configure ESLint for TypeScript and React
3. Set up proper TypeScript configurations (`tsconfig.json`)
4. Implement hot module replacement (HMR) for development

---

## 🎯 Learning Objectives

- Set up a modern React development environment
- Configure TypeScript for React projects
- Understand Vite's build optimization
- Implement ESLint rules for code quality
- Practice component-based architecture

---

## 📁 Project Structure

```
problem2/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
│   └── ...              # Additional components
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Development mode (with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📦 Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint for code quality              |

---

## 🔧 Configuration

### TypeScript

- `tsconfig.json` — Base configuration
- `tsconfig.app.json` — Application-specific settings
- `tsconfig.node.json` — Node/Build-specific settings

### ESLint

Recommended plugins for production:

- `eslint-plugin-react-x` — React-specific rules
- `eslint-plugin-react-dom` — React DOM rules
- `typescript-eslint` — Type-aware lint rules

### Vite

- Fast HMR (Hot Module Replacement)
- Optimized production builds
- Plugin ecosystem support

---

## 🖼️ Demo
![img.png](img.png)

## 📝 Notes

- The React Compiler is **not enabled** by default due to performance impact
- Use `@vitejs/plugin-react` or `@vitejs/plugin-react-swc` for React support
- Configure type-aware ESLint rules for production applications

---

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Configuration](https://eslint.org/docs/user-guide/getting-started)

---

*Part of 99Tech Interview Challenge — Problem 2*
