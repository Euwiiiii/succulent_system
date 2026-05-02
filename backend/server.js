require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection 
// const dbURI = process.env.MONGODB_URI || 'mongodb://euwi2:saythename17@ac-t19kekk-shard-00-00.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-01.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-02.gubww3u.mongodb.net:27017/?ssl=true&replicaSet=atlas-veaca4-shard-0&authSource=admin&appName=Cluster0';
// mongoose.connect(dbURI)
//     .then(() => console.log('✅ MongoDB Connected'))
//     .catch(err => console.log('❌ MongoDB Connection Error:', err));

// (HUWAG MONG KALIMUTAN ) 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));



app.use('/api/products', productRoutes);


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