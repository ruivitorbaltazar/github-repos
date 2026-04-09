# 📱 Pink Room - GitHub Repositories Explorer

A React Native application that allows users to browse, search, and explore GitHub repositories, built as part of a technical challenge.

---

## 🚀 Features

### ✅ Core Requirements

* Fetch repositories from GitHub API
* Sort repositories by stars
* Display repository list
* Periodically refresh data

### ✨ Enhancements

* 🔍 Debounced search
* 🏷️ Language filters
* 📄 Repository details screen ( > React Navigation)
<!-- * 🌙 Dark mode support !TODO! -->
* ⚡ Smooth UX with cached data ( > React Query)
* 📶 Offline support (last known data persisted) ( > React Query)

---

## 🧱 Tech Stack

* **React Native (Expo)**
* **TypeScript**
* **TanStack Query** – data fetching & caching
* **React Navigation** – navigation
<!-- * **NativeWind** – styling !TODO! -->

---

## 🧠 Architecture

The app follows a simple and scalable structure:

```
/src
  /api        → API calls
  /hooks      → React Query hooks
  /components → UI components
  /screens    → Screens
  /navigation → Navigation setup
  /types      → TypeScript types
```

### 🔑 Key decisions:

* **Separation of concerns** (API, UI, state)
* **Custom hooks** for data fetching
* **Centralized types** for consistency

---

## 🔍 Search & Filtering

* Search input is **debounced** to prevent excessive API calls
* Filters are applied via **React Query query keys**

---

## 🎣 Data Fetching Strategy

* Data fetched using **React Query**
* Automatic background refetching (every 60 seconds)
* Cache configured for performance

---

## 📶 Offline Support

* Uses `placeholderData` to preserve previous results during refetch
* Last known data is available when offline
* Data automatically refreshes when connection is restored

---

## 🎨 UI & UX

* Text truncation for long content
* Loading skeletons for better perceived performance
<!-- * Dark mode support TODO -->

---

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Start the app on ios
npm run ios

# Start the app on android
npm run android
```

---

## 🔗 API

Uses GitHub Search API:

https://api.github.com/search/repositories

Example query:

```
q=language:typescript&sort=stars
```

---

## 🤔 Trade-offs & Decisions

* Used Expo for faster development and simplicity
* Reused list data in details screen instead of refetching for performance
* Focused on UX polish over adding excessive features

---

## 🚧 Possible Improvements

* Pagination / infinite scroll
* Advanced filtering (stars, date, etc.)
* Repository bookmarking
* Unit and integration tests

---

## 🙌 Final Notes

The goal of this project was to build a clean, performant, and user-friendly application while making thoughtful technical decisions.

---

Thanks for reviewing! 🚀
