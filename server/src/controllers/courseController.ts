import { Request, Response } from 'express';
import { fetchPlaylistDetails } from '../services/courseService';
import CourseProgress from '../models/CourseProgress';
import SavedCourse from '../models/SavedCourse';
import User from '../models/User';
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

    // Initialize course progress if it doesn't exist yet, to mark it as started
    const progress = await CourseProgress.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), playlistId },
      { $setOnInsert: { completedVideoIds: [] } },
      { upsert: true, new: true }
    );
    
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

// Helper to normalize a date to midnight in UTC/local for reliable day comparison
const getMidnightDate = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Fetch learning stats for user
export const getLearningStats = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset todayLearningTime if a new day has started
    const now = new Date();
    const todayMidnight = getMidnightDate(now);
    
    if (user.lastActiveDate) {
      const lastActiveMidnight = getMidnightDate(user.lastActiveDate);
      const diffTime = todayMidnight.getTime() - lastActiveMidnight.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays >= 1) {
        // It's a new day! If they skipped more than 1 day, reset streak
        if (diffDays > 1) {
          user.learningStreak = 0;
        }
        user.todayLearningTime = 0;
        await user.save();
      }
    } else {
      user.todayLearningTime = 0;
      user.learningStreak = 0;
      await user.save();
    }

    res.json({
      dailyLearningGoal: user.dailyLearningGoal || 60,
      todayLearningTime: Math.round(user.todayLearningTime || 0),
      learningStreak: user.learningStreak || 0
    });
  } catch (error: any) {
    console.error('Error fetching learning stats:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch learning stats' });
  }
};

// Record study time
export const recordLearningTime = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;
    const { timeSpent } = req.body; // In minutes, e.g. 0.5

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (timeSpent === undefined || typeof timeSpent !== 'number') {
      return res.status(400).json({ message: 'Valid timeSpent is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const todayMidnight = getMidnightDate(now);
    
    let isNewDay = false;
    let incrementStreak = false;

    if (user.lastActiveDate) {
      const lastActiveMidnight = getMidnightDate(user.lastActiveDate);
      const diffTime = todayMidnight.getTime() - lastActiveMidnight.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays >= 1) {
        isNewDay = true;
        // If they studied yesterday, increment streak
        if (diffDays === 1) {
          incrementStreak = true;
        } else {
          // Studied older than yesterday, restart streak at 1
          user.learningStreak = 1;
        }
      }
    } else {
      // First activity ever!
      user.learningStreak = 1;
    }

    if (isNewDay) {
      user.todayLearningTime = 0;
    }

    // Add time
    user.todayLearningTime = (user.todayLearningTime || 0) + timeSpent;
    user.lastActiveDate = now;

    if (isNewDay && incrementStreak) {
      user.learningStreak = (user.learningStreak || 0) + 1;
    } else if (user.learningStreak === 0) {
      user.learningStreak = 1;
    }

    await user.save();

    res.json({
      dailyLearningGoal: user.dailyLearningGoal || 60,
      todayLearningTime: Math.round(user.todayLearningTime || 0),
      learningStreak: user.learningStreak || 0
    });
  } catch (error: any) {
    console.error('Error recording learning time:', error);
    res.status(500).json({ message: error.message || 'Failed to update learning stats' });
  }
};

export const getActiveCourses = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const objectId = new Types.ObjectId(userId as string);
    const progresses = await CourseProgress.find({ userId: objectId });

    const activeCourses = [];

    for (const prog of progresses) {
      try {
        // Fetch playlist details
        const courseDetails = await fetchPlaylistDetails(prog.playlistId);
        if (!courseDetails) continue;

        const totalVideos = courseDetails.videos.length;
        const progressPercent = totalVideos > 0 
          ? Math.min(100, Math.round((prog.completedVideoIds.length / totalVideos) * 100)) 
          : 0;

        activeCourses.push({
          playlistId: prog.playlistId,
          title: courseDetails.title,
          description: courseDetails.description,
          thumbnailUrl: courseDetails.videos[0]?.thumbnails?.high?.url || courseDetails.videos[0]?.thumbnails?.medium?.url || 'https://via.placeholder.com/640x360?text=Course',
          channelTitle: courseDetails.channelTitle,
          progress: progressPercent,
          completedCount: prog.completedVideoIds.length,
          totalCount: totalVideos
        });
      } catch (err) {
        console.error(`Error fetching active course details for ${prog.playlistId}:`, err);
      }
    }

    return res.json(activeCourses);
  } catch (error: any) {
    console.error('Error fetching active courses:', error);
    return res.status(500).json({ message: 'Failed to fetch active courses' });
  }
};

