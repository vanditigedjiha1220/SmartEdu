import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, BookOpen, Calendar, MessageCircle, TrendingUp, Download, Bell, Clock, Award, Check, X } from 'lucide-react';

// Composant StatCard
const StatCard = ({ icon: Icon, title, value, unit, color, subtext }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ borderTopColor: color }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[#888888] text-sm font-semibold uppercase tracking-wide">{title}</p>
        <div className="flex items-baseline gap-2 mt-3">
          <p className="text-4xl font-bold" style={{ color }}>
            {value}
          </p>
          <p className="text-sm text-[#888888] font-medium">{unit}</p>
        </div>
        {subtext && <p className="text-xs text-[#888888] mt-3 font-medium">{subtext}</p>}
      </div>
      <div className="p-3 rounded-xl shadow-md" style={{ backgroundColor: `${color}20` }}>
        <Icon size={28} style={{ color }} />
      </div>
    </div>
  </div>
);

// Mock Data
const mockChildren = [
  { id: 'child1', name: 'Hadjidja', grade: '5ème', photo: '👧' },
  { id: 'child2', name: 'Arafat', grade: '3ème', photo: '👦' }
];

const mockChildStats = {
  child1: {
    name: 'Hadjidja',
    attendanceRate: 95,
    absences: 2,
    lateness: 1,
    averageGrade: 15.5,
    behaviorScore: 8.5,
    behavior: 'Très bien'
  },
  child2: {
    name: 'Arafat',
    attendanceRate: 88,
    absences: 5,
    lateness: 3,
    averageGrade: 13.2,
    behaviorScore: 7.0,
    behavior: 'Bien'
  }
};

const mockNotifications = [
  { id: 1, type: 'alert', message: 'Absence non justifiée le 15/11', read: false },
  { id: 2, type: 'info', message: 'Réunion parents-profs le 20/11', read: false },
  { id: 3, type: 'success', message: 'Excellent résultat en Maths', read: true }
];

const mockRecentGrades = {
  child1: [
    { subject: 'Mathématiques', grade: 16, date: '01/11/2024' },
    { subject: 'Français', grade: 14, date: '28/10/2024' },
    { subject: 'Histoire', grade: 17, date: '25/10/2024' }
  ],
  child2: [
    { subject: 'Physique', grade: 12, date: '02/11/2024' },
    { subject: 'Anglais', grade: 15, date: '30/10/2024' },
    { subject: 'SVT', grade: 13, date: '27/10/2024' }
  ]
};

const mockWeeklyAttendance = {
  child1: [
    { day: 'Lun', present: true },
    { day: 'Mar', present: true },
    { day: 'Mer', present: true },
    { day: 'Jeu', present: false },
    { day: 'Ven', present: true }
  ],
  child2: [
    { day: 'Lun', present: true },
    { day: 'Mar', present: true },
    { day: 'Mer', present: false },
    { day: 'Jeu', present: true },
    { day: 'Ven', present: false }
  ]
};

const mockMessages = [
  {
    id: 1,
    sender: "Prof. Mbongo",
    subject: "Questions sur le cours du 05/11/2024",
    content: ["Comment aider l'élève avec les fractions?", "Exercices supplémentaires recommandés?"],
    unread: true,
    date: "05/11/2024"
  },
  {
    id: 2,
    sender: "Prof. Kouassi",
    subject: "Questions sur le cours du 03/11/2024",
    content: ["L'élève a besoin de soutien en grammaire", "Suggestions de lecture?"],
    unread: false,
    date: "03/11/2024"
  }
];

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState('child1');
  const [children] = useState(mockChildren);
  const [childStats] = useState(mockChildStats);
  const [notifications] = useState(mockNotifications);
  const [weeklyAttendance] = useState(mockWeeklyAttendance);
  const [recentGrades] = useState(mockRecentGrades);
  const [messages] = useState(mockMessages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du chargement
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const currentChild = selectedChild ? childStats[selectedChild] : null;
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0099FF] to-[#0052CC] text-white text-lg font-semibold">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0099FF] to-[#0052CC]">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#007BFF] to-[#0044CC] bg-clip-text text-transparent">Espace Parent</h1>
            <p className="text-[#888888] mt-1 font-medium">Suivi scolaire de votre enfant</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={24} className="text-[#333333] cursor-pointer hover:text-[#0052CC] transition-colors duration-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#0099FF] to-[#007BFF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0044CC] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              👨‍👩‍👧
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedChild === child.id
                      ? 'bg-gradient-to-r from-[#007BFF] to-[#0044CC] text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-[#333333] hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  {child.photo} {child.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-gray-100 -mx-8 px-8">
            {['overview', 'grades', 'attendance', 'messages'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-all duration-300 border-b-2 ${
                  activeTab === tab
                    ? 'border-[#0044CC] text-[#0052CC] bg-blue-50/50'
                    : 'border-transparent text-[#888888] hover:text-[#333333] hover:bg-gray-50'
                }`}
              >
                {tab === 'overview' && '📊 Vue d\'ensemble'}
                {tab === 'grades' && '📈 Notes'}
                {tab === 'attendance' && '📅 Présences'}
                {tab === 'messages' && `💬 Messages ${unreadMessages > 0 ? `(${unreadMessages})` : ''}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'overview' && currentChild && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Calendar}
              title="Taux Présence"
              value={currentChild.attendanceRate}
              unit="%"
              color="#10B981"
              subtext={`${currentChild.absences} absence(s)`}
            />
            <StatCard
              icon={Clock}
              title="Retards"
              value={currentChild.lateness}
              unit="cette année"
              color="#F59E0B"
            />
            <StatCard
              icon={Award}
              title="Moyenne"
              value={currentChild.averageGrade}
              unit="/20"
              color="#3B82F6"
            />
            <StatCard
              icon={Heart}
              title="Comportement"
              value={currentChild.behaviorScore}
              unit="/10"
              color="#EC4899"
              subtext={currentChild.behavior}
            />
          </div>
        )}

        {activeTab === 'grades' && currentChild && (
          <div className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Dernières Notes de {currentChild.name}</h2>
            <div className="space-y-4">
              {recentGrades[selectedChild].map((grade, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div>
                    <p className="font-bold text-lg text-[#1A1A1A]">{grade.subject}</p>
                    <p className="text-sm text-[#888888] mt-1">Reçu le {grade.date}</p>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#007BFF] to-[#0044CC] bg-clip-text text-transparent">
                    {grade.grade}/20
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Présences de la Semaine</h2>
            <div className="flex justify-around">
              {weeklyAttendance[selectedChild].map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  <p className="font-bold text-[#333333] text-lg">{day.day}</p>
                  <div className={`p-3 rounded-full ${day.present ? 'bg-green-100' : 'bg-red-100'}`}>
                    {day.present ? (
                      <Check size={28} className="text-green-600" />
                    ) : (
                      <X size={28} className="text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Messagerie</h2>
            {messages.length === 0 ? (
              <p className="text-[#888888] text-center py-12 text-lg">Aucun message pour le moment</p>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                      msg.unread
                        ? 'bg-gradient-to-r from-blue-50 to-transparent border-[#0052CC] shadow-sm'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-[#1A1A1A]">{msg.sender}</p>
                    <p className="font-semibold text-[#333333] mt-1">{msg.subject}</p>
                    <ul className="list-disc list-inside mt-3 text-sm text-[#333333] space-y-1">
                      {msg.content && msg.content.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                    <p className="text-xs text-[#888888] mt-3 text-right font-medium">{msg.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;