import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function generateCategories() {
  try {
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length === 0) {
      const categories = [];
      for (let i = 0; i < 100; i++) {
        const category = { name: faker.commerce.department() };
        categories.push(category);
      }
      await prisma.category.createMany({ data: categories });
      console.log('Categories created successfully.');
    } else {
      console.log('Categories already exist. Skipping creation.');
    }
  } catch (error) {
    console.error('Error generating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateCategories();
