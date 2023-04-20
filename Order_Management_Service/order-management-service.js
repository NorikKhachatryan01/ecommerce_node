const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the Order model
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
});

// Create a model for the Order schema
const Order = mongoose.model('Order', orderSchema);

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Define routes for the Order Management Service
app.post('/orders', async (req, res) => {
  try {
    // Validate the request body
    if (!req.body.userId || !req.body.productId || !req.body.quantity) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Check if the user and product exist
    const [userResponse, productResponse] = await Promise.all([
      axios.get(`http://localhost:3000/users/${req.body.userId}`),
      axios.get(`http://localhost:3001/products/${req.body.productId}`),
    ]);

    if (userResponse.status !== 200 || productResponse.status !== 200) {
      return res.status(400).send({ error: 'Invalid user or product' });
    }

    // Create a new order document based on the request body
    const order = new Order(req.body);

    // Save the new order document to the database
    await order.save();

    res.status(201).send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch('/orders/:id', async (req, res) => {
  try {
    // Find the order with the given ID and update its status
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    res.send(order);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    // Find the order with the given ID and delete it
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    res.send({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the Order Management Service
app.listen(3002, () => {
  console.log('Order Management Service listening on port 3002');
});
