#  Codebase RAG Assistant

A small GenAI mini project that lets you upload a ZIP of source code, indexes code chunks in memory, retrieves relevant snippets with embeddings, and answers questions using an LLM.
## Table of Content

<ul>
  <li><a href="#problem-statement">Problem Statement</a></li>
  <li><a href="#objectives">Objectives</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#architecture">Architecture</a></li>
  <li><a href="#tech-stack">Tech Stack</a></li>
  <li><a href="#requirements">Requirements</a></li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#configure-backend">Configure the Backend</a></li>
      <li><a href="#run-backend">Run the Backend</a></li>
      <li><a href="#run-frontend">Run the Frontend</a></li>
    </ul>
  </li>
  <li><a href="#how-to-use">How to Use</a></li>
  <li><a href="#environment-variables">Environment Variables</a></li>
  <li><a href="#notes-and-limitations">Notes and Limitations</a></li>
  <li><a href="#future-scope">Future Scope</a></li>
  <li><a href="#author">Author</a></li>
</ul>

<h2 id="Problem statement">Problem statement</h2>

Understanding an unfamiliar codebase can take time, especially for students working with projects created by other people. Searching files manually often fails when the user does not know the exact function or filename.

<h2 id="Objectives">Objectives</h2>

1. Enable natural-language questions about a small source-code repository.
2. Demonstrate embeddings and semantic retrieval.
3. Ground LLM answers in retrieved code snippets.
4. Provide source filenames and line ranges for verification.
5. Keep the prototype simple by avoiding a database.

<h2 id="features">Features</h2>
- Upload a `.zip` repository (no database required)
- Extract and chunk supported source files
- Generate embeddings with OpenAI
- Retrieve relevant chunks using cosine similarity
- Answer questions using retrieved context
- Show source filenames and line ranges
- Basic file-size, extension, and archive path checks

<h2 id="architecture">Architecture</h2>

React UI → FastAPI upload/question endpoints → source-file extraction → line-based chunking → OpenAI embeddings → in-memory NumPy vectors → cosine-similarity retrieval → OpenAI chat completion → answer and source snippets.

<h2 id="tech-stack">Tech Stack</h2>
- Frontend: React + Vite
- Backend: FastAPI
- Embeddings and answers: OpenAI API
- Vector storage: in-memory NumPy arrays (resets when backend restarts)

<h2 id="requirements">Requirements</h2>
- Python 3.10+
- Node.js 18+
- OpenAI API key with API billing/credits enabled
- Ollama API (use any one Ollama or OpenAI)
<h2 id="getting-started">Getting Started</h2>
<h3 id="configure-backend">Configure the Backend</h3>
Open a terminal in `backend/`:

### Windows PowerShell
```
In powershell/terminal
py -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set `OPENAI_API_KEY=your_key_here`.

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

<h3 id="run-backend">Run the Backend</h3>
```bash
uvicorn app.main:app --reload --port 8000
API docs: http://localhost:8000/docs
```

<h3 id="run-frontend">Run the Frontend</h3>
Open another terminal in `frontend/`:
```bash
 npm install
 npm run dev
Open the local URL printed by Vite (usually http://localhost:5173).```

<h2 id="how-to-use">How to Use</h2>

1. Create a ZIP of a small source-code project.
2. Upload the ZIP in RepoPilot.
3. Wait for indexing to finish.
4. Ask questions such as:
   - "Where is authentication implemented?"
   - "Explain the main API routes."
   - "What does the upload handler do?"
5. Click source references in the answer to inspect the retrieved snippets.

<h2 id="environment-variables">Environment Variables</h2>

`backend/.env`:
```env
OPENAI_API_KEY=your_key_here
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
FRONTEND_ORIGIN=http://localhost:5173
```

Do not commit `.env` or share your API key. If a key was exposed publicly, revoke it and create a new one.

<h2 id="notes-and-limitations">Notes and Limitations</h2>
- This is a mini-project starter, not a production security-reviewed service.
- The index is in memory and disappears when the server restarts.
- The upload endpoint accepts ZIP files only and ignores common binary/build/vendor folders.
- Keep repositories small upto 8 mb. Never upload secrets, `.env` files, private keys, credentials, or proprietary code without permission.
- LLM answers can be wrong; verify source snippets.

<h2 id="future-scope">Future Scope</h2>
- Persistent vector database such as FAISS, Chroma, or a hosted vector store.
- GitHub repository URL integration.
- Authentication and per-user projects.
- More accurate language-aware chunking.
- Streaming responses, evaluation tests, and feedback collection.
- Dockerized deployment and monitoring.

<h2 id="author">Author</h2>
**Neeraj Maurya**
Email-nmmaurya2255@gmail.com
