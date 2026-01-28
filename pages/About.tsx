import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-64 bg-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-900/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h1 className="text-4xl font-bold text-white z-10">Notre Mission</h1>
            </div>
          </div>
          
          <div className="p-8 md:p-12 space-y-8">
             <div>
               <h2 className="text-2xl font-bold text-slate-900 mb-4">Simplifier la vie des soignants</h2>
               <p className="text-slate-600 leading-relaxed text-lg">
                 Dashboard Médic Pro est né d'un constat simple : les médecins passent trop de temps sur l'administratif et pas assez avec leurs patients. Les outils de gestion existants sont souvent complexes, moches et inadaptés à une analyse rapide.
               </p>
               <p className="text-slate-600 leading-relaxed text-lg mt-4">
                 Notre objectif est d'utiliser la puissance de l'Intelligence Artificielle pour rendre l'analyse de données médicales accessible, claire et instantanée.
               </p>
             </div>

             <div className="grid md:grid-cols-2 gap-8 py-8 border-t border-b border-slate-100">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Innovation</h3>
                   <p className="text-slate-600">Nous utilisons les derniers modèles de langage (Gemini) pour transformer des données brutes en conseils stratégiques.</p>
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Design</h3>
                   <p className="text-slate-600">Nous croyons que les outils pro doivent être aussi agréables à utiliser que vos applications grand public préférées.</p>
                </div>
             </div>

             <div className="text-center">
               <h3 className="text-xl font-bold text-slate-900 mb-6">L'équipe fondatrice</h3>
               <div className="flex justify-center space-x-8">
                 <div className="text-center">
                   <div className="h-20 w-20 bg-slate-200 rounded-full mx-auto mb-2 overflow-hidden">
                      <img src="https://picsum.photos/100/100?random=1" alt="CEO" />
                   </div>
                   <p className="font-bold text-slate-900">Thomas D.</p>
                   <p className="text-sm text-slate-500">Tech Lead</p>
                 </div>
                 <div className="text-center">
                   <div className="h-20 w-20 bg-slate-200 rounded-full mx-auto mb-2 overflow-hidden">
                      <img src="https://picsum.photos/100/100?random=2" alt="CTO" />
                   </div>
                   <p className="font-bold text-slate-900">Marie L.</p>
                   <p className="text-sm text-slate-500">Product Designer</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
