# 🚀 BudgetWise Backend - Rebuilt from Scratch

## ✨ What's New

This backend has been completely rebuilt from scratch with:
- **Clean Architecture** - Proper separation of concerns
- **Modern Spring Boot 3.2.2** - Latest stable version
- **Professional Code Structure** - Industry best practices
- **Minimal Dependencies** - Only what's needed
- **H2 Database** - Zero configuration for development
- **JWT Security** - Secure authentication
- **Email OTP** - Two-factor authentication
- **RESTful APIs** - Clean API design

## 🏗️ Architecture

```
backend/
├── src/main/java/com/budgetwise/
│   ├── entity/          # JPA Entities
│   │   ├── User.java
│   │   ├── Category.java
│   │   └── Transaction.java
│   ├── dto/             # Data Transfer Objects
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── TransactionRequest.java
│   │   └── ...
│   ├── repository/      # Data Access Layer
│   │   ├── UserRepository.java
│   │   ├── CategoryRepository.java
│   │   └── TransactionRepository.java
│   ├── service/         # Business Logic
│   │   ├── UserService.java
│   │   ├── TransactionService.java
│   │   ├── CategoryService.java
│   │   └── EmailService.java
│   ├── controller/      # REST Controllers
│   │   ├── AuthController.java
│   │   ├── TransactionController.java
│   │   ├── CategoryController.java
│   │   ├── AIController.java
│   │   └── TestController.java
│   ├── security/        # Security Configuration
│   │   ├── JwtUtil.java
│   │   └── JwtAuthenticationFilter.java
│   ├── config/          # Spring Configuration
│   │   └── SecurityConfig.java
│   └── BudgetWiseApplication.java
└── src/main/resources/
    └── application.properties
```

## 🚀 Quick Start

### Option 1: Use Startup Script
```bash
START_BACKEND.bat
```

### Option 2: Manual Start
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

## 🔗 API Endpoints

### Health Check
- `GET /api/test/health` - Backend health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP and login

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/recent` - Get recent 6 transactions
- `GET /api/transactions/stats` - Get transaction statistics
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create custom category

### AI Features
- `GET /api/ai/insights` - Get AI insights
- `POST /api/ai/chat` - Chat with AI advisor

### Profile
- `GET /api/profile` - Get user profile

## 🗄️ Database

### H2 (Development)
- **URL**: `jdbc:h2:mem:budgetwise`
- **Console**: http://localhost:8081/h2-console
- **Username**: `sa`
- **Password**: (empty)

### Default Categories
The system automatically creates 12 default categories:
- 🍽️ Food & Dining
- 🚗 Transportation  
- 🛍️ Shopping
- 🎬 Entertainment
- 💡 Bills & Utilities
- 🏥 Healthcare
- 📚 Education
- ✈️ Travel
- 💰 Salary
- 📈 Investment
- 🎁 Gift
- 📝 Other

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **OTP Verification** - Email-based 2FA
- **Password Hashing** - BCrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Request validation

## 📧 Email Configuration

Update `application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## 🤖 AI Features

The AI controller provides:
- **Smart Insights** - Financial advice based on spending
- **Chat Interface** - Ask questions about finances
- **Fallback Responses** - Works without external AI API

## 🛠️ Development

### Prerequisites
- Java 17+
- Maven 3.6+

### Build Commands
```bash
mvn clean compile    # Compile
mvn test            # Run tests
mvn package         # Build JAR
mvn spring-boot:run # Run application
```

### Configuration
Key properties in `application.properties`:
```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:budgetwise
jwt.secret=your-secret-key
jwt.expiration=86400000
spring.mail.host=smtp.gmail.com
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Email Issues
- Check Gmail app password
- Verify SMTP settings
- Check firewall/antivirus

### Database Issues
- H2 console: http://localhost:8081/h2-console
- Check connection URL: `jdbc:h2:mem:budgetwise`

## 📊 API Testing

### Register User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Health Check
```bash
curl http://localhost:8081/api/test/health
```

## 🎯 Features

### ✅ Implemented
- User registration & authentication
- OTP-based login
- Transaction CRUD operations
- Category management
- Transaction statistics
- AI chat interface
- Email notifications
- JWT security
- Input validation
- Error handling

### 🔄 Ready for Enhancement
- File upload/export
- Advanced analytics
- Budget management
- Recurring transactions
- Multi-currency support
- Advanced AI integration

## 📝 Notes

- **Clean Codebase** - Professional, maintainable code
- **Zero Configuration** - Works out of the box
- **Production Ready** - Proper error handling and validation
- **Scalable Architecture** - Easy to extend and modify
- **Modern Stack** - Latest Spring Boot and Java features

## 🚀 Next Steps

1. Start the backend: `START_BACKEND.bat`
2. Test health endpoint: http://localhost:8081/api/test/health
3. Access H2 console: http://localhost:8081/h2-console
4. Start the frontend and test full integration

The backend is now completely rebuilt with clean, professional code that follows industry best practices!