import React from 'react';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    score: string;
  }>;
  experience: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    technologies: string;
    description: string;
  }>;
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    softSkills: string;
  };
  isFresher: boolean;
}

interface ATSResumeTemplateProps {
  data: ResumeData;
}

const ATSResumeTemplate: React.FC<ATSResumeTemplateProps> = ({ data }) => {
  return (
    <div className="ats-resume-container" style={{
      fontFamily: "'Arial', 'Calibri', 'Times New Roman', sans-serif",
      fontSize: "11pt",
      lineHeight: "1.5",
      color: "#000",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#fff",
      textAlign: "left"
    }}>
      {/* Personal Info */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <h1 style={{ fontSize: "24pt", margin: "0 0 5px 0", textTransform: "uppercase" }}>{data.personalInfo.fullName}</h1>
        <div style={{ fontSize: "11pt" }}>
          {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div style={{ marginBottom: "15px" }}>
          <p style={{ margin: "0" }}>{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "14pt", borderBottom: "1px solid #000", textTransform: "uppercase", paddingBottom: "2px", marginBottom: "8px" }}>Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>{edu.institution}</span>
                <span>{edu.startDate} - {edu.endDate || 'Present'}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{edu.degree}</span>
                {edu.score && <span>Score: {edu.score}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience - Conditionally Rendered */}
      {!data.isFresher && data.experience.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "14pt", borderBottom: "1px solid #000", textTransform: "uppercase", paddingBottom: "2px", marginBottom: "8px" }}>Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>{exp.jobTitle} - {exp.company}</span>
                <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => {
                  const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                  return <li key={i} style={{ marginBottom: "3px" }}>{cleanLine}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "14pt", borderBottom: "1px solid #000", textTransform: "uppercase", paddingBottom: "2px", marginBottom: "8px" }}>Projects</h2>
          {data.projects.map((proj, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: "bold" }}>
                {proj.title} {proj.technologies && <span style={{ fontWeight: "normal", fontStyle: "italic" }}>| {proj.technologies}</span>}
              </div>
              <ul style={{ margin: "5px 0 0 0", paddingLeft: "20px" }}>
                {proj.description.split('\n').filter(line => line.trim() !== '').map((line, i) => {
                  const cleanLine = line.replace(/^[•\-\*]\s*/, '');
                  return <li key={i} style={{ marginBottom: "3px" }}>{cleanLine}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {(data.skills.languages || data.skills.frameworks || data.skills.tools || data.skills.softSkills) && (
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "14pt", borderBottom: "1px solid #000", textTransform: "uppercase", paddingBottom: "2px", marginBottom: "8px" }}>Technical Skills</h2>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            {data.skills.languages && <li style={{ marginBottom: "3px" }}><strong>Languages:</strong> {data.skills.languages}</li>}
            {data.skills.frameworks && <li style={{ marginBottom: "3px" }}><strong>Frameworks/Libraries:</strong> {data.skills.frameworks}</li>}
            {data.skills.tools && <li style={{ marginBottom: "3px" }}><strong>Tools/Platforms:</strong> {data.skills.tools}</li>}
            {data.skills.softSkills && <li style={{ marginBottom: "3px" }}><strong>Soft Skills:</strong> {data.skills.softSkills}</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSResumeTemplate;
