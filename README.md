# MultiLang Image Caption

A full-stack web application that generates AI-powered image captions in three languages: English, Telugu, and Hindi.

## 🚀 Features

- **AI-Powered Captions**: Uses Google Gemini AI to generate captions
- **Multilingual Support**: Captions in English, Telugu, and Hindi
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **User Authentication**: Secure login system
- **Image Upload**: Drag & drop or file selection
- **Caption History**: Browse and manage your generated captions
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini API
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Authentication**: Replit Auth (configurable for local dev)

## 📋 Prerequisites

1. **Node.js** (version 18 or higher)
2. **PostgreSQL** database
3. **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/multilang_caption

# Google Gemini AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key

# Replit Configuration (for local dev)
REPLIT_DOMAINS=localhost:5000
REPL_ID=local_dev_project
SESSION_SECRET=your_random_secret_key

# OIDC Configuration
ISSUER_URL=https://replit.com/oidc

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Set Up Database

1. **Create your PostgreSQL database**:
   ```sql
   CREATE DATABASE multilang_caption;
   ```

2. **Run database migrations**:
   ```bash
   npm run db:push
   ```

### 4. Run the Application

#### Option A: Using the provided scripts

**Windows (Command Prompt)**:
```bash
run-dev.bat
```

**Windows (PowerShell)**:
```powershell
.\run-dev.ps1
```

#### Option B: Manual setup

1. **Set environment variables** (Windows PowerShell):
   ```powershell
   $env:DATABASE_URL = "postgresql://username:password@localhost:5432/multilang_caption"
   $env:GEMINI_API_KEY = "your_actual_gemini_api_key"
   $env:REPLIT_DOMAINS = "localhost:5000"
   $env:REPL_ID = "local_dev_project"
   $env:SESSION_SECRET = "your_random_secret_key"
   $env:ISSUER_URL = "https://replit.com/oidc"
   $env:PORT = "5000"
   $env:NODE_ENV = "development"
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

### 5. Access the Application

Open your browser and go to `http://localhost:5000`

## 📁 Project Structure

```
MultiLangImageCaption/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── index.html         # HTML template
├── server/                 # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data storage layer
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared code
│   └── schema.ts          # Database schema
├── uploads/                # Image upload storage
└── migrations/             # Database migrations
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌐 API Endpoints

- `GET /api/auth/user` - Get current user
- `GET /api/auth/login` - Initiate login
- `GET /api/auth/logout` - Logout user
- `POST /api/images/upload` - Upload image
- `GET /api/images/user/:userId` - Get user's images
- `PUT /api/images/:id/captions` - Update image captions

## 🔐 Authentication

The app uses Replit Auth for authentication. For local development, you can:

1. Use the mock authentication system
2. Set up your own OIDC provider
3. Modify the auth system for local development

## 📸 Image Processing

- **Supported formats**: JPEG, PNG, GIF, WebP
- **File size limit**: 10MB
- **Storage**: Local filesystem (configurable)
- **AI Integration**: Google Gemini Vision API

## 🎨 UI Components

Built with shadcn/ui components:
- Modern, accessible design
- Dark/light theme support
- Responsive layout
- Smooth animations
- Toast notifications
- Modal dialogs

## 🚀 Deployment

### Replit
This project is optimized for Replit deployment with:
- Automatic environment variable setup
- Database provisioning
- HTTPS support
- WebSocket support

### Other Platforms
For other platforms, ensure:
- Environment variables are properly set
- PostgreSQL database is accessible
- File upload directory is writable
- Port configuration is correct

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Email**: ganumulapally@gmail.com
- **Phone**: 8688195228
- **Issues**: Create an issue in the repository

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Watching the repository
- Checking the releases page
- Following the development blog

---

**Happy captioning! 🎉**
-- https://multi-lang-image-caption.replit.app at Real Time 