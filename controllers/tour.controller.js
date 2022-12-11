const tourService = require('../services/tour.service')
const arcService = require('../services/arc.service')
const pool = require("../database/index")

const tourController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await tourService.getAll()
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
            const [rows] = await tourService.getAll()
            let data = []
            for (let i = 0; i < rows.length; i++) {
                const [detail] = await tourService.getRenderMapById(rows[i].idTour)
                data.push({
                    name: rows[i].name,
                    totalPrice: rows[i].totalPrice,
                    time: rows[i].time,
                    color: rows[i].color,
                    paths: detail
                })
            }
            res.json({
                data: data,
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
            const [rows] = await tourService.getById(id)
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
    create: async (req, res) => {
        let conn = null;
        try {
            const {name, provinceList, locationList, color } = req.body
            conn = await pool.getConnection()
            await conn.beginTransaction()

            const [arcRows] = await arcService.create({description: `Cung ${name}`})
            const idArc = arcRows?.insertId

            if (idArc > 0) {
                for (let i = 0; i < provinceList.length; i++) {
                    await arcService.insertProvinceArc({idProvince: provinceList[i]?.value, idArc})
                }

                let price = 0
                let time = 0
                for (let i = 0; i < locationList.length; i++) {
                    const number = i + 1
                    await arcService.insertPointArc({idPoint: locationList[i]?.idPoint, idArc, number})
                    price += locationList[i].price
                    time += locationList[i].time
                }

                const [rows] = await tourService.create({name, totalTime: time, totalPrice: price, idArc, color})
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
}

module.exports = tourController
