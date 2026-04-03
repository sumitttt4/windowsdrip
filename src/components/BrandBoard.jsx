import React, { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

const BRAND_COLORS = {
  primary: '#7b68ee',
  secondary: '#1a1a2e',
  accent: '#4ade80',
  dark: '#0A0A0A',
  white: '#FFFFFF',
  textMuted: '#9898b8',
}

function generateShades(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const shades = {}
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  steps.forEach((step) => {
    const factor = step / 1000
    const mix = (c, t) => Math.round(c + (t - c) * factor)
    if (step <= 500) {
      const f = step / 500
      shades[step] = `rgb(${mix(255, r)}, ${mix(255, g)}, ${mix(255, b)})`
      shades[step] = `rgb(${Math.round(255 - (255 - r) * f)}, ${Math.round(255 - (255 - g) * f)}, ${Math.round(255 - (255 - b) * f)})`
    } else {
      const f = (step - 500) / 500
      shades[step] = `rgb(${Math.round(r * (1 - f))}, ${Math.round(g * (1 - f))}, ${Math.round(b * (1 - f))})`
    }
  })
  return shades
}

export default function BrandBoard({ pack, onClose }) {
  const boardRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const brandName = pack.name.replace(/ Pack$/, '')
  const shades = generateShades(BRAND_COLORS.primary)

  const handleDownload = async () => {
    if (!boardRef.current) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(boardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        backgroundColor: BRAND_COLORS.dark,
      })
      const link = document.createElement('a')
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-board.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate brand board:', err)
    }
    setIsGenerating(false)
  }

  const boardStyle = {
    position: 'fixed',
    left: '-9999px',
    top: 0,
    width: '1080px',
    height: '1350px',
    background: BRAND_COLORS.dark,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    padding: '40px',
    fontFamily: "'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflow: 'hidden',
  }

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  }

  return (
    <>
      {/* Hidden render target */}
      <div ref={boardRef} style={boardStyle}>
        {/* ── Top Section (40% height ~540px minus padding) ── */}
        <div style={{ display: 'flex', gap: '24px', height: '460px' }}>
          {/* Left: Logo + Brand Name */}
          <div style={{
            ...cardStyle,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '24px',
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '28px',
              background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              boxShadow: `0 8px 32px ${BRAND_COLORS.primary}40`,
            }}>
              💧
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '42px',
                fontWeight: 700,
                color: '#1a1a2e',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {brandName}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#9898b8',
                marginTop: '8px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Sound Experience
              </div>
            </div>
            {/* Color dots row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {[BRAND_COLORS.primary, BRAND_COLORS.secondary, BRAND_COLORS.accent].map((c, i) => (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: c,
                  border: '2px solid #f0f0f0',
                }} />
              ))}
            </div>
          </div>

          {/* Right: Brand Poster Mockup */}
          <div style={{
            ...cardStyle,
            flex: 1,
            background: BRAND_COLORS.primary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              fontSize: '140px',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))',
            }}>
              💧
            </div>
            <div style={{
              fontSize: '52px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 16px rgba(0,0,0,0.2)',
              marginTop: '8px',
            }}>
              {brandName}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '24px',
              right: '28px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
            }}>
              {pack.author || 'WindowsDrip'}
            </div>
          </div>
        </div>

        {/* ── Middle Section (35% height ~445px minus padding) ── */}
        <div style={{ display: 'flex', gap: '24px', height: '370px' }}>
          {/* Typography Card */}
          <div style={{
            ...cardStyle,
            flex: 1,
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              fontSize: '100px',
              fontWeight: 700,
              color: BRAND_COLORS.secondary,
              lineHeight: 1,
              marginBottom: '24px',
            }}>
              Aa
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9898b8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              fontWeight: 600,
            }}>
              Typeface
            </div>
            <div style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#1a1a2e',
              marginBottom: '12px',
            }}>
              Segoe UI Variable
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              {['Regular', 'Medium', 'Bold'].map((w, i) => (
                <div key={w} style={{
                  fontSize: '14px',
                  color: '#6868a0',
                  fontWeight: i === 0 ? 400 : i === 1 ? 500 : 700,
                }}>
                  {w}
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '16px',
              fontSize: '11px',
              color: '#b0b0c8',
              letterSpacing: '0.15em',
            }}>
              ABCDEFGHIJKLMNOPQRST
            </div>
            <div style={{
              fontSize: '11px',
              color: '#b0b0c8',
              letterSpacing: '0.15em',
              marginTop: '4px',
            }}>
              abcdefghijklmnopqrst
            </div>
            <div style={{
              fontSize: '11px',
              color: '#b0b0c8',
              letterSpacing: '0.15em',
              marginTop: '4px',
            }}>
              0123456789
            </div>
          </div>

          {/* Color Palette Card */}
          <div style={{
            ...cardStyle,
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}>
            {[
              { color: BRAND_COLORS.primary, label: 'Primary', hex: '#7B68EE' },
              { color: BRAND_COLORS.secondary, label: 'Secondary', hex: '#1A1A2E' },
              { color: BRAND_COLORS.accent, label: 'Accent', hex: '#4ADE80' },
            ].map((c) => (
              <div key={c.label} style={{
                flex: 1,
                background: c.color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px 16px',
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: c.label === 'Accent' ? '#0a3d1c' : '#FFFFFF',
                  opacity: 0.9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {c.label}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: c.label === 'Accent' ? '#0a3d1c' : '#FFFFFF',
                  opacity: 0.7,
                  marginTop: '4px',
                }}>
                  {c.hex}
                </div>
              </div>
            ))}
          </div>

          {/* Product Mockup — Cup Silhouette */}
          <div style={{
            ...cardStyle,
            width: '260px',
            flexShrink: 0,
            background: '#f5f5f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Coffee Cup CSS shape */}
            <div style={{ position: 'relative' }}>
              {/* Cup body */}
              <div style={{
                width: '120px',
                height: '140px',
                background: BRAND_COLORS.primary,
                borderRadius: '8px 8px 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(123,104,238,0.25)',
              }}>
                {/* Cup handle */}
                <div style={{
                  position: 'absolute',
                  right: '-28px',
                  top: '25px',
                  width: '28px',
                  height: '60px',
                  border: `4px solid ${BRAND_COLORS.primary}`,
                  borderLeft: 'none',
                  borderRadius: '0 16px 16px 0',
                }} />
                {/* Logo on cup */}
                <div style={{ fontSize: '40px' }}>💧</div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  marginTop: '4px',
                  letterSpacing: '-0.02em',
                }}>
                  {brandName}
                </div>
              </div>
              {/* Cup base/saucer */}
              <div style={{
                width: '140px',
                height: '12px',
                background: '#d0d0d8',
                borderRadius: '0 0 6px 6px',
                margin: '0 auto',
                marginLeft: '-10px',
              }} />
            </div>
          </div>
        </div>

        {/* ── Bottom Section (25% height ~320px minus padding) ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Shade Scale Strip */}
          <div style={{
            ...cardStyle,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              padding: '16px 24px 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#9898b8',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Primary Color Scale
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
              {Object.entries(shades).map(([step, color]) => (
                <div key={step} style={{
                  flex: 1,
                  background: color,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '8px 4px',
                  alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: parseInt(step) >= 500 ? '#FFFFFF' : '#1a1a2e',
                    opacity: 0.8,
                  }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watermark */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '4px',
          }}>
            <span style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.25)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              built in glyph.software
            </span>
          </div>
        </div>
      </div>

      {/* Modal overlay for the download action */}
      <div className="brand-board-overlay" onClick={onClose}>
        <div className="brand-board-modal" onClick={(e) => e.stopPropagation()}>
          <div className="brand-board-modal__header">
            <h2>Download Brand Board</h2>
            <button className="brand-board-modal__close" onClick={onClose}>✕</button>
          </div>
          <div className="brand-board-modal__preview">
            <div className="brand-board-modal__preview-label">Preview</div>
            <div className="brand-board-modal__preview-img">
              {/* Mini preview representation */}
              <div style={{
                width: '100%',
                height: '100%',
                background: BRAND_COLORS.dark,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '12px 12px',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', gap: '8px', flex: '4' }}>
                  <div style={{ flex: 1, background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💧</div>
                  <div style={{ flex: 1, background: BRAND_COLORS.primary, borderRadius: '6px' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', flex: '3.5' }}>
                  <div style={{ flex: 1, background: '#fff', borderRadius: '6px' }} />
                  <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: '6px' }}>
                    <div style={{ flex: 1, background: BRAND_COLORS.primary }} />
                    <div style={{ flex: 1, background: BRAND_COLORS.secondary }} />
                    <div style={{ flex: 1, background: BRAND_COLORS.accent }} />
                  </div>
                  <div style={{ flex: 0.8, background: '#f5f5f7', borderRadius: '6px' }} />
                </div>
                <div style={{ flex: '2.5', background: '#fff', borderRadius: '6px' }} />
              </div>
            </div>
          </div>
          <div className="brand-board-modal__info">
            <div className="brand-board-modal__spec">1080 × 1350px</div>
            <div className="brand-board-modal__spec">PNG • Instagram Portrait</div>
          </div>
          <button
            className="brand-board-modal__download"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Download PNG'}
          </button>
        </div>
      </div>
    </>
  )
}
