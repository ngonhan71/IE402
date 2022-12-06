const pool = require("../database/index")

const provinceService = {
    getAll: async () => {
        return await pool.query("select * from province")
     
    },
    getById: async (id) => {
        return await pool.query("select * from province where idProvince = ?", [id])
      
    },
    create: async ({name, description, url}) => {
        const sql = "insert into province (name, description, url) values (?, ?, ?)"
        return await pool.query(sql, [name, description, url])
    },
    update: async (id, {name, description, url}) => {
        const sql = "update province set name = ?, description = ?, url = ? where idProvince = ?"
        return await pool.query(sql, [name, description, url, id])
    }, 
    // delete: async (id) => {
    //     return await pool.query("delete from province where idProvince = ?", [id])
    // }

}

module.exports = provinceService