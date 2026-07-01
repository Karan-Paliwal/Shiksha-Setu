import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Certification from '../models/Certification';
import User from '../models/User';
import CourseProgress from '../models/CourseProgress';
import { fetchPlaylistDetails } from '../services/courseService';
import crypto from 'crypto';

// Fetch all certifications for the current logged-in user
export const getUserCertifications = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const certifications = await Certification.find({ userId: new Types.ObjectId(userId as string) }).sort({ issueDate: -1 });
    res.json(certifications);
  } catch (error: any) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch certifications' });
  }
};

// Verify and add an external Credly credential
export const verifyCredlyBadge = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;
    const { credentialUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!credentialUrl) {
      return res.status(400).json({ message: 'Credly badge URL is required' });
    }

    // Parse badge URL
    let badgeId = '';
    try {
      const urlObj = new URL(credentialUrl);
      if (!urlObj.hostname.includes('credly.com')) {
        return res.status(400).json({ message: 'URL must be a valid credly.com domain' });
      }
      
      const pathParts = urlObj.pathname.split('/').filter(Boolean); // ['badges', 'd2f09d84-c8c7-43cf-bc0c-d3807ab0b9d9']
      const badgesIndex = pathParts.indexOf('badges');
      if (badgesIndex === -1 || !pathParts[badgesIndex + 1]) {
        return res.status(400).json({ message: "Invalid URL structure. It should contain '/badges/BADGE_ID'" });
      }
      badgeId = pathParts[badgesIndex + 1];
    } catch (e) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    // Check if badge is already registered in the system
    const existingCert = await Certification.findOne({ credentialId: badgeId });
    if (existingCert) {
      if (existingCert.userId.toString() === userId.toString()) {
        return res.status(400).json({ message: 'You have already added this certification' });
      } else {
        return res.status(400).json({ message: 'This certification is already claimed by another user' });
      }
    }

    // Find the user to get their name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch Credly page on the server
    const targetUrl = `https://www.credly.com/badges/${badgeId}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(400).json({ message: 'Failed to access the Credly badge page. Please make sure the URL is public and valid.' });
    }

    const html = await response.text();

    // 1. Extract og:title (Format usually: "Badge Title - Issuer")
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);

    if (!titleMatch) {
      return res.status(400).json({ message: 'Failed to verify credential metadata. Make sure the badge is public.' });
    }

    const fullTitle = titleMatch[1];
    const parts = fullTitle.split(' - ');
    const title = parts[0]?.trim() || 'Unknown Credential';
    let issuer = parts[1]?.trim() || 'Credly';
    
    if (issuer.toLowerCase() === 'credly') {
      // Try to fallback to finding "issued by" in description
      const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);
      if (descMatch) {
        const desc = descMatch[1];
        const issuerMatch = desc.match(/issued by ([^a-z0-9]+)/i) || desc.match(/from ([^a-z0-9]+)/i);
        if (issuerMatch) issuer = issuerMatch[1].trim();
      }
    }

    // 2. Extract description to find holder's name or scan the HTML body
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) ||
                      html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    const description = descMatch ? descMatch[1] : '';

    const normalizedHtml = html.toLowerCase();
    const normalizedDesc = description.toLowerCase();
    const normalizedName = user.name.toLowerCase();

    // Check if the user's name appears anywhere in the description or the HTML body
    const nameParts = normalizedName.split(/\s+/).filter(part => part.length > 2);
    const hasName = normalizedDesc.includes(normalizedName) || 
                    normalizedHtml.includes(normalizedName) ||
                    (nameParts.length > 0 && nameParts.every(part => normalizedHtml.includes(part)));

    if (!hasName) {
      return res.status(400).json({
        message: `Name verification failed. The name on the Credly credential does not match your ShikshaSetu profile name (${user.name}).`
      });
    }

    // Save certification
    const certification = new Certification({
      userId: new Types.ObjectId(userId as string),
      type: 'external',
      title: title.replace(' - Credly', '').trim(),
      issuer,
      issueDate: new Date(), // Since exact date might not be og:meta parsed, we default to today or let user update
      credentialUrl,
      credentialId: badgeId,
      isVerified: true
    });

    await certification.save();

    res.status(201).json({
      message: 'Certification verified and added successfully!',
      certification
    });
  } catch (error: any) {
    console.error('Error verifying Credly badge:', error);
    res.status(500).json({ message: error.message || 'Failed to verify certification' });
  }
};

// Claim a certificate for completing an internal YouTube course (100% video progress)
export const claimInternalCertificate = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.userId || req.body.userId;
    const { playlistId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get Course details from YouTube API Service
    const course = await fetchPlaylistDetails(playlistId);
    if (!course || !course.videos || course.videos.length === 0) {
      return res.status(404).json({ message: 'Course/Playlist not found' });
    }

    // Fetch user progress
    const progress = await CourseProgress.findOne({
      userId: new Types.ObjectId(userId as string),
      playlistId
    });

    if (!progress) {
      return res.status(400).json({ message: 'No learning progress found for this course' });
    }

    // Check if progress is 100% (or at least equal to total videos)
    const completedCount = progress.completedVideoIds.length;
    const totalCount = course.videos.length;

    if (completedCount < totalCount) {
      return res.status(400).json({
        message: `Course incomplete. You have completed ${completedCount} out of ${totalCount} videos. Please watch all videos to claim your certificate.`
      });
    }

    // Check if user already claimed this certificate
    const existingCert = await Certification.findOne({
      userId: new Types.ObjectId(userId as string),
      playlistId
    });

    if (existingCert) {
      return res.status(200).json({
        message: 'Certificate already claimed!',
        certification: existingCert
      });
    }

    // Generate unique credential verification ID
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const credentialId = `SS-CERT-${playlistId.substring(0, 6).toUpperCase()}-${randomHex}`;

    // Create internal certification
    const certification = new Certification({
      userId: new Types.ObjectId(userId as string),
      type: 'internal',
      title: course.title,
      issuer: 'ShikshaSetu',
      issueDate: new Date(),
      credentialUrl: `/dashboard/skill-dev/course/${playlistId}`,
      credentialId,
      playlistId,
      isVerified: true
    });

    await certification.save();

    res.status(201).json({
      message: 'Congratulations! Your certificate of completion has been issued.',
      certification
    });
  } catch (error: any) {
    console.error('Error claiming certificate:', error);
    res.status(500).json({ message: error.message || 'Failed to claim certificate' });
  }
};
