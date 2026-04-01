import React from 'react'
import PackCard from './PackCard'

export default function PackBrowser({ title, packs, activePackId, onSelectPack, emptyMessage }) {
  return (
    <div className="pack-browser">
      <h1 className="pack-browser__title">{title}</h1>
      {packs.length === 0 ? (
        <div className="pack-browser__empty">
          <div className="pack-browser__empty-icon">🎵</div>
          <p>{emptyMessage || 'No packs found.'}</p>
        </div>
      ) : (
        <div className="pack-browser__grid">
          {packs.map(pack => (
            <PackCard
              key={pack.id}
              pack={pack}
              isActive={pack.id === activePackId}
              onClick={() => onSelectPack(pack)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
