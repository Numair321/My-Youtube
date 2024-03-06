import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;  

    
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    
    const existingLike = await Like.findOne({ userId, videoId });
    if (existingLike) {
    
        await Like.findByIdAndDelete(existingLike._id);
        res.json(new ApiResponse("Like removed"));
    } else {
        
        await Like.create({ userId, videoId });
        res.json(new ApiResponse("Like added"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;  

    
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
 
    const existingLike = await Like.findOne({ userId, commentId });
    if (existingLike) {
        
        await Like.findByIdAndDelete(existingLike._id);
        res.json(new ApiResponse("Like removed"));
    } else {
        
        await Like.create({ userId, commentId });
        res.json(new ApiResponse("Like added"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;  
 
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

     
    const existingLike = await Like.findOne({ userId, tweetId });
    if (existingLike) {
         
        await Like.findByIdAndDelete(existingLike._id);
        res.json(new ApiResponse("Like removed"));
    } else {
        await Like.create({ userId, tweetId });
        res.json(new ApiResponse("Like added"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;  
 
    const likedVideos = await Like.find({ userId, videoId: { $exists: true } });
    res.json(new ApiResponse("Liked videos retrieved", likedVideos));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
