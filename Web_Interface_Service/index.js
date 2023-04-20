const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3005;

// Set up the view engine
app.set('view engine', 'ejs');

// Define routes
app.get('/', async (req, res) => {
  try {
    // Make a request to the Product Management Service to get the list of products
    const products = await axios.get('http://localhost:3001/products');

    // Render the home page template with the list of products
    res.render('home', { products: products.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/product/:id', async (req, res) => {
  try {
    // Make a request to the Product Management Service to get the product details
    const product = await axios.get(`http://localhost:3001/products/${req.params.id}`);

    // Render the product page template with the product details
    res.render('product', { product: product.data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/cart', (req, res) => {
  // TODO: Implement the cart page
  res.send('Cart Page');
});

app.get('/checkout', (req, res) => {
  // TODO: Implement the checkout page
  res.send('Checkout Page');
});

// Start the server
app.listen(port, () => {
  console.log(`Web Interface Service listening at http://localhost:${port}`);
});
