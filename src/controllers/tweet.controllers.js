import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;

  if (!content || !videoId) {
    throw new ApiError(400, "Content and videoId are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweet = await Tweet.create({
    content,
    videoId,
    owner: req.user._id,
  });

  // Update user's tweets array
  await User.findByIdAndUpdate(req.user._id, {
    $push: { tweets: tweet._id },
  });

  const createdTweet = await Tweet.findById(tweet._id).populate(
    "owner",
    "username fullName avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ owner: userId })
    .populate("owner", "username fullName avatar")
    .sort("-createdAt");

  return res.json(
    new ApiResponse(200, tweets, "User tweets fetched successfully")
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tweetId = req.params.tweetId;
  const { content } = req.body;

  if (!isValidObjectId(userId) || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid userId or tweetId");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  tweet.content = content;
  await tweet.save();

  const updatedTweet = await Tweet.findById(tweetId).populate(
    "owner",
    "username fullName avatar"
  );

  return res.json(
    new ApiResponse(200, updatedTweet, "Tweet updated successfully")
  );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tweetId = req.params.tweetId;

  if (!isValidObjectId(userId) || !isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid userId or tweetId");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res.json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
