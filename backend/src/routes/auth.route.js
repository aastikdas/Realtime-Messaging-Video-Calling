import express from "express";
import { login, logout, signUp, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router= express.Router()

router.post("/signup", signUp)
router.post("/logout", logout)
router.post("/login", login)
// add forget password
// add welcome email to the given email
router.post("/onboard", protectRoute ,onboard)


//check user is loggedin or not
router.get("/me", protectRoute, (req,res)=>{
    res.status(200).json({success:true, user:req.user})
})

export default router