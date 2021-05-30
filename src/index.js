const express = require('express')

// Connect to database and initiate
require('./db/mongoose.js')

const analyteRouter = require('./routers/microneedle')
const onBodyDeviceRouter = require('./routers/onbodydevice')
const userRouter = require('./routers/user')
const analyteListRouter = require('./routers/analyte-naming-list')
const measurementRouter = require('./routers/measurement')
const activationRouter = require('./routers/activation')
const passwordResetRouter = require('./routers/password-reset')

// Initialize the server
const app = express()

app.use(express.json())
app.use(analyteRouter)
app.use(onBodyDeviceRouter)
app.use(userRouter)
app.use(analyteListRouter)
app.use(measurementRouter)
app.use(activationRouter)
app.use(passwordResetRouter)


const port = process.env.PORT || 3000

//Start listening on port provided

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
})



