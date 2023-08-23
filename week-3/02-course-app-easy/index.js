const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const verifyAdmin = (req, res, next) => {
  try {
    const { username, password } = req.headers;

    // Find the admin in the ADMINS array by username
    const admin = ADMINS.find((admin) => admin.username === username);

    // If the admin is not found or the password doesn't match, return an error
    if (!admin || !( bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // If the credentials are valid, proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the admin already exists
    const adminExists = ADMINS.find((admin) => admin.username === username);
    if (adminExists) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new admin
    const newAdmin = {
      username: username,
      password: hashedPassword,
    };

    // Add the new admin to the ADMINS array
    ADMINS.push(newAdmin);

    const payload = {
      username: username,
      role: 'admin',
    };

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY not found in environment variables');
    }

    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
  
  
});

app.post('/admin/login', async (req, res) => {
  try{
 
    const { username, password } = req.headers;

    // Find the admin in the ADMINS array by username
    const admin = ADMINS.find((admin) => admin.username === username);

    // If the admin is not found or the password doesn't match, return an error
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a payload for the JWT token
    const payload = {
      username: username,
      role: 'admin',
    };

    // Access the JWT secret key from the environment variable
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY not found in environment variables');
    }

    // Sign the payload and generate the JWT token
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' }); // Token will expire in 1 hour

    // Return the token in the response
    res.json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/admin/courses', (req, res) => {
  try {
    const { title, description, price, imageLink, published } = req.body;

    // Validate the input data (e.g., check if required fields are present and have valid formats)

    // Generate a unique course ID (you can use a library like uuid for this)
    const courseId = generateUniqueCourseId();

    // Create the new course object
    const newCourse = {
      courseId,
      title,
      description,
      price,
      imageLink,
      published,
    };

    // Add the new course to the COURSES array
    COURSES.push(newCourse);

    res.json({ message: 'Course created successfully', courseId });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
