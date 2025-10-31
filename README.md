<p align="center">
  <img src="images/logomodulo.png" alt="Logo Faculdade" width="150"/>
</p>

# 📝 Notepad Star Wars  

A **Star Wars-inspired notepad web application** where users can create, edit, and manage tasks with a galactic theme.  
This project includes **user authentication (login/register)**, secure storage of tasks in Firebase, and a themed frontend experience.  

---

## 🚀 Features  
- User **Registration & Login** (Firebase Authentication)  
- Create, edit, and delete personal tasks  
- Tasks stored safely in **Firebase Firestore**  
- Star Wars-inspired **UI and animations**  
- Responsive design with **HTML5 + CSS3 + Tailwind**  
- Interactive frontend powered by **Vanilla JavaScript (ES6)**  
- Full frontend-based CRUD operations with Firebase  

---

## 🛠️ Tech Stack  
### Frontend  
- **HTML5** – semantic structure  
- **CSS3** – custom styles, responsive layout, Star Wars theme  
- **Tailwind CSS** – fast and responsive styling  
- **Vanilla JavaScript (ES6)** – DOM manipulation and Firebase integration  

### Backend / Services  
- **Firebase Authentication** – login and registration  
- **Firebase Firestore** – cloud storage for tasks  

---

## Project Structure 

### Frontend
│
#### ├── frontend/
- │ ├── index.html                        # Home page with project presentation, login and registration modals
- │ ├── styles.css                        # Styles for index.html
- │ ├── script.js                         # Handles home page logic, login and registration functionality
- │ ├── lista.html                        # Page displaying user tasks
- │ └── lista.css                         # Styles for lista.html
- │ └── scripts/lista.js                  # Handles task listing, CRUD operations, and logout logic in lista.html

---

### Backend / Services
- │ ├── scripts/firebase-config.js        # Firebase configuration (API keys, project info)
- │ ├── scripts/firebase.js               # Firebase SDK initialization and exports
- │ ├── scripts/auth.js                   # User authentication: login, registration, logout
- │ ├── scripts/tarefas-service.js        # CRUD operations for Tasks collection in Firestore

#### └── README.md**

---

## 📝 CRUD of the Chosen Entity

### Chosen Entity: Tasks
We chose the **Tasks** entity because it is central to the app's functionality: the main goal of the project is to manage tasks efficiently, so this entity represents the core of the system.  

### Implemented Features
- **Listing**: View all registered tasks.  
- **Creation**: Form to add a new task.  
- **Details**: Page to view detailed information about each task.  
- **Update**: Edit existing tasks.  
- **Deletion**: Remove tasks from the database.  

### Database Integration
- **Firebase Firestore** is used as a cloud database to store all tasks.  
- **Firebase Authentication** handles user login and registration.  
- The frontend built with **HTML, CSS, and Tailwind** communicates directly with Firebase using JavaScript (SDK).

### Challenges Encountered
- Integrating Firebase Authentication and Firestore CRUD with Vanilla JavaScript.
- Handling real-time updates using `onSnapshot`.
- Implementing form validation and managing login/registration modals.
- Ensuring proper user authentication and secure access to tasks.

### Validation and Security
- Form validation using HTML5 and JavaScript to ensure required fields are filled.  
- User authentication and Firebase security rules guarantee that only logged-in users can access their tasks. 
- **Note:** Since this project uses Firebase Firestore (NoSQL), SQL injection is not applicable. Firebase security rules enforce secure access for authenticated users only.

---

## 🚀 Usage

1. Open `index.html` in a browser.  
2. Register a new account or log in with existing credentials.  
3. After login, you are automatically redirected to `lista.html` to view your tasks.  
4. Create a new task using the “Add Task” form.  
5. Edit or delete tasks directly from the list.  
6. Use the logout button to safely exit your session.

---

## Database Schema Diagram

**Represented as Firestore collections and documents**

![Diagram](images/digram-notepad-starwars.png)

---

## 🔒 Security Enhancement — User Access Levels

This update focuses on improving the system’s security by implementing **user access levels** through the `role` field in Firestore.

### 🧩 Implementation Details

- Added a new field `role` to the `users` collection in Firestore.
- When a user registers, the system automatically assigns:

  ```json
  {
    "email": "user@example.com",
    "name": "Luke Skywalker",
    "role": "user"
  }
  ```

The default role is `"user"`.

Administrators (`"admin"`) are managed directly through the **Firebase Console**, which already provides secure access to all data.

---

### ⚙️ CRUD Restrictions by Role

- **Users (`role: "user"`)** can only create, view, update, and delete their own tasks.  
- This is enforced by **Firestore Security Rules** that match each document to the authenticated user’s **UID**.  
- **Admins (`role: "admin"`)** have full database access through Firebase’s management interface.

---

### 🧱 Technical Approach

- Used **Firebase Authentication** for session control (acting as middleware for routes).  
- Used **Firestore Security Rules** to restrict access by user ID (UID).  
- Each user’s data and tasks are isolated — no user can read or modify another’s information.  
- Admin access is handled natively by Firebase, ensuring data integrity and safety.

---

### ✅ Why This Meets the Objective

This solution satisfies all the requirements:

- Added a `role` field to the users table.  
- Restricted CRUD actions according to user role.  
- Used session validation (**Firebase Auth**) as the middleware layer to control access.

---

# Change Log

| Version | Date       | Changes                                                                 |
|---------|-----------|-------------------------------------------------------------------------|
| 1.1.0   | 14/08/2025 | Project opening.                                                       |
| 1.2.0   | 15/08/2025 | ***Gabriel*** started the project and created the task page with basic task functionality. |
| 1.3.0   | 20/08/2025 | ***Sabrina*** created the README file containing technologies and project diagram. |
| 1.3.1   | 20/08/2025 | ***Gabriel*** made minor changes to `script.js`.                       |
| 1.4.0   | 01/09/2025 | ***Sabrina*** created the home page with basic project information.    |
| 1.4.1   | 01/09/2025 | ***Gabriel*** organized styles and scripts between the home and tasks pages. |
| 1.4.2   | 02/09/2025 | ***Gabriel*** corrected responsive style issues on the pages.          |
| 1.5.0   | 17/09/2025 | ***Sabrina*** improved aspects of the home page and launched login/register forms. |
| 1.6.0   | 25/09/2025 | ***Gabriel & Sabrina*** connected the pages to Firestore, enabling login and registration functionality. |
| 1.7.0   | 26/09/2025 | ***Gabriel*** connected the tasks CRUD system to Firestore.            |
| 1.7.1   | 29/09/2025 | ***Gabriel*** corrected minor issues on pages and updated the README.  |
| 1.8.0   | 20/10/2025 | ***Gabriel*** added role field to users, restricted CRUD by role, documented security rules in Firestore, and deployed the updates to Firebase Hosting.|
| 1.9.0   | 26/10/2025 | ***Gabriel*** added a page with the application's privacy policies and a contact form for users to contact the team.|
| 2.0.0   | 31/10/2025 | ***Gabriel*** added Star Wars-themed background music and sound effects with autoplay handling and user audio preferences. |


---

# 👨‍💻 Author

### Developed by [Sabrina dos Santos, Gabriel Victor Cardoso, Jéssica Akemy, Hugo Rocha, Maria Núbia, Thomas] ✨
May the Force (and the Code) be with You ⚡

---

## ⚙️ Installation & Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/notepad-star-wars/PROJETO_CSM.git
cd PROJETO_CSM
