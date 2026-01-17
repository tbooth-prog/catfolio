# catfol.io 🐾

**catfol.io** is a single-page React application for uploading, browsing, and curating cat images.  
Users can upload their own cats, vote them up or down, favourite them, and see live scores based on community feedback.

This project was built as part of a technical interview challenge, with a focus on clean architecture, modern frontend practices, and a production-quality user experience.

---

## ✨ Features

- Upload new cat images
- View previously uploaded cats in a responsive grid
- Favourite / unfavourite cats
- Vote cats up or down
- Display live scores based on votes
- Client-side validation and API error handling
- Responsive design down to mobile viewports

---

## 🛠 Tech Stack

- **React** (SPA)
- **TypeScript** (for safety and maintainability)
- **React Router** (routing)
- **Fetch / Axios** (API communication)
- **CSS Modules / Styled Components / Tailwind** *(pick one)*
- **Jest + React Testing Library** *(key components & logic)*

External API powered by:  
👉 https://thecatapi.com/

---

## 🧠 Architecture & Approach

- Clear separation between **UI components**, **API services**, and **application state**
- Reusable presentational components for cat cards and controls
- API interactions abstracted into a dedicated service layer
- Optimistic UI updates for voting and favouriting where appropriate
- Graceful loading and error states throughout the app

---

## 🧪 Testing

Tests focus on:
- Core user interactions (voting, favouriting)
- Key components rendering correctly with API data
- Error and loading state handling

The goal was meaningful coverage rather than exhaustive testing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- The Cat API key (free)

### Installation

```bash
git clone https://github.com/your-username/catfol.io.git
cd catfol.io
npm install
