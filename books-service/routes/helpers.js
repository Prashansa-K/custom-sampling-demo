const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('books-service');

function formatBooks(books) {
    return tracer.startActiveSpan('formatBooks', {
        attributes: {
            'skip': true
        }
    },(span) => {
        try {
            return books
            .filter(book => book.name)  // Filter books that have a "name"
            .map(book => {
                // Convert the MongoDB document to a plain object
                const formattedBook = book.toObject();

                // Remove the "_v" field
                delete formattedBook.__v;

                // Move "id" to the top of the object
                const { _id, ...rest } = formattedBook;
                return { id: _id, ...rest };
            });
        }
        catch(err) {
            span.recordException(error);
            return books
        }
        finally {
            span.end();
        }
    })   
}

module.exports = {
    formatBooks
};