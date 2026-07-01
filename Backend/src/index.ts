import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint 1: Get all countries and their current win percentages
app.get('/api/teams', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select(`
        id,
        name,
        code,
        group_letter,
        predictions ( win_percentage )
      `);

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint 2: Get fixtures (previous/next matches) for a specific country
app.get('/api/teams/:id/matches', async (req, res) => {
  const teamId = req.params.id;
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order('match_date', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});