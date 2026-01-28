import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingCard: React.FC<{ 
  title: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean;
  color: string; 
}> = ({ title, price, features, isPopular, color }) => (
  <div className={`relative p-8 bg-white rounded-2xl shadow-xl border ${isPopular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-slate-100'} flex flex-col`}>
    {isPopular && (
      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
        RECOMMANDÉ
      </span>
    )}
    <h3 className={`text-xl font-bold mb-4 ${color}`}>{title}</h3>
    <div className="mb-6">
      <span className="text-4xl font-extrabold text-slate-900">{price}</span>
      <span className="text-slate-500">DA/mois</span>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feat, i) => (
        <li key={i} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-slate-600 text-sm">{feat}</span>
        </li>
      ))}
    </ul>
    <Link to="/generator" className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
      Choisir ce pack
    </Link>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Tarifs adaptés à l'Algérie</h1>
          <p className="text-lg text-slate-600">Choisissez l'offre adaptée à la taille de votre cabinet. Paiement en Dinars.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Débutant"
            price="3 500"
            color="text-slate-900"
            features={[
              "Gestion jusqu'à 100 patients",
              "Dashboard basique",
              "Génération IA",
              "1 utilisateur",
              "Support email"
            ]}
          />
          <PricingCard
            title="Pro"
            price="6 500"
            isPopular={true}
            color="text-blue-600"
            features={[
              "Patients illimités",
              "Agenda intelligent",
              "Rappels SMS (Option)",
              "Historique complet",
              "Analyse financière IA",
              "Support prioritaire"
            ]}
          />
          <PricingCard
            title="Clinique"
            price="12 000"
            color="text-purple-600"
            features={[
              "Multi-médecins (jusqu'à 5)",
              "Vue consolidée",
              "Rapports automatiques",
              "API pour laboratoires",
              "Formation sur site",
              "Account manager dédié"
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
