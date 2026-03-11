import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Shield, Clock, Zap, ArrowRight, CheckCircle, Star, BookOpen, Menu, X } from 'lucide-react';
import schoolImage from '../assets/images/image1.jpg';

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-blue-700" />
            </div>
            <span className="text-white font-bold text-xl">SchoolTrack</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/90 hover:text-white transition font-medium">Fonctionnalités</a>
            <a href="#users" className="text-white/90 hover:text-white transition font-medium">À propos</a>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800/95 backdrop-blur-md border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-white/90 hover:text-white transition font-medium">Fonctionnalités</a>
              <a href="#users" className="block text-white/90 hover:text-white transition font-medium">À propos</a>
              <Link
                to="/login"
                className="block text-center px-6 py-2.5 bg-white text-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-white/10 border border-white/30 rounded-full text-white text-sm font-semibold backdrop-blur-sm">
                🎓 Plateforme de Gestion Scolaire
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Bienvenue sur <span className="text-white drop-shadow-lg">SchoolTrack</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg leading-relaxed">
                La solution intelligente pour le suivi scolaire moderne. Gérez les présences, analysez les performances et communiquez efficacement.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Appel automatisé et rapide' },
                { icon: BarChart3, text: 'Analyses et statistiques détaillées' },
                { icon: Users, text: 'Communication instantanée' },
                { icon: Shield, text: 'Sécurité et confidentialité' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <item.icon size={20} className="text-white" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-700 hover:bg-gray-100 rounded-lg font-bold transition shadow-xl flex items-center justify-center gap-2 group"
              >
                Commencer Maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition border border-white/30 backdrop-blur-sm"
              >
                En Savoir Plus
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition duration-300"></div>
              
              {/* Image Container */}
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-2xl">
                <img
                  src={schoolImage}
                  alt="École"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent"></div>
              </div>

              {/* Stats Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Fiable</p>
                    <p className="text-sm text-blue-100">& Sécurisé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a 
          href="#features"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <div className="text-white/70 text-center">
            <p className="text-sm mb-2">Découvrez plus</p>
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
              ✨ Fonctionnalités
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tout pour Gérer Votre École
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour simplifier la gestion quotidienne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: Zap,
                gradient: 'from-blue-500 to-blue-600',
                title: 'Appel Automatisé',
                description: 'Prenez les présences rapidement avec notre système intelligent. Gain de temps garanti.'
              },
              {
                icon: BarChart3,
                gradient: 'from-indigo-500 to-indigo-600',
                title: 'Analyses Avancées',
                description: 'Visualisez les statistiques en temps réel avec des graphiques détaillés et interactifs.'
              },
              {
                icon: Users,
                gradient: 'from-purple-500 to-purple-600',
                title: 'Communication',
                description: 'Échangez facilement entre parents, enseignants et administration via messagerie intégrée.'
              },
              {
                icon: Clock,
                gradient: 'from-blue-600 to-indigo-600',
                title: 'Suivi en Temps Réel',
                description: 'Accédez aux informations instantanément avec des mises à jour automatiques.'
              },
              {
                icon: Shield,
                gradient: 'from-indigo-600 to-purple-600',
                title: 'Sécurité Renforcée',
                description: 'Vos données sont protégées avec Firebase et chiffrées de bout en bout.'
              },
              {
                icon: Star,
                gradient: 'from-purple-600 to-pink-600',
                title: 'Rapports Détaillés',
                description: 'Générez des rapports complets sur les performances et les présences.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="users" className="relative py-24 px-6 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-white/10 border border-white/30 text-white rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
              👥 Pour Tous
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Une Solution pour Chacun
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Enseignants, parents et superviseurs : tout le monde y trouve son compte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Parents */}
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="text-5xl mb-5">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-white mb-4">Parents</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Notifications d'absence instantanées</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Suivi des notes et résultats</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Communication directe avec l'école</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Rapports hebdomadaires détaillés</span>
                </li>
              </ul>
            </div>

            {/* Enseignants */}
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="text-5xl mb-5">👨‍🏫</div>
              <h3 className="text-2xl font-bold text-white mb-4">Enseignants</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Appel automatisé simple</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Gestion des notes facilitée</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Analyses de performance</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Tableaux de bord personnalisés</span>
                </li>
              </ul>
            </div>

            {/* Superviseurs */}
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="text-5xl mb-5">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Superviseurs</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Vue d'ensemble complète</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Alertes en temps réel</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Statistiques globales</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                  <span>Gestion centralisée</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines d'écoles qui utilisent déjà SchoolTrack pour simplifier leur gestion quotidienne
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl hover:shadow-2xl group"
            >
              Démarrer Gratuitement
              <ArrowRight size={24} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-blue-700" />
                </div>
                <span className="text-white font-bold text-xl">SchoolTrack</span>
              </div>
              <p className="text-blue-200">
                La plateforme de gestion scolaire moderne et intelligente
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#users" className="hover:text-white transition">À propos</a></li>
                <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-blue-200">
            <p>&copy; 2025 SchoolTrack. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default HomePage;