import {
  NotFoundError,
  ValidationError,
} from "../../../../packages/error-handler";
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

// create discoutn codes
export const createDiscountCode = async (req: any, res: any, next: any) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode: discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(new ValidationError("Discount code already exist"));
    }
    const newDiscountCode = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Discount code created", newDiscountCode });
  } catch (error) {
    next(error);
  }
};

export const getDiscountCodes = async (req: any, res: any, next: any) => {
  try {
    const discountCodes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });
    return res.status(200).json({ discountCodes });
  } catch (error) {
    next(error);
  }
};
// export const getDiscountCodes = async (req: any, res: any) => {
//   try {
//     const seller = req.seller; // injected by middleware
//     if (!seller?.shop?.id) {
//       return res.status(400).json({ message: "Shop not found for seller" });
//     }
//     console.log("seller", seller);
//     const discountCodes = await prisma.discount_codes.findMany({
//       where: { sellerId: seller.id },
//     });

//     return res.status(200).json({ discountCodes });
//   } catch (error) {
//     console.error("Error fetching discount codes:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const deleteDiscountCode = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;
    const discountCode = await prisma.discount_codes.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        sellerId: true,
      },
    });
    if (!discountCode) {
      return next(new NotFoundError("Discount code not found"));
    }
    if (discountCode.sellerId !== sellerId) {
      return next(
        new ValidationError("You are not allowed to delete this code")
      );
    }
    await prisma.discount_codes.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "Discount code deleted" });
  } catch (error) {
    next(error);
  }
};
