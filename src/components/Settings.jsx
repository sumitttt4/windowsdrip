import React from 'react'

export default function Settings({ onRestoreDefaults, isApplying, activePackId }) {
  return (
    <div className="settings">
      <h1 className="settings__title">Settings</h1>

      <div className="settings__section">
        <h2 className="settings__section-title">Sound Scheme</h2>
        <div className="settings__card">
          <div className="settings__card-info">
            <h3>Current Active Pack</h3>
            <p>{activePackId || 'Windows Default'}</p>
          </div>
        </div>

        <div className="settings__card settings__card--action">
          <div className="settings__card-info">
            <h3>Restore Default Sounds</h3>
            <p>Reset all system sounds back to the Windows default scheme.</p>
          </div>
          <button
            className="settings__restore-btn"
            onClick={onRestoreDefaults}
            disabled={isApplying || !activePackId}
          >
            {isApplying ? 'Restoring...' : 'Restore Defaults'}
          </button>
        </div>
      </div>

      <div className="settings__section">
        <h2 className="settings__section-title">About</h2>
        <div className="settings__card">
          <div className="settings__card-info">
            <h3>WindowsDrip</h3>
            <p>Version 1.0.0</p>
            <p className="settings__about-desc">
              Browse and apply custom Windows sound packs. Personalize your
              PC's audio experience with themed sound schemes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
