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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Solution N°1 en Algérie 🇩🇿
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Gérez votre cabinet médical <span className="text-blue-600">intelligemment</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Une plateforme complète : Dossiers patients, rendez-vous, et tableaux de bord financiers (Dinars) générés par l'IA.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/generator" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center">
                  Créer mon espace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/features" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium text-lg hover:bg-slate-50 transition-colors flex items-center justify-center">
                  Voir une démo
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-slate-500">
                <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1"/> Paiement en Dinars</div>
                <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1"/> Adapté aux médecins algériens</div>
              </div>
            </div>

            {/* Hero Visual - Abstract Dashboard */}
            <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none">
               <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                       <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">DA</div>
                       <div>
                          <h3 className="font-bold text-slate-900">Dr. Amine Benali</h3>
                          <p className="text-xs text-slate-500">Cabinet Médical Alger</p>
                       </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">+12% vs N-1</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                       <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Patients</p>
                       <p className="text-2xl font-bold text-slate-900 mt-1">1,245</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                       <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Revenus (DA)</p>
                       <p className="text-2xl font-bold text-slate-900 mt-1">450k</p>
                    </div>
                  </div>

                  <div className="h-48 w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={heroChartData}>
                        <defs>
                          <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               
               {/* Floating Badge */}
               <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3 animate-bounce duration-[3000ms]">
                 <div className="bg-green-100 p-2 rounded-full">
                   <CheckCircle className="h-6 w-6 text-green-600" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900">Nouveaux Patients</p>
                   <p className="text-xs text-slate-500">Ajoutez-les en 1 clic</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Gérez tout votre cabinet</h2>
            <p className="text-lg text-slate-600">Plus qu'un tableau de bord, un véritable assistant pour votre activité quotidienne.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Créez votre espace', desc: 'Entrez le nom de votre cabinet et votre spécialité.', icon: <BarChart2 className="h-6 w-6 text-blue-600" /> },
              { num: '2', title: 'Gérez vos patients', desc: 'Ajoutez des dossiers, suivez les historiques et notez les observations.', icon: <PieChart className="h-6 w-6 text-blue-600" /> },
              { num: '3', title: 'Pilotez avec l\'IA', desc: 'Visualisez vos revenus en Dinars et optimisez votre planning.', icon: <Zap className="h-6 w-6 text-blue-600" /> }
            ].map((step, idx) => (
              <div key={idx} className="relative p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-900">{step.num}</div>
                <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Pourquoi choisir Dashboard Médic Pro ?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Adapté à l\'Algérie', desc: 'Devises en Dinars, format de téléphone local, noms algériens.' },
                  { title: 'Gestion Patients Simple', desc: 'Ajoutez, modifiez et supprimez des patients en quelques clics.' },
                  { title: 'Sécurité maximale', desc: 'Vos données sont protégées. Aucune installation requise.' },
                  { title: 'Agenda Intelligent', desc: 'Gérez vos rendez-vous et réduisez les absences.' },
                ].map((item, i) => (
                  <div key={i} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20"></div>
              <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-8">
                 {/* Mini mocked dashboard UI */}
                 <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
                    <div className="text-sm font-medium text-slate-300">Consultations du jour</div>
                    <div className="text-green-400 font-bold">24 Patients</div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                       <span className="text-slate-300">09:00 - Mme. Saidi</span>
                       <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Confirmé</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                       <span className="text-slate-300">10:30 - M. Khelif</span>
                       <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">En attente</span>
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-slate-700">
                    <p className="text-sm text-slate-400 italic">"Dr, vous avez 3 créneaux libres cet après-midi."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Les médecins algériens nous font confiance</h2>
           <div className="grid md:grid-cols-2 gap-8">
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-slate-700 text-lg mb-6 italic">"Enfin un logiciel adapté à notre réalité en Algérie. Je gère mes patients et mes revenus en Dinars très facilement depuis mon cabinet à Oran."</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-4">YB</div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. Yasmina B.</p>
                    <p className="text-sm text-slate-500">Pédiatre à Oran</p>
                  </div>
                </div>
             </div>
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-slate-700 text-lg mb-6 italic">"L'IA me fait gagner un temps fou sur la gestion administrative. Je peux me concentrer sur mes patients."</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold mr-4">KM</div>
                  <div>
                    <p className="font-bold text-slate-900">Dr. Karim M.</p>
                    <p className="text-sm text-slate-500">Généraliste à Alger</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>
      
      {/* CTA Bottom */}
      <section className="py-20 bg-blue-600">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à moderniser votre cabinet ?</h2>
            <p className="text-blue-100 text-lg mb-10">Rejoignez la communauté des médecins connectés.</p>
            <Link to="/generator" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-xl">
               Commencer gratuitement
            </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
