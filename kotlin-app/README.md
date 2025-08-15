# StrictFocus Elite - Android Kotlin Edition

A high-performance, native Android implementation of the StrictFocus Elite productivity app built with modern Android development practices.

## 🏗️ Architecture

This app follows **Clean Architecture** principles with the following layers:

- **UI Layer**: Jetpack Compose screens and components
- **Domain Layer**: Business logic, use cases, and domain models
- **Data Layer**: Repository pattern with local (Room) and remote data sources

## 🛠️ Tech Stack

### Core
- **Kotlin** - 100% Kotlin codebase
- **Jetpack Compose** - Modern UI toolkit
- **Compose Material 3** - Material Design components
- **Coroutines & Flow** - Asynchronous programming

### Architecture
- **Hilt** - Dependency injection
- **Clean Architecture** - Separation of concerns
- **MVVM + MVI** - Reactive UI pattern

### Database & Storage
- **Room** - Local SQLite database
- **DataStore** - Key-value storage for preferences

### Networking
- **Retrofit** - REST API client
- **OkHttp** - HTTP client with logging

### Background Work
- **WorkManager** - Background task management
- **Foreground Service** - Long-running focus sessions

### Additional Libraries
- **Navigation Compose** - In-app navigation
- **Kotlinx DateTime** - Date/time handling
- **Kotlinx Serialization** - JSON serialization

## 📱 Features

### Core Functionality
- ✅ Task creation with natural language parsing
- ✅ AI-powered task validation and coaching
- ✅ Focus sessions with Pomodoro technique
- ✅ Offline-first architecture with sync
- ✅ Streak tracking and analytics
- ✅ Military/Casual mode themes

### Android-Specific
- ✅ Foreground service for uninterrupted focus sessions
- ✅ Rich notifications with quick actions
- ✅ Home screen widgets
- ✅ Dark/light theme support
- ✅ Adaptive icons and splash screen

## 🚀 Getting Started

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer
- Android SDK 26+ (minimum)
- Kotlin 2.0+

### Setup
1. Clone this repository
2. Open in Android Studio
3. Sync project with Gradle files
4. Run on emulator or device

### Build Variants
- **Debug**: Development builds with logging
- **Release**: Production builds with optimizations

## 📁 Project Structure

```
app/src/main/java/app/lovable/taskenforcerpro/
├── data/
│   ├── local/          # Room database, DAOs, entities
│   ├── remote/         # API services, DTOs
│   └── repository/     # Repository implementations
├── domain/
│   ├── model/          # Domain models
│   ├── repository/     # Repository interfaces
│   └── usecase/        # Business logic use cases
├── ui/
│   ├── components/     # Reusable Compose components
│   ├── screens/        # Feature screens
│   ├── navigation/     # Navigation setup
│   └── theme/          # Design system
├── service/            # Background services
├── worker/             # WorkManager workers
└── di/                 # Hilt modules
```

## 🎨 Design System

### Themes
- **Elite Mode**: Dark theme with military-grade aesthetics
- **Casual Mode**: Light theme with friendly, approachable design

### Colors
- Semantic color tokens following Material 3
- Dynamic theming support
- High contrast accessibility

### Typography
- Material 3 type system
- Custom font weights for emphasis
- Optimized readability

## 🔧 Configuration

### Build Configuration
```kotlin
android {
    compileSdk = 35
    defaultConfig {
        minSdk = 26
        targetSdk = 35
    }
}
```

### Dependency Management
- Version catalog in `gradle/libs.versions.toml`
- Centralized dependency management
- Automatic updates via Renovate

## 🧪 Testing

### Unit Tests
```bash
./gradlew test
```

### Instrumented Tests
```bash
./gradlew connectedAndroidTest
```

### Test Structure
- **Unit Tests**: Domain logic, view models
- **Integration Tests**: Repository and database
- **UI Tests**: Compose screens and user flows

## 📊 Performance

### Optimizations
- **Lazy loading** for large task lists
- **Image caching** for user avatars
- **Background sync** with WorkManager
- **Memory leak prevention** with lifecycle awareness

### Monitoring
- **Crashlytics** for crash reporting
- **Performance monitoring** with Firebase
- **ANR detection** and prevention

## 🔐 Security

### Data Protection
- **Encrypted preferences** for sensitive data
- **Certificate pinning** for API communications
- **Biometric authentication** for app access
- **Secure key storage** in Android Keystore

## 🌐 Sync & Offline

### Local-First
- Room database for offline storage
- Optimistic UI updates
- Conflict resolution strategies

### Cloud Sync
- Supabase backend integration
- Real-time synchronization
- Cross-device data consistency

## 📱 Platform Features

### Android Integration
- **Quick Settings Tile** for instant focus mode
- **Shortcuts** for common actions
- **Share Target** for capturing tasks from other apps
- **Intent Filters** for deep linking

### Notifications
- Rich notifications with progress updates
- Quick action buttons
- Custom notification sounds
- Do Not Disturb integration

## 🚀 Deployment

### Play Store
- Automated builds with GitHub Actions
- Staged rollouts for safe deployment
- Play Console integration

### Internal Testing
- Firebase App Distribution
- Alpha/Beta testing tracks
- Crash reporting and feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Follow Kotlin coding conventions
- Use detekt for static analysis
- Format code with ktlint

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our Discord community