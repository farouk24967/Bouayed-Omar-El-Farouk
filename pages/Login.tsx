import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Loader2, CheckCircle, User, ArrowRight, Github } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "721759664536-q36259psb9vshnt5f2q3p5p1t0vnt0v5.apps.googleusercontent.com",
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
      );
    }
  }, [mode]);

  const handleGoogleResponse = (response: any) => {
    setIsLoading(true);
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const user = JSON.parse(jsonPayload);

    // Check if account exists
    const existingDb = localStorage.getItem(`medic_pro_db_${user.email}`);

    localStorage.setItem('medic_pro_auth', 'true');
    localStorage.setItem('medic_pro_user_email', user.email);
    localStorage.setItem('medic_pro_user_name', user.name);

    setTimeout(() => {
      setIsLoading(false);
      // If it's a new user (no DB), they will see setup wizard in /generator automatically
      navigate('/generator');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'signup') {
      // Create account
      const userData = { name, email, password };
      localStorage.setItem(`medic_pro_user_meta_${email}`, JSON.stringify(userData));
      localStorage.setItem('medic_pro_auth', 'true');
      localStorage.setItem('medic_pro_user_email', email);
      localStorage.setItem('medic_pro_user_name', name);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/generator'); // Will start setup wizard because medic_pro_db_email doesn't exist yet
      }, 1500);
    } else {
      // Login
      const storedUser = localStorage.getItem(`medic_pro_user_meta_${email}`);
      const userData = storedUser ? JSON.parse(storedUser) : null;

      if (!userData && !localStorage.getItem(`medic_pro_db_${email}`)) {
        alert("Compte introuvable. Veuillez vous inscrire.");
        setIsLoading(false);
        return;
      }

      // Basic password check if metadata exists
      if (userData && userData.password !== password) {
        alert("Mot de passe incorrect.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('medic_pro_auth', 'true');
      localStorage.setItem('medic_pro_user_email', email);
      localStorage.setItem('medic_pro_user_name', userData?.name || email.split('@')[0]);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/generator');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-[1000px] w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row border border-slate-100">

        {/* Left Side: Branding / Info */}
        <div className="md:w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              Tout commence <br />ici.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Simplifiez la gestion de votre cabinet avec l'IA la plus avancée adaptée au marché algérien.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Plus de 500 médecins inscrits</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sécurité des données garantie</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-16">
          <div className="mb-10">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Se connecter
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                S'inscrire
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === 'login' ? 'Bon retour parmi nous' : 'Créer votre compte'}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'login' ? 'Entrez vos identifiants pour accéder à votre espace.' : 'Commencez à gérer votre cabinet en quelques secondes.'}
            </p>
          </div>

          {/* Google Auth Container */}
          <div id="googleBtn" className="w-full mb-8 min-h-[46px]"></div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">Ou email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Dr. Nom Prénom"
                    className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="email"
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white rounded-2xl py-4 font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg shadow-slate-200 mt-4 h-14"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
