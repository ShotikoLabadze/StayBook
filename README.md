# ✈️ StayBook - Smart Travel Planner Platform

StayBook is a modern, full-stack, real-time travel planning platform designed to transform how people discover destinations, build itineraries, manage trip budgets, and collaborate with friends. Inspired by the best UX patterns of Airbnb, Google Maps, Notion, and Tripadvisor, StayBook offers a fluid, interactive, and highly performant experience for modern travelers.

---

## 🚀 Features

### 🔐 1. Authentication & User System
* **Secure Auth:** JWT-based authentication with protected server and client routes.
* **User Profiles:** Custom user profiles with avatar uploads, saved trips, and a personalized favorites dashboard.

### 🌍 2. Destination Discovery & Details
* **Advanced Filtering:** Search and filter destinations by budget, weather, activities, and duration.
* **Rich Details Page:** Immersive hero galleries, overview sections, local travel tips, best seasons to visit, and integrated user reviews.

### 🗺️ 3. Interactive Map System (Mapbox / Leaflet)
* **Dynamic Routing:** Day-by-day itinerary route visualization and distance calculations.
* **Custom Markers:** Tailored markers for hotels, popular attractions, and restaurants with geolocation support.

### 📅 4. Advanced Trip Planner & UI
* **Drag & Drop Itinerary:** Fluid Kanban-style and timeline layouts to organize daily activities effortlessly.
* **Rich Media Notes:** Attach files, images, and custom notes to any scheduled activity.

### 🤖 5. Smart AI Features (Powered by Gemini)
* **AI Itinerary Generator:** Generate automated, smart travel itineraries based on budget, duration, and interests using the Google Gemini API.
* **Smart Suggestions:** Get tailored destination and activity recommendations on the fly.

### 💰 6. Smart Budget Management
* **Expense Tracking:** Category breakdowns (Hotels, Flights, Food, Transport, Activities) with currency conversion.
* **Analytics Dashboard:** Visual representation of spending via charts and interactive progress bars.

### 👥 7. Real-Time Collaboration & Notifications
* **Live Editing:** Multiple users can edit the same itinerary simultaneously with real-time indicators via WebSockets.
* **Interactions:** Comment threads and reactions on specific activities.
* **Instant Notifications:** Real-time toast system for trip reminders and collaborative updates.

### 🎨 8. Modern UI/UX Architecture
* **Theme Support:** Fully accessible Dark/Light mode toggle.
* **Micro-interactions:** Powered by Framer Motion with smooth transitions, custom loading skeletons, and empty states.
* **Command Palette:** Global search and quick-action command menu (`Ctrl + K` / `Cmd + K`).

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Shadcn UI / PostCSS)
* **Animations:** Framer Motion
* **State Management & Data Fetching:** Zustand, Context API & TanStack Query (React Query)
* **Mapping:** Mapbox GL / Leaflet
* **Drag and Drop:** @hello-pangea/dnd / React DnD

### Backend
* **Framework:** NestJS (Progressive Node.js framework)
* **Language:** TypeScript
* **Database & ORM:** MongoDB & Mongoose
* **Real-time Communication:** Socket.io (WebSockets)
* **AI Integration:** Google Gemini API
* **Security:** Passport.js, JWT, bcrypt

---

## 📂 Project Architecture

```text
StayBook/
├── backend/                    # NestJS Server Application
│   ├── src/                    # App source code (Modules, Controllers, Services)
│   ├── test/                   # Unit & E2E tests
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js Client Application
│   ├── app/                    # App Router (Pages, Layouts & Route Handlers)
│   ├── components/             # Reusable UI & Feature-specific Components
│   ├── context/                # Global React Context providers
│   ├── services/               # API client services & Axios configuration
│   ├── store/                  # Zustand global state management
│   ├── public/                 # Static assets (images, icons, etc.)
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── .gitattributes
```

---

## ⚙️ Environment Configuration

To run this project locally, you need to configure the following environment variables. Create a `.env` file in both the `frontend` and `backend` directories.

### Backend (`/backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<password>@todo.6i4nyqr.mongodb.net/StayBook?appName=todo
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_ai_api_key
CORS_ORIGIN=https://stay-book-kohl.vercel.app
```

### Frontend (`/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=https://stay-book-kohl.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://stay-book-kohl.vercel.app
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

> ⚠️ **Note:** Security best practice — never commit actual production secrets or API keys to GitHub. Use the variables above as a template for your local configuration.

---

## 🏃‍♂️ Getting Started

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Instance (Local or Atlas)

### Installation & Setup

**1. Clone the repository:**
```bash
git clone https://github.com/ShotikoLabadze/StayBook.git
cd StayBook
```

**2. Setup Backend:**
```bash
cd backend
npm install
# Run in development mode
npm run start:dev
```

**3. Setup Frontend:**
```bash
cd ../frontend
npm install
# Run in development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore StayBook!

---

## 📄 License

This project is open source and available for personal and educational use.
