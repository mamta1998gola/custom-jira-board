# Jira-like Kanban Board

## Overview
This project is a **Jira-like Kanban Board** built using **React TypeScript** for the frontend and **Python Flask** for the backend, with **SQLite** as the database. The application allows users to manage software development tasks using a **Kanban Board** layout, enabling backlog management and sprint planning.

## Features
### **Kanban Board Structure**
- **Left Navigation Sections:**
  - Backlogs
  - Active Sprint

### **Backlog Page**
- Users can create backlog items such as:
  - **Story**
  - **Task**
  - **Bug**
- Each backlog item includes:
  - **Title**
  - **Description**
  - **Comments Section**
- Option to create a **Sprint** with:
  - Default naming (e.g., Sprint 1, Sprint 2, ...)
  - Duration of **10 working days**, excluding weekends (Saturday and Sunday)
- Backlogs can be **moved to an active sprint or any created sprint**

### **Active Sprint Page**
- Displays three columns:
  - **To Do**
  - **In Progress**
  - **Done**
- Users can:
  - **Drag & Drop** tasks between stages
  - **Open a task and change its status** manually
- Sprint Closure:
  - Moves unfinished tasks (To Do & In Progress) to the next sprint (if created)
  - Prompts the user to create a new sprint if none exists

## **Tech Stack**
### **Frontend (React TypeScript)**
- React with TypeScript
- Styled to match Jira’s UI/UX
- State management for handling sprint & task updates

### **Backend (Python Flask)**
- Flask for API endpoints
- RESTful services for handling backlog and sprint data
- SQLite for data persistence

### **Database (SQLite)**
- Stores backlog items, sprints, and statuses

## **Installation & Setup**
### **Backend (Flask API)**
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/kanban-board.git
   cd kanban-board/backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # For Mac/Linux
   venv\Scripts\activate  # For Windows
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```sh
   flask run
   ```

### **Frontend (React TypeScript App)**
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```

## **Usage**
- Access the app at `http://localhost:3000`
- Use the backlog page to create tasks and sprints
- Move tasks between different sprint stages
- Close sprints and carry forward pending tasks

## **Project Structure**
```
kanban-board/
│── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── database.db
│   ├── requirements.txt
│   ├── .env
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│── .gitignore
│── README.md
```

## **License**
This project is open-source under the MIT License.

---

### **Future Enhancements**
- User authentication & authorization
- Real-time updates using WebSockets
- Customizable board views

### **Contributions**
Feel free to fork this project, submit issues, or create pull requests!

---

### **Contact**
For questions or collaborations, reach out at [your-email@example.com].

