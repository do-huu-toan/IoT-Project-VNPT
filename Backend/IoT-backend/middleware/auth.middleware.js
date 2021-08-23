const jwt = require('jsonwebtoken');
const User = require('../models/User');

function checkToken(token) {
    var result = undefined;
    jwt.verify(token, process.env.SECRET_TOKEN, function (err, data) {
        if (err) {
            //console.log('Error encode: ',err);
            return null;
        }
        else {
            result = data;
        }

    })
    return result;
}

var authenicate = async (req, res, next) => {
    if (req.cookies.token) {
        var encode = checkToken(req.cookies.token);
        if (encode) {
            const userByToken = await User.findByPk(encode.id);

            if (userByToken) {
                next();
            }
            else {
                res.clearCookie("token");
                return res.redirect('/login');
            }
            return;
        }
        else {
            res.clearCookie("token");
            return res.redirect('/login');
        }
    }
    else {
        return res.redirect('/login');
    }

}

var authenicateLogin = (req, res, next) => {
    if (req.cookies.token) {
        var encode = checkToken(req.cookies.token);
        if (encode) {
            res.redirect('/user/manager');
        }
        else {
            res.clearCookie("token");
            return res.redirect('/login');
        } 
    }
    else
    {
        next();
    }
}

async function getUsernameByToken(req) {
    var encode = checkToken(req.cookies.token);
    const user = await User.findByPk(encode.id)
    //console.log(user.usename);
    return user.usename;
}

async function getUsernameByTokenString(token) {
    var encode = checkToken(token);
    const user = await User.findByPk(encode.id)
    //console.log(user.usename);
    return user.usename;
}

async function getIdByToken(req){
    var encode = checkToken(req.cookies.token);
    return encode.id;
}

const getIdByTokenString = async (token) => {
    var encode =checkToken(token);
    return encode.id;
}
module.exports = {
    authenicate,
    authenicateLogin,
    checkToken,
    getUsernameByToken,
    getIdByToken,
    getIdByTokenString,
    getUsernameByTokenString
}