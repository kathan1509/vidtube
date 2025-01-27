import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // 1. Total number of videos uploaded by the channel
  // 2. Total number of subscribers of the channel
  // 3. Total number of likes on all the videos uploaded by the channel
  // 4. Total number of views on all the videos uploaded by the channel
  // 5. Total number of comments on all the videos uploaded by the channel
  // 6. Total number of dislikes on all the videos uploaded by the channel
  // 7. Total number of shares on all the videos uploaded by the channel
  // 8. Total number of watch hours of all the videos uploaded by the channel

  const { channelId } = req.params;
  const channel = mongoose.Types.ObjectId(channelId);

  const totalVideos = await Video.find({ channel }).countDocuments();

  const totalSubscribers = await Subscription.find({
    channel,
  }).countDocuments();

  const totalLikes = await Like.find({ channel }).countDocuments();

  const totalViews = await Video.find({ channel }).sum("views");

  const totalComments = await Video.find({ channel }).sum("comments");

  const totalDislikes = await Video.find({ channel }).sum("dislikes");

  const totalShares = await Video.find({ channel }).sum("shares");

  const totalWatchHours = await Video.find({ channel }).sum("duration");

  return res.json(
    new ApiResponse(200, "Success", {
      totalVideos,
      totalSubscribers,
      totalLikes,
      totalViews,
      totalComments,
      totalDislikes,
      totalShares,
      totalWatchHours,
    })
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const channel = mongoose.Types.ObjectId(channelId);

  const videos = await Video.find({ channel });

  return res.json(new ApiResponse(200, "Success", videos));
});

export { getChannelStats, getChannelVideos };
