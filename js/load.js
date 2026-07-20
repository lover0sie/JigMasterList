import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

export async function loadJigs() {
  const snapshot = await getDocs(
    collection(db, "jigs")
  );

  const jigs = snapshot.docs.map(documentSnapshot => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data()
  }));

  console.table(jigs);

  return jigs;
}