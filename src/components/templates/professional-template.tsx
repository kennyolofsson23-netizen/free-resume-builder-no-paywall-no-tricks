'use client'

import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  if (!year) return dateStr
  if (!month) return year
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function ProfessionalTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  // Darken the accent color for sidebar background by computing a darkened variant
  const sidebarBg = accentColor

  return (
    <div
      id="resume-preview"
      className="resume-preview w-[816px] min-h-[1056px] bg-white"
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '11px',
        color: '#111',
        lineHeight: '1.55',
        display: 'flex',
      }}
    >
      {/* Left sidebar — 240px */}
      <div
        style={{
          width: '240px',
          flexShrink: 0,
          backgroundColor: sidebarBg,
          color: '#fff',
          padding: '36px 24px',
          minHeight: '1056px',
        }}
      >
        {/* Name */}
        <div
          style={{
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.25)',
            paddingBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
              margin: '0 0 4px',
              lineHeight: '1.3',
              wordBreak: 'break-word',
            }}
          >
            {p.fullName}
          </h1>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '9px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 10px',
            }}
          >
            Contact
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {p.email && (
              <span style={{ wordBreak: 'break-all' }}>{p.email}</span>
            )}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.website && (
              <span style={{ wordBreak: 'break-all' }}>
                {p.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.linkedin && (
              <span style={{ wordBreak: 'break-all' }}>
                {p.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  'linkedin.com/in/'
                )}
              </span>
            )}
            {p.github && (
              <span style={{ wordBreak: 'break-all' }}>
                {p.github.replace(
                  /^https?:\/\/(www\.)?github\.com\//,
                  'github.com/'
                )}
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 10px',
              }}
            >
              Skills
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              {resume.skills.map((skill) => (
                <div
                  key={skill.id}
                  style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                    }}
                  >
                    <span>{skill.name}</span>
                    {skill.level && (
                      <span
                        style={{
                          opacity: 0.65,
                          fontSize: '9px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '9px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 10px',
              }}
            >
              Certifications
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {resume.certifications.map((cert) => (
                <div
                  key={cert.id}
                  style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}
                >
                  <div style={{ fontWeight: '600' }}>{cert.name}</div>
                  <div style={{ opacity: 0.75, marginTop: '1px' }}>
                    {cert.issuer}
                  </div>
                  <div
                    style={{ opacity: 0.6, fontSize: '9px', marginTop: '1px' }}
                  >
                    {formatDate(cert.issueDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div style={{ flex: 1, padding: '36px 32px' }}>
        {/* Summary */}
        {p.summary && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 6px',
                borderBottom: `1.5px solid ${accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Summary
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>
              {p.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 12px',
                borderBottom: `1.5px solid ${accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Experience
            </h2>
            {resume.experiences.map((exp) => (
              <div
                key={exp.id}
                style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12px', color: '#111827' }}>
                      {exp.jobTitle}
                    </strong>
                    <span style={{ color: '#4b5563' }}>, {exp.company}</span>
                    {exp.location && (
                      <span style={{ color: '#9ca3af' }}>, {exp.location}</span>
                    )}
                  </div>
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {formatDate(exp.startDate)} –{' '}
                    {exp.currentlyWorking
                      ? 'Present'
                      : formatDate(exp.endDate ?? '')}
                  </span>
                </div>
                {exp.description && (
                  <div
                    style={{
                      marginTop: '5px',
                      color: '#374151',
                      lineHeight: '1.65',
                    }}
                  >
                    {exp.description.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 12px',
                borderBottom: `1.5px solid ${accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Education
            </h2>
            {resume.education.map((edu) => (
              <div
                key={edu.id}
                style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12px', color: '#111827' }}>
                      {edu.school}
                    </strong>
                    <div style={{ color: '#4b5563' }}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                      {edu.gpa && (
                        <span style={{ color: '#9ca3af' }}>
                          {' '}
                          · GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {formatDate(edu.startDate)} –{' '}
                    {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 12px',
                borderBottom: `1.5px solid ${accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Projects
            </h2>
            {resume.projects.map((proj) => (
              <div
                key={proj.id}
                style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12px', color: '#111827' }}>
                      {proj.title}
                    </strong>
                    {proj.link && (
                      <span
                        style={{
                          color: accentColor,
                          marginLeft: '6px',
                          fontSize: '10px',
                        }}
                      >
                        {proj.link.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {proj.startDate && (
                    <span
                      style={{
                        color: '#6b7280',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px',
                      }}
                    >
                      {formatDate(proj.startDate)}
                      {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '4px', color: '#374151' }}>
                  {proj.description}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div
                    style={{
                      marginTop: '4px',
                      color: '#9ca3af',
                      fontSize: '10px',
                    }}
                  >
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
