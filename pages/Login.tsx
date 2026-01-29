import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');

  React.useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "721759664536-q36259psb9vshnt5f2q3p5p1t0vnt0v5.apps.googleusercontent.com", // Demo ID - User should replace with their own
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with", shape: "pill" }
      );
    }
  }, []);

  const handleGoogleResponse = (response: any) => {
    setIsLoading(true);
    // Parse JWT to get email (this is basic, normally done on backend for security)
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const user = JSON.parse(jsonPayload);
    localStorage.setItem('medic_pro_auth', 'true');
    localStorage.setItem('medic_pro_user_email', user.email);
    localStorage.setItem('medic_pro_user_name', user.name);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/generator');
    }, 1000);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      alert("Veuillez saisir votre email");
      return;
    }
    setIsLoading(true);
    // Simulation d'une authentification réelle
    setTimeout(() => {
      localStorage.setItem('medic_pro_auth', 'true');
      localStorage.setItem('medic_pro_user_email', email);
      setIsLoading(false);
      navigate('/generator');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Activity className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Connexion à votre espace
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Gérez votre cabinet médical en toute sécurité
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">

          {/* Real Google Login Container */}
          <div id="googleBtn" className="w-full mb-6 min-h-[50px]"></div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Ou avec email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email professionnel
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3"
                  placeholder="dr.nom@clinique.dz"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          En vous connectant, vous acceptez nos <a href="#" className="font-bold">Conditions Générales</a> et notre <a href="#" className="font-bold">Politique de Confidentialité</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
