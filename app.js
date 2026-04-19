document.addEventListener("DOMContentLoaded", () => {
  
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const themeYes = document.getElementById("theme-yes");
  const themeNo = document.getElementById("theme-no");
  const htmlElement = document.documentElement;
  const headerEl = document.querySelector("main > header");

  const setHeaderHeight = () => {
    if (!headerEl) return;
    htmlElement.style.setProperty("--header-height", `${headerEl.offsetHeight}px`);
  };

  const savedMode = localStorage.getItem("colorMode");
  const isDark = savedMode === "dark";

  const updateTheme = (isDarkMode) => {
    if (isDarkMode) {
      htmlElement.setAttribute("data-theme", "dark");
      localStorage.setItem("colorMode", "dark");
      if (darkModeToggle) darkModeToggle.checked = true;
      if (themeYes) themeYes.checked = true;
      if (themeNo) themeNo.checked = false;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css";
      document.head.appendChild(link);
    } else {
      htmlElement.removeAttribute("data-theme");
      localStorage.setItem("colorMode", "light");
      if (darkModeToggle) darkModeToggle.checked = false;
      if (themeYes) themeYes.checked = false;
      if (themeNo) themeNo.checked = true;
      
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        if (link.href.includes("atom-one-dark")) {
          link.remove();
        }
      });
    }
  };

  if (isDark) {
    updateTheme(true);
  }

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      updateTheme(darkModeToggle.checked);
    });
  }

  if (themeYes) {
    themeYes.addEventListener("change", () => {
      if (themeYes.checked) updateTheme(true);
    });
  }
  
  if (themeNo) {
    themeNo.addEventListener("change", () => {
      if (themeNo.checked) updateTheme(false);
    });
  }

  // ── SK Logic ──
  const skSlider = document.getElementById("sk-base-slider");
  const skSliderVal = document.getElementById("sk-slider-val");
  const skCodeBlock = document.getElementById("sk-code-block");
  const skTryBtn = document.getElementById("sk-try-btn");

  if (skSlider && skCodeBlock) {
    const updateSKCode = (val) => {
      skSliderVal.textContent = val;
      skCodeBlock.textContent = `import time

fn temp(base = ${val}) {
    let temperature = [17..23]
    print("Temperature is", temperature + base)
}

for day in ["Monday", "Tuesday", "Wednesday"] {
    print("Today is", day)
    print("Time", time.format(time.now()))
    temp(${val})
}`;
      hljs.highlightElement(skCodeBlock);
    };

    skSlider.addEventListener("input", (e) => updateSKCode(e.target.value));
    
    if (skTryBtn) {
      skTryBtn.addEventListener("click", () => {
        const val = skSlider.value;
        const code64 = btoa(skCodeBlock.textContent);
        window.location.href = `https://sk.aloyak.dev/ide?code64=${code64}`;
      });
    }
  }

  // ── Local time display ──
  const timeDisplay = document.getElementById("time-display");
  if (timeDisplay) {
    const updateTime = () => {
      const now = new Date();
      const spainTime = now.toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      
      const utcOffset = now.toLocaleString("en-US", {
        timeZone: "Europe/Madrid",
        timeZoneName: "shortOffset",
      }).split(" ").pop();
      
      timeDisplay.textContent = `${spainTime} ${utcOffset}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  // ── GitHub stats ──
  const ghReposEl   = document.getElementById("gh-repos");
  const ghStarsEl   = document.getElementById("gh-stars");
  const ghFollowersEl = document.getElementById("gh-followers");

  if (ghReposEl || ghStarsEl || ghFollowersEl) {
    const fetchGitHubStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/aloyak"),
          fetch("https://api.github.com/users/aloyak/repos?per_page=100"),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

        const user  = await userRes.json();
        const repos = await reposRes.json();

        const totalStars = Array.isArray(repos)
          ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
          : 0;

        if (ghReposEl)    ghReposEl.textContent    = user.public_repos ?? "—";
        if (ghStarsEl)    ghStarsEl.textContent    = totalStars;
        if (ghFollowersEl) ghFollowersEl.textContent = user.followers ?? "—";
      } catch (err) {
        console.error("Failed to fetch GitHub stats:", err);
      }
    };

    fetchGitHubStats();
  }

  // ── GitHub contributions chart ──
  const contributionsContainer = document.getElementById("contributions-chart");
  if (contributionsContainer) {
    const fetchGitHubContributions = async () => {
      try {
        const response = await fetch("https://github-contributions-api.jogruber.de/v4/aloyak?y=last");
        const data = await response.json();
        
        const contributions = [];
        const contributionMap = {};
        let totalContributions = 0;

        data.contributions.forEach(contribution => {
          contributionMap[contribution.date] = contribution.count;
          totalContributions += contribution.count;
        });

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364);

        for (let i = 0; i < 365; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const count = contributionMap[dateStr] || 0;
          contributions.push({ date: dateStr, count });
        }

        return { contributions, totalContributions };
      } catch (error) {
        console.error("Failed to fetch GitHub contributions:", error);
        return generateMockData();
      }
    };

    const generateMockData = () => {
      const contributions = [];
      let totalContributions = 0;
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 364);

      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const count = Math.random() > 0.3 ? Math.floor(Math.random() * 11) : 0;
        totalContributions += count;
        contributions.push({ date: date.toISOString().split("T")[0], count });
      }
      return { contributions, totalContributions };
    };

    const getLevel = (count) => {
      if (count === 0) return 0;
      if (count <= 2) return 1;
      if (count <= 5) return 2;
      if (count <= 8) return 3;
      return 4;
    };

    const renderChart = (data, total) => {
      const weeks = [];
      for (let i = 0; i < data.length; i += 7) {
        weeks.push(data.slice(i, i + 7));
      }

      const grid = document.createElement("div");
      grid.className = "pixel-grid";

      weeks.forEach(week => {
        const col = document.createElement("div");
        col.className = "pixel-col";
        week.forEach(day => {
          const cell = document.createElement("div");
          cell.className = `pixel-cell level-${getLevel(day.count)}`;
          cell.title = `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`;
          col.appendChild(cell);
        });
        grid.appendChild(col);
      });

      contributionsContainer.appendChild(grid);

      const totalEl = document.createElement("div");
      totalEl.className = "contributions-total";
      totalEl.textContent = `${total.toLocaleString()} Contributions in the Last Year`;
      contributionsContainer.appendChild(totalEl);
    };

    fetchGitHubContributions().then(({ contributions, totalContributions }) => {
      renderChart(contributions, totalContributions);
    });
  }
});