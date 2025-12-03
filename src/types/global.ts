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

export interface Schedule {
  id: number;
  day: string; // e.g. "Lunes", "Lunes y Miércoles", etc.
  timeStart: string; // "08:00"
  time: string; // "08:00 - 10:00"
  capacity: number;
  modality: "presencial" | "virtual";
  level: string;
  teacher: string;
};