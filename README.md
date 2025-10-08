# NuxtJS Anime Project 🚀

A modern anime database application built with **Nuxt 4** - the latest version of the intuitive Vue framework.

## ⚡ Nuxt 4 Features

This project leverages the cutting-edge features of Nuxt 4:

- **🎯 Better Performance**: Improved bundling and optimization
- **🔥 Enhanced Developer Experience**: Faster HMR and better TypeScript support
- **📱 Full-Stack Capabilities**: Built-in server-side rendering and API routes
- **🎨 Modern Styling**: Integrated with Tailwind CSS and Sass
- **🗄️ Database Integration**: Prisma ORM for robust data management
- **🖼️ Image Optimization**: Built-in `@nuxt/image` for optimal performance
- **🎭 Icon System**: Complete icon library with `@nuxt/icon`
- **🎪 UI Components**: Modern UI kit with `@nuxt/ui`

Look at the [Nuxt 4 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more about the latest features.

## 🛠️ Prerequisites

- **Node.js** 18.0.0 or newer
- **Package manager**: npm, pnpm, yarn, or bun

## 📦 Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm (recommended for Nuxt 4)
pnpm install

# yarn
yarn install

# bun
bun install
```

### 🗄️ Database Setup

This project uses Prisma with SQLite. Initialize the database:

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with initial data
npm run db:seed
```

## 🚀 Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm (recommended for Nuxt 4)
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### 🔧 Additional Development Commands

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Run database migrations
npm run db:migrate

# Check migration status
npm run db:status

# Reset database (caution: this will delete all data)
npm run db:reset
```

## 🏗️ Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

### 🔍 Preview Production Build

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

### 📦 Deployment

For production deployment:

```bash
# Deploy database migrations
npm run db:deploy

# Start production server
npm start
```

Check out the [Nuxt 4 deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 🎨 Project Structure

```
📁 components/          # Vue components organized by feature
📁 composables/         # Vue composables for reusable logic
📁 layouts/            # App layouts
📁 pages/              # File-based routing pages
📁 server/             # Server-side API routes
📁 prisma/             # Database schema and migrations
📁 assets/             # Static assets (CSS, SCSS, images)
📁 modules/            # Feature modules (anime, blog, forum)
```

## 🚀 What's New in Nuxt 4

- **Improved Performance**: Faster builds and better optimization
- **Enhanced TypeScript**: Better type inference and IntelliSense
- **Modern Vue**: Built on Vue 3.5+ with latest features
- **Better DevTools**: Enhanced debugging and development experience
- **Optimized Bundling**: Smarter code splitting and tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
