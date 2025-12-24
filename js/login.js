// login.js
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login réussi, redirige vers home
      window.location.href = "home.html";
    })
    .catch((error) => {
      alert("Erreur: " + error.message);
    });
});
