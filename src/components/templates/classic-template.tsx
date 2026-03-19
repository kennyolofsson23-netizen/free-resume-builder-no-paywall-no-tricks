'use client'

import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

export function ClassicTemplate({ resume }: Props) {
  const { personalInfo: p } = resume

  return (
    <div
      id="resume-preview"
      className="resume-preview w-[816px] min-h-[1056px] bg-white"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '11px', color: '#111', lineHeight: '1.5', padding: '48px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 8px', letterSpacing: '0.02em', color: '#0f172a' }}>
          {p.fullName}
        </h1>
        <div style={{ fontSize: '10px', color: '#475569', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>|</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>|</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span>|</span>}
          {p.website && <span>{p.website.replace(/^https?:\/\//, '')}</span>}
          {p.linkedin && <span>|</span>}
          {p.linkedin && <span>{p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>}
          {p.github && <span>|</span>}
          {p.github && <span>{p.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/')}</span>}
        </div>
        <hr style={{ border: 'none', borderTop: '1.5px solid #0f172a', margin: '12px 0 0' }} />
      </div>

      {/* Summary */}
      {p.summary && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Summary
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 8px' }} />
          <p style={{ color: '#334155' }}>{p.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Experience
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 10px' }} />
          {resume.experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>{exp.jobTitle}</strong>
                  <span style={{ color: '#374151' }}>, {exp.company}</span>
                  {exp.location && <span style={{ color: '#6b7280' }}>, {exp.location}</span>}
                </div>
                <span style={{ color: '#6b7280', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <div style={{ marginTop: '5px', color: '#374151', lineHeight: '1.6', paddingLeft: '0' }}>
                  {exp.description.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
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
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Education
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 10px' }} />
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>{edu.school}</strong>
                  <div style={{ color: '#374151' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    {edu.gpa && <span style={{ color: '#6b7280' }}> · GPA: {edu.gpa}</span>}
                  </div>
                </div>
                <span style={{ color: '#6b7280', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {edu.startDate} – {edu.endDate ?? ''}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Skills
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 8px' }} />
          <p style={{ color: '#374151' }}>
            {resume.skills.map((s) => s.name).join(', ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Projects
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 10px' }} />
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{proj.title}</strong>
                {proj.startDate && (
                  <span style={{ color: '#6b7280', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              <div style={{ marginTop: '3px', color: '#374151' }}>{proj.description}</div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div style={{ marginTop: '3px', color: '#6b7280', fontStyle: 'italic', fontSize: '10px' }}>
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
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0f172a', margin: '0 0 4px' }}>
            Certifications
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '0 0 10px' }} />
          {resume.certifications.map((cert) => (
            <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{cert.name}</strong>
                <span style={{ color: '#374151' }}>, {cert.issuer}</span>
              </div>
              <span style={{ color: '#6b7280', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {cert.issueDate}{cert.expirationDate ? ` – ${cert.expirationDate}` : ''}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
