'use client';
import { useState, useEffect } from 'react';

interface Feedback {
  id: number;
  title: string;
  description: string;
  votes: number;
  created_at: string;
}

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');
  const [focusForm, setFocusForm] = useState(false);

  const fetchFeedback = async () => {
    const res = await fetch('/api/feedback');
    const data = await res.json();
    setFeedbacks(data as Feedback[]);
  };

  useEffect(() => { fetchFeedback(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const submitFeedback = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    setTitle('');
    setDescription('');
    setLoading(false);
    setSubmitted(true);
    setFocusForm(false);
    showToast('✅ Idea submitted! Thanks for contributing.');
    fetchFeedback();
  };

  const vote = async (id: number) => {
    if (voted.includes(id)) {
      // UNDO vote
      setVoted(voted.filter(v => v !== id));
      await fetch(`/api/feedback/${id}/unvote`, { method: 'POST' });
      showToast('↩ Vote removed.');
      fetchFeedback();
    } else {
      setVoted([...voted, id]);
      await fetch(`/api/feedback/${id}/vote`, { method: 'POST' });
      showToast('🔥 Upvoted!');
      fetchFeedback();
    }
  };

  const totalVotes = feedbacks.reduce((a, b) => a + b.votes, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #0a0a0f;
          --ink2: #3a3a4a;
          --muted: #8888aa;
          --faint: #f0f0f8;
          --line: #e4e4f0;
          --accent: #5b4fff;
          --accent2: #ff4f8b;
          --gold: #ffb800;
          --white: #ffffff;
          --card: #ffffff;
          --page: #f6f6fc;
          --voted-bg: #5b4fff;
          --voted-text: #ffffff;
          --radius: 16px;
          --radius-sm: 10px;
        }

        body { background: var(--page); font-family: 'DM Sans', sans-serif; color: var(--ink); }

        .hero {
          background: var(--ink);
          padding: 0;
          position: relative;
          overflow: hidden;
        }

        .hero-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(91,79,255,0.35) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
        }

        .hero-glow2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,79,139,0.2) 0%, transparent 70%);
          bottom: -150px; left: -50px;
          pointer-events: none;
        }

        .hero-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 64px 48px 56px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: end;
        }

        .hero-label {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(91,79,255,0.25);
          border: 1px solid rgba(91,79,255,0.5);
          color: #a89fff;
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px;
          margin-bottom: 20px;
        }

        .hero-label span { width: 6px; height: 6px; background: #5b4fff; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800; color: var(--white);
          line-height: 1.1; letter-spacing: -0.02em;
        }

        .hero-title .accent { color: #a89fff; }
        .hero-title .accent2 { color: #ff85b0; }

        .hero-sub {
          margin-top: 16px;
          color: #8888aa; font-size: 17px; line-height: 1.6;
          max-width: 500px;
        }

        .hero-stats {
          display: flex; flex-direction: column; gap: 16px;
          min-width: 180px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-sm);
          padding: 16px 20px;
          text-align: right;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 800; color: var(--white);
          line-height: 1;
        }

        .stat-label { font-size: 12px; color: #8888aa; margin-top: 4px; }

        .main-layout {
          max-width: 1200px; margin: 0 auto;
          padding: 48px 48px;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 32px;
          align-items: start;
        }

        .sidebar { position: sticky; top: 32px; }

        .form-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          transition: box-shadow 0.3s;
        }

        .form-card.focused { box-shadow: 0 0 0 3px rgba(91,79,255,0.15); border-color: #5b4fff; }

        .form-header {
          padding: 24px 24px 0;
          border-bottom: 1px solid var(--line);
          padding-bottom: 20px;
        }

        .form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 700; color: var(--ink);
        }

        .form-header p { font-size: 13px; color: var(--muted); margin-top: 4px; }

        .form-body { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 12px; }

        .field-label { font-size: 12px; font-weight: 500; color: var(--ink2); margin-bottom: 6px; display: block; letter-spacing: 0.02em; }

        .input-wrap input, .input-wrap textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--line);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: var(--ink);
          background: var(--faint);
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          resize: none;
        }

        .input-wrap input:focus, .input-wrap textarea:focus {
          border-color: #5b4fff;
          background: var(--white);
        }

        .char-count { font-size: 11px; color: var(--muted); text-align: right; margin-top: 4px; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          position: relative; overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) { background: #4a3ee8; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(91,79,255,0.3); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { background: #c5caff; cursor: not-allowed; }

        .hint { font-size: 12px; color: var(--muted); text-align: center; }

        .guidelines {
          margin-top: 20px;
          background: var(--faint);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 16px;
        }

        .guidelines h3 { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--ink2); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }

        .guidelines li { font-size: 13px; color: var(--muted); margin-bottom: 6px; padding-left: 18px; position: relative; list-style: none; }
        .guidelines li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-size: 11px; top: 1px; }

        /* Feed */
        .feed-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }

        .feed-header h2 { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 700; }

        .sort-tag {
          font-size: 12px; color: var(--muted);
          background: var(--faint); border: 1px solid var(--line);
          padding: 6px 12px; border-radius: 100px;
        }

        .feedback-item {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 20px 24px;
          margin-bottom: 12px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: start;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          position: relative;
        }

        .feedback-item:hover { border-color: #d0d0e8; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-1px); }
        .feedback-item.top-item { border-color: #5b4fff; box-shadow: 0 4px 24px rgba(91,79,255,0.12); }

        .vote-col { display: flex; flex-direction: column; align-items: center; gap: 0; }

        .vote-btn {
          display: flex; flex-direction: column; align-items: center;
          background: var(--faint);
          border: 1.5px solid var(--line);
          border-radius: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: all 0.2s;
          gap: 2px;
          min-width: 58px;
        }

        .vote-btn:hover:not(.voted) { background: #eeeeff; border-color: #5b4fff; }
        .vote-btn.voted { background: var(--voted-bg); border-color: var(--voted-bg); }

        .vote-arrow {
          font-size: 14px;
          color: var(--accent);
          transition: color 0.2s;
          line-height: 1;
        }

        .vote-btn.voted .vote-arrow { color: white; }

        .vote-count {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800;
          color: var(--accent);
          line-height: 1;
          transition: color 0.2s;
        }

        .vote-btn.voted .vote-count { color: white; }

        .undo-hint {
          font-size: 10px; color: var(--muted);
          margin-top: 6px; text-align: center;
          transition: opacity 0.2s;
        }

        .item-content { min-width: 0; }

        .item-top { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }

        .item-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem; font-weight: 700; color: var(--ink);
          flex: 1; min-width: 0;
          line-height: 1.3;
        }

        .badge {
          font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          letter-spacing: 0.05em; white-space: nowrap;
          flex-shrink: 0;
        }

        .badge-top { background: #eeeeff; color: #5b4fff; }
        .badge-hot { background: #fff3e0; color: #e65100; }
        .badge-new { background: #e8f5e9; color: #2e7d32; }

        .item-desc { font-size: 14px; color: var(--ink2); line-height: 1.6; margin-bottom: 10px; }

        .item-meta { display: flex; align-items: center; gap: 12px; }

        .item-date { font-size: 12px; color: var(--muted); }

        .rank-bar {
          flex: 1; height: 3px;
          background: var(--faint);
          border-radius: 2px; overflow: hidden;
        }

        .rank-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #5b4fff, #ff4f8b);
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        .top-badge-ribbon {
          position: absolute; top: -1px; right: 20px;
          background: #5b4fff; color: white;
          font-family: 'Syne', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 0 0 8px 8px;
        }

        /* Empty */
        .empty {
          text-align: center; padding: 64px 24px;
          background: var(--card); border: 1px dashed var(--line);
          border-radius: var(--radius);
        }

        .empty-icon { font-size: 3rem; margin-bottom: 12px; }
        .empty h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
        .empty p { font-size: 14px; color: var(--muted); }

        /* Toast */
        .toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
          background: var(--ink); color: white;
          padding: 12px 24px; border-radius: 100px;
          font-size: 14px; font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          opacity: 0; pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 1000; white-space: nowrap;
        }

        .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* Divider */
        .or-divider { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
        .or-divider span { font-size: 11px; color: var(--muted); }
        .or-divider::before, .or-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; padding: 48px 24px 40px; }
          .hero-stats { flex-direction: row; flex-wrap: wrap; }
          .stat-card { text-align: left; flex: 1; min-width: 120px; }
          .main-layout { grid-template-columns: 1fr; padding: 32px 24px; }
          .sidebar { position: static; }
        }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-noise" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-inner">
          <div>
            <div className="hero-label">
              <span />
              Public Roadmap
            </div>
            <h1 className="hero-title">
              What should we<br />
              build <span className="accent">next</span>
              <span className="accent2">?</span>
            </h1>
            <p className="hero-sub">
              Share your ideas, vote on what matters most, and help shape the future of this product.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-num">{feedbacks.length}</div>
              <div className="stat-label">Ideas submitted</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{totalVotes}</div>
              <div className="stat-label">Total votes cast</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout">

        {/* Sidebar — Submit Form */}
        <aside className="sidebar">
          <div className={`form-card ${focusForm ? 'focused' : ''}`}>
            <div className="form-header">
              <h2>💡 Submit an idea</h2>
              <p>Be specific — the more detail, the better.</p>
            </div>
            <div className="form-body">
              <div className="input-wrap">
                <label className="field-label">Title *</label>
                <input
                  placeholder="e.g. Add dark mode support"
                  value={title}
                  onChange={e => setTitle(e.target.value.slice(0, 100))}
                  onFocus={() => setFocusForm(true)}
                  onBlur={() => setFocusForm(false)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitFeedback()}
                />
                <div className="char-count">{title.length}/100</div>
              </div>
              <div className="input-wrap">
                <label className="field-label">Details <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                <textarea
                  placeholder="Why do you need this? What problem does it solve?"
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 500))}
                  onFocus={() => setFocusForm(true)}
                  onBlur={() => setFocusForm(false)}
                  rows={4}
                />
                <div className="char-count">{description.length}/500</div>
              </div>
              <button
                className="submit-btn"
                onClick={submitFeedback}
                disabled={loading || !title.trim()}
              >
                {loading ? 'Submitting...' : '→ Submit Idea'}
              </button>
              <p className="hint">Press Enter to submit quickly</p>
            </div>
          </div>

          <div className="guidelines">
            <h3>Guidelines</h3>
            <ul>
              <li>Search before posting duplicates</li>
              <li>Be specific about the problem</li>
              <li>One idea per submission</li>
              <li>Click ▲ again to undo your vote</li>
            </ul>
          </div>
        </aside>

        {/* Feed */}
        <div>
          <div className="feed-header">
            <h2>🔥 All Ideas</h2>
            <span className="sort-tag">Sorted by votes</span>
          </div>

          {feedbacks.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🚀</div>
              <h3>No ideas yet</h3>
              <p>Be the first to suggest something! Use the form on the left.</p>
            </div>
          )}

          {feedbacks.map((item, index) => {
            const hasVoted = voted.includes(item.id);
            const isTop = index === 0 && item.votes > 0;
            const isHot = item.votes >= 5;
            const isNew = !isTop && index < 3 && item.votes === 0;
            const maxVotes = feedbacks[0]?.votes || 1;
            const barWidth = Math.round((item.votes / maxVotes) * 100);

            return (
              <div
                key={item.id}
                className={`feedback-item ${isTop ? 'top-item' : ''}`}
              >
                {isTop && <div className="top-badge-ribbon">🏆 Top Idea</div>}

                {/* Vote button */}
                <div className="vote-col">
                  <button
                    className={`vote-btn ${hasVoted ? 'voted' : ''}`}
                    onClick={() => vote(item.id)}
                    title={hasVoted ? 'Click to remove your vote' : 'Upvote this idea'}
                  >
                    <span className="vote-arrow">▲</span>
                    <span className="vote-count">{item.votes}</span>
                  </button>
                  {hasVoted && <div className="undo-hint">tap to undo</div>}
                </div>

                {/* Content */}
                <div className="item-content">
                  <div className="item-top">
                    <span className="item-title">{item.title}</span>
                    {isTop && <span className="badge badge-top">👑 Top</span>}
                    {isHot && !isTop && <span className="badge badge-hot">🔥 Hot</span>}
                    {isNew && <span className="badge badge-new">✨ New</span>}
                  </div>
                  {item.description && (
                    <p className="item-desc">{item.description}</p>
                  )}
                  <div className="item-meta">
                    <span className="item-date">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {item.votes > 0 && (
                      <div className="rank-bar">
                        <div className="rank-fill" style={{ width: `${barWidth}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}