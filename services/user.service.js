const pool = require("../database/index")

const userService = {
    getById: async (id) => {
        const sql = "select * from user where idUser = ? "
        return await pool.query(sql, [id])
    },
    getByUsername: async (username) => {
        const sql = "select * from user where username = ? "
        return await pool.query(sql, [username])
        
    },
}

module.exports = userService