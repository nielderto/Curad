"use client";

import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar({ user }: { user: { name: string; username: string; email: string } }) {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
                <Link href="/dashboard" className="text-xl font-bold text-white hover:text-emerald-400 transition-colors">
                    Curat
                </Link>

                <div className="flex items-center gap-3">
                    <SearchBar />
                    <Link href="/dashboard/new">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Write
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer">
                                <Image
                                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.username || user.email}`}
                                    alt="avatar"
                                    width={32}
                                    height={32}
                                    className="rounded-full bg-neutral-800"
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-neutral-900 border-neutral-800">
                            <Link href={`/dashboard/profile/${user.username}`} className="block px-2 py-1.5 hover:bg-neutral-800 rounded-sm transition-colors">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-neutral-500">@{user.username}</p>
                            </Link>
                            <DropdownMenuSeparator className="bg-neutral-800" />
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-neutral-800 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
