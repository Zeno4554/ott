import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export async function createCategory(data) {
  const { name } = data;

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name },
        { slug }
      ]
    }
  });

  if (existing) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data: {
      name,
      slug
    }
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
}

export async function updateCategory(id, data) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const slug = data.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      slug,
    },
  });
}

export async function deleteCategory(id) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return prisma.category.delete({
    where: { id },
  });
}