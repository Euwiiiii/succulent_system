const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection 
mongoose.connect('mongodb://euwi2:saythename17@ac-t19kekk-shard-00-00.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-01.gubww3u.mongodb.net:27017,ac-t19kekk-shard-00-02.gubww3u.mongodb.net:27017/?ssl=true&replicaSet=atlas-veaca4-shard-0&authSource=admin&appName=Cluster0')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/products', productRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});