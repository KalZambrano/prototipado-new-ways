import React, { useState } from "react";
//import {  X, CheckCircle } from 'lucide-react';
import { ImCross } from "react-icons/im";
import {
  FaRegFileAlt,
  FaPlus,
  FaPen,
  FaRegTrashAlt,
  FaSave,
  FaBookOpen,
  FaHeadphones,
  FaEye,
  FaRegCheckCircle,
} from "react-icons/fa";

import Swal from "sweetalert2";
const EnglishTestGestor = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "She ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      correct: 1,
      level: "A1",
      type: "gramática",
      points: 1,
    },
    {
      id: 2,
      question: "If it ___ tomorrow, we'll stay home.",
      options: ["rain", "rains", "will rain", "rained"],
      correct: 1,
      level: "B1",
      type: "gramática",
      points: 3,
    },
    {
      id: 3,
      question:
        "Listen to the audio: 'I went to the park yesterday.' What did the person do?",
      options: [
        "Went to the beach",
        "Went to the park",
        "Stayed home",
        "Went shopping",
      ],
      correct: 1,
      level: "A2",
      type: "listening",
      points: 2,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    level: "A1",
    type: "gramática",
    points: 1,
  });

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const types = ["gramática", "listening", "reading"];
  const [filterType, setFilterType] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const openModal = (question: any = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question: question.question,
        options: [...question.options],
        correct: question.correct,
        level: question.level,
        type: question.type,
        points: question.points,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        level: "A1",
        type: "gramática",
        points: 1,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "correct" || name === "points" ? parseInt(value) : value,
    }));
  };

  const handleOptionChange = ({
    index,
    value,
  }: {
    index: number;
    value: string;
  }) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleSubmit = () => {
    if (!formData.question || formData.options.some((opt) => !opt)) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor complete todos los campos",
      });
      return;
    }

    if (editingQuestion) {
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Pregunta actualizada exitosamente",
      });
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? { ...formData, id: editingQuestion.id }
            : q
        )
      );
    } else {
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Pregunta creada exitosamente",
      });
      const newQuestion = {
        ...formData,
        id:
          questions.length > 0
            ? Math.max(...questions.map((q) => q.id)) + 1
            : 1,
      };
      setQuestions([...questions, newQuestion]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, ¡eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Eliminado!",
          text: "La pregunta ha sido eliminada.",
          icon: "success",
        });
        setQuestions(questions.filter((q) => q.id !== id));
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gramática":
        return <FaBookOpen className="w-5 h-5" />;
      case "listening":
        return <FaHeadphones className="w-5 h-5" />;
      case "reading":
        return <FaEye className="w-5 h-5" />;
      default:
        return <FaRegFileAlt className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "gramática":
        return "bg-blue-100 text-blue-700";
      case "listening":
        return "bg-purple-100 text-purple-700";
      case "reading":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-yellow-100 text-yellow-700",
      A2: "bg-orange-100 text-orange-700",
      B1: "bg-cyan-100 text-cyan-700",
      B2: "bg-blue-100 text-blue-700",
      C1: "bg-indigo-100 text-indigo-700",
      C2: "bg-purple-100 text-purple-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  const filteredQuestions = questions.filter((q) => {
    const typeMatch = filterType === "all" || q.type === filterType;
    const levelMatch = filterLevel === "all" || q.level === filterLevel;
    return typeMatch && levelMatch;
  });

  const exportToJSON = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "preguntas-nivel.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestión de Pruebas de Nivel
              </h1>
              <p className="text-gray-600">
                Administra las preguntas del test de nivel de inglés
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToJSON}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <FaRegFileAlt className="w-5 h-5" />
                Exportar JSON
              </button>
              <button
                onClick={() => openModal()}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <FaPlus className="w-5 h-5" />
                Nueva Pregunta
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm font-semibold text-gray-700 mr-2">
                Tipo:
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mr-2">
                Nivel:
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold">{filteredQuestions.length}</span>{" "}
              preguntas
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="flex">
                <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-6 flex flex-col items-center justify-center min-w-[120px]">
                  <div className="text-white mb-2">
                    {getTypeIcon(question.type)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                      question.level
                    )}`}
                  >
                    {question.level}
                  </span>
                  <div className="text-white text-sm mt-2 font-semibold">
                    {question.points} pts
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                          question.type
                        )} mb-3`}
                      >
                        {getTypeIcon(question.type)}
                        {question.type.charAt(0).toUpperCase() +
                          question.type.slice(1)}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${
                          index === question.correct
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {index === question.correct && (
                            <FaRegCheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span
                            className={
                              index === question.correct
                                ? "text-green-700 font-semibold"
                                : "text-gray-600"
                            }
                          >
                            {option}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(question)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPen className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaRegTrashAlt className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaRegFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay preguntas registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando una nueva pregunta
            </p>
            <button
              onClick={() => openModal()}
              className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <FaPlus className="w-5 h-5" />
              Agregar Pregunta
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-6 text-white sticky top-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingQuestion ? "Editar Pregunta" : "Nueva Pregunta"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                  >
                    <ImCross className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nivel
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Puntos
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pregunta
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Escribe la pregunta aquí..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Opciones de respuesta
                  </label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="font-semibold text-gray-600 w-8">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          placeholder={`Opción ${index + 1}`}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="radio"
                          name="correct"
                          checked={formData.correct === index}
                          onChange={() =>
                            setFormData((prev) => ({ ...prev, correct: index }))
                          }
                          className="w-5 h-5 text-blue-600 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selecciona el círculo de la respuesta correcta
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSave className="w-5 h-5" />
                    {editingQuestion ? "Guardar Cambios" : "Crear Pregunta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishTestGestor;
