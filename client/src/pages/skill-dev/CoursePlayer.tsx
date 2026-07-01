import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube, { YouTubeEvent } from 'react-youtube';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import CertificateViewerModal from '../../components/CertificateViewerModal';

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
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  // Watch timer reference
  const watchTimerRef = useRef<any>(null);

  // Certificate states
  const [claiming, setClaiming] = useState(false);
  const [claimedCert, setClaimedCert] = useState<any | null>(null);
  const [showCertViewer, setShowCertViewer] = useState(false);

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

        // Fetch user certifications to see if already claimed
        try {
          const certRes = await api.get('/certifications');
          const existing = certRes.data.find((c: any) => c.playlistId === playlistId);
          if (existing) {
            setClaimedCert(existing);
          }
        } catch (certErr) {
          console.error("Failed to fetch certifications in player:", certErr);
        }

      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchCourseData();
    }

    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
      }
    };
  }, [playlistId]);

  const startWatchTimer = () => {
    // Clear any existing timer first
    if (watchTimerRef.current) clearInterval(watchTimerRef.current);

    watchTimerRef.current = setInterval(async () => {
      try {
        await api.post('/courses/learning-stats/record-time', { timeSpent: 0.5 }); // record 30 seconds
      } catch (err) {
        console.error("Failed to record learning time:", err);
      }
    }, 30000); // 30 seconds
  };

  const stopWatchTimer = () => {
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
      watchTimerRef.current = null;
    }
  };

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

  const handleClaimCertificate = async () => {
    setClaiming(true);
    try {
      const res = await api.post(`/certifications/claim-internal/${playlistId}`);
      setClaimedCert(res.data.certification);
      setShowCertViewer(true);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to claim certificate");
    } finally {
      setClaiming(false);
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
      
      {/* Congratulations Card */}
      {progressPercent === 100 && (
        <div className="card border-success shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: '#f3faf7', border: '1px solid #def7ec' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-trophy-fill fs-3"></i>
              </div>
              <div>
                <h4 className="fw-bold text-success mb-1">Congratulations! Course Completed! 🎉</h4>
                <p className="text-secondary mb-0 small">
                  You have watched all {totalVideos} modules of this course. You are now eligible to claim your verified certificate of completion.
                </p>
              </div>
            </div>
            <div>
              {claimedCert ? (
                <button 
                  onClick={() => setShowCertViewer(true)} 
                  className="btn btn-success px-4 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 shadow-sm"
                >
                  <i className="bi bi-award-fill"></i> View Certificate
                </button>
              ) : (
                <button 
                  onClick={handleClaimCertificate} 
                  className="btn btn-primary px-4 py-2 rounded-pill fw-medium d-flex align-items-center gap-2 shadow-sm"
                  disabled={claiming}
                >
                  {claiming ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Claiming...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-award"></i> Claim Certificate
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                  onPlay={startWatchTimer}
                  onPause={stopWatchTimer}
                  onEnd={(e: any) => { stopWatchTimer(); handleVideoEnd(e); }}
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

      {/* Certificate Viewer Modal */}
      {claimedCert && (
        <CertificateViewerModal 
          show={showCertViewer}
          onClose={() => setShowCertViewer(false)}
          certData={{
            title: course.title,
            issuer: 'ShikshaSetu',
            issueDate: claimedCert.issueDate,
            credentialId: claimedCert.credentialId,
            userName: user?.name || "Student"
          }}
        />
      )}

    </div>
  );
};

export default CoursePlayer;
