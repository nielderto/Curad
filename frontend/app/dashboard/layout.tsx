"use client";

import { authClient } from "@/lib/auth-client";
import { AuthContext } from "@/hooks/use-auth";
import LoadingScreen from "@/components/app-ui/LoadingScreen";
import Redirect from "@/components/app-ui/Redirect";
import Navbar from "@/components/app-ui/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="min-h-screen bg-neutral-950">
                <LoadingScreen />
            </div>
        );
    }

    if (!session) {
        return <Redirect to="/login" />;
    }

    const user = {
        id: session.user.id,
        name: session.user.name,
        username: (session.user as Record<string, unknown>).username as string || "",
        email: session.user.email,
    };

    return (
        <AuthContext value={user}>
            <div className="min-h-screen bg-neutral-950">
                <Navbar user={user} />
                {children}
            </div>
        </AuthContext>
    );
}
