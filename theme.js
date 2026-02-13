document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const themeYes = document.getElementById("theme-yes");
  const themeNo = document.getElementById("theme-no");
  const htmlElement = document.documentElement;

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

  // Listen to checkbox toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      updateTheme(darkModeToggle.checked);
    });
  }

  // Listen to radio button changes
  if (themeYes) {
    themeYes.addEventListener("change", () => {
      if (themeYes.checked) {
        updateTheme(true);
      }
    });
  }
  
  if (themeNo) {
    themeNo.addEventListener("change", () => {
      if (themeNo.checked) {
        updateTheme(false);
      }
    });
  }
});
