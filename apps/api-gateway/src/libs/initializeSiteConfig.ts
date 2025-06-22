import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const initializeConfig = async () => {
  try {
    const existing = await prisma.site_config.findFirst();
    if (!existing) {
      await prisma.site_config.create({
        data: {
          categories: ["Electronics", "Fashion"],
          subCategories: {
            Electronics: ["Mobile", "Laptops", "Cameras"],
            Fashion: ["Men", "Women", "Kids"],
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export default initializeConfig;
