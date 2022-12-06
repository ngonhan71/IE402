const pool = require("../database/index")

const pointService = {
    getAll: async () => {
        return await pool.query("select * from point")
     
    },
    getById: async (id) => {
        return await pool.query("select * from point where idPoint = ?", [id])
      
    },
    create: async ({longitude, latitude}) => {
        const sql = "insert into point (longitude, latitude) values (?, ?)"
        return await pool.query(sql, [longitude, latitude])
    },
    update: async (id, {longitude, latitude}) => {
        const sql = "update point set longitude = ?, latitude = ? where idPoint = ?"
        return await pool.query(sql, [longitude, latitude, id])
    }, 

}

module.exports = pointService