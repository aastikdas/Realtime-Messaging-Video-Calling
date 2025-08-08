import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getRecommendedUsers, getMyFriends,sendFriendRquest,acceptFriendRquest, getFriendRequest,getOutgoingFriendRequest } from "../controllers/user.controller.js";
const router = express.Router()

//apply all middleware to all routes
router.use(protectRoute)
router.get("/", getRecommendedUsers )
router.get("/friends", getMyFriends )

router.post("/friend-request/:id", sendFriendRquest )

router.put("/friend-request/:id/accept", acceptFriendRquest )
// todo: reject a friend request

router.get("/friend-request", getFriendRequest)
router.get("/outgoing-friend-request", getOutgoingFriendRequest)


export default router 