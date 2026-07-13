import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Station } from '../types';
import { X, Camera, AlertCircle, Info, Check, Sparkles } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerModalProps {
  station: Station;
  onClose: () => void;
  onScanSuccess: (scannedCode: string) => void;
  key?: string;
}

export default function ScannerModal({ station, onClose, onScanSuccess }: ScannerModalProps) {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [isScannerInitialized, setIsScannerInitialized] = useState(false);
  
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader-container';

  // Format expected QR content
  const expectedQR = `ESTACION-${station.id}`;

  useEffect(() => {
    // Initialize html5-qrcode
    let scanner: Html5Qrcode | null = null;
    
    // Slight delay to ensure the DOM node is rendered
    const timer = setTimeout(() => {
      try {
        scanner = new Html5Qrcode(containerId);
        qrScannerRef.current = scanner;

        scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.85;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            // Success
            handleScannedValue(decodedText);
          },
          () => {
            // Verbose scan failure (not a match yet)
          }
        )
        .then(() => {
          setIsScannerInitialized(true);
        })
        .catch((err) => {
          console.warn('Error starting camera scan:', err);
          setCameraError(
            'No se pudo acceder a la cámara. Esto suele ocurrir si estás probando la app dentro del visor de AI Studio (iframe), si no has dado permisos de cámara, o si no usas HTTPS.'
          );
        });
      } catch (err) {
        console.error('Html5Qrcode initialization error:', err);
        setCameraError('No se pudo inicializar el lector de códigos.');
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      if (scanner && scanner.isScanning) {
        scanner.stop()
          .then(() => {
            console.log('Camera stopped successfully.');
          })
          .catch((err) => console.error('Error stopping camera:', err));
      }
    };
  }, [station.id]);

  const handleScannedValue = (text: string) => {
    // Standardize comparison format: remove whitespace, make uppercase
    const cleanScanned = text.trim().toUpperCase().replace(/\s/g, '');
    const cleanExpected = expectedQR.toUpperCase().replace(/\s/g, '');
    const cleanExpectedAlt = `ESTACION${station.id}`; // Alternative "ESTACION1"

    if (
      cleanScanned === cleanExpected ||
      cleanScanned === cleanExpectedAlt ||
      cleanScanned === String(station.id)
    ) {
      // Correct scan!
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().finally(() => {
          onScanSuccess(text);
        });
      } else {
        onScanSuccess(text);
      }
    } else {
      setManualError(
        `Código incorrecto. Escaneaste "${text}". Debes escanear el código QR correspondiente a la Estación ${station.id} (${expectedQR}).`
      );
    }
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setManualError('Por favor ingresa un código.');
      return;
    }
    handleScannedValue(manualCode);
  };

  const handleSimulate = () => {
    // Directly simulate correct scan
    handleScannedValue(expectedQR);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
      id="scanner-modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col my-auto"
        id="scanner-modal-body"
      >
        {/* Modal Header */}
        <div className="bg-blue-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-sm font-bold font-mono">
              {station.id}
            </div>
            <div>
              <h3 className="font-display font-bold leading-tight">Escaneando Estación {station.id}</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Validación de Visita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
            id="close-scanner-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 flex flex-col space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Instructions Box */}
          <div className="bg-blue-50/70 rounded-xl p-3 border border-blue-100/50 flex items-start gap-3">
            <span className="text-blue-600 mt-0.5 shrink-0">
              <Info size={16} />
            </span>
            <p className="text-xs text-blue-800 leading-relaxed">
              Encuentra el cartel de la <strong className="font-semibold text-blue-950">Estación {station.id}</strong> en el evento y escanea su código QR correspondiente.
            </p>
          </div>

          {/* Camera Viewport Area */}
          <div className="relative aspect-square w-full max-w-[340px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center">
            {/* The actual HTML5 QR container */}
            <div id={containerId} className="w-full h-full object-cover"></div>

            {/* Overlays */}
            {!isScannerInitialized && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-2 p-4 text-center">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs mt-2">Iniciando cámara...</p>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-300 gap-2 p-6 text-center">
                <span className="text-amber-500">
                  <Camera size={32} className="animate-pulse" />
                </span>
                <p className="text-xs text-slate-300 font-medium">Lector en espera</p>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">
                  Cámara no disponible en este entorno. Por favor, utiliza el panel de validación por código de abajo.
                </p>
              </div>
            )}

            {/* Scanner Target Frame */}
            {isScannerInitialized && !cameraError && (
              <div className="absolute inset-0 border-[12px] border-slate-950/40 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1"></div>
                  <div className="w-full h-0.5 bg-blue-500/80 absolute top-1/2 left-0 -translate-y-1/2 animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {manualError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs"
              id="scanner-error"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{manualError}</span>
            </motion.div>
          )}

          {/* Validación por Código */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-slate-700 border-b border-slate-200/60 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Validación por Código</span>
            </div>

            {/* Manual Input Form */}
            <form onSubmit={handleManualSubmit} className="flex gap-2" id="manual-scan-form">
              <input
                type="text"
                placeholder={`Escribe el código de la Estación ${station.id}`}
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value);
                  if (manualError) setManualError(null);
                }}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50/50"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Validar
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
