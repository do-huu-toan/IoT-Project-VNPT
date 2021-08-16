const Role = require('../models/Role');
const User = require('../models/User');
const AuthMiddleware = require('../middleware/auth.middleware')

const getAll = async (req, res, next) => {
    return res.status(200).json(await User.findAll({}));
}

const getRoleById = async (req, res, next) => {
    try {
        return res.status(200).json(await User.findByPk(req.params.id))
    } catch (error) {
        return res.status(500).error("Not found")
    }
}

const create = async (req, res, next) => {
    if(req.body.usename && req.body.password && req.body.role)
    {
        try 
        {
            const roleFound = await Role.findOne({
                where:{
                    rolename: req.body.role
                }
            });

            var newUser = new User({
                usename: req.body.usename,
                password: req.body.password,
                roleId: roleFound.id
            });

            await newUser.save();
            //res.status(201).json(await newUser.save());
            next();
        } 
        catch (error) 
        {
            return res.status(500).error("Create Failed !")
        }
    }
}

const userManagerView = async (req, res, next) => {
    try {
        var users = await User.findAll();
        var ListUserDTO = [];

        for (let i = 0; i < users.length; i++) {
            const RoleByUser = await Role.findByPk(users[i].roleId);
            var userDTO = {
                id: users[i].id,
                usename: users[i].usename,
                role: RoleByUser.rolename
            }
            ListUserDTO.push(userDTO);
        }

        let rolesdto = null;
        const roles = await Role.findAll();
        rolesdto = roles.map((data) => {
            return {
                id: data.id,
                role: data.rolename,
            }
        })

        username = await AuthMiddleware.getUsernameByToken(req);

        res.render('manager-user', {
            users: ListUserDTO,
            roles: rolesdto,
            username: username
        })
    } catch (error) {
        return res.status(500).json("Error")
    }
}

const deleteUser = async (req, res, next) => {
    console.log("run here delete");
    const result = await User.destroy({
        where: {
            id: req.query.id
        }
    });
    if(result)
    {
       next()
    }
    else
    {
        return res.status(500).json({
            message: "Error"
        })
    }
    
}

module.exports = {
    getAll,
    create,
    getRoleById,
    userManagerView,
    deleteUser
}