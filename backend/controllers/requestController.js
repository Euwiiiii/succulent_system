const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
    try {
        const { customerUsername, productID, productName, message } = req.body;
        const newRequest = new Request({
            customerUsername,
            productID,
            productName,
            message
        });
        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully!', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find().sort({ date: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resolveRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(
            req.params.id,
            { status: 'Resolved' },
            { new: true }
        );
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
