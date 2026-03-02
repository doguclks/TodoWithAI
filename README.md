# TickIt! (AntiGravity Todo)

TickIt! is a premium, high-performance To-Do application built with a modern tech stack and a **Clean Architecture** approach. It features a dynamic Kanban board, multi-language support, and a robust **JWT-based Authentication** system.

## 🌟 Key Features

- **JWT Authentication:** Secure user registration and login powered by .NET Identity and JWT Bearer tokens.
- **Data Isolation:** Every user has their own private space. Todos and tasks are strictly scoped to the authenticated user.
- **Kanban Board:** Interactive drag-and-drop workspace for managing tasks across "Todo", "In Progress", and "Done" states.
- **Clean Architecture:** Backend organized into Domain, Application, Infrastructure, and API layers for maximum maintainability.
- **Dynamic Dashboards:** Organize your life into multiple boards with custom titles and emoji icons.
- **Multi-language (i18n):** Full support for English and Turkish with instant switching.
- **Theme Support:** Polished Dark and Light modes using Mantine's advanced theme system.
- **Unit Testing:** Comprehensive test suite for both Backend (XUnit) and Frontend (Vitest).

## 🛠️ Tech Stack

### **Backend (.NET 9)**
- **Architecture:** Clean Architecture (Domain-Driven Design principles)
- **Identity:** ASP.NET Core Identity for secure user management
- **Security:** JWT (JSON Web Tokens) for stateless authentication
- **ORM:** Entity Framework Core
- **Testing:** XUnit & Moq for unit and integration tests

### **Frontend (React + Vite)**
- **UI Framework:** Mantine v7 (Premium component library)
- **State Mgmt:** React Context API (Auth & Locale)
- **Animations:** Custom CSS transitions & Mantine transitions
- **Drag & Drop:** `@hello-pangea/dnd`
- **i18n:** `react-intl`

## 📂 Project Structure (Clean Architecture)

- **`Backend/`**
  - `src/TodoWithAI.Domain/`: Enterprise logic, Entities, Enums.
  - `src/TodoWithAI.Application/`: DTOs, Business logic interfaces, Services.
  - `src/TodoWithAI.Infrastructure/`: Data access (EF Core), Repository implementations, Migrations.
  - `src/TodoWithAI.API/`: Controllers, JWT Config, Middleware.
  - `tests/TodoWithAI.Tests.Unit/`: Backend unit tests.
- **`Frontend/`**
  - `src/api/`: Typed Axios services and interceptors.
  - `src/contexts/`: Global Auth and Locale states.
  - `src/pages/`: Unified AuthPage, Dashboard, and Boards.
  - `src/test/`: Vitest component tests.

## ⚙️ Development Setup

### **Backend Setup**
1. Navigate to `Backend/`
2. Update `appsettings.Development.json` with your connection string (default uses LocalDB/SQLite).
3. Apply migrations:
   ```bash
   dotnet ef database update --project src/TodoWithAI.Infrastructure --startup-project src/TodoWithAI.API
   ```
4. Run:
   ```bash
   dotnet run --project src/TodoWithAI.API
   ```

### **Frontend Setup**
1. Navigate to `Frontend/`
2. Install dependencies: `npm install`
3. Run: `npm run dev`

### **Running Tests**
- **Backend:** `dotnet test`
- **Frontend:** `npm test`

---

## 📸 Preview

### **Premium Auth Experience**
The login and register experience is integrated into a single, high-fidelity split-screen page with localized error handling and smooth animations.

- <img width="1869" height="917" alt="Auth Page" src="https://github.com/user-attachments/assets/92363aca-e5c4-4d50-bf5d-0f821f45a345" />

### **Main Dashboard**
- <img width="1875" height="916" alt="Dashboard" src="https://github.com/user-attachments/assets/b032fcf0-6425-41ef-970b-539080b8d0e2" />
