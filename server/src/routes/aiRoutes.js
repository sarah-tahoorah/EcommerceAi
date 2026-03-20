import { Router } from "express";
import multer from "multer";
import { comfortInsight, fashionChat, imageSearch, outfitRecommendations, sizeAdvisor, styleQuiz } from "../controllers/aiController.js";

const upload = multer({ dest: "tmp/" });
const router = Router();

router.post("/image-search", upload.single("image"), imageSearch);
router.post("/size-advisor", sizeAdvisor);
router.post("/style-quiz", styleQuiz);
router.get("/outfit/:productId", outfitRecommendations);
router.post("/chat", fashionChat);
router.get("/comfort/:productId", comfortInsight);

export default router;
