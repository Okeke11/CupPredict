import { useEffect, useState } from 'react';

interface Team {
  id: number;
  name: string;
  code: string;
  group_letter: string;
  predictions: { win_percentage: number }[];
}

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/teams')
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  if (loading) return <p>Loading World Cup Standings...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🏆 CupPredict Live Dashboard</h1>
      <p>Real-time tournament projections dynamically adjusted by our math engine.</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {teams.map((team) => (
          <div key={team.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{team.name} ({team.code})</h3>
            <p style={{ margin: 0 }}>Group {team.group_letter}</p>
            <strong style={{ fontSize: '1.2rem' }}>
              Win Probability: {team.predictions?.[0]?.win_percentage ?? 0}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;