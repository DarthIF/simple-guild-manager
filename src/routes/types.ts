interface Member {
    id: string;
    name: string;
    power: number;
}

interface Team {
    id: string;
    name: string;
    members: Member[];
}

interface AppData {
    members: Member[];
    teams: Team[];
}