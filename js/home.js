// home.js
const mainContainer = document.getElementById("mainContainer");

// Boutons
const btnAllUsers = document.getElementById("btnAllUsers");
const btnFriends = document.getElementById("btnFriends");
const btnPending = document.getElementById("btnPending");
const btnToConfirm = document.getElementById("btnToConfirm");
const btnChatList = document.getElementById("btnChatList");
const btnLogout = document.getElementById("btnLogout");

// Fonction pour charger un HTML dans le container
function loadView(view) {
  fetch(view)
    .then(response => response.text())
    .then(data => mainContainer.innerHTML = data);
}

// Navigation
btnAllUsers.addEventListener("click", () => loadView("html/allUsers.html"));
btnFriends.addEventListener("click", () => loadView("html/friends.html"));
btnPending.addEventListener("click", () => loadView("html/pending.html"));
btnToConfirm.addEventListener("click", () => loadView("html/toConfirm.html"));
btnChatList.addEventListener("click", () => loadView("html/chatList.html"));

// Logout
btnLogout.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
});

// Charger par défaut la liste des utilisateurs
loadView("html/allUsers.html");
