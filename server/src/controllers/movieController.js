import { asyncHandler } from "../utils/asyncHandler.js";
import * as movieService from "../services/movieService.js";

export const createMovieController = asyncHandler(async (req, res) => {
  const movie = await movieService.createMovie(req.body);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie,
  });
});

export const getMoviesController = asyncHandler(async (req, res) => {
  const movies = await movieService.getMovies();

  res.status(200).json({
    success: true,
    data: movies,
  });
});

export const getMovieByIdController = asyncHandler(async (req, res) => {
  const movie = await movieService.getMovieById(req.params.id);

  res.status(200).json({
    success: true,
    data: movie,
  });
});

export const updateMovieController = asyncHandler(async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: movie,
  });
});

export const deleteMovieController = asyncHandler(async (req, res) => {
  await movieService.deleteMovie(req.params.id);

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
});