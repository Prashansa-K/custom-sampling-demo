const express = require('express');
const mongoose = require('mongoose');
const orderRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use('/api', orderRoutes);

mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Orders service running on port ${PORT}`);
});
