'use client'

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'
import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
}

export function ModernTemplate({ resume }: Props) {
  const { personalInfo: p, accentColor } = resume

  return (
    <div
      id="resume-preview"
      className="resume-preview w-[816px] min-h-[1056px] bg-white"
      style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#111', lineHeight: '1.5' }}
    >
      {/* Header */}
      <div style={{ padding: '32px 40px 20px', borderBottom: `3px solid ${accentColor}` }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px', color: '#0f172a' }}>
          {p.fullName}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#475569' }}>
          {p.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={12} />
              {p.email}
            </span>
          )}
          {p.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={12} />
              {p.phone}
            </span>
          )}
          {p.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} />
              {p.location}
            </span>
          )}
          {p.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} />
              {p.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {p.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Linkedin size={12} />
              {p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {p.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Github size={12} />
              {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '0 40px 32px' }}>
        {/* Summary */}
        {p.summary && (
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Summary
            </h2>
            <p style={{ color: '#334155', lineHeight: '1.6' }}>{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {resume.experiences.length > 0 && (
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Experience
            </h2>
            {resume.experiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '12px', color: '#0f172a' }}>{exp.jobTitle}</span>
                    <span style={{ color: '#475569' }}> — {exp.company}</span>
                    {exp.location && <span style={{ color: '#94a3b8' }}>, {exp.location}</span>}
                  </div>
                  <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div style={{ marginTop: '6px', color: '#334155', lineHeight: '1.6' }}>
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
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Education
            </h2>
            {resume.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '12px', color: '#0f172a' }}>{edu.school}</span>
                    <div style={{ color: '#475569' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      {edu.gpa && <span style={{ color: '#64748b' }}> · GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                  <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {edu.startDate} – {edu.endDate ?? ''}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skills
            </h2>
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
                  {skill.level && <span style={{ opacity: 0.7, marginLeft: '4px' }}>· {skill.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Projects
            </h2>
            {resume.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '12px', color: '#0f172a' }}>{proj.title}</span>
                    {proj.link && (
                      <span style={{ color: accentColor, marginLeft: '6px', fontSize: '10px' }}>
                        {proj.link.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '4px', color: '#334155' }}>{proj.description}</div>
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
          <section style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: accentColor, borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certifications
            </h2>
            {resume.certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '12px', color: '#0f172a' }}>{cert.name}</span>
                    <span style={{ color: '#475569' }}> — {cert.issuer}</span>
                  </div>
                  <span style={{ color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {cert.issueDate}{cert.expirationDate ? ` – ${cert.expirationDate}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
