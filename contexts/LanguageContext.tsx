
import React, { createContext, useState, useContext, ReactNode } from 'react';

// The JSON data is now embedded directly in the code to bypass module loading issues.
const en = {
  "landing": {
    "title": "DryRot Scan",
    "subtitle": "The smart way to check for dry rot and tire age before you buy.",
    "feature1Title": "Instant AI Analysis",
    "feature1Desc": "Our AI detects hidden cracks and signs of dangerous dry rot from your photos.",
    "feature2Title": "Tire Age & Safety",
    "feature2Desc": "Instantly decode DOT codes to reveal a tire's true age—a critical safety factor.",
    "feature3Title": "Full DryRot Scan Report",
    "feature3Desc": "Get a comprehensive PDF report for a complete scan, perfect for pre-purchase inspections.",
    "startScanButton": "Sign Up & Start Scan",
    "signInButton": "Sign In"
  },
  "login": {
    "title": "Welcome Back",
    "subtitle": "Sign in to access your scans.",
    "emailPlaceholder": "Email address",
    "passwordPlaceholder": "Password",
    "signInButton": "Sign In"
  },
  "signup": {
    "title": "Create Account",
    "subtitle": "Join DryRot Scan to save your reports.",
    "namePlaceholder": "Full Name",
    "emailPlaceholder": "Email Address",
    "passwordPlaceholder": "Password",
    "confirmPasswordPlaceholder": "Confirm Password",
    "submitButton": "Create Account",
    "alreadyHaveAccount": "Already have an account? Sign In"
  },
  "intro": {
    "step1Title": "Scan for Dry Rot",
    "step1Desc": "Take clear pictures of each tire's sidewall. Our AI looks for signs of cracking and aging.",
    "step2Title": "Analyze Tire Age",
    "step2Desc": "We'll help you find and scan the DOT code to determine the tire's real age, a key safety factor.",
    "step3Title": "Make a Safe Choice",
    "step3Desc": "Get a clear, simple recommendation based on our findings so you can make an informed decision.",
    "nextButton": "Next",
    "getStartedButton": "Get Started"
  },
  "home": {
    "title": "DryRot Scan",
    "dashboard": "Dashboard",
    "logout": "Logout",
    "newScanTitle": "New DryRot Scan",
    "newScanDesc": "Start a full vehicle inspection to check for dry rot and determine tire age.",
    "startNowButton": "Start Now",
    "historyTitle": "Scan History",
    "noScansTitle": "No Scans Found",
    "noScansDesc": "Your past vehicle scan reports will appear here.",
    "scans": "Scans",
    "contactSupport": "Contact Support",
    "rateApp": "Rate App"
  },
  "payment": {
    "title": "Purchase Report",
    "price": "$2.99",
    "description": "One-time payment for a full vehicle report (up to 5 tires).",
    "cardNumberLabel": "Card Number",
    "expiryLabel": "Expiry",
    "cvcLabel": "CVC",
    "payButton": "Pay $2.99",
    "processingButton": "Processing...",
    "securePayment": "Secure payment powered by Stripe",
    "error": "Payment failed. Please try again."
  },
  "vehicleStatus": {
    "title": "Vehicle Status",
    "description": "Tap on a tire to scan its sides for dry rot. We recommend scanning all three sides for a complete analysis. When you're done, finish the report.",
    "carBody": "CAR BODY",
    "generalTireDesc": "Use \"General\" for a spare tire or one not on the vehicle.",
    "finishButton": "Finish & View Report",
    "cancelAndHome": "Cancel & Go Home",
    "scanned": "({{count}}/3 Scanned)"
  },
  "tireDetail": {
    "title": "Which part will you analyze?",
    "description": "For a complete dry rot analysis, it's recommended to scan both sidewalls and the inside tread if accessible.",
    "backToVehicleButton": "Back to Vehicle",
    "rightSidewall": "Right Sidewall",
    "leftSidewall": "Left Sidewall",
    "inside": "Inside"
  },
  "scan": {
    "captureGuidance": "Capture up to 5 images",
    "analyzeButton": "Analyze ({{count}})",
    "good": "Good",
    "warning": "Warning",
    "dontbuy": "Don't Buy",
    "significantCracking": "Significant Cracking Detected",
    "significantCrackingDetails": "Multiple areas of deep cracking and weathering found, indicating advanced dry rot.",
    "safetyWarning": "Safety Warning",
    "safetyWarningDetails": "This tire is not safe for use and poses a significant risk of failure.",
    "surfaceIntegrity": "Surface Integrity",
    "surfaceIntegrityDetails": "No significant cracking or weathering detected on the visible sidewall.",
    "ageRecommendation": "Age Recommendation",
    "ageRecommendationDetails": "Based on visual analysis, the tire appears to be in good condition."
  },
  "review": {
    "title": "Scan Review",
    "statusLabel": "Status",
    "confidenceLabel": "Confidence",
    "analysisDetailsTitle": "AI Analysis Details",
    "acceptButton": "Accept & Continue",
    "retakeButton": "Retake Photo"
  },
  "finalReview": {
    "title": "Final Scan Review",
    "description": "Please review the summary of your scans below. You can go back to scan more sides or accept to generate the final report.",
    "acceptButton": "Accept & Generate Report",
    "goBackButton": "Go Back & Scan More"
  },
  "codeReader": {
    "alignPrompt": "Align DOT code here",
    "importanceTitle": "Why is this important?",
    "importanceDesc": "A tire's age is a critical safety factor. Older tires have a higher risk of dry rot and sudden failure, even if they look new.",
    "skipButton": "Skip",
    "scanButton": "Tap to Scan DOT Code",
    "analyzing": "Analyzing Code...",
    "unknownManufacturer": "Unknown Manufacturer"
  },
  "result": {
    "title": "DryRot Scan Report",
    "reportDate": "Report Date",
    "overallStatus": "Overall Status",
    "reportSummary": "This report is a summary of the DryRot Scan analysis conducted on",
    "downloadPdfButton": "Download PDF Report",
    "doneButton": "Done",
    "chatButton": "Ask AI Mechanic",
    "dotInfoTitle": "DOT Information (Age: {{age}} years)",
    "age": "Age",
    "years": "years",
    "code": "Code",
    "manufactured": "Manufactured",
    "analysisFor": "Analysis for",
    "lowRisk": "Low Risk",
    "mediumRisk": "Medium Risk",
    "highRisk": "HIGH RISK"
  },
  "chat": {
    "title": "AI Mechanic",
    "subtitle": "Ask questions about your scan results.",
    "placeholder": "Ask a question about these tires...",
    "send": "Send",
    "initialMessage": "Hello! I've analyzed your tire scan report. I can answer questions about dry rot, tire age, or safety recommendations based on these results. How can I help?",
    "typing": "AI Mechanic is typing..."
  },
  "contact": {
    "title": "Contact Support",
    "nameLabel": "Name",
    "emailLabel": "Email",
    "subjectLabel": "Subject",
    "messageLabel": "Message",
    "sendButton": "Send Message",
    "successMessage": "Message sent successfully! We'll be in touch shortly.",
    "sending": "Sending..."
  },
  "appReview": {
    "title": "Rate Our App",
    "subtitle": "We value your feedback!",
    "ratingLabel": "Your Rating",
    "feedbackLabel": "Your Feedback",
    "submitButton": "Submit Review",
    "successMessage": "Thank you for your review!",
    "submitting": "Submitting...",
    "placeholder": "Tell us what you think about the app..."
  },
  "app": {
    "scanComplete": "Scan complete! You can find it in your history."
  },
  "addToHome": {
    "title": "Install DryRot Scan",
    "description": "For the best experience, add this app to your home screen. Tap the",
    "instruction": "icon and then select",
    "instructionAction": "'Add to Home Screen'."
  },
  "tirePositions": {
    "frontLeft": "Front Left",
    "frontRight": "Front Right",
    "rearLeft": "Rear Left",
    "rearRight": "Rear Right",
    "general": "General"
  }
};

const es = {
  "landing": {
    "title": "Análisis de Agrietamiento",
    "subtitle": "La forma inteligente de verificar el agrietamiento y la edad de los neumáticos antes de comprar.",
    "feature1Title": "Análisis Instantáneo con IA",
    "feature1Desc": "Nuestra IA detecta grietas ocultas y signos de agrietamiento peligroso en sus fotos.",
    "feature2Title": "Edad y Seguridad del Neumático",
    "feature2Desc": "Decodifique instantáneamente los códigos DOT para revelar la verdadera edad de un neumático, un factor de seguridad crítico.",
    "feature3Title": "Informe Completo de Análisis",
    "feature3Desc": "Obtenga un informe completo en PDF para un análisis completo, perfecto para inspecciones previas a la compra.",
    "startScanButton": "Registrarse e Iniciar",
    "signInButton": "Iniciar Sesión"
  },
  "login": {
    "title": "Bienvenido de Nuevo",
    "subtitle": "Inicie sesión para acceder a sus análisis.",
    "emailPlaceholder": "Correo electrónico",
    "passwordPlaceholder": "Contraseña",
    "signInButton": "Iniciar Sesión"
  },
  "signup": {
    "title": "Crear Cuenta",
    "subtitle": "Únase a DryRot Scan para guardar sus informes.",
    "namePlaceholder": "Nombre Completo",
    "emailPlaceholder": "Correo Electrónico",
    "passwordPlaceholder": "Contraseña",
    "confirmPasswordPlaceholder": "Confirmar Contraseña",
    "submitButton": "Crear Cuenta",
    "alreadyHaveAccount": "¿Ya tienes cuenta? Iniciar Sesión"
  },
  "intro": {
    "step1Title": "Analizar Agrietamiento",
    "step1Desc": "Tome fotos claras de la pared lateral de cada neumático. Nuestra IA busca signos de grietas y envejecimiento.",
    "step2Title": "Analizar Edad del Neumático",
    "step2Desc": "Le ayudaremos a encontrar y escanear el código DOT para determinar la edad real del neumático, un factor clave de seguridad.",
    "step3Title": "Tome una Decisión Segura",
    "step3Desc": "Obtenga una recomendación clara y sencilla basada en nuestros hallazgos para que pueda tomar una decisión informada.",
    "nextButton": "Siguiente",
    "getStartedButton": "Comenzar"
  },
  "home": {
    "title": "Análisis de Agrietamiento",
    "dashboard": "Panel",
    "logout": "Cerrar Sesión",
    "newScanTitle": "Nuevo Análisis",
    "newScanDesc": "Inicie una inspección completa del vehículo para verificar el agrietamiento y determinar la edad del neumático.",
    "startNowButton": "Empezar Ahora",
    "historyTitle": "Historial de Análisis",
    "noScansTitle": "No se Encontraron Análisis",
    "noScansDesc": "Sus informes de análisis de vehículos anteriores aparecerán aquí.",
    "scans": "Análisis",
    "contactSupport": "Contactar Soporte",
    "rateApp": "Calificar App"
  },
  "payment": {
    "title": "Comprar Informe",
    "price": "$2.99",
    "description": "Pago único por un informe completo del vehículo (hasta 5 neumáticos).",
    "cardNumberLabel": "Número de Tarjeta",
    "expiryLabel": "Vencimiento",
    "cvcLabel": "CVC",
    "payButton": "Pagar $2.99",
    "processingButton": "Procesando...",
    "securePayment": "Pago seguro con tecnología de Stripe",
    "error": "El pago falló. Por favor, inténtelo de nuevo."
  },
  "vehicleStatus": {
    "title": "Estado del Vehículo",
    "description": "Toque un neumático para analizar sus lados en busca de agrietamiento. Recomendamos analizar los tres lados para un análisis completo. Cuando termine, finalice el informe.",
    "carBody": "VEHÍCULO",
    "generalTireDesc": "Use \"General\" para un neumático de repuesto o uno que no esté en el vehículo.",
    "finishButton": "Finalizar y Ver Informe",
    "cancelAndHome": "Cancelar e Ir al Inicio",
    "scanned": "({{count}}/3 Analizado)"
  },
  "tireDetail": {
    "title": "¿Qué parte analizará?",
    "description": "Para un análisis completo de agrietamiento, se recomienda analizar ambas paredes laterales y la banda de rodadura interior si es accesible.",
    "backToVehicleButton": "Volver al Vehículo",
    "rightSidewall": "Pared Lateral Derecha",
    "leftSidewall": "Pared Lateral Izquierda",
    "inside": "Interior"
  },
  "scan": {
    "captureGuidance": "Capture hasta 5 imágenes",
    "analyzeButton": "Analizar ({{count}})",
    "good": "Bueno",
    "warning": "Advertencia",
    "dontbuy": "No Comprar",
    "significantCracking": "Se Detectaron Grietas Significativas",
    "significantCrackingDetails": "Se encontraron múltiples áreas de grietas profundas y desgaste, lo que indica un agrietamiento avanzado.",
    "safetyWarning": "Advertencia de Seguridad",
    "safetyWarningDetails": "Este neumático no es seguro para su uso y presenta un riesgo significativo de falla.",
    "surfaceIntegrity": "Integridad de la Superficie",
    "surfaceIntegrityDetails": "No se detectaron grietas ni desgaste significativos en la pared lateral visible.",
    "ageRecommendation": "Recomendación por Edad",
    "ageRecommendationDetails": "Según el análisis visual, el neumático parece estar en buenas condiciones."
  },
  "review": {
    "title": "Revisión del Análisis",
    "statusLabel": "Estado",
    "confidenceLabel": "Confianza",
    "analysisDetailsTitle": "Detalles del Análisis de IA",
    "acceptButton": "Aceptar y Continuar",
    "retakeButton": "Tomar Foto de Nuevo"
  },
  "finalReview": {
    "title": "Revisión Final del Análisis",
    "description": "Revise el resumen de sus análisis a continuación. Puede volver para analizar más lados o aceptar para generar el informe final.",
    "acceptButton": "Aceptar y Generar Informe",
    "goBackButton": "Volver y Analizar Más"
  },
  "codeReader": {
    "alignPrompt": "Alinear código DOT aquí",
    "importanceTitle": "¿Por qué es importante?",
    "importanceDesc": "La edad de un neumático es un factor de seguridad crítico. Los neumáticos más viejos tienen un mayor riesgo de agrietamiento y falla repentina, incluso si parecen nuevos.",
    "skipButton": "Omitir",
    "scanButton": "Toque para Escanear Código DOT",
    "analyzing": "Analizando Código...",
    "unknownManufacturer": "Fabricante Desconocido"
  },
  "result": {
    "title": "Informe de Análisis",
    "reportDate": "Fecha del Informe",
    "overallStatus": "Estado General",
    "reportSummary": "Este informe es un resumen del análisis realizado en",
    "downloadPdfButton": "Descargar Informe PDF",
    "doneButton": "Hecho",
    "chatButton": "Preguntar al Mecánico IA",
    "dotInfoTitle": "Información DOT (Edad: {{age}} años)",
    "age": "Edad",
    "years": "años",
    "code": "Código",
    "manufactured": "Fabricado",
    "analysisFor": "Análisis para",
    "lowRisk": "Bajo Riesgo",
    "mediumRisk": "Riesgo Medio",
    "highRisk": "ALTO RIESGO"
  },
  "chat": {
    "title": "Mecánico IA",
    "subtitle": "Haga preguntas sobre los resultados de su análisis.",
    "placeholder": "Haga una pregunta sobre estos neumáticos...",
    "send": "Enviar",
    "initialMessage": "¡Hola! He analizado su informe de neumáticos. Puedo responder preguntas sobre el agrietamiento, la edad de los neumáticos o recomendaciones de seguridad. ¿Cómo puedo ayudar?",
    "typing": "Mecánico IA está escribiendo..."
  },
  "contact": {
    "title": "Contactar Soporte",
    "nameLabel": "Nombre",
    "emailLabel": "Correo Electrónico",
    "subjectLabel": "Asunto",
    "messageLabel": "Mensaje",
    "sendButton": "Enviar Mensaje",
    "successMessage": "¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.",
    "sending": "Enviando..."
  },
  "appReview": {
    "title": "Calificar Nuestra App",
    "subtitle": "¡Valoramos sus comentarios!",
    "ratingLabel": "Su Calificación",
    "feedbackLabel": "Sus Comentarios",
    "submitButton": "Enviar Reseña",
    "successMessage": "¡Gracias por su reseña!",
    "submitting": "Enviando...",
    "placeholder": "Cuéntenos qué piensa sobre la aplicación..."
  },
  "app": {
    "scanComplete": "¡Análisis completo! Puede encontrarlo en su historial."
  },
  "addToHome": {
    "title": "Instalar la Aplicación",
    "description": "Para la mejor experiencia, agregue esta aplicación a su pantalla de inicio. Toque el ícono",
    "instruction": "y luego seleccione",
    "instructionAction": "'Agregar a la Pantalla de Inicio'."
  },
  "tirePositions": {
    "frontLeft": "Delantero Izquierdo",
    "frontRight": "Delantero Derecho",
    "rearLeft": "Trasero Izquierdo",
    "rearRight": "Trasero Derecho",
    "general": "General"
  }
};

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
}

const translationsData = { en, es };

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'en' || savedLang === 'es') ? savedLang : 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const translations = translationsData[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
