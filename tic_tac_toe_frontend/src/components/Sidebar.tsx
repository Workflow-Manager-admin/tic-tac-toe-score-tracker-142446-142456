'use client';

import { COLORS } from '@/utils/style';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';
import styles from './Sidebar.module.css';

interface Player {
  username: string;
  score: number;
}

interface GameHistoryItem {
  id: string;
  opponent: string;
  result: string;
  played_at: string;
}

export function Sidebar({
  onSelectGame,
  selectedGameId,
}: {
  onSelectGame: (gameId: string) => void;
  selectedGameId: string | null;
}) {
  const [leaders, setLeaders] = useState<Player[]>([]);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    apiFetch<Player[]>('/leaderboard').then(setLeaders).catch(() => setLeaders([]));
    apiFetch<GameHistoryItem[]>('/games/history').then(setHistory).catch(() => setHistory([]));
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.leaderboard}>
        <h2 className={styles.sectionTitle}>🏆 Leaderboard</h2>
        <ol>
          {leaders.map((p, idx) => (
            <li key={p.username} className={styles.leaderItem}>
              <span className={styles.rank}>{idx + 1}.</span>
              <span className={styles.username}>{p.username}</span>
              <span className={styles.score}>{p.score}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.history}>
        <h2 className={styles.sectionTitle}>🕑 Game History</h2>
        <ul>
          {history.length === 0 && <li>No games yet.</li>}
          {history.map(item => (
            <li
              key={item.id}
              className={`${styles.historyItem} ${item.id === selectedGameId ? styles.selected : ''}`}
              tabIndex={0}
              onClick={() => onSelectGame(item.id)}
              aria-current={item.id === selectedGameId ? 'true' : 'false'}
            >
              <div>
                <span>{item.opponent}</span>
                {' - '}
                <strong>{item.result}</strong>
              </div>
              <div className={styles.playedAt}>{new Date(item.played_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// Card generic
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${styles.card} ${className ? className : ''}`}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: 18,
        boxShadow: '0 2px 12px #0002',
      }}
    >
      {children}
    </div>
  );
}
