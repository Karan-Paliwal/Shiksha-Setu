import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./SkillDevHome.css"; // Reuse existing skill-dev CSS styles

interface CourseCatalogItem {
  playlistId: string;
  title: string;
  channelTitle: string;
  category: string;
  thumbnailUrl: string;
  description: string;
}

const EXPLORE_COURSES: CourseCatalogItem[] = [
  {
    playlistId: "PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
    title: "ReactJS Tutorial for Beginners",
    channelTitle: "Codevolution",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/QFaFIcGhPoM/hqdefault.jpg",
    description: "Learn the fundamentals of React.js, from components and state to lifecycle methods and hooks."
  },
  {
    playlistId: "PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
    title: "Python OOP Tutorials",
    channelTitle: "Corey Schafer",
    category: "Backend",
    thumbnailUrl: "https://img.youtube.com/vi/ZDa-Z5JzLYM/hqdefault.jpg",
    description: "Master Object-Oriented Programming concepts in Python, including classes, inheritance, and decorators."
  },
  {
    playlistId: "PL4cUxeGkcC9ivBf_1c5OB8nVIG36ecMUM",
    title: "HTML & CSS for Beginners",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/hu-q2zYwEYs/hqdefault.jpg",
    description: "Build your first website. Learn HTML structures, CSS styling, responsive design, and layout fundamentals."
  },
  {
    playlistId: "PL4cUxeGkcC9i9Ae2D9GoM1UpCp5wFnLJg",
    title: "Modern JavaScript",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/iWOYAxlnaw0/hqdefault.jpg",
    description: "Go from novice to advanced in JavaScript. Study arrays, functions, DOM manipulation, and ES6+ features."
  },
  {
    playlistId: "PL4cUxeGkcC9goXbgtdQ0n_4ZJVSh1pm0V",
    title: "Git & GitHub Tutorial",
    channelTitle: "Net Ninja",
    category: "DevOps",
    thumbnailUrl: "https://img.youtube.com/vi/3RjQzNTaRxY/hqdefault.jpg",
    description: "Learn version control with Git. Master repositories, commits, branching, merging, and collaboration on GitHub."
  },
  {
    playlistId: "PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU",
    title: "Node.js Crash Course",
    channelTitle: "Net Ninja",
    category: "Backend",
    thumbnailUrl: "https://img.youtube.com/vi/yEHCfGQs0gY/hqdefault.jpg",
    description: "Build fast backend applications. Understand Express routing, request lifecycle, MongoDB integration, and MVC patterns."
  },
  {
    playlistId: "PL4cUxeGkcC9gUxsHzYL581I8rGPwAl175",
    title: "TypeScript Tutorial",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/2pZmKW9-I_k/hqdefault.jpg",
    description: "Add static typing to your JavaScript. Learn TypeScript types, compiler options, interfaces, and classes."
  },
  {
    playlistId: "PL4cUxeGkcC9h75mAlYiTyDot1dRJSn3y-",
    title: "MongoDB Crash Course",
    channelTitle: "Net Ninja",
    category: "Database",
    thumbnailUrl: "https://img.youtube.com/vi/bxsemcrY4gQ/hqdefault.jpg",
    description: "Learn NoSQL database concepts. Master MongoDB CRUD operations, indexing, schemas, and Compass GUI."
  },
  {
    playlistId: "PL4cUxeGkcC9gpXGRLykd3nFnETGP877U6",
    title: "Tailwind CSS Tutorial",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/bxmDnn7VgUQ/hqdefault.jpg",
    description: "Style websites rapidly. Master Tailwind's utility-first classes, grid layouts, responsive modifiers, and configuration."
  },
  {
    playlistId: "PL4cUxeGkcC9jLYyp2Aoh6hcceIpRY57la",
    title: "Flutter Tutorial for Beginners",
    channelTitle: "Net Ninja",
    category: "Mobile",
    thumbnailUrl: "https://img.youtube.com/vi/1ukSR1GRtMU/hqdefault.jpg",
    description: "Build beautiful cross-platform mobile apps. Understand Dart, Flutter widgets, state management, and asset loading."
  },
  {
    playlistId: "PL4cUxeGkcC9i5yM746P6wP01S77fbc8la",
    title: "CSS Grid Tutorial",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/t6CBKaYFImM/hqdefault.jpg",
    description: "Master two-dimensional web layouts. Learn tracks, grid lines, template areas, grid gap, and responsive alignment."
  },
  {
    playlistId: "PL4cUxeGkcC9hxjeJoV2F3KCvCXpsGzA8Z",
    title: "Docker Tutorial for Beginners",
    channelTitle: "Net Ninja",
    category: "DevOps",
    thumbnailUrl: "https://img.youtube.com/vi/gAkwW2tuIqE/hqdefault.jpg",
    description: "Containerize your software. Master Dockerfiles, images, containers, volumes, networks, and compose setups."
  },
  {
    playlistId: "PL4cUxeGkcC9hYYGbVPMcJWwXS7DFsA9-c",
    title: "Vue 3 Tutorial for Beginners",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/YrxBCBibVo0/hqdefault.jpg",
    description: "Learn modern frontend programming with Vue 3. Understand data binding, events, components, and Composition API."
  },
  {
    playlistId: "PL4cUxeGkcC9jERUGvbudErRlDxJZAKQfE",
    title: "Firebase Auth Tutorial",
    channelTitle: "Net Ninja",
    category: "Backend",
    thumbnailUrl: "https://img.youtube.com/vi/9gNKu9j4104/hqdefault.jpg",
    description: "Secure your apps. Implement email/password login, Google OAuth, session management, and firestore guards."
  },
  {
    playlistId: "PL4cUxeGkcC9iExF0R3VJgxqc992u6O5hS",
    title: "SASS / SCSS Tutorial",
    channelTitle: "Net Ninja",
    category: "Frontend",
    thumbnailUrl: "https://img.youtube.com/vi/wYzUAHRlo_4/hqdefault.jpg",
    description: "Write modular CSS. Learn variables, nesting, mixins, import rules, math operations, and compile pipelines."
  }
];

const ExploreCourses: React.FC = () => {
  const navigate = useNavigate();
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const coursesPerPage = 9;

  useEffect(() => {
    fetchSavedCourses();
  }, []);

  const fetchSavedCourses = async () => {
    try {
      const res = await api.get("/courses/saved");
      setSavedCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch saved courses:", error);
    }
  };

  const toggleSaveCourse = async (course: CourseCatalogItem) => {
    try {
      await api.post("/courses/save", {
        playlistId: course.playlistId,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        channelTitle: course.channelTitle
      });
      fetchSavedCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const isSaved = (playlistId: string) => savedCourses.some(c => c.playlistId === playlistId);

  // Filter courses by category
  const filteredCourses = selectedCategory === "All"
    ? EXPLORE_COURSES
    : EXPLORE_COURSES.filter(c => c.category === selectedCategory);

  // Get current page's courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Mobile"];

  return (
    <div className="container-fluid py-4 fade-in pb-5">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button onClick={() => navigate("/dashboard/skill-dev")} className="btn btn-sm btn-light border mb-2">
            <i className="bi bi-arrow-left"></i> Back to Hub
          </button>
          <h1 className="fw-bold text-dark mb-1 fs-3">Explore Courses</h1>
          <p className="text-secondary mb-0 small">
            Browse our handpicked technical catalog to build real-world software skills.
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${selectedCategory === cat ? 'btn-primary' : 'btn-light border text-secondary'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3x3 Course Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {currentCourses.map((course) => {
          const saved = isSaved(course.playlistId);
          return (
            <div key={course.playlistId} className="col">
              <div className="card border shadow-sm rounded-4 h-100 hover-shadow transition overflow-hidden d-flex flex-column">
                <div className="position-relative" style={{ height: "180px" }}>
                  <img
                    src={course.thumbnailUrl}
                    className="w-100 h-100 object-fit-cover"
                    alt={course.title}
                  />
                  <span className="badge bg-dark bg-opacity-75 position-absolute top-0 end-0 m-3 px-2.5 py-1.5 rounded-pill" style={{ fontSize: "0.75rem" }}>
                    {course.category}
                  </span>
                </div>
                <div className="card-body p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold text-dark mb-0 fs-5 text-truncate-2" title={course.title} style={{ minHeight: "48px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "24px" }}>
                      {course.title}
                    </h6>
                  </div>
                  <p className="text-muted small mb-3">{course.channelTitle}</p>
                  <p className="text-secondary small mb-4 flex-grow-1 text-truncate-3" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "60px", lineHeight: "20px" }}>
                    {course.description}
                  </p>
                  
                  <div className="d-flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/dashboard/skill-dev/course/${course.playlistId}`)}
                      className="btn btn-primary btn-sm flex-grow-1 fw-semibold py-2 rounded-pill d-flex align-items-center justify-content-center gap-1"
                    >
                      <i className="bi bi-play-fill"></i> Start Learning
                    </button>
                    <button
                      onClick={() => toggleSaveCourse(course)}
                      className={`btn btn-sm rounded-pill border px-3 ${saved ? 'btn-primary border-primary' : 'btn-light'}`}
                      title={saved ? "Remove Bookmark" : "Save Course"}
                    >
                      <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="btn btn-sm btn-light border rounded-circle p-2 d-flex align-items-center"
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left fs-5"></i>
          </button>
          <span className="fw-semibold text-secondary small">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="btn btn-sm btn-light border rounded-circle p-2 d-flex align-items-center"
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-right fs-5"></i>
          </button>
        </div>
      )}

    </div>
  );
};

export default ExploreCourses;
