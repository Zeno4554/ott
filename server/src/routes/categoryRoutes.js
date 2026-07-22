import { Router } from "express";

import { validate } from "../middlewares/validate.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../validators/categoryValidators.js";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = Router();

router.post(
  "/",
  validate(createCategorySchema),
  createCategoryController
);

router.get("/", getCategoriesController);

router.get(
  "/:id",
  validate(categoryIdSchema),
  getCategoryByIdController
);

router.put(
  "/:id",
  validate(updateCategorySchema),
  updateCategoryController
);

router.delete(
  "/:id",
  validate(categoryIdSchema),
  deleteCategoryController
);

export default router;