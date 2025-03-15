const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3019;

app.use(express.static(__dirname)); // __dirname is already available in CommonJS
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON data

// ✅ Correct MongoDB Connection (Only One Connection)
mongoose.connect('mongodb://127.0.0.1:27017/UserRegister', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongodb connection successful");
});

// ✅ Fix: Correct Variable Name (userSchema)
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const Users = mongoose.model("data", userSchema);

// ✅ Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// ✅ Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// ✅ Login Form Submission Route 
app.post('/post', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new Users({ username, email, password });
    await user.save();
    console.log(user);
    res.send("Form Submission Successful");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists in MongoDB
        const user = await Users.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check password
        if (user.password !== password) {
            return res.json({ success: false, message: "Invalid password" });
        }

        res.json({ success: true, message: "Login successful!" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
});

// ✅ Contact Form Submission Route (Fixed)
app.post('/contact', async (req, res) => {
    console.log("🟢 Received contact form data:", req.body); // Debugging

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.error("🔴 Validation failed: Missing fields");
        return res.status(400).send("All fields are required.");
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("✅ Contact saved in MongoDB:", newContact); // Debugging
        res.send("Your message has been submitted successfully!");
    } catch (error) {
        console.error("❌ Error saving contact data:", error); // Debugging
        res.status(500).send("Server error. Try again later.");
    }
});



// ✅ Move this to the bottom
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


const internshipSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    description: String,
    postedAt: { type: Date, default: Date.now }
});

const Internship = mongoose.model("Internship", internshipSchema);

// Route to add a new internship
app.post('/add-internship', async (req, res) => {
    const { title, company, location, description } = req.body;

    try {
        const newInternship = new Internship({ title, company, location, description });
        await newInternship.save();
        console.log("✅ New Internship Added:", newInternship);
        res.json({ success: true, message: "Internship added successfully!" });
    } catch (error) {
        console.error("❌ Error adding internship:", error);
        res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
});

// Route to get all internships
app.get('/internships', async (req, res) => {
    try {
        const internships = await Internship.find().sort({ postedAt: -1 }); // Get internships sorted by date
        res.json(internships);
    } catch (error) {
        console.error("❌ Error fetching internships:", error);
        res.status(500).json({ success: false, message: "Server error. Try again later." });
    }
});





