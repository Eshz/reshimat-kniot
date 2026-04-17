import { useState, useEffect, useRef } from 'react'
import './App.css'

const STORAGE_KEY = 'reshimat-kniot-items'

const DEFAULT_ITEMS = [
  { id: 1,  text: 'חלב', checked: false },
  { id: 2,  text: 'לחם', checked: false },
  { id: 3,  text: 'ביצים', checked: false },
  { id: 4,  text: 'גבינה צהובה', checked: false },
  { id: 5,  text: 'גבינה לבנה', checked: false },
  { id: 6,  text: 'יוגורט', checked: false },
  { id: 7,  text: 'חמאה', checked: false },
  { id: 8,  text: 'שמנת חמוצה', checked: false },
  { id: 9,  text: 'עגבניות', checked: false },
  { id: 10, text: 'מלפפונים', checked: false },
  { id: 11, text: 'פלפל', checked: false },
  { id: 12, text: 'גזר', checked: false },
  { id: 13, text: 'בצל', checked: false },
  { id: 14, text: 'תפוחי אדמה', checked: false },
  { id: 15, text: 'חסה', checked: false },
  { id: 16, text: 'תפוחים', checked: false },
  { id: 17, text: 'בננות', checked: false },
  { id: 18, text: 'לימון', checked: false },
  { id: 19, text: 'עוף', checked: false },
  { id: 20, text: 'בשר טחון', checked: false },
  { id: 21, text: 'דגים', checked: false },
  { id: 22, text: 'אורז', checked: false },
  { id: 23, text: 'פסטה', checked: false },
  { id: 24, text: 'רוטב עגבניות', checked: false },
  { id: 25, text: 'שמן זית', checked: false },
  { id: 26, text: 'לחמניות', checked: false },
  { id: 27, text: 'מיץ', checked: false },
  { id: 28, text: 'מים מינרלים', checked: false },
  { id: 29, text: 'אבקת כביסה', checked: false },
  { id: 30, text: 'נייר טואלט', checked: false },
]

function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_ITEMS
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

let nextId = Date.now()

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashFading, setSplashFading] = useState(false)
  const [items, setItems] = useState(loadItems)
  const [tab, setTab] = useState('all')
  const [newText, setNewText] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const inputRef = useRef(null)
  const editRef = useRef(null)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 800)
    const hideTimer = setTimeout(() => setShowSplash(false), 1300)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  useEffect(() => {
    saveItems(items)
  }, [items])

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingId])

  const filteredItems = items.filter(item => {
    if (tab === 'shopping') return item.checked
    return true
  })

  const checkedCount = items.filter(i => i.checked).length

  function toggleItem(id) {
    if (editMode) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function addItem(e) {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return
    setItems(prev => [...prev, { id: ++nextId, text, checked: false }])
    setNewText('')
    inputRef.current?.focus()
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startInlineEdit(item) {
    setEditingId(item.id)
    setEditText(item.text)
  }

  function saveEdit(id) {
    const text = editText.trim()
    if (text) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, text } : i))
    }
    setEditingId(null)
  }

  function toggleEditMode() {
    setEditMode(prev => !prev)
    setEditingId(null)
  }

  return (
    <>
      {showSplash && (
        <div className={`splash ${splashFading ? 'fade-out' : ''}`}>
          <div className="splash-inner">
            <div className="splash-emoji">🛒</div>
            <h1 className="splash-title">רשימת קניות</h1>
            <p className="splash-sub">הרשימה שלנו</p>
          </div>
        </div>
      )}

      <div className="app">
        <header className="header">
          <div className="header-left">
            <button
              className={`btn-edit-mode ${editMode ? 'active' : ''}`}
              onClick={toggleEditMode}
            >
              {editMode ? 'סיום' : 'עריכה'}
            </button>
          </div>
          <div className="header-center">
            <span className="header-emoji">🛒</span>
            <h1 className="header-title">רשימת קניות</h1>
          </div>
          <div className="header-right" />
        </header>

        <nav className="tabs">
          <button
            className={`tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            הכל
            <span className="tab-count">{items.length}</span>
          </button>
          <button
            className={`tab ${tab === 'shopping' ? 'active' : ''}`}
            onClick={() => setTab('shopping')}
          >
            לקנות
            <span className="tab-count">{checkedCount}</span>
          </button>
        </nav>

        <main className="list-container">
          {filteredItems.length === 0 && (
            <div className="empty">
              {tab === 'shopping' ? '🛒 לא סומנו פריטים עדיין' : '✅ הרשימה ריקה'}
            </div>
          )}

          <ul className="list">
            {filteredItems.map(item => (
              <li
                key={item.id}
                className={`item ${item.checked ? 'checked' : ''} ${editMode ? 'editing' : ''}`}
                onClick={!editMode && editingId !== item.id ? () => toggleItem(item.id) : undefined}
              >
                {editMode ? (
                  <button className="btn-remove" onClick={e => { e.stopPropagation(); removeItem(item.id) }}>−</button>
                ) : (
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    onClick={e => e.stopPropagation()}
                  />
                )}

                {editingId === item.id ? (
                  <input
                    ref={editRef}
                    className="edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(item.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                ) : (
                  <span
                    className="item-text"
                    onClick={editMode ? () => startInlineEdit(item) : undefined}
                  >
                    {item.text}
                  </span>
                )}

                {editMode && editingId !== item.id && (
                  <button className="btn-rename" onClick={() => startInlineEdit(item)}>✏️</button>
                )}
              </li>
            ))}
          </ul>
        </main>

        <form className="add-form" onSubmit={addItem}>
          <div className="add-form-inner">
            <input
              ref={inputRef}
              className="add-input"
              type="text"
              placeholder="הוסף פריט חדש..."
              value={newText}
              onChange={e => setNewText(e.target.value)}
            />
            <button className="btn-add" type="submit">+</button>
          </div>
        </form>
      </div>
    </>
  )
}
