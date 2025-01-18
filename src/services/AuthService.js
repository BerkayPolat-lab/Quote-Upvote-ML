import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "../config/fireBaseConfig";

const auth = getAuth(app);

const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
}
;

const getCurrentUser = () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => resolve(user));
    });
};

export default { login, logout, getCurrentUser };

