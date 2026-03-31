import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../firebase'
import './ShoppingList.css'

function ShoppingList() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editAmount, setEditAmount] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'shoppingList'), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    await addDoc(collection(db, 'shoppingList'), {
      name: name.trim(),
      amount: amount.trim(),
      createdAt: Date.now(),
    })
    setName('')
    setAmount('')
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, 'shoppingList', id))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditAmount(item.amount)
  }

  async function saveEdit(id) {
    await updateDoc(doc(db, 'shoppingList', id), { amount: editAmount.trim() })
    setEditingId(null)
  }

  function handleEditKeyDown(e, id) {
    if (e.key === 'Enter') saveEdit(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="shopping-list">
      <div className="shopping-header">
        <h2 className="section-title">Handleliste</h2>
      </div>

      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          placeholder="Vare"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-name"
          required
        />
        <input
          type="text"
          placeholder="Mengde"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-amount"
        />
        <button type="submit" className="add-btn">Legg til</button>
      </form>

      {items.length === 0 ? (
        <p className="empty-msg">Ingen varer på listen ennå.</p>
      ) : (
        <ul className="items-list">
          {items.map((item) => (
            <li key={item.id} className="item-row">
              <span className="item-name">{item.name}</span>
              <div className="item-right">
                {editingId === item.id ? (
                  <input
                    className="edit-amount-input"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                    autoFocus
                  />
                ) : (
                  <button
                    className="amount-btn"
                    onClick={() => startEdit(item)}
                    title="Endre mengde"
                  >
                    {item.amount || '—'}
                  </button>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Fjern"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShoppingList
