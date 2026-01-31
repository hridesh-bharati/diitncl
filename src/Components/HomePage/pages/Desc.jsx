import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import './Desc.css';

// Reusable Components
const StatsCard = ({ stat, index }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(progress * numericValue);

            setAnimatedValue(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div className="col-6 col-md-3 mb-3" data-aos="fade-up" data-aos-delay={index * 100} ref={cardRef}>
      <div className="card stats-card border-0 h-100 text-center">
        <div className="card-body p-3">
          <div
            className="stat-icon mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: `${stat.color}15`,
              width: '100px',
              height: '100px'
            }}
          >
            <i className={stat.icon} style={{ color: stat.color, fontSize: '1.5rem' }}></i>
          </div>
          <h3 className="stat-value fw-bold mb-1" style={{ color: stat.color }}>
            {stat.value.includes('%') ? `${animatedValue}%` :
              stat.value.includes('+') ? `${animatedValue}+` : animatedValue}
          </h3>
          <p className="stat-label text-muted small mb-0">{stat.label}</p>
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ percent, color, height = 8 }) => {
  const [width, setWidth] = useState(0);
  const progressRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percent), 100);
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, [percent]);

  return (
    <div className="progress" style={{ height: `${height}px` }} ref={progressRef}>
      <div
        className="progress-bar rounded"
        style={{
          width: `${width}%`,
          backgroundColor: color,
          transition: 'width 1s ease-in-out'
        }}
      ></div>
    </div>
  );
};

const CourseCard = ({ course, index }) => (
  <div className="col-6 col-md-4 col-lg-3 mb-3 p-1">
    <div
      className="card course-card h-100 border-0 position-relative overflow-hidden"
      data-aos="zoom-in"
      data-aos-delay={index * 50}
    >
      <div
        className="course-bg-gradient position-absolute top-0 start-0 w-100 h-100 opacity-10"
        style={{ backgroundColor: course.color }}
      ></div>

      <div className="card-body position-relative p-3">
        <div className="d-flex align-items-center mb-3">
          <div
            className="course-icon flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center me-3"
            style={{
              backgroundColor: course.color,
              width: '45px',
              height: '45px'
            }}
          >
            <i className={`${course.icon} text-white fs-6`}></i>
          </div>
          <h6 className="course-title fw-bold mb-0 text-dark line-clamp-2">{course.name}</h6>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-medium">{course.students} enrolled</small>
            <small className="fw-bold text-dark">{course.progress}%</small>
          </div>
          <ProgressBar percent={course.progress} color={course.chartColor} height={6} />
        </div>

        <div className="d-flex justify-content-between align-items-center small">
          <div className="d-flex gap-1 small">
            <span className="badge bg-light text-dark small fw-normal">
              <i className="fa fa-calendar me-1 small"></i>
              {course.duration}
            </span>
            <span className="badge bg-light text-dark small fw-normal">
              <i className="fa fa-signal me-1 small"></i>
              {course.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ChartSection = ({ title, subtitle, badge, children, className = "" }) => (
  <div className={`card border-0 chart-section h-100 ${className}`}>
    <div className="card-header bg-transparent border-0 pb-2">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="chart-title fw-bold mb-1 text-dark">{title}</h6>
          {subtitle && <p className="chart-subtitle text-muted small mb-0">{subtitle}</p>}
        </div>
        {badge && <span className={`badge ${badge.className}`}>{badge.text}</span>}
      </div>
    </div>
    <div className="card-body pt-0">
      {children}
    </div>
  </div>
);

// Animated Circular Chart Component
const CircularChart = ({ percent, color, size = 70, label }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const chartRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentPercent = Math.round(progress * percent);
            setAnimatedPercent(currentPercent);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [percent]);

  return (
    <div className="text-center" ref={chartRef}>
      <div className="completion-chart position-relative mx-auto mb-2">
        <div
          className="rounded-circle mx-auto"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `conic-gradient(${color} ${animatedPercent * 3.6}deg, #f0f0f0 0deg)`
          }}
        >
          <div
            className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: `${size - 20}px`, height: `${size - 20}px` }}
          >
            <span className="small fw-bold">{animatedPercent}%</span>
          </div>
        </div>
      </div>
      <div className="completion-label small fw-medium text-dark">{label}</div>
    </div>
  );
};

// Main Chart Component
const AnalyticsDashboard = () => {
  const chartData = {
    completion: [
      { name: 'CCC', percent: 85, color: '#4CAF50' },
      { name: 'DCA', percent: 78, color: '#2196F3' },
      { name: 'Tally', percent: 92, color: '#FF9800' },
      { name: 'Web Dev', percent: 65, color: '#E91E63' },
      { name: 'Graphic', percent: 70, color: '#9C27B0' }
    ],
    progress: [
      { name: 'Computer Fundamentals', percent: 75, students: 240 },
      { name: 'Digital Literacy', percent: 60, students: 180 },
      { name: 'Web Development', percent: 45, students: 135 },
      { name: 'Graphic Designing', percent: 30, students: 90 },
      { name: 'Tally & Accounting', percent: 55, students: 165 }
    ]
  };

  return (
    <div className="analytics-dashboard" data-aos="fade-up">


      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Completion Chart */}
        <div className="col-12">
          <ChartSection
            title="Course Completion"
            subtitle="Success rates by course"
            badge={{ className: 'bg-success', text: 'High Performance' }}
            className="bg-light"
          >
            <div className="row g-3">
              {chartData.completion.map((item, index) => (
                <div key={index} className="col-4 col-md-4 col-lg-2">
                  <CircularChart
                    percent={item.percent}
                    color={item.color}
                    label={item.name}
                  />
                </div>
              ))}
            </div>
          </ChartSection>
        </div>
      </div>

      {/* Progress Section */}
      <ChartSection
        title="Course Progress Analytics"
        subtitle="Real-time learning progress"
        badge={{ className: 'bg-warning text-dark', text: 'Live Data' }}
        className="bg-light"
      >
        <div className="space-y-3">
          {chartData.progress.map((course, index) => (
            <div key={index} className="progress-item">
              <div className="d-flex justify-content-between align-items-center my-2">
                <span className="progress-course-name small fw-medium text-dark">
                  {course.name}
                </span>
                <div className="d-flex gap-3">
                  <small className="text-muted">{course.students} students</small>
                  <small className="fw-bold text-primary">{course.percent}%</small>
                </div>
              </div>
              <ProgressBar
                percent={course.percent}
                color={chartData.completion[index]?.color || '#1976d2'}
                height={6}
              />
            </div>
          ))}
        </div>
      </ChartSection>
    </div>
  );
};

// Featured Course Component
const FeaturedCourse = () => (
  <section className="featured-course-section py-5 bg-light">
    <div className="container-fluid">

      <div className="card featured-course-card border-0 overflow-hidden" data-aos="fade-up">
        <div className="row g-0">
          <div className="col-lg-12">
            <div className="card-body p-4 p-md-5">
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <h3 className="card-title fw-bold text-dark mb-0 me-3">
                  <Link to="/OurCourses" className="text-decoration-none text-dark hover-primary">
                    CCC Free 1-Year Course & Other Long-Term Programs
                  </Link>
                </h3>
                <span className="badge bg-white flex-shrink-0">
                  <img src="images/icon/freegift.gif" className='img-fluid' style={{ width: '50px' }} alt="" />
                </span>
              </div>

              <p className="card-text text-muted mb-4">
                Drishtee Computer Center offers a completely free 1-year CCC course designed for rural students,
                similar to ADCA and other foundational digital programs.
              </p>

              <AnalyticsDashboard />

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="instructor-info">
                    <small className="text-muted d-block mb-1">Instructor</small>
                    <strong className="text-dark">Drishtee Computer Center</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Courses Data
const coursesData = [
  {
    name: "CCC Course",
    students: "240",
    progress: 85,
    duration: "12 months",
    level: "Beginner",
    color: "#1976d2",
    chartColor: "#123bc2ff",
    icon: "fa fa-laptop"
  },
  {
    name: "DCA",
    students: "180",
    progress: 78,
    duration: "6 months",
    level: "Intermediate",
    color: "#4CAF50",
    chartColor: "#048b08ff",
    icon: "fa fa-desktop"
  },
  {
    name: "Tally",
    students: "165",
    progress: 92,
    duration: "3 months",
    level: "Advanced",
    color: "#FF9800",
    chartColor: "#ce7b00ff",
    icon: "fa fa-calculator"
  },
  {
    name: "Web Development",
    students: "135",
    progress: 65,
    duration: "8 months",
    level: "Intermediate",
    color: "#E91E63",
    chartColor: "#88002dff",
    icon: "fa fa-code"
  },
  {
    name: "Graphic Designing",
    students: "90",
    progress: 70,
    duration: "4 months",
    level: "Beginner",
    color: "#9C27B0",
    chartColor: "#6c0080ff",
    icon: "fa fa-paint-brush"
  },
  {
    name: "Digital Marketing",
    students: "120",
    progress: 55,
    duration: "5 months",
    level: "Intermediate",
    color: "#2196F3",
    chartColor: "#004b88ff",
    icon: "fa fa-bullhorn"
  }
];

// Main Courses Component
const CoursesSection = () => {
  return (
    <section className="courses-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">Our Course Catalog</h2>
          <p className="lead text-muted">14+ skills designed to transform your career path</p>
        </div>

        <div className="row">
          {coursesData.map((course, index) => (
            <CourseCard key={course.name} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};


// Main Component
const FeaturedAndCourses = () => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    AOS.init({
      duration: isMobile ? 600 : 1000,
      once: true,
      easing: 'ease-out-cubic',
      mirror: false,
      offset: 50
    });

    const handleResize = () => AOS.refresh();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="android-app-container">
      <CoursesSection />
      <FeaturedCourse />
    </div>
  );
};

export default FeaturedAndCourses;