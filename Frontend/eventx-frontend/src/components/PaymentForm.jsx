import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ticketAPI } from '../api/tickets';

// Load Stripe with a test publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ event, seatNumber, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // In a real implementation, you would create a payment intent on your server
      // For this demo, we'll simulate a successful payment
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment 90% of the time
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Book the ticket
        const ticket = await ticketAPI.bookTicket(event._id, seatNumber);
        onSuccess(ticket);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <p className="text-gray-600 mb-4">Event: {event.title}</p>
        <p className="text-gray-600 mb-4">Seat: {seatNumber}</p>
        <p className="text-xl font-bold mb-4">Total: ${event.price}</p>
      </div>

      <div className="mb-6 p-4 border rounded-lg">
        <h4 className="font-medium mb-3">Test Card Details</h4>
        <p className="text-sm text-gray-600 mb-1">Card Number: 4242 4242 4242 4242</p>
        <p className="text-sm text-gray-600 mb-1">Expiry: Any future date</p>
        <p className="text-sm text-gray-600">CVC: Any 3 digits</p>
      </div>

      <div className="mb-6 p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${event.price}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ event, seatNumber, onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            event={event} 
            seatNumber={seatNumber} 
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
