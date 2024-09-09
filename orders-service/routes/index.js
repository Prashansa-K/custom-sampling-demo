const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const axios = require('axios');

// Create an order using customer name and book name, but save customer ID and book ID
router.post('/orders', async (req, res) => {
    const { customerName, bookName } = req.body;
    try {
        // Fetch customer by name
        const customerResponse = await axios.get(`http://localhost:3002/api/customers`);
        const customer = customerResponse.data.find(c => c.name === customerName);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Fetch book by name
        const bookResponse = await axios.get(`http://localhost:3001/api/books`);
        const book = bookResponse.data.find(b => b.name === bookName);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Create and save the order using customerId and bookId
        const newOrder = new Order({ customerId: customer.id, bookId: book.id });
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Fetch all orders with customer and book names
router.get('/orders', async (req, res) => {
    try {
        Order.find().then(async (orders) => {
            if (orders) {
                let ordersList = [];
                for (const order of orders) {
                    try {
                        const customerResponse = await axios.get(`http://localhost:3002/api/customers/${order.customerId}`);
                        let orderObject = { CustomerName: customerResponse.data.name, BookTitle: '' }
                        const bookResponse = await axios.get(`http://localhost:3001/api/books/${order.bookId}`);
                        orderObject.BookTitle = bookResponse.data.name 
                        ordersList.push(orderObject)
                    }
                    catch (error) {
                        console.error(`Error processing order ${order._id}: ${error.message}`);
                    }
                }
                res.json(ordersList);
            } else {
              res.status(404).send('Orders not found');
            }
          }).catch((err) => {
            console.log(err)
            res.status(500).send('Internal Server Error!');
        });
    }
    catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

module.exports = router;
