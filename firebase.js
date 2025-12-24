// Importer Firebase SDK modulaire
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, push, onValue, update, remove } from "firebase/database";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC2WG-135oKY_s6xf5-nBBhxncNV9UayQ0",
  authDomain: "tresor-ae58e.firebaseapp.com",
  databaseURL: "https://tresor-ae58e-default-rtdb.firebaseio.com",
  projectId: "tresor-ae58e",
  storageBucket: "tresor-ae58e.appspot.com",
  messagingSenderId: "835562519447",
  appId: "1:835562519447:web:e4032e73f7601ba3c522d2"
};

// Initialiser Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

//////////////////////////
// Fonctions utilitaires
//////////////////////////

// Créer profil utilisateur
export function createUserProfile(uid, username, email){
  return set(ref(db, 'users/' + uid), {
    username: username,
    email: email,
    friends: {},
    pendingRequests: {},
    pendingRequestsSent: {}
  });
}

// Envoyer demande d'ami
export function sendFriendRequest(targetUid){
  const currentUser = auth.currentUser.uid;
  // Ajouter dans pendingRequests de la cible
  return set(ref(db, `users/${targetUid}/pendingRequests/${currentUser}`), true)
    .then(() => {
      // Ajouter dans pendingRequestsSent de l'utilisateur actuel
      return set(ref(db, `users/${currentUser}/pendingRequestsSent/${targetUid}`), true);
    });
}

// Accepter demande d'ami
export function acceptFriendRequest(fromUid){
  const currentUser = auth.currentUser.uid;
  // Ajouter aux amis
  update(ref(db, `users/${currentUser}/friends/${fromUid}`), true);
  update(ref(db, `users/${fromUid}/friends/${currentUser}`), true);
  // Retirer de pendingRequests
  remove(ref(db, `users/${currentUser}/pendingRequests/${fromUid}`));
  remove(ref(db, `users/${fromUid}/pendingRequestsSent/${currentUser}`));
}

// Refuser demande d'ami
export function rejectFriendRequest(fromUid){
  const currentUser = auth.currentUser.uid;
  remove(ref(db, `users/${currentUser}/pendingRequests/${fromUid}`));
  remove(ref(db, `users/${fromUid}/pendingRequestsSent/${currentUser}`));
}

// Créer un groupe
export function createGroup(name){
  const currentUser = auth.currentUser.uid;
  const newGroupRef = push(ref(db, 'groups'));
  return set(newGroupRef, {
    name: name,
    members: { [currentUser]: true },
    createdAt: Date.now()
  });
}

// Envoyer un message (privé ou groupe)
export function sendMessage(chatId, type, text){
  const currentUser = auth.currentUser.uid;
  const senderName = auth.currentUser.displayName || "Moi";
  const msgRef = type === "private" 
    ? push(ref(db, `privateChats/${chatId}`)) 
    : push(ref(db, `groups/${chatId}/messages`));
  
  return set(msgRef, {
    text: text,
    sender: currentUser,
    senderName: senderName,
    timestamp: Date.now()
  });
}

// Écouter messages en temps réel
export function listenMessages(chatId, type, callback){
  const chatRef = type === "private"
    ? ref(db, `privateChats/${chatId}`)
    : ref(db, `groups/${chatId}/messages`);
  
  onValue(chatRef, snapshot => {
    const messages = snapshot.val() || {};
    callback(messages);
  });
}
