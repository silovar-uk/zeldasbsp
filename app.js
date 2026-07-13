(() => {
  "use strict";

  const data = window.ZELDA_DATA;
  const state = {
    category: "すべて",
    situation: "すべて",
    query: "",
    sort: "default",
    favoritesOnly: false,
    view: localStorage.getItem("zelda-view") || "cards",
    favorites: new Set(JSON.parse(localStorage.getItem("zelda-favorites") || "[]"))
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const normalize = (value) => String(value || "").toLowerCase().normalize("NFKC");
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function saveFavorites() {
    localStorage.setItem("zelda-favorites", JSON.stringify([...state.favorites]));
  }

  function renderGameplan() {
    $("#gameplanGrid").innerHTML = data.gameplan.map((item, index) => `
      <article class="gameplan-card">
        <span class="num">0${index + 1}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join("");
  }

  function renderSituations() {
    $("#situationGrid").innerHTML = data.situations.map((item) => `
      <article class="situation-card" tabindex="0" role="button" data-situation-jump="${escapeHtml(item.key)}" aria-label="${escapeHtml(item.title)}で技を絞り込む">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.text)}</p>
        <ul>${item.moves.slice(0, 6).map((move) => `<li>${escapeHtml(move)}</li>`).join("")}</ul>
      </article>
    `).join("");
  }

  function renderStats() {
    $("#profileSummary").innerHTML = `
      <article class="profile-card">
        <p class="eyebrow">ARCHETYPE</p>
        <h3>高火力の罠型ゾーナー</h3>
        <p>ファントムで時間と空間を先に押さえ、相手の行動を限定してから、稲妻キックや上Bなど高リターン技を当てる。機動力・耐久・着地の弱さを、展開設計と早期撃墜で補うキャラクター。</p>
      </article>
      <article class="profile-card profile-rank">
        <div><p class="eyebrow">COMMUNITY TIER LIST</p><span>${escapeHtml(data.meta.tier)} TIER</span><p>競技コミュニティの現行SmashWiki掲載順位</p></div>
        <strong>${data.meta.tierRank}<small> / ${data.meta.rosterCount}</small></strong>
      </article>
    `;

    $("#statsGrid").innerHTML = data.stats.map((stat) => `
      <article class="stat-card">
        <span class="stat-label">${escapeHtml(stat.label)}</span>
        <strong>${escapeHtml(stat.value)}</strong>
        <div class="stat-position"><span>${escapeHtml(stat.position)}</span></div>
        <div class="position-bar" title="全体内での相対的な位置づけ"><i style="width:${Math.max(3, Math.min(100, stat.percentile))}%"></i></div>
      </article>
    `).join("");

    $("#strengthGrid").innerHTML = `
      <article class="strength-card"><h3>強み</h3><ul>${data.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
      <article class="strength-card weak"><h3>弱み</h3><ul>${data.weaknesses.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
    `;
  }

  function renderFilters() {
    const categories = ["すべて", ...new Set(data.moves.map((move) => move.category))];
    $("#categoryFilters").innerHTML = categories.map((item) => `<button type="button" class="filter-chip${state.category === item ? " is-active" : ""}" data-category="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("");

    const situations = ["すべて", ...new Set(data.moves.flatMap((move) => move.tags))];
    const priority = ["すべて", "撃墜", "コンボ", "崖", "対空", "ガーキャン", "暴れ", "差し返し", "着地狩り", "復帰阻止", "反射", "防御"];
    const ordered = [...priority.filter((item) => situations.includes(item)), ...situations.filter((item) => !priority.includes(item))];
    $("#situationFilters").innerHTML = ordered.map((item) => `<button type="button" class="filter-chip${state.situation === item ? " is-active" : ""}" data-situation="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("");
  }

  function searchableText(move) {
    return normalize([
      move.name, move.input, move.category, move.summary, move.damage, move.startup,
      ...move.tags, ...move.use, ...move.avoid, ...move.followups, move.notes
    ].join(" "));
  }

  function filteredMoves() {
    let moves = data.moves.filter((move) => {
      const categoryMatch = state.category === "すべて" || move.category === state.category;
      const situationMatch = state.situation === "すべて" || move.tags.includes(state.situation);
      const queryMatch = !state.query || searchableText(move).includes(normalize(state.query));
      const favoriteMatch = !state.favoritesOnly || state.favorites.has(move.id);
      return categoryMatch && situationMatch && queryMatch && favoriteMatch;
    });

    if (state.sort === "startup") moves.sort((a, b) => a.startupSort - b.startupSort);
    if (state.sort === "damage") moves.sort((a, b) => b.maxDamage - a.maxDamage);
    if (state.sort === "risk") moves.sort((a, b) => a.risk - b.risk || a.startupSort - b.startupSort);
    return moves;
  }

  function riskMeter(level) {
    return `<span class="risk-meter" aria-label="リスク ${level}/5">${[1,2,3,4,5].map((n) => `<i class="${n <= level ? "on" : ""}"></i>`).join("")}</span>`;
  }

  function cardTemplate(move) {
    const favorite = state.favorites.has(move.id);
    return `
      <article class="move-card" data-id="${move.id}">
        <div class="move-card-top">
          <div class="move-kicker">
            <span class="move-category">${escapeHtml(move.category)}</span>
            <button type="button" class="favorite-button${favorite ? " is-active" : ""}" data-favorite="${move.id}" aria-label="${escapeHtml(move.name)}をお気に入り${favorite ? "から外す" : "に追加"}" aria-pressed="${favorite}">★</button>
          </div>
          <h3>${escapeHtml(move.name)}</h3>
          <span class="move-input">${escapeHtml(move.input)}</span>
          <p class="move-one-line">${escapeHtml(move.summary)}</p>
        </div>
        <div class="frame-strip">
          <div><span>発生</span><strong>${escapeHtml(move.startup)}</strong></div>
          <div><span>ダメージ</span><strong>${escapeHtml(move.damage)}</strong></div>
          <div><span>${move.category === "空中" ? "着地隙" : "全体"}</span><strong>${escapeHtml(move.category === "空中" ? move.landing : move.total)}</strong></div>
        </div>
        <div class="move-card-bottom">
          <div class="tags">${move.tags.slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="risk"><span>空振りリスク</span>${riskMeter(move.risk)}</div>
          <button type="button" class="details-button" data-details="${move.id}">使いどころと詳細</button>
        </div>
      </article>
    `;
  }

  function tableTemplate(moves) {
    return `
      <table class="move-table">
        <thead><tr><th>技</th><th>カテゴリ</th><th>発生</th><th>持続</th><th>全体</th><th>着地</th><th>ダメージ</th><th>ガード</th><th>主用途</th></tr></thead>
        <tbody>${moves.map((move) => `
          <tr>
            <td><button type="button" data-details="${move.id}">${escapeHtml(move.name)}<br><small>${escapeHtml(move.input)}</small></button></td>
            <td>${escapeHtml(move.category)}</td>
            <td>${escapeHtml(move.startup)}</td>
            <td>${escapeHtml(move.active)}</td>
            <td>${escapeHtml(move.total)}</td>
            <td>${escapeHtml(move.landing)}</td>
            <td>${escapeHtml(move.damage)}</td>
            <td>${escapeHtml(move.shield)}</td>
            <td>${move.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join(" ")}</td>
          </tr>
        `).join("")}</tbody>
      </table>
    `;
  }

  function renderMoves() {
    const moves = filteredMoves();
    $("#movesCards").innerHTML = moves.map(cardTemplate).join("");
    $("#movesTable").innerHTML = tableTemplate(moves);
    $("#resultCount").textContent = moves.length;
    $("#emptyState").hidden = moves.length > 0;

    const labels = [];
    if (state.category !== "すべて") labels.push(state.category);
    if (state.situation !== "すべて") labels.push(state.situation);
    if (state.query) labels.push(`「${state.query}」`);
    if (state.favoritesOnly) labels.push("お気に入り");
    $("#activeFilterText").textContent = labels.length ? `— ${labels.join(" / ")}` : "";

    const cards = $("#movesCards");
    const table = $("#movesTable");
    cards.hidden = state.view !== "cards";
    table.hidden = state.view !== "table";
    $$("[data-view]").forEach((button) => button.classList.toggle("is-active", button.dataset.view === state.view));
  }

  function openMove(id) {
    const move = data.moves.find((item) => item.id === id);
    if (!move) return;
    $("#dialogContent").innerHTML = `
      <div class="dialog-inner">
        <header class="dialog-head">
          <p class="eyebrow">${escapeHtml(move.category)} · ${move.tags.map(escapeHtml).join(" / ")}</p>
          <h2>${escapeHtml(move.name)}</h2>
          <span class="dialog-input">${escapeHtml(move.input)}</span>
          <p class="dialog-summary">${escapeHtml(move.summary)}</p>
        </header>
        <div class="dialog-frames">
          <div><span>発生</span><strong>${escapeHtml(move.startup)}</strong></div>
          <div><span>持続</span><strong>${escapeHtml(move.active)}</strong></div>
          <div><span>全体</span><strong>${escapeHtml(move.total)}</strong></div>
          <div><span>後隙</span><strong>${escapeHtml(move.endlag)}</strong></div>
          <div><span>着地隙</span><strong>${escapeHtml(move.landing)}</strong></div>
          <div><span>ダメージ</span><strong>${escapeHtml(move.damage)}</strong></div>
          <div><span>ガード時</span><strong>${escapeHtml(move.shield)}</strong></div>
          <div><span>リスク</span><strong>${move.risk} / 5</strong></div>
        </div>
        <div class="dialog-columns">
          <section class="dialog-section good"><h3>使うべきタイミング</h3><ul>${move.use.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          <section class="dialog-section bad"><h3>避けたい使い方</h3><ul>${move.avoid.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        </div>
        <section class="dialog-section"><h3>ヒット後・次の展開</h3><ul>${move.followups.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section class="dialog-section"><h3>技の要点</h3><p>${escapeHtml(move.notes)}</p></section>
      </div>
    `;
    const dialog = $("#moveDialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function setSituation(value, shouldScroll = false) {
    state.situation = value;
    state.category = "すべて";
    state.query = "";
    $("#moveSearch").value = "";
    renderFilters();
    renderMoves();
    if (shouldScroll) $("#moves").scrollIntoView({ behavior: "smooth" });
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const category = event.target.closest("[data-category]");
      if (category) {
        state.category = category.dataset.category;
        renderFilters();
        renderMoves();
        return;
      }

      const situation = event.target.closest("[data-situation]");
      if (situation) {
        state.situation = situation.dataset.situation;
        renderFilters();
        renderMoves();
        return;
      }

      const jump = event.target.closest("[data-situation-jump]");
      if (jump) {
        setSituation(jump.dataset.situationJump, true);
        return;
      }

      const quick = event.target.closest("[data-quick-filter]");
      if (quick) {
        setSituation(quick.dataset.quickFilter, true);
        return;
      }

      const favorite = event.target.closest("[data-favorite]");
      if (favorite) {
        const id = favorite.dataset.favorite;
        state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
        saveFavorites();
        renderMoves();
        return;
      }

      const details = event.target.closest("[data-details]");
      if (details) openMove(details.dataset.details);
    });

    document.addEventListener("keydown", (event) => {
      const jump = event.target.closest?.("[data-situation-jump]");
      if (jump && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        setSituation(jump.dataset.situationJump, true);
      }
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        $("#moveSearch").focus();
      }
      if (event.key === "Escape" && $("#moveDialog").open) $("#moveDialog").close();
    });

    $("#moveSearch").addEventListener("input", (event) => {
      state.query = event.target.value.trim();
      renderMoves();
    });

    $("#sortSelect").addEventListener("change", (event) => {
      state.sort = event.target.value;
      renderMoves();
    });

    $("#favoriteFilter").addEventListener("click", (event) => {
      state.favoritesOnly = !state.favoritesOnly;
      event.currentTarget.setAttribute("aria-pressed", String(state.favoritesOnly));
      renderMoves();
    });

    $("#resetFilters").addEventListener("click", () => {
      Object.assign(state, { category: "すべて", situation: "すべて", query: "", sort: "default", favoritesOnly: false });
      $("#moveSearch").value = "";
      $("#sortSelect").value = "default";
      $("#favoriteFilter").setAttribute("aria-pressed", "false");
      renderFilters();
      renderMoves();
    });

    $$("[data-view]").forEach((button) => button.addEventListener("click", () => {
      state.view = button.dataset.view;
      localStorage.setItem("zelda-view", state.view);
      renderMoves();
    }));

    $(".dialog-close").addEventListener("click", () => $("#moveDialog").close());
    $("#moveDialog").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    });

    $("#themeToggle").addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("zelda-theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  function initTheme() {
    const saved = localStorage.getItem("zelda-theme");
    const dark = saved === "dark" || (!saved && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    document.body.classList.toggle("dark", dark);
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  initTheme();
  renderGameplan();
  renderSituations();
  renderStats();
  renderFilters();
  renderMoves();
  bindEvents();
  registerServiceWorker();
})();
