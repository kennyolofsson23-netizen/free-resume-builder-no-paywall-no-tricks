'use client'

import { Phone, MapPin, Mail, Globe, Linkedin, Github } from 'lucide-react'
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

export function CreativeTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  return (
    <div
      id="resume-preview"
      className="resume-preview w-[816px] min-h-[1056px] bg-white"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#1a1a2e', lineHeight: '1.5' }}
    >
      {/* Full-width accent header band */}
      <div style={{ backgroundColor: accentColor, padding: '32px 40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
          {p.fullName}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'rgba(255,255,255,0.9)', fontSize: '10.5px' }}>
          {p.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={11} />
              {p.phone}
            </span>
          )}
          {p.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={11} />
              {p.location}
            </span>
          )}
          {p.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={11} />
              {p.email}
            </span>
          )}
          {p.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={11} />
              {p.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {p.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Linkedin size={11} />
              {p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {p.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Github size={11} />
              {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '28px 40px 36px' }}>
        {/* Summary */}
        {p.summary && (
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Summary
              </h2>
            </div>
            <p style={{ color: '#374151', lineHeight: '1.7', margin: 0, paddingLeft: '14px' }}>{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Experience
              </h2>
            </div>
            {resume.experiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '14px', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{exp.jobTitle}</span>
                    <span style={{ color: accentColor, fontWeight: '500' }}> @ {exp.company}</span>
                    {exp.location && <span style={{ color: '#94a3b8' }}>, {exp.location}</span>}
                  </div>
                  <span style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDate(exp.startDate)} – {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate ?? '')}
                  </span>
                </div>
                {exp.description && (
                  <div style={{ marginTop: '5px', color: '#374151', lineHeight: '1.65' }}>
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
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Education
              </h2>
            </div>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px', paddingLeft: '14px', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{edu.school}</span>
                    <div style={{ color: '#475569' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      {edu.gpa && <span style={{ color: '#94a3b8' }}> · GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Skills
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '14px' }}>
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    backgroundColor: accentColor + '15',
                    color: accentColor,
                    border: `1px solid ${accentColor}35`,
                    borderRadius: '4px',
                    padding: '3px 10px',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  {skill.name}
                  {skill.level && <span style={{ fontWeight: '400', opacity: 0.75, marginLeft: '4px' }}>· {skill.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Projects
              </h2>
            </div>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px', paddingLeft: '14px', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{proj.title}</span>
                    {proj.link && (
                      <span style={{ color: accentColor, marginLeft: '6px', fontSize: '10px' }}>
                        {proj.link.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {proj.startDate && (
                    <span style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {formatDate(proj.startDate)}{proj.endDate ? ` – ${formatDate(proj.endDate)}` : ''}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '4px', color: '#374151' }}>{proj.description}</div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div style={{ marginTop: '4px', color: '#64748b', fontSize: '10px' }}>
                    {proj.technologies.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Certifications
              </h2>
            </div>
            {resume.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '10px', paddingLeft: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: '700', fontSize: '12px', color: '#0f172a' }}>{cert.name}</span>
                  <span style={{ color: '#475569' }}> — {cert.issuer}</span>
                </div>
                <span style={{ color: '#64748b', fontSize: '10px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDate(cert.issueDate)}
                </span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
