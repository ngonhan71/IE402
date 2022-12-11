const pool = require("../database/index")

const tourService = {
    getAll: async () => {
        const sql = `select * from tour`
        return await pool.query(sql)
     
    },
    getRenderMapById: async (id) => {
        const sql = `   select location.name, location.idLocation, location.price, location.time, point.*
                        from tour, arc, arc_point, location, point
                        where tour.idArc = arc.idArc
                        and arc.idArc = arc_point.idArc
                        and arc_point.idPoint = location.idPoint
                        and location.idPoint = point.idPoint
                        and tour.idTour = ?
                        order by arc_point.number`
        return await pool.query(sql, [id])
     
    },
    getById: async (id) => {
        const sql = `   select * from tour, arc, arc_point, location
                        where tour.idArc = arc.idArc
                        and arc.idArc = arc_point.idArc
                        and arc_point.idPoint = location.idPoint
                        and tour.idTour = ?`
        return await pool.query(sql, [id])
     
    },
    create: async ({name, totalTime, totalPrice, description = "", color, idArc}) => {
        const sql = "insert into tour (name, time, totalPrice, description, color, idArc) values (?, ?, ?, ?, ?, ?)"
        return await pool.query(sql, [name, totalTime, totalPrice, description, color, idArc])
    },
    // update: async (id, {longitude, latitude}) => {
    //     const sql = "update point set longitude = ?, latitude = ? where idPoint = ?"
    //     return await pool.query(sql, [longitude, latitude, id])
    // }, 

}

module.exports = tourService