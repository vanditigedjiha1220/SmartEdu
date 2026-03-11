import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, BookOpen, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('teacher');
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isValidEmail(email) || !isValidPassword(password)) {
      setError('Veuillez fournir un email et un mot de passe valides.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role !== role) {
          setError(`Vous n'êtes pas enregistré en tant que ${role}.`);
          await auth.signOut();
          setLoading(false);
          return;
        }

        setSuccess('Connexion réussie ! Redirection...');
        setTimeout(() => {
          switch (userData.role) {
            case 'teacher':
              navigate('/teacher');
              break;
            case 'parent':
              navigate('/parent');
              break;
            case 'supervisor':
              navigate('/supervisor');
              break;
            default:
              navigate('/');
          }
        }, 1500);
      } else {
        setError('Profil utilisateur introuvable. Veuillez contacter le support.');
        await auth.signOut();
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Aucun utilisateur trouvé avec cet email.');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect.');
          break;
        default:
          setError('Email ou mot de passe incorrect.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!fullName.trim() || !isValidEmail(email) || !isValidPassword(password) || password !== confirmPassword || !schoolName.trim()) {
      setError('Veuillez remplir tous les champs correctement.');
      setLoading(false);
      return;
    }

    console.log("Attempting to create account with email:", email);
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Now, try to create the user document in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName,
          email,
          role,
          schoolName,
          createdAt: new Date(),
        });

        setSuccess('Compte créé avec succès ! Vous serez redirigé...');
        setTimeout(() => {
          switch (role) {
            case 'teacher':
              navigate('/teacher');
              break;
            case 'parent':
              navigate('/parent');
              break;
            case 'supervisor':
              navigate('/supervisor');
              break;
            default:
              navigate('/');
          }
        }, 2000);

      } catch (firestoreError) {
        console.error("Firestore error: ", firestoreError);
        setError("Votre compte a été authentifié, mais une erreur est survenue lors de l'enregistrement de vos données. Veuillez contacter le support.");
        // Optional: delete the just-created user from Auth to allow them to try again
        // await userCredential.user.delete();
      }

          } catch (authError) {
            switch (authError.code) {
              case 'auth/email-already-in-use':
                setError(
                  <span>
                    Cet email est déjà utilisé. Avez-vous oublié votre mot de passe ou voulez-vous 
                    <button 
                      onClick={() => {
                        setIsLogin(true);
                        setError(null);
                      }} 
                      className="text-blue-600 hover:underline font-semibold ml-1"
                    >
                      vous connecter
                    </button> ?
                  </span>
                );
                break;
              case 'auth/weak-password':
                setError('Le mot de passe doit contenir au moins 6 caractères.');
                break;
              default:
                console.error("Authentication error: ", authError);
                setError('Erreur lors de la création du compte.');
                break;
            }
          } finally {
            setLoading(false);
          }  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setSchoolName('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Left Section - Welcome */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 to-blue-900 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-30 -mb-16 -ml-16"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full opacity-20"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-25"></div>
            
            <div className="relative z-10">
              <div className="mb-4">
                <BookOpen size={50} className="text-white mx-auto mb-3" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">BIENVENUE</h1>
              <p className="text-xs text-white/90 tracking-widest mb-3 uppercase">SchoolTrack Platform</p>
              <p className="text-white/80 text-xs leading-relaxed max-w-xs mx-auto">
                Plateforme de gestion scolaire moderne et intuitive pour enseignants, parents et superviseurs
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="lg:w-3/5 bg-white p-6 lg:p-8 flex flex-col justify-center items-center">
            <div className="max-w-md mx-auto w-full text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                {isLogin ? 'Accédez à votre espace personnel' : 'Rejoignez notre plateforme'}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">✓</div>
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                {!isLogin && (
                  <>
                    <InputField 
                      icon={User} 
                      type="text" 
                      placeholder="Ibrahim Adamou" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      label="Nom Complet" 
                    />
                    <InputField 
                      icon={BookOpen} 
                      type="text" 
                      placeholder="Lycée de Domayo" 
                      value={schoolName} 
                      onChange={(e) => setSchoolName(e.target.value)} 
                      label="Nom de l'École" 
                    />
                  </>
                )}
                
                <InputField 
                  icon={Mail} 
                  type="email" 
                  placeholder="votre@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  label="Email" 
                />
                
                <PasswordField 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  showPassword={showPassword} 
                  setShowPassword={setShowPassword} 
                  label="Mot de passe" 
                />
                
                {!isLogin && (
                  <PasswordField 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    showPassword={showPassword} 
                    setShowPassword={setShowPassword} 
                    label="Confirmer le mot de passe" 
                  />
                )}
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Sélectionnez votre rôle</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'teacher', label: 'Enseignant', icon: '👨‍🏫' }, 
                      { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧' }, 
                      { value: 'supervisor', label: 'Surveillant', icon: '🛡️' }
                    ].map(opt => (
                      <button 
                        key={opt.value} 
                        type="button" 
                        onClick={() => setRole(opt.value)} 
                        className={`py-3 px-2 rounded-lg font-medium transition text-sm flex flex-col items-center gap-1 ${
                          role === opt.value 
                            ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg' 
                            : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isLogin ? 'Se Connecter' : 'Créer un Compte'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Pas encore de compte ? " : "Vous avez déjà un compte ? "}
                  <button 
                    onClick={toggleForm} 
                    className="text-blue-600 hover:text-blue-700 font-semibold transition"
                  >
                    {isLogin ? "S'inscrire" : 'Se connecter'}
                  </button>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm transition">
                  ← Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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

const InputField = ({ icon: Icon, type, placeholder, value, onChange, label }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</label>
    <div className="relative">
      <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  </div>
);

const PasswordField = ({ value, onChange, showPassword, setShowPassword, label }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 mb-2 block">{label}</label>
    <div className="relative">
      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input 
        type={showPassword ? 'text' : 'password'} 
        placeholder="••••••••" 
        value={value} 
        onChange={onChange} 
        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <button 
        type="button" 
        onClick={() => setShowPassword(!showPassword)} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default LoginSignupPage;