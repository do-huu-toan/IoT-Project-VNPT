const Role = require('../models/Role');
const User = require('../models/User');

const getAll = async (req, res, next) => {
    return res.status(200).json(await Role.findAll({
        include: User
    }));
}
const create = async (req, res, next) => {
    var newRole = new Role({
        rolename: req.body.role
    });
    try {
        const result = await newRole.save();
        return res.status(201).json(result);
    } catch (error) {
        return res.error({error: "create failed !"})
    }
    
}
module.exports = {
    getAll,
    create
}