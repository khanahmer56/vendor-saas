import prisma from "../../../../packages/libs/prisma";

export const getCategories = async (req: any, res: any, next: any) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      return res.status(404).json({ message: "site config not found" });
    }
    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next();
  }
};
