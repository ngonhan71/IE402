const locationService = require('../services/location.service')
const pointService = require('../services/point.service')
const pool = require("../database/index")

const locationController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await locationService.getAll()
            res.json({
                data: rows,
                message: "Ok",
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getAllRenderMap: async (req, res) => {
        try {
            const [rows] = await locationService.getAllRenderMap()
            res.json({
                data: rows,
                message: "Ok",
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows] = await locationService.getById(id)
            res.json({
                data: rows[0],
                message: "Ok",
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    create: async (req, res) => {
        let conn = null;
        try {
            const { name, address, time, price, url, description, idProvince, idSymbol, longitude, latitude } = req.body
            conn = await pool.getConnection()
            await conn.beginTransaction()

            const [pointRows] = await pointService.create({longitude, latitude})
            const idPoint = pointRows?.insertId

            const [rows] = await locationService.create({name, address, time, price, url, description, idProvince, idSymbol, idPoint})
            await conn.commit();
            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: error
                })
            }
        } catch (error) {
            conn.rollback()
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        } finally {
            if (conn) await conn.release();
        }
    },
    update: async (req, res) => {
        try {
            const { name, address, time, price, url, description, idProvince, idSymbol } = req.body
            const { id } = req.params
            const [rows] = await locationService.update(id, {name, address, time, price, url, description, idProvince, idSymbol})

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Not Found"
                })
            }
         
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    }, 
    // delete: async (req, res) => {
    //     try {
    //         const { id } = req.params
    //         const [rows] = await symbolService.delete(id)

    //         if (rows?.affectedRows) {
    //             res.json({
    //                 data: rows,
    //                 message: "Ok",
    //             })
    //         } else {
    //             res.json({
    //                 status: "error",
    //                 error: "Not Found"
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // }

}

module.exports = locationController
