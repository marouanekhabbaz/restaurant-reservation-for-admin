/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservationId/status").get(controller.read).put(controller.update)
router.route("/:reservationId").get(controller.read).put(controller.updatewholeReservation)
router.route("/").get(controller.list).post(controller.create)
module.exports = router;
