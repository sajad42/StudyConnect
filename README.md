StudyConnect (StudySync)
StudyConnect is a full-stack, cloud-native platform designed to help university students collaborate by creating and joining study groups. Built with Spring Boot 3 and React 19, the application is fully deployed on AWS with a focus on security and scalability.

🚀 Live Demo: [Frontend](https://d3hl37aapqqsoq.cloudfront.net/) | 🔑 Backend API

🌟 Key Features
User Authentication: Secure signup and login system using JWT (JSON Web Tokens) for stateless session management.

Study Group Management: Users can create, browse, and join study groups filtered by academic subjects.

Personal Dashboard: Real-time stats showing active groups and upcoming sessions.

Secure API Design: Role-based access control (RBAC) ensuring users can only manage their own created groups.

Cloud-Native Architecture: Optimized for production with cross-origin security (CORS) and content delivery networks (CDN).

🛠️ Tech Stack
Backend
Framework: Java 17, Spring Boot 3.5

Security: Spring Security 6 with JWT

Database: PostgreSQL via AWS RDS

ORM: Spring Data JPA (Hibernate)

Mappers: MapStruct and Lombok for clean DTO patterns

Frontend
Library: React 19 (Vite)

Styling: Tailwind CSS

Icons: Lucide React

Routing: React Router DOM

Cloud & DevOps (AWS)
Frontend Hosting: Amazon S3 + CloudFront (HTTPS)

API Hosting: AWS Elastic Beanstalk (Java Environment)

API Gateway: CloudFront for secure backend proxying and CORS management

Database: Amazon RDS (PostgreSQL)

📐 Architecture & Security Highlights
One of the major challenges during development was resolving Mixed Content errors and CORS preflight (OPTIONS) failures.

Dual-CloudFront Strategy: To support HTTPS across the entire stack without a custom domain, a second CloudFront distribution was configured as a reverse proxy for the Elastic Beanstalk backend.

CORS Handshake: Implemented a custom CorsConfigurationSource to handle browser-mandated preflight requests, explicitly allowing Authorization and Content-Type headers for secure cross-site requests.

🚦 Getting Started
Prerequisites
Java 17+

Node.js 18+

PostgreSQL

Local Setup
Clone the Repo:

Bash

git clone https://github.com/sajad42/StudyConnect.git
Backend Setup:

Update application.yml with your local database credentials.

Run ./mvnw spring-boot:run.

Frontend Setup:

Navigate to /Frontend/StudyConnect.

Run npm install and npm run dev.

📧 Contact
Sajad -  - sajad.alizada2014@gmai.com
