import React, { useState } from "react";
// import { Calendar, Clock, Users, MapPin, BookOpen, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import {
  FaRegClock,
  FaPlus,
  FaPen,
  FaRegTrashAlt,
  FaSave,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FiMapPin, FiUsers, FiBookOpen } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";

import Swal from "sweetalert2";

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      day: "Lunes y Miércoles",
      time: "08:00 - 10:00 AM",
      capacity: 20,
      modality: "presencial",
      level: "A2",
    },
    {
      id: 2,
      day: "Martes y Jueves",
      time: "02:00 - 04:00 PM",
      capacity: 15,
      modality: "virtual",
      level: "B1",
    },
    {
      id: 3,
      day: "Viernes",
      time: "10:00 - 12:00 PM",
      capacity: 25,
      modality: "presencial",
      level: "C1",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    capacity: "",
    modality: "presencial",
    level: "A1",
  });

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const modalities = ["presencial", "virtual"];

  const openModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        day: schedule.day,
        time: schedule.time,
        capacity: schedule.capacity,
        modality: schedule.modality,
        level: schedule.level,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        day: "",
        time: "",
        capacity: "",
        modality: "presencial",
        level: "A1",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData({
      day: "",
      time: "",
      capacity: "",
      modality: "presencial",
      level: "A1",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.day || !formData.time || !formData.capacity) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor complete todos los campos",
      });
      return;
    }

    if (editingSchedule) {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === editingSchedule.id
            ? {
                ...formData,
                id: editingSchedule.id,
                capacity: parseInt(formData.capacity),
              }
            : schedule
        )
      );
    } else {
      const newSchedule = {
        ...formData,
        id:
          schedules.length > 0
            ? Math.max(...schedules.map((s) => s.id)) + 1
            : 1,
        capacity: parseInt(formData.capacity),
      };
      setSchedules([...schedules, newSchedule]);
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
          text: "El horario ha sido eliminado.",
          icon: "success",
        });
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
      }
    });
    // if (window.confirm("¿Estás seguro de eliminar este horario?")) {
      
    // }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case "presencial":
        return "bg-blue-100 text-blue-700";
      case "virtual":
        return "bg-green-100 text-green-700";
      case "híbrido":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      A1: "bg-yellow-100 text-yellow-700",
      A2: "bg-orange-100 text-orange-700",
      B1: "bg-cyan-100 text-cyan-700",
      B2: "bg-blue-100 text-blue-700",
      C1: "bg-indigo-100 text-indigo-700",
      C2: "bg-purple-100 text-purple-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestión de Horarios
              </h1>
              <p className="text-gray-600">
                Administra los horarios de clases de inglés
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <FaPlus className="w-5 h-5" />
              Nuevo Horario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-white">
                    <LuCalendarDays className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">{schedule.day}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                      schedule.level
                    )}`}
                  >
                    {schedule.level}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaRegClock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{schedule.time}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <FiUsers className="w-5 h-5 text-green-500" />
                  <span>
                    Capacidad:{" "}
                    <span className="font-semibold">{schedule.capacity}</span>{" "}
                    estudiantes
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-purple-500" />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getModalityColor(
                      schedule.modality
                    )}`}
                  >
                    {schedule.modality.charAt(0).toUpperCase() +
                      schedule.modality.slice(1)}
                  </span>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => openModal(schedule)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPen className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaRegTrashAlt className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {schedules.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay horarios registrados
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza agregando un nuevo horario
            </p>
            <button
              onClick={() => openModal()}
              className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <FaPlus className="w-5 h-5" />
              Agregar Horario
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingSchedule ? "Editar Horario" : "Nuevo Horario"}
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Día(s) de la semana
                  </label>
                  <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    placeholder="Ej: Lunes y Miércoles"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horario
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="Ej: 08:00 - 10:00 AM"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Número de estudiantes"
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modalidad
                  </label>
                  <select
                    name="modality"
                    value={formData.modality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  >
                    {modalities.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod.charAt(0).toUpperCase() + mod.slice(1)}
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
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
                    {editingSchedule ? "Guardar Cambios" : "Crear Horario"}
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

export default ScheduleManager;
