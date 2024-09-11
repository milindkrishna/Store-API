const mongoose = require('mongoose');

const connectDB = (URI) => {
    return mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
}

module.exports = connectDB