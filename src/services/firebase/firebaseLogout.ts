import { signOut } from "firebase/auth";
import { auth } from "./firebaseAuth";

export const logout = async () => {
    await signOut(auth);
};