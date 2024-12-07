import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Events from './components/Events';
import PaymentForm from './components/PaymentForm';
import Login from './components/Login';
import BookedTickets from './components/BookedTickets';
import PaymentComplete from './components/PaymentComplete';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Events />} exact />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/payment/complete" element={<PaymentComplete />} />
        <Route path="/bookings" element={<BookedTickets />} />
      </Routes>
    </Router>
  );
}

export default App;