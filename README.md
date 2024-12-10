# Express & Next.js Full-Stack Boilerplate with tRPC, Prisma, and PostgreSQL

A modern, production-ready full-stack boilerplate built with Next.js 15+, tRPC, Prisma, PostgreSQL, and Express.js. This template provides everything you need to start building your application with best practices and a powerful tech stack.

## 🚀 Features

- ⚡ **Full-Stack Type Safety** with tRPC
- 📚 **Database** with PostgreSQL and Prisma ORM
- 🔄 **State Management** with React Query
- 🌐 **API Routes** with Express.js integration
- 🐳 **Docker** for containerization
- 🛠️ **Debugging** with VSCode

## 🛠️ Tech Stack

- **Frontend:**

  - Next.js 15+
  - React 19
  - Tailwind CSS
  - React Query
  - TypeScript

- **Backend:**

  - tRPC
  - Express.js
  - Prisma ORM
  - PostgreSQL

- **DevOps & Tools:**
  - Docker
  - ESLint
  - Prettier

## 🚀 Quick Start

1. Clone the repository:

```bash
git clone https://github.com/hcikikci/express-next-trpc-boilerplate
```

2. Start the backend services with Docker:

```bash
cd express-next-trpc-boilerplate
cd backend
npm install
cd ..
docker-compose up -d
cd backend
npm run migrate
```

This will set up PostgreSQL, Redis, and the backend service with all the necessary environment configurations.

3. Set up the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`, and the backend API will be running at `http://localhost:4000`.

## 🔧 Development

- Backend development is done through Docker, with hot-reload enabled
- Frontend development runs locally for the best development experience
- Database migrations can be run using:
  ```bash
  npm run migrate
  ```

## 📚 Documentation

For detailed documentation, please visit our [Wiki](link-to-wiki).

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](link-to-contributing) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💫 Support

If you like this project, please give it a ⭐️ on GitHub!
