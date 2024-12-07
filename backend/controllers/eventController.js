const Event = require("../models/event");
const Booking = require("../models/booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dotenv = require("dotenv");
dotenv.config();
// Create event controller
const createEvent = async (req, res) => {
  try {
    const { name, price, seats, date, location } = req.body;
    const event = new Event({
      name,
      price,
      seats,
      date,
      location,
      createdBy: req.userId
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Book event controller
const bookEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) throw new Error('Event not found');
    if (event.seats < 1) throw new Error('No seats available');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.price * 100, // Stripe uses cents
      currency: 'usd'
    });

    const booking = new Booking({
      event: event._id,
      user: req.userId,
      paymentId: paymentIntent.id
    });
    await booking.save();

    event.seats -= 1;
    await event.save();

    res.json({
      booking,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events controller
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  bookEvent,
  getAllEvents
}; 