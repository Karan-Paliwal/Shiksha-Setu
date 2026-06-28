import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube, { YouTubeEvent } from 'react-youtube';
import api from '../../services/api';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnails: any;
  position: number;
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  videos: Video[];
}

const CoursePlayer: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  // Hardcoded for testing. You'd normally get this from your Auth context
  const mockUserId = "60d0fe4f5311236168a109ca";

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const res = await api.get(`/courses/${playlistId}`);
        const data = res.data;
        setCourse(data);
        if (data.videos && data.videos.length > 0) {
          setCurrentVideo(data.videos[0]);
        }

        // Fetch progress
        const progRes = await api.get(`/courses/progress/${playlistId}`);
        setCompletedVideos(progRes.data.completedVideoIds || []);

      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchCourseData();
    }
  }, [playlistId]);

  const handleVideoEnd = async (event: YouTubeEvent) => {
    if (!currentVideo) return;

    // Mark locally
    if (!completedVideos.includes(currentVideo.id)) {
      setCompletedVideos(prev => [...prev, currentVideo.id]);

      // Update backend
      try {
        await api.post(`/courses/progress/${playlistId}`, { videoId: currentVideo.id });
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }

    // Auto-play next
    if (course) {
      const currentIndex = course.videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex >= 0 && currentIndex < course.videos.length - 1) {
        setCurrentVideo(course.videos[currentIndex + 1]);
      }
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1 as 1 | 0,
    },
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="p-5 text-center text-danger">Error: {error}</div>;
  if (!course) return <div className="p-5 text-center">Course not found</div>;

  const totalVideos = course.videos.length;
  const progressPercent = totalVideos > 0 ? Math.round((completedVideos.length / totalVideos) * 100) : 0;

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <button onClick={() => navigate('/dashboard/skill-dev')} className="btn btn-sm btn-light border mb-2">
            <i className="bi bi-arrow-left"></i> Back to Hub
          </button>
          <h2 className="fw-bold">{course.title}</h2>
          <p className="text-secondary mb-0">By {course.channelTitle}</p>
        </div>
        <div className="text-end">
          <div className="fw-medium text-dark mb-1">Your Progress: {progressPercent}%</div>
          <div className="progress rounded-pill" style={{ width: '200px', height: '10px' }}>
            <div className="progress-bar bg-success" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Video Player */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <div className="ratio ratio-16x9 bg-dark">
              {currentVideo ? (
                <YouTube
                  videoId={currentVideo.id}
                  opts={opts}
                  onEnd={handleVideoEnd}
                  className="position-absolute top-0 start-0 w-100 h-100"
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center text-white">No video selected</div>
              )}
            </div>
            {currentVideo && (
              <div className="p-4">
                <h4 className="fw-bold">{currentVideo.title}</h4>
                <p className="text-secondary mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {currentVideo.description.length > 200
                    ? currentVideo.description.substring(0, 200) + '...'
                    : currentVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border rounded-4 h-100 d-flex flex-column">
            <div className="p-3 border-bottom bg-light rounded-top-4">
              <h5 className="fw-bold mb-0">Course Content</h5>
              <small className="text-secondary">{completedVideos.length} / {totalVideos} completed</small>
            </div>

            <div className="list-group list-group-flush overflow-auto flex-grow-1" style={{ maxHeight: '600px' }}>
              {course.videos.map((video, index) => {
                const isPlaying = currentVideo?.id === video.id;
                const isCompleted = completedVideos.includes(video.id);

                return (
                  <button
                    key={video.id}
                    onClick={() => setCurrentVideo(video)}
                    className={`list-group-item list-group-item-action p-3 d-flex gap-3 align-items-start border-bottom 
                      ${isPlaying ? 'bg-primary bg-opacity-10' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <i className="bi bi-check-circle-fill text-success fs-5"></i>
                      ) : isPlaying ? (
                        <i className="bi bi-play-circle-fill text-primary fs-5"></i>
                      ) : (
                        <span className="text-secondary fw-bold" style={{ width: '24px', display: 'inline-block', textAlign: 'center' }}>
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <div className={`fw-medium mb-1 ${isPlaying ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
                        {video.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
