# ✨ Fairytale: AI-Powered Fairy Tale Generator

Fairytale is a magical mobile application built with React Native (Expo) that weaves personalized bedtime stories for children. Using the latest OpenAI Responses API, the app allows parents to choose characters, settings, and moral lessons, instantly generating a unique fairy tale.

---

# ✨ Features

## 🪄 AI Story Generation

Users can generate unique fairytales by selecting:

- Main character
- Sidekick
- Setting
- Tone
- Moral
- Story length
- Target age

Stories are generated using an **LLM API**.

## 🧪 LLM Judge Quality Gate

Before a generated story is shown to the user, the app runs a second LLM call as a background judge.

The judge evaluates:

- Child safety
- Age appropriateness
- Prompt adherence
- Requested characters, setting, tone, length, and moral
- Story coherence

Only stories that pass the quality gate are returned to the UI.

---

## ❤️ Favorites

Users can save their favorite stories locally.

Features:

- Favorite / unfavorite stories
- Persistent storage
- Quick access from the Favorites tab

---

## 📖 Story Reader

Dedicated screen for reading generated stories.

Features:

- Clean reading UI
- Copy story to clipboard
- Favorite / unfavorite
- Delete story

---

## 🎨 Liquid Glass UI

The app uses a **modern "liquid glass" inspired UI**:

- Blur backgrounds
- Gradient aurora effects
- Soft translucent cards
- Smooth animations

Libraries used:

- `expo-blur`
- `expo-linear-gradient`
- `react-native-reanimated`

---

# 📱 Screens

| Screen        | Description                |
| ------------- | -------------------------- |
| **Create**    | Configure story parameters |
| **Generate**  | AI generates the story     |
| **Favorites** | Saved stories              |
| **Story**     | Full story reader          |

---

# 🛠 Tech Stack

## Core

- **React Native**
- **Expo**
- **Expo Router**

## AI

- LLM API integration via `fetch`

## Storage

- `AsyncStorage` for local persistence

## UI

- `expo-blur`
- `expo-linear-gradient`
- `react-native-reanimated`

## Haptics

- `expo-haptics`

## Clipboard

- `expo-clipboard`

---

# 🔐 Environment Variables

Create a `.env` file:
EXPO*PUBLIC_OPENAI_API_KEY=your_api_key_here
Expo exposes variables prefixed with `EXPO_PUBLIC*`.

The `.env` file is ignored in Git.

# 🚀 Running the Project

Install dependencies:
npm install
npx expo start -c

# 🎯 Purpose of This Project

This project demonstrates:

- Mobile AI integration
- Modern React Native architecture
- Expo Router navigation
- Local data persistence
- Clean UI patterns

# 📸 Demo

![Landing screen](screenshots/landing-screen.png)
![Generated story](screenshots/generated-story.png)
![Favorites](screenshots/favorites.png)
![Story](screenshots/story.png)

https://github.com/user-attachments/assets/58b6fb03-75f4-43e7-ad7b-ffb731637907
