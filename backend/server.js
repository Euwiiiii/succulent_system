require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const productRoutes = require('./routers/productRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection 
//mongoose.connect('mongodb://euwi2:saythename17@ac-t19kekk-shard-00-00.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-01.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-02.gubww3u.mongodb.net:27017/?ssl=true&replicaSet=atlas-veaca4-shard-0&authSource=admin&appName=Cluster0')
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
// // 1. API Routes (Dapat mauna ito)
// app.use('/api/products', productRoutes);

// // 2. Static Files (Para mahanap ang CSS/JS sa loob ng dist)
// app.use(express.static(path.join(__dirname, 'dist')));

// // 3. FINAL CATCH-ALL (Gamit ang app.use sa halip na app.get)
// app.use((req, res, next) => {
//     // Kung ang request ay para sa /api pero walang nahanap, huwag i-serve ang index.html
//     if (req.path.startsWith('/api')) {
//         return res.status(404).json({ message: 'API route not found' });
//     }
//     // Para sa lahat ng ibang request, i-serve ang frontend
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// 1. API Routes (Dapat mauna)
app.use('/api/products', productRoutes);

// 2. Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Catch-all Route (Gamitin ang 'app.use' para sa Express 5 compatibility)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});