// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, push, update, onValue, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ===================== CONFIG =====================
const firebaseConfig = {
  apiKey: "AIzaSyC2WG-135oKY_s6xf5-nBBhxncNV9UayQ0",
  authDomain: "tresor-ae58e.firebaseapp.com",
  databaseURL: "https://tresor-ae58e-default-rtdb.firebaseio.com",
  projectId: "tresor-ae58e",
  storageBucket: "tresor-ae58e.appspot.com",
  messagingSenderId: "835562519447",
  appId: "1:835562519447:web:e4032e73f7601ba3c522d2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// ===================== AUTH =====================
export function registerUser(email, password, username){
  return createUserWithEmailAndPassword(auth,email,password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      return set(ref(db,'users/'+uid),{
        username: username,
        email: email,
        friends: {},
        pendingRequests: {},
        pendingRequestsSent: {}
      });
    });
}

export function loginUser(email,password){
  return signInWithEmailAndPassword(auth,email,password);
}

// ===================== FRIENDS =====================
export function sendFriendRequest(targetUid){
  const currentUser = auth.currentUser.uid;
  return update(ref(db), {
    [`users/${targetUid}/pendingRequests/${currentUser}`]: true,
    [`users/${currentUser}/pendingRequestsSent/${targetUid}`]: true
  });
}

export function acceptFriendRequest(fromUid){
  const currentUser = auth.currentUser.uid;
  return update(ref(db), {
    [`users/${currentUser}/friends/${fromUid}`]: true,
    [`users/${fromUid}/friends/${currentUser}`]: true,
    [`users/${currentUser}/pendingRequests/${fromUid}`]: null,
    [`users/${fromUid}/pendingRequestsSent/${currentUser}`]: null
  });
}

export function rejectFriendRequest(fromUid){
  const currentUser = auth.currentUser.uid;
  return update(ref(db), {
    [`users/${currentUser}/pendingRequests/${fromUid}`]: null,
    [`users/${fromUid}/pendingRequestsSent/${currentUser}`]: null
  });
}

// ===================== GROUPS =====================
export function createGroup(name){
  const currentUser = auth.currentUser.uid;
  const newGroupRef = push(ref(db,'groups'));
  return set(newGroupRef,{
    name: name,
    members: { [currentUser]: true },
    createdAt: Date.now()
  });
}

// ===================== CHAT =====================
export function sendMessage(chatId,type,text){
  const currentUser = auth.currentUser.uid;
  const senderName = auth.currentUser.displayName || "Moi";
  const msgRef = type==="private"? push(ref(db,`privateChats/${[currentUser,chatId].sort().join("_")}`))
                                   : push(ref(db,`groups/${chatId}/messages`));
  return set(msgRef,{
    text: text,
    sender: currentUser,
    senderName: senderName,
    timestamp: Date.now()
  });
}

// Optionnel : écouter messages en temps réel
export function listenMessages(chatId,type,callback){
  const chatRef = type==="private"? ref(db,`privateChats/${[auth.currentUser.uid,chatId].sort().join("_")}`)
                                   : ref(db,`groups/${chatId}/messages`);
  onValue(chatRef,snap=>{
    const msgs = snap.val()||{};
    callback(msgs);
  });
  }
