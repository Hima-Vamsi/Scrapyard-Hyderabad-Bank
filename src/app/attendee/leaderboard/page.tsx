import React from 'react'
import Leaderboard from '@/components/attendee/Leaderboard'

const leaderboard = () => {
  const isLeaderboardEnabled = process.env.NEXT_PUBLIC_LEADERBOARD_ENABLED === 'true';

  return (
    <div>
      {isLeaderboardEnabled ? (
        <Leaderboard />
      ) : (
        <p>Leaderboard has not been enabled yet, please contact an organizer.</p>
      )}
    </div>
  )
}

export default leaderboard