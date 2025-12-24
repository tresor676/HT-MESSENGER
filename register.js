// register.js
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if(password !== confirmPassword){
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Ajouter le pseudo dans Firestore
      firebase.firestore().collection("users").doc(user.uid).set({
        username: username,
        email: email,
        friends: [],
        pendingRequests: []
      }).then(() => {
        window.location.href = "home.html";
      });
    })
    .catch((error) => {
      alert("Erreur: " + error.message);
    });
});
