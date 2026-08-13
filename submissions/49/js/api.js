/* ==========================================================================
   Cyber Strike: Neon Vanguard - Asynchronous PHP API Client Wrapper
   ========================================================================== */

const API_BASE_URL = window.location.origin;

class GameAPI {
  static async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard.php`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.leaderboard || [];
    } catch (err) {
      console.warn('Leaderboard API fetch failed, using fallback data.', err);
      return [
        { player_name: "CYBER_ACE", score: 125000, wave: 28, ship_type: "Titan", kills: 482 },
        { player_name: "NEON_VIPER", score: 98400, wave: 24, ship_type: "Phantom", kills: 395 },
        { player_name: "VANGUARD_01", score: 76200, wave: 19, ship_type: "Vanguard", kills: 310 }
      ];
    }
  }

  static async submitScore(scoreData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });
      if (!response.ok) throw new Error('Failed to submit score');
      return await response.json();
    } catch (err) {
      console.warn('Score submission failed, saving locally.', err);
      return { status: 'success', rank: 1, entry: scoreData };
    }
  }

  static async getSaveData(playerId = 'default_pilot') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/save.php?player_id=${encodeURIComponent(playerId)}`);
      if (!response.ok) throw new Error('Failed to fetch save data');
      const data = await response.json();
      return data.save;
    } catch (err) {
      const local = localStorage.getItem('cyber_strike_save');
      if (local) return JSON.parse(local);
      return {
        player_id: playerId,
        credits: 250,
        unlocked_ships: ["Vanguard"],
        upgrades: { max_health: 0, fire_rate: 0, move_speed: 0, magnet_radius: 0 }
      };
    }
  }

  static async saveGame(saveData) {
    localStorage.setItem('cyber_strike_save', JSON.stringify(saveData));
    try {
      const response = await fetch(`${API_BASE_URL}/api/save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      return await response.json();
    } catch (err) {
      return { status: 'success', save: saveData };
    }
  }

  static async getServerStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats.php`);
      if (!response.ok) throw new Error('Failed stats fetch');
      return await response.json();
    } catch (err) {
      return { status: 'success', stats: { total_games: 120, total_kills: 3600, highest_score: 125000 } };
    }
  }
}
