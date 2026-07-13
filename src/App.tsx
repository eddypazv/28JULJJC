import { useState, useEffect } from 'react';
import { User, Station, EmailJSConfig } from './types';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import ScannerModal from './components/ScannerModal';
import SuccessModal from './components/SuccessModal';
import Confetti from './components/Confetti';
import emailjs from '@emailjs/browser';
import { Sparkles, HelpCircle, Check, Award, Mail, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const INITIAL_STATIONS: Station[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `Estación ${i + 1}`,
  completed: false,
  completedAt: null,
}));

export default function App() {
  // Application states
  const [user, setUser] = useState<User | null>(null);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [activeStationToScan, setActiveStationToScan] = useState<Station | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isMock, setIsMock] = useState(false);

  // EmailJS state
  const [emailJSConfig, setEmailJSConfig] = useState<EmailJSConfig>({
    serviceId: 'service_9h0njy4', // Replace with EmailJS Service ID
    templateId: 'template_9f1i8e4', // Replace with EmailJS Template ID
    publicKey: 'rtYLv9rifxkw3vMcF', // Replace with EmailJS Public Key
  });

  // State initialization from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('jjc_user');
      const storedStations = localStorage.getItem('jjc_stations');
      const storedEmailJS = localStorage.getItem('jjc_email_config');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedStations) {
        setStations(JSON.parse(storedStations));
      }
      if (storedEmailJS) {
        setEmailJSConfig(JSON.parse(storedEmailJS));
      }
    } catch (err) {
      console.error('Error recovering state from localStorage:', err);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('jjc_user', JSON.stringify(newUser));
    // Reset stations when a brand new participant logs in
    const freshStations = [...INITIAL_STATIONS];
    setStations(freshStations);
    localStorage.setItem('jjc_stations', JSON.stringify(freshStations));
  };

  const handleScanSuccess = (scannedCode: string) => {
    if (!activeStationToScan) return;

    const updatedStations = stations.map((s) => {
      if (s.id === activeStationToScan.id) {
        return {
          ...s,
          completed: true,
          completedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    setStations(updatedStations);
    localStorage.setItem('jjc_stations', JSON.stringify(updatedStations));
    setActiveStationToScan(null);
  };

  const handleUpdateEmailJSConfig = (newConfig: EmailJSConfig) => {
    setEmailJSConfig(newConfig);
    localStorage.setItem('jjc_email_config', JSON.stringify(newConfig));
  };

  const handleSendRaffleEmail = async () => {
    if (!user) return;
    setIsSendingEmail(true);

    // Verify if default placeholder values are being used
    const isUsingPlaceholders =
      emailJSConfig.serviceId === 'YOUR_SERVICE_ID' ||
      emailJSConfig.templateId === 'YOUR_TEMPLATE_ID' ||
      emailJSConfig.publicKey === 'YOUR_PUBLIC_KEY';

    const emailParams = {
      user_name: user.nombres,
      user_dni: user.dni,
      user_email: user.email,
      to_email: 'eddy.paz@jjc.com.pe',
      subject: `Participante del Sorteo Fiestas Patrias JJC: ${user.nombres}`,
      message: `El colaborador ${user.nombres} con DNI N° ${user.dni} y correo ${user.email} ha completado exitosamente las 6 estaciones de la Cartilla Fiestas Patrias JJC 2026.`,
    };

    if (isUsingPlaceholders) {
      // Simulate real-world EmailJS delay for testing
      setTimeout(() => {
        setIsSendingEmail(false);
        setIsMock(true);
        setShowSuccessModal(true);
      }, 1500);
    } else {
      try {
        // Send email with real user-configured EmailJS keys
        await emailjs.send(
          emailJSConfig.serviceId,
          emailJSConfig.templateId,
          emailParams,
          emailJSConfig.publicKey
        );
        setIsSendingEmail(false);
        setIsMock(false);
        setShowSuccessModal(true);
      } catch (err) {
        console.error('EmailJS Send error:', err);
        // If there's an error in real keys, notify and fallback gracefully to simulation
        alert(
          'Ocurrió un error al enviar el correo real de EmailJS. Por favor, revisa tus llaves o consola. Activaremos el modo de prueba para que puedas completar tu flujo sin problemas.'
        );
        setIsSendingEmail(false);
        setIsMock(true);
        setShowSuccessModal(true);
      }
    }
  };

  const handleRestartSession = () => {
    localStorage.removeItem('jjc_user');
    localStorage.removeItem('jjc_stations');
    setUser(null);
    setStations(INITIAL_STATIONS);
    setShowSuccessModal(false);
    setIsMock(false);
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar la sesión actual? Se borrará tu progreso.')) {
      handleRestartSession();
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-900 text-slate-800 flex items-center justify-center font-sans antialiased md:py-8 select-none"
      id="root-app-layout"
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0033a0_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Confetti celebration when fully completed and modal is active */}
      {showSuccessModal && <Confetti />}

      {/* Main Responsive Frame: Chassis design on desktops, perfect clean borders on mobile */}
      <div
        className="w-full md:max-w-md md:h-[880px] h-screen md:rounded-3xl bg-[#f8fafc] md:shadow-2xl md:border-8 md:border-slate-800 relative flex flex-col overflow-hidden"
        id="app-mobile-frame"
      >
        {/* Notch / Speaker bar simulator for premium device look on desktop */}
        <div className="hidden md:flex justify-center w-full bg-slate-800 py-1.5 absolute top-0 z-40">
          <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 px-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
            <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
          </div>
        </div>

        {/* Inner App Container (Scrollable) */}
        <div className="flex-1 flex flex-col pt-0 md:pt-6 overflow-y-auto pb-4">
          
          {/* Header Bar */}
          <header className="bg-blue-900 text-white px-5 py-4 border-b border-blue-950 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                PE
              </div>
              <div>
                <h1 className="font-display font-black tracking-tight text-sm uppercase">
                  JJC Contratistas
                </h1>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">
                  Fiestas Patrias 🇵🇪
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-1 bg-blue-800/60 px-2.5 py-1 rounded-full border border-blue-700/50">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-300">
                  Activo
                </span>
              </div>
            )}
          </header>

          {/* Active Screen Selection */}
          <main className="flex-1 flex flex-col justify-center" id="main-screens-viewport">
            <AnimatePresence mode="wait">
              {!user ? (
                <LoginScreen key="login" onLogin={handleLogin} />
              ) : (
                <DashboardScreen
                  key="dashboard"
                  user={user}
                  stations={stations}
                  onScanStation={(st) => setActiveStationToScan(st)}
                  onSubmitRaffle={handleSendRaffleEmail}
                  onLogout={handleLogout}
                  isSendingEmail={isSendingEmail}
                  emailJSConfig={emailJSConfig}
                  onUpdateEmailJSConfig={handleUpdateEmailJSConfig}
                />
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* QR Scanner Overlay Modal */}
        <AnimatePresence>
          {activeStationToScan && (
            <ScannerModal
              key="scanner-modal"
              station={activeStationToScan}
              onClose={() => setActiveStationToScan(null)}
              onScanSuccess={handleScanSuccess}
            />
          )}
        </AnimatePresence>

        {/* Sorteo Success Overlay Modal */}
        <AnimatePresence>
          {showSuccessModal && user && (
            <SuccessModal
              key="success-modal"
              user={user}
              isMock={isMock}
              emailJSConfig={emailJSConfig}
              onRestart={handleRestartSession}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
