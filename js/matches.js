/**
 * CricSphere - Matches & Fixtures Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#matches-page-container") || document.querySelector("#home-matches-grid")) {
    initMatchesView();
  }
});

let currentMatchFilter = "all";
let currentFormatFilter = "all";

async function initMatchesView() {
  bindFilterButtons();
  await loadAndRenderMatches();
}

function bindFilterButtons() {
  const statusButtons = document.querySelectorAll(".match-status-filter");
  statusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      statusButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentMatchFilter = btn.dataset.filter;
      loadAndRenderMatches();
    });
  });

  const formatButtons = document.querySelectorAll(".match-format-filter");
  formatButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      formatButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFormatFilter = btn.dataset.format;
      loadAndRenderMatches();
    });
  });
}

async function loadAndRenderMatches() {
  const container = document.querySelector("#matches-page-container") || document.querySelector("#home-matches-grid");
  if (!container) return;

  container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-dim);">Loading cricket fixtures...</div>`;

  try {
    let matches = await window.CricDB.getMatches();

    if (currentMatchFilter !== "all") {
      matches = matches.filter(m => (m.status || '').toLowerCase() === currentMatchFilter.toLowerCase());
    }
    if (currentFormatFilter !== "all") {
      matches = matches.filter(m => (m.format || '').toLowerCase() === currentFormatFilter.toLowerCase());
    }

    if (!matches || matches.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--card-bg); border-radius: var(--radius-md); border: 1px solid var(--card-border);">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🏏</div>
          <h3 style="color: #fff; margin-bottom: 8px;">No matches found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Try changing filters or check back later for upcoming tournament fixtures.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = matches.map(m => renderMatchCard(m)).join("");
  } catch (err) {
    console.error("Error loading matches:", err);
    container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--red-500);">Failed to load matches: ${err.message}</div>`;
  }
}

function renderMatchCard(m) {
  const isLive = m.status === 'live';
  const isCompleted = m.status === 'completed';
  const isUpcoming = m.status === 'upcoming';

  const badgeClass = isLive ? 'badge-live' : isUpcoming ? 'badge-upcoming' : 'badge-completed';
  const statusLabel = isLive ? 'LIVE NOW' : isUpcoming ? 'UPCOMING' : 'RESULT';

  const formattedDate = new Date(m.match_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return `
    <div class="match-card ${isLive ? 'is-live' : ''}">
      <div class="match-top-meta">
        <span class="badge ${badgeClass}">${statusLabel}</span>
        <span>${m.tournament} • <strong>${m.format}</strong></span>
      </div>

      <div class="match-teams-box">
        <!-- Team 1 -->
        <div class="match-team-line ${m.current_batting_team === m.team1_name ? 'batting' : ''}">
          <div class="team-info">
            <img src="${m.team1_logo || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100'}" alt="${m.team1_name}" class="team-avatar" onerror="this.src='https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100'">
            <div>
              <div class="team-name">${m.team1_name}</div>
              <small style="color: var(--text-dim); font-size: 0.75rem;">${m.team1_short}</small>
            </div>
          </div>
          <div class="score-info">
            <div class="runs-overs">${m.team1_score}</div>
            <div class="overs-badge">(${m.team1_overs} ov)</div>
          </div>
        </div>

        <!-- Team 2 -->
        <div class="match-team-line ${m.current_batting_team === m.team2_name ? 'batting' : ''}">
          <div class="team-info">
            <img src="${m.team2_logo || 'https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=100'}" alt="${m.team2_name}" class="team-avatar" onerror="this.src='https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=100'">
            <div>
              <div class="team-name">${m.team2_name}</div>
              <small style="color: var(--text-dim); font-size: 0.75rem;">${m.team2_short}</small>
            </div>
          </div>
          <div class="score-info">
            <div class="runs-overs">${m.team2_score}</div>
            <div class="overs-badge">(${m.team2_overs} ov)</div>
          </div>
        </div>
      </div>

      <!-- Match Live or Result Summary -->
      ${m.result_summary ? `<div class="match-result-strip">${m.result_summary}</div>` : ''}

      ${isLive && (m.current_batsman || m.current_bowler) ? `
        <div class="match-live-details">
          <div>🏏 Bat: <strong>${m.current_batsman || 'N/A'}</strong></div>
          <div>🎯 Bowl: <strong>${m.current_bowler || 'N/A'}</strong></div>
          <div>CRR: <strong>${m.crr || '0.00'}</strong></div>
          <div>RRR: <strong>${m.rrr || '0.00'}</strong></div>
        </div>
      ` : ''}

      <div class="match-card-footer">
        <div>📍 ${m.venue || 'Stadium Arena'}</div>
        <div>🗓️ ${formattedDate}</div>
      </div>
    </div>
  `;
}

window.loadAndRenderMatches = loadAndRenderMatches;
