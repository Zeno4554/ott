import { asyncHandler } from "../utils/asyncHandler.js";
import * as categoryService from "../services/categoryService.js";

export const createCategoryController = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getCategoriesController = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getCategoryByIdController = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});