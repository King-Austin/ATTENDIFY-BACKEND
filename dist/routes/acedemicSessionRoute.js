"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const acedemicSessionController_1 = require("src/controllers/acedemicSessionController");
const authController_1 = require("src/controllers/authController");
const router = express_1.default.Router();
router
    .route("/createAcedemicSession")
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), acedemicSessionController_1.createAcedemicSession);
router.route("/fetchallAcedemicSession").get(acedemicSessionController_1.fetchAllAcedemicSession);
router
    .route("/deleteAcedemicSession")
    .delete(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), acedemicSessionController_1.deleteAcedemicSession);
exports.default = router;
