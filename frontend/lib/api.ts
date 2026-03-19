const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiFetch<T = unknown>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        ...options,
        headers: {
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        throw new ApiError(res.status, body.error || `HTTP ${res.status}`);
    }

    return res.json();
}

export function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
    return apiFetch<T>(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export function apiPut<T = unknown>(path: string, body: unknown): Promise<T> {
    return apiFetch<T>(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export function apiDelete<T = unknown>(path: string): Promise<T> {
    return apiFetch<T>(path, { method: "DELETE" });
}
