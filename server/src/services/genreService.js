import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

const generateSlug = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, "-");

export async function createGenre(data) {
  const slug = generateSlug(data.name);

  const existing = await prisma.genre.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug }
      ]
    }
  });

  if (existing) {
    throw new ApiError(409, "Genre already exists");
  }

  return prisma.genre.create({
    data: {
      name: data.name,
      slug
    }
  });
}

export async function getGenres() {
  return prisma.genre.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getGenreById(id) {
  const genre = await prisma.genre.findUnique({
    where: { id }
  });

  if (!genre) {
    throw new ApiError(404, "Genre not found");
  }

  return genre;
}

export async function updateGenre(id, data) {
  const genre = await prisma.genre.findUnique({
    where: { id }
  });

  if (!genre) {
    throw new ApiError(404, "Genre not found");
  }

  const slug = generateSlug(data.name);

  return prisma.genre.update({
    where: { id },
    data: {
      name: data.name,
      slug
    }
  });
}

export async function deleteGenre(id) {
  const genre = await prisma.genre.findUnique({
    where: { id }
  });

  if (!genre) {
    throw new ApiError(404, "Genre not found");
  }

  return prisma.genre.delete({
    where: { id }
  });
}