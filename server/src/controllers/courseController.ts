import { Request, Response } from 'express';
import { fetchPlaylistDetails } from '../services/courseService';
import CourseProgress from '../models/CourseProgress';
import SavedCourse from '../models/SavedCourse';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/auth';

export const getCourseDetails = async (req: Request, res: Response) => {
  try {
    const { playlistId } = req.params;
    const course = await fetchPlaylistDetails(playlistId);
    res.json(course);
  } catch (error: any) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch course details' });
  }
};

export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const { playlistId } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const progress = await CourseProgress.findOne({ 
      userId: new Types.ObjectId(userId), 
      playlistId 
    });
    
    res.json({ completedVideoIds: progress ? progress.completedVideoIds : [] });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Failed to fetch course progress' });
  }
};

export const markVideoCompleted = async (req: Request, res: Response) => {
  try {
    const { playlistId } = req.params;
    const { videoId } = req.body;
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;

    if (!userId || !videoId) {
      return res.status(400).json({ message: 'userId and videoId are required' });
    }

    const progress = await CourseProgress.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), playlistId },
      { $addToSet: { completedVideoIds: videoId } },
      { upsert: true, new: true }
    );

    res.json({ completedVideoIds: progress.completedVideoIds });
  } catch (error: any) {
    console.error('Error marking video completed:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

// Toggle save/unsave course
export const toggleSaveCourse = async (req: Request, res: Response) => {
  try {
    const { playlistId, title, description, thumbnailUrl, channelTitle } = req.body;
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;

    if (!userId || !playlistId) {
      return res.status(400).json({ message: 'userId and playlistId are required' });
    }

    const objectId = new Types.ObjectId(userId);
    const existingSaved = await SavedCourse.findOne({ userId: objectId, playlistId });

    if (existingSaved) {
      // Unsave
      await SavedCourse.findByIdAndDelete(existingSaved._id);
      return res.json({ message: 'Course removed from saved paths', saved: false });
    } else {
      // Save
      const newSaved = new SavedCourse({
        userId: objectId,
        playlistId,
        title,
        description,
        thumbnailUrl,
        channelTitle
      });
      await newSaved.save();
      return res.json({ message: 'Course added to saved paths', saved: true });
    }
  } catch (error: any) {
    console.error('Save course error:', error);
    return res.status(500).json({ message: error.message || 'Failed to save course' });
  }
};

// Get all saved courses
export const getSavedCourses = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const objectId = new Types.ObjectId(userId as string);
    const savedCourses = await SavedCourse.find({ userId: objectId }).sort({ savedAt: -1 });
    return res.json(savedCourses);
  } catch (error: any) {
    console.error('Get saved courses error:', error);
    return res.status(500).json({ message: error.message || 'Failed to fetch saved courses' });
  }
};
