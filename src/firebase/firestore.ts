import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { app } from './init';
import { Drink } from '../types';

export const db = getFirestore(app);

export const ensureUserDocument = async (googleId: string, email: string, displayName: string, photoURL?: string) => {
  const userRef = doc(db, 'users', googleId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      googleId,
      email,
      displayName,
      photoURL: photoURL || null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  return userRef;
};

export const fetchUserDrinks = async (googleId: string): Promise<Drink[]> => {
  const drinksCol = collection(db, 'drinks');
  const q = query(drinksCol, where('userId', '==', googleId));
  const snap = await getDocs(q);
  const drinks: Drink[] = [];
  snap.forEach((doc) => {
    const d = doc.data() as any;
    drinks.push({
      id: doc.id,
      name: d.name,
      volumeMl: d.volumeMl,
      abv: d.abv,
      timestamp: d.timestamp,
      icon: d.icon,
      type: d.type,
      isChug: d.isChug
    } as Drink);
  });
  return drinks;
};

export const addDrinkForUser = async (googleId: string, drink: Drink) => {
  const drinksCol = collection(db, 'drinks');
  const payload = {
    userId: googleId,
    ...drink
  };
  // @ts-ignore
  const docRef = await addDoc(drinksCol, payload);
  return docRef.id;
};

export const subscribeToDrinks = (googleId: string, cb: (drinks: Drink[]) => void) => {
  const drinksCol = collection(db, 'drinks');
  const q = query(drinksCol, where('userId', '==', googleId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const drinks: Drink[] = [];
    snapshot.forEach((doc) => {
      const d = doc.data() as any;
      drinks.push({
        id: doc.id,
        name: d.name,
        volumeMl: d.volumeMl,
        abv: d.abv,
        timestamp: d.timestamp,
        icon: d.icon,
        type: d.type,
        isChug: d.isChug
      } as Drink);
    });
    cb(drinks);
  });
  return unsubscribe;
};
