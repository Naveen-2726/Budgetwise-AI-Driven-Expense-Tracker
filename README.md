# 💰 BudgetWise - AI-Powered Expense Tracker

Complete full-stack personal finance management application with AI insights, real-time analytics, and dark mode support.

## ✨ Features

### 🎨 UI/UX
- **Professional Landing Page** - Modern gradient design with animations
- **Dark/Light Theme** - Toggle between themes with persistent storage
- **Responsive Design** - Works on all devices
- **Smooth Animations** - Framer Motion powered transitions
- **Beautiful Charts** - Interactive Recharts visualizations

### 🔐 Security
- **2FA Authentication** - OTP-based email verification
- **JWT Tokens** - Secure session management (24h expiration)
- **BCrypt Passwords** - Industry-standard encryption
- **SHA-256 OTP** - Hashed one-time passwords
- **Rate Limiting** - Protection against brute force

### 🤖 AI Features
- **Smart Insights** - AI-powered spending analysis
- **Financial Advisor Chat** - Ask questions about your finances
- **Budget Recommendations** - Personalized savings tips
- **OpenRouter Integration** - Llama 3.1 8B model support

### 📊 Analytics
- **Real-Time Charts** - Pie charts, bar charts, progress bars
- **Category Breakdown** - Visual spending distribution
- **Monthly Statistics** - Income, expenses, cashflow tracking
- **Transaction History** - Complete audit trail

### 💳 Transaction Management
- **CRUD Operations** - Create, read, update, delete
- **Multiple Payment Methods** - Cash, cards, transfers, wallets
- **Smart Categories** - 30+ pre-seeded categories with emojis
- **Date Filtering** - View transactions by period

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+


#### Backend
```bash
cd backend
mvn spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```


## 🎯 Usage Flow

1. **Visit** http://localhost:5173
2. **Register** - Create your account
3. **Verify** - Enter OTP from email
4. **Login** - Use email + OTP
5. **Dashboard** - Start tracking expenses!

## 🎨 Features Showcase

### Landing Page
- Hero section with CTA
- Feature cards
- Statistics display
- Professional footer

### Dashboard
- **Dashboard Tab** - Overview with stats and charts
- **Transactions Tab** - Complete transaction list
- **Analytics Tab** - Detailed spending analysis
- **AI Insights Tab** - Chat with AI advisor
- **Categories Tab** - Browse all categories

### Dark Mode
- Toggle in sidebar
- Persistent across sessions
- Smooth transitions
- All components supported

## 🗄️ Database

### H2 (Default - Development)
- In-memory database
- No setup required
- Auto-creates schema
- Perfect for testing

### MySQL (Production)
Update `application-mysql.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

Run with:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## 🤖 AI Configuration (Optional)

Get free API key from [OpenRouter](https://openrouter.ai/)

Add to `application.properties`:
```properties
openrouter.api.key=your-key-here
```

Without API key, AI uses local fallback responses.

## 📦 Tech Stack

### Backend
- Spring Boot 3.5.10
- Spring Security + JWT
- Spring Data JPA
- MySQL / H2
- JavaMailSender
- WebSocket (STOMP)
- OpenRouter AI

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router v6

## 🎨 Color Scheme

### Light Mode
- Background: Gray-50
- Cards: White
- Text: Gray-900
- Accents: Blue-600, Purple-600

### Dark Mode
- Background: Gray-900
- Cards: Gray-800
- Text: White
- Accents: Blue-400, Purple-400

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Security Features

- ✅ Password hashing (BCrypt)
- ✅ OTP verification (SHA-256)
- ✅ JWT authentication
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Request OTP
- `POST /api/auth/verify-otp` - Verify and login

### Transactions
- `GET /api/transactions` - List all
- `GET /api/transactions/recent` - Last 6
- `GET /api/transactions/stats` - Statistics
- `POST /api/transactions` - Create
- `PUT /api/transactions/{id}` - Update
- `DELETE /api/transactions/{id}` - Delete

### AI
- `GET /api/ai/insights` - Get AI insights
- `POST /api/ai/chat` - Chat with AI

### Categories
- `GET /api/categories` - List all
- `POST /api/categories` - Create custom

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile

## 🎯 Project Structure

```
BudgetWise/
├── backend/
│   ├── src/main/java/com/budgetwise/
│   │   ├── controller/     # REST endpoints
│   │   ├── service/        # Business logic
│   │   ├── model/          # Entities
│   │   ├── repository/     # Data access
│   │   ├── security/       # JWT & auth
│   │   └── config/         # Configuration
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # State management
│   │   └── services/       # API calls
│   └── package.json
└── START_ALL.bat           # Quick start script
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### OTP Not Received
- Check spam folder
- Verify email config
- Check backend logs

### Dark Mode Not Working
- Clear browser cache
- Check localStorage
- Refresh page

## 🚀 Production Deployment

### Backend
1. Update JWT secret (512+ bits)
2. Configure production database
3. Set up proper email service
4. Enable HTTPS
5. Build: `mvn clean package`
6. Deploy JAR file

### Frontend
1. Update API URL in `.env`
2. Build: `npm run build`
3. Deploy `dist/` folder
4. Configure CDN

## 📈 Performance

- Backend startup: ~10 seconds
- Frontend build: ~5 seconds
- Page load: < 1 second
- API response: < 100ms
- Real-time updates: 30 seconds

## 🎓 Learning Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [OpenRouter AI](https://openrouter.ai/)

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Please open an issue first.

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review backend logs
- Check browser console
- Verify all services running

---

**Built with ❤️ using Spring Boot, React, and AI**

🌟 Star this repo if you find it helpful!
