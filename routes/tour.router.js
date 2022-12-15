const express = require('express')
const router = express.Router()

const tourController = require('../controllers/tour.controller')

router.get("/render-map", tourController.getAllRenderMap)
router.get("/", tourController.getAll)

router.get("/:id", tourController.getById)
router.post("/", tourController.create)
router.put("/:idTour", tourController.update)
// router.delete("/:id", pointController.delete)

module.exports = router