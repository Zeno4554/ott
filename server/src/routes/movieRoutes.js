import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createMovieSchema,
  updateMovieSchema,
  movieIdSchema,
} from "../validators/movieValidators.js";

import {
  createMovieController,
  getMoviesController,
  getMovieByIdController,
  updateMovieController,
  deleteMovieController,
} from "../controllers/movieController.js";

const router = Router();

router.post("/", validate(createMovieSchema), createMovieController);

router.get("/", getMoviesController);

router.get("/:id", validate(movieIdSchema), getMovieByIdController);

router.put("/:id", validate(updateMovieSchema), updateMovieController);

router.delete("/:id", validate(movieIdSchema), deleteMovieController);

export default router;