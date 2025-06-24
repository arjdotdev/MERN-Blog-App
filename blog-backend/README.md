Scaffold & Tooling (4–6 hrs)

Backend: TypeScript + Express + dotenv + Mongoose + “Hello world” endpoint

Frontend: CRA (TS) + Tailwind + basic router setup

Verify health endpoints and styling

Database & Auth (6–8 hrs)

Connect to MongoDB, define User schema

/api/auth/register & /api/auth/login endpoints

Password hashing (bcrypt) + JWT issuance

Auth UI & State (6–8 hrs)

Build signup/login forms (no lib)

Wire up Context API for auth state

Persist token (HTTP-only cookie or localStorage)

Posts Backend CRUD (6–8 hrs)

Define Post schema (title, body, author, timestamps)

POST/GET/PUT/DELETE /api/posts endpoints with population

Posts Frontend (8–10 hrs)

List, detail, create/edit/delete pages

Fetch data via fetch or axios, update Context

Comments Feature (6–8 hrs)

Comment schema & endpoints (/api/posts/:id/comments)

UI to add/list comments under a post

Routing & Code-Splitting (4–6 hrs)

Organize routes with react-router-dom

Lazy-load heavy pages using React.lazy + Suspense

Basic Testing (4–6 hrs)

React Testing Library: a few unit tests for forms & context

Jest (or supertest) for one or two backend routes

Docker & Docker Compose (4 hrs)

Dockerfile for both services

Compose file for backend + Mongo + frontend (optional)

CI/CD with GitHub Actions (6 hrs)

Lint, type-check, test on each PR

Build & push Docker images to registry

AWS Deployment (6–8 hrs)

Push images to ECR

Deploy to ECS Fargate (or Elastic Beanstalk)

Configure env vars via Secrets Manager

Social Login & Final Polishing (6 hrs)

Add Google OAuth to your JWT flow (later swap in Auth0 if desired)

Clean up UI, fix edge-case bugs, add final tests

Buffer & Bugfixes (8 hrs)

Address any unexpected blockers

Polish UX, handle error states, finalize README

npm install express jsonwebtoken bcrypt mongoose

What is mongoose?
mongoose: schema-based ORM for MongoDB

Step1: Setup backend(setup express server running at some port) and frontend(create a react app with tailwind)

Step 2: hooking up your backend to MongoDB with Mongoose.
MONGO_URI is a connection string that tells Mongoose where to find your database.
Ways to run MongoDB:
a. locally via Docker: docker installs mongoDB for you inside an isloated environment. It spins up a new container from that image (which are minimal Linux userland and mongodb binary). Inside the container, it runs mongodb. You do not install MongoDB on your OS but the container has everything it needs.
b. locally by installing MongoDB //resource heavy and slows laptop
c. MongoDB Atlas
