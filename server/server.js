const express = require('express');    // Web framework
const cors = require('cors');         // Allows cross-origin requests
const mongoose = require('mongoose');     // MongoDB interaction
const dotenv = require('dotenv');          // Loads env vars from `.env`
const path = require('path');              // File path utility
const bcrypt = require('bcryptjs');          // Password hashing
const jwt = require('jsonwebtoken');         // For secure token generation (password reset)
const nodemailer = require('nodemailer');    // For sending emails
const session = require('express-session');    // To manage login sessions
const multer = require('multer');              // For handling file uploads
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 
const JWT_SECRET = "your-very-secure-secret-key"; // Use a real secret in production

dotenv.config();             // Load environment variables
const app = express();

// ✅ Add transporter config below
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // secure SMTP  465 is the secure SSL/TLS port used for encrypted emails.
  secure: true,
  auth: {
    user: "rajlaxmi7371@gmail.com",
    pass: "ltogaqkpbhmwtlkc" // <-- paste the 16-character app password here
  }
});

// Middleware 
app.use(cors());           // Allow frontend to access server
app.use(express.json());       // Parse JSON requests
app.use(express.urlencoded({ extended: true }));    // Parse form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   // Serve uploaded files
app.use(express.static(path.join(__dirname, '../User')));  // Serve static HTML files

app.use('/admin', express.static(path.join(__dirname, '../admin')));
// 🔁 Redirect /admin to admin-login.html
app.get('/admin', (req, res) => {
  res.redirect('/admin/admin-login.html');
});
app.use('/image', express.static(path.join(__dirname, '../image')));

app.use(session({
  secret: "your-secret-key",  // Change this to something more secure in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Important: 'secure' should be false during development (without HTTPS)
}));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/UserRegister');
/*mongoose.connect('mongodb://127.0.0.1:27017/UserRegister', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});*/
mongoose.connection.once('open', () => {
  console.log("✅ MongoDB connection successful");
});


// For Admin schemas
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model("admin", adminSchema);

// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const Users = mongoose.model("data", userSchema);

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  rating: { type: Number, default: 5 }, // ⭐ NEW FIELD
  isFeatured: { type: Boolean, default: false }, // ✅ consistent casing
  createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  stipend: { type: String, required: true },
  duration: { type: String }, // e.g. "2 months"
  skills: [String], // e.g. ["HTML", "CSS", "JavaScript"]
  applyBy: { type: Date },
  postedOn: { type: Date, default: Date.now },
  category: { type: String }, // e.g. "Web Development"
  description: { type: String },
  openings: { type: Number },
  type: { type: String }, // e.g. "Internship" or "Part-Time"
  updatedAt: { type: Date, default: Date.now }
});
const Internship = mongoose.model("Internship", internshipSchema);

const applicationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  city: String,
  gender: String,
  type: String,
  resume : String, // ✅ store the uploaded filename
  Status: { type: String, default: "Pending" },
  internshipTitle : String, // ✅ Add this
  company : String,          // ✅ And this
  joiningDate: String // ✅ New field
}, { timestamps: true });
const Application = mongoose.model("Application", applicationSchema);

const companySchema = new mongoose.Schema({
  name: String,
  description: String,
  founded: Number,
  hiringStart: String,
  location: String,
  website: String,
  hiringStartDate: Date,
  logo: String // ✅ New field to store image path
});
const Company = mongoose.model("Company", companySchema);

// Routes 
/*
app.get('/', (req, res) => {
  console.log("🧠 User session:", req.session.user);
  const page = req.session.user ? 'index.html' : 'login.html';
  console.log(`⚡ Serving ${page}`);
  res.sendFile(path.join(__dirname, page));
}); */
app.get('/', (req, res) => {
  console.log("🧠 User session:", req.session.user);
  const page = req.session.user ? 'index.html' : 'login.html';
  console.log(`⚡ Serving ${page}`);
  res.sendFile(path.join(__dirname, '../User', page));
});

// 🧹 Auto-delete expired internships
async function deleteExpiredInternships() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const result = await Internship.deleteMany({ applyBy: { $lt: today } });
    console.log(`🧹 Deleted ${result.deletedCount} expired internships`);
  } catch (err) {
    console.error("❌ Error deleting expired internships:", err);
  }
}

// Routes for Admin Login 
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username }); // ✅ Use lowercase here
  if (!admin) return res.json({ success: false, message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.json({ success: false, message: "Incorrect password" });

  req.session.user = { username: admin.username, role: "admin" };
  res.json({ success: true, message: "Admin login successful" });
});

// 🔒 TEMPORARY ROUTE: Create a default admin user (run once then remove)
/*app.get('/create-admin', async (req, res) => {
  const username = "admin";
  const plainPassword = "admin123";

  try {
    const existing = await Admin.findOne({ username }); // ✅ Capital A
    if (existing) return res.send("⚠️ Admin already exists. No changes made.");

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newAdmin = new Admin({ username, password: hashedPassword }); // ✅ Capital A
    await newAdmin.save();

    res.send("✅ Admin created successfully. You can now log in.");
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    res.status(500).send("Server error while creating admin.");
  }
});*/

app.get('/get-admin', (req, res) => {
  if (req.session && req.session.user?.role === "admin") {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not logged in as admin' });
  }
});

// Register User
app.post('/post', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ username, email, password: hashedPassword });
    await user.save();

    res.json({ success: true, message: "Registration successful." });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
});

// Login User
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (!user) return res.json({ success: false, message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.json({ success: false, message: "Invalid password" });

    req.session.user = { username: user.username, email: user.email, id: user._id };
    res.json({
      success: true,
      message: "Login successful!",
      username: user.username,
      email: user.email
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5m" });
  const resetLink = `http://localhost:3019/reset-password.html?token=${token}`;

  const mailOptions = {
    from: "rajlaxmi7371@gmail.com", // ✅ must match transporter
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click below to reset your password (valid for 5 minutes):</p>
           <a href="${resetLink}">${resetLink}</a>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Email error:", err.message);
      return res.status(500).json({ message: "Error sending email" });
    }
    res.json({ message: "Password reset link sent to email!" });
  });
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});


// ✅ Get user profile info for frontend
app.get('/api/user/profile', async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    res.json({ 
      username: user.username,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Contact Form
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).send("All fields are required.");
  try {
    await new Contact({ name, email, message }).save();
    res.send("Your message has been submitted successfully!");
  } catch (error) {
    res.status(500).send("Server error. Try again later.");
  }
});

// Internships
// Add New Internship
app.post('/api/internships', async (req, res) => {
  const {
    title,
    company,
    location,
    stipend,
    duration,
    skills,
    applyBy,
    postedOn,
    category,
    description,
    openings,
    type
  } = req.body;

  try {
    const newInternship = new Internship({
      title,
      company,
      location,
      stipend,
      duration,
      skills,
      applyBy,
      postedOn,
      category,
      description,
      openings,
      type
    });

    await newInternship.save();
    res.status(201).json({ success: true, message: "Internship added successfully!", internship: newInternship });
  } catch (error) {
    console.error("Error adding internship:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Fetch All Internships (needed for frontend)
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ updatedAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch internships" });
  }
});

// File Upload with Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, unique + '-' + file.originalname);
    }
  });
  
  // ✅ Define the upload instance
  const uploads = multer({ storage: storage });

// Apply to Internship
app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, city, gender, type, Status, internshipId
    } = req.body;

    const internship = await Internship.findById(internshipId);

    const application = new Application({
      firstName, lastName, email, phone, city, gender,
      resume: req.file.filename,
      type,
      Status: "Pending", // ✅ Always set as Pending initially
      internshipTitle: internship?.title || "N/A",
      company: internship?.company || "N/A",
    });

    await application.save();

    res.json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});
/*
app.get("/test-email", (req, res) => {
  transporter.sendMail({
    from: "rajlaxmi7371@gmail.com",
    to: "YOUR_EMAIL@gmail.com",
    subject: "Test Email",
    html: "<p>This is a test email from Node.js server</p>"
  }, (err, info) => {
    if (err) {
      console.error("❌ Test email error:", err.message);
      return res.status(500).send("Email failed");
    }
    res.send("✅ Test email sent successfully!");
  });
});*/

// Admin view application
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("❌ Failed to fetch applications:", error);
    res.status(500).json({ message: "Server error while fetching applications." });
  }
});

app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { Status, joiningDate } = req.body;

    const updated = await Application.findByIdAndUpdate(id, { Status, joiningDate }, { new: true });

    if (!updated) return res.status(404).json({ message: "Application not found" });

    if (Status === 'Accepted') {
      const mailOptions = {
        from: "rajlaxmi7371@gmail.com",
        to: updated.email,
        subject: "🎉 You're Selected for the Internship!",
        html: `
          <p>Dear ${updated.firstName},</p>
          <p>Congratulations! 🎉 Your application for the <strong>${updated.internshipTitle}</strong> internship at <strong>${updated.company}</strong> has been <b>accepted</b>.</p>
          <p><strong>Joining Date:</strong> ${joiningDate || "TBD"}</p>
          <p>Please check your dashboard for updates or next steps.</p>
          <p>Best regards,<br>NextStep Team</p>
        `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("❌ Email error:", err);
        else console.log("📧 Email sent:", info.response);
      });
    }

    res.json({ message: `Status updated to '${Status}'`, updated });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const { start, end } = req.query;

    const dateFilter = start && end ? {
      postedOn: { $gte: new Date(start), $lte: new Date(end) }
    } : {};

    const internships = await Internship.countDocuments(dateFilter);
    const applications = await Application.countDocuments();
    const users = await Users.countDocuments();
    const feedbacks = await Feedback.find();
    const featuredFeedbacks = feedbacks.filter(f => f.isFeatured).length;

    // For line chart data
    const pipeline = [
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$postedOn" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];
    const internshipDates = await Internship.aggregate(pipeline);

    res.json({
      internships,
      applications,
      users,
      featuredFeedbacks,
      totalFeedbacks: feedbacks.length,
      internshipDates: internshipDates.map(d => ({
        date: d._id,
        count: d.count
      }))
    });

  } catch (err) {
    console.error("❌ Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Companies
app.post('/add-company', async (req, res) => {
  const { name, description, founded, location, website, hiringStartDate } = req.body;
  try {
    await new Company({ name, description, founded, location, website, hiringStartDate }).save();
    res.json({ success: true, message: "Company added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

app.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find().sort({ hiringStartDate: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
});

// Add this route to your server.js file
// Add this route to your server.js file

// 🔐 Middleware to protect admin-only routes
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
}

// ✅ Get single company by ID
app.get("/companies/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin-only route to create new company
app.post("/companies", isAdmin, async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json({ message: "Company added successfully!" });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ message: "Failed to add company." });
  }
});

app.put('/companies/:id', isAdmin, async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company updated successfully!', company: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update company' });
  }
});

// Feedback
app.use('/api/feedback', router);

app.post('/api/feedback/submit-feedback', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    if (!name || !email || !message || !rating) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    await new Feedback({ name, email, message, rating }).save();
    res.status(200).json({ success: true, message: "Thank you for your feedback!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

app.get('/api/feedback/featured', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured feedbacks." });
  }
});

// ✅ Admin view: Load all feedbacks
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Failed to load feedbacks" });
  }
});

// ✅ Feature a feedback
app.put('/feedback/feature/:id', async (req, res) => {
  try {
      const feedback = await Feedback.findByIdAndUpdate(
          req.params.id,
          { isFeatured: true },
          { new: true }
      );
      if (!feedback) {
          return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json({ message: 'Feedback marked as featured', feedback });
  } catch (err) {
      console.error("❌ Error updating feedback:", err);
      res.status(500).json({ message: 'Error updating feedback' });
  }
});

// ✅ Delete a feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const result = await Feedback.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting feedback:", err);
    res.status(500).json({ message: 'Error deleting feedback' });
  }
});

// 🧑‍💻 User view: Fetch applications for logged-in user
app.get('/api/user/applications', async (req, res) => {
  try {
    const userEmail = req.session.user?.email;
    if (!userEmail) return res.status(401).json({ message: "Not authorized" });

    const applications = await Application.find({ email: userEmail }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("❌ Error fetching user applications:", error);
    res.status(500).json({ message: "Server error while fetching applications." });
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.redirect('/');
  }
});

// ✅ Run cleanup of expired internships on server start
deleteExpiredInternships(); // 🧼 Cleanup on startup

// Server start
const PORT = process.env.PORT || 3019;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/* cd "C:\Users\dell\OneDrive\Desktop\group project\server"
  node server.js */