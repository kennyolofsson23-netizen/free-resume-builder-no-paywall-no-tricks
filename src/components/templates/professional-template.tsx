'use client'

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'
import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

export function ProfessionalTemplate({ resume }: Props) {
  const { personalInfo: p } = resume

  return (
    <div
      className="bg-white"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '11px',
        color: '#111',
        lineHeight: '1.5',
        display: 'flex',
        minHeight: '100%',
      }}
    >
      {/* Dark sidebar */}
      <div
        style={{
          width: '35%',
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: '36px 24px',
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: '800',
              margin: '0 0 4px',
              color: '#fff',
              lineHeight: '1.25',
              letterSpacing: '-0.01em',
            }}
          >
            {p.fullName}
          </h1>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              fontSize: '8px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#94a3b8',
              margin: '0 0 10px',
              paddingBottom: '6px',
              borderBottom: '1px solid #334155',
            }}
          >
            Contact
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '10px',
            }}
          >
            {p.email && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '7px',
                  color: '#cbd5e1',
                  wordBreak: 'break-all',
                }}
              >
                <Mail
                  size={11}
                  style={{ flexShrink: 0, marginTop: '1px', color: '#94a3b8' }}
                />
                {p.email}
              </span>
            )}
            {p.phone && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  color: '#cbd5e1',
                }}
              >
                <Phone size={11} style={{ color: '#94a3b8' }} />
                {p.phone}
              </span>
            )}
            {p.location && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  color: '#cbd5e1',
                }}
              >
                <MapPin size={11} style={{ color: '#94a3b8' }} />
                {p.location}
              </span>
            )}
            {p.website && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '7px',
                  color: '#cbd5e1',
                  wordBreak: 'break-all',
                }}
              >
                <Globe
                  size={11}
                  style={{ flexShrink: 0, marginTop: '1px', color: '#94a3b8' }}
                />
                {p.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {p.linkedin && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '7px',
                  color: '#cbd5e1',
                  wordBreak: 'break-all',
                }}
              >
                <Linkedin
                  size={11}
                  style={{ flexShrink: 0, marginTop: '1px', color: '#94a3b8' }}
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
                  gap: '7px',
                  color: '#cbd5e1',
                  wordBreak: 'break-all',
                }}
              >
                <Github
                  size={11}
                  style={{ flexShrink: 0, marginTop: '1px', color: '#94a3b8' }}
                />
                {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2
              style={{
                fontSize: '8px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#94a3b8',
                margin: '0 0 10px',
                paddingBottom: '6px',
                borderBottom: '1px solid #334155',
              }}
            >
              Skills
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
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
                  <span style={{ color: '#e2e8f0', fontSize: '10px' }}>
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
          </div>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: '8px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#94a3b8',
                margin: '0 0 10px',
                paddingBottom: '6px',
                borderBottom: '1px solid #334155',
              }}
            >
              Certifications
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {resume.certifications.map((cert) => (
                <div key={cert.id}>
                  <div
                    style={{
                      color: '#e2e8f0',
                      fontSize: '10px',
                      fontWeight: '600',
                      lineHeight: '1.3',
                    }}
                  >
                    {cert.name}
                  </div>
                  <div
                    style={{
                      color: '#94a3b8',
                      fontSize: '9px',
                      marginTop: '2px',
                    }}
                  >
                    {cert.issuer}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '9px' }}>
                    {cert.issueDate}
                    {cert.expirationDate ? ` – ${cert.expirationDate}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '36px 28px', backgroundColor: '#fff' }}>
        {p.summary && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 6px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '2px solid #1e293b',
                paddingBottom: '4px',
              }}
            >
              Profile
            </h2>
            <p style={{ color: '#374151', lineHeight: '1.65' }}>{p.summary}</p>
          </section>
        )}

        {resume.experiences.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '2px solid #1e293b',
                paddingBottom: '4px',
              }}
            >
              Experience
            </h2>
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
                      <span style={{ color: '#94a3b8' }}>, {exp.location}</span>
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
                    {exp.startDate} –{' '}
                    {exp.currentlyWorking ? 'Present' : exp.endDate}
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

        {resume.education.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '2px solid #1e293b',
                paddingBottom: '4px',
              }}
            >
              Education
            </h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
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
                      {edu.school}
                    </span>
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
                    {edu.startDate} – {edu.endDate ?? ''}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {resume.projects.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '2px solid #1e293b',
                paddingBottom: '4px',
              }}
            >
              Projects
            </h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      fontWeight: '700',
                      fontSize: '12px',
                      color: '#0f172a',
                    }}
                  >
                    {proj.title}
                  </span>
                  {proj.startDate && (
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px',
                        fontStyle: 'italic',
                      }}
                    >
                      {proj.startDate}
                      {proj.endDate ? ` – ${proj.endDate}` : ''}
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
    </div>
  )
}
