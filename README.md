# Bakery ERP Monorepo

Enterprise-grade Bakery Management System built with NestJS, React, and PostgreSQL.

## Architecture

- **Monorepo**: Managed with pnpm workspaces and Turborepo
- **Backend**: NestJS modular monolith (microservices-ready)
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis
- **Containerization**: Docker + Kubernetes

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Start Docker services (PostgreSQL, Redis)
pnpm docker:up

# Run database migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

## Project Structure

```
bakery-erp-monorepo/
├── apps/
│   ├── api-gateway/      # NestJS Backend
│   ├── web-client/       # React Frontend
│   └── worker-service/   # Background jobs
├── packages/             # Shared libraries
├── infra/                # Docker, K8s, Terraform
└── scripts/              # Build and deployment scripts
```

## API Documentation

Once running, access Swagger docs at: http://localhost:4000/docs

## Default Credentials

- Email: admin@bakery.com
- Password: (set during first registration)

## Security Features

- JWT Authentication with refresh tokens
- Role-Based Access Control (RBAC)
- Permission-based authorization
- Rate limiting
- Helmet security headers
- Input validation
- Audit logging
