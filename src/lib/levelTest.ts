import type { Answer, Question } from "@/types/global";

export const calculateLevel = (answers: Answer[], questions: Question[]) => {
    const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (totalPoints / maxPoints) * 100;

    let level = "";
    let description = "";
    let color = "";

    if (percentage >= 85) {
        level = "C2 - Maestría";
        description = "Tienes un dominio excepcional del inglés. Puedes comprender y expresarte en cualquier situación con fluidez y precisión.";
        color = "from-purple-500 to-pink-600";
    } else if (percentage >= 70) {
        level = "C1 - Avanzado";
        description = "Excelente nivel de inglés. Puedes comunicarte con fluidez en situaciones complejas y entender textos difíciles.";
        color = "from-indigo-500 to-purple-600";
    } else if (percentage >= 55) {
        level = "B2 - Intermedio Alto";
        description = "Buen dominio del inglés. Puedes interactuar con hablantes nativos con naturalidad y comprender textos complejos.";
        color = "from-blue-500 to-indigo-600";
    } else if (percentage >= 40) {
        level = "B1 - Intermedio";
        description = "Nivel intermedio sólido. Puedes desenvolverte en la mayoría de situaciones cotidianas y comprender textos claros.";
        color = "from-cyan-500 to-blue-600";
    } else if (percentage >= 25) {
        level = "A2 - Elemental";
        description = "Nivel básico consolidado. Puedes comunicarte en situaciones simples y familiares del día a día.";
        color = "from-green-500 to-cyan-600";
    } else {
        level = "A1 - Principiante";
        description = "Nivel inicial. Puedes comunicarte de forma básica en situaciones muy cotidianas. ¡Sigue practicando!";
        color = "from-yellow-500 to-green-600";
    }

    return { totalPoints, maxPoints, percentage, level, description, color };
};

export default calculateLevel;