const symbolService = require('../services/symbol.service')

const symbolController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await symbolService.getAll()
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
            const [rows] = await symbolService.getById(id)
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
            const { name, url } = req.body
            const [rows] = await symbolService.create({name, url})
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
            const { name, url } = req.body
            const { id } = req.params
            const [rows] = await symbolService.update(id, {name, url})

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
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [rows] = await symbolService.delete(id)

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
    }

}

module.exports = symbolController
