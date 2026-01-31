// editor.js
// Handles CodeMirror setup and editor-related actions
// IMPORTANT: UI event binding is done via initEditorUI()
// This is required because layout.js injects buttons dynamically

let editor; // global reference so layout.js can trigger init safely

// -------------------------------
// Initialize CodeMirror editor
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("editor");
  if (!textarea) return;

  editor = CodeMirror.fromTextArea(textarea, {
    mode: "text/x-c++src",
    theme: localStorage.getItem("theme") === "light" ? "eclipse" : "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
  });

  editor.setSize("100%", "100%");

  // Restore code + language
  const savedLang = localStorage.getItem("language");
  const savedCode = localStorage.getItem("code");
  if (savedLang) document.getElementById("languageSelect").value = savedLang;
  if (savedCode) editor.setValue(savedCode);

  applySavedTheme();
});

// ------------------------------------------------
// Called by layout.js AFTER navbar buttons exist
// ------------------------------------------------
function initEditorUI() {
  // Grab elements that layout.js injected
  const runBtn = document.getElementById("run");
  const saveBtn = document.getElementById("saveCode");
  const newBtn = document.getElementById("newCode");
  const togglePanel = document.getElementById("togglePanel");
  const themeToggle = document.getElementById("themeToggle");
  const ioPane = document.getElementById("ioPane");
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const languageSelect = document.getElementById("languageSelect");

  // Safety guard (important for non-editor pages)
  if (!editor || !runBtn) return;

  // -------------------------------
  // Language change
  // -------------------------------
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    const mode =
      lang === "Java"
        ? "text/x-java"
        : lang === "Python"
        ? "text/x-python"
        : "text/x-c++src";

    editor.setOption("mode", mode);
    localStorage.setItem("language", lang);
  });

  // -------------------------------
  // Run code
  // -------------------------------
  runBtn.addEventListener("click", async () => {
    output.value = "⏳ Running...";

    // Disable native execution on Render (expected behavior)
    if (location.hostname.includes("onrender.com") && languageSelect.value !== "Python") {
      output.value = "⚠️ Code execution for this language is disabled in production.";
      return;
    }

    const payload = {
      code: editor.getValue(),
      input: input.value,
      lang: languageSelect.value,
    };

    localStorage.setItem("code", payload.code);

    try {
      const res = await fetch("/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      output.value = data.output || "⚠️ No output";
    } catch {
      output.value = "❌ Server error";
    }
  });

  // -------------------------------
  // Save code (authenticated)
  // -------------------------------
  saveBtn.addEventListener("click", async () => {
    let name = prompt("Enter project name:");
    if (!name || !name.trim()) return alert("Project name required");

    const lang = languageSelect.value;
    const ext = lang === "Cpp" ? ".cpp" : lang === "Java" ? ".java" : ".py";

    try {
      const res = await fetch("/api/code/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: name.trim() + ext,
          language: lang,
          code: editor.getValue(),
        }),
      });

      if (res.status === 401) return alert("Please login to save");
      alert("✅ Project saved");
    } catch {
      alert("❌ Save failed");
    }
  });

  // -------------------------------
  // New code
  // -------------------------------
  newBtn.addEventListener("click", () => {
    if (confirm("Clear editor?")) {
      editor.setValue("");
      input.value = "";
      output.value = "";
    }
  });

  // -------------------------------
  // Toggle IO panel
  // -------------------------------
  togglePanel.addEventListener("click", () => {
    ioPane.classList.toggle("hidden");
    togglePanel.textContent = ioPane.classList.contains("hidden")
      ? "Show IO ◂"
      : "Hide IO ▸";
  });

  // -------------------------------
  // Theme toggle
  // -------------------------------
  themeToggle.addEventListener("click", toggleTheme);
}

// -------------------------------
// Theme helpers
// -------------------------------
function toggleTheme() {
  const theme = editor.getOption("theme") === "dracula" ? "light" : "dark";
  localStorage.setItem("theme", theme);
  applySavedTheme();
}

function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  const themeToggle = document.getElementById("themeToggle");

  if (!editor || !themeToggle) return;

  if (theme === "dark") {
    editor.setOption("theme", "dracula");
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light";
  } else {
    editor.setOption("theme", "eclipse");
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙 Dark";
  }
}

// Expose initializer globally for layout.js
window.initEditorUI = initEditorUI;
