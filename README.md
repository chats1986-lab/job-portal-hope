# Job Portal System

A microservices-based job portal application built with Spring Boot, Spring Cloud, and Docker.

## Architecture

This project uses a microservices architecture with the following components:

### Frontend Application
- **Tech Stack**: React 19, TypeScript, Vite
- **UI Framework**: Radix UI components with Tailwind CSS
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **Port**: 8080 (default)
- **Location**: `../job-portal-frontend/`

### Infrastructure Services
- **Service Registry (Eureka)**: Port 8761 - Service discovery and registration
- **Config Server**: Port 8888 - Centralized configuration management
- **API Gateway**: Port 5000 - Single entry point for all client requests
- **Kafka**: Port 9092 - Event streaming for notifications

### Application Services
- **User Service**: Port 5001 - User management and authentication
- **Company Service**: Port 5002 - Company profile management
- **Job Service**: Port 5003 - Job posting and management
- **Application Service**: Port 5004 - Job application tracking
- **Preference Service**: Port 5005 - User job preferences
- **Resume Service**: Port 5006 - Resume management
- **AI Service**: Port 6000 - AI-powered job description generation
- **Notification Service**: Port 5007 - Email notifications via Kafka

### Databases
Each service has its own PostgreSQL database:
- User DB: Port 5432
- Company DB: Port 5433
- Job DB: Port 5434
- Application DB: Port 5435
- Preference DB: Port 5436
- Resume DB: Port 5439

## Prerequisites

- Java 21 or higher
- Maven 3.9+
- Docker and Docker Compose
- Node.js 18+ and npm (or Bun for faster builds)
- PostgreSQL client (optional, for direct database access)
- Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd job-portal-system
```

### 2. Create Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
DB_PASSWORD=your_secure_password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

**Note**: For Gmail, you need to use an App-Specific Password, not your regular password.

### 3. Setup Frontend
Navigate to the frontend directory and install dependencies:

```bash
cd ../job-portal-frontend

# Using npm
npm install

# Or using Bun (faster)
bun install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Build Docker Images (Optional)
If you want to use Docker deployment, build the images first:

```bash
# Build all service images
docker-compose build

# Or build individual services
docker-compose build user-service
docker-compose build company-service
# ... etc
```

## Running the Project

### Frontend Application

The frontend is a React application built with Vite, TanStack Router, and Radix UI.

#### Start Frontend (Development)
```bash
cd ../job-portal-frontend

# Using npm
npm run dev

# Or using Bun (faster)
bun run dev
```

The frontend will be available at `http://localhost:8080`

#### Build Frontend (Production)
```bash
cd ../job-portal-frontend

# Using npm
npm run build

# Or using Bun
bun run build
```

#### Preview Production Build
```bash
cd ../job-portal-frontend

# Using npm
npm run preview

# Or using Bun
bun run preview
```

#### Run Frontend Tests
```bash
cd ../job-portal-frontend

# Run E2E tests with Playwright
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

### Option 1: Docker Deployment (Recommended)

This is the easiest way to run the entire stack.

#### Start All Services
```bash
docker-compose up -d
```

#### Start Only Infrastructure Services
```bash
docker-compose up -d userdb companydb jobdb applicationdb preferencedb resumedb kafka discovery config-server gateway
```

#### View Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f user-service
docker-compose logs -f gateway
```

#### Stop All Services
```bash
docker-compose down
```

#### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Option 2: Local Development

For local development, you can run services individually using Maven.

#### Step 1: Start Infrastructure Services
Start the databases and Kafka using Docker Compose:

```bash
docker-compose up -d userdb companydb jobdb applicationdb preferencedb resumedb kafka
```

#### Step 2: Start Service Registry
```bash
cd cloud/job-portal-service-registry
mvn spring-boot:run
```

Wait for the service to start (check http://localhost:8761)

#### Step 3: Start Config Server
```bash
cd cloud/job-portal-config-server
mvn spring-boot:run
```

Wait for the service to start (check http://localhost:8888)

#### Step 4: Start API Gateway
```bash
cd cloud/job-portal-api-gateway
mvn spring-boot:run
```

Wait for the service to start (check http://localhost:5000)

#### Step 5: Start Application Services

Start each service in a separate terminal:

```bash
# User Service
cd services/job-portal-user-service
mvn spring-boot:run

# Company Service
cd services/job-portal-company-service
mvn spring-boot:run

# Job Service
cd services/job-portal-job-service
mvn spring-boot:run

# Application Service
cd services/job-portal-application-service
mvn spring-boot:run

# Preference Service
cd services/job-portal-preferences-service
mvn spring-boot:run

# Resume Service
cd services/job-portal-resume-service
mvn spring-boot:run

# AI Service
cd services/job-portal-ai-service
mvn spring-boot:run

# Notification Service
cd services/job-portal-notification-service
mvn spring-boot:run
```

**Important**: Start services in the order listed above, as some services depend on others.

### Option 3: Hybrid (Docker for Infra, Local for Services)

Use Docker for infrastructure and run services locally:

```bash
# Start infrastructure
docker-compose -f docker-compose.dev.yaml up -d

# Then start services locally as shown in Option 2
```

## API Access

All API requests go through the API Gateway at `http://localhost:5000`

### Public Endpoints
- `GET /api/jobs` - List all jobs (no authentication required)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Authenticated Endpoints
Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

#### Create Job (Authenticated)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"title":"Software Engineer","description":"Job description"}'
```

#### AI Job Description Generation
```bash
curl -X POST http://localhost:5000/api/ai/job/describe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"title":"Senior React Developer","skills":["React","Java"],"experienceLevel":"SENIOR","jobType":"FULL_TIME","workMode":"REMOTE"}'
```

## Service Health Checks

Check if services are running:

```bash
# Service Registry
curl http://localhost:8761/actuator/health

# Config Server
curl http://localhost:8888/actuator/health

# API Gateway
curl http://localhost:5000/actuator/health

# Individual Services
curl http://localhost:5001/actuator/health  # User Service
curl http://localhost:5002/actuator/health  # Company Service
curl http://localhost:5003/actuator/health  # Job Service
# ... etc
```

## Eureka Dashboard

View registered services at:
http://localhost:8761

## Troubleshooting

### Port Already in Use
If a port is already in use, either:
1. Stop the conflicting service
2. Change the port in the service's `application.yaml`

### Service Not Registering with Eureka
1. Check if Eureka is running: `curl http://localhost:8761/actuator/health`
2. Check service logs for connection errors
3. Verify `eureka.client.service-url.default-zone` configuration

### Database Connection Issues
1. Verify Docker containers are running: `docker-compose ps`
2. Check database logs: `docker-compose logs userdb`
3. Verify database credentials in `.env` file

### Config Server Issues
1. Check if Config Server is running: `curl http://localhost:8888/actuator/health`
2. Verify configuration files in Config Server's `src/main/resources/config` directory

### AI Service Not Working
1. Verify Gemini API key is valid and has proper permissions
2. Check AI service logs for API errors
3. Ensure the model name in `application.yaml` is correct (e.g., `gemini-pro`)

### Notification Service Issues
1. Verify Kafka is running: `docker-compose logs kafka`
2. Check email configuration in `.env` file
3. For Gmail, ensure you're using an App-Specific Password

## Development Tips

### Hot Reload
For faster development, use Spring Boot DevTools:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

### Database Access
Connect to databases directly:
```bash
# User DB
psql -h localhost -p 5432 -U postgres -d job_portal_user

# Company DB
psql -h localhost -p 5433 -U postgres -d job_portal_company
```

## Sample SQL Statements

### User Database (Port 5432)
```sql
-- Create a new user
INSERT INTO users (email, password, full_name, role) 
VALUES ('john@example.com', '$2a$10$encrypted_password', 'John Doe', 'ROLE_EMPLOYER');

-- Get user by email
SELECT * FROM users WHERE email = 'john@example.com';

-- Update user profile
UPDATE users SET full_name = 'John Smith', phone = '1234567890' WHERE id = 1;

-- Delete user
DELETE FROM users WHERE id = 1;

-- List all users
SELECT id, email, full_name, role, created_at FROM users LIMIT 10;
```

### Company Database (Port 5433)
```sql
-- Create a new company
INSERT INTO companies (name, description, industry, website, location) 
VALUES ('Tech Corp', 'A technology company', 'Software', 'https://techcorp.com', 'Bangalore');

-- Get company by user ID
SELECT * FROM companies WHERE user_id = 1;

-- Update company information
UPDATE companies SET description = 'Leading software company', employee_count = 500 WHERE id = 1;

-- Delete company
DELETE FROM companies WHERE id = 1;

-- List all companies
SELECT id, name, industry, location, created_at FROM companies LIMIT 10;
```

### Job Database (Port 5434)
```sql
-- Create a new job
INSERT INTO jobs (title, description, company_id, job_type, experience_level, work_mode, status) 
VALUES ('Software Engineer', 'Develop and maintain software applications', 1, 'FULL_TIME', 'MID_LEVEL', 'REMOTE', 'ACTIVE');

-- Get jobs by company
SELECT * FROM jobs WHERE company_id = 1;

-- Update job status
UPDATE jobs SET status = 'CLOSED' WHERE id = 1;

-- Delete job
DELETE FROM jobs WHERE id = 1;

-- List all active jobs
SELECT id, title, company_id, job_type, experience_level, created_at FROM jobs WHERE status = 'ACTIVE' LIMIT 10;
```

### Application Database (Port 5435)
```sql
-- Create a new job application
INSERT INTO applications (job_id, candidate_id, status, cover_letter) 
VALUES (1, 1, 'PENDING', 'I am excited to apply for this position.');

-- Get applications by candidate
SELECT * FROM applications WHERE candidate_id = 1;

-- Update application status
UPDATE applications SET status = 'SHORTLISTED' WHERE id = 1;

-- Delete application
DELETE FROM applications WHERE id = 1;

-- List all applications for a job
SELECT * FROM applications WHERE job_id = 1 ORDER BY created_at DESC LIMIT 10;
```

### Preference Database (Port 5436)
```sql
-- Create user preferences
INSERT INTO preferences (user_id, job_types, experience_levels, locations, industries) 
VALUES (1, ARRAY['FULL_TIME', 'PART_TIME'], ARRAY['MID_LEVEL', 'SENIOR'], ARRAY['Bangalore', 'Mumbai'], ARRAY['Software', 'Finance']);

-- Get preferences by user
SELECT * FROM preferences WHERE user_id = 1;

-- Update preferences
UPDATE preferences SET job_types = ARRAY['FULL_TIME'], locations = ARRAY['Bangalore'] WHERE user_id = 1;

-- Delete preferences
DELETE FROM preferences WHERE user_id = 1;

-- List all preferences
SELECT user_id, job_types, locations, industries FROM preferences LIMIT 10;
```

### Resume Database (Port 5439)
```sql
-- Create a new resume
INSERT INTO resumes (candidate_id, title, summary, skills) 
VALUES (1, 'Software Developer Resume', 'Experienced developer with 5 years in Java', ARRAY['Java', 'Spring', 'React']);

-- Get resumes by candidate
SELECT * FROM resumes WHERE candidate_id = 1;

-- Update resume
UPDATE resumes SET summary = 'Senior developer with 7 years experience', skills = ARRAY['Java', 'Spring', 'React', 'AWS'] WHERE id = 1;

-- Delete resume
DELETE FROM resumes WHERE id = 1;

-- List all resumes
SELECT id, candidate_id, title, summary, created_at FROM resumes LIMIT 10;
```

### View Service Logs
```bash
# Docker
docker-compose logs -f <service-name>

# Local (Maven)
# Logs are printed to console
```

## Building for Production

```bash
# Build all services
mvn clean package -DskipTests

# Build individual service
cd services/job-portal-user-service
mvn clean package -DskipTests
```

## Testing

```bash
# Run all tests
mvn test

# Run tests for specific service
cd services/job-portal-user-service
mvn test
```

## Project Structure

```
job-portal-system/
├── cloud/                          # Infrastructure services
│   ├── job-portal-service-registry/ # Eureka
│   ├── job-portal-config-server/    # Config Server
│   └── job-portal-api-gateway/     # API Gateway
├── services/                       # Application services
│   ├── job-portal-user-service/
│   ├── job-portal-company-service/
│   ├── job-portal-job-service/
│   ├── job-portal-application-service/
│   ├── job-portal-preferences-service/
│   ├── job-portal-resume-service/
│   ├── job-portal-ai-service/
│   └── job-portal-notification-service/
├── common-lib/                     # Shared library
├── docker-compose.yaml             # Production Docker setup
├── docker-compose.dev.yaml         # Development Docker setup
└── pom.xml                         # Maven parent POM
```

## Support

For issues or questions, please refer to the project documentation or contact the development team.
