'use client'

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'
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

export function ModernTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    color: accentColor,
    borderBottom: `2px solid ${accentColor}`,
    paddingBottom: '4px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 10px 0',
  }

  return (
    <div
      style={{
        width: '816px',
        minHeight: '1056px',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '12px',
        color: '#111827',
        lineHeight: '1.5',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          backgroundColor: accentColor,
          padding: '28px 40px 24px',
          color: '#fff',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 10px',
            color: '#fff',
          }}
        >
          {p.fullName}
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {p.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={11} />
              {p.phone}
            </span>
          )}
          {p.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={11} />
              {p.email}
            </span>
          )}
          {p.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} />
              {p.location}
            </span>
          )}
          {p.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={11} />
              {p.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {p.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Linkedin size={11} />
              {p.linkedin.replace(
                /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                ''
              )}
            </span>
          )}
          {p.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Github size={11} />
              {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0 40px 40px' }}>
        {/* Summary */}
        {p.summary && (
          <section style={{ marginTop: '22px', marginBottom: '0' }}>
            <h2 style={sectionHeaderStyle}>Summary</h2>
            <p style={{ color: '#374151', lineHeight: '1.65', margin: 0 }}>
              {p.summary}
            </p>
          </section>
        )}

        {/* Two-column body */}
        <div style={{ display: 'flex', gap: '28px', marginTop: '20px' }}>
          {/* Left column — 65% */}
          <div style={{ flex: '0 0 auto', width: 'calc(65% - 14px)' }}>
            {/* Experience */}
            {resume.experiences.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2 style={sectionHeaderStyle}>Experience</h2>
                {resume.experiences.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '14px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: '700',
                            fontSize: '13px',
                            color: '#111827',
                          }}
                        >
                          {exp.jobTitle}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          {' '}
                          — {exp.company}
                        </span>
                        {exp.location && (
                          <span style={{ color: '#9ca3af' }}>
                            , {exp.location}
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          color: '#6b7280',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px',
                          fontSize: '11px',
                        }}
                      >
                        {formatDate(exp.startDate)} –{' '}
                        {exp.currentlyWorking
                          ? 'Present'
                          : formatDate(exp.endDate)}
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

            {/* Projects */}
            {resume.projects.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2 style={sectionHeaderStyle}>Projects</h2>
                {resume.projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: '700',
                            fontSize: '13px',
                            color: '#111827',
                          }}
                        >
                          {proj.title}
                        </span>
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
                      {(proj.startDate ?? proj.endDate) && (
                        <span
                          style={{
                            color: '#6b7280',
                            whiteSpace: 'nowrap',
                            marginLeft: '8px',
                            fontSize: '11px',
                          }}
                        >
                          {proj.startDate ? formatDate(proj.startDate) : ''}
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
                          color: '#6b7280',
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

            {/* Certifications */}
            {resume.certifications.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2 style={sectionHeaderStyle}>Certifications</h2>
                {resume.certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: '600',
                            fontSize: '12px',
                            color: '#111827',
                          }}
                        >
                          {cert.name}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          {' '}
                          — {cert.issuer}
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#6b7280',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px',
                          fontSize: '11px',
                        }}
                      >
                        {formatDate(cert.issueDate)}
                        {cert.expirationDate
                          ? ` – ${formatDate(cert.expirationDate)}`
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right column — 35% */}
          <div style={{ flex: '0 0 auto', width: 'calc(35% - 14px)' }}>
            {/* Education */}
            {resume.education.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2 style={sectionHeaderStyle}>Education</h2>
                {resume.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '12px',
                        color: '#111827',
                      }}
                    >
                      {edu.school}
                    </div>
                    <div style={{ color: '#374151' }}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </div>
                    {edu.gpa && (
                      <div style={{ color: '#6b7280', fontSize: '11px' }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                    <div style={{ color: '#6b7280', fontSize: '11px' }}>
                      {formatDate(edu.startDate)} –{' '}
                      {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2 style={sectionHeaderStyle}>Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {resume.skills.map((skill) => (
                    <span
                      key={skill.id}
                      style={{
                        backgroundColor: accentColor + '18',
                        color: accentColor,
                        border: `1px solid ${accentColor}40`,
                        borderRadius: '9999px',
                        padding: '2px 10px',
                        fontSize: '10px',
                        fontWeight: '500',
                      }}
                    >
                      {skill.name}
                      {skill.level && (
                        <span style={{ opacity: 0.7, marginLeft: '4px' }}>
                          · {skill.level}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
