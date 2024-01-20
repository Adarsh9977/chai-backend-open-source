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
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if([title, description].some((field)=>field?.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const viedoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.file?.thimbnail[0]?.path;

    if(!viedoLocalPath){
        throw new ApiError(400, "video file is required")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "thumbnail is required")
    }

    const video = await uploadOnCloudinary(viedoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!video){
        throw new ApiError(400,"videofile is not uploaded on cloudinary")
    }

    if(!thumbnail){
        throw new ApiError(400, " thumbnail file is mnot uploaded on cloudinary")
    }

    const uploadedVideo = await Video.create({
        title:title,
        description:description,
        videoFile: video.url,
        thumbnail : thumbnail.url,
        duration: video.duration,
        isPublished: isPublished,
        owner : new mongoose.Types.ObjectId(req.user._id)

    })
    if(!uploadedVideo){
        throw new ApiError(400, "something went wrong on uploading video")
    }

    const createdVideo = await Video.findById(uploadedVideo._id);

    if(!createdVideo){
        throw new ApiError(400, "something went wrong while creating video")
    }

    return res.status(200)
    .json(new ApiResponse(200, createdVideo, "video uploaded successfully"))


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
