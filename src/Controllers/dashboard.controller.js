import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { channelId } = req.params;

    // Get total video views
    const totalVideoViews = await Video.aggregate([
        { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channelId });

    // Get total videos uploaded by the channel
    const totalVideos = await Video.countDocuments({ channelId });

    // Get total likes for all videos of the channel
    const totalLikes = await Like.countDocuments({ channelId });

    res.status(200).json({
        success: true,
        data: {
            totalVideoViews: totalVideoViews.length > 0 ? totalVideoViews[0].totalViews : 0,
            totalSubscribers,
            totalVideos,
            totalLikes
        }
    });
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Get all videos uploaded by the channel
    const videos = await Video.find({ channelId });

    res.status(200).json({
        success: true,
        data: videos
    });
});

export {
    getChannelStats, 
    getChannelVideos
    }