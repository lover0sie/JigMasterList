import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { app, db } from "./firebase.js";

export const auth = getAuth(app);

/**
 * Converts an employee ID into the internal Firebase email.
 */
function employeeIdToEmail(employeeId) {
  const cleanId = employeeId.trim().toLowerCase();

  if (!cleanId) {
    throw new Error("Employee ID is required.");
  }

  return `${cleanId}@drmsa.com`;
}

/**
 * Signs in using employee ID and PIN.
 */
export async function loginEmployee(employeeId, pin) {
  const email = employeeIdToEmail(employeeId);

  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    pin
  );

  const employeeRef = doc(
    db,
    "employees",
    credential.user.uid
  );

  const employeeSnapshot = await getDoc(employeeRef);

  if (!employeeSnapshot.exists()) {
    await signOut(auth);
    throw new Error("Employee profile was not found.");
  }

  const employee = employeeSnapshot.data();

  if (employee.active !== true) {
    await signOut(auth);
    throw new Error("This employee account is inactive.");
  }

  return {
    uid: credential.user.uid,
    ...employee
  };
}

export async function logoutEmployee() {
  await signOut(auth);
}

export function watchAuthentication(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Loads the Firestore employee profile for the current user.
 */
export async function getCurrentEmployee() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const employeeSnapshot = await getDoc(
    doc(db, "employees", user.uid)
  );

  if (!employeeSnapshot.exists()) {
    return null;
  }

  return {
    uid: user.uid,
    ...employeeSnapshot.data()
  };
}