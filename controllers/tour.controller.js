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
                    idTour: rows[i].idTour,
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
    update: async (req, res) => {
        let conn = null;
        try {
            const { idTour } = req.params
            const {name, provinceList, locationList, idArc } = req.body
            conn = await pool.getConnection()
            await conn.beginTransaction()

            await arcService.update(idArc, {description: `Cung ${name}`})

            if (idArc > 0) {
                const [dsProvinceBefore] = await arcService.getProvinceByIdArc(idArc)
                const [dsLocationBefore] = await arcService.getPointByIdArc(idArc)
              
                for (let i = 0; i < dsProvinceBefore.length; i++) {
                    const found = provinceList.find(tl => tl === dsProvinceBefore[i]['idProvince'])
                    if (!found) {
                        await arcService.removeProvince(idArc, dsProvinceBefore[i]['idProvince'])
                    }
                }

                for (let i = 0; i < provinceList.length; i++) {
                    const found = dsProvinceBefore.find(tl => tl['idProvince'] === provinceList[i])
                    if (!found) {
                        await arcService.insertProvinceArc({idProvince: provinceList[i], idArc})
                    }
                }

                for (let i = 0; i < dsLocationBefore.length; i++) {
                    const found = locationList.find(tl => tl.idPoint === dsLocationBefore[i]['idPoint'])
                    if (!found) {
                        await arcService.removePoint(idArc, dsLocationBefore[i]['idPoint'])
                    } 
                }
                let price = 0
                let time = 0
                for (let i = 0; i < locationList.length; i++) {
                    price += locationList[i].price
                    time += locationList[i].time
                    const number = i + 1
                    const found = dsLocationBefore.find(tl => tl['idPoint'] === locationList[i]['idPoint'])
                    if (!found) {
                        await arcService.insertPointArc({idPoint: locationList[i]['idPoint'], idArc, number})
                    }
                }

                const [after] = await arcService.getPointByIdArc(idArc)
                for (let i = 0; i < locationList.length; i++) {
                    const found = after.find(tl => tl['idPoint'] === locationList[i]['idPoint'])
                    if (found) {
                        await arcService.updateNumber({idPoint: locationList[i]['idPoint'], idArc, number: i + 1})
                    }
                }

                const [rows] = await tourService.update(idTour, {name, totalTime: time, totalPrice: price})
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
