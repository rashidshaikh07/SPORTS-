/**
 * CricSphere - Admin Panel Management Script
 * Handles authentication, metrics, real-time score updates, CRUD for matches, teams, players, products, orders, and inquiries
 */

const ADMIN_PIN = "1234";

document.addEventListener("DOMContentLoaded", () => {
  initAdminAuth();
});

function initAdminAuth() {
  const isAuth = sessionStorage.getItem("cric_admin_authenticated");
  const authSection = document.querySelector("#admin-auth-view");
  const dashboardSection = document.querySelector("#admin-dashboard-view");

  if (!authSection || !dashboardSection) return;

  if (isAuth === "true") {
    authSection.style.display = "none";
    dashboardSection.style.display = "block";
    loadDashboard();
  } else {
    authSection.style.display = "flex";
    dashboardSection.style.display = "none";
  }

  const pinForm = document.querySelector("#admin-pin-form");
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredPin = e.target.pin.value;
      if (enteredPin === ADMIN_PIN) {
        sessionStorage.setItem("cric_admin_authenticated", "true");
        authSection.style.display = "none";
        dashboardSection.style.display = "block";
        window.showToast("Welcome to CricSphere Admin Panel!", "gold");
        loadDashboard();
      } else {
        window.showToast("Incorrect Admin PIN! (Default: 1234)", "error");
      }
    });
  }

  const logoutBtn = document.querySelector("#admin-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("cric_admin_authenticated");
      location.reload();
    });
  }
}

async function loadDashboard() {
  bindAdminTabs();
  await refreshMetrics();
  await checkDatabaseHealth();
  await renderMatchesTable();
  await renderTeamsTable();
  await renderPlayersTable();
  await renderProductsTable();
  await renderInquiriesTable();
  await renderOrdersTable();
}

function bindAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetView = tab.dataset.view;
      document.querySelectorAll(".admin-view-panel").forEach(panel => {
        panel.style.display = panel.id === targetView ? "block" : "none";
      });
    });
  });
}

async function refreshMetrics() {
  try {
    const [matches, teams, players, products, inquiries, orders] = await Promise.all([
      window.CricDB.getMatches(),
      window.CricDB.getTeams(),
      window.CricDB.getPlayers(),
      window.CricDB.getProducts(),
      window.CricDB.getInquiries(),
      window.CricDB.getOrders()
    ]);

    const liveMatches = (matches || []).filter(m => m.status === 'live').length;

    document.querySelector("#metric-matches").textContent = `${liveMatches} Live / ${matches.length} Total`;
    document.querySelector("#metric-teams").textContent = teams.length;
    document.querySelector("#metric-players").textContent = players.length;
    document.querySelector("#metric-products").textContent = products.length;
    document.querySelector("#metric-inquiries").textContent = inquiries.length;
    document.querySelector("#metric-orders").textContent = orders.length;
  } catch (err) {
    console.warn("Metrics error:", err);
  }
}

async function checkDatabaseHealth() {
  const statusEl = document.querySelector("#db-status-badge");
  const messageEl = document.querySelector("#db-status-message");
  if (!statusEl) return;

  statusEl.textContent = "Checking...";
  statusEl.className = "badge badge-upcoming";

  const res = await window.CricDB.testConnection();
  if (res.connected && res.tablesCreated) {
    statusEl.textContent = "CONNECTED (SUPABASE TABLES ACTIVE)";
    statusEl.className = "badge badge-live";
    if (messageEl) messageEl.textContent = "Supabase PostgreSQL connected. All tables synchronized.";
  } else if (res.connected && !res.tablesCreated) {
    statusEl.textContent = "CONNECTED (TABLES PENDING SQL)";
    statusEl.className = "badge badge-upcoming";
    if (messageEl) messageEl.innerHTML = `Connected to project <code>mdgyqpfgirmbdgjvulif</code>. Please run <code>schema.sql</code> in your Supabase SQL editor. Using local storage mode in the meantime.`;
  } else {
    statusEl.textContent = "LOCAL HYBRID MODE";
    statusEl.className = "badge badge-upcoming";
    if (messageEl) messageEl.textContent = `Operating in local resilient mode: ${res.message}`;
  }
}

/* ============================================================
   MATCHES MANAGEMENT
   ============================================================ */
async function renderMatchesTable() {
  const tbody = document.querySelector("#admin-matches-tbody");
  if (!tbody) return;

  const matches = await window.CricDB.getMatches();
  if (!matches || matches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim);">No matches scheduled.</td></tr>`;
    return;
  }

  tbody.innerHTML = matches.map(m => `
    <tr>
      <td><strong>${m.title}</strong><br><small style="color: var(--text-dim);">${m.tournament} (${m.format})</small></td>
      <td>${m.team1_name} vs ${m.team2_name}</td>
      <td>
        <span class="badge ${m.status === 'live' ? 'badge-live' : m.status === 'upcoming' ? 'badge-upcoming' : 'badge-completed'}">
          ${m.status.toUpperCase()}
        </span>
      </td>
      <td>
        <div>${m.team1_short}: ${m.team1_score} (${m.team1_overs})</div>
        <div>${m.team2_short}: ${m.team2_score} (${m.team2_overs})</div>
      </td>
      <td>${m.result_summary || 'In progress / Scheduled'}</td>
      <td>
        <div class="action-btn-group">
          <button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;" onclick="openScoreEditor('${m.id}')" title="Live Score Updater">⚡ Update Score</button>
          <button class="btn-icon delete" onclick="deleteMatchHandler('${m.id}')" title="Delete Match">✕</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function openScoreEditor(matchId) {
  const matches = await window.CricDB.getMatches();
  const m = matches.find(item => item.id === matchId);
  if (!m) return;

  const modal = document.querySelector("#score-modal");
  const form = document.querySelector("#score-editor-form");
  if (!modal || !form) return;

  form.match_id.value = m.id;
  form.status.value = m.status;
  form.team1_score.value = m.team1_score || "0/0";
  form.team1_overs.value = m.team1_overs || "0.0";
  form.team2_score.value = m.team2_score || "0/0";
  form.team2_overs.value = m.team2_overs || "0.0";
  form.current_batting_team.value = m.current_batting_team || "";
  form.current_batsman.value = m.current_batsman || "";
  form.current_bowler.value = m.current_bowler || "";
  form.crr.value = m.crr || "0.00";
  form.rrr.value = m.rrr || "0.00";
  form.result_summary.value = m.result_summary || "";

  modal.classList.add("active");
}

async function handleScoreUpdateSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const matchId = form.match_id.value;

  const scoreData = {
    status: form.status.value,
    team1_score: form.team1_score.value,
    team1_overs: form.team1_overs.value,
    team2_score: form.team2_score.value,
    team2_overs: form.team2_overs.value,
    current_batting_team: form.current_batting_team.value,
    current_batsman: form.current_batsman.value,
    current_bowler: form.current_bowler.value,
    crr: parseFloat(form.crr.value) || 0,
    rrr: parseFloat(form.rrr.value) || 0,
    result_summary: form.result_summary.value
  };

  await window.CricDB.updateLiveScore(matchId, scoreData);
  window.showToast("⚡ Match score updated in real-time!", "gold");

  const modal = document.querySelector("#score-modal");
  if (modal) modal.classList.remove("active");

  await renderMatchesTable();
  await refreshMetrics();
}

async function handleCreateMatchSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const matchData = {
    title: form.title.value.trim(),
    tournament: form.tournament.value.trim(),
    format: form.format.value,
    team1_name: form.team1_name.value.trim(),
    team1_short: form.team1_short.value.trim(),
    team1_logo: form.team1_logo.value.trim() || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200",
    team2_name: form.team2_name.value.trim(),
    team2_short: form.team2_short.value.trim(),
    team2_logo: form.team2_logo.value.trim() || "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=200",
    venue: form.venue.value.trim(),
    status: form.status.value,
    team1_score: "0/0",
    team1_overs: "0.0",
    team2_score: "0/0",
    team2_overs: "0.0",
    result_summary: form.result_summary.value.trim()
  };

  await window.CricDB.createMatch(matchData);
  window.showToast("Match fixture created successfully!", "gold");
  form.reset();

  const modal = document.querySelector("#add-match-modal");
  if (modal) modal.classList.remove("active");

  await renderMatchesTable();
  await refreshMetrics();
}

async function deleteMatchHandler(id) {
  if (confirm("Are you sure you want to remove this match?")) {
    await window.CricDB.deleteMatch(id);
    window.showToast("Match deleted.", "normal");
    await renderMatchesTable();
    await refreshMetrics();
  }
}

/* ============================================================
   TEAMS MANAGEMENT
   ============================================================ */
async function renderTeamsTable() {
  const tbody = document.querySelector("#admin-teams-tbody");
  if (!tbody) return;

  const teams = await window.CricDB.getTeams();
  if (!teams || teams.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No teams registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = teams.map(t => `
    <tr>
      <td><img src="${t.logo_url}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;"></td>
      <td><strong>${t.name}</strong> (${t.short_name})</td>
      <td>${t.captain || 'N/A'}</td>
      <td>${t.coach || 'N/A'}</td>
      <td>🏆 ${t.trophies || 0}</td>
      <td>
        <button class="btn-icon delete" onclick="deleteTeamHandler('${t.id}')" title="Delete Team">✕</button>
      </td>
    </tr>
  `).join("");
}

async function handleCreateTeamSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const teamData = {
    name: form.name.value.trim(),
    short_name: form.short_name.value.trim().toUpperCase(),
    captain: form.captain.value.trim(),
    coach: form.coach.value.trim(),
    home_ground: form.home_ground.value.trim(),
    trophies: parseInt(form.trophies.value) || 0,
    logo_url: form.logo_url.value.trim() || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200"
  };

  await window.CricDB.createTeam(teamData);
  window.showToast("Team added to league!", "gold");
  form.reset();

  const modal = document.querySelector("#add-team-modal");
  if (modal) modal.classList.remove("active");

  await renderTeamsTable();
  await refreshMetrics();
}

async function deleteTeamHandler(id) {
  if (confirm("Delete this team franchise?")) {
    await window.CricDB.deleteTeam(id);
    window.showToast("Team removed.", "normal");
    await renderTeamsTable();
    await refreshMetrics();
  }
}

/* ============================================================
   PLAYERS MANAGEMENT
   ============================================================ */
async function renderPlayersTable() {
  const tbody = document.querySelector("#admin-players-tbody");
  if (!tbody) return;

  const players = await window.CricDB.getPlayers();
  if (!players || players.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim);">No players listed.</td></tr>`;
    return;
  }

  tbody.innerHTML = players.map(p => `
    <tr>
      <td><img src="${p.photo_url}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;"></td>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-role">${p.role}</span></td>
      <td>${p.runs || 0}</td>
      <td>${p.wickets || 0}</td>
      <td>SR: ${p.strike_rate || '0.0'} | Avg: ${p.batting_average || '0.0'}</td>
      <td>
        <button class="btn-icon delete" onclick="deletePlayerHandler('${p.id}')" title="Delete Player">✕</button>
      </td>
    </tr>
  `).join("");
}

async function handleCreatePlayerSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const playerData = {
    name: form.name.value.trim(),
    role: form.role.value,
    batting_style: form.batting_style.value,
    bowling_style: form.bowling_style.value,
    jersey_number: parseInt(form.jersey_number.value) || 0,
    matches_played: parseInt(form.matches_played.value) || 0,
    runs: parseInt(form.runs.value) || 0,
    wickets: parseInt(form.wickets.value) || 0,
    highest_score: form.highest_score.value || "0",
    strike_rate: parseFloat(form.strike_rate.value) || 0,
    batting_average: parseFloat(form.batting_average.value) || 0,
    photo_url: form.photo_url.value.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
  };

  await window.CricDB.createPlayer(playerData);
  window.showToast("Player added to roster!", "gold");
  form.reset();

  const modal = document.querySelector("#add-player-modal");
  if (modal) modal.classList.remove("active");

  await renderPlayersTable();
  await refreshMetrics();
}

async function deletePlayerHandler(id) {
  if (confirm("Delete this player?")) {
    await window.CricDB.deletePlayer(id);
    window.showToast("Player removed.", "normal");
    await renderPlayersTable();
    await refreshMetrics();
  }
}

/* ============================================================
   PRODUCTS MANAGEMENT
   ============================================================ */
async function renderProductsTable() {
  const tbody = document.querySelector("#admin-products-tbody");
  if (!tbody) return;

  const products = await window.CricDB.getProducts();
  if (!products || products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No store gear listed.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td><img src="${p.image_url}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;"></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>$${(p.discount_price || p.price).toFixed(2)}</td>
      <td>${p.stock || 0}</td>
      <td>
        <button class="btn-icon delete" onclick="deleteProductHandler('${p.id}')" title="Delete Product">✕</button>
      </td>
    </tr>
  `).join("");
}

async function handleCreateProductSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const productData = {
    name: form.name.value.trim(),
    category: form.category.value,
    price: parseFloat(form.price.value) || 0,
    discount_price: form.discount_price.value ? parseFloat(form.discount_price.value) : null,
    stock: parseInt(form.stock.value) || 0,
    rating: parseFloat(form.rating.value) || 4.8,
    description: form.description.value.trim(),
    image_url: form.image_url.value.trim() || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500"
  };

  await window.CricDB.createProduct(productData);
  window.showToast("Cricket gear added to shop!", "gold");
  form.reset();

  const modal = document.querySelector("#add-product-modal");
  if (modal) modal.classList.remove("active");

  await renderProductsTable();
  await refreshMetrics();
}

async function deleteProductHandler(id) {
  if (confirm("Remove this product from store?")) {
    await window.CricDB.deleteProduct(id);
    window.showToast("Product deleted.", "normal");
    await renderProductsTable();
    await refreshMetrics();
  }
}

/* ============================================================
   INQUIRIES & ORDERS
   ============================================================ */
async function renderInquiriesTable() {
  const tbody = document.querySelector("#admin-inquiries-tbody");
  if (!tbody) return;

  const inquiries = await window.CricDB.getInquiries();
  if (!inquiries || inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No customer inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(inq => `
    <tr>
      <td>${new Date(inq.created_at).toLocaleDateString()}</td>
      <td><strong>${inq.name}</strong><br><small><a href="tel:${inq.phone}" style="color: var(--gold-400);">${inq.phone}</a></small></td>
      <td>${inq.email}</td>
      <td><strong>${inq.subject || 'Inquiry'}</strong></td>
      <td><small style="color: var(--text-muted);">${inq.message}</small></td>
      <td>
        <select onchange="updateInquiryStatusHandler('${inq.id}', this.value)" class="form-control" style="padding: 4px 8px; font-size: 0.8rem;">
          <option value="new" ${inq.status === 'new' ? 'selected' : ''}>New</option>
          <option value="contacted" ${inq.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="resolved" ${inq.status === 'resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </td>
    </tr>
  `).join("");
}

async function updateInquiryStatusHandler(id, status) {
  await window.CricDB.updateInquiryStatus(id, status);
  window.showToast("Inquiry status updated.", "normal");
}

async function renderOrdersTable() {
  const tbody = document.querySelector("#admin-orders-tbody");
  if (!tbody) return;

  const orders = await window.CricDB.getOrders();
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No shop orders yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(ord => {
    const itemsSummary = (ord.items || []).map(i => `${i.name} (x${i.quantity})`).join(", ");

    return `
      <tr>
        <td>${new Date(ord.created_at).toLocaleDateString()}</td>
        <td><strong>${ord.customer_name}</strong><br><small><a href="tel:${ord.customer_phone}" style="color: var(--gold-400);">${ord.customer_phone}</a></small></td>
        <td><small>${ord.delivery_address}</small></td>
        <td><small style="color: var(--text-muted);">${itemsSummary}</small></td>
        <td><strong>$${Number(ord.total_amount).toFixed(2)}</strong></td>
        <td>
          <select onchange="updateOrderStatusHandler('${ord.id}', this.value)" class="form-control" style="padding: 4px 8px; font-size: 0.8rem;">
            <option value="pending" ${ord.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${ord.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="shipped" ${ord.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${ord.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

async function updateOrderStatusHandler(id, status) {
  await window.CricDB.updateOrderStatus(id, status);
  window.showToast("Order status updated.", "gold");
}

function copySchemaSql() {
  const sqlText = `-- CRICSPHERE SUPABASE SCHEMA\n-- Run in Supabase SQL Editor\n-- Visit schema.sql in workspace or copy from below\nSELECT 'Please copy content from schema.sql in your repository root';`;
  navigator.clipboard.writeText(sqlText);
  window.showToast("Schema SQL instruction copied! Paste in Supabase SQL Editor.", "gold");
}

// Global binds
window.openScoreEditor = openScoreEditor;
window.handleScoreUpdateSubmit = handleScoreUpdateSubmit;
window.handleCreateMatchSubmit = handleCreateMatchSubmit;
window.deleteMatchHandler = deleteMatchHandler;
window.handleCreateTeamSubmit = handleCreateTeamSubmit;
window.deleteTeamHandler = deleteTeamHandler;
window.handleCreatePlayerSubmit = handleCreatePlayerSubmit;
window.deletePlayerHandler = deletePlayerHandler;
window.handleCreateProductSubmit = handleCreateProductSubmit;
window.deleteProductHandler = deleteProductHandler;
window.updateInquiryStatusHandler = updateInquiryStatusHandler;
window.updateOrderStatusHandler = updateOrderStatusHandler;
window.checkDatabaseHealth = checkDatabaseHealth;
window.copySchemaSql = copySchemaSql;
