import express from "express";
import {
  createAcedemicSession,
  deleteAcedemicSession,
  fetchAllAcedemicSession,
} from "src/controllers/acedemicSessionController";
import {
  protectedRoute,
  restrictedRoute,
} from "src/controllers/authController";

const router = express.Router();

router
  .route("/createAcedemicSession")
  .post(protectedRoute, restrictedRoute(["admin"]), createAcedemicSession);

router.route("/fetchallAcedemicSession").get(fetchAllAcedemicSession);

router
  .route("/deleteAcedemicSession")
  .delete(protectedRoute, restrictedRoute(["admin"]), deleteAcedemicSession);

export default router;
