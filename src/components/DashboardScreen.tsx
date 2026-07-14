import React from 'react';
import { Station, User } from '../types';
import { Check, QrCode, LogOut, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardScreenProps {
  user: User;
  stations: Station[];
  onScanStation: (station: Station) => void;
  onSubmitRaffle: () => void;
  onLogout: () => void;
  isSendingEmail: boolean;
  key?: string;
}

export default function DashboardScreen({
  user,
  stations,
  onScanStation,
  onSubmitRaffle,
  onLogout,
  isSendingEmail,
}: DashboardScreenProps) {
  const completedCount = stations.filter((s) => s.completed).length;
  const isFullyCompleted = completedCount === stations.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md px-6 sm:px-8 py-4 mx-auto space-y-4"
      id="dashboard-screen-container"
    >
      {/* Header Profile Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">¡Hola, bienvenido! 👋</p>
          <h3 className="font-display font-bold text-base text-slate-800 leading-tight">
            {user.nombres}
          </h3>
          <p className="text-[9px] font-mono text-slate-500 bg-slate-100 inline-block px-1.5 py-0.5 rounded">
            DNI: {user.dni}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-red-100"
          title="Salir de la sesión"
          id="logout-btn"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative stripe */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-800/20 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-display font-black text-lg tracking-tight">Tu Recorrido</h4>
            <p className="text-[10px] text-blue-200 mt-0.5">Completa las {stations.length} estaciones</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-black">{completedCount}</span>
            <span className="font-mono text-blue-300 text-xs">/{stations.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="w-full bg-blue-950/80 rounded-full h-2 overflow-hidden p-0.5 border border-blue-800/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / stations.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-gradient-to-r from-blue-400 to-sky-400 h-full rounded-full"
            />
          </div>
          <div className="flex justify-between text-[9px] text-blue-200 font-medium">
            <span>Inicio</span>
            <span>{Math.round((completedCount / stations.length) * 100)}% Completado</span>
            <span>Sorteo 🎁</span>
          </div>
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
          Estaciones de Validación
        </h4>
        
        <div className="grid grid-cols-2 gap-3" id="stations-grid">
          {stations.map((station) => (
            <motion.button
              key={station.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onScanStation(station)}
              className={`relative rounded-2xl p-3.5 border text-left flex flex-col justify-between h-[92px] sm:h-[104px] transition-all cursor-pointer ${
                station.completed
                  ? 'bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-900/15'
                  : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-sm'
              }`}
              id={`station-card-${station.id}`}
            >
              {/* Card Header ID Badge */}
              <div className="flex justify-between items-center w-full">
                <span
                  className={`text-[10px] font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    station.completed ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {station.id}
                </span>

                {station.completed ? (
                  <span className="bg-emerald-500 text-white p-0.5 rounded-full">
                    <Check size={10} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="bg-slate-50 text-slate-400 p-0.5 rounded-full border border-slate-100">
                    <QrCode size={10} />
                  </span>
                )}
              </div>

              {/* Card Body Information */}
              <div className="mt-2">
                <h5 className="font-display font-bold text-xs sm:text-sm tracking-tight leading-none">
                  Estación {station.name}
                </h5>
                <p
                  className={`text-[9px] mt-1 font-medium leading-none ${
                    station.completed ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {station.completed ? '¡Completada!' : 'Pendiente'}
                </p>
              </div>

              {/* Status color bar indicating status */}
              <div
                className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-t-full ${
                  station.completed ? 'bg-blue-400' : 'bg-slate-200'
                }`}
              ></div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Raffle submit action container */}
      <div className="pt-1">
        {isFullyCompleted ? (
          <motion.button
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            onClick={onSubmitRaffle}
            disabled={isSendingEmail}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-5 rounded-2xl shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-xs sm:text-sm tracking-wide"
            id="enter-raffle-btn"
          >
            {isSendingEmail ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando Registro...
              </>
            ) : (
              <>
                Ingresar al Sorteo
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        ) : (
          <div
            className="w-full bg-slate-200 text-slate-400 font-semibold py-3 px-5 rounded-2xl flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-not-allowed border border-slate-300/40"
            id="enter-raffle-disabled"
            title={`Completa las ${stations.length} estaciones para habilitar esta opción`}
          >
            <Lock size={14} />
            Ingresar al Sorteo
          </div>
        )}
        <p className="text-[9px] text-center text-slate-400 mt-1.5 leading-normal">
          {!isFullyCompleted
            ? `Debes registrar la visita a las ${stations.length} estaciones con tu cámara para poder habilitar el sorteo.`
            : '¡Estaciones completadas! Haz clic para registrar tus datos en el sorteo.'}
        </p>
      </div>

    </motion.div>
  );
}
