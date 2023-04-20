const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Create a model for the User schema
const User = mongoose.model('User', userSchema);

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Define routes for the User Management Service
app.post('/users', async (req, res) => {
  try {
    // Create a new user document based on the request body
    const user = new User(req.body);

    // Save the new user document to the database
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    // Find the user with the given email and password
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the User Management Service
app.listen(3000, () => {
  console.log('User Management Service listening on port 3000');
});
