const ContactRequest = require('../models/ContactRequest');

exports.createContactRequest = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        
        if (!firstName || !lastName || !email || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newRequest = new ContactRequest({
            firstName,
            lastName,
            email,
            phone,
            message
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating contact request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getContactRequests = async (req, res) => {
    try {
        const requests = await ContactRequest.find().sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching contact requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
