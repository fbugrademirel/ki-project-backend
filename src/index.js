const express = require('express')

// Connect to database and initiate
require('./db/mongoose.js')

const analyteRouter = require('./routers/analyte')

// Initialize the server
const app = express()

app.use(express.json())
app.use(analyteRouter)

const port = process.env.PORT || 3000

//Start listening on port provided

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})



