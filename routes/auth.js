const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// LOGIN ROUTE
router.post('/login', (req, res) => {
    let token = jwt.sign({state: 'true', email: req.body.email, username: req.body.username}, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '4h'
    });
    res.json({token: token, auth: true, email: req.body.email, username: req.body.username});
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('users').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user => {
            if (user) {
                console.log(user);
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({errors: errors.array()});
    }
     else {

        let email = req.body.email;
        let username = email.split("@")[0];
        let password = await bcrypt.hash(req.body.password, 10);
        let fname = req.body.fname;
        let lname = req.body.lname;

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('users').insert({
            username: username,
            password: password,
            email: email,
            role: 555,
            lname: lname || null,
            fname: fname || null
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({message: 'Registration successful.'});
            } else {
                res.status(501).json({message: 'Registration failed.'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});

// router.post("/register", (req, res) => {    
//     const { name, email, password, password_confirm } = req.body

//     // db.query() code goes here
//     database.query('SELECT email FROM users WHERE email = ?', [email], async (error, ress) => {
//         // remaining code goes here
//         if(error){
//             console.log(error)
//         }
//         if( result.length > 0 ) {
//             return res.render('register', {
//                 message: 'This email is already in use'
//             })
//         } else if(password !== password_confirm) {
//             return res.render('register', {
//                 message: 'Passwords do not match!'
//             })
//         }

//         let hashedPassword = await bcrypt.hash(password, 8)

//         db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, res) => {
//             if(error) {
//                 console.log(error)
//             } else {
//                 return res.render('register', {
//                     message: 'User registered!'
//                 })
//             }
//         })

//      })


// })

module.exports = router;