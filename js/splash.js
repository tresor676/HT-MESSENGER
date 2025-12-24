// splash.js
window.onload = () => {
  // Vérifie si l'utilisateur est connecté
  firebase.auth().onAuthStateChanged((user) => {
    if(user){
      // Redirige vers home si connecté
      window.location.href = "home.html";
    } else {
      // Sinon vers login
      window.location.href = "login.html";
    }
  });
};
