'use client'

import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthName = months[parseInt(month ?? '1') - 1] ?? ''
  return `${monthName} ${year}`
}

export function MinimalTemplate({ resume }: Props) {
  const { personalInfo: p } = resume

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#111',
    margin: '0 0 12px',
    borderLeft: '3px solid #111',
    paddingLeft: '8px',
  }

  const contactItems: string[] = [
    p.email,
    p.phone,
    p.location,
    p.website ? p.website.replace(/^https?:\/\//, '') : '',
    p.linkedin
      ? p.linkedin.replace(
          /^https?:\/\/(www\.)?linkedin\.com\/in\//,
          'linkedin: '
        )
      : '',
    p.github
      ? p.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github: ')
      : '',
  ].filter(Boolean)

  return (
    <div
      style={{
        width: '816px',
        minHeight: '1056px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '11px',
        color: '#1a1a1a',
        lineHeight: '1.6',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        padding: '60px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 12px',
            color: '#0a0a0a',
            letterSpacing: '-0.02em',
          }}
        >
          {p.fullName}
        </h1>
        {contactItems.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0',
              color: '#555',
              fontSize: '10.5px',
            }}
          >
            {contactItems.map((item, i) => (
              <span key={i}>
                {item}
                {i < contactItems.length - 1 && (
                  <span style={{ margin: '0 8px', color: '#bbb' }}>|</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {p.summary && (
        <section style={{ marginBottom: '32px' }}>
          <p style={{ color: '#333', lineHeight: '1.7', margin: 0 }}>
            {p.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={sectionHeaderStyle}>Experience</h2>
          {resume.experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '2px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '12px',
                      color: '#0a0a0a',
                    }}
                  >
                    {exp.jobTitle}
                  </span>
                  <span style={{ color: '#555' }}> at {exp.company}</span>
                  {exp.location && (
                    <span style={{ color: '#888' }}>, {exp.location}</span>
                  )}
                </div>
                <span
                  style={{
                    color: '#888',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px',
                  }}
                >
                  {formatDate(exp.startDate)} –{' '}
                  {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <div
                  style={{ marginTop: '6px', color: '#333', lineHeight: '1.7' }}
                >
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={sectionHeaderStyle}>Education</h2>
          {resume.education.map((edu) => (
            <div
              key={edu.id}
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#0a0a0a',
                  }}
                >
                  {edu.school}
                </span>
                <div style={{ color: '#555', marginTop: '1px' }}>
                  {edu.degree}
                  {edu.field ? ` in ${edu.field}` : ''}
                  {edu.gpa && (
                    <span style={{ color: '#888' }}> · GPA: {edu.gpa}</span>
                  )}
                </div>
              </div>
              <span
                style={{
                  color: '#888',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px',
                }}
              >
                {formatDate(edu.startDate)} –{' '}
                {edu.endDate ? formatDate(edu.endDate) : 'Present'}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={sectionHeaderStyle}>Skills</h2>
          <p style={{ color: '#333', margin: 0 }}>
            {resume.skills.map((s) => s.name).join('  ·  ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={sectionHeaderStyle}>Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#0a0a0a',
                  }}
                >
                  {proj.title}
                </span>
                {(proj.startDate ?? proj.endDate) && (
                  <span
                    style={{
                      color: '#888',
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      marginLeft: '12px',
                    }}
                  >
                    {proj.startDate ? formatDate(proj.startDate) : ''}
                    {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                  </span>
                )}
              </div>
              <div style={{ marginTop: '3px', color: '#333' }}>
                {proj.description}
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div
                  style={{ marginTop: '3px', color: '#888', fontSize: '10px' }}
                >
                  {proj.technologies.join('  ·  ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={sectionHeaderStyle}>Certifications</h2>
          {resume.certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontWeight: '600',
                    fontSize: '12px',
                    color: '#0a0a0a',
                  }}
                >
                  {cert.name}
                </span>
                <span style={{ color: '#555' }}> · {cert.issuer}</span>
              </div>
              <span
                style={{
                  color: '#888',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  marginLeft: '12px',
                }}
              >
                {formatDate(cert.issueDate)}
                {cert.expirationDate
                  ? ` – ${formatDate(cert.expirationDate)}`
                  : ''}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
