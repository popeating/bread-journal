import { db } from './config';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export async function createUserDocument(user) {
  if (!user) return;

  // Reference to the user document
  const userRef = doc(db, 'users', user.uid);

  try {
    // Check if user document already exists
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user document if it doesn't exist
      const userData = {
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        displayName: user.displayName,
        displayNameLower: user.displayName.toLowerCase(),
        photoURL: user.photoURL || null,
        recipeCount: 0,
        publicRecipes: 0,
        lastActive: new Date().toISOString(),
        confirmed: user.authMethod === 'google' ? 1 : 0,
        verificationToken: user.verificationToken || '',
        description: null,
        authMethod: user.authMethod,
      };

      await setDoc(userRef, userData);
      return userData;
    }

    return userSnap.data();
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function isDisplayNameAvailable(displayName) {
  if (!displayName) return false;

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('displayName', '==', displayName));
  const querySnapshot = await getDocs(q);

  return querySnapshot.empty;
}

export async function updateUserProfile(userId, data) {
  const userRef = doc(db, 'users', userId);

  // If updating display name, also update the lowercase version
  if (data.displayName) {
    data.displayNameLower = data.displayName.toLowerCase();
  }

  await setDoc(
    userRef,
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
