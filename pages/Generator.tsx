import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Specialty, FormData, DashboardData, Patient, Appointment, Payment } from '../types';
import { generateDashboardData, chatWithSpecialist, ChatMessage } from '../services/geminiService';
import { 
  Upload, ChevronRight, Download, Share2, Printer, Loader2, Sparkles, 
  LayoutDashboard, Users, Calendar, Settings, Plus, Search, Trash2, 
  Phone, Clock, FileText, Edit2, X, RotateCcw, CreditCard, LogOut, 
  Bell, HelpCircle, Wallet, MessageCircle, Send, Bot, Stethoscope, ChevronDown, Target, Banknote, ArrowUpRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- PERSISTENCE HELPER ---
const DB_KEY = 'medic_pro_db_v1';

// --- MEDICAL CATEGORIES DATA ---
const MEDICAL_HIERARCHY: Record<string, string[]> = {
  "Médecins généralistes": [
    "Médecine Générale",
    "Médecine de famille",
    "Urgentiste"
  ],
  "Spécialistes - Disciplines Médicales": [
    "Cardiologie",
    "Dermatologie",
    "Pédiatrie",
    "Gériatrie",
    "Psychiatrie",
    "Neurologie",
    "Pneumologie",
    "Gastro-entérologie",
    "Rhumatologie",
    "Endocrinologie",
    "Néphrologie",
    "Oncologie médicale"
  ],
  "Spécialistes - Disciplines Chirurgicales": [
    "Chirurgie Générale",
    "Orthopédie et Traumatologie",
    "Neurochirurgie",
    "Chirurgie Cardiaque",
    "Chirurgie Viscérale",
    "Ophtalmologie",
    "ORL (Oto-rhino-laryngologie)",
    "Urologie",
    "Gynécologie-Obstétrique",
    "Chirurgie Plastique"
  ],
  "Biologie médicale et Imagerie": [
    "Radiologie & Imagerie",
    "Anatomie et Cytologie Pathologiques",
    "Médecine Nucléaire",
    "Biologie Médicale"
  ],
  "Médecine du travail / Santé publique": [
    "Médecine du travail",
    "Santé publique",
    "Épidémiologie"
  ],
  "Dentaire & Soins": [
    "Chirurgien-Dentiste",
    "Orthodontie"
  ]
};

interface DatabaseSchema {
  isSetup: boolean;
  branding: FormData;
  patients: Patient[];
  appointments: Appointment[];
  payments: Payment[]; 
  monthlyGoal: number; 
  dashboardStats: any; 
}

const loadDatabase = (): DatabaseSchema | null => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : null;
};

const saveDatabase = (data: DatabaseSchema) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- COMPONENTS ---

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, color: string }> = ({ icon, label, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 group mb-1 ${
      active 
        ? 'text-white shadow-lg shadow-slate-200' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
    }`}
    style={{ backgroundColor: active ? color : 'transparent' }}
  >
    <div className={`${active ? 'text-white' : 'text-current group-hover:scale-110 transition-transform'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
  </button>
);

const EmptyState: React.FC<{ title: string, description: string, actionLabel?: string, onAction?: () => void, color?: string }> = ({ title, description, actionLabel, onAction, color }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 h-full min-h-[300px]">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
      <Sparkles className="h-6 w-6 text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <button 
        onClick={onAction} 
        className="px-5 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
        style={{ backgroundColor: color || '#0f172a' }}
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// ... (PatientsView and AgendaView reused but styled better) ...

const PatientsView: React.FC<{ 
  patients: Patient[], 
  onAdd: (p: Patient) => void, 
  onUpdate: (p: Patient) => void,
  onDelete: (id: string) => void, 
  color: string 
}> = ({ patients, onAdd, onUpdate, onDelete, color }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Partial<Patient>>({ name: '', age: undefined, phone: '', condition: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (patient: Patient) => {
    setCurrentPatient(patient);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleNewClick = () => {
    setCurrentPatient({ name: '', age: undefined, phone: '', condition: '' });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentPatient.id) {
      onUpdate(currentPatient as Patient);
    } else {
      onAdd({
        id: Date.now().toString(),
        name: currentPatient.name || '',
        age: Number(currentPatient.age) || 0,
        phone: currentPatient.phone || '',
        lastVisit: new Date().toLocaleDateString('fr-FR'),
        condition: currentPatient.condition || ''
      });
    }
    setShowForm(false);
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Patients</h2>
          <p className="text-slate-500 text-sm font-medium">{patients.length} dossiers actifs</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <input 
              type="text" 
              placeholder="Rechercher un patient..." 
              className="pl-11 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-100 w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={handleNewClick}
            className="px-6 py-3 text-white rounded-2xl flex items-center font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: color }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-lg relative animate-fade-in-up">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold mb-8 text-2xl text-slate-900">{isEditing ? 'Modifier le dossier' : 'Nouveau patient'}</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom complet</label>
                <input 
                  placeholder="Ex: Amine Benali" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                  required
                  value={currentPatient.name}
                  onChange={e => setCurrentPatient({...currentPatient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                    value={currentPatient.age || ''}
                    onChange={e => setCurrentPatient({...currentPatient, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Téléphone</label>
                  <input 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                    value={currentPatient.phone}
                    onChange={e => setCurrentPatient({...currentPatient, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condition Médicale</label>
                <input 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                  value={currentPatient.condition}
                  onChange={e => setCurrentPatient({...currentPatient, condition: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-10">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors">Annuler</button>
              <button 
                type="submit" 
                className="px-8 py-3 text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: color }}
              >
                {isEditing ? 'Mettre à jour' : 'Créer le dossier'}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredPatients.length === 0 ? (
        <EmptyState 
          title="Aucun patient" 
          description="Commencez par ajouter votre premier dossier patient pour peupler cette liste."
          actionLabel="Ajouter un patient"
          onAction={handleNewClick}
          color={color}
        />
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm shadow-slate-200/50 overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Visite</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">État</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900">{patient.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: #{patient.id.slice(-4)}</div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{patient.age} ans</td>
                  <td className="px-6 py-5 text-slate-600">
                     <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-slate-100 rounded-lg"><Phone className="h-3 w-3 text-slate-500" /></div>
                       <span className="text-sm font-medium">{patient.phone}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 text-sm font-medium">{patient.lastVisit}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      {patient.condition}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button onClick={() => handleEditClick(patient)} className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => onDelete(patient.id)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AgendaView: React.FC<{ 
  appointments: Appointment[], 
  onAdd: (a: Appointment) => void, 
  onUpdate: (a: Appointment) => void,
  onDelete: (id: string) => void,
  color: string 
}> = ({ appointments, onAdd, onUpdate, onDelete, color }) => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAppt, setCurrentAppt] = useState<Partial<Appointment>>({ status: 'En attente', date: new Date().toISOString().split('T')[0] });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const apptData = {
            id: currentAppt.id || Date.now().toString(),
            patientName: currentAppt.patientName || 'Inconnu',
            date: currentAppt.date!,
            time: currentAppt.time || '09:00',
            type: currentAppt.type || 'Consultation',
            status: currentAppt.status as any
        };
        if (isEditing) onUpdate(apptData);
        else onAdd(apptData);
        setShowForm(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-slate-900">Agenda</h2>
                <button 
                  onClick={() => { setIsEditing(false); setCurrentAppt({}); setShowForm(true); }} 
                  className="px-6 py-3 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center"
                  style={{ backgroundColor: color }}
                >
                    <Plus className="h-4 w-4 mr-2" /> Nouveau RDV
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-fade-in-up">
                         <h3 className="font-bold text-2xl mb-8 text-slate-900">{isEditing ? 'Modifier' : 'Nouveau'} Rendez-vous</h3>
                         <div className="space-y-4">
                             <input className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Nom du patient" value={currentAppt.patientName || ''} onChange={e => setCurrentAppt({...currentAppt, patientName: e.target.value})} required />
                             <div className="flex gap-4">
                                 <input type="date" className="flex-1 p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600" value={currentAppt.date || ''} onChange={e => setCurrentAppt({...currentAppt, date: e.target.value})} required />
                                 <input type="time" className="flex-1 p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600" value={currentAppt.time || ''} onChange={e => setCurrentAppt({...currentAppt, time: e.target.value})} required />
                             </div>
                             <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600" value={currentAppt.status} onChange={e => setCurrentAppt({...currentAppt, status: e.target.value as any})}>
                                 <option value="En attente">En attente</option>
                                 <option value="Confirmé">Confirmé</option>
                                 <option value="Annulé">Annulé</option>
                             </select>
                         </div>
                         <div className="mt-8 flex justify-end gap-3">
                             <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Annuler</button>
                             <button type="submit" className="px-8 py-3 text-white rounded-xl font-bold shadow-lg shadow-slate-200" style={{ backgroundColor: color }}>Sauvegarder</button>
                         </div>
                    </form>
                </div>
            )}

            {appointments.length === 0 ? (
                <EmptyState 
                  title="Agenda vide" 
                  description="Aucun rendez-vous planifié. Ajoutez votre premier rendez-vous."
                  actionLabel="Planifier un RDV"
                  onAction={() => { setIsEditing(false); setCurrentAppt({}); setShowForm(true); }}
                  color={color}
                />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments.map(apt => (
                      <div key={apt.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-200/80 transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                           <div className="relative z-10">
                             <div className="flex justify-between items-start mb-6">
                                 <div className="flex flex-col">
                                     <span className="font-extrabold text-slate-900 text-2xl">{apt.time}</span>
                                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{apt.type}</span>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === 'Confirmé' ? 'bg-green-50 text-green-600' : apt.status === 'En attente' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                     {apt.status}
                                 </span>
                             </div>
                             <h4 className="font-bold text-slate-800 text-lg mb-4">{apt.patientName}</h4>
                             <div className="flex items-center text-xs font-bold text-slate-400 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                                 <Calendar className="h-3.5 w-3.5 mr-2" /> {apt.date}
                             </div>
                             <div className="flex gap-2">
                                 <button onClick={() => { setIsEditing(true); setCurrentAppt(apt); setShowForm(true); }} className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Modifier</button>
                                 <button onClick={() => onDelete(apt.id)} className="px-4 py-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                             </div>
                           </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
    )
}

const FinanceView: React.FC<{ 
  db: DatabaseSchema, 
  color: string,
  secondaryColor: string,
  onAddPayment: (p: Payment) => void,
  onUpdateGoal: (goal: number) => void,
  onDeletePayment: (id: string) => void
}> = ({ db, color, secondaryColor, onAddPayment, onUpdateGoal, onDeletePayment }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({ method: 'Espèces', date: new Date().toISOString().split('T')[0] });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(db.monthlyGoal);

  // Calculate totals
  const totalRevenue = db.payments.reduce((acc, curr) => acc + curr.amount, 0);
  const progress = db.monthlyGoal > 0 ? (totalRevenue / db.monthlyGoal) * 100 : 0;
  
  // Recent transactions sorted by date
  const sortedPayments = [...db.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.amount || !newPayment.patientName) return;

    const payment: Payment = {
      id: Date.now().toString(),
      amount: Number(newPayment.amount),
      date: newPayment.date || new Date().toISOString().split('T')[0],
      patientName: newPayment.patientName,
      method: newPayment.method as any,
      note: newPayment.note
    };
    onAddPayment(payment);
    setShowPaymentForm(false);
    setNewPayment({ method: 'Espèces', date: new Date().toISOString().split('T')[0], amount: undefined, patientName: '' });
  };

  const handleGoalSubmit = () => {
    onUpdateGoal(Number(tempGoal));
    setIsEditingGoal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Finance & Objectifs</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Suivez vos encaissements et votre performance.</p>
         </div>
         <button 
           onClick={() => setShowPaymentForm(true)}
           className="px-6 py-3 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center"
           style={{ backgroundColor: color }}
         >
           <Plus className="h-4 w-4 mr-2" />
           Encaisser
         </button>
       </div>

       {showPaymentForm && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <form onSubmit={handlePaymentSubmit} className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative animate-fade-in-up">
               <button type="button" onClick={() => setShowPaymentForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full">
                  <X className="h-5 w-5" />
               </button>
               <h3 className="font-bold text-2xl mb-8 text-slate-900">Nouveau Paiement</h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Montant (DA)</label>
                    <input type="number" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-xl text-slate-900" placeholder="0" value={newPayment.amount || ''} onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})} required autoFocus />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient</label>
                    <input className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium" placeholder="Nom du patient" value={newPayment.patientName || ''} onChange={e => setNewPayment({...newPayment, patientName: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                       <input type="date" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} required />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Méthode</label>
                       <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-medium text-slate-600" value={newPayment.method} onChange={e => setNewPayment({...newPayment, method: e.target.value as any})}>
                          <option value="Espèces">Espèces</option>
                          <option value="Carte">Carte CIB</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Virement">Virement</option>
                       </select>
                     </div>
                  </div>
               </div>
               <div className="mt-8">
                  <button type="submit" className="w-full py-4 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all">
                     Valider l'encaissement
                  </button>
               </div>
            </form>
         </div>
       )}

       <div className="grid md:grid-cols-3 gap-8">
          {/* Revenue Card */}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-slate-300/50 relative overflow-hidden group" style={{ backgroundColor: color }}>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Revenu Total</p>
                 <ArrowUpRight className="h-4 w-4 text-green-400" />
               </div>
               <h3 className="text-5xl font-extrabold mb-6 tracking-tight">{totalRevenue.toLocaleString('fr-DZ')} <span className="text-xl text-white/50 font-medium">DA</span></h3>
               <div className="flex items-center gap-3 text-sm text-white/60 bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Banknote className="h-4 w-4" />
                  <span>{db.payments.length} transactions</span>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          </div>
          
          {/* Goal Card */}
          <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Target className="h-32 w-32" />
             </div>
             <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                   <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Objectif Mensuel</p>
                      {isEditingGoal ? (
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             className="text-3xl font-bold text-slate-900 bg-slate-50 rounded-lg px-2 py-1 w-48 outline-none focus:ring-2 focus:ring-blue-500"
                             value={tempGoal}
                             onChange={e => setTempGoal(Number(e.target.value))}
                             autoFocus
                             onBlur={handleGoalSubmit}
                             onKeyDown={e => e.key === 'Enter' && handleGoalSubmit()}
                           />
                           <span className="text-sm font-bold text-slate-400">DA</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditingGoal(true)}>
                           <h3 className="text-3xl font-bold text-slate-900">{db.monthlyGoal.toLocaleString('fr-DZ')} DA</h3>
                           <Edit2 className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      )}
                   </div>
                   <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: secondaryColor }}>{Math.min(100, Math.round(progress))}%</span>
                   </div>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                     style={{ width: `${Math.min(100, progress)}%`, backgroundColor: secondaryColor }}
                   >
                     <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                   </div>
                </div>
                <p className="text-sm text-slate-500 mt-3 font-medium">
                  {progress >= 100 
                    ? "🎉 Félicitations ! Objectif atteint." 
                    : `Encore ${(db.monthlyGoal - totalRevenue).toLocaleString('fr-DZ')} DA pour atteindre votre objectif.`
                  }
                </p>
             </div>
          </div>
       </div>

       {/* Transactions List */}
       <div className="bg-white rounded-[2.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h3 className="font-bold text-xl text-slate-900">Historique des transactions</h3>
             <button className="text-sm font-bold hover:bg-slate-50 px-4 py-2 rounded-xl transition-colors" style={{ color: secondaryColor }}>Tout exporter</button>
          </div>
          
          {sortedPayments.length === 0 ? (
             <div className="p-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CreditCard className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-slate-500 mb-2">Aucune transaction enregistrée.</p>
                <button onClick={() => setShowPaymentForm(true)} className="font-bold hover:underline" style={{ color: secondaryColor }}>Encaisser mon premier patient</button>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50/50">
                      <tr>
                         <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                         <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                         <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Méthode</th>
                         <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Montant</th>
                         <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {sortedPayments.map((p) => (
                         <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5 text-sm font-bold text-slate-600">{p.date}</td>
                            <td className="px-6 py-5 font-bold text-slate-900">{p.patientName}</td>
                            <td className="px-6 py-5">
                               <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                  p.method === 'Espèces' ? 'bg-green-50 text-green-700 border-green-100' :
                                  p.method === 'Carte' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  'bg-slate-50 text-slate-600 border-slate-100'
                               }`}>
                                  {p.method}
                               </span>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-slate-900">
                               +{p.amount.toLocaleString('fr-DZ')} DA
                            </td>
                            <td className="px-6 py-5 text-right">
                               <button 
                                 onClick={() => onDeletePayment(p.id)}
                                 className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
       </div>
    </div>
  );
}

// --- MAIN GENERATOR / DASHBOARD LOGIC ---

const Generator: React.FC = () => {
  const navigate = useNavigate();
  // State for the "Setup" phase vs "Dashboard" phase
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup Form State
  const [setupData, setSetupData] = useState<Partial<FormData>>({ clinicName: '', category: '', specialty: '', primaryColor: '#0f172a', secondaryColor: '#3b82f6' }); 
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'agenda' | 'finance' | 'settings'>('dashboard');

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Je suis votre assistant médical IA. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check Auth
    const isAuth = localStorage.getItem('medic_pro_auth');
    if (!isAuth) {
      navigate('/login');
      return;
    }

    // Load DB
    const loadedDb = loadDatabase();
    if (loadedDb) {
      setDb(loadedDb);
    } 
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalSpecialty = setupData.specialty || setupData.category || "Généraliste";

    try {
      const aiData = await generateDashboardData(setupData.clinicName || 'Cabinet', finalSpecialty);
      
      const newDb: DatabaseSchema = {
        isSetup: true,
        branding: {
          clinicName: setupData.clinicName || '',
          category: setupData.category || 'Médecins généralistes',
          specialty: finalSpecialty,
          primaryColor: setupData.primaryColor || '#0f172a',
          secondaryColor: setupData.secondaryColor || '#3b82f6',
          logo: logoPreview
        },
        patients: aiData.recentPatients,
        appointments: aiData.upcomingAppointments,
        payments: [], // Initialize empty payments
        monthlyGoal: 0, // Default goal 0 DA (Fresh start)
        dashboardStats: { kpis: aiData.kpis, monthly: aiData.monthlyPatients, distribution: aiData.revenueDistribution, recommendations: aiData.recommendations }
      };

      saveDatabase(newDb);
      setDb(newDb);
      
      setChatMessages([
        { role: 'model', text: `Bonjour Dr. Je suis votre assistant spécialisé en ${finalSpecialty}. Posez-moi une question sur un patient, un médicament ou une procédure.` }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDb = (newData: Partial<DatabaseSchema>) => {
     if (!db) return;
     const updated = { ...db, ...newData };
     setDb(updated);
     saveDatabase(updated);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !db) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const response = await chatWithSpecialist(userMsg.text, chatMessages, db.branding.specialty);
        const aiMsg: ChatMessage = { role: 'model', text: response };
        setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
    } finally {
        setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
           <Loader2 className="h-12 w-12 text-slate-900 animate-spin mx-auto mb-6" />
           <p className="text-slate-500 font-medium">Initialisation de votre espace sécurisé...</p>
        </div>
      </div>
    );
  }

  // --- SETUP WIZARD VIEW ---
  if (!db) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-12 md:p-16 animate-fade-in border border-slate-100">
           <div className="text-center mb-12">
              <div className="inline-block p-4 bg-slate-900 rounded-2xl mb-6 shadow-lg shadow-slate-200">
                 <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Bienvenue Dr.</h1>
              <p className="text-slate-500 text-lg">Configurons votre espace de travail.</p>
           </div>

           <form onSubmit={handleSetupSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nom du cabinet</label>
                <input 
                  required
                  className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-slate-900 transition-all outline-none text-lg font-medium placeholder:text-slate-300"
                  placeholder="Ex: Cabinet Médical Espoir"
                  value={setupData.clinicName}
                  onChange={e => setSetupData({...setupData, clinicName: e.target.value})}
                />
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Catégorie</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-slate-900 outline-none appearance-none font-medium text-slate-700"
                        value={setupData.category}
                        onChange={e => {
                          const cat = e.target.value;
                          setSetupData({
                             ...setupData, 
                             category: cat, 
                             specialty: MEDICAL_HIERARCHY[cat]?.[0] || '' 
                          });
                        }}
                      >
                         <option value="">Sélectionner une catégorie...</option>
                         {Object.keys(MEDICAL_HIERARCHY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90" />
                    </div>
                 </div>

                 {setupData.category && (
                   <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Discipline / Spécialité</label>
                      <div className="relative">
                        <select 
                          required
                          className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-slate-900 outline-none appearance-none font-medium text-slate-700"
                          value={setupData.specialty}
                          onChange={e => setSetupData({...setupData, specialty: e.target.value})}
                        >
                           {MEDICAL_HIERARCHY[setupData.category]?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Stethoscope className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      </div>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Couleur Primaire</label>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                       <input 
                         type="color" 
                         className="h-10 w-full rounded-xl cursor-pointer border-none bg-transparent"
                         value={setupData.primaryColor}
                         onChange={e => setSetupData({...setupData, primaryColor: e.target.value})}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Couleur Secondaire</label>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                       <input 
                         type="color" 
                         className="h-10 w-full rounded-xl cursor-pointer border-none bg-transparent"
                         value={setupData.secondaryColor}
                         onChange={e => setSetupData({...setupData, secondaryColor: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={!setupData.category || !setupData.clinicName}
                className="w-full py-5 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all hover:-translate-y-1 shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ backgroundColor: setupData.primaryColor }}
              >
                Initialiser le Dashboard
              </button>
           </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (Grace Dental Style) ---
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white m-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex flex-col hidden md:flex sticky top-6 h-[calc(100vh-3rem)] overflow-hidden border border-slate-50">
        <div className="p-8">
           <div className="flex items-center gap-4 mb-12">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-slate-200" style={{backgroundColor: db.branding.primaryColor}}>
                   {db.branding.clinicName.charAt(0)}
              </div>
              <div>
                 <h1 className="font-bold text-base leading-tight text-slate-900 truncate w-32">{db.branding.clinicName}</h1>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 truncate w-32">
                    {db.branding.specialty.split(' ')[0]}
                 </p>
              </div>
           </div>

           <nav className="space-y-2">
              <SidebarItem icon={<LayoutDashboard className="h-5 w-5"/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} color={db.branding.primaryColor} />
              <SidebarItem icon={<Users className="h-5 w-5"/>} label="Patients" active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} color={db.branding.primaryColor} />
              <SidebarItem icon={<Calendar className="h-5 w-5"/>} label="Agenda" active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} color={db.branding.primaryColor} />
              <SidebarItem icon={<CreditCard className="h-5 w-5"/>} label="Finance" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} color={db.branding.primaryColor} />
              <div className="pt-6 pb-2">
                <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Système</p>
                <SidebarItem icon={<Settings className="h-5 w-5"/>} label="Paramètres" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} color={db.branding.primaryColor} />
              </div>
           </nav>
        </div>

        <div className="mt-auto p-6">
           <div className="bg-slate-50 p-5 rounded-[1.5rem] relative overflow-hidden group hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                 <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                 <div>
                    <span className="text-xs font-bold text-slate-900 block">Système actif</span>
                    <span className="text-[10px] text-slate-400">v2.4.0 • Sauvegarde auto</span>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen scrollbar-hide relative">
         {/* HEADER */}
         <header className="flex justify-between items-center mb-10">
            <div className="md:hidden font-bold text-lg">{db.branding.clinicName}</div>
            <div className="hidden md:block">
               <h2 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">{activeTab}</h2>
               <p className="text-sm text-slate-500 mt-1 font-medium">Bon retour, Dr. {localStorage.getItem('medic_pro_user_email')?.split('@')[0]}</p>
            </div>
            <div className="flex items-center gap-5">
               <button className="p-3 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm hover:shadow-md transition-all relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <div className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: db.branding.primaryColor }}>
                     Dr
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
               </div>
            </div>
         </header>

         {/* CONTENT VIEWS */}
         <div className="max-w-[1600px] mx-auto pb-24">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                 {/* KPI Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {db.dashboardStats.kpis.map((kpi: any, i: number) => (
                       <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-slate-200/80 transition-all group">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{kpi.label}</p>
                          <div className="flex items-end justify-between">
                             <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</span>
                             {kpi.value !== "0" && kpi.value !== "0%" && kpi.value !== "0 DA" && (
                               <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${kpi.trendDirection === 'up' ? 'bg-green-50 text-green-600' : kpi.trendDirection === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                                  {kpi.trend}
                               </span>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Charts Section - Handle Empty State */}
                 <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm shadow-slate-200/50 border border-slate-50">
                       <div className="flex justify-between items-center mb-8">
                          <h3 className="font-bold text-xl text-slate-900">Activité Patients</h3>
                          <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                             <option>6 derniers mois</option>
                             <option>Année</option>
                          </select>
                       </div>
                       <div className="h-72 w-full">
                         {(db.dashboardStats.monthly.length === 0 || db.dashboardStats.monthly.every((d: any) => d.value === 0)) ? (
                            <EmptyState title="Pas de données" description="Les graphiques apparaîtront ici une fois que vous aurez commencé votre activité." />
                         ) : (
                           <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={db.dashboardStats.monthly}>
                                <defs>
                                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={db.branding.primaryColor} stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor={db.branding.primaryColor} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                                <RechartsTooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)'}} />
                                <Area type="monotone" dataKey="value" stroke={db.branding.primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                              </AreaChart>
                           </ResponsiveContainer>
                         )}
                       </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm shadow-slate-200/50 border border-slate-50 flex flex-col">
                       <h3 className="font-bold text-xl text-slate-900 mb-8">Répartition</h3>
                       <div className="flex-1 min-h-[250px] relative">
                          {(db.dashboardStats.distribution.length === 0 || db.dashboardStats.distribution.every((d: any) => d.value === 0)) ? (
                             <div className="absolute inset-0 flex items-center justify-center text-center">
                                <p className="text-slate-400 text-sm">Aucune donnée disponible</p>
                             </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={db.dashboardStats.distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" cornerRadius={6}>
                                  {db.dashboardStats.distribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={[db.branding.primaryColor, db.branding.secondaryColor, '#94a3b8'][index % 3]} strokeWidth={0} />
                                  ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                       </div>
                       <div className="space-y-4 mt-6">
                          {db.dashboardStats.distribution.map((d: any, i: number) => (
                             <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium flex items-center">
                                   <div className="w-2.5 h-2.5 rounded-full mr-3" style={{backgroundColor: [db.branding.primaryColor, db.branding.secondaryColor, '#94a3b8'][i % 3]}}></div>
                                   {d.name}
                                </span>
                                <span className="font-bold text-slate-900">{d.value}%</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 {/* Recommendations Section */}
                 <div className="text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-slate-900/10" style={{ backgroundColor: db.branding.primaryColor }}>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="relative z-10">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                             <Sparkles className="h-6 w-6 text-yellow-300" />
                          </div>
                          <h3 className="font-bold text-xl">Recommandations IA</h3>
                       </div>
                       <div className="grid md:grid-cols-3 gap-6">
                          {db.dashboardStats.recommendations.map((rec: string, i: number) => (
                             <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                                <p className="text-sm text-slate-200 leading-relaxed font-medium opacity-90">{rec}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <PatientsView 
                patients={db.patients} 
                onAdd={p => updateDb({ patients: [p, ...db.patients] })} 
                onUpdate={p => updateDb({ patients: db.patients.map(pat => pat.id === p.id ? p : pat) })}
                onDelete={id => updateDb({ patients: db.patients.filter(p => p.id !== id) })} 
                color={db.branding.primaryColor} 
              />
            )}

            {activeTab === 'agenda' && (
               <AgendaView 
                 appointments={db.appointments}
                 onAdd={a => updateDb({ appointments: [a, ...db.appointments] })}
                 onUpdate={a => updateDb({ appointments: db.appointments.map(apt => apt.id === a.id ? a : apt) })}
                 onDelete={id => updateDb({ appointments: db.appointments.filter(a => a.id !== id) })}
                 color={db.branding.primaryColor}
               />
            )}

            {activeTab === 'finance' && (
               <FinanceView 
                  db={db} 
                  color={db.branding.primaryColor} 
                  secondaryColor={db.branding.secondaryColor}
                  onAddPayment={p => updateDb({ payments: [p, ...db.payments] })}
                  onUpdateGoal={g => updateDb({ monthlyGoal: g })}
                  onDeletePayment={id => updateDb({ payments: db.payments.filter(p => p.id !== id) })}
               />
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
                 <div className="bg-white p-10 rounded-[2.5rem] shadow-sm shadow-slate-200/50 border border-slate-100">
                    <h3 className="font-bold text-2xl text-slate-900 mb-8">Personnalisation</h3>
                    <div className="space-y-8">
                       <div>
                          <label className="block text-sm font-bold text-slate-900 mb-4">Nom du cabinet</label>
                          <input 
                            className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-slate-900 transition-all" 
                            value={db.branding.clinicName}
                            onChange={(e) => updateDb({ branding: { ...db.branding, clinicName: e.target.value } })}
                          />
                       </div>
                       
                       <div>
                          <label className="block text-sm font-bold text-slate-900 mb-4">Couleurs de l'interface</label>
                          <div className="flex gap-8">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Primaire</label>
                                <div className="flex items-center gap-3">
                                   <input 
                                     type="color" 
                                     value={db.branding.primaryColor}
                                     onChange={(e) => updateDb({ branding: { ...db.branding, primaryColor: e.target.value } })}
                                     className="h-10 w-20 rounded cursor-pointer border-none bg-transparent"
                                   />
                                   <span className="text-xs font-mono bg-slate-50 px-2 py-1 rounded">{db.branding.primaryColor}</span>
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Secondaire</label>
                                <div className="flex items-center gap-3">
                                   <input 
                                     type="color" 
                                     value={db.branding.secondaryColor}
                                     onChange={(e) => updateDb({ branding: { ...db.branding, secondaryColor: e.target.value } })}
                                     className="h-10 w-20 rounded cursor-pointer border-none bg-transparent"
                                   />
                                   <span className="text-xs font-mono bg-slate-50 px-2 py-1 rounded">{db.branding.secondaryColor}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-10 rounded-[2.5rem] shadow-sm shadow-slate-200/50 border border-slate-100">
                    <h3 className="font-bold text-2xl text-red-600 mb-4">Zone de danger</h3>
                    <p className="text-slate-500 mb-8 text-sm leading-relaxed">Attention, la réinitialisation effacera toutes vos données locales. Cette action est irréversible.</p>
                    <button 
                      onClick={() => { if(confirm('Tout effacer ?')) { localStorage.removeItem(DB_KEY); window.location.reload(); } }}
                      className="w-full py-4 border border-red-100 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center shadow-sm"
                    >
                       <RotateCcw className="h-4 w-4 mr-2" />
                       Réinitialiser toutes les données
                    </button>
                 </div>
              </div>
            )}
         </div>

         {/* --- AI CHATBOT INTERFACE --- */}
         <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
            {isChatOpen && (
               <div className="mb-4 w-80 md:w-96 h-[550px] bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 pointer-events-auto flex flex-col animate-fade-in-up overflow-hidden">
                  <div className="p-5 text-white flex justify-between items-center" style={{ backgroundColor: db.branding.primaryColor }}>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                           <Bot className="h-5 w-5" />
                        </div>
                        <div>
                           <h3 className="font-bold text-sm">Assistant {db.branding.specialty.split(' ')[0]}</h3>
                           <div className="flex items-center gap-1.5 mt-0.5">
                             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                             <span className="text-[10px] text-slate-300 font-medium">En ligne</span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10">
                        <X className="h-4 w-4" />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
                     {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                              msg.role === 'user' 
                                 ? 'text-white rounded-br-none' 
                                 : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                           }`}
                           style={msg.role === 'user' ? { backgroundColor: db.branding.primaryColor } : {}}
                           >
                              {msg.text}
                           </div>
                        </div>
                     ))}
                     {isChatLoading && (
                        <div className="flex justify-start">
                           <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                              <div className="flex gap-1.5">
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                           </div>
                        </div>
                     )}
                     <div ref={chatEndRef}></div>
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-50 flex gap-3">
                     <input 
                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                        placeholder="Posez une question..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                     />
                     <button 
                        type="submit" 
                        disabled={!chatInput.trim() || isChatLoading}
                        className="p-3 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg shadow-slate-200"
                        style={{ backgroundColor: db.branding.primaryColor }}
                     >
                        <Send className="h-4 w-4" />
                     </button>
                  </form>
               </div>
            )}
            
            <button 
               onClick={() => setIsChatOpen(!isChatOpen)}
               className="pointer-events-auto p-4 text-white rounded-full shadow-2xl shadow-slate-900/30 hover:scale-110 transition-all duration-300"
               style={{ backgroundColor: db.branding.primaryColor }}
            >
               {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
         </div>

      </main>
    </div>
  );
};

export default Generator;