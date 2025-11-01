type PasswordCode = `${string}-${string}-${string}-${string}-${string}`

export interface Usuarios{
    name: string;
    lastname: string;
    email: string;
    password: PasswordCode;
    dni: number
}