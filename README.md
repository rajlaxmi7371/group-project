
# NextStep 🎯

**NextStep** is an internship tracking platform that helps students search, apply for internships, and track their application status.  
Admins can manage internship listings, user applications, and platform feedback from a dedicated dashboard.

---

## 👥 Team Members
- Rajlaxmi ([@rajlaxmi7371](https://github.com/rajlaxmi7371))
- [Ritika Shaw]
- [Gaincy Sharma]
- [Isha Jain]

---

## 🌟 Features

### 👩‍🎓 User Features
- Search & apply for internships  
- **Filter internships by category, location, or type**  
- **Browse internships by tags** (e.g., "remote", "tech", "marketing")  
- Upload resume during application  
- Track application status (pending/accepted/rejected)  
- AI Chatbot for help and quick answers  
- View company hiring info  
- Access preparation courses  
- Submit feedback  
- Reset password via email  

### 🛡️ Admin Features
- Secure admin login  
- View and manage all user applications  
- **View and download uploaded resumes**  
- Post new internships  
- Review user feedback (approve/reject)  
- View analytics: logins, feedback, applications  

---

## 📦 Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Web framework  
- **MongoDB** with **Mongoose** – Database & ODM  
- **bcryptjs** – Password hashing  
- **express-session** – Session-based authentication  
- **multer** – File uploads (for resume storage)  
- **nodemailer** – Sending emails (password reset)  
- **JWT** – Secure tokens for password reset  
- **dotenv** – Environment variable management  

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rajlaxmi7371/group-project.git
cd group-project
```

---

### 2. Install Dependencies

Navigate to the backend folder (e.g., `server/`) and install all required dependencies:

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the `server/` folder and add the following:

```env
PORT=3019
MONGO_URL=mongodb://127.0.0.1:27017/UserRegister
SESSION_SECRET=your-secret-key
JWT_SECRET=your-very-secure-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

> 🔒 **Important:** Never commit `.env` files to GitHub. Add `.env` to your `.gitignore`.

---

### 4. Start MongoDB

Make sure MongoDB is running locally. If it’s not running, start it by running:

```bash
mongod
```

---

### 5. Start the Server

Once MongoDB is running, you can start your server:

```bash
npm run dev      # Starts with nodemon (recommended)
# or
npm start        # Starts with plain node
```

Your server will now be running at:

```
http://localhost:3019
```

---

## 📬 API Endpoints (Quick Reference)

| Method | Route             | Description                             |
|--------|-------------------|-----------------------------------------|
| POST   | `/post`            | Register a user                         |
| POST   | `/login`           | User login                              |
| POST   | `/forgot-password` | Send password reset link via email      |

---

## 🔐 Admin Setup

To create an admin user:

1. Temporarily **uncomment** the `/create-admin` route in your backend code.
2. Visit: [http://localhost:3019/create-admin](http://localhost:3019/create-admin)

This will create a default admin with the following credentials:
- **Username:** `admin`
- **Password:** `admin123`

👉 **Important:** Don't forget to **comment/remove** the `/create-admin` route after use to prevent anyone from creating another admin.

---

## 🧹 Auto Cleanup

The server is configured to automatically delete expired internships (past the application date) when it starts.

---

## 📌 Notes

- **Development:** In development mode, the session cookie is configured with `{ secure: false }`. Only set it to `true` in production, **with HTTPS**.
- **Secrets:** Avoid hardcoding sensitive information like secrets in your code. Always use `.env` files and make sure to add `.env` to `.gitignore`.
- **Gmail:** If using Gmail with **Nodemailer**, you may need to use **App Passwords** (instead of your regular Gmail password) to avoid Gmail blocking your app.

---

## 🔮 Future Features

- Admin file preview for resumes  
- Email alerts on application status  
- Mobile-responsive UI  

---

## 🗂️ Project Structure

```
group-project/
├── client/
│   ├── index.html               # Landing page
│   ├── login.html               # Login form
│   ├── register.html            # Register form
│   ├── home.html                # User dashboard
│   ├── internship.html          # Internship listings
│   ├── apply.html               # Application form (resume upload)
│   ├── user-dashboard.html      # Application status
│   ├── campanies.html           # Hiring info
│   ├── course.html              # Prep resources
│   ├── feedback.html            # Feedback form
│   ├── chart.html               # AI bot
│   ├── contact.html, about.html
│   ├── forget-password.html
│   ├── reset-password.html
│   └── logout.html

├── admin/
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── admin-status.html
│   ├── admin-application.html
│   ├── admin-manage-internship.html
│   └── admin-feedback.html

├── uploads/                    # Resume files uploaded by users (admin can view/download)
├── server/
│   ├── server.js               # Express backend server
│   ├── routes/
│   ├── controllers/
│   └── models/
├── .env                        # Environment variables
├── .gitignore
└── README.md
```

---

## 📄 License

This project is for educational/demo purposes.
