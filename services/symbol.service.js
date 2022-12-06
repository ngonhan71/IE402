const pool = require("../database/index")

const loaigheService = {
    getAll: async () => {
        return await pool.query("select * from symbol")
     
    },
    getById: async (id) => {
        return await pool.query("select * from symbol where idSymbol = ?", [id])
      
    },
    create: async ({name, url}) => {
        const sql = "insert into symbol (name, url) values (?, ?)"
        return await pool.query(sql, [name, url])
    },
    update: async (id, {name, url}) => {
        const sql = "update symbol set name = ?, url = ? where idSymbol = ?"
        return await pool.query(sql, [name, url, id])
    }, 
    delete: async (id) => {
        return await pool.query("delete from symbol where idSymbol = ?", [id])
    }

}

module.exports = loaigheService