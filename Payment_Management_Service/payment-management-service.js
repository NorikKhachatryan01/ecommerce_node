const stripe = require('stripe')('your_stripe_secret_key_here');

// Function to authorize a payment
async function authorizePayment(amount, currency, source, description) {
  try {
    const payment = await stripe.charges.create({
      amount: amount,
      currency: currency,
      source: source,
      description: description
    });

    return payment;
  } catch (err) {
    console.error(err);
    throw new Error('Payment authorization failed');
  }
}

// Function to capture a payment
async function capturePayment(paymentId) {
  try {
    const capturedPayment = await stripe.charges.capture(paymentId);

    return capturedPayment;
  } catch (err) {
    console.error(err);
    throw new Error('Payment capture failed');
  }
}

// Function to refund a payment
async function refundPayment(paymentId, amount) {
  try {
    const refund = await stripe.refunds.create({
      charge: paymentId,
      amount: amount
    });

    return refund;
  } catch (err) {
    console.error(err);
    throw new Error('Payment refund failed');
  }
}

module.exports = {
  authorizePayment,
  capturePayment,
  refundPayment
};
