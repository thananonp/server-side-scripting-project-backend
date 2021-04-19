const jwt = require('jsonwebtoken');
const User = require('../models/userModel')
const passport = require('passport')
require('dotenv').config();

const getUser = async (email) => {
    const user = await User.findOne({email: email})
    if (user) return user
    else {
        return false
    }
}

const authenticate = async (req, res) => {
    // const hashedPassword = await bcrypt.compare(req.body.password, 12)
    // console.log(hashedPassword)
    // let user = await staff.findOne({email: req.body.email})
    // bcrypt.compare(req.body.password, user.password, 12)
    // // let user = await staff.findOne({email: req.body.email, password: hashedPassword})
    // if (!user) {
    //     res.status(401).json({error: "Invalid credential"})
    // } else {
    //     const token = jwt.sign({sub: user.id}, secret, {expiresIn: '7d'});
    //
    //     res.status(200).json({user: user, token: token})
    // }
    passport.authenticate('user-local', {session: false}, (err, user, info) => {
        console.log("---UserController---")
        console.log("err", err)
        console.log("user", user)
        console.log("info", info)
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // console.log(user)
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({...user, type:'user'}, process.env.SECRETJWT);

            return res.json({token});
        });

    })(req, res);
}
module.exports = {
    getUser,    authenticate
}
