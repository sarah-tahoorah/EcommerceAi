import { Router } from "express";
import multer from "multer";
import { analytics, uploadZipDataset } from "../controllers/adminController.js";

const upload = multer({ dest: "tmp/" });
const router = Router();

router.post("/dataset", upload.single("zip"), uploadZipDataset);
router.get("/analytics", analytics);

export default router;
