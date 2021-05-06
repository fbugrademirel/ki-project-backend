const express = require('express')

// Connect to database and initiate
require('./db/mongoose.js')

const analyteRouter = require('./routers/analyte')
const onBodyDeviceRouter = require('./routers/onbodydevice')
const userRouter = require('./routers/user')

// Initialize the server
const app = express()

app.use(express.json())
app.use(analyteRouter)
app.use(onBodyDeviceRouter)
app.use(userRouter)

const port = process.env.PORT || 3000

//Start listening on port provided

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})



