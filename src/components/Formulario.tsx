import Swal from "sweetalert2";

function MiFormulario() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // …validación, por ejemplo:
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Campos incompletos",
      });
      return;
    }

    try {
      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Sesión iniciada.",
      });
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "Algo salió mal",
        text: "Inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div
        style={{ animation: "slideInFromLeft 1s ease-out" }}
        className="w-full bg-linear-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden py-12 px-24 space-y-8"
      >
        <h2
          style={{ animation: "appear 2s ease-out" }}
          className="text-center text-4xl font-extrabold text-white"
        >
          Bienvenido
        </h2>
        <p
          style={{ animation: "appear 3s ease-out" }}
          className="text-center text-gray-200"
        >
          Inicia sesión para continuar
        </p>

        <form
        onSubmit={handleSubmit}
          action="#"
          className="space-y-6"
        >
          {/* Email */}
          <div className="relative">
            <input
              placeholder="john@example.com"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              id="email"
              name="email"
              type="email"
            />
            <label
              htmlFor="email"
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2
            peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Correo electrónico
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              placeholder="Password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              id="password"
              name="password"
              type="password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2
            peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Contraseña
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center text-gray-300">
          No tienes una cuenta?{" "}
          <a className="text-purple-300 hover:underline" href="/signup">
            Registrate
          </a>
        </div>
      </div>
  );
}

export default MiFormulario;
