import { createContext, ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { firebase, auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    signInWithGoogle: () => Promise<void>;
    signOut: () => void;
    user: User | undefined;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const history = useHistory()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            const { displayName, photoURL, uid } = user

            if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.')
            }

            setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
            })
        }
        })

        return () => {
        unsubscribe();
        }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        const result = await auth.signInWithPopup(provider);

        if (result.user) {
        const { displayName, photoURL, uid } = result.user

        if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.')
        }

        setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
        })
        }
    }

    async function signOut() {
        auth.signOut()
        setUser(undefined)
        history.push('/')
    }

    return (
        <AuthContext.Provider value={{ signInWithGoogle, user, signOut }}>
            { children }
        </AuthContext.Provider>
    );
}