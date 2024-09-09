const express = require('express');
const mongoose = require('mongoose');
const customerRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use('/api', customerRoutes);

mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Customers service running on port ${PORT}`);
});
