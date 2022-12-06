const express = require('express')
const router = express.Router()

const provinceController = require('../controllers/province.controller')

router.get("/", provinceController.getAll)
router.get("/:id", provinceController.getById)
router.post("/", provinceController.create)
router.put("/:id", provinceController.update)
// router.delete("/:id", provinceController.delete)

module.exports = router