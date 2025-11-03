import { useState } from 'react';
// import { CheckCircle, XCircle, Award, BookOpen } from 'lucide-react';
import { FaAward } from 'react-icons/fa';
import { FiBookOpen } from "react-icons/fi";

const EnglishLevelTest = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    // A1 - Básico
    {
      question: "Hello! My name ___ Maria.",
      options: ["is", "am", "are", "be"],
      correct: 0,
      level: "A1",
      points: 1
    },
    {
      question: "I ___ a student.",
      options: ["is", "am", "are", "be"],
      correct: 1,
      level: "A1",
      points: 1
    },
    {
      question: "She ___ to school every day.",
      options: ["go", "goes", "going", "gos"],
      correct: 1,
      level: "A1",
      points: 1
    },
    // A2 - Elemental
    {
      question: "Yesterday, I ___ to the cinema.",
      options: ["go", "goes", "went", "going"],
      correct: 2,
      level: "A2",
      points: 2
    },
    {
      question: "There ___ many people at the party last night.",
      options: ["was", "were", "is", "are"],
      correct: 1,
      level: "A2",
      points: 2
    },
    {
      question: "I ___ English for two years.",
      options: ["study", "am studying", "have studied", "studied"],
      correct: 2,
      level: "A2",
      points: 2
    },
    // B1 - Intermedio
    {
      question: "If it ___ tomorrow, we'll stay at home.",
      options: ["rain", "rains", "will rain", "rained"],
      correct: 1,
      level: "B1",
      points: 3
    },
    {
      question: "The book ___ by millions of people worldwide.",
      options: ["has read", "has been read", "have been read", "reads"],
      correct: 1,
      level: "B1",
      points: 3
    },
    {
      question: "I wish I ___ more time to travel.",
      options: ["have", "had", "will have", "having"],
      correct: 1,
      level: "B1",
      points: 3
    },
    // B2 - Intermedio Alto
    {
      question: "By this time next year, I ___ my degree.",
      options: ["will complete", "will have completed", "complete", "am completing"],
      correct: 1,
      level: "B2",
      points: 4
    },
    {
      question: "She's used to ___ early in the morning.",
      options: ["wake up", "waking up", "wakes up", "woke up"],
      correct: 1,
      level: "B2",
      points: 4
    },
    {
      question: "The manager insisted that the report ___ by Friday.",
      options: ["is finished", "be finished", "will be finished", "was finished"],
      correct: 1,
      level: "B2",
      points: 4
    },
    // C1 - Avanzado
    {
      question: "___ had I arrived home when the phone rang.",
      options: ["Barely", "Hardly", "Scarcely", "No sooner"],
      correct: 3,
      level: "C1",
      points: 5
    },
    {
      question: "The company's profits have increased, ___ the economic downturn.",
      options: ["despite", "although", "in spite", "notwithstanding"],
      correct: 3,
      level: "C1",
      points: 5
    },
    {
      question: "She is known for her ___ attention to detail.",
      options: ["meticulous", "careful", "precise", "exact"],
      correct: 0,
      level: "C1",
      points: 5
    },
    // C2 - Maestría
    {
      question: "The politician's speech was full of ___ statements that meant nothing concrete.",
      options: ["vague", "ambiguous", "platitudinous", "unclear"],
      correct: 2,
      level: "C2",
      points: 6
    },
    {
      question: "His argument was so ___ that even skeptics were convinced.",
      options: ["compelling", "strong", "cogent", "forceful"],
      correct: 2,
      level: "C2",
      points: 6
    },
    {
      question: "___ the circumstances, I believe we made the right decision.",
      options: ["Given", "Considering", "In light of", "Taking into account"],
      correct: 0,
      level: "C2",
      points: 6
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, { 
      selected: selectedAnswer, 
      correct: isCorrect,
      points: isCorrect ? questions[currentQuestion].points : 0
    }];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateLevel = () => {
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

//   const restart = () => {
//     setStarted(false);
//     setCurrentQuestion(0);
//     setAnswers([]);
//     setShowResults(false);
//     setSelectedAnswer(null);
//   };

  if (!started) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center text-black">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center">
          <FiBookOpen className="size-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Test de Nivel de Inglés</h1>
          <p className="text-lg text-gray-600 mb-8">
            Descubre tu nivel de inglés según el Marco Común Europeo de Referencia (MCER)
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Instrucciones:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• El test contiene 40 preguntas de diferentes niveles</li>
              <li>• Las preguntas van de principiante (A1) a maestría (C2)</li>
              <li>• Responde con honestidad para obtener un resultado preciso</li>
              <li>• Al final conocerás tu nivel estimado de inglés</li>
            </ul>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Comenzar Test
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateLevel();
    const correctAnswers = answers.filter(a => a.correct).length;
    
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <FaAward className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Test Completado!</h2>
            <p className="text-gray-600">Tu nivel de inglés es:</p>
          </div>

          <div className={`bg-linear-to-r ${results.color} rounded-xl p-8 text-white mb-6`}>
            <div className="text-center">
              <p className="text-4xl font-bold mb-4">{results.level}</p>
              <p className="text-lg mb-4">{results.description}</p>
              <div className="bg-white/20 rounded-lg p-4 inline-block">
                <p className="text-sm mb-1">Puntuación obtenida</p>
                <p className="text-3xl font-bold">{results.totalPoints} / {results.maxPoints}</p>
                <p className="text-sm mt-1">{correctAnswers} de {questions.length} respuestas correctas</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Desglose por Nivel</h3>
            <div className="grid grid-cols-2 gap-3">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => {
                const levelQuestions = questions.filter(q => q.level === lvl);
                const correctInLevel = levelQuestions.filter((q, idx) => 
                  answers[questions.indexOf(q)]?.correct
                ).length;
                return (
                  <div key={lvl} className="bg-white p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{lvl}</span>
                      <span className="text-sm text-gray-600">
                        {correctInLevel}/{levelQuestions.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <a
            href='/user'
            className="bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all px-4 block w-full text-center"
          >
            Revisar nuevas funcionalidades
          </a>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Pregunta {currentQuestion + 1} de 40
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-linear-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all text-black ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnglishLevelTest;