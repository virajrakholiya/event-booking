import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function BookedTickets() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadBookings();
    loadUserData();
  }, [token, navigate]);

  const loadUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  const loadBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">My Booked Tickets</h2>
        </div>

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-xl shadow-sm mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {bookings.length === 0 && !error && (
          <div className="text-center bg-white rounded-xl shadow-md p-10">
            <p className="text-gray-600 text-xl">You haven't booked any tickets yet.</p>
          </div>
        )}

        <div className="space-y-6">
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 truncate pr-4">
                      {booking.event.name}
                    </h3>
                    {userData && (
                      <p className="text-gray-600 mt-1 text-sm">
                        Booked by: {userData.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-black">
                      ${booking.event.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: {booking._id.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Event Date", value: new Date(booking.event.date).toLocaleDateString() },
                  { label: "Location", value: booking.event.location },
                  { label: "Booking Date", value: new Date(booking.createdAt).toLocaleDateString() },
                  { label: "Payment ID", value: booking.paymentId.slice(-6) }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center text-gray-700 text-sm"
                  >
                    <span className="font-medium">{item.label}:</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Thank you for your booking! Please show this ticket at the event.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookedTickets;