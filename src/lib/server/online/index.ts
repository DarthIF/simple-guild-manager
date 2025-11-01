const currentOnline = new Set<string>()


export function getOnlineCount(): number {
    return currentOnline.size
}

export function getOnlineUsers(): string[] {
    return [...currentOnline]
}

export function setUserOnline(username: string, online: boolean) {
    if (online)
        currentOnline.add(username)
    else
        currentOnline.delete(username)
}