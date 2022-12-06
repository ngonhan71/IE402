const provinceService = require('../services/province.service')

const provinceController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await provinceService.getAll()
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
            const [rows] = await provinceService.getById(id)
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
        try {
            const { name, description, url } = req.body
            const [rows] = await provinceService.create({name, description, url})
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
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    update: async (req, res) => {
        try {
            const { name, description, url } = req.body
            const { id } = req.params

            const [rows] = await provinceService.update(id, {name, description, url})

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
    //         const [rows] = await provinceService.delete(id)

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

module.exports = provinceController
