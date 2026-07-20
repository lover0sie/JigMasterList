import {
  doc,
  setDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";
import { jigData } from "../data/jig.js";

export async function importJigs() {
  let uploaded = 0;
  let failed = 0;

  for (const jig of jigData) {
    try {
      if (!jig.jigId) {
        throw new Error("Missing jigId");
      }

      const jigRef = doc(db, "jigs", jig.jigId);

      await setDoc(
        jigRef,
        {
          no: Number(jig.no),
          jigId: jig.jigId,
          jigName: jig.jigName ?? "",
          description: jig.description ?? "",
          modelUsed: jig.modelUsed ?? "",
          quantity: Number(jig.quantity ?? 0),
          status: jig.status ?? "",
          location: jig.location ?? "",
          remarks: jig.remarks ?? "",

          lastUpdated: jig.lastUpdated
            ? Timestamp.fromDate(new Date(jig.lastUpdated))
            : null,

          creator: jig.creator ?? "Unknown"
        },
        { merge: true }
      );

      uploaded++;
      console.log(`Uploaded: ${jig.jigId}`);
    } catch (error) {
      failed++;

      console.error(
        `Failed: ${jig.jigId ?? "Unknown jig"}`,
        error
      );
    }
  }

  const result = {
    uploaded,
    failed,
    total: jigData.length
  };

  console.log(
    `Completed: ${uploaded} uploaded, ${failed} failed.`
  );

  return result;
}