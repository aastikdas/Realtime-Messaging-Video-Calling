import { generateStreamToken } from "../lib/stream.js";

const getStreamToken = async (req, res)=>{
    try {
        const token = generateStreamToken(req.user.id);
        return res.status(200).json({token})
    } catch (error) {
        console.error("Error in the getStreamToken controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export {getStreamToken}