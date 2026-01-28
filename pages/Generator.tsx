import React, { useState, useRef, useEffect } from 'react';
import { Specialty, FormData, DashboardData, Patient, Appointment } from '../types';
import { generateDashboardData } from '../services/geminiService';
import { Upload, ChevronRight, Download, Share2, Printer, Loader2, Sparkles, LayoutDashboard, Users, Calendar, Settings, Plus, Search, Trash2, Phone, Clock, FileText, Edit2, X, RotateCcw } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- COMPONENTS FOR THE FUNCTIONAL DASHBOARD ---

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, color: string }> = ({ icon, label, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white shadow-md font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
    style={{ color: active ? color : undefined }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Patients</h2>
        <button 
          onClick={handleNewClick}
          className="px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: color }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter Patient
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
          <h3 className="font-bold mb-4 text-lg">{isEditing ? 'Modifier le dossier patient' : 'Nouveau dossier patient'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <input 
                placeholder="Ex: Amine Benali" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required
                value={currentPatient.name}
                onChange={e => setCurrentPatient({...currentPatient, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                placeholder="Age" 
                type="number" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentPatient.age || ''}
                onChange={e => setCurrentPatient({...currentPatient, age: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <input 
                placeholder="05..." 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentPatient.phone}
                onChange={e => setCurrentPatient({...currentPatient, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Motif / Condition</label>
              <input 
                placeholder="Ex: Hypertension" 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentPatient.condition}
                onChange={e => setCurrentPatient({...currentPatient, condition: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
             <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Annuler</button>
             <button type="submit" className="px-6 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: color }}>
               {isEditing ? 'Mettre à jour' : 'Enregistrer'}
             </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Nom</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Age</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Téléphone</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Dernière visite</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Motif</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                <td className="px-6 py-4 text-slate-600">{patient.age} ans</td>
                <td className="px-6 py-4 text-slate-600 flex items-center">
                   <Phone className="h-3 w-3 mr-2 opacity-50" />
                   {patient.phone}
                </td>
                <td className="px-6 py-4 text-slate-600">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {patient.condition}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(patient)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Modifier">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(patient.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p>Aucun patient dans la base.</p>
            <button onClick={handleNewClick} className="mt-2 text-blue-600 font-medium hover:underline">Ajouter votre premier patient</button>
          </div>
        )}
      </div>
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
   const [currentAppt, setCurrentAppt] = useState<Partial<Appointment>>({ 
     patientName: '', date: '', time: '', type: '', status: 'En attente' 
   });

   const handleNewClick = () => {
     setCurrentAppt({ 
       patientName: '', 
       date: new Date().toISOString().split('T')[0], // Aujourd'hui par défaut
       time: '09:00', 
       type: 'Consultation', 
       status: 'En attente' 
     });
     setIsEditing(false);
     setShowForm(true);
   };

   const handleEditClick = (appt: Appointment) => {
     // Si la date est "Aujourd'hui" ou "Demain" dans les données générées, on met une vraie date pour l'input
     let formattedDate = appt.date;
     if (appt.date === "Aujourd'hui") formattedDate = new Date().toISOString().split('T')[0];
     else if (appt.date === "Demain") {
       const d = new Date();
       d.setDate(d.getDate() + 1);
       formattedDate = d.toISOString().split('T')[0];
     }

     setCurrentAppt({ ...appt, date: formattedDate });
     setIsEditing(true);
     setShowForm(true);
   };

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentAppt.id) {
      onUpdate(currentAppt as Appointment);
    } else {
      onAdd({
        id: Date.now().toString(),
        patientName: currentAppt.patientName || '',
        date: currentAppt.date || new Date().toISOString().split('T')[0],
        time: currentAppt.time || '09:00',
        type: currentAppt.type || 'Consultation',
        status: (currentAppt.status as any) || 'En attente'
      });
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Agenda & Rendez-vous</h2>
        <button 
          onClick={handleNewClick}
          className="px-4 py-2 text-white rounded-lg flex items-center shadow-md hover:opacity-90 transition-opacity"
          style={{ backgroundColor: color }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau RDV
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in relative z-10">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
          <h3 className="font-bold mb-4 text-lg">{isEditing ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du patient</label>
              <input 
                placeholder="Rechercher ou entrer un nom..." 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required
                value={currentAppt.patientName}
                onChange={e => setCurrentAppt({...currentAppt, patientName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentAppt.date}
                onChange={e => setCurrentAppt({...currentAppt, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Heure</label>
              <input 
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required
                value={currentAppt.time}
                onChange={e => setCurrentAppt({...currentAppt, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentAppt.type}
                onChange={e => setCurrentAppt({...currentAppt, type: e.target.value})}
              >
                <option value="Consultation">Consultation</option>
                <option value="Urgence">Urgence</option>
                <option value="Contrôle">Contrôle</option>
                <option value="Soins">Soins</option>
                <option value="Chirurgie">Chirurgie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                value={currentAppt.status}
                onChange={e => setCurrentAppt({...currentAppt, status: e.target.value as any})}
              >
                <option value="En attente">En attente</option>
                <option value="Confirmé">Confirmé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between">
             {isEditing ? (
               <button 
                type="button" 
                onClick={() => { onDelete(currentAppt.id!); setShowForm(false); }}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center"
               >
                 <Trash2 className="h-4 w-4 mr-2" /> Supprimer le RDV
               </button>
             ) : (
               <div></div>
             )}
             <div className="flex gap-2">
               <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Annuler</button>
               <button type="submit" className="px-6 py-2 text-white rounded-lg font-medium" style={{ backgroundColor: color }}>
                 {isEditing ? 'Mettre à jour' : 'Planifier'}
               </button>
             </div>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
         {appointments
            .sort((a, b) => (a.date > b.date ? 1 : -1))
            .map(apt => (
            <div key={apt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
               <div>
                 <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      apt.status === 'Confirmé' ? 'bg-green-100 text-green-700' :
                      apt.status === 'En attente' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                    <span className="text-sm font-bold text-slate-700">{apt.date === new Date().toISOString().split('T')[0] ? "Aujourd'hui" : apt.date}</span>
                 </div>
                 <h4 className="font-bold text-lg text-slate-900 mb-1">{apt.patientName}</h4>
                 <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {apt.time} • {apt.type}
                 </div>
               </div>
               <div className="flex space-x-2 mt-2 pt-4 border-t border-slate-100">
                  <button onClick={() => handleEditClick(apt)} className="flex-1 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg flex justify-center items-center">
                    <Edit2 className="h-3 w-3 mr-2" /> Modifier
                  </button>
                  <button onClick={() => onDelete(apt.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
         ))}
         {appointments.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
               <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
               <p>Aucun rendez-vous prévu.</p>
               <button onClick={handleNewClick} className="mt-2 text-blue-600 font-medium hover:underline">Planifier un rendez-vous</button>
            </div>
         )}
      </div>
    </div>
  );
};

// --- MAIN GENERATOR LOGIC ---

// Step 1: Input Form
const GeneratorForm: React.FC<{ onSubmit: (data: FormData) => void, isLoading: boolean }> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>(Specialty.GENERALISTE);
  const [color, setColor] = useState('#0A5FFF');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ clinicName: name, specialty, primaryColor: color, logo: logoPreview });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-blue-600" />
          Configuration de votre Cabinet
        </h2>
        <p className="text-slate-500 mt-1">L'IA configurera votre espace de gestion personnalisé (Algérie).</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nom du Cabinet / Médecin</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ex: Cabinet Dr. Amine Benali"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Spécialité</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value as Specialty)}
            >
              {Object.values(Specialty).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Couleur principale</label>
             <div className="flex items-center space-x-3">
               <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-12 w-24 p-1 rounded border border-slate-300 cursor-pointer"
               />
               <span className="text-slate-500 text-sm font-mono">{color}</span>
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Logo du cabinet</label>
          <div 
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-16 object-contain mb-2" />
            ) : (
              <Upload className="h-10 w-10 text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-500">{logoPreview ? 'Cliquer pour changer' : 'Glissez ou cliquez pour ajouter (PNG/SVG)'}</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !name}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Configuration en cours...
            </>
          ) : (
            <>
              Créer mon espace
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Step 3: Functional Dashboard View
const DashboardView: React.FC<{ initialData: DashboardData, branding: FormData }> = ({ initialData, branding }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'agenda' | 'settings'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>(initialData.recentPatients || []);
  const [appointments, setAppointments] = useState<Appointment[]>(initialData.upcomingAppointments || []);
  const COLORS = [branding.primaryColor, '#10b981', '#f59e0b', '#ef4444'];

  const addPatient = (p: Patient) => setPatients([p, ...patients]);
  const updatePatient = (updated: Patient) => setPatients(patients.map(p => p.id === updated.id ? updated : p));
  const deletePatient = (id: string) => setPatients(patients.filter(p => p.id !== id));

  const addAppointment = (a: Appointment) => setAppointments([a, ...appointments]);
  const updateAppointment = (updated: Appointment) => setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
  const deleteAppointment = (id: string) => setAppointments(appointments.filter(a => a.id !== id));

  // Function to reset data to empty
  const resetData = () => {
    if(window.confirm("Voulez-vous vraiment effacer toutes les données de démo ?")) {
      setPatients([]);
      setAppointments([]);
      alert("Données réinitialisées. Vous pouvez commencer à saisir vos vrais patients.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
           <div className="flex items-center space-x-3 mb-8">
             {branding.logo ? (
                <img src={branding.logo} className="h-10 w-10 rounded-lg object-cover" alt="Logo" />
             ) : (
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold" style={{backgroundColor: branding.primaryColor}}>
                   {branding.clinicName.charAt(0)}
                </div>
             )}
             <div>
                <h2 className="font-bold text-slate-900 leading-tight">{branding.clinicName}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Algérie • {branding.specialty}</p>
             </div>
           </div>
           
           <nav className="space-y-2">
              <SidebarItem 
                 icon={<LayoutDashboard className="h-5 w-5" />} 
                 label="Tableau de bord" 
                 active={activeTab === 'dashboard'} 
                 onClick={() => setActiveTab('dashboard')}
                 color={branding.primaryColor}
              />
              <SidebarItem 
                 icon={<Users className="h-5 w-5" />} 
                 label="Patients" 
                 active={activeTab === 'patients'} 
                 onClick={() => setActiveTab('patients')}
                 color={branding.primaryColor}
              />
              <SidebarItem 
                 icon={<Calendar className="h-5 w-5" />} 
                 label="Agenda" 
                 active={activeTab === 'agenda'} 
                 onClick={() => setActiveTab('agenda')}
                 color={branding.primaryColor}
              />
               <SidebarItem 
                 icon={<Settings className="h-5 w-5" />} 
                 label="Paramètres" 
                 active={activeTab === 'settings'} 
                 onClick={() => setActiveTab('settings')}
                 color={branding.primaryColor}
              />
           </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-200">
           <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-800 font-medium mb-1">Support Premium</p>
              <p className="text-xs text-blue-600 mb-3">Besoin d'aide ?</p>
              <button className="w-full py-2 bg-white text-blue-600 text-xs font-bold rounded-lg shadow-sm">Contacter</button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar for Mobile + Common actions */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
           <div className="md:hidden font-bold text-slate-900">{branding.clinicName}</div>
           <div className="hidden md:flex text-slate-400 text-sm items-center">
              <Search className="h-4 w-4 mr-2" />
              Rechercher un dossier ou un rendez-vous...
           </div>
           <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-900">Dr. {branding.clinicName.split('Dr. ')[1] || 'Médecin'}</p>
                 <p className="text-xs text-green-600 flex items-center justify-end"><div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div> En ligne</p>
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           
           {/* DASHBOARD TAB */}
           {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {initialData.kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                      <div className="flex items-end justify-between">
                        <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          kpi.trendDirection === 'up' ? 'bg-green-100 text-green-700' :
                          kpi.trendDirection === 'down' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {kpi.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Activité (6 derniers mois)</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={initialData.monthlyPatients}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                          <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Line type="monotone" dataKey="value" stroke={branding.primaryColor} strokeWidth={4} dot={{fill: 'white', stroke: branding.primaryColor, strokeWidth: 2, r: 6}} activeDot={{r: 8}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Répartition Revenus</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={initialData.revenueDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {initialData.revenueDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                       <div className="mt-4 space-y-2">
                        {initialData.revenueDistribution.map((entry, index) => (
                           <div key={index} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                 <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                 <span className="text-slate-600">{entry.name}</span>
                              </div>
                              <span className="font-bold text-slate-900">{entry.value}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
                </div>

                 <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-white shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur">
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold">Conseils IA pour votre cabinet</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {initialData.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <p className="text-slate-200 leading-relaxed">"{rec}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
           )}

           {/* PATIENTS TAB */}
           {activeTab === 'patients' && (
              <PatientsView 
                patients={patients} 
                onAdd={addPatient} 
                onUpdate={updatePatient}
                onDelete={deletePatient} 
                color={branding.primaryColor} 
              />
           )}

           {/* AGENDA TAB */}
           {activeTab === 'agenda' && (
              <AgendaView 
                appointments={appointments} 
                onAdd={addAppointment} 
                onUpdate={updateAppointment}
                onDelete={deleteAppointment}
                color={branding.primaryColor} 
              />
           )}

           {/* SETTINGS TAB */}
           {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center py-20 animate-fade-in">
                 <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-900">Paramètres du cabinet</h3>
                 <p className="text-slate-500 mb-6">Modifiez vos horaires, tarifs et informations légales.</p>
                 
                 <div className="max-w-md mx-auto space-y-4">
                    <button className="w-full px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 flex items-center justify-center">
                       Modifier mon profil
                    </button>
                    <button onClick={resetData} className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 flex items-center justify-center border border-red-100">
                       <RotateCcw className="h-4 w-4 mr-2" />
                       Réinitialiser toutes les données
                    </button>
                 </div>
              </div>
           )}

        </main>
      </div>
    </div>
  );
};


const Generator: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const handleGenerate = async (data: FormData) => {
    setFormData(data);
    setStep(2);
    
    // Simulate thinking time + API call
    try {
      const result = await generateDashboardData(data.clinicName, data.specialty);
      setDashboardData(result);
      setStep(3);
    } catch (error) {
      console.error("Failed to generate", error);
      // In a real app, handle error state here
      setStep(1); // Go back for now
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* If step 3, we hide the standard layout wrapper in App via CSS or just fullscreen overlay */}
      {step !== 3 && (
        <div className="pt-20 pb-12 bg-blue-600 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Création de votre Espace Pro</h1>
          <p className="text-blue-100">Configurez votre cabinet en quelques secondes (Optimisé pour l'Algérie)</p>
        </div>
      )}

      {step === 1 && (
        <div className="py-12 px-4">
          <GeneratorForm onSubmit={handleGenerate} isLoading={false} />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">L'IA prépare votre cabinet...</h2>
          <p className="text-slate-500 max-w-md text-center">
            Génération des dossiers patients, configuration de l'agenda et analyse des tarifs locaux (DA).
          </p>
        </div>
      )}

      {step === 3 && dashboardData && formData && (
         // Fullscreen wrapper to simulate a real app feel
        <div className="fixed inset-0 z-50 bg-white">
           <DashboardView initialData={dashboardData} branding={formData} />
        </div>
      )}
    </div>
  );
};

export default Generator;
