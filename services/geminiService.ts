
import { GoogleGenAI, Type } from "@google/genai";
import { Client, RiskScore, Loan, DefaultPrediction } from '../types';
import { getCache, setCache } from '../utils/cache';

type ClientInfoForRisk = Omit<Client, 'id' | 'riskScore' | 'joinDate' | 'documents'>;

export const getRiskScore = async (clientInfo: ClientInfoForRisk): Promise<RiskScore> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const prompt = `
      Analyze the risk profile for a new microfinance client in Pakistan based on the following information.
      - Name: ${clientInfo.name}
      - CNIC: ${clientInfo.cnic}
      - Phone: ${clientInfo.phone}
      - Address: ${clientInfo.address}
      - Monthly Income (PKR): ${clientInfo.income || 'Not Provided'}
      - Occupation: ${clientInfo.occupation || 'Not Provided'}
      - Household Size: ${clientInfo.householdSize || 'Not Provided'}
      
      Based on this information, provide a risk score. Higher income, stable occupations (e.g., Shop Owner vs. Laborer), and smaller household sizes generally indicate lower risk.
      The output must be a JSON object with a single key "riskScore" and one of three string values: "Low", "Medium", or "High".
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                riskScore: {
                    type: Type.STRING,
                    enum: ['Low', 'Medium', 'High']
                }
            }
        }
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result.riskScore && ['Low', 'Medium', 'High'].includes(result.riskScore)) {
        return result.riskScore as RiskScore;
    }

    console.error("Invalid risk score from API:", result.riskScore);
    return 'Medium'; // Default fallback
  } catch (error) {
    console.error("Error fetching risk score from Gemini API:", error);
    return 'Medium'; // Fallback value
  }
};

export const getLoanRecommendation = async (riskScore: RiskScore, loanAmount: number, durationMonths: number): Promise<string> => {
    const cacheKey = `recommendation-${riskScore}-${loanAmount}-${durationMonths}`;
    const cached = getCache<string>(cacheKey);
    if (cached) {
        return cached;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
        const prompt = `
        A microfinance client with a "${riskScore}" risk score is applying for a loan of PKR ${loanAmount} for ${durationMonths} months.
        Provide a brief, one-sentence recommendation for the loan officer.
        - If 'Low' risk, be encouraging.
        - If 'Medium' risk, suggest cautious approval, maybe with slightly stricter terms or collateral.
        - If 'High' risk, strongly advise against the current terms and suggest a significantly smaller loan amount or shorter duration.
        
        The output must be a JSON object with a single key "recommendation".
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendation: { type: Type.STRING }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        const recommendation = result.recommendation || "Could not generate a recommendation.";
        
        setCache(cacheKey, recommendation);
        return recommendation;

    } catch (error) {
        console.error("Error fetching loan recommendation from Gemini API:", error);
        return "AI analysis unavailable. Please proceed with caution.";
    }
};


export const getAIBasedDefaultPrediction = async (client: Client, loan: Loan): Promise<DefaultPrediction> => {
  const cacheKey = `prediction-${loan.id}`;
  const cached = getCache<DefaultPrediction>(cacheKey);
  if (cached) {
      return cached;
  }
    
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const paidCount = loan.schedule.filter(i => i.status === 'Paid').length;
    const overdueCount = loan.schedule.filter(i => i.status === 'Overdue').length;
    const pendingCount = loan.schedule.filter(i => i.status === 'Pending').length;
    const partiallyPaidCount = loan.schedule.filter(i => i.status === 'Partially Paid').length;


    const repaymentSummary = `Total installments: ${loan.schedule.length}. Paid: ${paidCount}, Partially Paid: ${partiallyPaidCount}, Overdue: ${overdueCount}, Pending: ${pendingCount}.`;

    const prompt = `
      Analyze the default risk for a microfinance loan based on the following data.
      Client Information:
      - Base Risk Score: ${client.riskScore}
      - Monthly Income: PKR ${client.income || 'N/A'}

      Loan Information:
      - Amount: PKR ${loan.amount}
      - Duration: ${loan.durationMonths} months
      - Type: ${loan.type}
      
      Repayment History:
      - ${repaymentSummary}
      
      Based on this data, predict the likelihood of the client defaulting on this loan.
      A high base risk score, a high loan amount, and any overdue or partially paid payments should significantly increase the default risk.
      The output must be a JSON object with two keys:
      1. "predictionLabel": A string value, either "Low", "Moderate", or "High".
      2. "predictionPercentage": An integer representing the percentage chance of default (e.g., 15 for 15%).
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                predictionLabel: {
                    type: Type.STRING,
                    enum: ['Low', 'Moderate', 'High']
                },
                predictionPercentage: {
                    type: Type.INTEGER,
                    description: 'A number between 0 and 100.'
                }
            }
        }
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result.predictionLabel && result.predictionPercentage !== undefined) {
        setCache(cacheKey, result);
        return result as DefaultPrediction;
    }

    console.error("Invalid prediction from API:", result);
    return { predictionLabel: 'Moderate', predictionPercentage: 50 }; // Fallback
  } catch (error) {
    console.error("Error fetching AI default prediction from Gemini API:", error);
    return { predictionLabel: 'Moderate', predictionPercentage: 50 }; // Fallback
  }
};