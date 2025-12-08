import React, { useState, useEffect } from "react";

import { CiSearch, CiFilter, CiCircleAlert,  } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { BsClock, BsBook } from "react-icons/bs";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { MdClose } from "react-icons/md";

// Simulación de datos
const generateMockData = () => {
  const courses = ["Matemáticas", "Lenguaje", "Ciencias", "Inglés", "Historia"];
  const levels = [
    "A1 - Principiante",
    "A2 - Principiante",
    "B1 - Intermedio",
    "B2 - Intermedio",
    "C1 - Avanzado",
    "C2 - Avanzado",
  ];
  const schedules = ["Mañana (8:00-13:00)", "Tarde (13:00-18:00)"];

  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    section: `Sección ${String.fromCharCode(65 + (i % 4))}`,
    course: courses[i % courses.length],
    level: levels[i % levels.length],
    schedule: schedules[i % schedules.length],
    enrolled: Math.floor(Math.random() * 35) + 5,
    capacity: 35,
    status: null,
  })).map((item) => ({
    ...item,
    status:
      item.enrolled < 10 ? "low" : item.enrolled >= 30 ? "high" : "normal",
  }));
};

const EnrollmentSectionView = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Simulación de carga de datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simular delay de red (menos de 3 segundos según RNF11.1)
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Simular posible error (descomenta para probar)
        // throw new Error('Error al conectar con la base de datos');

        const mockData = generateMockData();
        setData(mockData);
        setFilteredData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      loadData();
    }
  }, [isAuthenticated, isAdmin]);

  // Aplicar filtros
  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCourse) {
      result = result.filter((item) => item.course === selectedCourse);
    }

    if (selectedLevel) {
      result = result.filter((item) => item.level === selectedLevel);
    }

    if (selectedSchedule) {
      result = result.filter((item) => item.schedule === selectedSchedule);
    }

    setFilteredData(result);
  }, [searchTerm, selectedCourse, selectedLevel, selectedSchedule, data]);

  // Obtener valores únicos para filtros
  const uniqueCourses = [...new Set(data.map((item) => item.course))];
  const uniqueLevels = [...new Set(data.map((item) => item.level))];
  const uniqueSchedules = [...new Set(data.map((item) => item.schedule))];

  // Calcular estadísticas
  const stats = {
    total: filteredData.length,
    lowDemand: filteredData.filter((d) => d.status === "low").length,
    highDemand: filteredData.filter((d) => d.status === "high").length,
    totalEnrolled: filteredData.reduce((sum, d) => sum + d.enrolled, 0),
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedLevel("");
    setSelectedSchedule("");
  };

  const hasActiveFilters =
    searchTerm || selectedCourse || selectedLevel || selectedSchedule;

  // RNF11.3: Control de acceso
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CiCircleAlert className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sesión no iniciada
          </h2>
          <p className="text-gray-600 mb-6">
            Debe iniciar sesión para acceder a esta vista.
          </p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CiCircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">
            No tiene permisos para visualizar esta información. Esta vista está
            disponible únicamente para usuarios con rol de Administrador.
          </p>
          <button
            onClick={() => setIsAdmin(true)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Simular Acceso Admin
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Cargando matrículas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CiCircleAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo cargar la información de matrículas. Por favor, intente
            nuevamente.
          </p>
          <p className="text-sm text-gray-500 mb-6">Detalles: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No hay matrículas registradas
          </h2>
          <p className="text-gray-600">
            Actualmente no existen matrículas en ninguna sección.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Matrículas por Sección
          </h1>
          <p className="text-gray-600">
            Gestión y monitoreo de demanda por curso, nivel y horario
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Secciones</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <FiUsers className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matriculados</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalEnrolled}
                </p>
              </div>
              <BsBook className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Baja Demanda</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.lowDemand}
                </p>
              </div>
              <HiTrendingDown className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Demanda</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.highDemand}
                </p>
              </div>
              <HiTrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <CiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por curso, sección o nivel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <CiFilter className="w-5 h-5" />
              Filtros
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {
                    [selectedCourse, selectedLevel, selectedSchedule].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los cursos</option>
                    {uniqueCourses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los niveles</option>
                    {uniqueLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario
                  </label>
                  <select
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los horarios</option>
                    {uniqueSchedules.map((schedule) => (
                      <option key={schedule} value={schedule}>
                        {schedule}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                  >
                    <MdClose className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabla de matrículas */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600">
              No hay matrículas que coincidan con los filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sección
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matriculados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.section}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BsBook className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {item.course}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BsClock className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {item.schedule}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900 mr-2">
                            {item.enrolled}/{item.capacity}
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.status === "low"
                                  ? "bg-orange-500"
                                  : item.status === "high"
                                  ? "bg-purple-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${
                                  (item.enrolled / item.capacity) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.status === "low" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <HiTrendingDown className="w-3 h-3 mr-1" />
                            Baja demanda
                          </span>
                        )}
                        {item.status === "high" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <HiTrendingUp className="w-3 h-3 mr-1" />
                            Alta demanda
                          </span>
                        )}
                        {item.status === "normal" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leyenda */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Criterios de demanda:
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>
                Baja demanda: {"<"} 10 matriculados (considerar cierre)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Normal: 10-29 matriculados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span>
                Alta demanda: ≥ 30 matriculados (considerar nueva sección)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSectionView;
