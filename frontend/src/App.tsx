import { useState, type FormEvent } from 'react'
import axios from 'axios'
import './App.css'

type User = {
  id: number
  username: string
  email: string
}

function App() {
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const params: { search?: string; email?: string } = {}
    const usernameFilter = search.trim()
    const emailFilter = email.trim()

    if (usernameFilter) params.search = usernameFilter
    if (emailFilter) params.email = emailFilter

    try {
      const response = await axios.get<User[]>('/api/users/', { params })
      setUsers(response.data)
      setHasSearched(true)
    } catch {
      setUsers([])
      setHasSearched(false)
      setError('Не удалось загрузить пользователей. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="app">
      <section className="search-panel" aria-labelledby="page-title">
        <p className="eyebrow">Каталог</p>
        <h1 id="page-title">Поиск пользователей</h1>
        <p className="description">
          Найдите пользователя по имени и при необходимости уточните поиск по
          email.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Имя пользователя</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Например, magamet"
            />
          </label>
          <label className="field">
            <span>Email (необязательно)</span>
            <input
              type="search"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Например, gmail"
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Ищем…' : 'Найти'}
          </button>
        </form>
      </section>

      <section className="results" aria-live="polite" aria-busy={isLoading}>
        {error && <p className="message error-message">{error}</p>}
        {!error && isLoading && (
          <p className="message">Загружаем пользователей…</p>
        )}
        {!error && !isLoading && hasSearched && users.length === 0 && (
          <p className="message">Пользователи не найдены</p>
        )}
        {!error && !isLoading && users.length > 0 && (
          <ul className="user-list">
            {users.map((user) => (
              <li className="user-card" key={user.id}>
                <p className="username">
                  <span aria-hidden="true">👤</span> {user.username}
                </p>
                <p className="user-email">
                  <span aria-hidden="true">📧</span> {user.email}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
