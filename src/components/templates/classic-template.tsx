'use client'

import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthName = months[parseInt(month ?? '1') - 1] ?? ''
  return `${monthName} ${year}`
}

export function ClassicTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: accentColor,
    margin: '0 0 4px',
  }

  const sectionHrStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid #cbd5e1',
    margin: '0 0 10px',
  }

  const contactParts: string[] = []
  if (p.email) contactParts.push(p.email)
  if (p.phone) contactParts.push(p.phone)
  if (p.location) contactParts.push(p.location)
  if (p.website) contactParts.push(p.website.replace(/^https?:\/\//, ''))
  if (p.linkedin) contactParts.push(p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/'))
  if (p.github) contactParts.push(p.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/'))

  return (
    <div
      style={{
        width: '816px',
        minHeight: '1056px',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '11px',
        color: '#1f2937',
        lineHeight: '1.55',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        padding: '36px 48px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '0.02em',
            color: '#111827',
          }}
        >
          {p.fullName}
        </h1>
        {contactParts.length > 0 && (
          <div style={{ fontSize: '10px', color: '#6b7280' }}>
            {contactParts.join(' · ')}
          </div>
        )}
        <hr
          style={{
            border: 'none',
            borderTop: '1.5px solid #374151',
            margin: '12px 0 0',
          }}
        />
      </div>

      {/* Summary */}
      {p.summary && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Summary</h2>
          <hr style={sectionHrStyle} />
          <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>{p.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Experience</h2>
          <hr style={sectionHrStyle} />
          {resume.experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
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
                  <span style={{ fontStyle: 'italic', color: '#374151' }}>, {exp.company}</span>
                  {exp.location && (
                    <span style={{ color: '#6b7280' }}>, {exp.location}</span>
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
                  {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <div
                  style={{
                    marginTop: '5px',
                    color: '#374151',
                    lineHeight: '1.6',
                  }}
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
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Education</h2>
          <hr style={sectionHrStyle} />
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
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
                  <div style={{ fontStyle: 'italic', color: '#374151' }}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                    {edu.gpa && (
                      <span style={{ fontStyle: 'normal', color: '#6b7280' }}>
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
                  {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Skills</h2>
          <hr style={sectionHrStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 24px' }}>
            {resume.skills.map((skill) => (
              <div key={skill.id} style={{ color: '#374151' }}>
                {skill.name}
                {skill.level && (
                  <span style={{ color: '#9ca3af', fontSize: '10px' }}> ({skill.level})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Projects</h2>
          <hr style={sectionHrStyle} />
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <strong style={{ fontSize: '12px', color: '#111827' }}>
                  {proj.title}
                </strong>
                {(proj.startDate ?? proj.endDate) && (
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {proj.startDate ? formatDate(proj.startDate) : ''}
                    {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                  </span>
                )}
              </div>
              <div style={{ marginTop: '3px', color: '#374151' }}>
                {proj.description}
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div
                  style={{
                    marginTop: '3px',
                    color: '#6b7280',
                    fontStyle: 'italic',
                    fontSize: '10px',
                  }}
                >
                  {proj.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={sectionHeaderStyle}>Certifications</h2>
          <hr style={sectionHrStyle} />
          {resume.certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong style={{ fontSize: '12px', color: '#111827' }}>
                  {cert.name}
                </strong>
                <span style={{ fontStyle: 'italic', color: '#374151' }}>, {cert.issuer}</span>
              </div>
              <span
                style={{
                  color: '#6b7280',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px',
                }}
              >
                {formatDate(cert.issueDate)}
                {cert.expirationDate ? ` – ${formatDate(cert.expirationDate)}` : ''}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
