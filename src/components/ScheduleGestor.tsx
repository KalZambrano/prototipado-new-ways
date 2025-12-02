import React, { useEffect, useState } from "react";
import {
  FaRegClock,
  FaPlus,
  FaPen,
  FaRegTrashAlt,
  FaSave,
  FaUserTie,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { FiMapPin, FiUsers, FiBookOpen } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import Swal from "sweetalert2";

import type { Schedule } from "@/types/global";

/**
 * Schedule shape
 */


const initialSchedules: Schedule[] = [
  {
    id: 1,
    day: "Lunes y Miércoles",
    timeStart: "08:00",
    time: "08:00 - 10:00",
    capacity: 20,
    modality: "presencial",
    level: "A2",
    teacher: "María González",
  },
  {
    id: 2,
    day: "Martes y Jueves",
    timeStart: "14:00",
    time: "14:00 - 16:00",
    capacity: 20,
    modality: "virtual",
    level: "B1",
    teacher: "Carlos Ramírez",
  },
  {
    id: 3,
    day: "Viernes",
    timeStart: "10:00",
    time: "10:00 - 12:00",
    capacity: 25,
    modality: "presencial",
    level: "C1",
    teacher: "Ana Patricia Silva",
  },
];

const daysOptions = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Lunes y Miércoles",
  "Martes y Jueves",
];

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const modalities = ["presencial", "virtual"];
const teachers = [
  "María González",
  "Carlos Ramírez",
  "Ana Patricia Silva",
  "Roberto Fernández",
  "Lucía Martínez",
  "Diego Torres",
  "Sofía Mendoza",
  "Javier Castillo",
  "Patricia Rojas",
  "Miguel Ángel Vargas",
];

const ScheduleManager: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    try {
      const raw = localStorage.getItem("schedules");
      if (raw) {
        const parsed = JSON.parse(raw) as Schedule[];
        // ensure fallback shape for older data
        return parsed.map((s, idx) =>
          s.timeStart
            ? s
            : { ...s, timeStart: s.time?.split(" - ")[0] ?? "08:00" }
        );
      }
    } catch {
      // ignore parse error
    }
    return initialSchedules;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [formData, setFormData] = useState({
    day: "",
    timeStart: "",
    time: "",
    capacity: "",
    modality: "presencial",
    level: "A1",
    teacher: "",
  });

  // persist schedules to localStorage whenever change
  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  // helper: add two hours to a "HH:MM" string and return "HH:MM"
  const addTwoHours = (time: string) => {
    if (!time) return "";
    const [hh, mm] = time.split(":").map((n) => parseInt(n, 10));
    let newH = hh + 2;
    if (newH >= 24) newH = newH - 24;
    return `${String(newH).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  const autoGenerateTime = (start: string) => {
    if (!start) return "";
    const end = addTwoHours(start);
    return `${start} - ${end}`;
  };

  // parse "HH:MM" into minutes since midnight
  const timeToMinutes = (t: string) => {
    const [hh, mm] = t.split(":").map((n) => parseInt(n, 10));
    return hh * 60 + mm;
  };

  // returns true if newItem conflicts with any existing schedules (same teacher & overlapping day/time)
  const isScheduleConflict = (
    newItem: { day: string; timeStart: string; time: string; teacher: string },
    schedulesList: Schedule[],
    editingId: number | null = null
  ) => {
    if (!newItem.teacher) return false;

    // days of new item (split by " y ")
    const newDays = newItem.day.split(" y ").map((d) => d.trim());

    const newStart = timeToMinutes(newItem.timeStart);
    const newEnd = timeToMinutes(addTwoHours(newItem.timeStart)); // end = start + 2h

    return schedulesList.some((s) => {
      if (editingId && s.id === editingId) return false;
      if (s.teacher !== newItem.teacher) return false;

      const existingDays = s.day.split(" y ").map((d) => d.trim());
      // check if any day intersects
      const dayOverlap = existingDays.some((d) => newDays.includes(d));
      if (!dayOverlap) return false;

      const sStart = timeToMinutes(s.timeStart);
      const sEnd = timeToMinutes(addTwoHours(s.timeStart));

      // overlap if intervals intersect
      const overlap = newStart < sEnd && sStart < newEnd;
      return overlap;
    });
  };

  const openModal = (schedule: Schedule | null = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        day: schedule.day,
        timeStart: schedule.timeStart,
        time: schedule.time,
        capacity: String(schedule.capacity),
        modality: schedule.modality,
        level: schedule.level,
        teacher: schedule.teacher,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        day: "",
        timeStart: "",
        time: "",
        capacity: "",
        modality: "presencial",
        level: "A1",
        teacher: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFormData({
      day: "",
      timeStart: "",
      time: "",
      capacity: "",
      modality: "presencial",
      level: "A1",
      teacher: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // if timeStart changes, auto generate time and keep in sync
    if (name === "timeStart") {
      setFormData((prev) => ({
        ...prev,
        timeStart: value,
        time: autoGenerateTime(value),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // basic validation
    if (
      !formData.day ||
      !formData.timeStart ||
      !formData.capacity ||
      !formData.teacher
    ) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor complete todos los campos obligatorios (Día, Hora de inicio, Docente, Capacidad).",
      });
      return;
    }

    if (parseInt(formData.capacity) < 20) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "La capacidad debe ser mayor a 20.",
      });
      return;
    }

    // construct new item
    const newItem = {
      day: formData.day,
      timeStart: formData.timeStart,
      time: formData.time, // already generated
      teacher: formData.teacher,
    };

    // check conflict
    const conflict = isScheduleConflict(
      newItem,
      schedules,
      editingSchedule ? editingSchedule.id : null
    );

    if (conflict) {
      Swal.fire({
        icon: "error",
        title: "Conflicto de horario",
        text: "El docente ya tiene una clase en ese día/hora. Revisa el horario o elige otro docente.",
      });
      return;
    }

    // proceed to save (edit or create)
    if (editingSchedule) {
      const updated = schedules.map((s) =>
        s.id === editingSchedule.id
          ? {
              ...s,
              day: formData.day,
              timeStart: formData.timeStart,
              time: formData.time,
              capacity: parseInt(formData.capacity, 10),
              modality: formData.modality as Schedule["modality"],
              level: formData.level,
              teacher: formData.teacher,
            }
          : s
      );
      setSchedules(updated);
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Horario actualizado exitosamente",
      });
    } else {
      const newSchedule: Schedule = {
        id:
          schedules.length > 0
            ? Math.max(...schedules.map((s) => s.id)) + 1
            : 1,
        day: formData.day,
        timeStart: formData.timeStart,
        time: formData.time,
        capacity: parseInt(formData.capacity, 10),
        modality: formData.modality as Schedule["modality"],
        level: formData.level,
        teacher: formData.teacher,
      };
      setSchedules((prev) => [...prev, newSchedule]);
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Horario creado exitosamente",
      });
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
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        Swal.fire({
          title: "¡Eliminado!",
          text: "El horario ha sido eliminado.",
          icon: "success",
        });
      }
    });
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case "presencial":
        return "bg-blue-100 text-blue-700";
      case "virtual":
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

  // quick helper to reset localStorage (optional, useful while testing)
  const resetStorage = () => {
    Swal.fire({
      title: "Restaurar valores iniciales?",
      text: "Esto reemplazará los horarios guardados en el localStorage.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, restaurar",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("schedules");
        setSchedules(initialSchedules);
        Swal.fire("Restaurado", "Los horarios se restauraron.", "success");
      }
    });
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
              <p className="text-gray-600">Administra los horarios de clases</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetStorage}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Restaurar iniciales
              </button>
              <button
                onClick={() => openModal()}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <FaPlus className="w-5 h-5" />
                Nuevo Horario
              </button>
            </div>
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
                  <FaUserTie className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">{schedule.teacher}</span>
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
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
                    Día(s) de la semana *
                  </label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  >
                    <option value="">Seleccione...</option>
                    {daysOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora de inicio *
                  </label>
                  <input
                    type="time"
                    name="timeStart"
                    value={formData.timeStart}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    La hora final se genera automáticamente (+2 horas).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Docente *
                  </label>
                  <select
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-black"
                  >
                    <option value="">Seleccione...</option>
                    {teachers.map((teacher, index) => (
                      <option key={index} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Número de estudiantes"
                    min="20"
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
