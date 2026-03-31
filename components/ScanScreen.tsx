
import React, { useState, useEffect, useRef } from 'react';
import type { ScanResult, ScanStatus } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CameraIcon from './icons/CameraIcon';
import XIcon from './icons/XIcon';
import { useTranslation } from '../hooks/useTranslation';
import { GoogleGenAI } from "@google/genai";

// Access the API key securely
declare var process: any;

interface ScanScreenProps {
  onScanComplete: (result: { image: string, analysis: ScanResult['analysis'], status: ScanStatus, confidence: number }) => void;
  onBack: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onScanComplete, onBack }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => {
            if (isMounted) console.error("Error playing video:", e);
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error accessing camera: ", err);
        }
      }
    };
    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (images.length >= 5 || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImages(prev => [...prev, imageDataUrl]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleComplete = async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);

    try {
      // 1. Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 2. Prepare images for the API (remove header 'data:image/jpeg;base64,')
      const imageParts = images.map(img => ({
        inlineData: {
          mimeType: "image/jpeg",
          data: img.split(',')[1]
        }
      }));

      // 3. Define the prompt
      const prompt = `
        Analyze these tire images for "Dry Rot" (sidewall cracking) and general safety.
        
        Return a JSON object with this structure:
        {
          "status": "Good" | "Warning" | "Don't Buy",
          "confidence": number (0-100),
          "analysis": [
            { "title": "Short Title", "details": "Description of finding" },
            { "title": "Short Title", "details": "Description of finding" }
          ]
        }

        Criteria:
        - "Don't Buy": Deep cracks, cord visible, severe weathering, or missing rubber chunks.
        - "Warning": Fine hairline cracks (weather checking), discoloration.
        - "Good": Smooth rubber, no visible cracks.
      `;

      // 4. Call the API
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          role: 'user',
          parts: [...imageParts, { text: prompt }]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      // 5. Parse the result
      const responseText = response.text;
      if (!responseText) throw new Error("No response from AI");

      const resultJson = JSON.parse(responseText);

      // 6. Pass real data back to App
      onScanComplete({
        image: images[0],
        status: resultJson.status || "Warning",
        confidence: resultJson.confidence || 85,
        analysis: resultJson.analysis || [{ title: "Analysis Failed", details: "Could not analyze image." }]
      });

    } catch (error) {
      console.error("AI Analysis Failed:", error);
      // Fallback if AI fails
      onScanComplete({
        image: images[0],
        status: "Warning",
        confidence: 0,
        analysis: [{ title: "Connection Error", details: "Could not reach AI server. Please check your internet." }]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <video ref={videoRef} playsInline muted className="absolute top-0 left-0 w-full h-full object-cover"></video>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      <header className="relative z-10 p-4 flex justify-between items-center">
        <button onClick={onBack} disabled={isAnalyzing} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <p className="font-semibold">{t('scan.captureGuidance')}</p>
        <div className="w-10"></div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        {isAnalyzing && (
          <div className="bg-black/80 p-6 rounded-2xl flex flex-col items-center animate-fade-in">
            <div className="loading loading-spinner loading-lg text-brand-orange mb-4"></div>
            <h3 className="text-xl font-bold text-brand-orange">Analyzing Tire...</h3>
            <p className="text-sm text-white/70">Checking for dry rot & cracks</p>
          </div>
        )}
      </div>

      {!isAnalyzing && (
        <footer className="relative z-10 p-4 space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center justify-center min-h-[72px]">
            {images.length > 0 && (
              <div className="flex gap-2 p-2 bg-black/50 rounded-lg overflow-x-auto">
                {images.map((img, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img src={img} className="w-16 h-16 rounded-md object-cover" alt={`capture ${index + 1}`} />
                    <button onClick={() => removeImage(index)} className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full">
                      <XIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-around">
            <div className="w-20"></div>
            <button 
              onClick={handleCapture} 
              disabled={images.length >= 5}
              className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center ring-4 ring-white/30 disabled:opacity-50 active:scale-95 transition-transform"
            >
              <CameraIcon className="w-10 h-10 text-black" />
            </button>
            
            <button 
              onClick={handleComplete}
              disabled={images.length === 0}
              className="w-20 text-center font-semibold text-brand-orange disabled:text-white/50"
            >
              {t('scan.analyzeButton', { count: images.length })}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ScanScreen;
