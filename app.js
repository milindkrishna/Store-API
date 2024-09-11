const express = require('express')
// async error
require('express-async-errors')
const app = express()
require('dotenv').config()
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler') 
const PORT = process.env.PORT || 5000
const connectDB = require('./db/connect')
const productRouter = require('./routes/products')

// middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})


app.use('/api/v1/products', productRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        // connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => console.log(`Server running on port ${PORT} \ndatabase is connected successsfully`))
    } catch (error) {
        console.log(error)
    }
}

start()


