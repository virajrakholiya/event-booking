import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

function PaymentComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const status = searchParams.get('redirect_status');
    if (status === 'succeeded') {
      // Wait a moment before redirecting to show success message
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          Your booking has been confirmed. Redirecting to your tickets...
        </p>
      </div>
    </div>
  );
}

export default PaymentComplete; 