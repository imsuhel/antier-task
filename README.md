# Antier Task - E-commerce Mobile App

A feature-rich e-commerce mobile application built with React Native, Redux Toolkit, and TypeScript. This app showcases product listing, category filtering, search functionality, and product details.

## 🚀 Features

- **Product Catalog**: Browse through a wide range of products with beautiful card layouts
- **Category Filtering**: Filter products by categories
- **Search Functionality**: Find products using real-time search
- **Product Details**: View detailed information about each product
- **Offline Support**: View recently loaded content even without an internet connection
- **Responsive Design**: Optimized for both iOS and Android devices
- **Smooth Animations**: Enhanced user experience with smooth transitions and animations

## 🛠 Tech Stack

- **Frontend**: React Native
- **State Management**: Redux Toolkit
- **Type Checking**: TypeScript
- **Navigation**: React Navigation
- **API Client**: Axios
- **Image Handling**: react-native-fast-image
- **Styling**: StyleSheet with responsive scaling
- **Caching**: AsyncStorage with custom cache layer

## 📱 Screenshots

_(Screenshots will be added here)_

## 📦 Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- JDK 11 or later

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## 🚀 Getting Started

### 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SuhelIndiIt/antier-task.git
   cd antier-task
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # OR using Yarn
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## 🏃‍♂️ Running the App

### Android

```bash
# Start Metro
npm start
# In a new terminal
npm run android
```

### iOS

```bash
# Start Metro
npm start
# In a new terminal
cd ios && pod install && cd ..
npm run ios
```

## 🔧 Configuration

The app is configured to work with the DummyJSON API by default. No additional configuration is needed for development.

## 📂 Project Structure

```
src/
├── api/               # API client and endpoints
├── assets/            # Images, fonts, etc.
├── components/        # Reusable components
├── hooks/             # Custom React hooks
├── navigation/        # Navigation configuration
├── screens/           # App screens
├── services/          # Business logic and services
├── store/             # Redux store configuration
├── theme/             # Colors, typography, and theming
├── types/             # TypeScript type definitions
└── utils/             # Utility functions and helpers
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📥 Download Release Builds

You can download the latest release builds of the app from the following links:

### Android

- [Download APK](https://github.com/SuhelIndiIt/antier-task/releases/latest/download/app-release.apk)
- [All Releases](https://github.com/SuhelIndiIt/antier-task/releases)

### iOS

For iOS, you'll need to build the app from source using Xcode as it requires code signing with an Apple Developer account.

## 👏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for the free test API
- React Native community for awesome tools and libraries

## Troubleshooting

If you're having issues getting the app to run, try the following:

1. Clear Metro bundler cache:
   ```bash
   npm start -- --reset-cache
   ```
2. Clean and rebuild the project:

   ```bash
   # For Android
   cd android && ./gradlew clean && cd ..

   # For iOS
   cd ios && pod deintegrate && pod install && cd ..
   ```

3. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

For more help, check out the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
