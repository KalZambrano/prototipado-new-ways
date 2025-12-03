import { useState, useEffect } from "react";

export function PaymentCard() {
  const [scheduleData, setScheduleData] = useState<string | null>(null);

  // 2. Usar useEffect para acceder a localStorage una vez que el componente se monta
  useEffect(() => {
    // Verificar si estamos en el cliente antes de acceder a 'window'
    if (typeof window !== "undefined" && window.localStorage) {
      const schedule = localStorage.getItem("myschedule");
      setScheduleData(JSON.parse(schedule!));
    }
  }, []);

  return (
    <div className="rounded-xl bg-white p-8 shadow-2xl hover:-translate-y-1 transition-all">
      <div className="size-16 flex items-center justify-center mb-6 text-2xl bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl">
        💵
      </div>
      <span className="font-bold text-2xl">Pago</span>
      <p className="my-4 [&>strong]:text-red-500">
        Realiza el pago correspondiente a tu matricula para comenzar el curso
        <strong> Recuerda escoger tu horario con anterioridad</strong>
      </p>

      <a
        href={`${scheduleData ? "/user/payment" : "/schedule"}`}
        className={`${
          scheduleData ? "bg-green-500 cursor-pointer" : "cursor-not-allowed"
        } text-white py-3.5 px-7 rounded-xl inline-block hover:scale-105 transition-all font-semibold`}
      >
        Realizar Pago
      </a>
    </div>
  );
}
