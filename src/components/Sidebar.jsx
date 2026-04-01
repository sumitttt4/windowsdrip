import React from 'react'

const NAV_ITEMS = [
  { id: 'browse', label: 'Browse', icon: '🔊' },
  { id: 'installed', label: 'Installed', icon: '✅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
]

export default function Sidebar({ currentView, onChangeView, activePackId }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar__item ${currentView === item.id ? 'sidebar__item--active' : ''}`}
            onClick={() => onChangeView(item.id)}
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            <span className="sidebar__item-label">{item.label}</span>
            {item.id === 'installed' && activePackId && (
              <span className="sidebar__badge">1</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__version">v1.0.0</div>
      </div>
    </aside>
  )
}
