// Fetch user info on load
window.addEventListener("load", async () => {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    });
    if (res.status === 401) {
      // Not logged in → redirect to login
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    document.getElementById("username").textContent = data.username;
    document.getElementById("welcomeUser").textContent = `Welcome, ${data.username}!`;
  } catch (err) {
    console.error("Error loading profile:", err);
    window.location.href = "/login";
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  localStorage.clear();
  window.location.href = "/login";
});

// Delete account
document.getElementById("deleteBtn").addEventListener("click", async () => {
  if (!confirm("Are you sure you want to permanently delete your account?")) return;

  const res = await fetch("/api/auth/delete", {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  alert(data.message);
  window.location.href = "/register";
});
