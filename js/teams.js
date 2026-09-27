/**
 * CricSphere - Teams & Players Showcase Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#players-container") || document.querySelector("#teams-container") || document.querySelector("#home-players-grid")) {
    initTeamsAndPlayers();
  }
});

let selectedTeamId = "all";
let selectedPlayerRole = "all";

async function initTeamsAndPlayers() {
  await loadTeams();
  bindPlayerFilters();
  await loadPlayers();
}

async function loadTeams() {
  const teamsContainer = document.querySelector("#teams-container");
  const teamFilterContainer = document.querySelector("#team-filter-bar");

  try {
    const teams = await window.CricDB.getTeams();
    if (!teams || teams.length === 0) return;

    if (teamsContainer) {
      teamsContainer.innerHTML = teams.map(t => `
        <div class="team-card">
          <img src="${t.logo_url || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200'}" alt="${t.name}" class="team-card-logo" onerror="this.src='https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200'">
          <h3 class="team-card-title">${t.name} <span style="font-size: 0.85rem; color: var(--primary-400);">(${t.short_name})</span></h3>
          <div class="team-card-detail">👑 Captain: <strong>${t.captain || 'TBA'}</strong></div>
          <div class="team-card-detail">📋 Coach: <strong>${t.coach || 'TBA'}</strong></div>
          <div class="team-card-detail">🏟️ Ground: <strong>${t.home_ground || 'Arena'}</strong></div>
          <div class="team-card-trophies">
            🏆 ${t.trophies || 0} Championships Won
          </div>
        </div>
      `).join("");
    }

    if (teamFilterContainer) {
      teamFilterContainer.innerHTML = `
        <button class="filter-btn active" data-team="all">All Teams</button>
        ${teams.map(t => `<button class="filter-btn" data-team="${t.id}">${t.name}</button>`).join("")}
      `;

      teamFilterContainer.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          teamFilterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedTeamId = btn.dataset.team;
          loadPlayers();
        });
      });
    }
  } catch (err) {
    console.warn("Error loading teams:", err);
  }
}

function bindPlayerFilters() {
  const roleButtons = document.querySelectorAll(".player-role-filter");
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPlayerRole = btn.dataset.role;
      loadPlayers();
    });
  });
}

async function loadPlayers() {
  const container = document.querySelector("#players-container") || document.querySelector("#home-players-grid");
  if (!container) return;

  container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-dim);">Loading squad players...</div>`;

  try {
    const players = await window.CricDB.getPlayers(selectedTeamId, selectedPlayerRole);

    if (!players || players.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--card-bg); border-radius: var(--radius-md); border: 1px solid var(--card-border);">
          <p style="color: var(--text-muted);">No players found for the selected team/role criteria.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = players.map(p => `
      <div class="player-card" onclick="openPlayerModal('${p.id}')">
        <div class="player-img-wrap">
          <img src="${p.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}" alt="${p.name}" class="player-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'">
          ${p.jersey_number ? `<div class="player-jersey">#${p.jersey_number}</div>` : ''}
        </div>
        <div class="player-content">
          <div>
            <h3 class="player-name">${p.name}</h3>
            <span class="badge badge-role player-role-badge">${p.role}</span>
          </div>

          <div class="player-stats-mini">
            <div>
              <div class="mini-stat-val">${p.runs || 0}</div>
              <div class="mini-stat-lbl">Runs</div>
            </div>
            <div>
              <div class="mini-stat-val">${p.wickets || 0}</div>
              <div class="mini-stat-lbl">Wickets</div>
            </div>
            <div>
              <div class="mini-stat-val">${p.strike_rate || '0.0'}</div>
              <div class="mini-stat-lbl">S/R</div>
            </div>
          </div>

          <button class="btn btn-outline" style="width: 100%; font-size: 0.85rem; padding: 8px;">
            View Full Profile & Stats
          </button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error loading players:", err);
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--red-500);">Failed to load players.</div>`;
  }
}

async function openPlayerModal(playerId) {
  const modal = document.querySelector("#player-detail-modal");
  if (!modal) return;

  const players = await window.CricDB.getPlayers();
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  const modalBody = modal.querySelector(".player-modal-content");
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;">
      <img src="${player.photo_url}" alt="${player.name}" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-500);" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'">
      <div>
        <h2 style="font-size: 1.8rem; margin-bottom: 4px;">${player.name}</h2>
        <span class="badge badge-role" style="font-size: 0.85rem;">${player.role}</span>
        ${player.jersey_number ? `<span style="margin-left: 8px; color: var(--gold-400); font-weight: 800;">Jersey #${player.jersey_number}</span>` : ''}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: rgba(0,0,0,0.3); padding: 18px; border-radius: var(--radius-sm); margin-bottom: 20px;">
      <div>🏏 Batting Style: <strong>${player.batting_style || 'Right-hand bat'}</strong></div>
      <div>🎯 Bowling Style: <strong>${player.bowling_style || 'Right-arm medium'}</strong></div>
      <div>🏟️ Matches Played: <strong>${player.matches_played || 0}</strong></div>
      <div>⭐ Highest Score: <strong>${player.highest_score || '0'}</strong></div>
    </div>

    <h4 style="margin-bottom: 12px; color: var(--text-muted); text-transform: uppercase; font-size: 0.85rem;">Performance Statistics</h4>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; margin-bottom: 20px;">
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); padding: 12px; border-radius: var(--radius-sm);">
        <div style="font-size: 1.4rem; font-weight: 900; color: var(--gold-400);">${player.runs || 0}</div>
        <small style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Total Runs</small>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); padding: 12px; border-radius: var(--radius-sm);">
        <div style="font-size: 1.4rem; font-weight: 900; color: #fff;">${player.batting_average || '0.00'}</div>
        <small style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Average</small>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); padding: 12px; border-radius: var(--radius-sm);">
        <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary-400);">${player.strike_rate || '0.00'}</div>
        <small style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Strike Rate</small>
      </div>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); padding: 12px; border-radius: var(--radius-sm);">
        <div style="font-size: 1.4rem; font-weight: 900; color: var(--red-500);">${player.wickets || 0}</div>
        <small style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Wickets</small>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

window.openPlayerModal = openPlayerModal;
window.loadPlayers = loadPlayers;
