import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm';
import { Link } from 'react-router-dom';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    price: '',
    location: '',
    seats: '',
    date: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadEvents();
  }, [token, navigate]);

  const loadEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
    }
  };

  const handleBooking = async (eventId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/events/${eventId}/book`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setClientSecret(response.data.clientSecret);
      setSelectedEvent(events.find(e => e._id === eventId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate booking');
    }
  };

  const handlePaymentSuccess = () => {
    loadEvents();
    setSelectedEvent(null);
    setClientSecret(null);
    navigate('/bookings');
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      setNewEvent({ name: '', price: '', location: '', seats: '', date: '' });
      loadEvents();
    } catch (err) {
      setError('Failed to add event');
    }
  };

  if (error) return (
    <div className="text-red-500 text-center p-4 bg-red-50 rounded-md shadow-sm">
      <p className="font-medium">{error}</p>
    </div>
  );

  if (selectedEvent && clientSecret) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => {
              setSelectedEvent(null);
              setClientSecret(null);
            }}
            className="mb-4 text-gray-600 hover:text-gray-800 flex items-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
          
          <PaymentForm 
            clientSecret={clientSecret} 
            onSuccess={handlePaymentSuccess}
            eventDetails={selectedEvent}
          />
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Add New Event</h2>
          <form onSubmit={handleAddEvent} className="space-y-5">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newEvent.price}
                onChange={(e) => setNewEvent({...newEvent, price: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
              <input
                type="number"
                placeholder="Available Seats"
                value={newEvent.seats}
                onChange={(e) => setNewEvent({...newEvent, seats: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                required
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">Available Events</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
            >
              Add New Event
            </button>
            <Link 
              to="/bookings" 
              className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div 
              key={event._id} 
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 truncate">{event.name}</h3>
              <div className="space-y-3 text-gray-600 mb-4">
                <p className="text-2xl font-bold text-black">${event.price}</p>
                <p className="flex items-center text-sm">
                  <span className="mr-2">📍</span> {event.location}
                </p>
                <p className="flex items-center text-sm">
                  <span className="mr-2">🪑</span> {event.seats} seats available
                </p>
                <p className="flex items-center text-sm">
                  <span className="mr-2">📅</span> {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => handleBooking(event._id)}
                disabled={event.seats < 1}
                className={`w-full py-3 rounded-lg transition-all duration-200 font-semibold ${
                  event.seats > 0 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {event.seats > 0 ? 'Book Now' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;