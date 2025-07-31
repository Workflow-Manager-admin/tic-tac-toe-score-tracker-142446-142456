'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';
import { COLORS } from '@/utils/style';
import styles from './GameBoard.module.css';

interface Game {
  id: string;
  board: string[];
  status: 'waiting' | 'active' | 'won' | 'draw';
  next_turn: string;
  winner: string | null;
  player_x: string;
  player_o: string;
  moves: { index: number; symbol: string }[];
  created_at: string;
}

export default function GameBoard({
  selectedGameId,
}: { selectedGameId: string | null }) {
  const [game, setGame] = useState<Game | null>(null);
  const [mySymbol, setMySymbol] = useState<'X' | 'O' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGameId) return;
    setLoading(true);
    apiFetch<Game>(`/games/${selectedGameId}`)
      .then(data => {
        setGame(data);
        // Simpler determination for demo; actual may come from backend
        setMySymbol(data.player_x === window.localStorage.getItem('username') ? 'X' : 'O');
      })
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [selectedGameId]);

  async function handleMove(idx: number) {
    if (!game || game.board[idx] !== '' || game.status !== 'active') return;
    setLoading(true);
    setError(null);
    try {
      const resp = await apiFetch<Game>(`/games/${game.id}/move`, {
        method: 'POST',
        body: JSON.stringify({ index: idx }),
      });
      setGame(resp);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
    setLoading(false);
  }

  if (!selectedGameId) {
    return <GameInitiator onJoin={gid => window.location.hash = gid} />;
  }
  if (loading && !game) return <div className={styles.statusMsg}>Loading board...</div>;
  if (!game) return <div className={styles.statusMsg}>Game not found</div>;

  return (
    <section style={{ width: 380, maxWidth: '98vw' }}>
      <div className={styles.boardWrapper}>
        <div className={styles.titleRow}>
          <span>Game vs <b>{mySymbol === 'X' ? game.player_o : game.player_x}</b></span>
          <span className={styles.status}>{statusLabel(game.status, game.winner)}</span>
        </div>
        <div className={styles.board}>
          {game.board.map((cell, idx) => (
            <button
              key={idx}
              className={styles.cell}
              onClick={() => handleMove(idx)}
              disabled={!!cell || game.status !== 'active'}
              aria-label={`Cell ${idx+1}`}
              style={{ color: cell === 'X' ? COLORS.primary : COLORS.accent, fontSize: 44 }}
            >
              {cell}
            </button>
          ))}
        </div>
        <div className={styles.infoRow}>
          {game.status === 'active' && (
            <span>
              Turn: {game.next_turn === mySymbol ? <b style={{ color: COLORS.primary }}>Your move</b> : 'Opponent'}
            </span>
          )}
          {game.status === 'won' && game.winner === mySymbol && (
            <b data-testid="win-msg" style={{ color: COLORS.accent }}>You win!</b>
          )}
          {game.status === 'won' && game.winner !== mySymbol && (
            <b data-testid="lose-msg" style={{ color: COLORS.error }}>You lose!</b>
          )}
          {game.status === 'draw' && <b style={{ color: COLORS.secondary }}>Draw</b>}
          {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
      </div>
    </section>
  );
}

function statusLabel(status: string, winner: string | null) {
  if (status === 'active') return 'In Progress';
  if (status === 'won') return `Done: ${winner ? winner : ''}`;
  if (status === 'draw') return 'Draw';
  if (status === 'waiting') return 'Waiting...';
  return status;
}

// Game creation/join form
function GameInitiator({ onJoin }: { onJoin: (gid: string) => void }) {
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joinId, setJoinId] = useState('');

  async function handleCreate() {
    setCreating(true);
    const g = await apiFetch<{ id: string }>('/games', { method: 'POST' });
    setCreating(false);
    onJoin(g.id);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinId) return;
    setJoining(true);
    try {
      await apiFetch(`/games/${joinId}/join`, { method: 'POST' });
      onJoin(joinId);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div style={{ marginTop: '2.4em', maxWidth: 340 }}>
      <form onSubmit={handleJoin} style={{ display: 'flex', gap: 8, marginBottom: 21 }}>
        <input
          type="text"
          placeholder="Enter game ID to join"
          value={joinId}
          onChange={e => setJoinId(e.target.value)}
          style={{
            flex: 1,
            padding: '0.65em 0.8em',
            borderRadius: 7,
            border: `1.5px solid ${COLORS.secondary}`,
            background: COLORS.surface,
            color: COLORS.text,
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          disabled={joining || !joinId}
          style={{
            padding: '0.6em 1.1em',
            background: COLORS.primary,
            color: COLORS.accent,
            border: 'none',
            borderRadius: 7,
            fontWeight: 'bold',
            cursor: joining ? 'not-allowed' : 'pointer',
          }}
        >
          Join
        </button>
      </form>
      <hr style={{ borderColor: COLORS.secondary, opacity: 0.18, marginBottom: 18 }} />
      <button
        onClick={handleCreate}
        disabled={creating}
        style={{
          width: '100%',
          padding: '0.73em 1em',
          background: COLORS.primary,
          color: COLORS.accent,
          border: 'none',
          borderRadius: 7,
          fontWeight: 'bold',
          fontSize: 16,
          cursor: creating ? 'not-allowed' : 'pointer',
        }}
      >
        {creating ? 'Creating...' : 'Start New Game'}
      </button>
    </div>
  );
}
