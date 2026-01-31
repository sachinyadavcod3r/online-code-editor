// editor.js — handles editor actions, run, save, theme, and IO toggle
document.addEventListener("DOMContentLoaded", async () => {
  // Load project when opened from My Projects page
  const urlParams = new URLSearchParams(window.location.search);
  const openId = urlParams.get("open");

  if (openId) {
    fetch("/api/code/get/" + openId, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        editor.setValue(data.code);
        languageSelect.value = data.language;
      });
  }

  // Initialize CodeMirror
  const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-c++src",
    theme: localStorage.getItem("theme") === "light" ? "eclipse" : "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
  });
  editor.setSize("100%", "100%");

  // Grab DOM elements
  const runBtn = document.getElementById("run");
  const saveBtn = document.getElementById("saveCode");
  const newBtn = document.getElementById("newCode");
  const togglePanel = document.getElementById("togglePanel");
  const themeToggle = document.getElementById("themeToggle");
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const ioPane = document.getElementById("ioPane");
  const languageSelect = document.getElementById("languageSelect");

  // 🧠 Restore saved state
  const savedLang = localStorage.getItem("language");
  const savedCode = localStorage.getItem("code");
  if (savedLang) languageSelect.value = savedLang;
  if (savedCode) editor.setValue(savedCode);

  // 🧩 Language Change
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

  // ▶ Run Code
  runBtn.addEventListener("click", async () => {
    output.value = "⏳ Running...";
    const codeData = {
      code: editor.getValue(),
      input: input.value,
      lang: languageSelect.value,
    };
    localStorage.setItem("code", editor.getValue());

    try {
      const res = await fetch("/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(codeData),
      });
      const data = await res.json();
      output.value = data.output || "⚠️ No output";
    } catch {
      output.value = "❌ Server error while compiling";
    }
  });

  // 💾 Save Code (requires login)
  saveBtn.addEventListener("click", async () => {
    // Ask for project name
    let projectName = prompt("Enter project name:");

    if (!projectName || projectName.trim() === "") {
      alert("Project name is required!");
      return;
    }

    projectName = projectName.trim();

    // Set correct file extension based on language
    const lang = languageSelect.value;
    let extension = "";

    if (lang === "Cpp") extension = ".cpp";
    if (lang === "Java") extension = ".java";
    if (lang === "Python") extension = ".py";

    const filename = projectName + extension;

    const codeData = {
      filename: filename,
      language: lang,
      code: editor.getValue(),
    };

    try {
      const res = await fetch("/api/code/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(codeData),
      });

      if (res.status === 401) {
        alert("Please log in to save your code!");
        return;
      }

      const data = await res.json();
      alert("Saved as: " + filename);
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error saving code.");
    }
  });

  // 🆕 New Code
  newBtn.addEventListener("click", () => {
    if (confirm("Clear current code?")) {
      editor.setValue("");
      input.value = "";
      output.value = "";
    }
  });

  // 🔁 Hide / Show IO Panel
  togglePanel.addEventListener("click", () => {
    ioPane.classList.toggle("hidden");
    if (ioPane.classList.contains("hidden")) {
      togglePanel.textContent = "Show IO ◂";
    } else {
      togglePanel.textContent = "Hide IO ▸";
    }
  });

  // 🌗 Theme Toggle
  themeToggle.addEventListener("click", () => {
    const currentTheme = editor.getOption("theme");
    if (currentTheme === "dracula") {
      editor.setOption("theme", "eclipse");
      themeToggle.textContent = "🌙 Dark";
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark-mode");
    } else {
      editor.setOption("theme", "dracula");
      themeToggle.textContent = "☀️ Light";
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark-mode");
    }
  });

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    editor.setOption("theme", "dracula");
    themeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark-mode");
    editor.setOption("theme", "eclipse");
    themeToggle.textContent = "🌙 Dark";
  }
});
