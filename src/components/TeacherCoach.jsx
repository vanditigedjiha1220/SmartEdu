import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, Zap, AlertTriangle, Wind, Smile, Frown } from 'lucide-react';

// A simple component for a gauge, as react-gauge-chart is not a dependency
const Gauge = ({ value, label, color, max = 200 }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-32 h-16">
      <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-t-full border-b-0"></div>
      <div
        className="absolute top-0 left-0 w-full h-full border-8 rounded-t-full border-b-0 transition-all duration-500"
        style={{
          borderColor: color,
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
          transform: `rotate(${(value / max) * 180}deg)`,
        }}
      ></div>
    </div>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const TeacherCoach = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState({ motivating: 0, frustrating: 0, fillers: 0, wpm: 0, positivism: 50 });
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const startTimeRef = useRef(null);

  // Expanded keyword lists
  const motivatingWords = ['excellent', 'bravo', 'super', 'génial', 'continuez', 'parfait', 'très bien', 'félicitations', 'impressionnant'];
  const frustratingWords = ['problème', 'difficile', 'erreur', 'non', 'mauvais', 'recommence', 'silence', 'arrête', 'incorrect'];
  const fillerWords = ['euh', 'donc', 'alors', 'bah', 'enfin', 'voilà', 'genre', 'quoi'];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event) => setError(`Erreur: ${event.error}`);
    recognitionRef.current = recognition;
  }, []);

  // Real-time analysis effect
  useEffect(() => {
    if (!isRecording || !transcript) return;

    const words = transcript.toLowerCase().split(/\s+/);
    const wordCount = words.length;

    const motivating = words.filter(w => motivatingWords.includes(w.replace(/[.,!?]/g, ''))).length;
    const frustrating = words.filter(w => frustratingWords.includes(w.replace(/[.,!?]/g, ''))).length;
    const fillers = words.filter(w => fillerWords.includes(w.replace(/[.,!?]/g, ''))).length;

    const elapsedTime = (Date.now() - startTimeRef.current) / 60000; // in minutes
    const wpm = elapsedTime > 0 ? Math.round(wordCount / elapsedTime) : 0;

    const totalSentimentWords = motivating + frustrating;
    const positivism = totalSentimentWords > 0 ? Math.round((motivating / totalSentimentWords) * 100) : 50;

    setAnalysis({ motivating, frustrating, fillers, wpm, positivism });

  }, [transcript, isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setAnalysis({ motivating: 0, frustrating: 0, fillers: 0, wpm: 0, positivism: 50 });
      setError(null);
      startTimeRef.current = Date.now();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Coach Pédagogique IA</h1>
          <p className="text-center text-gray-500 mb-8">Obtenez une analyse en temps réel de votre discours.</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
              <p className="font-bold">Erreur</p>
              <p>{error}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <button
              onClick={toggleRecording}
              className={`px-10 py-5 rounded-full font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-4 mx-auto shadow-lg ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRecording ? <StopCircle size={28} /> : <Mic size={28} />}
              {isRecording ? "Arrêter l'Analyse" : "Démarrer l'Analyse"}
            </button>
            {isRecording && <p className="text-sm text-gray-500 mt-4 animate-pulse">Enregistrement en cours...</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-time Metrics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Indicateurs Clés</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                  <Wind size={24} className="text-blue-500 mb-2" />
                  <p className="text-3xl font-bold text-blue-600">{analysis.wpm}</p>
                  <p className="text-sm text-gray-500">Mots par minute</p>
                </div>
                 <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                  <Smile size={24} className="text-green-500 mb-2" />
                  <p className="text-3xl font-bold text-green-600">{analysis.positivism}%</p>
                  <p className="text-sm text-gray-500">Taux de Positivisme</p>
                </div>
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                  <Zap size={24} className="text-yellow-500 mb-2" />
                  <p className="text-3xl font-bold text-yellow-600">{analysis.motivating}</p>
                  <p className="text-sm text-gray-500">Mots Motivants</p>
                </div>
                <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm">
                  <AlertTriangle size={24} className="text-red-500 mb-2" />
                  <p className="text-3xl font-bold text-red-600">{analysis.frustrating}</p>
                  <p className="text-sm text-gray-500">Mots Frustrants</p>
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Transcription</h2>
              <div className="bg-white p-4 rounded-md h-48 overflow-y-auto border">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {transcript || "La transcription de votre discours apparaîtra ici..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCoach;
