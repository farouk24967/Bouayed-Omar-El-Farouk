import { GoogleGenAI, Type } from "@google/genai";
import { Specialty, DashboardData } from "../types";

const apiKey = process.env.API_KEY;

// --- Dashboard Generation ---
const generateDashboardData = async (clinicName: string, specialty: string): Promise<DashboardData> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Modified prompt to generate STRUCTURE ONLY with ZERO VALUES.
  const prompt = `
    Generate the data structure for a BRAND NEW medical clinic in Algeria named "${clinicName}" specializing in "${specialty}".
    
    IMPORTANT: This is a fresh account. ALL DATA MUST BE ZERO or EMPTY.
    
    1. Generate 4 Key Performance Indicators (KPIs) labels suitable for this specialty (e.g., Patients/Jour, Revenus), but strictly set values to "0" or "0 DA".
    2. Generate monthly patient evolution chart labels (Jan-Jun) with value 0.
    3. Generate revenue distribution chart categories with value 0.
    4. Provide 3 tips/recommendations for STARTING this specific medical activity.
    5. Return an EMPTY list for patients.
    6. Return an EMPTY list for appointments.
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

    // FORCE ZERO STATE LOGIC
    // We strictly overwrite values to 0/empty to ensure "New Account" feel regardless of AI hallucination
    return {
      clinicName,
      specialty,
      kpis: parsedData.kpis.map((k: any) => ({
        ...k,
        value: k.label.toLowerCase().includes("revenu") ? "0 DA" : "0", 
        trend: "0%",
        trendDirection: "neutral"
      })),
      monthlyPatients: parsedData.monthlyPatients.map((m: any) => ({ ...m, value: 0 })),
      revenueDistribution: parsedData.revenueDistribution.map((d: any) => ({ ...d, value: 0 })),
      recommendations: parsedData.recommendations, // Keep recommendations, they are useful text
      recentPatients: [], // Strictly empty
      upcomingAppointments: [] // Strictly empty
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data - Strictly Zero
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