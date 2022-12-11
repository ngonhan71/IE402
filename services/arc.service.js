const pool = require("../database/index")

const arcService = {
    create: async ({description = ""}) => {
        const sql = "insert into arc (description) values (?)"
        return await pool.query(sql, [description])
    },
    insertProvinceArc: async ({idProvince, idArc}) => {
        const sql = "insert into province_arc (idProvince, idArc) values (?, ?)"
        return await pool.query(sql, [idProvince, idArc])
    }, 
    insertPointArc: async ({idPoint, idArc, number}) => {
        const sql = "insert into arc_point (idPoint, idArc, number) values (?, ?, ?)"
        return await pool.query(sql, [idPoint, idArc, number])
    }, 

}

module.exports = arcService