import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    page = parseInt(page);
    limit = parseInt(limit);
    let filter = {};
 
    if (userId) {
        filter.userId = userId;
    }
 
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    let sort = {};
    if (sortBy) {
        sort[sortBy] = sortType === 'desc' ? -1 : 1;
    }

    try {
        // Fetch videos with pagination, sorting, and filtering
        const videos = await Video.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Count total number of videos (for pagination)
        const totalVideos = await Video.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: videos,
            pagination: {
                total: totalVideos,
                limit,
                page
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoData = req.file;  

    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(videoData);

    // Create video document in database
    const video = new Video({
        title,
        description,
        videoUrl: uploadedVideo.url, // Assuming uploadOnCloudinary returns an object with URL
        cloudinaryId: uploadedVideo.public_id // Assuming uploadOnCloudinary returns an object with public_id
        // Other video properties if any
    });

    // Save video document
    await video.save();

    res.status(201).json({ success: true, data: video });

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json({ success: true, data: video });
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
     
    const { title, description, thumbnail } = req.body;

    // Update video details in the database
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { title, description, thumbnail },
        { new: true, runValidators: true }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json({ success: true, data: updatedVideo });

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json({ success: true, data: {} });
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Toggle publish status
    video.published = !video.published;
    
    // Save updated video
    await video.save();

    res.status(200).json({ success: true, data: video });
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
