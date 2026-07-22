import { asyncHandler } from "../utils/asyncHandler.js";
import * as mediaService from "../services/mediaService.js";

export const uploadPoster = asyncHandler(async (req, res) => {
  console.log("===== uploadPoster =====");
  console.log("Movie ID:", req.params.movieId);
  console.log("File:", req.file);

  const movie = await mediaService.uploadPoster(req.params.movieId, req.file);

  res.status(200).json({
    success: true,
    message: "Poster uploaded successfully",
    data: movie,
  });
});

export const uploadBanner = asyncHandler(async (req, res) => {
  const movie = await mediaService.uploadBanner(req.params.movieId, req.file);

  res.status(200).json({
    success: true,
    message: "Banner uploaded successfully",
    data: movie,
  });
});

export const uploadTrailer = asyncHandler(async (req, res) => {
  const movie = await mediaService.uploadTrailer(req.params.movieId, req.file);

  res.status(200).json({
    success: true,
    message: "Trailer uploaded successfully",
    data: movie,
  });
});