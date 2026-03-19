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

export function CreativeTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  const sidebarSectionHeaderStyle: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.7)',
    margin: '0 0 10px',
    borderBottom: '1px solid rgba(255,255,255,0.25)',
    paddingBottom: '6px',
  }

  const mainSectionHeaderStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    color: accentColor,
    margin: '0 0 10px',
    borderBottom: `2px solid ${accentColor}`,
    paddingBottom: '4px',
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
        display: 'flex',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
      }}
    >
      {/* Sidebar — 220px */}
      <div
        style={{
          width: '220px',
          flexShrink: 0,
          backgroundColor: accentColor,
          color: '#fff',
          padding: '32px 20px',
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: '800',
              margin: '0',
              color: '#fff',
              lineHeight: '1.2',
            }}
          >
            {p.fullName}
          </h1>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={sidebarSectionHeaderStyle}>Contact</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '7px',
              fontSize: '10px',
            }}
          >
            {p.email && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                  wordBreak: 'break-all',
                }}
              >
                <Mail size={11} style={{ flexShrink: 0, marginTop: '1px' }} />
                {p.email}
              </span>
            )}
            {p.phone && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <Phone size={11} />
                {p.phone}
              </span>
            )}
            {p.location && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <MapPin size={11} />
                {p.location}
              </span>
            )}
            {p.website && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                  wordBreak: 'break-all',
                }}
              >
                <Globe size={11} style={{ flexShrink: 0, marginTop: '1px' }} />
                {p.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.linkedin && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                  wordBreak: 'break-all',
                }}
              >
                <Linkedin
                  size={11}
                  style={{ flexShrink: 0, marginTop: '1px' }}
                />
                {p.linkedin.replace(
                  /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                  ''
                )}
              </span>
            )}
            {p.github && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.9)',
                  wordBreak: 'break-all',
                }}
              >
                <Github size={11} style={{ flexShrink: 0, marginTop: '1px' }} />
                {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={sidebarSectionHeaderStyle}>Skills</h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              {resume.skills.map((skill) => (
                <div key={skill.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px',
                    }}
                  >
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: '500',
                      }}
                    >
                      {skill.name}
                    </span>
                    {skill.level && (
                      <span
                        style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {skill.level}
                      </span>
                    )}
                  </div>
                  {skill.level && (
                    <div
                      style={{
                        height: '3px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          width:
                            skill.level === 'expert'
                              ? '100%'
                              : skill.level === 'advanced'
                                ? '75%'
                                : skill.level === 'intermediate'
                                  ? '50%'
                                  : '25%',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div>
            <h2 style={sidebarSectionHeaderStyle}>Certifications</h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {resume.certifications.map((cert) => (
                <div key={cert.id}>
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '9px',
                    }}
                  >
                    {cert.issuer}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '9px',
                    }}
                  >
                    {formatDate(cert.issueDate)}
                    {cert.expirationDate
                      ? ` – ${formatDate(cert.expirationDate)}`
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px 28px', backgroundColor: '#fff' }}>
        {/* Summary */}
        {p.summary && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={mainSectionHeaderStyle}>About</h2>
            <p style={{ color: '#334155', lineHeight: '1.65', margin: 0 }}>
              {p.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <h2 style={mainSectionHeaderStyle}>Experience</h2>
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
                        fontSize: '12px',
                        color: '#0f172a',
                      }}
                    >
                      {exp.jobTitle}
                    </span>
                    <span style={{ color: '#475569' }}> · {exp.company}</span>
                    {exp.location && (
                      <span style={{ color: '#94a3b8' }}>, {exp.location}</span>
                    )}
                  </div>
                  <span
                    style={{
                      color: '#64748b',
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
                      color: '#334155',
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
          <section style={{ marginBottom: '20px' }}>
            <h2 style={mainSectionHeaderStyle}>Education</h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
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
                      {edu.school}
                    </span>
                    <div style={{ color: '#475569' }}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ''}
                      {edu.gpa && (
                        <span style={{ color: '#64748b' }}>
                          {' '}
                          · GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      color: '#64748b',
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
          <section style={{ marginBottom: '20px' }}>
            <h2 style={mainSectionHeaderStyle}>Projects</h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '12px' }}>
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
                      }}
                    >
                      {proj.startDate ? formatDate(proj.startDate) : ''}
                      {proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '3px', color: '#334155' }}>
                  {proj.description}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div
                    style={{
                      marginTop: '4px',
                      color: accentColor,
                      fontSize: '9px',
                      fontWeight: '500',
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
