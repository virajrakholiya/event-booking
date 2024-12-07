import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('**************************');

function CheckoutForm({ clientSecret, onSuccess, eventDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      console.log('Stripe or elements not initialized');
      return;
    }

    setIsProcessing(true);

    try {
      const element = elements.getElement(PaymentElement);
      if (!element) {
        throw new Error('Payment Element not found');
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/complete`,
        },
      });

      if (error) {
        setMessage(error.message);
        console.error('Payment confirmation error:', error);
      } else {
        onSuccess();
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
      console.error('Payment error:', err);
    }

    setIsProcessing(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  };

  return (
    <div className="App">
      <form id="payment-form" onSubmit={handleSubmit} className="w-[30vw] min-w-[500px] mx-auto 
        shadow-[0px_0px_0px_0.5px_rgba(50,50,93,0.1),0px_2px_5px_0px_rgba(50,50,93,0.1),0px_1px_1.5px_0px_rgba(0,0,0,0.07)]
        rounded-lg p-10">
        
        {eventDetails && (
          <div className="mb-8">
            <h2 className="text-[#30313D] text-xl font-semibold mb-4">Order Summary</h2>
            <div className="border-t border-b border-[#E6E6E6] py-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-[#30313D]">Event</span>
                <span className="text-[#6D6E78]">{eventDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#30313D]">Total</span>
                <span className="text-[#6D6E78]">${eventDetails.price}</span>
              </div>
            </div>
          </div>
        )}

        <PaymentElement id="payment-element" options={paymentElementOptions} />
        
        <button 
          disabled={isProcessing || !stripe || !elements} 
          className="mt-6 w-full bg-[#0055DE] text-white rounded py-3 px-4 font-semibold
            hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span id="button-text">
            {isProcessing ? (
              <div className="spinner" role="status">
                <span className="sr-only">Processing...</span>
              </div>
            ) : (
              `Pay $${eventDetails?.price}`
            )}
          </span>
        </button>

        {message && (
          <div id="payment-message" className="mt-3 text-[#697386] text-center">
            {message}
          </div>
        )}
      </form>

      <div className="w-[30vw] min-w-[500px] mx-auto mt-5 text-[#353A44] text-center text-sm">
        <p>
          Payment processed securely by{' '}
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" 
            className="text-[#533AFD] hover:brightness-110">
            Stripe
          </a>
        </p>
      </div>
    </div>
  );
}

function PaymentForm({ clientSecret, onSuccess, eventDetails }) {
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0055DE',
    },
  };

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm 
        clientSecret={clientSecret} 
        onSuccess={onSuccess}
        eventDetails={eventDetails}
      />
    </Elements>
  );
}

export default PaymentForm; 