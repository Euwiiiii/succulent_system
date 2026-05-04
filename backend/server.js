require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection 
// Local fallback: If process.env.MONGODB_URI is missing, use string
const dbURI = process.env.MONGODB_URI || 'mongodb://euwi2:saythename17@ac-t19kekk-shard-00-00.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-01.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-02.gubww3u.mongodb.net:27017/?ssl=true&replicaSet=atlas-veaca4-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));



app.use('/api/products', productRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/sales', saleRoutes);


app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all Route 
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});