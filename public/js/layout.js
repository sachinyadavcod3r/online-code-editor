// layout.js — injects unified layout and handles sidebar state
(async function initLayout() {
  const body = document.body;

  // Create navbar HTML
  const navbar = document.createElement("nav");
  navbar.className = "navbar navbar-dark bg-dark px-3 d-flex justify-content-between";
  navbar.innerHTML = `
  <div class="d-flex align-items-center gap-2">
    <button id="sidebarToggle" class="btn btn-outline-light btn-sm">☰</button>

      <h5 class="text-white mb-0">💻 CodeEditor</h5>
      <select class="form-select form-select-sm" id="languageSelect">
        <option value="Cpp">C++</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
      </select>
    
  </div>
  <div class="d-flex align-items-center gap-2">
    <button id="newCode" class="btn btn-outline-light btn-sm">New</button>
    <button id="run" class="btn btn-success btn-sm">Run ▶</button>
    <button id="saveCode" class="btn btn-primary btn-sm">Save 💾</button>
    <button id="togglePanel" class="btn btn-outline-light btn-sm">Hide IO ▸</button>
    <button id="themeToggle" class="btn btn-warning btn-sm">🌙 Dark</button>
  </div>
`;
  body.prepend(navbar);

  // Create sidebar HTML
  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";
  sidebar.className = "sidebar bg-dark text-white p-3";
  sidebar.innerHTML = `
    <ul class="nav flex-column" id="menuList"></ul>
  `;
  body.prepend(sidebar);

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Build menu based on login state
  await buildMenu();

   // After layout is fully injected, initialize editor UI bindings
  if (typeof window.initEditorUI === "function") {
    window.initEditorUI();
  }

  async function buildMenu() {
  const menuList = document.getElementById("menuList");
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const isLoggedIn = res.status === 200;
  const data = isLoggedIn ? await res.json() : {};

  menuList.innerHTML = `
    <li class="nav-item mb-2"><a href="/" class="nav-link text-white">🏠 Home</a></li>
    ${
      isLoggedIn
        ? `
        <li class="nav-item mb-2"><a href="/profile" class="nav-link text-white">👤 Profile</a></li>
        <li class="nav-item mb-2"><a href="/mycodes" class="nav-link text-white">💾 My Projects</a></li>
        <li class="nav-item mb-2"><span class="nav-link text-warning">Welcome, ${data.username}</span></li>
        <li class="nav-item mb-2"><a href="#" id="logout" class="nav-link text-danger">🚪 Logout</a></li>
        <li class="nav-item mb-2"><a href="#" id="deleteAccount" class="nav-link text-danger">❌ Delete Account</a></li>
      `
        : `
        <li class="nav-item mb-2"><a href="/login" class="nav-link text-white">🔑 Login</a></li>
        <li class="nav-item mb-2"><a href="/register" class="nav-link text-white">🧾 Sign Up</a></li>
        <li class="nav-item mb-2"><a href="/profile" class="nav-link text-white">👤 Profile</a></li>
        <li class="nav-item mb-2"><a href="/mycodes" class="nav-link text-white">💾 My Projects</a></li>
      `
    }
  `;

  // Handle logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      localStorage.clear();
      location.href = "/";
    });
  }

  // Handle delete account
  const deleteBtn = document.getElementById("deleteAccount");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to delete your account?")) {
        await fetch("/api/auth/delete", {
          method: "DELETE",
          credentials: "include",
        });
        location.href = "/register";
      }
    });
  }
}
})();
