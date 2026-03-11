import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Clock, TrendingUp, MessageSquare, BarChart3, Bell, Filter, Download, Eye } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Composant StatCard
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

// Mock Data
const mockAlerts = [
  { id: 1, type: 'warning', message: 'Taux d\'absence élevé en classe 3A', teacher: 'Mme Dupont', severity: 'high', read: false, time: '10:30' },
  { id: 2, type: 'info', message: 'Nouveau rapport disponible', teacher: 'M. Martin', severity: 'low', read: false, time: '09:15' },
  { id: 3, type: 'success', message: 'Excellente performance pédagogique', teacher: 'Mme Bernard', severity: 'success', read: true, time: 'Hier' }
];

const mockWeeklyData = [
  { day: 'Lun', attendance: 95, alerts: 2 },
  { day: 'Mar', attendance: 93, alerts: 1 },
  { day: 'Mer', attendance: 97, alerts: 0 },
  { day: 'Jeu', attendance: 94, alerts: 3 },
  { day: 'Ven', attendance: 96, alerts: 1 }
];

const mockClassStats = [
  { class: '3A', teacher: 'Mme Nadia', students: 28, avgAttendance: 92, alerts: 3 },
  { class: '4B', teacher: 'M. Dawai', students: 25, avgAttendance: 95, alerts: 1 },
  { class: '5C', teacher: 'Mme Aissatou', students: 30, avgAttendance: 97, alerts: 0 }
];

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [weeklyData, setWeeklyData] = useState(mockWeeklyData);
  const [teacherMetrics, setTeacherMetrics] = useState([]);
  const [classStats, setClassStats] = useState(mockClassStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer tous les enseignants
        const teachersQuery = query(collection(db, 'users'), where('role', '==', 'teacher'));
        const teachersSnapshot = await getDocs(teachersQuery);
        const teachers = teachersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. Récupérer toutes les analyses
        const analysesSnapshot = await getDocs(collection(db, 'coachAnalyses'));
        const analyses = analysesSnapshot.docs.map(doc => doc.data());

        // 3. Agréger les données par enseignant
        const metrics = teachers.map(teacher => {
          const teacherAnalyses = analyses.filter(a => a.teacherUid === teacher.id);
          
          if (teacherAnalyses.length === 0) {
            return {
              id: teacher.id,
              name: teacher.fullName || 'Enseignant',
              motivation: 0,
              frustration: 0,
              sessions: 0,
              attendance: 'N/A',
            };
          }

          const totalMotivation = teacherAnalyses.reduce((sum, a) => sum + (a.sentiment?.scores?.joy || 0), 0);
          const totalFrustration = teacherAnalyses.reduce((sum, a) => sum + (a.sentiment?.scores?.sadness || 0), 0);

          return {
            id: teacher.id,
            name: teacher.fullName || 'Enseignant',
            motivation: (totalMotivation / teacherAnalyses.length).toFixed(1),
            frustration: (totalFrustration / teacherAnalyses.length).toFixed(1),
            sessions: teacherAnalyses.length,
            attendance: 'N/A',
          };
        });

        setTeacherMetrics(metrics);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des enseignants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const markAsRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  // Calculs des statistiques globales
  const totalStudents = classStats.reduce((sum, c) => sum + c.students, 0);
  const avgAttendance = classStats.length > 0 
    ? (classStats.reduce((sum, c) => sum + c.avgAttendance, 0) / classStats.length).toFixed(1)
    : 0;
  const totalAlerts = classStats.reduce((sum, c) => sum + c.alerts, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Chargement des données...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* En-tête */}
      <header className="bg-white shadow-md border-b border-gray-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Superviseur</h1>
          <p className="text-gray-500">Vue d'ensemble de l'établissement</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={24} className="text-gray-600 cursor-pointer hover:text-blue-600 transition" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            👔
          </div>
        </div>
      </header>

      {/* Onglets */}
      <div className="flex border-t border-gray-200 px-8">
        {['overview', 'teachers', 'alerts', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'overview' && '📊 Vue d\'ensemble'}
            {tab === 'teachers' && '👨‍🏫 Enseignants'}
            {tab === 'alerts' && '🔔 Alertes'}
            {tab === 'reports' && '📈 Rapports'}
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <main className="p-8">
        {/* === Vue d'ensemble === */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={Users} 
                title="Total Élèves" 
                value={totalStudents} 
                unit="élèves" 
                color="#6366F1" 
                subtext={`${classStats.length} classes`} 
              />
              <StatCard 
                icon={TrendingUp} 
                title="Taux Présence Moyen" 
                value={avgAttendance} 
                unit="%" 
                color="#10B981" 
              />
              <StatCard 
                icon={AlertCircle} 
                title="Alertes Actives" 
                value={totalAlerts} 
                unit="alertes" 
                color="#EF4444" 
              />
              <StatCard 
                icon={BarChart3} 
                title="Enseignants Actifs" 
                value={teacherMetrics.length} 
                unit="profs" 
                color="#3B82F6" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Statistiques par classe */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Statistiques par Classe</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Classe</th>
                      <th>Enseignant</th>
                      <th>Élèves</th>
                      <th>Présence</th>
                      <th>Alertes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStats.map((cls, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{cls.class}</td>
                        <td className="text-center">{cls.teacher}</td>
                        <td className="text-center">{cls.students}</td>
                        <td className="text-center">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                            {cls.avgAttendance}%
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cls.alerts > 2 ? 'bg-red-100 text-red-800' : 
                            cls.alerts > 0 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {cls.alerts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Évolution hebdomadaire */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Évolution Hebdomadaire</h2>
                <div className="space-y-4">
                  {weeklyData.map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700 w-16">{day.day}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all"
                            style={{ width: `${day.attendance}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-bold text-blue-600 w-12">{day.attendance}%</span>
                      <span className="text-sm text-gray-500 w-20 text-right">
                        {day.alerts} alerte{day.alerts !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* === Enseignants === */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Métriques des Enseignants</h2>
            {teacherMetrics.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune donnée d'enseignant disponible</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Enseignant</th>
                    <th className="text-center py-4 px-4">Sessions</th>
                    <th className="text-center py-4 px-4">Motivation</th>
                    <th className="text-center py-4 px-4">Frustration</th>
                    <th className="text-center py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherMetrics.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-800">{teacher.name}</td>
                      <td className="text-center">{teacher.sessions}</td>
                      <td className="text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {teacher.motivation}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {teacher.frustration}
                        </span>
                      </td>
                      <td className="text-center">
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mx-auto">
                          <Eye size={16} /> Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* === Alertes === */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertes et Notifications</h2>
            <div className="space-y-3">
              {alerts.map((alert) => {
                const colors = {
                  high: 'border-red-300 bg-red-50',
                  low: 'border-blue-300 bg-blue-50',
                  success: 'border-green-300 bg-green-50',
                };
                return (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${colors[alert.severity]} ${alert.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <AlertCircle size={24} className={
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'low' ? 'text-blue-500' :
                          'text-green-500'
                        } />
                        <div>
                          <p className="font-medium text-gray-800">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.teacher} • {alert.time}</p>
                        </div>
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === Rapports === */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rapports et Exports</h2>
            <p className="text-gray-600 mb-6">
              Générez des rapports détaillés sur les performances de l'établissement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <Download size={24} className="text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Rapport Mensuel</p>
                  <p className="text-sm text-gray-500">Statistiques complètes du mois</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <Download size={24} className="text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Rapport Enseignants</p>
                  <p className="text-sm text-gray-500">Performance pédagogique</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <Download size={24} className="text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Rapport Présences</p>
                  <p className="text-sm text-gray-500">Analyse de l'assiduité</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
                <Download size={24} className="text-blue-500" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Export Personnalisé</p>
                  <p className="text-sm text-gray-500">Choisir les données à exporter</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupervisorDashboard;