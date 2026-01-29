import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ChevronRight, Github, Twitter, Linkedin, LogOut, User } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAuthenticated = localStorage.getItem('medic_pro_auth') === 'true';
  const userEmail = localStorage.getItem('medic_pro_user_email');

  const handleLogout = () => {
    localStorage.removeItem('medic_pro_auth');
    localStorage.removeItem('medic_pro_user_email');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600';

  // If in generator (Dashboard), we might want a different layout, but for now we keep the header/footer 
  // structure but simplify the header inside the dashboard. 
  // Actually, for the Dashboard view (Generator), we often hide the main marketing header.
  const isDashboard = location.pathname === '/generator';

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Médic Pro</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Accueil</Link>
              <Link to="/features" className={isActive('/features')}>Fonctionnalités</Link>
              <Link to="/pricing" className={isActive('/pricing')}>Tarifs</Link>
              <Link to="/about" className={isActive('/about')}>À Propos</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              
              {isAuthenticated ? (
                 <div className="flex items-center space-x-4 ml-4">
                    <Link to="/generator" className="text-sm font-medium text-slate-900 hover:text-blue-600">
                      Mon Espace
                    </Link>
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 flex items-center">
                      <LogOut className="h-4 w-4 mr-1" /> Déconnexion
                    </button>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                      {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                    </div>
                 </div>
              ) : (
                <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                  Connexion
                </Link>
              )}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Accueil</Link>
            <Link to="/features" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Fonctionnalités</Link>
            <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Tarifs</Link>
            {isAuthenticated ? (
              <>
                <Link to="/generator" onClick={() => setIsMenuOpen(false)} className="block text-blue-600 font-bold">Accéder au Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block text-red-500 font-medium">Déconnexion</button>
              </>
            ) : (
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">
                Connexion
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Dashboard Médic Pro</span>
              </div>
              <p className="text-sm text-slate-400">
                La solution N°1 pour piloter votre cabinet médical grâce à l'intelligence artificielle.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-blue-400">Connexion</Link></li>
                <li><Link to="/features" className="hover:text-blue-400">Fonctionnalités</Link></li>
                <li><Link to="/pricing" className="hover:text-blue-400">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-blue-400">À Propos</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
                <li><a href="#" className="hover:text-blue-400">Mentions légales</a></li>
              </ul>
            </div>

             <div>
              <h4 className="text-white font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="hover:text-blue-400"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="hover:text-blue-400"><Github className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; 2024 Dashboard Médic Pro. Tous droits réservés.</p>
            <div className="flex items-center mt-4 md:mt-0">
               <span>Fait avec ❤️ pour les médecins</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
