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

export function ProfessionalTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  const mainSectionHeaderStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    color: accentColor,
    margin: '0 0 10px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: `2px solid ${accentColor}`,
    paddingBottom: '4px',
  }

  const sidebarSectionHeaderStyle: React.CSSProperties = {
    fontSize: '8px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#94a3b8',
    margin: '0 0 10px',
    paddingBottom: '6px',
    borderBottom: '1px solid #334155',
  }

  return (
    <div
      style={{
        width: '816px',
        minHeight: '1056px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '11px',
        color: '#111',
        lineHeight: '1.5',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
      }}
    >
      {/* Full-width accent header */}
      <div
        style={{
          backgroundColor: accentColor,
          padding: '28px 36px 24px',
          color: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '800',
            margin: '0 0 8px',
            color: '#fff',
            letterSpacing: '-0.01em',
          }}
        >
          {p.fullName}
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {p.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={10} />
              {p.email}
            </span>
          )}
          {p.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={10} />
              {p.phone}
            </span>
          )}
          {p.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={10} />
              {p.location}
            </span>
          )}
          {p.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={10} />
              {p.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {p.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Linkedin size={10} />
              {p.linkedin.replace(
                /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                ''
              )}
            </span>
          )}
          {p.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Github size={10} />
              {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex' }}>
        {/* Left main — 60% */}
        <div style={{ flex: '0 0 60%', padding: '28px 28px 28px 36px' }}>
          {/* Experience */}
          {resume.experiences.length > 0 && (
            <section style={{ marginBottom: '22px' }}>
              <h2 style={mainSectionHeaderStyle}>Experience</h2>
              {resume.experiences.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
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
                          fontSize: '12px',
                          color: '#0f172a',
                        }}
                      >
                        {exp.jobTitle}
                      </span>
                      <span style={{ color: '#475569' }}> — {exp.company}</span>
                      {exp.location && (
                        <span style={{ color: '#94a3b8' }}>
                          , {exp.location}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px',
                        fontStyle: 'italic',
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
                        marginTop: '6px',
                        color: '#374151',
                        lineHeight: '1.65',
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
            <section style={{ marginBottom: '22px' }}>
              <h2 style={mainSectionHeaderStyle}>Projects</h2>
              {resume.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '14px' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>
                      <span
                        style={{
                          fontWeight: '700',
                          fontSize: '12px',
                          color: '#0f172a',
                        }}
                      >
                        {proj.title}
                      </span>
                      {proj.link && (
                        <span
                          style={{
                            color: accentColor,
                            fontSize: '10px',
                            marginLeft: '6px',
                          }}
                        >
                          {proj.link.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                    </div>
                    {(proj.startDate ?? proj.endDate) && (
                      <span
                        style={{
                          color: '#64748b',
                          fontSize: '10px',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px',
                          fontStyle: 'italic',
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
                        color: '#64748b',
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

        {/* Right sidebar — 40% */}
        <div
          style={{
            flex: '0 0 40%',
            backgroundColor: '#f8fafc',
            padding: '28px 28px 28px 20px',
            borderLeft: '1px solid #e2e8f0',
          }}
        >
          {/* Summary */}
          {p.summary && (
            <section style={{ marginBottom: '22px' }}>
              <h2 style={sidebarSectionHeaderStyle}>Profile</h2>
              <p style={{ color: '#374151', lineHeight: '1.65', margin: 0 }}>
                {p.summary}
              </p>
            </section>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <section style={{ marginBottom: '22px' }}>
              <h2 style={sidebarSectionHeaderStyle}>Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      fontWeight: '700',
                      fontSize: '11px',
                      color: '#0f172a',
                    }}
                  >
                    {edu.school}
                  </div>
                  <div style={{ color: '#475569', marginTop: '1px' }}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                    {edu.gpa && (
                      <span style={{ color: '#64748b' }}>
                        {' '}
                        · GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '10px',
                      fontStyle: 'italic',
                    }}
                  >
                    {formatDate(edu.startDate)} –{' '}
                    {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <section style={{ marginBottom: '22px' }}>
              <h2 style={sidebarSectionHeaderStyle}>Skills</h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {resume.skills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#1e293b', fontSize: '10px' }}>
                      {skill.name}
                    </span>
                    {skill.level && (
                      <span
                        style={{
                          fontSize: '9px',
                          color: '#64748b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <section style={{ marginBottom: '22px' }}>
              <h2 style={sidebarSectionHeaderStyle}>Certifications</h2>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {resume.certifications.map((cert) => (
                  <div key={cert.id}>
                    <div
                      style={{
                        color: '#0f172a',
                        fontSize: '10px',
                        fontWeight: '600',
                        lineHeight: '1.3',
                      }}
                    >
                      {cert.name}
                    </div>
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '9px',
                        marginTop: '2px',
                      }}
                    >
                      {cert.issuer}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '9px' }}>
                      {formatDate(cert.issueDate)}
                      {cert.expirationDate
                        ? ` – ${formatDate(cert.expirationDate)}`
                        : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
