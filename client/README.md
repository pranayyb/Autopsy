# Autopsy Client 

Frontend application for Autopsy - an AI-first project management tool that detects silent project failure.

## 🛠️ Tech Stack

- **React 19** - UI library with latest features
- **Vite 7** - Next-generation frontend build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Declarative routing for React
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful & consistent icons
- **React Hot Toast** - Notifications library
- **date-fns** - Modern date utility library

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx     # Main app layout with sidebar
│   │   ├── Modal.jsx      # Reusable modal component
│   │   ├── ProtectedRoute.jsx  # Auth guard component
│   │   └── Sidebar.jsx    # Navigation sidebar
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context provider
│   ├── pages/
│   │   ├── auth/          # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── projects/      # Project management pages
│   │   │   ├── Projects.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── EditProject.jsx
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Risks.jsx      # Risk signals overview
│   │   └── Settings.jsx   # User settings
│   ├── services/
│   │   └── api.js         # API client configuration
│   ├── App.jsx            # Main app component with routes
│   ├── App.css            # App-specific styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run clean` | Format code with Prettier |

## 🎯 Features

### Authentication
- User registration and login
- Password reset via email
- JWT token management
- Protected routes

### Dashboard
- Project overview with status cards
- Recent activity feed
- Risk signal summary
- Quick actions

### Project Management
- Create, edit, and delete projects
- Set project deadlines and status
- Manage team members with roles
- View project-specific risks and insights

### Task Management
- Create and assign tasks
- Set priorities and due dates
- Track task status changes
- View task history

### Risk Monitoring
- View all risk signals across projects
- Filter by severity and type
- Acknowledge or resolve risks
- AI-generated insights

## 🎨 Styling

The application uses Tailwind CSS 4 with the Vite plugin for optimal performance. Custom styles can be added in:
- `src/App.css` - App-specific styles
- `src/index.css` - Global styles

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` includes:
- React plugin for JSX support
- Tailwind CSS integration
- Development server settings


## 🔗 API Integration

The API client is configured in `src/services/api.js` with:
- Axios instance with base URL
- Request interceptors for auth tokens
- Response interceptors for error handling

## 📄 License

This project is part of Autopsy and is licensed under the ISC License.

## 👤 Author

**Pranay Buradkar**