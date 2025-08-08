import FriendRequest from "../models/FriendRequest.model.js";
import User from "../models/user.model.js";

const getRecommendedUsers = async (req, res)=>{
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        // now i donot want to have my own name or my friends here
        const recommendedUsers = await User.find({
            $and:[
                {_id : {$ne:currentUserId}}, // remove my self
                {_id: {$nin: currentUser.friends}},// remove friends
                {isOnboarded: true},
            ],
        })
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.error("Error in the getRecommendedUsers controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
const getMyFriends = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id)
          .select("friends")
          .populate("friends", "fullName bio avatar location")
        res.status(200).json(user.friends)
    } catch (error) {
        console.error("Error in the getMyFriends controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

const sendFriendRquest = async(req,res)=>{
try {
    const myId = req.user.id;
    const {id:recipientId} =  req.params;

    // prevent sending req to yourslef
    if(myId == recipientId) {
        console.log("Blocked: Trying to send request to yourself.");
        return res.status(400).json({message:"Your cannot send friend request to yourself"})
    }
    const recipient = await User.findById(recipientId)
    
    if(!recipient){
        console.log("Recipient not found");
        return res.status(404).json({message:"user not found"})
    }

    //check is user is already friends
    if(recipient.friends.includes(myId)){
        console.log("Already friends with the user");
        return res.status(400).json({message:"Your are already friends with this user"})
    }

    // if a request already exsists.
    const exsistingReq = await FriendRequest.findOne({
        $or:[
            {sender:myId, recipient:recipientId},
            {sender:recipientId, recipient:myId},
        ]
    })
    if(exsistingReq){
        return res.status(400).json({message:"A request already exisitng between your and user"})
    }

    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient:recipientId,
    })
    res.status(201).json(friendRequest)

} catch (error) {
    console.error("Error in the sendFriendRequest controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
}
}

const acceptFriendRquest= async(req, res)=>{
    try {
        const {id:requestId}= req.params
        const friendRequest = await FriendRequest.findById(requestId);
        //check if requesit is valid or not
        if(!friendRequest){
            res.status(404).json({message:"No friend request found"});
        }
        // verify the current user is the recipient or not
        if(friendRequest.recipient.toString()!== req.user.id){
            res.status(403).json({message:"Unauthorized to accept the request"});
        }
        friendRequest.status="accepted"
        await friendRequest.save();
        // now my id will be in nuber 2 list and in my list i will have his id also

        // add each user to other friend array
        // addToSet : this will add elemet to array only if they donot exist
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends: friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends: friendRequest.sender}
        })
        res.status(200).json({message:"Friend request accepted"});
    } catch (error) {
        console.error("Error in the acceptFriendRquest controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

const getFriendRequest= async (req,res)=>{
    try {
        const incomingReqs = await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender", "fullName avatar location")
        const acceptedReqs = await FriendRequest.find({
            $or:[
                {sender: req.user.id},
                {recipient: req.user.id},
            ],
            status:"accepted"
        }).populate([
            {path: "sender", select: "fullName avatar location"},
            {path: "recipient", select: "fullName avatar location"},
        ])

        res.status(200).json({incomingReqs,acceptedReqs});
    } catch (error) {
        console.error("Error in the getFriendRequest controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

const getOutgoingFriendRequest= async (req, res)=>{
try {
        const outgoingReqs = await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient", "fullName avatar location")
        res.status(200).json({outgoingReqs});
    } catch (error) {
        console.error("Error in the getOutgoingFriendRequest controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export {getMyFriends, getRecommendedUsers, sendFriendRquest, acceptFriendRquest, getFriendRequest,getOutgoingFriendRequest}