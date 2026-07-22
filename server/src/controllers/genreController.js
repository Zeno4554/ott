import { asyncHandler } from "../utils/asyncHandler.js";
import * as genreService from "../services/genreService.js";

export const createGenreController = asyncHandler(async (req, res) => {
  const genre = await genreService.createGenre(req.body);

  res.status(201).json({
    success: true,
    message: "Genre created successfully",
    data: genre,
  });
});

export const getGenresController = asyncHandler(async (req, res) => {
  const genres = await genreService.getGenres();

  res.status(200).json({
    success: true,
    data: genres,
  });
});

export const getGenreByIdController = asyncHandler(async (req, res) => {
  const genre = await genreService.getGenreById(req.params.id);

  res.status(200).json({
    success: true,
    data: genre,
  });
});

export const updateGenreController = asyncHandler(async (req, res) => {
  const genre = await genreService.updateGenre(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Genre updated successfully",
    data: genre,
  });
});

export const deleteGenreController = asyncHandler(async (req, res) => {
  await genreService.deleteGenre(req.params.id);

  res.status(200).json({
    success: true,
    message: "Genre deleted successfully",
  });
});