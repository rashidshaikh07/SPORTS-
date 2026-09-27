/**
 * CricSphere - Supabase Configuration & Data Abstraction Layer
 * Handles communication with Supabase backend with seamless fallback to localStorage
 */

const SUPABASE_URL = "https://mdgyqpfgirmbdgjvulif.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZ3lxcGZnaXJtYmRnanZ1bGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0ODkzNDQsImV4cCI6MjEwNjA2NTM0NH0.2kC3KFVjlRp50uRvenLO9TM0Z_vvxA3XUkSIm2dy_Kc";

// Initialize Supabase client if library is available
let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("⚡ Supabase Client initialized successfully.");
  } catch (err) {
    console.warn("⚠️ Failed to initialize Supabase client:", err);
  }
}

// Initial Rich Demo Seed Data for instant out-of-the-box experience
const INITIAL_DATA = {
  teams: [
    {
      id: "b1010000-0000-0000-0000-000000000001",
      name: "Royal Strikers",
      short_name: "RS",
      logo_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80",
      captain: "Virat Sharma",
      coach: "Ricky Ponting",
      home_ground: "Royal Eden Gardens, Kolkata",
      trophies: 3
    },
    {
      id: "b1010000-0000-0000-0000-000000000002",
      name: "Thunder Titans",
      short_name: "TT",
      logo_url: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80",
      captain: "Rohit Khan",
      coach: "Brendon McCullum",
      home_ground: "Thunder Dome Stadium, Mumbai",
      trophies: 4
    },
    {
      id: "b1010000-0000-0000-0000-000000000003",
      name: "Desert Warriors",
      short_name: "DW",
      logo_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80",
      captain: "Babar Azam",
      coach: "Gary Kirsten",
      home_ground: "Oasis International Arena, Dubai",
      trophies: 2
    },
    {
      id: "b1010000-0000-0000-0000-000000000004",
      name: "Falcon Kings",
      short_name: "FK",
      logo_url: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=200&auto=format&fit=crop&q=80",
      captain: "Ben Stokes",
      coach: "Trevor Bayliss",
      home_ground: "Highland Cricket Ground, London",
      trophies: 1
    }
  ],
  players: [
    {
      id: "p1",
      team_id: "b1010000-0000-0000-0000-000000000001",
      name: "Virat Sharma",
      role: "Batsman",
      batting_style: "Right-hand bat",
      bowling_style: "Right-arm medium",
      jersey_number: 18,
      matches_played: 142,
      runs: 6240,
      wickets: 4,
      highest_score: "122*",
      strike_rate: 144.50,
      batting_average: 52.80,
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p2",
      team_id: "b1010000-0000-0000-0000-000000000002",
      name: "Rohit Khan",
      role: "Batsman",
      batting_style: "Right-hand bat",
      bowling_style: "Right-arm offbreak",
      jersey_number: 45,
      matches_played: 138,
      runs: 5490,
      wickets: 8,
      highest_score: "118",
      strike_rate: 139.80,
      batting_average: 44.20,
      photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p3",
      team_id: "b1010000-0000-0000-0000-000000000003",
      name: "Shaheen Afridi",
      role: "Bowler",
      batting_style: "Left-hand bat",
      bowling_style: "Left-arm fast",
      jersey_number: 10,
      matches_played: 88,
      runs: 420,
      wickets: 168,
      highest_score: "34*",
      strike_rate: 122.00,
      batting_average: 15.50,
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p4",
      team_id: "b1010000-0000-0000-0000-000000000004",
      name: "Ben Stokes",
      role: "All-Rounder",
      batting_style: "Left-hand bat",
      bowling_style: "Right-arm fast-medium",
      jersey_number: 55,
      matches_played: 110,
      runs: 3850,
      wickets: 112,
      highest_score: "135*",
      strike_rate: 142.10,
      batting_average: 39.40,
      photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p5",
      team_id: "b1010000-0000-0000-0000-000000000001",
      name: "Rashid Khan",
      role: "Bowler",
      batting_style: "Right-hand bat",
      bowling_style: "Right-arm legbreak",
      jersey_number: 19,
      matches_played: 115,
      runs: 890,
      wickets: 185,
      highest_score: "44",
      strike_rate: 154.20,
      batting_average: 18.20,
      photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p6",
      team_id: "b1010000-0000-0000-0000-000000000002",
      name: "Jos Buttler",
      role: "Wicket-Keeper",
      batting_style: "Right-hand bat",
      bowling_style: "None",
      jersey_number: 63,
      matches_played: 126,
      runs: 4480,
      wickets: 0,
      highest_score: "124",
      strike_rate: 151.70,
      batting_average: 43.10,
      photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p7",
      team_id: "b1010000-0000-0000-0000-000000000002",
      name: "Jasprit Bumrah",
      role: "Bowler",
      batting_style: "Right-hand bat",
      bowling_style: "Right-arm fast",
      jersey_number: 93,
      matches_played: 98,
      runs: 210,
      wickets: 174,
      highest_score: "16*",
      strike_rate: 98.40,
      batting_average: 9.80,
      photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: "p8",
      team_id: "b1010000-0000-0000-0000-000000000003",
      name: "Babar Azam",
      role: "Batsman",
      batting_style: "Right-hand bat",
      bowling_style: "Right-arm offbreak",
      jersey_number: 56,
      matches_played: 120,
      runs: 5100,
      wickets: 0,
      highest_score: "122",
      strike_rate: 133.50,
      batting_average: 48.60,
      photo_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
    }
  ],
  matches: [
    {
      id: "m1",
      title: "PCL Championship Semi-Final 1",
      tournament: "Premier Cricket League",
      format: "T20",
      team1_name: "Royal Strikers",
      team1_short: "RS",
      team1_logo: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80",
      team1_score: "186/4",
      team1_overs: "17.2",
      team2_name: "Thunder Titans",
      team2_short: "TT",
      team2_logo: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80",
      team2_score: "178/7",
      team2_overs: "20.0",
      status: "live",
      venue: "Royal Eden Gardens, Kolkata",
      result_summary: "Royal Strikers need 9 runs in 16 balls to reach the Grand Final",
      current_batting_team: "Royal Strikers",
      current_batsman: "Virat Sharma (78* off 46)",
      current_bowler: "Shaheen Afridi (2/34)",
      crr: 10.73,
      rrr: 3.38,
      match_date: new Date().toISOString()
    },
    {
      id: "m2",
      title: "Global T20 Derby Clash",
      tournament: "Global T20 Trophy",
      format: "T20",
      team1_name: "Desert Warriors",
      team1_short: "DW",
      team1_logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80",
      team1_score: "0/0",
      team1_overs: "0.0",
      team2_name: "Falcon Kings",
      team2_short: "FK",
      team2_logo: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=200&auto=format&fit=crop&q=80",
      team2_score: "0/0",
      team2_overs: "0.0",
      status: "upcoming",
      venue: "Oasis International Arena, Dubai",
      result_summary: "Match starts at 07:30 PM Local Time",
      current_batting_team: "",
      current_batsman: "",
      current_bowler: "",
      crr: 0.0,
      rrr: 0.0,
      match_date: new Date(Date.now() + 86400000).toISOString()
    },
    {
      id: "m3",
      title: "Super League Rivalry Match",
      tournament: "Premier Cricket League",
      format: "T20",
      team1_name: "Thunder Titans",
      team1_short: "TT",
      team1_logo: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200&auto=format&fit=crop&q=80",
      team1_score: "214/5",
      team1_overs: "20.0",
      team2_name: "Desert Warriors",
      team2_short: "DW",
      team2_logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80",
      team2_score: "192/9",
      team2_overs: "20.0",
      status: "completed",
      venue: "Thunder Dome Stadium, Mumbai",
      result_summary: "Thunder Titans won by 22 runs (Player of Match: Rohit Khan 89)",
      current_batting_team: "",
      current_batsman: "",
      current_bowler: "",
      crr: 10.70,
      rrr: 0.0,
      match_date: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  products: [
    {
      id: "prod-1",
      name: "Pro English Willow Bat - Grade 1 Elite",
      category: "Bats",
      price: 299.99,
      discount_price: 249.99,
      stock: 15,
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=500&auto=format&fit=crop&q=80",
      description: "Handcrafted from hand-selected Grade 1 English Willow. Huge sweet spot, exceptional pickup, dynamic balance, and explosive ping.",
      is_featured: true
    },
    {
      id: "prod-2",
      name: "Match Grade Leather Cricket Balls (Pack of 6)",
      category: "Balls",
      price: 89.99,
      discount_price: 74.99,
      stock: 45,
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80",
      description: "Official 4-piece alum-tanned leather balls. Prominent hand-stitched seam, long-lasting shape retention, and supreme swing in all conditions.",
      is_featured: true
    },
    {
      id: "prod-3",
      name: "Pro-Shield Titanium Batting Helmet",
      category: "Protective",
      price: 129.99,
      discount_price: 109.99,
      stock: 20,
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=500&auto=format&fit=crop&q=80",
      description: "High-impact composite outer shell with ultralight titanium face grille and aerodynamic cooling channels. Fully certified to ICC standards.",
      is_featured: true
    },
    {
      id: "prod-4",
      name: "Ultra-Light Pro Batting Legguards (Pads)",
      category: "Protective",
      price: 119.99,
      discount_price: 94.99,
      stock: 18,
      rating: 4.7,
      image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80",
      description: "High-density contoured lightweight foam with 3-piece ergonomic knee roll for pro-level impact protection and effortless running between wickets.",
      is_featured: true
    },
    {
      id: "prod-5",
      name: "Official Pro League Dry-Fit Team Jersey",
      category: "Apparel",
      price: 59.99,
      discount_price: 49.99,
      stock: 60,
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80",
      description: "Breathable moisture-wicking aerodynamic athletic jersey with sublimated franchise graphics, antimicrobial mesh, and stretch comfort.",
      is_featured: true
    },
    {
      id: "prod-6",
      name: "All-Rounder Cricket Spikes Performance Shoes",
      category: "Footwear",
      price: 139.99,
      discount_price: 119.99,
      stock: 25,
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
      description: "Reinforced toe protection, shock-absorbing dual-density EVA midsole, and interchangeable metal spikes for high-traction grip on turf pitches.",
      is_featured: true
    },
    {
      id: "prod-7",
      name: "Elite Players Wheelie Cricket Kitbag",
      category: "Protective",
      price: 149.99,
      discount_price: 129.99,
      stock: 12,
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
      description: "Heavy-duty 1680D water-resistant cordura nylon with dual bat vaults, ventilated shoe compartment, and heavy-duty tractor wheels.",
      is_featured: false
    },
    {
      id: "prod-8",
      name: "Pro Leather Shark-Tooth Batting Gloves",
      category: "Protective",
      price: 69.99,
      discount_price: 54.99,
      stock: 32,
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80",
      description: "Pittards premium sheepskin palm, multi-flex finger casing, high-density fibre inserts on leading fingers, and side impact bar.",
      is_featured: false
    }
  ],
  inquiries: [
    {
      id: "inq-1",
      name: "David Miller",
      email: "david@example.com",
      phone: "+1 (800) 555-0199",
      subject: "Academy Coaching Enrollment",
      message: "Looking to enroll my 14-year-old son in the fast bowling summer camp.",
      status: "new",
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  orders: [
    {
      id: "ord-1",
      customer_name: "Hamza Sheikh",
      customer_email: "hamza@example.com",
      customer_phone: "+92 (300) 987-6543",
      delivery_address: "Apartment 4B, Gulberg Greens, Lahore",
      items: [
        { id: "prod-1", name: "Pro English Willow Bat - Grade 1 Elite", price: 249.99, quantity: 1 },
        { id: "prod-2", name: "Match Grade Leather Cricket Balls (Pack of 6)", price: 74.99, quantity: 2 }
      ],
      total_amount: 399.97,
      payment_method: "Cash on Delivery",
      status: "confirmed",
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]
};

// Initialize LocalStorage with seed data if not present
function initializeLocalStore() {
  if (typeof localStorage === 'undefined') return;
  for (const [key, val] of Object.entries(INITIAL_DATA)) {
    if (!localStorage.getItem(`cric_${key}`)) {
      localStorage.setItem(`cric_${key}`, JSON.stringify(val));
    }
  }
}
initializeLocalStore();

// LocalStorage Helper
const LocalDB = {
  get(collection) {
    try {
      const data = localStorage.getItem(`cric_${collection}`);
      return data ? JSON.parse(data) : (INITIAL_DATA[collection] || []);
    } catch (e) {
      return INITIAL_DATA[collection] || [];
    }
  },
  set(collection, items) {
    try {
      localStorage.setItem(`cric_${collection}`, JSON.stringify(items));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  },
  insert(collection, item) {
    const list = this.get(collection);
    const newItem = {
      id: item.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...item
    };
    list.unshift(newItem);
    this.set(collection, list);
    return newItem;
  },
  update(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.set(collection, list);
      return list[index];
    }
    return null;
  },
  delete(collection, id) {
    let list = this.get(collection);
    list = list.filter(i => i.id !== id);
    this.set(collection, list);
    return true;
  }
};

// Main CricDB Object that talks to Supabase with automatic graceful fallback
const CricDB = {
  // Test connection to Supabase
  async testConnection() {
    if (!supabaseClient) {
      return { connected: false, message: "Supabase client not loaded, using local storage mode." };
    }
    try {
      const { data, error } = await supabaseClient.from('teams').select('count', { count: 'exact', head: true });
      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('not find')) {
          return { 
            connected: true, 
            tablesCreated: false, 
            message: "Connected to Supabase! Database tables need to be created using schema.sql." 
          };
        }
        return { connected: false, message: error.message };
      }
      return { connected: true, tablesCreated: true, message: "Connected to Supabase with live tables active!" };
    } catch (err) {
      return { connected: false, message: err.message };
    }
  },

  // TEAMS
  async getTeams() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('teams').select('*').order('trophies', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn("Supabase teams fetch failed, falling back to local data:", err);
      }
    }
    return LocalDB.get('teams');
  },

  async createTeam(teamData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('teams').insert([teamData]).select().single();
        if (!error && data) {
          LocalDB.insert('teams', data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase createTeam error:", err);
      }
    }
    return LocalDB.insert('teams', teamData);
  },

  async updateTeam(id, teamData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('teams').update(teamData).eq('id', id).select().single();
        if (!error && data) {
          LocalDB.update('teams', id, data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase updateTeam error:", err);
      }
    }
    return LocalDB.update('teams', id, teamData);
  },

  async deleteTeam(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('teams').delete().eq('id', id);
      } catch (err) {
        console.warn("Supabase deleteTeam error:", err);
      }
    }
    return LocalDB.delete('teams', id);
  },

  // PLAYERS
  async getPlayers(filterTeam = null, filterRole = null) {
    let players = [];
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('players').select('*').order('runs', { ascending: false });
        if (filterTeam && filterTeam !== 'all') query = query.eq('team_id', filterTeam);
        if (filterRole && filterRole !== 'all') query = query.eq('role', filterRole);
        const { data, error } = await query;
        if (!error && data && data.length > 0) players = data;
      } catch (err) {
        console.warn("Supabase getPlayers error:", err);
      }
    }
    if (!players || players.length === 0) {
      players = LocalDB.get('players');
      if (filterTeam && filterTeam !== 'all') {
        players = players.filter(p => p.team_id === filterTeam);
      }
      if (filterRole && filterRole !== 'all') {
        players = players.filter(p => p.role.toLowerCase() === filterRole.toLowerCase());
      }
    }
    return players;
  },

  async createPlayer(playerData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('players').insert([playerData]).select().single();
        if (!error && data) {
          LocalDB.insert('players', data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase createPlayer error:", err);
      }
    }
    return LocalDB.insert('players', playerData);
  },

  async updatePlayer(id, playerData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('players').update(playerData).eq('id', id).select().single();
        if (!error && data) {
          LocalDB.update('players', id, data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase updatePlayer error:", err);
      }
    }
    return LocalDB.update('players', id, playerData);
  },

  async deletePlayer(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('players').delete().eq('id', id);
      } catch (err) {
        console.warn("Supabase deletePlayer error:", err);
      }
    }
    return LocalDB.delete('players', id);
  },

  // MATCHES
  async getMatches(filterStatus = null) {
    let matches = [];
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('matches').select('*').order('created_at', { ascending: false });
        if (filterStatus && filterStatus !== 'all') {
          query = query.eq('status', filterStatus);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) matches = data;
      } catch (err) {
        console.warn("Supabase getMatches error:", err);
      }
    }
    if (!matches || matches.length === 0) {
      matches = LocalDB.get('matches');
      if (filterStatus && filterStatus !== 'all') {
        matches = matches.filter(m => m.status === filterStatus);
      }
    }
    return matches;
  },

  async getLiveMatches() {
    return this.getMatches('live');
  },

  async createMatch(matchData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('matches').insert([matchData]).select().single();
        if (!error && data) {
          LocalDB.insert('matches', data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase createMatch error:", err);
      }
    }
    return LocalDB.insert('matches', matchData);
  },

  async updateMatch(id, matchData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('matches').update(matchData).eq('id', id).select().single();
        if (!error && data) {
          LocalDB.update('matches', id, data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase updateMatch error:", err);
      }
    }
    return LocalDB.update('matches', id, matchData);
  },

  async deleteMatch(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('matches').delete().eq('id', id);
      } catch (err) {
        console.warn("Supabase deleteMatch error:", err);
      }
    }
    return LocalDB.delete('matches', id);
  },

  async updateLiveScore(id, scoreData) {
    return this.updateMatch(id, scoreData);
  },

  // PRODUCTS
  async getProducts(category = null, search = null) {
    let products = [];
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('products').select('*').order('price', { ascending: false });
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        if (search) {
          query = query.ilike('name', `%${search}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) products = data;
      } catch (err) {
        console.warn("Supabase getProducts error:", err);
      }
    }
    if (!products || products.length === 0) {
      products = LocalDB.get('products');
      if (category && category !== 'All') {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
    }
    return products;
  },

  async createProduct(productData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('products').insert([productData]).select().single();
        if (!error && data) {
          LocalDB.insert('products', data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase createProduct error:", err);
      }
    }
    return LocalDB.insert('products', productData);
  },

  async updateProduct(id, productData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('products').update(productData).eq('id', id).select().single();
        if (!error && data) {
          LocalDB.update('products', id, data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase updateProduct error:", err);
      }
    }
    return LocalDB.update('products', id, productData);
  },

  async deleteProduct(id) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn("Supabase deleteProduct error:", err);
      }
    }
    return LocalDB.delete('products', id);
  },

  // INQUIRIES & CONTACT
  async saveInquiry(inquiryData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('inquiries').insert([inquiryData]).select().single();
        if (!error && data) {
          LocalDB.insert('inquiries', data);
          return { success: true, data };
        }
      } catch (err) {
        console.warn("Supabase saveInquiry error:", err);
      }
    }
    const item = LocalDB.insert('inquiries', inquiryData);
    return { success: true, data: item };
  },

  async getInquiries() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase getInquiries error:", err);
      }
    }
    return LocalDB.get('inquiries');
  },

  async updateInquiryStatus(id, status) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('inquiries').update({ status }).eq('id', id);
      } catch (err) {}
    }
    return LocalDB.update('inquiries', id, { status });
  },

  // ORDERS
  async saveOrder(orderData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('orders').insert([orderData]).select().single();
        if (!error && data) {
          LocalDB.insert('orders', data);
          return { success: true, data };
        }
      } catch (err) {
        console.warn("Supabase saveOrder error:", err);
      }
    }
    const order = LocalDB.insert('orders', orderData);
    return { success: true, data: order };
  },

  async getOrders() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase getOrders error:", err);
      }
    }
    return LocalDB.get('orders');
  },

  async updateOrderStatus(id, status) {
    if (supabaseClient) {
      try {
        await supabaseClient.from('orders').update({ status }).eq('id', id);
      } catch (err) {}
    }
    return LocalDB.update('orders', id, { status });
  }
};

// Export to window
window.CricDB = CricDB;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
