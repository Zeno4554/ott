import { Router } from "express";
import { validate } from "../middlewares/validate.js";

import {
  createGenreSchema,
  updateGenreSchema,
  genreIdSchema,
} from "../validators/genreValidators.js";

import {
  createGenreController,
  getGenresController,
  getGenreByIdController,
  updateGenreController,
  deleteGenreController,
} from "../controllers/genreController.js";

const router = Router();

router.post("/", validate(createGenreSchema), createGenreController);

router.get("/", getGenresController);

router.get("/:id", validate(genreIdSchema), getGenreByIdController);

router.put("/:id", validate(updateGenreSchema), updateGenreController);

router.delete("/:id", validate(genreIdSchema), deleteGenreController);

export default router;