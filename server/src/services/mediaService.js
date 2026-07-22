import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

function uploadToCloudinary(fileBuffer, folder, resourceType = "image") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

export async function uploadPoster(movieId, file) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const result = await uploadToCloudinary(
    file.buffer,
    "ott/posters",
    "image"
  );

  return prisma.movie.update({
    where: { id: movieId },
    data: {
      posterUrl: result.secure_url,
    },
  });
}

export async function uploadBanner(movieId, file) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const result = await uploadToCloudinary(
    file.buffer,
    "ott/banners",
    "image"
  );

  return prisma.movie.update({
    where: { id: movieId },
    data: {
      bannerUrl: result.secure_url,
    },
  });
}

export async function uploadTrailer(movieId, file) {
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const result = await uploadToCloudinary(
    file.buffer,
    "ott/trailers",
    "video"
  );

  return prisma.movie.update({
    where: { id: movieId },
    data: {
      trailerUrl: result.secure_url,
    },
  });
}