# TODOAPP

A modern, feature-rich Todo application built with React Native and TypeScript. This mobile application helps users manage their tasks efficiently with a clean and intuitive interface.

## Features

- 📱 Cross-platform (iOS and Android) support
- 🔐 Authentication with local biometrics
- ✨ Clean and intuitive user interface
- 📋 Create, read, update, and delete todos
- 🎨 Modern UI with NativeWind (Tailwind CSS for React Native)
- 🌐 Internationalization support with i18next
- 💾 Persistent storage with AsyncStorage
- 🔄 State management with Zustand

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Xcode (for iOS development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/cuongitc1598/TODOAPP.git
cd TODOAPP
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS pods (for iOS development):
```bash
cd ios && pod install && cd ..
```

## Running the App

Start the development server:

```bash
npm start
# or
yarn start
```

To run on specific platforms:

```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── navigation/      # Navigation configuration
├── screens/         # Screen components
├── service/         # API and service layer
├── store/          # State management
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Technologies Used

- React Native
- TypeScript
- Expo
- React Navigation
- NativeWind
- Zustand (State Management)
- i18next (Internationalization)
- Jest (Testing)
- Expo Local Authentication
- AsyncStorage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@cuongitc1598](https://github.com/cuongitc1598)

Project Link: [https://github.com/cuongitc1598/TODOAPP](https://github.com/cuongitc1598/TODOAPP)