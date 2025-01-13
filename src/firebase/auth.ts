import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { setUser, clearUser } from "../redux/userSlice.ts";
import app from "../firebaseConfig.ts";
import { useDispatch } from "react-redux";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Google Sign-In function
export const signInWithGoogle = async (dispatch: any) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create user document in Firestore if it doesn't exist
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Save user data to Firestore
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "anonymous@example.com",
        photoURL: user.photoURL || "https://example.com/default-avatar.png",
        createdAt: new Date(),
      });
    }

    // Dispatch user data to Redux store and save it to sessionStorage
    const userData = {
      uid: user.uid,
      displayName: user.displayName || "Anonymous",
      email: user.email || "anonymous@example.com",
      photoURL: user.photoURL || "https://example.com/default-avatar.png",
    };

    // Save user data to sessionStorage
    sessionStorage.setItem("user", JSON.stringify(userData));

    // Dispatch user data to Redux store
    dispatch(setUser(userData));

    return user;
  } catch (error) {
    console.error("Error signing in: ", error.message);
    return null;
  }
};

// Sign out function
export const logOut = async (dispatch: any) => {
  try {
    await signOut(auth);
    sessionStorage.removeItem("user"); // Remove user data from sessionStorage
    dispatch(clearUser());
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out: ", error.message);
  }
};

// Monitor user state
export const onUserStateChanged = (dispatch: any) => {
  // Check for user session in sessionStorage
  const storedUser = sessionStorage.getItem("user");

  if (storedUser) {
    dispatch(setUser(JSON.parse(storedUser)));
  }

  // Listen for changes in Firebase authentication state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "anonymous@example.com",
        photoURL: user.photoURL || "https://example.com/default-avatar.png",
      };

      // Save user data to sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userData));

      // Dispatch user data to Redux store
      dispatch(setUser(userData));
    } else {
      // Clear user session if no user is authenticated
      sessionStorage.removeItem("user");
      dispatch(clearUser());
    }
  });
};
