// components/QRScanner.tsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, RotateCcw } from "lucide-react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ─────────────────────────────
  // START SCANNER
  // ─────────────────────────────
  const startScanner = () => {
    setErrorMessage(null);
    setIsScanning(true);

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // ✅ prevent multiple triggers
        if (!scannerRef.current) return;

        onScanSuccess(decodedText);
        stopScanner();
      },
      (error) => {
        // silent scan errors (normal behavior)
        if (onScanError) onScanError(error);
      }
    );
  };

  // ─────────────────────────────
  // STOP SCANNER
  // ─────────────────────────────
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (err) {
      console.warn("Scanner clear error:", err);
    }

    setIsScanning(false);
  };

  // ─────────────────────────────
  // INIT
  // ─────────────────────────────
  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* CAMERA VIEW */}
      <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 bg-black">

        {/* Scanner mount */}
        <div id="qr-reader" className="w-full" />

        {/* Overlay */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 border-2 border-[#639922]/40 rounded-xl animate-pulse" />
        )}

        {/* Loading state */}
        {!isScanning && !errorMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/40 text-sm">
            <Loader2 className="w-5 h-5 animate-spin mb-2" />
            Initializing camera...
          </div>
        )}
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="text-red-400 text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* PERMISSION ISSUE */}
      {!hasPermission && (
        <div className="text-yellow-400 text-xs text-center max-w-xs">
          Camera access is blocked. Please allow camera permission in your browser.
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-2">

        {!isScanning && (
          <Button
            onClick={startScanner}
            className="bg-[#639922] text-black hover:bg-[#7fb82c]"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Scan
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => {
            stopScanner();
            startScanner();
          }}
          className="border-white/10 text-foreground/70 hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>

      {/* FOOTER INFO */}
      <p className="text-xs text-foreground/30 text-center max-w-xs">
        Align the QR code inside the frame. The scan will happen automatically.
      </p>
    </div>
  );
}