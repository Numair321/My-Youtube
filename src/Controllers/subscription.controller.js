import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.user;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const existingSubscription = await Subscription.findOne({ userId, channelId });

    if (existingSubscription) {
        await Subscription.deleteOne({ userId, channelId });
        res.status(200).json({ success: true, message: "Unsubscribed successfully" });
    } else {
        const subscription = new Subscription({ userId, channelId });
        await subscription.save();
        res.status(201).json({ success: true, message: "Subscribed successfully" });
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channelId }).populate("userId");

    res.status(200).json({ success: true, data: subscribers });
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const subscriptions = await Subscription.find({ userId: subscriberId }).populate("channelId");

    res.status(200).json({ success: true, data: subscriptions });
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};