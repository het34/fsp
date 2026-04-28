'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [msg, setMsg] = useState<string | null>(null)
  const [health, setHealth] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => setMsg('Could not reach Express API'))

    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(d.status))
      .catch(() => setHealth('error'))
  }, [])

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Next.js + Express — Fullstack Practice</h1>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Express API responses</h2>
        <p>
          <strong>GET /api/hello →</strong>{' '}
          {msg ?? <em>loading…</em>}
        </p>
        <p>
          <strong>GET /api/health →</strong>{' '}
          {health ?? <em>loading…</em>}
        </p>
      </section>

      <section style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
        <p>Both the Next.js frontend and Express backend run on the same port.</p>
        <ul>
          <li><code>npm run start</code> — start everything (dev mode)</li>
          <li><code>npm run dev</code> — start with nodemon (auto-reload on server changes)</li>
          <li><code>npm run build</code> then <code>npm run start:prod</code> — production</li>
        </ul>
      </section>
    </main>
  )
}