// const opentelemetry = require('@opentelemetry/api');
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const opentelemetry = require('@opentelemetry/api');
const { formatBooks } = require('./helpers');

const tracer = opentelemetry.trace.getTracer('books-service');

// Create a book
router.post('/books', async (req, res) => {
        const { name, author } = req.body;
        try {
            const newBook = new Book({ name, author });
            await newBook.save();
            res.status(201).json(newBook);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create book' });
        }
});

// Fetch all books
router.get('/books', async (req, res) => {
    return tracer.startActiveSpan('fetchBooks', async (span) => {
        try {
            const books = await Book.find();
            span.setAttribute('books_count', books.length)
            const formattedBooks = formatBooks(books);  // Format the books list
            res.status(200).json(formattedBooks);  // Return the formatted list
        } catch (err) {
            span.recordException(error);
            res.status(500).json({ error: 'Failed to fetch books' });
        }
        finally {
            span.end();
        }
    });
});

// Fetch a book by ID
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

module.exports = router;