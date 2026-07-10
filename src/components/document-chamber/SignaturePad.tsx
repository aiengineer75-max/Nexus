import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../ui/Button';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const dataUrl = sigCanvasRef.current?.getCanvas().toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
      <p className="text-sm font-medium text-gray-700 mb-2">Draw your signature below</p>

      <div className="bg-white border-2 border-dashed border-gray-300 rounded-md">
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 150,
            className: 'w-full',
          }}
        />
      </div>

      <div className="flex gap-2 mt-3">
        <Button size="sm" onClick={handleSave}>
          Save Signature
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};