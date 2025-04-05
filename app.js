

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user'); // Import the User model

const app = express();

app.use(cors()); // To allow cross-origin requests from the Angular app
app.use(bodyParser.json());

// Middleware
app.use(express.json());  // to parse JSON data in request bodies

// MongoDB Connection URI (replace with your own URI or local instance)
const mongoURI = 'mongodb+srv://acpacy21:2W9bIUmxKLltmf1m@cluster0.haecv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // Local MongoDB URI
// or for MongoDB Atlas
// const mongoURI = 'your_mongodb_atlas_connection_string';

// Connect to MongoDB using mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

//POST data to monogodb
app.post('/users', async (req, res) => {
  const { name, age, date } = req.body;

  try {
    // Create a new user using the data from the request body
    const newUser = new User({ name, age, date });
    // Save the user to the database
    await newUser.save();

    // Send a response back to the client with the created user data
    res.status(201).json(newUser);
  } catch (err) {
    // Handle any errors (e.g., validation errors, MongoDB errors)
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

//Get all data from mongodb
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Retrieve all users from the database
    res.json(users);  // Send the data as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

//get user by id: from mongodb
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;  // Get the ID from the route parameter
  try {
    const user = await User.findById(userId);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Send the user data as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

//delete post by id from mongodb
app.delete('/users/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    // Wait for the MongoDB delete operation to finish
    const result = await User.findByIdAndDelete(postId);
    if (!result) {
      // If no Post is found, send a 404 error
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    // If any error occurs during the operation, send an error response
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
})

//edit post by id from mongodb
// app.put('/users/:id', async (req, res) => {
//   const { id } = req.params;  // Get the ID from the route parameter
//   const { name, age } = req.body;  // Get the name and age from the request body

//   try {
//     // Find the person by ID and update their name and age
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { name, age },
//       { new: true } // Return the updated document
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'Post not found' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log('Express listening on port', this.address().port);
});
