// Safe Firebase mock for static deployment
export const auth = null as any;
export const googleProvider = null as any;

export const signInWithGoogle = async () => {
  console.warn('Firebase not available in static mode');
};

export const logout = async () => {};

export const onAuthStateChanged = (_auth: any, callback: (user: any) => void) => {
  callback(null);
  return () => {};
};

export type User = any;
