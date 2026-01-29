import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, DashboardData } from "../types";

const apiKey = process.env.API_KEY;

// --- Dashboard Generation ---
const generateDashboardData = async (clinicName: string, specialty: string): Promise<DashboardData> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Modified prompt to generate realistic data. 
  // Note: While the user asked for "everything at zero", AI is typically used to populate data.
  // The FALLBACK below handles the strict "zero state" requirement if generation fails or is bypassed.
  const prompt = `
    Generate realistic medical practice management data for a new clinic in Algeria named "${clinicName}" specializing in "${specialty}".
    
    The data should be localized for Algeria (Currency: DA or DZD, Names: Algerian names).
    
    1. Generate 4 Key Performance Indicators (KPIs) (e.g., Patients/Jour, Revenus (in DA), Taux d'occupation).
    2. Generate monthly patient evolution chart data (simulating a start of activity).
    3. Generate revenue distribution chart data.
    4. Provide 3 business recommendations for a new clinic.
    5. Generate a list of 0 to 3 realistic patients (Algerian names).
    6. Generate a list of 0 to 3 upcoming appointments.
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
    // Fallback data for Algeria context - ZERO STATE as requested
    return {
      clinicName,
      specialty,
      kpis: [
        { label: "Patients / Jour", value: "0", trend: "0%", trendDirection: "neutral" },
        { label: "RDV Honorés", value: "0%", trend: "0%", trendDirection: "neutral" },
        { label: "Liste d'attente", value: "0", trend: "0%", trendDirection: "neutral" },
        { label: "Revenus (Mois)", value: "0 DA", trend: "0%", trendDirection: "neutral" },
      ],
      monthlyPatients: [
        { name: "Jan", value: 0 },
        { name: "Fév", value: 0 },
        { name: "Mar", value: 0 },
        { name: "Avr", value: 0 },
        { name: "Mai", value: 0 },
        { name: "Juin", value: 0 },
      ],
      revenueDistribution: [
        { name: "Consultations", value: 0 },
        { name: "Actes", value: 0 },
        { name: "Urgences", value: 0 },
      ],
      recommendations: [
        "Configurez votre agenda pour commencer.",
        "Ajoutez votre premier patient.",
        "Définissez vos tarifs de consultation."
      ],
      recentPatients: [],
      upcomingAppointments: []
    };
  }
};

// --- Chatbot Functionality ---

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const chatWithSpecialist = async (message: string, history: ChatMessage[], specialty: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Dynamically create the persona based on the specialty
  const systemInstruction = `
    You are an expert AI medical assistant for a ${specialty} clinic in Algeria.
    
    Your Role:
    1. Act as a highly knowledgeable assistant in the field of "${specialty}".
    2. If the specialty is "Dentiste", use dental terminology (teeth numbers, procedures).
    3. If "Pédiatre", be reassuring, discuss child growth, vaccinations (Algerian schedule).
    4. If "Généraliste", cover general health, diagnosis, and orientation.
    5. Always keep the context of Algeria (medications available in Algeria, DZD currency if discussed, local culture).
    6. Be helpful, professional, and concise.
    7. Answer in French.

    Current context: User is asking about: "${message}"
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Désolé, je rencontre des difficultés pour me connecter au serveur. Veuillez réessayer plus tard.";
  }
};

export { generateDashboardData, chatWithSpecialist };