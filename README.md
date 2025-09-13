# 🎯 HabitTracker - Gamified Habit Building Platform

A modern, full-stack Progressive Web Application (PWA) for building better habits through gamification. Track your progress, earn XP, level up, and compete with others in your journey to self-improvement.

## ✨ Features

### 🎮 Gamification System
- **XP & Levels**: Earn experience points and level up as you complete habits
- **Streaks**: Maintain daily streaks for bonus rewards
- **Achievements**: Unlock badges for milestones and consistency
- **Leaderboards**: Compete with other users globally

### 📱 User Experience
- **Premium Homepage**: Beautiful landing page with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **PWA Support**: Install as native app with offline capabilities
- **Real-time Updates**: Live XP and level updates

### 🔐 Security & Performance
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **Lazy Loading**: Optimized bundle loading
- **Virtual Scrolling**: Smooth performance with large datasets

### 👨💼 Admin Panel
- **User Management**: View, edit, and manage users
- **Habit Analytics**: Monitor habit completion rates
- **System Tools**: Database management and cleanup
- **Real-time Stats**: Live dashboard with key metrics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs hashing
- **Performance**: Response compression, memory caching, connection pooling
- **Security**: Rate limiting, input validation, error handling
- **Utilities**: Node-cache for performance optimization

### Frontend
- **Framework**: Angular 16+ with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Architecture**: Lazy-loaded feature modules
- **Performance**: OnPush change detection, virtual scrolling, image lazy loading
- **PWA**: Service workers, offline support, installable
- **UI/UX**: Responsive design, smooth transitions, modern animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration:
# MONGODB_URI=mongodb://localhost:27017/habittracker
# JWT_SECRET=your-super-secret-jwt-key
# PORT=3000
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX_REQUESTS=100

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve

# Open browser to http://localhost:4200
```

### Production Build
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
ng build
npx http-server dist/habit-tracker -p 8080
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Habits Management
- `GET /api/habits` - Get user's habits (paginated)
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `POST /api/habits/:id/complete` - Mark habit as complete
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/stats` - Get habit statistics

### Gamification
- `GET /api/leaderboard/top` - Get top users (cached)
- `GET /api/leaderboard/rank` - Get current user's rank
- `GET /api/achievements` - Get available achievements
- `GET /api/challenges` - Get daily challenges

### Social Features
- `GET /api/social/friends` - Get user's friends
- `POST /api/social/follow` - Follow another user
- `GET /api/social/feed` - Get activity feed

### Admin Panel (Admin Only)
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/habits` - Get all habits
- `GET /api/admin/stats` - Get system statistics
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/reset-xp` - Reset all user XP
- `GET /api/admin/export/habits` - Export habits data

## 🎯 How to Use

### Getting Started
1. **Visit Homepage**: Navigate to the landing page
2. **Create Account**: Register with email and password
3. **Setup Profile**: Complete your profile information

### Building Habits
1. **Create Habits**: Add habits with categories (Health, Fitness, Learning, etc.)
2. **Set Difficulty**: Choose Easy (8 XP), Medium (10 XP), or Hard (15 XP)
3. **Daily Tracking**: Mark habits as complete to earn XP
4. **Maintain Streaks**: Complete habits consistently for bonus rewards

### Gamification Features
1. **Level Up**: Gain XP to increase your level
2. **Earn Achievements**: Unlock badges for milestones
3. **Compete**: Check leaderboards to see your ranking
4. **Social**: Follow friends and see their progress

### Admin Features (Admin Users)
1. **User Management**: View and manage all users
2. **System Analytics**: Monitor app usage and statistics
3. **Data Management**: Export data and perform maintenance
4. **Content Management**: Create challenges and achievements

## 📁 Project Structure

```
habittracker/
├── backend/                 # Node.js API Server
│   ├── controllers/         # Route handlers and business logic
│   ├── middleware/          # Authentication, validation, error handling
│   ├── models/             # MongoDB schemas (User, Habit, Achievement)
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions and helpers
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
│
└── frontend/               # Angular PWA Client
    ├── src/
    │   ├── app/
    │   │   ├── core/       # Singleton services, guards, interceptors
    │   │   │   ├── services/    # API services, auth service
    │   │   │   ├── guards/      # Route guards
    │   │   │   └── interceptors/ # HTTP interceptors
    │   │   ├── shared/     # Reusable components and utilities
    │   │   │   ├── components/  # Shared UI components
    │   │   │   └── models/      # TypeScript interfaces
    │   │   ├── features/   # Lazy-loaded feature modules
    │   │   │   ├── home/        # Landing page
    │   │   │   ├── auth/        # Login/Register
    │   │   │   ├── dashboard/   # Main dashboard
    │   │   │   ├── leaderboard/ # Rankings
    │   │   │   ├── admin/       # Admin panel
    │   │   │   ├── challenges/  # Daily challenges
    │   │   │   └── social/      # Social features
    │   │   └── app.component.ts # Root component
    │   ├── assets/         # Static assets, icons
    │   ├── manifest.webmanifest # PWA manifest
    │   └── index.html      # Main HTML file
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── package.json        # Frontend dependencies
```

## 🌟 Key Features Implemented

### Performance Optimizations
- ✅ **Lazy Loading**: Feature modules load on demand
- ✅ **Virtual Scrolling**: Smooth performance with large lists
- ✅ **OnPush Change Detection**: Optimized Angular performance
- ✅ **Image Lazy Loading**: Faster page loads
- ✅ **Response Compression**: Reduced bandwidth usage
- ✅ **Memory Caching**: Faster API responses
- ✅ **Database Indexing**: Optimized queries
- ✅ **Connection Pooling**: Efficient database connections

### Modern UI/UX
- ✅ **Tailwind CSS**: Utility-first styling
- ✅ **Custom Animations**: Smooth transitions and effects
- ✅ **Dark/Light Mode**: Theme switching with persistence
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **PWA Support**: Installable with offline capabilities
- ✅ **Modern Typography**: Clean, readable fonts

### Security & Reliability
- ✅ **JWT Authentication**: Secure user sessions
- ✅ **Rate Limiting**: API protection
- ✅ **Input Validation**: Data integrity
- ✅ **Error Handling**: Graceful error management
- ✅ **CORS Protection**: Cross-origin security
- ✅ **Password Hashing**: bcryptjs encryption

## 🚀 Deployment

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Checklist
- [ ] Set up MongoDB Atlas or production database
- [ ] Configure environment variables
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure domain and DNS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Test PWA installation
- [ ] Verify all API endpoints
- [ ] Test responsive design on all devices

## 📊 Performance Metrics

- **Bundle Size**: ~442KB (optimized with lazy loading)
- **First Contentful Paint**: < 2 seconds
- **API Response Time**: < 200ms (with caching)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Mobile Responsive**: 100% compatible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution
- All contributors and users of this application

---

**Built with ❤️ for better habits and personal growth**