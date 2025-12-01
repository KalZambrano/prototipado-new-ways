type PasswordCode = `${string}-${string}-${string}-${string}-${string}`

export interface Usuarios{
    name: string;
    lastname: string;
    email: string;
    password: PasswordCode;
    dni: number
}

export interface Question {
    question: string;
    options: string[];
    correct: number;
    level: string;
    points: number;
};

export interface Answer {
    selected: number | null;
    correct: boolean;
    points: number;
}