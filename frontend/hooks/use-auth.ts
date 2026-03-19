"use client";

import { createContext, useContext } from "react";

export interface AuthUser {
    id: string;
    name: string;
    username: string;
    email: string;
}

export const AuthContext = createContext<AuthUser | null>(null);

export function useAuth(): AuthUser {
    const user = useContext(AuthContext);
    if (!user) {
        throw new Error("useAuth must be used within an authenticated dashboard layout");
    }
    return user;
}
