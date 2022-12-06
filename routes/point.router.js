const express = require('express')
const router = express.Router()

const pointController = require('../controllers/point.controller')

// router.get("/", pointController.getAll)
// router.get("/:id", pointController.getById)
// router.post("/", pointController.create)
router.put("/:id", pointController.update)
// router.delete("/:id", pointController.delete)

module.exports = router