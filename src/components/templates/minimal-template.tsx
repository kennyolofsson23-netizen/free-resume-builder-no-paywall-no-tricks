'use client'

import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

export function MinimalTemplate({ resume }: Props) {
  const { personalInfo: p } = resume

  return (
    <div
      id="resume-preview"
      className="resume-preview w-[816px] min-h-[1056px] bg-white"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '11px', color: '#1a1a1a', lineHeight: '1.6', padding: '56px 52px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 10px', color: '#0a0a0a', letterSpacing: '-0.02em' }}>
          {p.fullName}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', color: '#555', fontSize: '10.5px' }}>
          {[
            p.email,
            p.phone,
            p.location,
            p.website ? p.website.replace(/^https?:\/\//, '') : null,
            p.linkedin ? p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'linkedin: ') : null,
            p.github ? p.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'github: ') : null,
          ]
            .filter(Boolean)
            .map((item, i, arr) => (
              <span key={i}>
                {item}
                {i < arr.length - 1 && <span style={{ margin: '0 8px', color: '#bbb' }}>·</span>}
              </span>
            ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', marginBottom: '24px' }} />

      {/* Summary */}
      {p.summary && (
        <section style={{ marginBottom: '24px' }}>
          <p style={{ color: '#333', lineHeight: '1.7', margin: 0 }}>{p.summary}</p>
        </section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 12px' }}>
            Experience
          </h2>
          {resume.experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '12px', color: '#0a0a0a' }}>{exp.jobTitle}</span>
                  <span style={{ color: '#555' }}>{' '}at {exp.company}</span>
                  {exp.location && <span style={{ color: '#888' }}>, {exp.location}</span>}
                </div>
                <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.description && (
                <div style={{ marginTop: '6px', color: '#333', lineHeight: '1.7' }}>
                  {exp.description.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '24px' }} />}

      {/* Education */}
      {resume.education.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 12px' }}>
            Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: '600', fontSize: '12px', color: '#0a0a0a' }}>{edu.school}</span>
                <div style={{ color: '#555', marginTop: '1px' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.gpa && <span style={{ color: '#888' }}> · GPA: {edu.gpa}</span>}
                </div>
              </div>
              <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                {edu.startDate} – {edu.endDate ?? ''}
              </span>
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '24px' }} />}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 10px' }}>
            Skills
          </h2>
          <p style={{ color: '#333', margin: 0 }}>
            {resume.skills.map((s) => s.name).join('  ·  ')}
          </p>
        </section>
      )}

      {resume.projects.length > 0 && <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '24px' }} />}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 12px' }}>
            Projects
          </h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: '600', fontSize: '12px', color: '#0a0a0a' }}>{proj.title}</span>
                {proj.startDate && (
                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              <div style={{ marginTop: '3px', color: '#333' }}>{proj.description}</div>
              {proj.technologies && proj.technologies.length > 0 && (
                <div style={{ marginTop: '3px', color: '#888', fontSize: '10px' }}>
                  {proj.technologies.join('  ·  ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <>
          <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '24px' }} />
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '0 0 12px' }}>
              Certifications
            </h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: '600', fontSize: '12px', color: '#0a0a0a' }}>{cert.name}</span>
                  <span style={{ color: '#555' }}> · {cert.issuer}</span>
                </div>
                <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {cert.issueDate}
                </span>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
