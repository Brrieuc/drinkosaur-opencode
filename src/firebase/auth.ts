import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { app } from './init';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (e) {
    console.error('Google sign-in error', e);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Sign-out error', e);
  }
};

export const onAuthStateChangedListener = (cb: (u: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};
