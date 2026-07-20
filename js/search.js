import {
  collection,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

let cachedJigs = [];

/**
 * Loads jigs once and keeps them in memory for searching.
 */
export async function initialiseJigSearch() {
  const jigQuery = query(
    collection(db, "jigs"),
    orderBy("no","asc")   
  );

  const snapshot = await getDocs(jigQuery);

  cachedJigs = snapshot.docs.map(documentSnapshot => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data()
  }));

  return cachedJigs;
}

/**
 * Searches relevant jig fields using case-insensitive matching.
 */
export function searchJigs(searchText) {
  const keyword = String(searchText ?? "")
    .trim()
    .toLowerCase();

  if (!keyword) {
    return cachedJigs;
  }

  return cachedJigs.filter(jig => {
    const searchableValues = [
      jig.jigId,
      jig.location,
      jig.jigName,
      jig.description
    ];

    return searchableValues.some(value =>
      String(value ?? "")
        .toLowerCase()
        .includes(keyword)
    );
  });
}