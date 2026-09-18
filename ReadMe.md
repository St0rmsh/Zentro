# 🚀 Zentro

### AI-Powered Full-Stack Publishing Platform

> A production-oriented full-stack publishing platform built with React, TypeScript, Node.js, Express, MongoDB, Redis, and AI integrations.

<p align="center">
  <a href="https://zentro-pwp3.onrender.com">
    <strong>🌐 Live Demo</strong>
  </a>
  •
  <a href="https://github.com/St0rmsh/Zentro">
    <strong>💻 GitHub</strong>
  </a>
</p>

---

## 🌐 Live Demo

### https://zentro-pwp3.onrender.com

Zentro is deployed and available online.

> **Note:** The application is hosted on Render. If the service has been idle, the first request may take a little longer while the server starts.

---

## 📖 About Zentro

Zentro started as a backend-learning project built to understand how real applications work beyond tutorials and simple CRUD operations.

It gradually evolved into a complete full-stack publishing and social platform combining:

* Modern authentication
* Content publishing
* Social interactions
* Media uploads
* Personalized feeds
* Advanced reading experience
* AI-powered content features
* Cloud infrastructure
* Scalable backend architecture

The project focuses on understanding how the different parts of a production-oriented application work together.

---

# ✨ Features

## 🔐 Authentication & Security

* User registration
* User login
* User logout
* JWT authentication
* Refresh-token authentication
* Protected routes
* Email verification
* OTP-based verification
* Password reset
* Change password
* Secure password hashing
* Rate limiting
* Request validation
* HTTP security middleware
* Secure cookies
* Login attempt protection

---

## 📝 Publishing System

Users can create, manage, and publish their own content.

* Create posts
* Edit posts
* Delete posts
* View individual posts
* User-specific posts
* Search posts
* Tags
* Markdown-based editor
* Cover images
* Media attachments
* Post recommendations
* Author information

---

## 📖 Reading Experience

Zentro includes a dedicated reading experience designed around long-form content.

* Reading progress tracking
* Estimated reading time
* Focus mode
* Adjustable font size
* Adjustable reading width
* Table of contents
* Reading controls
* Persistent reading settings
* Reading position tracking
* Author card
* Related posts

Reading preferences are persisted locally so users can maintain their preferred reading experience between sessions.

---

## 💬 Social Features

Zentro provides social functionality around published content.

* ❤️ Like posts
* 💬 Comments
* 🔖 Bookmarks
* 👥 Follow users
* 📰 Personalized feed
* User profiles
* User relationships
* Content recommendations

---

## 🤖 AI Features

AI is integrated directly into the publishing workflow.

Zentro supports AI-powered content processing including:

* Post summaries
* Content understanding
* Greeting detection
* Short-content handling
* Question detection
* Code-content handling
* News-content handling
* Tutorial-content handling
* Long-form article handling

The AI layer can work with multiple providers to provide flexibility around availability, quotas, and model capabilities.

### AI Stack

* Google Gemini
* Mistral
* LangChain
* Tavily

---

## 📧 Email Infrastructure

Zentro includes transactional email functionality for account-related workflows.

* Email verification
* OTP delivery
* Password recovery
* Transactional email templates
* HTML email templates
* Gmail SMTP
* Nodemailer
* Automatic OTP expiration

MongoDB TTL indexes are used for temporary OTP data so expired records can be automatically removed.

---

# 🖼️ Media Uploads

Zentro supports media uploads for published content.

Supported functionality includes:

* Cover image uploads
* Additional media uploads
* Image validation
* Video validation
* File size restrictions
* Cloud media storage
* Remote media deletion

### Media Infrastructure

**ImageKit**

---

# 🏗️ Architecture

Zentro uses a modular backend architecture that separates HTTP handling, business logic, and database operations.

```text
                         ┌──────────────────────┐
                         │     React Client     │
                         │  TypeScript + Vite   │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │    Express Server    │
                         │   Node + TypeScript  │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   │                │                │
                   ▼                ▼                ▼
            ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
            │ Controllers │  │  Services   │  │ Middleware  │
            └──────┬──────┘  └──────┬──────┘  └─────────────┘
                   │                │
                   └────────┬───────┘
                            ▼
                     ┌─────────────┐
                     │   Models    │
                     │  Mongoose   │
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   MongoDB   │
                     └─────────────┘

        ┌──────────────┬──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
      Redis         ImageKit        AI APIs         SMTP
```

---

# 🛠️ Tech Stack

## Frontend

| Technology      | Purpose                     |
| --------------- | --------------------------- |
| React           | UI                          |
| TypeScript      | Type safety                 |
| Vite            | Development & build tooling |
| Redux Toolkit   | State management            |
| React Router    | Routing                     |
| Tailwind CSS    | Styling                     |
| Framer Motion   | Animations                  |
| React Hook Form | Form management             |
| Zod             | Validation                  |
| Radix UI        | Accessible UI components    |
| Vitest          | Unit testing                |
| Playwright      | E2E testing                 |

## Backend

| Technology | Purpose                  |
| ---------- | ------------------------ |
| Node.js    | Runtime                  |
| Express.js | REST API                 |
| TypeScript | Type safety              |
| MongoDB    | Database                 |
| Mongoose   | ODM                      |
| Redis      | Caching / infrastructure |
| JWT        | Authentication           |
| Nodemailer | Email                    |
| Multer     | File uploads             |
| Morgan     | HTTP logging             |

## AI

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| Google Gemini | AI generation             |
| Mistral       | AI generation / workflows |
| LangChain     | AI orchestration          |
| Tavily        | Web research              |

## Infrastructure

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| Render         | Deployment              |
| ImageKit       | Media storage           |
| Docker         | Containerization        |
| Kubernetes     | Container orchestration |
| GitHub Actions | CI/CD                   |
| Load Testing   | Performance testing     |

---

# 📂 Project Structure

```text
Zentro/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── shared/
│   │   ├── store/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── k8s/
│   └── Kubernetes configuration
│
├── load-test/
│   └── Load testing configuration
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── metrics-server-patch.json
├── remove-probes-patch.json
└── README.md
```

---

# 🔑 API Modules

The backend is organized around several major API modules.

```text
Authentication
├── Register
├── Login
├── Logout
├── Verify Email
├── Forgot Password
├── Reset Password
└── Change Password

Users
├── Profiles
├── Profile Updates
└── User Relationships

Posts
├── Create
├── Read
├── Update
├── Delete
├── Search
└── User Posts

Social
├── Likes
├── Comments
├── Bookmarks
├── Followers
└── Feed

AI
├── Summaries
├── Content Processing
└── AI Workflows
```

---

# ⚡ Engineering Highlights

## Three-Layer Architecture

The backend separates responsibilities into distinct layers:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Model
     │
     ▼
MongoDB
```

This keeps controllers lightweight and business logic reusable.

---

## 🔑 JWT Authentication

Zentro uses JWT-based authentication with protected API routes and refresh-token handling.

This allows authentication to remain separated from the application's business logic.

---

## ⏱️ MongoDB TTL Indexes

OTP records are temporary by nature.

Instead of relying entirely on application-level cleanup, MongoDB TTL indexes are used to automatically remove expired OTP records.

```text
OTP Created
     │
     ▼
Expiration Time
     │
     ▼
MongoDB TTL Index
     │
     ▼
Automatic Cleanup
```

---

## ⚡ Redis

Redis is integrated into the backend infrastructure for use cases where fast temporary data access is beneficial.

The architecture keeps Redis usage bounded rather than making the application dependent on high-volume Redis operations.

---

## 🛡️ API Security

The API includes security-oriented middleware and controls such as:

* Rate limiting
* JWT authentication
* Protected routes
* Password hashing
* Request validation
* Secure cookies
* HTTP security headers
* File validation
* File size limits
* Login protection

---

# 🧪 Testing

The frontend includes automated testing infrastructure.

### Unit Testing

```bash
npm run test
```

Powered by:

**Vitest**

### End-to-End Testing

Powered by:

**Playwright**

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 22+
* npm or pnpm
* MongoDB
* Redis
* ImageKit account
* SMTP credentials
* Gemini API key
* Mistral API key
* Tavily API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/St0rmsh/Zentro.git

cd Zentro
```

---

# 2. Backend Setup

```bash
cd Backend

npm install
```

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

Start the backend:

```bash
npm run dev
```

---

# 3. Frontend Setup

Open another terminal:

```bash
cd Frontend

npm install

npm run dev
```

---

# ☁️ Deployment

Zentro is deployed using Render.

## Production Application

🌐 **https://zentro-pwp3.onrender.com**

The repository also contains infrastructure for:

* Docker
* Kubernetes
* GitHub Actions
* Load testing

---

# 📈 Scalability

The project was designed with future horizontal scaling in mind.

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │ Load Balancer│
                └──────┬──────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      API Instance  API Instance  API Instance
          │            │            │
          └────────────┼────────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
           MongoDB            Redis
```

Stateless authentication, modular services, external media storage, and separated application layers make the architecture easier to evolve toward multiple application instances.

---

# 🧠 What I Learned

Building Zentro provided hands-on experience with:

* Full-stack application architecture
* REST API design
* Authentication systems
* JWT and refresh tokens
* MongoDB data modeling
* Mongoose
* Database indexing
* TTL indexes
* Redis
* File uploads
* Cloud storage
* Transactional email
* Rate limiting
* Frontend state management
* AI API integration
* Prompt-based content processing
* Automated testing
* Docker
* Kubernetes
* Load testing
* CI/CD
* Production deployment

---

# 🗺️ Roadmap

* [x] Authentication
* [x] Email verification
* [x] Password recovery
* [x] Post management
* [x] Markdown editor
* [x] Media uploads
* [x] Search
* [x] Likes
* [x] Comments
* [x] Bookmarks
* [x] Followers
* [x] Personalized feed
* [x] Reading experience
* [x] AI summaries
* [x] AI content workflows
* [x] Redis integration
* [x] Rate limiting
* [x] Kubernetes configuration
* [x] Load-testing infrastructure
* [ ] Advanced AI agents
* [ ] Advanced recommendation system
* [ ] Real-time notifications
* [ ] Advanced analytics
* [ ] Further performance optimization

---

# 🔒 Environment Variables

Secrets should **never** be committed to the repository.

Make sure `.env` is included in `.gitignore`.

Required environment configuration may include:

```text
MongoDB
JWT
Redis
SMTP
ImageKit
Gemini
Mistral
Tavily
```

Use your own credentials when running Zentro locally.

---

# 📸 Screenshots

Screenshots and product demonstrations can be added here.

```text
Coming soon...
```

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Commit your changes
6. Open a pull request

---

# ⭐ Support

If you found Zentro interesting, consider giving the repository a ⭐.

<p align="center">

### 🌐 Live Demo

**https://zentro-pwp3.onrender.com**

### 💻 Source Code

**https://github.com/St0rmsh/Zentro**

</p>

---

# 👨‍💻 Author

## STORM

Full-Stack Developer building scalable web applications, backend systems, AI-powered products, and developer infrastructure.

---

<p align="center">

**Built with React, TypeScript, Node.js, MongoDB, Redis & AI**

</p>
