# TickIt! (AntiGravity Todo)

TickIt! is a modern, dynamic, and fully responsive To-Do application featuring a Kanban board with drag-and-drop capabilities. Built with a .NET 9 Web API backend and a Vite + React frontend, it emphasizes a sleek UI, high performance, and user-centric features.

## 🚀 Features

- **Kanban Board:** Organize tasks visually with drag-and-drop functionality using `@hello-pangea/dnd`.
- **Dynamic Pages (Sidebar):** Create multiple "Todo" pages to group different tasks.
- **Real-time Sync:** Renaming a page or changing its emoji icon in the sidebar instantly updates the main view.
- **Customizable Icons:** Use a built-in emoji-picker to set custom icons for your Todo pages.
- **Multi-language Support (i18n):** Easily switch between English and Turkish using intuitive flag icons.
- **Dark & Light Mode:** Seamlessly toggle between dark and light themes (powered by Mantine).
- **Modern UI:** Built with Mantine UI components and Tabler Icons for a polished, accessible user experience.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Mantine v7](https://mantine.dev/) (UI Components & Hooks)
- [Axios](https://axios-http.com/) (API Requests)
- `react-router-dom` (Routing)
- `react-intl` (Internationalization/i18n)
- `emoji-picker-react` (Emoji selector)
- `@hello-pangea/dnd` (Drag and Drop)

**Backend:**
- .NET 9 Web API
- Entity Framework Core (Code-First)
- SQLite (or your configured database provider)
- Repository Pattern & Service Layer

## 📂 Project Structure

- **`Frontend/`**: Contains the React + Vite application.
- **`Backend/`**: Contains the .NET 9 Web API project and Solution file (`Todo_AntiGravity.sln`).

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- .NET 9 SDK

### Backend Setup
1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Apply Entity Framework migrations to setup the database:
   ```bash
   dotnet ef database update
   ```
3. Run the API:
   ```bash
   dotnet run
   ```
   *The backend typically runs on `http://localhost:5202`.*

### Frontend Setup
1. Open a new terminal and navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. If it crashes upon reloading with Chrome DevTools open, make sure `usePolling: true` is enabled in `vite.config.ts`.*

## 📸 Usage
- **Add a Page:** Click "Add New Page" in the sidebar to create a fresh board.
- **Edit Page Title:** Double click the page name in the sidebar.
- **Change Icon:** Click the emoji next to the page name in the sidebar.
- **Delete Page:** Right-click on a page name in the sidebar to delete it.
- **Manage Tasks:** Type a task into the input box and use the Kanban board to drag it between "Todo", "In Progress", and "Done".

---

*Made with ❤️ by AntiGravity AI*
