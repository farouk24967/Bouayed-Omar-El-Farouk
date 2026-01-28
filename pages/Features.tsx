import React from 'react';
import { BarChart2, Shield, Brain, Users, FileText, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Intelligence Artificielle",
      desc: "Notre moteur IA analyse vos données brutes et génère automatiquement les indicateurs les plus pertinents pour votre spécialité, sans configuration complexe."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
      title: "Visualisation Interactive",
      desc: "Interagissez avec vos données. Zoomez sur une période, filtrez par type de consultation et comparez vos performances d'une année sur l'autre."
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Rapports Automatisés",
      desc: "Recevez chaque lundi matin un rapport PDF synthétique de votre activité directement dans votre boîte mail. Idéal pour commencer la semaine."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Sécurité HDS",
      desc: "La sécurité est notre priorité. Vos données sont chiffrées de bout en bout et hébergées sur des serveurs certifiés Hébergeur de Données de Santé."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Multi-Praticiens",
      desc: "Gérez un cabinet de groupe facilement. Chaque médecin a sa vue propre, et les associés ont une vue consolidée de l'activité globale."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "100% Mobile",
      desc: "Consultez vos chiffres entre deux consultations ou depuis chez vous. Notre interface est parfaitement optimisée pour smartphones et tablettes."
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Tout ce dont vous avez besoin pour piloter votre cabinet</h1>
          <p className="text-lg text-slate-600">Une suite d'outils puissants, emballée dans une interface simple que vous allez adorer utiliser.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-white rounded-xl shadow-sm mb-6 border border-slate-100">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
