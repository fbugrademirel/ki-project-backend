const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) =>{

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'ki-kth-project')
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})

        if(!user) {
            throw new Error('No user with token')
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({
            "error": 'Unauthorized',
            "detailedMessage": e.message
        })
    }
}


module.exports = auth