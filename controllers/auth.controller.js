const bcrypt = require('bcrypt')
const userService = require('../services/user.service')

const { generateAccessToken } = require('../helper/auth')

const authController = {
    login: async(req, res) => {
        try {
            const { username, password } = req.body
            const [user] = await userService.getByUsername(username)
            if (!user[0]) return res.json({ error: "Tài khoản, mật khẩu không đúng!" })

            const { name, idUser, password: passwordDB, role } = user[0]
           
            const check = await bcrypt.compare(password, passwordDB)
            if (!check) return res.json({ error: 'Tài khoản, mật khẩu không đúng!' })

            const accessToken = generateAccessToken({ id: idUser, role })

            res.status(200).json({
                message: 'Ok',
                accessToken,
                data: { name, userId: idUser, username, role }
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
}

module.exports = authController