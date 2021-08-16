const User = require('./User')
const Role = require('./Role')

async function init() {
    const RoleAdmin = new Role({
        rolename: 'admin'
    });
    await RoleAdmin.save();

    const RoleMember = new Role({
        rolename: 'member'
    });
    await RoleMember.save();

    const newUser = new User({
        usename: 'admin',
        password: 'admin',
        roleId: RoleAdmin.id
    }) 
    
    await newUser.save()
}

module.exports = init;