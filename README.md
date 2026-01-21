# catfol.io 🐾

**catfol.io** is a single-page React application for uploading, browsing, and curating cat images.  
Users can upload their own cats, vote them up or down, favourite them, and see live scores based on community feedback.  
A “Dog Mode” is also available for dog lovers!

This project was built as part of a technical interview challenge, with a focus on clean architecture, modern frontend practices, and a production-quality user experience.

---

## ✨ Features

- Upload new cat (or dog!) images
- View uploaded images in a responsive, infinite-scrolling masonry grid
- Favourite / unfavourite images
- Vote images up or down, with live score updates
- Filter by all images, your uploads, favourites, or top-rated
- Client-side validation and robust API error handling
- Optimistic UI updates for a snappy experience
- “Dog Mode” toggle for a fun theme switch
- Responsive design down to mobile viewports

---

## 🛠 Tech Stack

- **React** (SPA, functional components)
- **TypeScript** (type safety)
- **React Router v7** (routing, layouts, loaders)
- **Redux Toolkit** (state management)
- **Tailwind CSS** (utility-first styling)
- **react-aria-components** (accessible UI primitives)
- **Vite** (build tool)
- **@thatapicompany/thecatapi** (API client)
- **lucide-react** (icons)
- **react-masonry-css** (masonry grid)
- **Motion One** (animations)

External API powered by:  
👉 https://thecatapi.com/

---

## 🧠 Architecture & Approach

- Clear separation between **UI components**, **API services**, and **Redux state**
- All API interactions abstracted into a dedicated service layer
- Presentational and control components for modularity and reuse
- Optimistic UI updates for voting, favouriting, and uploads
- Graceful loading and error states throughout the app
- “Dog Mode” implemented via context and theme switching

---

## 🧪 Testing

> **Note:** Automated tests are not included in this codebase.  
> The architecture is designed for testability, with Redux slices and pure functions, but no Jest or React Testing Library tests are present.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- The Cat API key (free, from https://thecatapi.com/)
- The Dog API key (free, from https://thedogapi.com/)

### Installation

```bash
git clone https://github.com/your-username/catfol.io.git
cd catfol.io
pnpm add
```

### Running the App

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (or as indicated in your terminal).

### Environment Variables

Create a `.env` file in the project root with your Cat API key:

```
VITE_CAT_API_BASE_URL=https://api.thecatapi.com/v1
VITE_CAT_API_KEY=your-cat-api-key-here

VITE_DOG_API_BASE_URL=https://api.thedogapi.com/v1
VITE_DOG_API_KEY=your-dog-api-key-here
```

---

## 📦 Deployment



---

## 📁 Project Structure

```
app/
  api/         # API endpoint helpers and types
  components/  # UI components (aria, controls, ui)
  context/     # React context (Dog Mode)
  layouts/     # Layout components
  pages/       # Route pages (Index, Upload, NotFound)
  service/     # API client abstraction
  store/       # Redux slices and types
  utils/       # Utility functions and enums
public/        # Static assets
```

---

## 🐾 Credits

- Cat images and voting API: [thecatapi.com](https://thecatapi.com/)
- Dog images and voting API: [thecatapi.com](https://thedogapi.com/)

---