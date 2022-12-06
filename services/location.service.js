const pool = require("../database/index")

const locationService = {
    getAll: async () => {
        const sql = `   select location.*, point.*, province.name as provinceName from location, point, province
                        where location.idPoint = point.idPoint and location.idProvince = province.idProvince`
        return await pool.query(sql)
     
    },
    getAllRenderMap: async () => {
        const sql = `   SELECT location.name, point.*, symbol.url from location, point, symbol
                        where location.idPoint = point.idPoint and location.idSymbol = symbol.idSymbol;`
        return await pool.query(sql)
     
    },
    getById: async (id) => {
        return await pool.query("select * from location where idlocation = ?", [id])
      
    },
    create: async ({name, address, time, price, url, description, idPoint, idProvince, idSymbol}) => {
        const sql = "insert into location (name, address, time, price, url, description, idPoint, idProvince, idSymbol) values (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        return await pool.query(sql, [name, address, time, price, url, description, idPoint, idProvince, idSymbol])
    },
    update: async (idLocation, {name, address, time, price, url, description, idProvince, idSymbol}) => {
        const sql = `update location set name = ?, address = ?, time = ?, price = ?, url = ?, description = ?, idProvince = ?, idSymbol = ? where idLocation = ?`
        return await pool.query(sql, [name, address, time, price, url, description, idProvince, idSymbol, idLocation])
    },

}

module.exports = locationService