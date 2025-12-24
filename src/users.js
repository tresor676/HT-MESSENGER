import { db } from "./firebase.js";
import { ref, set } from "firebase/database";

export function createUser(uid, email) {
  return set(ref(db, `users/${uid}`), {
    email,
    displayName: email.split("@")[0],
    photoURL: "",
    createdAt: Date.now()
  });
}
