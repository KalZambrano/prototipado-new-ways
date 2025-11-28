import React, { useState, useEffect } from "react";
import { FaRegCreditCard } from "react-icons/fa6";
import { FiSmartphone } from "react-icons/fi";
import { FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { MdLockOutline } from "react-icons/md";

const PaymentInterface: React.FC = () => {
  const [step, setStep] = useState("selection"); // selection, form, processing, success, error
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processingTime, setProcessingTime] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [localData, setLocalData] = useState<Array<any> | null>(null);

  useEffect(() => {
    // Verificar si estamos en el cliente antes de acceder a 'window'
    if (typeof window !== "undefined" && window.localStorage) {
      const schedule = localStorage.getItem("schedules");
      setLocalData(JSON.parse(schedule!));
    }
  }, []);

  // console.log(localData);

  const [formData, setFormData] = useState({
    // Visa/Mastercard
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    // Yape
    phoneNumber: "",
    yapeCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const enrollmentData = {
    course: "Curso de Inglés - Nivel A2",
    amount: 350.0,
  };

  const paymentMethods = [
    {
      id: "visa",
      name: "Visa",
      icon: FaRegCreditCard,
      color: "from-blue-600 to-blue-700",
      description: "Tarjeta de crédito o débito",
    },
    {
      id: "mastercard",
      name: "Mastercard",
      icon: FaRegCreditCard,
      color: "from-red-600 to-orange-600",
      description: "Tarjeta de crédito o débito",
    },
    {
      id: "yape",
      name: "Yape",
      icon: FiSmartphone,
      color: "from-purple-600 to-pink-600",
      description: "Pago móvil instantáneo",
    },
  ];

  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
    setStep("form");
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19) return;
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "phoneNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 9);
    } else if (name === "yapeCode") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "visa" || paymentMethod === "mastercard") {
      if (
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, "").length !== 16
      ) {
        newErrors.cardNumber = "Número de tarjeta inválido (16 dígitos)";
      }
      if (!formData.cardName || formData.cardName.length < 3) {
        newErrors.cardName = "Nombre completo requerido";
      }
      if (!formData.expiryDate || formData.expiryDate.length !== 5) {
        newErrors.expiryDate = "Fecha inválida (MM/AA)";
      }
      if (!formData.cvv || formData.cvv.length !== 3) {
        newErrors.cvv = "CVV inválido (3 dígitos)";
      }
    } else if (paymentMethod === "yape") {
      if (!formData.phoneNumber || formData.phoneNumber.length !== 9) {
        newErrors.phoneNumber = "Número de celular inválido (9 dígitos)";
      }
      if (!formData.yapeCode || formData.yapeCode.length !== 6) {
        newErrors.yapeCode = "Código Yape inválido (6 dígitos)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = () => {
    if (!validateForm()) return;

    setStep("processing");
    const startTime = Date.now();
    const generatedTxId =
      "TXN-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 9).toUpperCase();
    setTransactionId(generatedTxId);

    const interval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setProcessingTime(parseFloat(elapsed));
    }, 100);

    // Simular procesamiento (RNF10.2: ≤ 10 segundos)
    const processingDelay = Math.random() * 3000 + 2000; // 2-5 segundos

    setTimeout(() => {
      clearInterval(interval);
      const finalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      setProcessingTime(parseFloat(finalTime));

      // Simular 95% éxito, 5% error
      if (Math.random() > 0.05) {
        setStep("success");
      } else {
        setStep("error");
      }
    }, processingDelay);
  };

  const resetPayment = () => {
    setStep("selection");
    setPaymentMethod("");
    setProcessingTime(0);
    setTransactionId("");
    setFormData({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      phoneNumber: "",
      yapeCode: "",
    });
    setErrors({});
  };

  // Pantalla de selección de método de pago
  if (step === "selection") {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Proceso de Matrícula
            </h1>
            <p className="text-gray-600">
              Completa tu pago para finalizar la inscripción
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Selecciona tu método de pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => selectPaymentMethod(method.id)}
                  className={`p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Resumen de Matrícula
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Curso:</span>
                <span className="font-semibold text-gray-800">
                  {enrollmentData.course}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Horario:</span>
                <ul className="flex flex-col gap-y-2">
                  {localData?.map((local) => (
                    <li className="font-semibold text-gray-800 flex-wrap bg-gray-200 rounded-xl px-3 py-1">
                      {local.day} {local.time}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
                <span className="text-lg font-bold text-gray-800">
                  Total a pagar:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  S/ {enrollmentData.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de pago
  if (step === "form") {
    const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);

    return (
      selectedMethod && (
        <div className="min-h-screen p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full bg-linear-to-br ${selectedMethod.color} flex items-center justify-center`}
                >
                  <selectedMethod.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedMethod.name}
                  </h2>
                  <p className="text-gray-600">
                    Monto: S/ {enrollmentData.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 flex items-start gap-3">
                <MdLockOutline className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-semibold">
                    Pago seguro
                  </p>
                  <p className="text-sm text-yellow-700">
                    Tus datos están protegidos con encriptación SSL
                  </p>
                </div>
              </div>

              {(paymentMethod === "visa" || paymentMethod === "mastercard") && (
                <div className="space-y-4">
                  <div>
                    <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.cardNumber
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="JUAN PEREZ GOMEZ"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors uppercase ${
                        errors.cardName
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.cvv
                            ? "border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "yape" && (
                <div className="space-y-4">
                  <div>
                    <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                      Número de celular
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="987654321"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="bMdlockOutline text-sm font-semibold text-gray-700 mb-2">
                      Código de confirmación Yape
                    </label>
                    <input
                      type="text"
                      name="yapeCode"
                      value={formData.yapeCode}
                      onChange={handleInputChange}
                      placeholder="123456"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.yapeCode
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.yapeCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.yapeCode}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Ingresa el código de 6 dígitos de tu app Yape
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={resetPayment}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={processPayment}
                  className={`flex-1 bg-linear-to-r ${selectedMethod.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all`}
                >
                  Pagar S/ {enrollmentData.amount.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  // Procesando pago
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <FaRegClock className="absolute inset-0 m-auto w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Procesando pago...
          </h2>
          <p className="text-gray-600 mb-6">
            Por favor espera mientras confirmamos tu transacción
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">ID de Transacción</p>
            <p className="font-mono text-sm font-semibold text-blue-600">
              {transactionId}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Tiempo transcurrido</p>
            <p className="text-2xl font-bold text-gray-800">
              {processingTime.toFixed(1)}s
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tiempo máximo: 10 segundos (RNF10.2)
            </p>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Estado:</span> Pago pendiente de
              confirmación bancaria (RNF10.1)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pago exitoso
  if (step === "success") {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <FaRegCheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Pago realizado con éxito!
          </h2>
          <p className="text-gray-600 mb-8">Tu matrícula ha sido confirmada</p>

          <div className="bg-green-50 rounded-lg p-6 mb-6 text-left space-y-3">
            <div>
              <p className="text-sm text-gray-600">ID de Transacción</p>
              <p className="font-mono text-sm font-semibold text-green-700">
                {transactionId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto pagado</p>
              <p className="text-xl font-bold text-gray-800">
                S/ {enrollmentData.amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Método de pago</p>
              <p className="font-semibold text-gray-800 capitalize">
                {paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiempo de procesamiento</p>
              <p className="font-semibold text-gray-800">
                {processingTime.toFixed(2)} segundos
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              ✓ Confirmación de pago procesada en {processingTime.toFixed(2)}s
              (RNF10.2: ≤ 10s)
            </p>
            <p className="text-sm text-blue-800">
              ✓ Transacción registrada exitosamente (RNF10.1)
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Recibirás un correo de confirmación con los detalles de tu
              matrícula
            </p>
            <button
              onClick={resetPayment}
              className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error en el pago
  if (step === "error") {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <IoMdAlert className="w-12 h-12 text-red-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Pago no completado
          </h2>
          <p className="text-gray-600 mb-8">
            Hubo un problema al procesar tu pago
          </p>

          <div className="bg-red-50 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Posibles causas:
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Fondos insuficientes</li>
              <li>Datos incorrectos</li>
              <li>Problema de conexión bancaria</li>
              <li>Tarjeta bloqueada o vencida</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">ID de Transacción (fallida)</p>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {transactionId}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep("form")}
              className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Intentar nuevamente
            </button>
            <button
              onClick={resetPayment}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cambiar método de pago
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentInterface;
