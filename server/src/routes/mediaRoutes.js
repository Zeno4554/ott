import { Router } from "express";
import upload from "../middlewares/upload.js";
import * as mediaController from "../controllers/mediaController.js";
import { authenticate, authorize } from "../middlewares/authenticate.js";

const router = Router();

router.post(
  "/poster/:movieId",
  authenticate,
  authorize("ADMIN"),
  upload.single("file"),
  mediaController.uploadPoster
);

router.post(
  "/banner/:movieId",
  authenticate,
  authorize("ADMIN"),
  upload.single("file"),
  mediaController.uploadBanner
);

router.post(
  "/trailer/:movieId",
  authenticate,
  authorize("ADMIN"),
  upload.single("file"),
  mediaController.uploadTrailer
);

export default router;