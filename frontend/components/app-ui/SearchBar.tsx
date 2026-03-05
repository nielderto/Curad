"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const { debounced: debouncedSearch, cancel } = useDebouncedCallback(
        (value: string) => {
            if (value.trim()) {
                router.push(`/dashboard?search=${encodeURIComponent(value.trim())}`);
            } else {
                router.push("/dashboard");
            }
        },
        300
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        cancel();
        if (query.trim()) {
            router.push(`/dashboard?search=${encodeURIComponent(query.trim())}`);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <Input
                type="text"
                placeholder="Search posts..."
                value={query}
                onChange={handleChange}
                className="h-8 w-48 pl-8 text-sm bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus-visible:border-emerald-700 focus-visible:ring-emerald-700/20 focus-visible:w-64 transition-all duration-200"
            />
        </form>
    );
}
