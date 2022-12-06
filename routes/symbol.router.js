const express = require('express')
const router = express.Router()

const symbolController = require('../controllers/symbol.controller')

router.get("/", symbolController.getAll)
router.get("/:id", symbolController.getById)
router.post("/", symbolController.create)
router.put("/:id", symbolController.update)
router.delete("/:id", symbolController.delete)

module.exports = router