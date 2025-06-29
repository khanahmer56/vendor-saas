import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const initializeConfig = async () => {
  try {
    const existing = await prisma.site_config.findFirst();
    if (!existing) {
      await prisma.site_config.create({
        data: {
          categories: [
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Sports & Fitness",
          ],
          subCategories: {
            Electronics: ["Mobile", "Laptops", "Cameras"],
            Fashion: ["Men", "Women", "Kids"],
            HomeKitchen: ["Kitchen", "Bedroom", "Living Room"],
            "Sports & Fitness": ["Football", "Basketball", "Tennis"],
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export default initializeConfig;
