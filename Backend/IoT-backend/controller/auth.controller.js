const User = require('../models/User')
const jwt = require('jsonwebtoken');

function createToken(ObjectID) {
    var token = jwt.sign({ id: ObjectID }, process.env.SECRET_TOKEN);
    return token;
}


const authApi = async (req, res, next) => {
    try {
        const UserFound = await User.findOne({
            where: {
                usename: req.body.usename,
                password: req.body.password
            }
        });

        if (UserFound) {
            var token = createToken(UserFound.id);
            console.log(token);
            return res.status(200).json({
                token: token
            });
        }
        else {
            return res.status(404).json({
                error: "Not Found"
            });
        }
    } catch (error) {
        return res.redirect("/login");
    }
}

const auth = async (req, res) => {
    try {
        const UserFound = await User.findOne({
            where: {
                usename: req.body.usename,
                password: req.body.password
            }
        });

        if (UserFound) {
            var token = createToken(UserFound.id);
            console.log(token);
            res.cookie('token', token);
            return res.redirect('/manager');
        }
        else {
            return res.redirect("/login");
        }
    } catch (error) {
        return res.redirect("/login");
    }
}

module.exports = {
    auth,
    authApi
}