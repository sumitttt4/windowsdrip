import React, { useState, useRef } from 'react'

const SOUND_LABELS = {
  '.Default': { label: 'General Notification', icon: '🔔' },
  'SystemStart': { label: 'Windows Startup', icon: '🚀' },
  'SystemExit': { label: 'Windows Shutdown', icon: '🌙' },
  'SystemExclamation': { label: 'Error / Warning', icon: '⚠️' },
  'Notification.Default': { label: 'Toast Notification', icon: '💬' },
  'SystemAsterisk': { label: 'Information', icon: 'ℹ️' },
  'DeviceConnect': { label: 'USB Plug In', icon: '🔌' },
  'DeviceDisconnect': { label: 'USB Unplug', icon: '⏏️' },
  'EmptyRecycleBin': { label: 'Empty Trash', icon: '🗑️' },
  'MailBeep': { label: 'New Email', icon: '📧' }
}

const PACK_EMOJIS = {
  'brainrot': '🧠',
  'classic-windows': '🪟'
}

export default function PackDetail({ pack, isActive, isApplying, onApply, onBack }) {
  const [playingSound, setPlayingSound] = useState(null)
  const audioRef = useRef(null)
  const emoji = PACK_EMOJIS[pack.id] || '🔊'

  const handlePreviewSound = async (soundKey) => {
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (playingSound === soundKey) {
      setPlayingSound(null)
      return
    }

    if (!window.electronAPI) return

    try {
      const result = await window.electronAPI.getSoundPath(pack.id, soundKey)
      if (result.success) {
        const audio = new Audio(`file://${result.path}`)
        audioRef.current = audio
        setPlayingSound(soundKey)
        audio.play()
        audio.onended = () => {
          setPlayingSound(null)
          audioRef.current = null
        }
        audio.onerror = () => {
          setPlayingSound(null)
          audioRef.current = null
        }
      }
    } catch (err) {
      console.error('Failed to preview sound:', err)
    }
  }

  return (
    <div className="pack-detail">
      <button className="pack-detail__back" onClick={onBack}>
        ← Back to packs
      </button>

      <div className="pack-detail__header">
        <div className="pack-detail__cover">
          <span className="pack-detail__emoji">{emoji}</span>
        </div>
        <div className="pack-detail__meta">
          <h1 className="pack-detail__name">{pack.name}</h1>
          <p className="pack-detail__description">{pack.description}</p>
          <div className="pack-detail__tags">
            <span className="pack-detail__tag">{pack.price || 'free'}</span>
            {pack.author && <span className="pack-detail__tag">by {pack.author}</span>}
          </div>
          <button
            className={`pack-detail__apply ${isActive ? 'pack-detail__apply--active' : ''}`}
            onClick={onApply}
            disabled={isApplying || isActive}
          >
            {isApplying ? 'Applying...' : isActive ? '✓ Currently Active' : 'Apply Pack'}
          </button>
        </div>
      </div>

      <h2 className="pack-detail__section-title">Sounds</h2>
      <div className="pack-detail__sounds">
        {Object.entries(pack.sounds || {}).map(([key, file]) => {
          const info = SOUND_LABELS[key] || { label: key, icon: '🔊' }
          const isPlaying = playingSound === key
          return (
            <div
              key={key}
              className={`sound-row ${isPlaying ? 'sound-row--playing' : ''}`}
              onClick={() => handlePreviewSound(key)}
            >
              <span className="sound-row__icon">{info.icon}</span>
              <div className="sound-row__info">
                <span className="sound-row__label">{info.label}</span>
                <span className="sound-row__file">{file}</span>
              </div>
              <button className="sound-row__play" aria-label={`Preview ${info.label}`}>
                {isPlaying ? '⏹' : '▶'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
