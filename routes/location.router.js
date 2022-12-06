const express = require('express')
const router = express.Router()

const locationController = require('../controllers/location.controller')

router.get("/render-map", locationController.getAllRenderMap)
router.get("/", locationController.getAll)
router.get("/:id", locationController.getById)
router.post("/", locationController.create)
router.put("/:id", locationController.update)
// router.delete("/:id", locationController.delete)

module.exports = router