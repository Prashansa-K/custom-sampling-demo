const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a customer
router.post('/customers', async (req, res) => {
    const { name, age, address } = req.body;
    try {
        const newCustomer = new Customer({ name, age, address });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create customer' });
    }
});

// Fetch all customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Fetch a customer by ID
router.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

module.exports = router;
