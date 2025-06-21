import { UnauthorizedError } from "../error-handler";

export const isSeller = (req: any, res: any, next: any) => {
  if (req.role !== "seller") {
    return next(new UnauthorizedError("Unauthorized"));
  }
  next();
};
export const isUser = (req: any, res: any, next: any) => {
  if (req.role !== "user") {
  }
  next();
};
