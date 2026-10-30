import { useRef, useState } from 'react'
import { FileCode2, UploadCloud, Send, LoaderCircle, Sparkles, Trash2, CheckCircle2, AlertCircle, FolderGit2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://codebase-assistant-3-umfd.onrender.com';

export default function App() {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [indexing, setIndexing] = useState(false)
  const [indexed, setIndexed] = useState(false)
  const [repo, setRepo] = useState('')
  const [chunkCount, setChunkCount] = useState(0)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  async function uploadRepository(event) {
    event.preventDefault()
    if (!file) return
    setError('')
    setIndexing(true)
    setIndexed(false)
    setMessages([])
    try {
      const form = new FormData()
      form.append('file', file)
      const response = await fetch(`${API_BASE}/api/index`, { method: 'POST', body: form })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Could not index repository.')
      setIndexed(true)
      setRepo(data.repo_name)
      setChunkCount(data.chunks_indexed)
    } catch (err) {
      setError(err.message || 'Unable to reach the API. Is the backend running?')
    } finally {
      setIndexing(false)
    }
  }

  async function ask(event) {
    event.preventDefault()
    const clean = question.trim()
    if (!clean || !indexed || asking) return
    setError('')
    setMessages(prev => [...prev, { role: 'user', content: clean }])
    setQuestion('')
    setAsking(true)
    try {
      const response = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: clean }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Question failed.')
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sources: data.sources || [] }])
    } catch (err) {
      setError(err.message || 'Unable to get an answer.')
    } finally {
      setAsking(false)
    }
  }

  async function clearIndex() {
    try {
      await fetch(`${API_BASE}/api/index`, { method: 'DELETE' })
    } catch { /* local UI is still cleared */ }
    setIndexed(false)
    setRepo('')
    setChunkCount(0)
    setMessages([])
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setError('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="RepoPilot home">
          <span className="brand-mark"><FileCode2 size={22} /></span>
          <span>Repo<span className="brand-accent">Pilot</span></span>
        </a>
        <div className="topbar-right"><span className="status-dot" /> Local RAG workspace</div>
      </header>

      <main className="main-layout">
        <section className="hero">
          <div className="eyebrow"><Sparkles size={14} /> GENAI MINI PROJECT</div>
          <h1>Understand any codebase.<br /><span>Just ask.</span></h1>
          <p className="hero-copy">Upload a source-code ZIP and chat with your repository. RepoPilot retrieves relevant code with embeddings before generating an answer.</p>
        </section>

        <div className="workspace">
          <aside className="sidebar">
            <div className="panel-heading"><FolderGit2 size={17} /><h2>Repository</h2></div>
            {!indexed ? (
              <form onSubmit={uploadRepository}>
                <button type="button" className="dropzone" onClick={() => fileRef.current?.click()}>
                  <span className="upload-icon"><UploadCloud size={23} /></span>
                  <strong>{file ? file.name : 'Upload repository ZIP'}</strong>
                  <span>{file ? 'Ready to index' : 'Select a .zip file · Max 8 MB'}</span>
                </button>
                <input ref={fileRef} type="file" accept=".zip,application/zip" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
                <button className="primary-btn full-btn" disabled={!file || indexing}>
                  {indexing ? <><LoaderCircle className="spin" size={16} /> Indexing code…</> : <><Sparkles size={16} /> Index repository</>}
                </button>
              </form>
            ) : (
              <div className="repo-card">
                <div className="repo-file-icon"><FileCode2 size={20} /></div>
                <div className="repo-info"><strong>{repo}</strong><span>{chunkCount} code chunks indexed</span></div>
                <CheckCircle2 className="success-icon" size={18} />
                <button className="text-btn" onClick={clearIndex}><Trash2 size={14} /> Clear index</button>
              </div>
            )}
            <div className="sidebar-note">
              <strong>How it works</strong>
              <ol>
                <li>Read supported source files</li>
                <li>Split code into chunks</li>
                <li>Embed and retrieve relevant chunks</li>
                <li>Generate a grounded answer</li>
              </ol>
            </div>
            {/* <div className="privacy-note"><span className="privacy-dot" /> No database. Index stays in backend memory.</div> */}
          </aside>

          <section className="chat-panel">
            <div className="chat-header">
              <div><h2>Codebase assistant</h2><p>Ask questions about functions, files, or architecture.</p></div>
              <span className={`pill ${indexed ? 'pill-ready' : ''}`}>{indexed ? 'INDEXED' : 'WAITING FOR REPO'}</span>
            </div>
            <div className="chat-body">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-orb"><Sparkles size={26} /></div>
                  <h3>{indexed ? 'Your codebase is ready' : 'Your codebase, explained'}</h3>
                  <p>{indexed ? 'Choose a suggested question or write your own below.' : 'Upload a repository ZIP to start asking questions. Answers are based on retrieved source snippets.'}</p>
                  <div className="suggestions">
                    {['Where is the application entry point?', 'Explain the main API routes', 'How is authentication handled?'].map(item =>
                      <button key={item} disabled={!indexed} onClick={() => setQuestion(item)}>{item}<span>↗</span></button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="message-list">
                  {messages.map((message, index) => (
                    <article className={`message ${message.role}`} key={index}>
                      <div className="message-label">{message.role === 'user' ? 'YOU' : <><Sparkles size={13} /> REP PILOT</>}</div>
                      <div className="message-content">{message.content}</div>
                      {message.sources?.length > 0 && <div className="sources">
                        <div className="sources-heading">Retrieved source snippets</div>
                        {message.sources.map((source, i) => (
                          <details key={`${source.path}-${i}`}>
                            <summary><FileCode2 size={14} /><span>{source.path}</span><small>L{source.start_line}–{source.end_line}</small></summary>
                            <pre>{source.snippet}</pre>
                          </details>
                        ))}
                      </div>}
                    </article>
                  ))}
                  {asking && <div className="thinking"><LoaderCircle className="spin" size={17} /> Searching code and generating an answer…</div>}
                </div>
              )}
            </div>
            <form className="composer" onSubmit={ask}>
              <input value={question} onChange={e => setQuestion(e.target.value)} disabled={!indexed || asking} placeholder={indexed ? 'Ask something about your codebase…' : 'Index a repository to enable questions'} />
              <button className="send-btn" disabled={!indexed || !question.trim() || asking} aria-label="Send question">{asking ? <LoaderCircle className="spin" size={17} /> : <Send size={17} />}</button>
            </form>
            <div className="chat-foot">AI-generated answers may be inaccurate. Verify important details in the source code.</div>
          </section>
        </div>
        {error && <div className="error-banner"><AlertCircle size={17} /><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
        {/* <footer>RepoPilot · Retrieval-Augmented Generation over source code · Built with React, FastAPI & OpenAI</footer> */}
      </main>
    </div>
  )
}


