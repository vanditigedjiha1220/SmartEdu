// 📁 src/pages/TeacherDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CameraAttendance from "../components/CameraAttendance";

import { auth, db, storage } from "../firebase/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  Bell,
  Camera,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Mic,
  StopCircle,
  Play,
  Download
} from "lucide-react";

// Composant StatCard pour affichage des statistiques
const StatCard = ({ icon: Icon, title, value, unit, color, subtext }) => (
  <div className="bg-white rounded-xl shadow-md p-5 border-t-4" style={{ borderTopColor: color }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
          <p className="text-sm text-gray-400">{unit}</p>
        </div>
        {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </div>
);

// Composant AlertItem
const AlertItem = ({ alert }) => {
  const colors = {
    high: "border-red-300 bg-red-100",
    medium: "border-yellow-300 bg-yellow-100",
    success: "border-green-300 bg-green-100",
  };
  return (
    <div className={`p-4 rounded-lg border-l-4 mb-3 ${colors[alert.severity]}`}>
      <div className="flex items-center gap-3">
        <div className="text-xl">🔔</div>
        <div>
          <p className="font-medium text-gray-800">{alert.message}</p>
          <p className="text-xs text-gray-500">{alert.time}</p>
        </div>
      </div>
    </div>
  );
};

// --- Données factices (mock data) ---
const mockClasses = [
  { id: "3A", name: "Mathématiques", students: 28, time: "08:00 - 09:30" },
  { id: "4B", name: "Histoire", students: 25, time: "10:00 - 11:30" },
  { id: "5C", name: "Physique-Chimie", students: 30, time: "14:00 - 15:30" },
];

const mockTodayStats = {
  totalStudents: 28,
  presentToday: 26,
  absences: 2,
  lateness: 1,
  attendance: 92.8,
};

const mockClassHistory = [
  {
    id: 1,
    class: "3A",
    date: new Date(),
    recordedAt: "08:00",
    presentCount: 26,
    totalCount: 28,
  },
  {
    id: 2,
    class: "4B",
    date: new Date(),
    recordedAt: "10:00",
    presentCount: 24,
    totalCount: 25,
  },
];

const mockRecentAlerts = [
  { id: 1, type: "absence", message: "2 absences détectées", time: "08:45", severity: "high" },
  { id: 2, type: "lateness", message: "1 élève en retard", time: "10:10", severity: "medium" },
  { id: 3, type: "success", message: "Taux de présence élevé", time: "Hier", severity: "success" },
];

// --- Composant principal ---
const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [todayClass, setTodayClass] = useState("3A");
  const [coachActive, setCoachActive] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);

  const todayStats = mockTodayStats;
  const classes = mockClasses;
  const classHistory = mockClassHistory;
  const recentAlerts = mockRecentAlerts;

  // --- Chronomètre d'enregistrement ---
  useEffect(() => {
    if (coachActive) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [coachActive]);

  const formatTime = (s) => {
    const min = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // --- Fonction principale Coach IA ---
  const toggleCoach = async () => {
    if (coachActive) {
      // Arrêter l'enregistrement
      mediaRecorderRef.current?.stop();
      setCoachActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (e) => audioChunks.push(e.data);

      recorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" });
        const user = auth.currentUser;

        if (!user) {
          alert("Vous devez être connecté pour soumettre un audio.");
          return;
        }

        setLoading(true); // Affiche un indicateur pendant l'upload

        try {
          // 1. Uploader l'audio sur Firebase Storage
          const storageRef = ref(storage, `coach-audio/${user.uid}/${new Date().toISOString()}.wav`);
          await uploadBytes(storageRef, blob);
          const audioUrl = await getDownloadURL(storageRef);

          // 2. Créer une tâche d'analyse dans Firestore
          await addDoc(collection(db, "pendingAnalyses"), {
            teacherUid: user.uid,
            audioUrl: audioUrl, // URL pour que le backend puisse le trouver
            storagePath: storageRef.fullPath, // Chemin pour que le backend puisse le supprimer
            timestamp: serverTimestamp(),
            classId: todayClass,
            status: "pending",
          });

          alert("Audio soumis avec succès ! L'analyse est en cours.");

        } catch (err) {
          console.error("Erreur lors de la soumission de l'audio :", err);
          alert("Une erreur est survenue lors de la soumission de l'audio.");
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setCoachActive(true);
      setRecordingTime(0);
      setAnalysisResult(null);
    } catch (error) {
      console.error("Microphone inaccessible:", error);
      alert("Veuillez autoriser l'accès au micro.");
    }
  };

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleNotificationClick = () => alert("Notifications à venir !");
  const handleSettingsClick = () => alert("Paramètres disponibles bientôt.");
  const handleViewDetailsClick = (id) => alert(`Détails de l'appel #${id}`);

  // --- Affichage principal ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Chargement en cours...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* En-tête */}
      <header className="bg-white shadow-md border-b border-gray-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Enseignant</h1>
          <p className="text-gray-500">Appel automatisé • Coach IA • Statistiques</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell
              onClick={handleNotificationClick}
              size={24}
              className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {recentAlerts.length}
            </span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            👨‍🏫
          </div>
        </div>
      </header>

      {/* Onglets */}
      <div className="flex border-t border-gray-200 px-8">
        {["overview", "attendance", "coach", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "overview" && "📊 Vue d'ensemble"}
            {tab === "attendance" && "📷 Appel"}
            {tab === "coach" && "🤖 Coach IA"}
            {tab === "analytics" && "📈 Analytics"}
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <main className="p-8">
        {/* === Vue d'ensemble === */}
        {activeTab === "overview" && (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-indigo-500 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Classe {todayClass}</h2>
                <p className="text-gray-500">
                  {classes.find((c) => c.id === todayClass)?.students} élèves •{" "}
                  {classes.find((c) => c.id === todayClass)?.time}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/teacher/attendance"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 shadow-md"
                >
                  <Camera size={20} /> Prendre l'appel
                </Link>
                <button
                  onClick={handleSettingsClick}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Settings size={20} /> Paramètres
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard icon={Users} title="Total Élèves" value={todayStats.totalStudents} unit="élèves" color="#6366F1" subtext={`Classe ${todayClass}`} />
              <StatCard icon={CheckCircle} title="Présents" value={todayStats.presentToday} unit="aujourd'hui" color="#10B981" />
              <StatCard icon={AlertCircle} title="Absences" value={todayStats.absences} unit="signalées" color="#EF4444" />
              <StatCard icon={Clock} title="Retards" value={todayStats.lateness} unit="élève" color="#F59E0B" />
              <StatCard icon={TrendingUp} title="Taux Présence" value={todayStats.attendance} unit="%" color="#3B82F6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Historique des Appels</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Classe</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Taux</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classHistory.map((record) => (
                      <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{record.class}</td>
                        <td>{record.date.toLocaleDateString()}</td>
                        <td>{record.recordedAt}</td>
                        <td>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            {Math.round((record.presentCount / record.totalCount) * 100)}%
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleViewDetailsClick(record.id)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">🔔 Alertes Récentes</h2>
                <div className="space-y-2">
                  {recentAlerts.map((a) => (
                    <AlertItem key={a.id} alert={a} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* === Appel === */}
        {activeTab === "attendance" && (
          <CameraAttendance />
        )}

        {/* === Coach IA === */}
        {activeTab === "coach" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Coach Pédagogique IA</h2>
              <p className="text-gray-500 mb-6">
                Recevez des retours sur votre diction, rythme et implication.
              </p>

              <div className="bg-gray-800 text-white rounded-lg p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mic
                    size={32}
                    className={coachActive ? "text-red-500 animate-pulse" : "text-gray-400"}
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {coachActive ? "Enregistrement en cours..." : "Prêt à commencer"}
                    </p>
                    <p className="text-3xl font-mono">{formatTime(recordingTime)}</p>
                  </div>
                </div>
                <button
                  onClick={toggleCoach}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition ${
                    coachActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {coachActive ? <StopCircle size={24} /> : <Play size={24} />}
                </button>
              </div>

            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Historique des sessions</h3>
              <p className="text-sm text-gray-500">
                L'historique de vos analyses sera bientôt disponible ici.
              </p>
            </div>
          </div>
        )}

        {/* === Analytics === */}
        {activeTab === "analytics" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analytics & Rapports
            </h2>
            <p className="text-gray-600 mb-6">
              Section en cours de développement. Vous y trouverez des statistiques détaillées sur
              l'assiduité et les performances.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold cursor-not-allowed">
                <Download size={20} className="inline mr-2" /> Exporter en PDF (bientôt)
              </button>
              <button
                onClick={handleSettingsClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                Paramètres avancés
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;