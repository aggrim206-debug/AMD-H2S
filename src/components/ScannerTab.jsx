import React from 'react';
import { useZxing } from 'react-zxing';

export default function ScannerTab({ onScan, isScanning }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      if (isScanning) {
        onScan(result.getText());
      }
    },
    paused: !isScanning,
  });

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 fade-up py-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-navy">Scan Barcode</h2>
        <p className="text-sm text-on-surface-v max-w-xs mx-auto">
          Center the barcode of any food product in the frame to instantly analyze it.
        </p>
      </div>

      <div className="relative w-full max-w-sm aspect-square bg-navy rounded-3xl overflow-hidden shadow-elevated border-4 border-surface-mid">
        {/* Scanner view */}
        <video 
          ref={ref} 
          className="w-full h-full object-cover" 
          autoPlay 
          playsInline 
          muted 
        />
        
        {/* Targeting reticle overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-3/4 h-1/3 border-2 border-teal rounded-xl relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-teal -mt-1 -ml-1 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-teal -mt-1 -mr-1 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-teal -mb-1 -ml-1 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-teal -mb-1 -mr-1 rounded-br-lg"></div>
            {isScanning && (
              <div className="w-full h-0.5 bg-teal/60 absolute top-1/2 -translate-y-1/2 animate-scan" />
            )}
          </div>
        </div>
      </div>
      
      {!isScanning && (
        <p className="text-sm text-amber font-medium bg-amber-light px-4 py-2 rounded-full">
          Scanning paused while analyzing...
        </p>
      )}
    </div>
  );
}
