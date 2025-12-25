import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2WG-135oKY_s6xf5-nBBhxncNV9UayQ0",
  authDomain: "tresor-ae58e.firebaseapp.com",
  databaseURL: "https://tresor-ae58e-default-rtdb.firebaseio.com",
  projectId: "tresor-ae58e",
  storageBucket: "tresor-ae58e.firebasestorage.app",
  messagingSenderId: "835562519447",
  appId: "1:835562519447:web:e4032e73f7601ba3c522d2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// ---- AUTH ----
export async function registerUser(username,email,password){
  const userCredential = await createUserWithEmailAndPassword(auth,email,password);
  await setDoc(doc(db,"users",userCredential.user.uid), {username,email});
  return userCredential;
}

export async function loginUser(email,password){
  const userCredential = await signInWithEmailAndPassword(auth,email,password);
  return userCredential;
}

export async function logoutUser(){
  await signOut(auth);
}

export function checkAuth(redirect="index.html"){
  onAuthStateChanged(auth,user=>{
    if(!user) window.location.href = redirect;
  });
}

// ---- USERS ----
export async function loadUsers(containerId){
  const usersList = document.getElementById(containerId);
  usersList.innerHTML = "";
  const snapshot = await getDocs(collection(db,"users"));
  snapshot.forEach(doc=>{
    if(doc.id===auth.currentUser.uid) return;
    const user = doc.data();
    const li = document.createElement("li");
    li.className="user-item";
    const color = "#"+Math.floor(Math.random()*16777215).toString(16);
    li.innerHTML=`<div class="avatar" style="background:${color}">${user.username.charAt(0).toUpperCase()}</div>${user.username}`;
    li.onclick = ()=>window.location.href=`chat.html?uid=${doc.id}&name=${user.username}`;
    usersList.appendChild(li);
  });
}

// ---- CHAT ----
export function loadChat(chatWithUid,chatWithName){
  document.getElementById("chatWith").textContent = `Chat avec ${chatWithName}`;
  const chatBox = document.getElementById("chatBox");
  const msgInput = document.getElementById("message");
  const sendBtn = document.getElementById("sendBtn");

  const q = query(collection(db,"messages"),orderBy("timestamp"));
  onSnapshot(q,snapshot=>{
    chatBox.innerHTML="";
    snapshot.forEach(doc=>{
      const data = doc.data();
      if((data.from===auth.currentUser.uid && data.to===chatWithUid)||
         (data.from===chatWithUid && data.to===auth.currentUser.uid)){
        const div = document.createElement("div");
        div.className="message "+(data.from===auth.currentUser.uid?"me":"other");
        div.textContent = data.message;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    });
  });

  sendBtn.onclick = async ()=>{
    if(!msgInput.value) return;
    await addDoc(collection(db,"messages"),{
      from:auth.currentUser.uid,
      to:chatWithUid,
      message:msgInput.value,
      timestamp:Date.now()
    });
    msgInput.value="";
  };
  }
