import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Zap, Lock, PieChart, Star, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock data for hero chart
const heroChartData = [
  { name: 'Lun', patients: 12 },
  { name: 'Mar', patients: 19 },
  { name: 'Mer', patients: 15 },
  { name: 'Jeu', patients: 22 },
  { name: 'Ven', patients: 28 },
  { name: 'Sam', patients: 10 },
];

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[140px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-400 rounded-full blur-[120px] opacity-10 translate-x-1/4 -translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white shadow-xl shadow-blue-900/5 border border-slate-100 text-slate-900 text-sm font-bold mb-10">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-3 animate-pulse"></span>
                Propulsé par l'IA • Spécialisé Algérie 🇩🇿
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-10 transition-all">
                Votre cabinet, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">réinventé.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 mb-14 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                La plateforme de gestion médicale tout-en-un qui automatise votre administratif et sublime votre pratique.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <Link to="/login" className="group w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-2xl shadow-slate-900/20 flex items-center justify-center">
                  Commencer l'aventure
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center hover:border-slate-300">
                  Déjà membre ? Se connecter
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative rounded-[2.5rem] bg-white shadow-2xl border border-slate-200 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">DA</div>
                    <div>
                      <h3 className="font-extrabold text-slate-900">Dr. Amine Benali</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cabinet Médical Alger</p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100">+12.5%</div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Patients ce mois</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">1,245</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Revenus (DA)</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">450k</p>
                  </div>
                </div>

                <div className="h-56 w-full bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={heroChartData}>
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPatients)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -bottom-10 -left-10 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 flex items-center space-x-4 animate-bounce duration-[4000ms]">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Rendez-vous Sync</p>
                  <p className="text-xs text-slate-500">Mise à jour en temps réel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Une puissance inégalée.</h2>
            <p className="text-xl text-slate-500 font-medium">Tout ce dont vous avez besoin pour piloter votre cabinet, sans la complexité.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Intelligence Artificielle', desc: 'Des analyses poussées de votre activité pour optimiser votre rentabilité.', icon: <Zap /> },
              { title: 'Dossiers Patients', desc: 'Centralisez l\'historique médical pour un suivi patient irréprochable.', icon: <BarChart2 /> },
              { title: 'Finance en Dinars', desc: 'Suivez vos encaissements et gérez vos objectifs financiers mensuels.', icon: <PieChart /> }
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-slate-900 transition-all duration-500">
                <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "h-6 w-6 text-blue-600" })}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors uppercase font-bold text-[10px] tracking-widest">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Rejoignez le futur <br /> de la médecine.</h2>
              <p className="text-slate-400 text-xl mb-12 max-w-xl mx-auto">Créez votre compte gratuit aujourd'hui et transformez votre exercice.</p>
              <Link to="/login" className="inline-block bg-white text-slate-900 px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl">
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">© 2026 Dashboard Médic Pro • Conçu pour les experts</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
