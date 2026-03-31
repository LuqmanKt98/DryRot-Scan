
import React, { useRef, useEffect, useState } from 'react';
import type { DOTInfo } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { decodeDotCode } from '../services/dotDecoder';
import { useTranslation } from '../hooks/useTranslation';
import { GoogleGenAI } from "@google/genai";

// Access the API key securely
declare var process: any;

interface CodeReaderScreenProps {
  onScanComplete: (dotInfo: DOTInfo) => void;
  onSkip: () => void;
  onBack: () => void;
}

const CodeReaderScreen: React.FC<CodeReaderScreenProps> = ({ onScanComplete, onSkip, onBack }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment', width: { ideal: 1920 } } 
        });
        
        if (!isMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(e => {
             if(isMounted) console.error("Error playing video:", e);
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

  const handleManualCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);

    try {
        // 1. Capture the frame
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = imageDataUrl.split(',')[1];

        // 2. Initialize AI
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // 3. Prompt for DOT reading
        const prompt = `
            Locate and read the DOT Tire Identification Number (TIN) on this tire sidewall.
            It usually starts with "DOT" followed by 8 to 13 characters.
            The last 4 digits represent the week and year of manufacture (e.g., 4821 = 48th week of 2021).
            
            Return a JSON object:
            {
                "found": boolean,
                "fullCode": string (e.g., "DOT U27J 006 4821"),
                "week": number | null,
                "year": number | null
            }
            
            If you see the code but it's incomplete, try your best to extract the date.
        `;

        // 4. Call API
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                role: 'user',
                parts: [
                    { inlineData: { mimeType: "image/jpeg", data: base64Data } },
                    { text: prompt }
                ]
            },
            config: { responseMimeType: "application/json" }
        });

        // 5. Process Result
        const text = response.text;
        if (!text) throw new Error("No text returned");
        
        const result = JSON.parse(text);
        
        if (result.found && result.fullCode) {
            // If AI found it, use AI's data
            const currentYear = new Date().getFullYear();
            const year = result.year || 2020; // Fallback
            const age = currentYear - year;
            
            const dotInfo: DOTInfo = {
                code: result.fullCode,
                manufacturer: "Detected via AI", // We could ask AI to map this too
                plantCode: "AI",
                week: result.week || 1,
                year: year,
                age: age
            };
            onScanComplete(dotInfo);
        } else {
            // Fallback to mock if AI fails to see it clearly
             alert("Could not read DOT code clearly. Try moving closer.");
             setIsAnalyzing(false);
        }

    } catch (error) {
        console.error("AI OCR Failed:", error);
        setIsAnalyzing(false);
        alert("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-white">
      <video ref={videoRef} playsInline muted className="absolute top-0 left-0 w-full h-full object-cover"></video>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
      
      {/* Overlay for guidance */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
        <div className="w-full max-w-md h-24 border-4 border-dashed border-white/80 rounded-lg flex items-center justify-center bg-white/10 relative">
            <p className="text-white font-bold text-lg">{t('codeReader.alignPrompt')}</p>
            {/* Scanning line animation */}
            {isAnalyzing && (
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange animate-[scan_2s_ease-in-out_infinite]"></div>
            )}
        </div>
        <div className="mt-4 text-center bg-black/50 p-4 rounded-lg">
            <h2 className="font-bold">{t('codeReader.importanceTitle')}</h2>
            <p className="text-sm text-white/80">{t('codeReader.importanceDesc')}</p>
        </div>
      </div>

      <header className="relative z-20 p-4 flex justify-between items-center">
        <button onClick={onBack} disabled={isAnalyzing} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={onSkip} disabled={isAnalyzing} className="font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20">
            {t('codeReader.skipButton')}
        </button>
      </header>

      <div className="flex-grow"></div>

      <footer className="relative z-20 p-4 flex flex-col items-center justify-center space-y-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <button 
            onClick={handleManualCapture}
            disabled={isAnalyzing}
            className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center ring-4 ring-white/30 disabled:opacity-50 active:scale-95 transition-transform"
        >
            {isAnalyzing ? (
                <div className="loading loading-spinner loading-md text-black"></div>
            ) : (
                <div className="w-16 h-16 rounded-full bg-white border-4 border-black/10" />
            )}
        </button>
        <p className="font-semibold">{isAnalyzing ? t('codeReader.analyzing') : t('codeReader.scanButton')}</p>
      </footer>
    </div>
  );
};

export default CodeReaderScreen;
