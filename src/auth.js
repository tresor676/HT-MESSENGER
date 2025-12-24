import { auth } from "./firebase.js";
import { createUser } from "./users.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

export async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUser(cred.user.uid, email);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
