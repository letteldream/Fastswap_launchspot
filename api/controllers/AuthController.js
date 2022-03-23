const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
require("dotenv").config();

const keys = require("../../config/keys")
const Admin = require('../models/Admin')

router.post('/checkAdmin', (req, res) => {
    console.log('req.body.account', req.body.account);
    Admin.find({ address: req.body.account }, (err, data) => {
        if (err || data.length <= 0) return res.json({ success: false })
        else {
            const payload = {
                id: data._id,
                address: data.address,
            }
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    return res.json({
                        success: true,
                        token: "Ada " + token
                    })
                }
            )
        }
    })
})

module.exports = router