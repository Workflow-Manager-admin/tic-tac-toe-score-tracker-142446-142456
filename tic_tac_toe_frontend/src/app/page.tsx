'use client';

import GameBoard from '@/components/GameBoard';

export default function Home() {
  // Selected game is managed in layout to allow sidebar/game switching
  // If necessary: redirect to /auth if not authenticated
  return (
    <GameBoard selectedGameId={typeof window !== "undefined" && window.location.hash ? window.location.hash.slice(1) : null} />
  );
}
