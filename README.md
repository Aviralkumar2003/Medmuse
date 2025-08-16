# MedMuse

MedMuse is a full-stack healthcare application for symptom tracking, AI-driven health insights, and medical report generation. It consists of a Spring Boot backend and a modern React (Vite + TypeScript + shadcn/ui) frontend.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **OAuth2 Google Authentication** (session-based)
- **Daily Symptom Logging**
- **Health Insights & Trends** (AI-powered)
- **Medical Report Generation** (PDF export)
- **Secure Data Storage** (H2 for dev, PostgreSQL for prod)
- **User Profile Management**
- **Provider Sharing** (planned)
- **Modern, Responsive UI**

---

## Architecture
- **Backend:** Java 17, Spring Boot 3, Spring Security (OAuth2), JPA, AI integration, PDF generation
- **Frontend:** React 18, Vite, TypeScript, Redux Toolkit, shadcn/ui, TailwindCSS

```
[React Frontend] <-> [Spring Boot Backend] <-> [Database]
                                 |
                                 +-- [AI Service (OpenAI/Mock)]
                                 +-- [PDF Generation]
```

---

## Backend Setup (`medmuse-backend`)

### Prerequisites
- Java 17+
- Maven 3.8+

### Running Locally
```bash
cd medmuse-backend
./mvnw spring-boot:run
```
- Default port: `8080`
- H2 Console: `/h2-console` (dev only)
- API base path: `/api`

#### Configuration
- See `src/main/resources/application.properties` for DB, OAuth2, AI, and email settings.
- Google OAuth2 is pre-configured for localhost. Update client ID/secret for production.

---

## Frontend Setup (`symptom-path-pro`)

### Prerequisites
- Node.js 18+
- npm or bun

### Running Locally
```bash
cd symptom-path-pro
npm install
npm run dev
```
- Default port: `5173`
- Connects to backend at `http://localhost:8080/api`

---

## Usage
1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Login with Google.
3. Log daily symptoms, view dashboard, generate reports, and download/share PDFs.

---

## API Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed backend API endpoints, request/response formats, and authentication.

---

## Contributing
1. Fork the repo and create a feature branch.
2. Follow code style and commit guidelines.
3. Submit a pull request with a clear description.

---

## License
[MIT](LICENSE)
