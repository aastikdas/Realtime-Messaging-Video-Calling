import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";
const router= express.Router()
//here the token is different from jwt, here we use this to authenticate the stream user to know us

router.get("/token", protectRoute, getStreamToken)

export default router