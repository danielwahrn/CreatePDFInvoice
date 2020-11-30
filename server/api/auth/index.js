const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    keys = require("../../config/keys"),
    passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const Contractor = require("../../models/Contractor");

// @route POST api/auth/admin/register
// @desc Register user
// @access Public
router.post("/admin/register", (req, res) => {
    // Form validation

    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(500).json(errors);
    }

    User.findOne({ username: req.body.username, email: req.body.email }).then(user => {
        if (user) {
            return res.status(500).json({ result: "user who has same username already exists" });
        } else {
           
            const newUser = new User({
                email: req.body.email,
                phone: ' ',
                username: req.body.username,
                password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json({user, status: true}))
                        .catch(err => res.status(500).json({err, status: false}));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/admin/login", (req, res) => {
    // Form validation
    const keys = {secretOrKey:'ytd'}
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(500).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    // Find user by username
    User.findOne({ username }).then(user => {
        // Check if user exists
        if (!user) {
        return res.status(500).json({ 
            success: false,
            message: "User not found" 
        });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // User matched
            // Create JWT Payload
            const payload = {
            id: user._id,
            name: user.name
            };

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    
                    res.json({
                        success: true,
                        token: token,
                        user: user
                    });
                }
            );
        } else {
            return res
            .status(500)
            .json({
                success: false,
                message: "Password incorrect" 
            });
        }
        });
    });
});

router.post("/contractor/login", (req, res) => {
    // Form validation

    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(500).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    // Find user by username
    Contractor.findOne({ username }).then(user => {
        // Check if user exists
        if (!user) {
        return res.status(404).json({ result: "User not found" });
        }

        // Check password
        if(user.password === password){
            return res
            .status(200)
            .json({ 
                user: user,
                status: true,
                 message: "Password correct" });
        } else {
            return res
            .status(500)
            .json({ status: false, message: "Password incorrect" });
        }
    });
    
});

module.exports = router;