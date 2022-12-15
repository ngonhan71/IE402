const pool = require("../database/index")

const arcService = {
    getProvinceByIdArc: async (idArc) => {
        const sql = `select * from province_arc where idArc = ?`
        return await pool.query(sql, [idArc])
     
    },
    getPointByIdArc: async (idArc) => {
        const sql = `select * from arc_point where idArc = ? order by number`
        return await pool.query(sql, [idArc])
     
    },
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
    update: async (idArc, {description = ""}) => {
        const sql = "update arc set description = ? where idArc = ?"
        return await pool.query(sql, [description, idArc])
    },
    updateNumber: async ({idArc, idPoint, number}) => {
        const sql = "update arc_point set number = ? where idArc = ? and idPoint = ?"
        return await pool.query(sql, [number, idArc, idPoint])
    },
    removeProvince: async (idArc, idProvince) => {
        const sql = "delete from province_arc where idArc = ? and idProvince = ?"
        return await pool.query(sql, [idArc, idProvince])
    },
    removePoint: async (idArc, idPoint) => {
        const sql = "delete from arc_point where idArc = ? and idPoint = ?"
        return await pool.query(sql, [idArc, idPoint])
    },

}

module.exports = arcService