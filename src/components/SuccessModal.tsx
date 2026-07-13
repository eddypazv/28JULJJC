import { User } from '../types';
import { CheckCircle2, Mail, Award, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface SuccessModalProps {
  user: User;
  isMock: boolean;
  emailJSConfig: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  onRestart: () => void;
  key?: string;
}

export default function SuccessModal({ user, isMock, emailJSConfig, onRestart }: SuccessModalProps) {
  const isUsingPlaceholders = 
    emailJSConfig.serviceId.includes('YOUR_') || 
    emailJSConfig.templateId.includes('YOUR_') || 
    emailJSConfig.publicKey.includes('YOUR_');

  return (
    <div
      className="fixed inset-0 bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
      id="success-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col my-auto"
        id="success-modal-body"
      >
        {/* Banner with Peruvian colors and award icon */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 px-6 py-8 text-center text-white relative">
          {/* Subtle flag background element */}
          <div className="absolute top-0 inset-x-0 h-1.5 flex">
            <div className="bg-red-600 flex-1"></div>
            <div className="bg-white flex-1"></div>
            <div className="bg-red-600 flex-1"></div>
          </div>

          <div className="inline-flex items-center justify-center bg-blue-800/50 p-4 rounded-full mb-3 border border-white/10">
            <Award size={48} className="text-amber-400 animate-pulse" />
          </div>
          <h3 className="font-display font-black text-2xl tracking-tight">
            ¡Ingreso Exitoso al Sorteo!
          </h3>
          <p className="text-xs text-blue-200 mt-1 uppercase tracking-widest font-mono">
            Fiestas Patrias JJC 2026
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 leading-relaxed">
              Felicitaciones, <strong className="font-semibold text-slate-900">{user.nombres}</strong>. Has completado exitosamente las 4 estaciones de la cartilla.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-100 mt-2">
              <CheckCircle2 size={14} />
              Datos enviados a la organización
            </div>
          </div>

          {/* User Details Panel */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Resumen de Registro Enviado:
            </h4>
            
            <div className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Colaborador:</span>
              <span className="col-span-2 text-slate-900 font-bold">{user.nombres}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">DNI:</span>
              <span className="col-span-2 text-slate-900 font-mono font-bold">{user.dni}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs py-1">
              <span className="text-slate-500 font-medium">Correo:</span>
              <span className="col-span-2 text-slate-900 font-mono font-medium">{user.email}</span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <Mail size={12} className="text-blue-800" />
              <span>Destinatario principal: <strong className="font-semibold text-slate-700">eddy.paz@jjc.com.pe</strong></span>
            </div>
          </div>

          {/* EmailJS Credentials & Dev Assistance Box */}
          {isMock && (
            <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/60 space-y-3">
              <div className="flex items-center gap-1.5 text-amber-800">
                <AlertTriangle size={16} className="shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Nota de Configuración para el Desarrollador</h4>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                El envío real de correo se simuló correctamente porque el código utiliza las claves demostrativas de EmailJS.
              </p>
              <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-xl border border-amber-200/40 space-y-2 leading-relaxed">
                <p className="font-medium text-slate-800">Para activar el envío real de correos:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Regístrate gratis en <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold inline-flex items-center gap-0.5 hover:underline">emailjs.com <ExternalLink size={10} /></a>.</li>
                  <li>Crea un servicio de correo (Service ID) y una plantilla (Template ID).</li>
                  <li>Reemplaza los valores en el archivo <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">/src/App.tsx</code> con tus credenciales reales de EmailJS.</li>
                </ol>
              </div>
            </div>
          )}

          {!isMock && !isUsingPlaceholders && (
            <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 text-center">
              <p className="text-[11px] text-green-800 leading-normal font-medium">
                ¡Conexión real establecida! El correo electrónico ha sido procesado mediante tu servicio EmailJS de forma segura desde el cliente.
              </p>
            </div>
          )}

          {/* Reset Action */}
          <div className="pt-2">
            <button
              onClick={onRestart}
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="restart-session-btn"
            >
              <RotateCcw size={16} />
              Registrar Nuevo Participante
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
