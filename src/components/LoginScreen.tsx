import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  key?: string;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [dni, setDni] = useState('');
  const [nombres, setNombres] = useState('');
  const [email, setEmail] = useState('');
  
  const [errors, setErrors] = useState<{ dni?: string; nombres?: string; email?: string }>({});

  const validate = (): boolean => {
    const tempErrors: typeof errors = {};
    
    // DNI validation: only digits.
    // In Peru, DNI has 8 digits, but let's allow general numbers just in case, but validate they are only digits.
    if (!dni) {
      tempErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d+$/.test(dni)) {
      tempErrors.dni = 'El DNI debe contener solo números';
    } else if (dni.length < 8) {
      tempErrors.dni = 'El DNI suele tener al menos 8 dígitos';
    }

    // Name validation
    if (!nombres.trim()) {
      tempErrors.nombres = 'Nombres y Apellidos son obligatorios';
    } else if (nombres.trim().length < 4) {
      tempErrors.nombres = 'Ingresa tu nombre y apellido completo';
    }

    // Email validation
    if (!email) {
      tempErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'El formato de correo no es válido';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onLogin({
        dni: dni.trim(),
        nombres: nombres.trim(),
        email: email.trim().toLowerCase(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md px-4 py-8 mx-auto"
      id="login-screen-container"
    >
      {/* Peruvian Ribbon Accent */}
      <div className="flex h-1.5 w-full rounded-t-lg overflow-hidden">
        <div className="bg-red-600 flex-1"></div>
        <div className="bg-white flex-1"></div>
        <div className="bg-red-600 flex-1"></div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        {/* Corporate Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-50 text-blue-800 font-display font-black text-2xl px-4 py-2 rounded-lg tracking-wider mb-2 border border-blue-100">
            JJC
          </div>
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            CONTRATISTAS GENERALES S.A.
          </p>
          <h2 className="text-2xl font-display font-bold text-slate-800 mt-4 tracking-tight">
            Fiestas Patrias JJC
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gran Recorrido de Estaciones 🇵🇪
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {/* Input Nombres y Apellidos */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block" htmlFor="nombres-input">
              Nombres y Apellidos
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <UserIcon size={18} />
              </span>
              <input
                id="nombres-input"
                type="text"
                placeholder="Ej. Juan Pérez Quispe"
                value={nombres}
                onChange={(e) => {
                  setNombres(e.target.value);
                  if (errors.nombres) setErrors({ ...errors, nombres: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white ${
                  errors.nombres
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50'
                }`}
              />
            </div>
            {errors.nombres && (
              <p className="text-xs font-medium text-red-500 pl-1" id="nombres-error">
                {errors.nombres}
              </p>
            )}
          </div>

          {/* Input DNI */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block" htmlFor="dni-input">
              DNI (Solo números)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <CreditCard size={18} />
              </span>
              <input
                id="dni-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="Ej. 45678912"
                value={dni}
                onChange={(e) => {
                  // Only allow digits
                  const val = e.target.value.replace(/\D/g, '');
                  setDni(val);
                  if (errors.dni) setErrors({ ...errors, dni: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white ${
                  errors.dni
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50'
                }`}
              />
            </div>
            {errors.dni && (
              <p className="text-xs font-medium text-red-500 pl-1" id="dni-error">
                {errors.dni}
              </p>
            )}
          </div>

          {/* Input Correo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 block" htmlFor="email-input">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                id="email-input"
                type="email"
                placeholder="Ej. juan.perez@jjc.com.pe"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-none focus:bg-white ${
                  errors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-500 pl-1" id="email-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full mt-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Ingresar
            <ChevronRight size={18} />
          </button>
        </form>

        {/* Footer Notes */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Completa las 6 estaciones escaneando los códigos QR correspondientes para participar del gran sorteo de Fiestas Patrias.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
