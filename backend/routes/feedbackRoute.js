import express from "express";

const router = express.Router();
import { createfeedback, getAllfeedback } from "../controllers/feedback.js";


router.get("/", getAllfeedback);
router.post("/", createfeedback);
export default router;
