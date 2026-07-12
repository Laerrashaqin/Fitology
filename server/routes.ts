import { Router } from "express";
import { analyzeBodyShape } from "./controllers/analyzeController";
import { addProduct } from "./controllers/productController";

const router = Router();

router.post("/analyze", analyzeBodyShape);
router.post("/admin/add-product", addProduct);

export default router;
