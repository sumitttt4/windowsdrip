import React from 'react'

const PACK_EMOJIS = {
  'brainrot': '🧠',
  'classic-windows': '🪟',
  'nature': '🌿',
  'retro-gaming': '🎮',
  'lo-fi': '🎧'
}

export default function PackCard({ pack, isActive, onClick }) {
  const emoji = PACK_EMOJIS[pack.id] || '🔊'
  const soundCount = Object.keys(pack.sounds || {}).length

  return (
    <div
      className={`pack-card ${isActive ? 'pack-card--active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {isActive && <div className="pack-card__active-badge">Active</div>}
      <div className="pack-card__cover">
        <span className="pack-card__emoji">{emoji}</span>
      </div>
      <div className="pack-card__info">
        <h3 className="pack-card__name">{pack.name}</h3>
        <p className="pack-card__description">{pack.description}</p>
        <div className="pack-card__meta">
          <span className="pack-card__tag">{pack.price || 'free'}</span>
          <span className="pack-card__sounds">{soundCount} sounds</span>
        </div>
      </div>
    </div>
  )
}
