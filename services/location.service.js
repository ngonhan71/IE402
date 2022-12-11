const pool = require("../database/index")

const locationService = {
    getAll: async ({limit, offset = 0}) => {
        let sql = `   select location.*, point.*, province.name as provinceName from location, point, province
                        where location.idPoint = point.idPoint and location.idProvince = province.idProvince`
        const params = []
        if (limit) {
            sql += ` limit ? offset ?`
            params.push(limit, offset)
        }
        return await pool.query(sql, params)
     
    },
    getAllRenderMap: async () => {
        const sql = `   SELECT location.name, location.idLocation, location.address, point.*, symbol.url from location, point, symbol
                        where location.idPoint = point.idPoint and location.idSymbol = symbol.idSymbol;`
        return await pool.query(sql)
     
    },
    getCount: async () => {
        const sql = `select count(*) as count from location`
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