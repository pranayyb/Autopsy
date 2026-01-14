# Autopsy Server 

Backend API for Autopsy - an AI-first project management tool that detects silent project failure.

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB + Mongoose 9** - Database and ODM
- **Groq SDK** - LLM integration (Llama 3.3 70B)
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer + Mailgen** - Email service
- **express-validator** - Request validation
- **express-rate-limit** - Rate limiting

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── groq.js            # Groq LLM client setup
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication handlers
│   │   ├── healthCheck.controller.js  # Health check endpoint
│   │   ├── insight.controller.js   # AI insight handlers
│   │   ├── project.controller.js   # Project CRUD handlers
│   │   ├── risk.controller.js      # Risk signal handlers
│   │   └── task.controller.js      # Task CRUD handlers
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   └── validate.middleware.js  # Request validation
│   ├── models/
│   │   ├── Insight.models.js       # AI insight schema
│   │   ├── Project.models.js       # Project schema
│   │   ├── RiskSignal.models.js    # Risk signal schema
│   │   ├── Task.models.js          # Task schema
│   │   └── User.models.js          # User schema
│   ├── prompts/
│   │   └── projectRisk.prompt.js   # LLM prompt templates
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── insight.routes.js       # Insight endpoints
│   │   ├── project.routes.js       # Project endpoints
│   │   ├── risk.routes.js          # Risk endpoints
│   │   └── task.routes.js          # Task endpoints
│   ├── scripts/
│   │   └── testModels.js           # Database testing script
│   ├── services/
│   │   ├── insight.service.js      # Insight business logic
│   │   ├── llm.service.js          # LLM integration service
│   │   └── taskRiskEvaluator.js    # Risk detection engine
│   ├── utils/
│   │   ├── api-error.js            # Custom error class
│   │   ├── api-response.js         # Response formatter
│   │   ├── async-handler.js        # Async error wrapper
│   │   ├── constants.js            # App constants
│   │   └── mail.js                 # Email utilities
│   ├── validators/
│   │   ├── project.validator.js    # Project validation rules
│   │   ├── task.validators.js      # Task validation rules
│   │   └── user-auth.js            # Auth validation rules
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
├── vercel.json                     # Vercel deployment config
└── package.json                    # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key
- SMTP credentials

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
    PORT=8000
    MONGO_URI=mongodb+srv://your-mongodb-connection-string

    ACCESS_TOKEN_SECRET=your-access-secret
    ACCESS_TOKEN_EXPIRY=15m
    REFRESH_TOKEN_SECRET=your-refresh-secret
    REFRESH_TOKEN_EXPIRY=7d

    FRONTEND_URL=https://your-frontend-url.com
    BACKEND_URL=https://your-backend-url.com

    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-password
    EMAIL_FROM_NAME=Autopsy
    APP_NAME=Autopsy

    GROQ_API_KEY=your-groq-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:8000`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm run clean` | Format code with Prettier |

## 🔌 API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server health |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/verify-email/:verificationToken` | Verify email address |
| GET | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-forgot-password/:resetToken` | Reset password |
| GET | `/api/auth/current-user` | Get current user (protected) |
| POST | `/api/auth/resend-verification-email` | Resend verification email (protected) |
| POST | `/api/auth/change-password` | Change password (protected) |
| POST | `/api/auth/logout` | Logout user (protected) |
| GET | `/api/auth/user/:userId` | Get user by ID (protected) |
| POST | `/api/auth/users` | Get users by IDs (protected) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects/create-project` | Create project |
| GET | `/api/projects/get-projects` | Get all projects |
| GET | `/api/projects/:projectId/get-project` | Get project by ID |
| PUT | `/api/projects/:projectId/update-project` | Update project |
| DELETE | `/api/projects/:projectId/delete-project` | Delete project |
| GET | `/api/projects/:projectId/get-members` | Get project members |
| POST | `/api/projects/:projectId/add-member` | Add member |
| PATCH | `/api/projects/:projectId/update-member-role/:memberId` | Update member role |
| DELETE | `/api/projects/:projectId/remove-member/:memberId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/:projectId/create-task` | Create task |
| GET | `/api/tasks/:projectId/get-tasks` | Get project tasks |
| GET | `/api/tasks/:projectId/:taskId/get-task-details` | Get task details |
| PATCH | `/api/tasks/:projectId/:taskId/update-status` | Update task status |
| PUT | `/api/tasks/:projectId/:taskId/update-task` | Update task |
| DELETE | `/api/tasks/:projectId/:taskId/delete-task` | Delete task |

### Risks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/risks/:projectId/get-project-health` | Evaluate project health |
| GET | `/api/risks/:projectId/get-timeline` | Get risk timeline |
| GET | `/api/risks/:projectId/get-top-risk-tasks` | Get top risk tasks |
| GET | `/api/risks/:projectId/get-project-risks` | Get project risks |
| GET | `/api/risks/tasks/:taskId/get-task-risks` | Get task risks |
| PUT | `/api/risks/:riskId/resolve-risk` | Resolve a risk |

### Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights/:projectId` | Get AI insights (rate limited) |

## 🤖 Risk Detection Engine

The `taskRiskEvaluator.js` service automatically detects:

### Risk Types

| Type | Description | Trigger |
|------|-------------|---------|
| `STAGNATION` | Task hasn't been updated | > 3 days without updates |
| `STATUS_FLAPPING` | Excessive status changes | ≥ 3 status changes |
| `FAKE_PROGRESS` | Suspicious progress patterns | Pattern analysis |
| `OVERDUE` | Task past due date | Due date exceeded |

### Severity Calculation

Severity (1-5) is calculated based on:
- Task priority (Critical tasks = higher severity)
- Days since last update
- Owner's current task load (multiplier)
- Overdue duration

## 🧠 LLM Integration

The server uses Groq's Llama 3.3 70B model for generating insights:

```javascript
// Example: Generate project insight
const insight = await generateProjectInsight({
    projectName: "My Project",
    risks: [/* risk signals */]
});
```

The LLM analyzes risk patterns and provides:
- Root cause analysis
- Actionable recommendations
- Risk prioritization
- Health assessment

## 🔐 Authentication

JWT-based authentication with:
- Access tokens (short-lived, e.g., 1d)
- Refresh tokens (long-lived, e.g., 10d)
- Password hashing with bcrypt
- Email verification
- Email-based password reset

### Protected Routes

All routes except auth endpoints require:
```
Authorization: Bearer <jwt_token>
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret for access token signing | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration (e.g., 1d) | Yes |
| `REFRESH_TOKEN_SECRET` | Secret for refresh token signing | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration (e.g., 10d) | Yes |
| `GROQ_API_KEY` | Groq API key for LLM | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASS` | Gmail app password | Yes |
| `EMAIL_FROM_NAME` | Sender name for emails | Yes |
| `APP_NAME` | Application name | Yes |
| `FRONTEND_URL` | Frontend URL for CORS and email links | Yes |
| `BACKEND_URL` | Backend URL for email links | Yes |

## 📊 Database Models

### User
- `name`, `email`, `password`
- `resetPasswordToken`, `resetPasswordExpire`

### Project
- `name`, `description`, `owner`
- `members[]` (with roles: admin, project_admin, member)
- `status` (pending, active, completed, archived)
- `deadline`

### Task
- `title`, `description`, `project`, `owner`
- `priority`, `status`, `dueDate`
- `statusChanges` (for risk detection)

### RiskSignal
- `project`, `task`, `type`
- `severity` (1-5), `confidence` (0-1)
- `message`, `status` (open, acknowledged, resolved)

### Insight
- `project`, `content` (LLM-generated)
- `generatedAt`

## 📄 License

This project is part of Autopsy and is licensed under the ISC License.

## 👤 Author

**Pranay Buradkar**
