const User = require("../models/User");
const authencation = require('../middleware/auth.middleware');
const Role = require("../models/Role");
const checkRole = async function(req, res, next){
    console.log("----------Run here-----------");
    const userByToken = await User.findByPk(authencation.checkToken(req.cookies.token).id);
    const roleByUser = await Role.findByPk(userByToken.roleId);

    //console.log("Role: ", roleByUser);

    if(roleByUser.rolename == 'admin' )
    {
        next();
    }
    else
    {
        return res.status(404).json('Bạn không có quyền vào trang  này!')
    }
}

const getRoleByToken = async (req) => {
    const userByToken = await User.findByPk(authencation.checkToken(req.cookies.token).id);
    const roleByUser = await Role.findByPk(userByToken.roleId);
    return roleByUser.rolename;
}

module.exports = {
    checkRole,
    getRoleByToken
};
