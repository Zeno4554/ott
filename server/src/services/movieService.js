import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export async function createMovie(data) {
      console.log("Incoming data:", data);
  console.log("Category ID:", data.categoryId);
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (data.genreIds.length > 0) {
    const genres = await prisma.genre.findMany({
      where: {
        id: {
          in: data.genreIds,
        },
      },
    });

    if (genres.length !== data.genreIds.length) {
      throw new ApiError(404, "One or more genres not found");
    }
  }

  return prisma.movie.create({
    data: {
      title: data.title,
      description: data.description,
      releaseYear: data.releaseYear,
      duration: data.duration,
      language: data.language,
      categoryId: data.categoryId,

      genres: {
        create: data.genreIds.map((genreId) => ({
          genre: {
            connect: {
              id: genreId,
            },
          },
        })),
      },
    },

    include: {
      category: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
}

export async function getMovies() {
  return prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
}

export async function getMovieById(id) {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      category: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return movie;
}

export async function updateMovie(id, data) {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (data.genreIds.length > 0) {
    const genres = await prisma.genre.findMany({
      where: {
        id: {
          in: data.genreIds,
        },
      },
    });

    if (genres.length !== data.genreIds.length) {
      throw new ApiError(404, "One or more genres not found");
    }
  }

  return prisma.movie.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      releaseYear: data.releaseYear,
      duration: data.duration,
      language: data.language,
      categoryId: data.categoryId,

      genres: {
        deleteMany: {},
        create: data.genreIds.map((genreId) => ({
          genre: {
            connect: {
              id: genreId,
            },
          },
        })),
      },
    },
    include: {
      category: true,
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });
}

export async function deleteMovie(id) {
  const movie = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return prisma.movie.delete({
    where: { id },
  });
}