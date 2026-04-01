import React, { useState, useEffect, useCallback } from 'react'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import PackBrowser from './components/PackBrowser'
import PackDetail from './components/PackDetail'
import Settings from './components/Settings'

const VIEWS = {
  BROWSE: 'browse',
  INSTALLED: 'installed',
  SETTINGS: 'settings'
}

export default function App() {
  const [packs, setPacks] = useState([])
  const [activePackId, setActivePackId] = useState(null)
  const [currentView, setCurrentView] = useState(VIEWS.BROWSE)
  const [selectedPack, setSelectedPack] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const loadPacks = useCallback(async () => {
    if (!window.electronAPI) return
    const result = await window.electronAPI.listPacks()
    if (result.success) {
      setPacks(result.packs)
    }
  }, [])

  const loadActivePack = useCallback(async () => {
    if (!window.electronAPI) return
    const result = await window.electronAPI.getActivePack()
    if (result.success) {
      setActivePackId(result.activePackId)
    }
  }, [])

  useEffect(() => {
    loadPacks()
    loadActivePack()
  }, [loadPacks, loadActivePack])

  const handleApplyPack = async (packId) => {
    if (!window.electronAPI) return
    setIsApplying(true)
    try {
      const result = await window.electronAPI.applyPack(packId)
      if (result.success) {
        setActivePackId(packId)
        showNotification(`Sound pack applied successfully!`)
      } else {
        showNotification(result.error || 'Failed to apply pack', 'error')
      }
    } catch (err) {
      showNotification('Failed to apply pack', 'error')
    }
    setIsApplying(false)
  }

  const handleRestoreDefaults = async () => {
    if (!window.electronAPI) return
    setIsApplying(true)
    try {
      const result = await window.electronAPI.restoreDefaults()
      if (result.success) {
        setActivePackId(null)
        showNotification('Default sounds restored!')
      } else {
        showNotification(result.error || 'Failed to restore defaults', 'error')
      }
    } catch (err) {
      showNotification('Failed to restore defaults', 'error')
    }
    setIsApplying(false)
  }

  const installedPacks = packs.filter(p => p.id === activePackId)

  const renderContent = () => {
    if (selectedPack) {
      return (
        <PackDetail
          pack={selectedPack}
          isActive={selectedPack.id === activePackId}
          isApplying={isApplying}
          onApply={() => handleApplyPack(selectedPack.id)}
          onBack={() => setSelectedPack(null)}
        />
      )
    }

    switch (currentView) {
      case VIEWS.INSTALLED:
        return (
          <PackBrowser
            title="Installed"
            packs={installedPacks}
            activePackId={activePackId}
            onSelectPack={setSelectedPack}
            emptyMessage="No sound pack is currently active. Browse packs to get started!"
          />
        )
      case VIEWS.SETTINGS:
        return (
          <Settings
            onRestoreDefaults={handleRestoreDefaults}
            isApplying={isApplying}
            activePackId={activePackId}
          />
        )
      default:
        return (
          <PackBrowser
            title="Browse Sound Packs"
            packs={packs}
            activePackId={activePackId}
            onSelectPack={setSelectedPack}
          />
        )
    }
  }

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <Sidebar
          currentView={currentView}
          onChangeView={(view) => {
            setCurrentView(view)
            setSelectedPack(null)
          }}
          activePackId={activePackId}
        />
        <main className="content">
          {renderContent()}
        </main>
      </div>
      {notification && (
        <div className={`notification notification--${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  )
}
