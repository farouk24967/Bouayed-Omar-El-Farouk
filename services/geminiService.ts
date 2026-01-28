import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, DashboardData } from "../types";

const generateDashboardData = async (clinicName: string, specialty: Specialty): Promise<DashboardData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate realistic medical practice management data for a clinic in Algeria named "${clinicName}" specializing in "${specialty}".
    
    The data should be localized for Algeria (Currency: DA or DZD, Names: Algerian names).
    
    1. Generate 4 Key Performance Indicators (KPIs) (e.g., Patients/Jour, Revenus (in DA), Taux d'occupation).
    2. Generate monthly patient evolution chart data.
    3. Generate revenue distribution chart data.
    4. Provide 3 business recommendations.
    5. Generate a list of 5 realistic patients (Algerian names) with id, name, age, phone, lastVisit, condition.
    6. Generate a list of 5 upcoming appointments with id, patientName, date (recent), time, type, status.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  trend: { type: Type.STRING },
                  trendDirection: { type: Type.STRING, enum: ["up", "down", "neutral"] }
                }
              }
            },
            monthlyPatients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            },
            revenueDistribution: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recentPatients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  age: { type: Type.NUMBER },
                  phone: { type: Type.STRING },
                  lastVisit: { type: Type.STRING },
                  condition: { type: Type.STRING }
                }
              }
            },
            upcomingAppointments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  patientName: { type: Type.STRING },
                  date: { type: Type.STRING },
                  time: { type: Type.STRING },
                  type: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["Confirmé", "En attente", "Annulé"] }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsedData = JSON.parse(jsonText);

    return {
      clinicName,
      specialty,
      kpis: parsedData.kpis,
      monthlyPatients: parsedData.monthlyPatients,
      revenueDistribution: parsedData.revenueDistribution,
      recommendations: parsedData.recommendations,
      recentPatients: parsedData.recentPatients,
      upcomingAppointments: parsedData.upcomingAppointments
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data for Algeria context
    return {
      clinicName,
      specialty,
      kpis: [
        { label: "Patients / Jour", value: "28", trend: "+5%", trendDirection: "up" },
        { label: "RDV Honorés", value: "92%", trend: "+2%", trendDirection: "up" },
        { label: "Liste d'attente", value: "12", trend: "-1%", trendDirection: "down" },
        { label: "Revenus (Mois)", value: "450 000 DA", trend: "+8%", trendDirection: "up" },
      ],
      monthlyPatients: [
        { name: "Jan", value: 350 },
        { name: "Fév", value: 300 },
        { name: "Mar", value: 450 },
        { name: "Avr", value: 400 },
        { name: "Mai", value: 550 },
        { name: "Juin", value: 600 },
      ],
      revenueDistribution: [
        { name: "Consultations", value: 65 },
        { name: "Actes", value: 25 },
        { name: "Urgences", value: 10 },
      ],
      recommendations: [
        "Réduisez les non-présentations avec des SMS de rappel.",
        "Optimisez votre planning du matin.",
        "Augmentez le tarif des consultations urgentes."
      ],
      recentPatients: [
        { id: "1", name: "Amine Benali", age: 34, phone: "0550 12 34 56", lastVisit: "12/10/2023", condition: "Contrôle routine" },
        { id: "2", name: "Yasmina Saidi", age: 28, phone: "0661 98 76 54", lastVisit: "10/10/2023", condition: "Douleur dentaire" },
        { id: "3", name: "Mohamed Khelif", age: 55, phone: "0770 11 22 33", lastVisit: "08/10/2023", condition: "Hypertension" },
        { id: "4", name: "Sofiane Mansouri", age: 42, phone: "0540 55 66 77", lastVisit: "05/10/2023", condition: "Grippe" },
        { id: "5", name: "Meriem Bouzid", age: 30, phone: "0662 33 44 55", lastVisit: "01/10/2023", condition: "Consultation" }
      ],
      upcomingAppointments: [
        { id: "1", patientName: "Karim Ziani", date: "Aujourd'hui", time: "09:00", type: "Consultation", status: "Confirmé" },
        { id: "2", patientName: "Leila Haddad", date: "Aujourd'hui", time: "10:30", type: "Urgence", status: "En attente" },
        { id: "3", patientName: "Omar Belkacem", date: "Demain", time: "14:00", type: "Contrôle", status: "Confirmé" },
        { id: "4", patientName: "Nadia Fekir", date: "Demain", time: "15:30", type: "Soins", status: "Annulé" },
        { id: "5", patientName: "Riad Mahrez", date: "25 Oct", time: "11:00", type: "Consultation", status: "Confirmé" }
      ]
    };
  }
};

export { generateDashboardData };
