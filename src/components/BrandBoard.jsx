import React, { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

const BRAND = {
  primary: '#7b68ee',
  primaryGlow: 'rgba(123,104,238,0.4)',
  secondary: '#1a1a2e',
  accent: '#4ade80',
  dark: '#0A0A0A',
  cardDark: '#111118',
  cardBorder: 'rgba(123,104,238,0.15)',
  white: '#FFFFFF',
  muted: '#6868a0',
  textLight: '#e8e8f0',
}

// Reusable logo mark rendered as pure CSS
function LogoMark({ size = 64, color = BRAND.white }) {
  const s = size
  return (
    <div style={{
      width: s, height: s, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Drop shape */}
      <div style={{
        width: s * 0.7, height: s * 0.85,
        background: color,
        borderRadius: `${s * 0.35}px ${s * 0.35}px ${s * 0.35}px ${s * 0.1}px`,
        transform: 'rotate(-15deg)',
        position: 'relative',
      }}>
        {/* Inner wave line */}
        <div style={{
          position: 'absolute', bottom: s * 0.2, left: '50%', transform: 'translateX(-50%)',
          width: s * 0.3, height: s * 0.06,
          background: color === BRAND.white ? BRAND.primary : BRAND.secondary,
          borderRadius: s * 0.03,
        }} />
      </div>
    </div>
  )
}

export default function BrandBoard({ pack, onClose }) {
  const boardRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const brandName = pack.name.replace(/ Pack$/, '')

  const handleDownload = async () => {
    if (!boardRef.current) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(boardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        backgroundColor: BRAND.dark,
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

  const gap = 16
  const pad = 28
  const font = "'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif"

  const card = (extra = {}) => ({
    borderRadius: '18px',
    border: `1px solid ${BRAND.cardBorder}`,
    overflow: 'hidden',
    position: 'relative',
    ...extra,
  })

  return (
    <>
      {/* ═══ Hidden 1080×1350 render target ═══ */}
      <div ref={boardRef} style={{
        position: 'fixed', left: '-9999px', top: 0,
        width: '1080px', height: '1350px',
        background: BRAND.dark,
        padding: `${pad}px`,
        fontFamily: font,
        display: 'flex', flexDirection: 'column', gap: `${gap}px`,
        overflow: 'hidden',
        color: BRAND.white,
      }}>

        {/* ── ROW 1: Hero Banner (full width) ── */}
        <div style={{
          ...card(),
          height: '340px',
          background: `linear-gradient(135deg, ${BRAND.secondary} 0%, ${BRAND.primary} 50%, ${BRAND.secondary} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          {/* Gradient glow orbs */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-40px',
            width: '350px', height: '350px',
            background: `radial-gradient(circle, ${BRAND.primary}60 0%, transparent 70%)`,
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-60px',
            width: '300px', height: '300px',
            background: `radial-gradient(circle, ${BRAND.primary}40 0%, transparent 70%)`,
            borderRadius: '50%',
          }} />
          {/* Logo + Name */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '28px' }}>
            <LogoMark size={90} color={BRAND.white} />
            <div>
              <div style={{
                fontSize: '72px', fontWeight: 800, letterSpacing: '-0.03em',
                lineHeight: 1, textShadow: `0 4px 30px ${BRAND.primaryGlow}`,
              }}>
                {brandName}
              </div>
              <div style={{
                fontSize: '18px', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px',
              }}>
                Sound Experience
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Logo Variations + Phone Mockup ── */}
        <div style={{ display: 'flex', gap: `${gap}px`, height: '280px' }}>
          {/* Logo on light */}
          <div style={{
            ...card(), flex: 1, background: '#f8f8fa',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '20px',
          }}>
            <LogoMark size={56} color={BRAND.primary} />
            <div style={{ fontSize: '28px', fontWeight: 700, color: BRAND.secondary, letterSpacing: '-0.02em' }}>
              {brandName}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
              <div style={{
                padding: '6px 16px', borderRadius: '8px',
                border: `1.5px solid ${BRAND.secondary}20`, background: '#fff',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <LogoMark size={22} color={BRAND.primary} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.secondary }}>{brandName}</span>
              </div>
              <div style={{
                padding: '6px 16px', borderRadius: '8px',
                background: BRAND.secondary,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <LogoMark size={22} color={BRAND.white} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.white }}>{brandName}</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div style={{
            ...card(), flex: 1, background: BRAND.cardDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Phone body */}
            <div style={{
              width: '140px', height: '250px',
              background: '#222230', borderRadius: '22px',
              border: '3px solid #333345',
              padding: '12px 8px',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 60px ${BRAND.primaryGlow}`,
            }}>
              {/* Notch */}
              <div style={{
                width: '50px', height: '6px', background: '#333345',
                borderRadius: '3px', margin: '0 auto 8px',
              }} />
              {/* Screen content */}
              <div style={{
                flex: 1, borderRadius: '10px',
                background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.secondary})`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <LogoMark size={36} color={BRAND.white} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{brandName}</div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>MOBILE APP</div>
              </div>
              {/* Home indicator */}
              <div style={{
                width: '40px', height: '4px', background: '#444',
                borderRadius: '2px', margin: '8px auto 0',
              }} />
            </div>
          </div>
        </div>

        {/* ── ROW 3: Laptop Mockup + Color Palette ── */}
        <div style={{ display: 'flex', gap: `${gap}px`, height: '300px' }}>
          {/* Laptop Mockup */}
          <div style={{
            ...card(), flex: 1.2, background: BRAND.cardDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative' }}>
              {/* Screen */}
              <div style={{
                width: '320px', height: '200px',
                background: '#222230', borderRadius: '10px 10px 0 0',
                border: '3px solid #333345', borderBottom: 'none',
                padding: '12px',
                boxShadow: `0 -8px 40px ${BRAND.primaryGlow}`,
              }}>
                {/* Browser chrome */}
                <div style={{
                  display: 'flex', gap: '4px', marginBottom: '8px', alignItems: 'center',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#28ca41' }} />
                  <div style={{
                    flex: 1, height: '14px', background: '#2a2a3e', borderRadius: '4px',
                    marginLeft: '8px', display: 'flex', alignItems: 'center', paddingLeft: '6px',
                  }}>
                    <span style={{ fontSize: '7px', color: '#666' }}>windowsdrip.app</span>
                  </div>
                </div>
                {/* Website content */}
                <div style={{
                  flex: 1, borderRadius: '6px', height: 'calc(100% - 26px)',
                  background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.primary}40)`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <LogoMark size={28} color={BRAND.white} />
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{brandName}</div>
                  <div style={{
                    padding: '4px 14px', borderRadius: '4px',
                    background: BRAND.primary, fontSize: '8px', fontWeight: 600, color: '#fff',
                  }}>
                    Get Started
                  </div>
                </div>
              </div>
              {/* Laptop base */}
              <div style={{
                width: '360px', height: '10px',
                background: 'linear-gradient(180deg, #444458, #333345)',
                borderRadius: '0 0 8px 8px', marginLeft: '-20px',
              }} />
              <div style={{
                width: '380px', height: '6px',
                background: '#2a2a3e', borderRadius: '0 0 4px 4px', marginLeft: '-30px',
              }} />
            </div>
          </div>

          {/* Color Palette */}
          <div style={{
            ...card(), flex: 0.8, background: '#f8f8fa',
            padding: '24px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 600, color: BRAND.muted,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px',
            }}>
              Color Palette
            </div>
            {/* Color bars */}
            <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
              {[
                { c: '#FFFFFF', label: '#FFFFFF', name: 'White', border: `1px solid #e0e0e0` },
                { c: BRAND.primary, label: '#7B68EE', name: 'Primary' },
                { c: BRAND.secondary, label: '#1A1A2E', name: 'Secondary' },
              ].map((item) => (
                <div key={item.name} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    flex: 1, background: item.c, borderRadius: '8px',
                    border: item.border || 'none',
                    boxShadow: item.c !== '#FFFFFF' ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
                  }} />
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: BRAND.secondary }}>{item.name}</div>
                    <div style={{ fontSize: '9px', color: BRAND.muted }}>{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Corner brackets decoration */}
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              width: '12px', height: '12px',
              borderTop: `2px solid ${BRAND.muted}40`, borderRight: `2px solid ${BRAND.muted}40`,
            }} />
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              width: '12px', height: '12px',
              borderBottom: `2px solid ${BRAND.muted}40`, borderLeft: `2px solid ${BRAND.muted}40`,
            }} />
          </div>
        </div>

        {/* ── ROW 4: Business Card + Tote Bag + Typography ── */}
        <div style={{ display: 'flex', gap: `${gap}px`, flex: 1 }}>
          {/* Business Card Mockup */}
          <div style={{
            ...card(), flex: 1, background: BRAND.cardDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative' }}>
              {/* Back card (slightly offset) */}
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                width: '220px', height: '130px',
                background: `linear-gradient(135deg, ${BRAND.primary}80, ${BRAND.secondary})`,
                borderRadius: '10px', opacity: 0.4,
              }} />
              {/* Front card */}
              <div style={{
                width: '220px', height: '130px',
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                borderRadius: '10px', position: 'relative',
                padding: '18px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LogoMark size={20} color={BRAND.white} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{brandName}</span>
                </div>
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>CREATIVE DIRECTOR</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>hello@{brandName.toLowerCase().replace(/\s/g, '')}.app</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tote Bag Mockup */}
          <div style={{
            ...card(), flex: 1, background: BRAND.cardDark,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative' }}>
              {/* Bag handles */}
              <div style={{
                position: 'absolute', top: '-20px', left: '30px',
                width: '40px', height: '28px',
                borderTop: `4px solid ${BRAND.primary}`,
                borderLeft: `4px solid ${BRAND.primary}`,
                borderRight: `4px solid ${BRAND.primary}`,
                borderRadius: '8px 8px 0 0',
              }} />
              <div style={{
                position: 'absolute', top: '-20px', right: '30px',
                width: '40px', height: '28px',
                borderTop: `4px solid ${BRAND.primary}`,
                borderLeft: `4px solid ${BRAND.primary}`,
                borderRight: `4px solid ${BRAND.primary}`,
                borderRadius: '8px 8px 0 0',
              }} />
              {/* Bag body */}
              <div style={{
                width: '160px', height: '170px',
                background: BRAND.primary,
                borderRadius: '4px 4px 16px 16px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: `0 12px 40px ${BRAND.primaryGlow}`,
              }}>
                <LogoMark size={44} color={BRAND.white} />
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{brandName}</div>
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div style={{
            ...card(), flex: 1, background: '#f8f8fa',
            padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 600, color: BRAND.muted,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px',
            }}>
              Typography
            </div>
            <div style={{
              fontSize: '48px', fontWeight: 800, color: BRAND.secondary,
              lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              Segoe UI
            </div>
            <div style={{
              fontSize: '48px', fontWeight: 800, color: BRAND.secondary,
              lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '14px',
            }}>
              Variable
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {[
                { label: 'Aa', weight: 400, name: 'Regular' },
                { label: 'Aa', weight: 600, name: 'Semi' },
                { label: 'Aa', weight: 800, name: 'Bold' },
              ].map((f) => (
                <div key={f.name} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: f.weight, color: BRAND.secondary }}>{f.label}</div>
                  <div style={{ fontSize: '8px', color: BRAND.muted, marginTop: '2px' }}>{f.name}</div>
                </div>
              ))}
            </div>
            {/* Color dots row */}
            <div style={{
              fontSize: '10px', fontWeight: 600, color: BRAND.muted,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '4px', marginBottom: '8px',
            }}>
              Color Palette
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[BRAND.primary, '#8f7ff7', BRAND.secondary, '#2a2a4a', BRAND.accent].map((c, i) => (
                <div key={i} style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: c, border: '2px solid #e8e8e8',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Watermark ── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          paddingRight: '4px', marginTop: '-8px',
        }}>
          <span style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.2)',
            fontWeight: 500, letterSpacing: '0.03em',
          }}>
            built in glyph.software
          </span>
        </div>
      </div>

      {/* ═══ Modal Overlay ═══ */}
      <div className="brand-board-overlay" onClick={onClose}>
        <div className="brand-board-modal" onClick={(e) => e.stopPropagation()}>
          <div className="brand-board-modal__header">
            <h2>Download Brand Board</h2>
            <button className="brand-board-modal__close" onClick={onClose}>✕</button>
          </div>
          <div className="brand-board-modal__preview">
            <div className="brand-board-modal__preview-label">Preview</div>
            <div className="brand-board-modal__preview-img">
              {/* Mini bento preview */}
              <div style={{
                width: '100%', height: '100%', background: BRAND.dark,
                borderRadius: '10px', padding: '10px',
                display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                {/* Row 1 hero */}
                <div style={{
                  flex: 2.5, borderRadius: '6px',
                  background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.primary})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{brandName}</span>
                </div>
                {/* Row 2 */}
                <div style={{ display: 'flex', gap: '6px', flex: 2 }}>
                  <div style={{ flex: 1, background: '#f8f8fa', borderRadius: '6px' }} />
                  <div style={{
                    flex: 1, background: BRAND.cardDark, borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '16px', height: '28px', background: '#333',
                      borderRadius: '4px', border: '1px solid #444',
                    }} />
                  </div>
                </div>
                {/* Row 3 */}
                <div style={{ display: 'flex', gap: '6px', flex: 2.2 }}>
                  <div style={{ flex: 1.2, background: BRAND.cardDark, borderRadius: '6px' }} />
                  <div style={{ flex: 0.8, display: 'flex', overflow: 'hidden', borderRadius: '6px' }}>
                    <div style={{ flex: 1, background: '#fff' }} />
                    <div style={{ flex: 1, background: BRAND.primary }} />
                    <div style={{ flex: 1, background: BRAND.secondary }} />
                  </div>
                </div>
                {/* Row 4 */}
                <div style={{ display: 'flex', gap: '6px', flex: 2 }}>
                  <div style={{ flex: 1, background: BRAND.cardDark, borderRadius: '6px' }} />
                  <div style={{ flex: 1, background: BRAND.cardDark, borderRadius: '6px' }} />
                  <div style={{ flex: 1, background: '#f8f8fa', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="brand-board-modal__info">
            <div className="brand-board-modal__spec">1080 x 1350px</div>
            <div className="brand-board-modal__spec">PNG &bull; Instagram Portrait</div>
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
