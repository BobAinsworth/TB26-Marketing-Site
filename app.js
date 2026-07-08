(function () {
  const data = window.TB_SITE;
  const app = document.getElementById("app");

  function categoryUrl(id) {
    return `${encodeURIComponent(id)}.html`;
  }

  const categoryIcons = {
    "overview": "cat-overview",
    "promotional-assets": "cat-promotional-assets",
    "videos-media": "cat-videos-media",
    "social-media-toolkit": "cat-social-media-toolkit",
    "press-outreach": "cat-press-outreach",
    "internal-club-resources": "cat-internal-club-resources",
    "sponsor-partner-resources": "cat-sponsor-partner-resources",
    "event-rider-communications": "cat-event-rider-communications"
  };

  const groupIcons = {
    "Tierra Bella Websites": "overview-websites",
    "ACTC Background": "overview-actc-background",
    "Flyers": "promotional-flyers",
    "Logos & Branding": "promotional-logos-branding",
    "Images": "promotional-images",
    "Infographics": "promotional-infographics",
    "Promotional Graphics": "promotional-graphics",
    "Videos & Media": "videos-media",
    "Platform Guides": "social-platform-guides",
    "General Social Media": "social-general",
    "Former Rider Mailers": "press-mailers",
    "Press Releases": "press-releases",
    "Community Outreach": "press-community-outreach",
    "Media Coverage": "press-media-coverage",
    "Volunteer & Member Outreach": "internal-volunteer-member-outreach",
    "Director Communications": "internal-director-communications",
    "Tour Updates": "internal-tour-updates",
    "Volunteers": "internal-volunteers",
    "Member Campaigns": "internal-member-campaigns",
    "Sponsorship": "sponsor-sponsorship",
    "Sponsor Materials": "sponsor-materials",
    "Partner Organizations": "sponsor-partner-organizations",
    "Community Partnerships": "sponsor-community-partnerships",
    "Rider Information": "event-rider-information",
    "Ride Experience": "event-ride-experience",
    "Post-Ride": "event-post-ride"
  };

  function badge(name, fallback, alt) {
    if (!name) return `<div class="bubble">${fallback}</div>`;
    return `<img class="bubble image-bubble" src="assets/icons/${name}.jpg" alt="${escapeHtml(alt)}">`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[ch]));
  }

  function allItems() {
    return data.categories.flatMap(category =>
      category.groups.flatMap(group =>
        group.items.map(item => ({
          category,
          group,
          title: item[0],
          description: item[1],
          label: item[2],
          href: item[3]
        }))
      )
    );
  }

  function shell(main) {
    app.innerHTML = `
      <header class="topbar">
        <a class="brand" href="index.html" aria-label="Resource Center home">
          <img class="actc-logo" src="assets/tb26-logo-hires.jpg" alt="Tierra Bella Bicycle Tour 2026">
          <div>
            <div class="eyebrow">2026 Tierra Bella Bike Tour</div>
            <div class="site-title">Marketing Resource Center</div>
            <div class="tagline">One place for all the resources ACTC members need<br>to promote, plan, and deliver an amazing Tierra Bella experience.</div>
          </div>
        </a>
        <nav class="nav-actions" aria-label="Primary">
          <button type="button" id="searchToggle"><span class="nav-icon">⌕</span><span>Search<br>Resources</span></button>
          <a href="all-resources.html"><span class="nav-icon">▱</span><span>Browse<br>All Resources</span></a>
          <a href="all-resources.html"><span class="nav-icon">⇩</span><span>Download<br>All Assets (ZIP)</span></a>
        </nav>
      </header>
      <section class="search-panel" id="searchPanel" hidden>
        <label>
          <input id="searchInput" type="search" placeholder="Search resources, categories, descriptions, or link labels">
        </label>
        <div class="search-results" id="searchResults"></div>
      </section>
      ${main}
      <footer class="footer">
        <div>Questions? Contact the Tierra Bella Marketing Team at <a href="mailto:${data.contact}">${data.contact}</a></div>
        <div>Last Updated: ${data.updated}</div>
      </footer>
    `;
    wireSearch();
  }

  function home() {
    shell(`
      <section class="hero">
        <img class="tb-badge" src="assets/actc-50-years.jpg" alt="ACTC 50 Years">
        <div>
          <div class="kicker">Tierra Bella Bike Tour 2026</div>
          <h1>Marketing Resource Center</h1>
          <p>Everything you need to promote the Tierra Bella Bike Tour - tools, assets, and information in one place.</p>
          <a class="btn gold" href="all-resources.html">⇩ Download All Resources (ZIP)</a>
        </div>
      </section>
      <main class="content">
        <div class="category-grid">
          ${data.categories.map(categoryCard).join("")}
        </div>
      </main>
    `);
  }

  function categoryCard(category) {
    return `
      <article class="category-card" style="--accent:${category.accent}">
        ${badge(categoryIcons[category.id], category.icon, category.title)}
        <div>
          <h2>${category.number}. ${escapeHtml(category.shortTitle)}</h2>
          <p>${escapeHtml(category.summary)}</p>
          <a class="btn" href="${categoryUrl(category.id)}">${escapeHtml(category.cta)} <span>→</span></a>
        </div>
      </article>
    `;
  }

  function categoryPage(category) {
    shell(`
      <section class="hero">
        <img class="tb-badge" src="assets/actc-50-years.jpg" alt="ACTC 50 Years">
        <div>
          <h1>${category.number}. ${escapeHtml(category.title)}</h1>
          <p>${escapeHtml(category.hero)}</p>
          <a class="btn gold" href="index.html">← Back to Resource Center</a>
        </div>
      </section>
      <main class="content">
        <div class="resource-grid">
          ${category.groups.map(group => resourceCard(group, category)).join("")}
        </div>
      </main>
    `);
  }

  function resourceCard(group, category) {
    const items = group.items.map(item => `
      <li><a href="${item[3]}" target="_blank" rel="noopener">${escapeHtml(item[0])}</a></li>
    `).join("");
    return `
      <article class="resource-card" style="--accent:${category.accent}">
        <div class="resource-head">
          ${badge(groupIcons[group.title], category.icon, group.title)}
          <div>
            <h2>${escapeHtml(group.title)}</h2>
            <p>${escapeHtml(group.summary)}</p>
          </div>
        </div>
        <ul>${items}</ul>
      </article>
    `;
  }

  function allResources() {
    shell(`
      <section class="hero">
        <img class="tb-badge" src="assets/actc-50-years.jpg" alt="ACTC 50 Years">
        <div>
          <h1>All Resources</h1>
          <p>Browse every Tierra Bella 2026 marketing resource from the master content document.</p>
          <a class="btn gold" href="index.html">← Back to Resource Center</a>
        </div>
      </section>
      <main class="content">
        <div class="all-list">
          ${data.categories.map(category => `
            <section>
              <h2>${category.number}. ${escapeHtml(category.title)}</h2>
              ${category.groups.map(group => `
                <h3>${escapeHtml(group.title)}</h3>
                <ul class="plain-list">
                  ${group.items.map(item => `<li><a href="${item[3]}" target="_blank" rel="noopener">${escapeHtml(item[0])}</a> - ${escapeHtml(item[1])}</li>`).join("")}
                </ul>
              `).join("")}
            </section>
          `).join("")}
        </div>
      </main>
    `);
  }

  function wireSearch() {
    const toggle = document.getElementById("searchToggle");
    const panel = document.getElementById("searchPanel");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    toggle.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      if (!panel.hidden) input.focus();
    });
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = "";
        return;
      }
      const matches = allItems().filter(item =>
        [item.title, item.description, item.label, item.category.title, item.group.title].join(" ").toLowerCase().includes(q)
      ).slice(0, 12);
      results.innerHTML = matches.length ? matches.map(item => `
        <div class="search-result">
          <strong><a href="${item.href}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a></strong>
          <div>${escapeHtml(item.category.title)} / ${escapeHtml(item.group.title)}</div>
          <div>${escapeHtml(item.description)}</div>
        </div>
      `).join("") : `<div class="search-result">No matching resources found.</div>`;
    });
  }

  const page = document.body.dataset.page;
  if (page === "home") {
    home();
  } else if (page === "all") {
    allResources();
  } else {
    const params = new URLSearchParams(window.location.search);
    const id = document.body.dataset.category || params.get("category") || "overview";
    const category = data.categories.find(item => item.id === id) || data.categories[0];
    categoryPage(category);
  }
})();
