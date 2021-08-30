const AuthMiddleware = require('../middleware/auth.middleware')
const Device = require('../models/Device')
const User = require('../models/User')

const index = async (req, res, next) => {

    const userId = await AuthMiddleware.getIdByToken(req);

    const userFound = await User.findByPk(userId, { include: Device });

    //console.log("Devices: ", userFound.Devices);

    username = await AuthMiddleware.getUsernameByToken(req);
    return res.render('manager-device', {
        username: username,
        devices: userFound.Devices
    })
}

const create = async (req, res, next) => {
    const nameDevice = req.body.name;
    const userId = await AuthMiddleware.getIdByToken(req);

    if (!userId) {
        return res.status(500).json({ eror: "error" })
    }

    var newDevice = new Device({
        name: nameDevice,
        userId: userId
    })
    

    try {
        const result = await newDevice.save();
        //console.log("Create: ", result)
        if (result) {
            return res.redirect('/device');
        }

    } catch (error) {
        return res.status(500).json(error);

    }


}

const getAllDevice = async (req, res, next) => {

    console.log("Run here")

    const userId = await AuthMiddleware.getIdByToken(req);
    const userFound = await User.findByPk(userId, { include: Device });
    username = await AuthMiddleware.getUsernameByToken(req);

    return res.status(200).json(userFound.Devices);
}

module.exports = {
    index,
    create,
    getAllDevice
}