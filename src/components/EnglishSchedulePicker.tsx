import React, { useState } from "react";
import Swal from "sweetalert2";
// import { Calendar, Clock, Users, Video, MapPin, CheckCircle2 } from 'lucide-react';
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

export default function EnglishSchedulePicker() {
  // const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedModality, setSelectedModality] = useState("");
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [step, setStep] = useState(1);

  //   const levels = [
  //     { id: 'basic1', name: 'Basic 1', description: 'Principiante absoluto' },
  //     { id: 'basic2', name: 'Basic 2', description: 'Principiante' },
  //     { id: 'intermediate1', name: 'Intermediate 1', description: 'Intermedio' },
  //     { id: 'intermediate2', name: 'Intermediate 2', description: 'Intermedio alto' },
  //     { id: 'advanced1', name: 'Advanced 1', description: 'Avanzado' },
  //     { id: 'advanced2', name: 'Advanced 2', description: 'Avanzado superior' },
  //   ];

  const modalities = [
    {
      id: "presencial",
      name: "Presencial",
      icon: FaMapMarkerAlt,
      color: "bg-blue-500",
    },
    { id: "virtual", name: "Virtual", icon: FaVideo, color: "bg-purple-500" },
  ];

  const schedules = [
    {
      id: 1,
      day: "Lunes y Miércoles",
      time: "08:00 - 10:00 AM",
      capacity: "15/20",
      modality: "presencial",
    },
    {
      id: 2,
      day: "Lunes y Miércoles",
      time: "06:00 - 08:00 PM",
      capacity: "18/20",
      modality: "presencial",
    },
    {
      id: 3,
      day: "Martes y Jueves",
      time: "10:00 AM - 12:00 PM",
      capacity: "12/20",
      modality: "virtual",
    },
    {
      id: 4,
      day: "Martes y Jueves",
      time: "07:00 - 09:00 PM",
      capacity: "16/20",
      modality: "virtual",
    },
    {
      id: 5,
      day: "Miércoles y Viernes",
      time: "02:00 - 04:00 PM",
      capacity: "10/20",
      modality: "presencial",
    },
    {
      id: 6,
      day: "Sábado",
      time: "09:00 AM - 01:00 PM",
      capacity: "14/20",
      modality: "presencial",
    },
    {
      id: 7,
      day: "Sábado",
      time: "02:00 - 06:00 PM",
      capacity: "8/20",
      modality: "virtual",
    },
    {
      id: 8,
      day: "Domingo",
      time: "10:00 AM - 02:00 PM",
      capacity: "11/20",
      modality: "virtual",
    },
  ];

  const toggleSchedule = (scheduleId) => {
    setSelectedSchedules((prev) => {
      if (prev.includes(scheduleId)) {
        return prev.filter((id) => id !== scheduleId);
      }
      return [...prev, scheduleId];
    });
  };

  const filteredSchedules = selectedModality
    ? schedules.filter((s) => s.modality === selectedModality)
    : schedules;

  const canProceed = () => {
    // if (step === 1) return selectedLevel;
    if (step === 1) return selectedModality;
    if (step === 2) return selectedSchedules.length > 0;
    return false;
  };

  const getSelectedScheduleDetails = () => {
    return schedules.filter((s) => selectedSchedules.includes(s.id));
  };

  const cleanSelectedSchedules = () => {
    setStep(Math.max(1, step - 1));
    if (step === 2) setSelectedSchedules([]);
  };

  const successMessage = () => {
    Swal.fire({
      icon: "success",
      title: "¡Listo!",
      text: "Matricula completada Exitosamente!",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-800">New Ways</h1>
          <p className="text-slate-600 mt-1">Diseña tu horario perfecto</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {num}
                </div>
                <span
                  className={`ml-3 font-medium ${
                    step >= num ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {/* {num === 1 && 'Nivel'} */}
                  {num === 1 && "Modalidad"}
                  {num === 2 && "Horario"}
                  {num === 3 && "Confirmar"}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step > num ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Level Selection */}
        {/* {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Selecciona tu nivel de inglés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedLevel === level.id
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="text-lg font-bold text-slate-800">{level.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{level.description}</p>
                  {selectedLevel === level.id && (
                    <FaCheckCircle className="w-6 h-6 text-blue-600 mt-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Step 2: Modality Selection */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Elige tu modalidad preferida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modalities.map((modality) => {
                const Icon = modality.icon;
                return (
                  <button
                    key={modality.id}
                    onClick={() => setSelectedModality(modality.id)}
                    className={`p-8 rounded-xl border-2 transition-all ${
                      selectedModality === modality.id
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div
                        className={`size-16 ${modality.color} rounded-full flex items-center justify-center mb-4`}
                      >
                        <Icon className="size-8 text-white" />
                      </div>
                      {selectedModality === modality.id && (
                        <FaCheckCircle className="size-8 text-blue-600 mt-4" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {modality.name}
                    </h3>
                    <p className="text-slate-600 mt-2">
                      {modality.id === "presencial"
                        ? "Clases en nuestras instalaciones con profesores certificados"
                        : "Clases en vivo desde la comodidad de tu hogar"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Schedule Selection */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Selecciona tus horarios disponibles
            </h2>
            <p className="text-slate-600 mb-6">
              Puedes elegir múltiples opciones según tu disponibilidad
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedules.map((schedule) => {
                const isSelected = selectedSchedules.includes(schedule.id);
                const [current, total] = schedule.capacity.split("/");
                const percentage = (parseInt(current) / parseInt(total)) * 100;

                return (
                  <button
                    key={schedule.id}
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FaCalendarAlt className="w-5 h-5 text-slate-600" />
                          <h3 className="font-bold text-slate-800">
                            {schedule.day}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaClock className="w-4 h-4" />
                          <span className="text-sm">{schedule.time}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <FaCheckCircle className="w-6 h-6 text-blue-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUsers className="w-4 h-4 text-slate-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Disponibilidad</span>
                          <span>{schedule.capacity}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage > 80
                                ? "bg-red-500"
                                : percentage > 50
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Confirma tu matrícula
            </h2>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Resumen de tu selección
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaCheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Nivel</p>
                      <p className="font-semibold text-slate-800">Advanced 2</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      {selectedModality === "presencial" ? (
                        <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                      ) : (
                        <FaVideo className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Modalidad</p>
                      <p className="font-semibold text-slate-800 capitalize">
                        {selectedModality}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Horarios seleccionados
                </h3>
                <div className="space-y-3">
                  {getSelectedScheduleDetails().map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg"
                    >
                      <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          {schedule.day}
                        </p>
                        <p className="text-sm text-slate-600">
                          {schedule.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={successMessage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
            >
              Confirmar Matrícula
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="max-w-5xl mx-auto mt-12 flex justify-between">
          <button
            onClick={cleanSelectedSchedules}
            disabled={step === 1}
            className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Anterior
          </button>

          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={!canProceed()}
            className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
          >
            {step === 3 ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
