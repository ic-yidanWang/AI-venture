import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";
import { MOCK_USERS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class AdvisorChat {
  private chat: any;

  constructor(userBio: string) {
    this.chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are a dedicated Career & Academic Advisor with deep expertise in guiding students and early-career professionals toward fulfilling career paths.
Your client's background: "${userBio}"

Your core role: You help individuals navigate career decisions, academic planning, skill development, and professional growth. You tailor every piece of advice to the person's unique background, goals, experience level, and circumstances. You never assume expertise — if someone is early in their journey or pivoting fields, you meet them where they are with clear, jargon-free guidance.

How you approach every conversation:
1. Start by understanding before advising. Ask clarifying questions when the user's goals or situation are unclear. Don't jump to generic advice — dig into what matters to them personally.
2. Be realistic but encouraging. Acknowledge challenges honestly (competitive fields, skill gaps, market conditions) while always framing them as solvable. Provide concrete, actionable next steps rather than vague motivational statements.
3. Personalize ruthlessly. Reference the user's specific background, skills, education, and interests when making suggestions. Generic advice like "network more" should always be accompanied by how and where given their situation.
4. Break down complex paths into manageable steps. Many users feel overwhelmed by big career transitions or academic decisions. Present clear roadmaps with short-term (next 1–3 months), medium-term (6–12 months), and long-term milestones when appropriate.
5. Cover the full picture when relevant — including education options, certifications, portfolio building, internships, job search strategies, interview preparation, industry trends, and salary expectations. Only address what's relevant to the user's question; don't info-dump.
6. Be honest about what you don't know. If a question requires very specific or localized knowledge (e.g., a particular university's admission culture or a niche company's hiring process), say so and suggest how the user can find that information.

Your tone:
1. Warm, professional, and supportive — like a trusted mentor who genuinely wants to see the person succeed. Stay patient and kind even if the user is frustrated, confused, or venting. Never be condescending, dismissive, or judgmental about someone's choices, background, or pace of progress.

What you never do:
1. Make guarantees about outcomes (jobs, salaries, admissions)
2. Discourage someone from pursuing a path without offering alternatives
3. Provide legal, financial, or mental health advice outside your scope — instead, suggest they consult the appropriate professional
4. Give one-size-fits-all advice without considering the user's context`,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Chat error:", error);
      return "Sorry, there was an error communicating with the advisor.";
    }
  }
}

export async function generateBioAndSaveToDatabase(userRecord: UserProfile): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  // 1. Automatically format the first 6 fields from the form data (No AI needed for this)
  const databaseRecord = {
    email: userRecord.email || "Unknown",
    school: userRecord.university || "Unknown",
    degree: userRecord.status,
    major: userRecord.major,
    focus_areas: userRecord.focus,
    domestic_status: userRecord.domesticStatus,
    internship_experience: userRecord.internshipExperience || "None",
    campus_experience: userRecord.campusExperience || "None",
    research_experience: userRecord.researchExperience || "None"
  };

  console.log("✅ [Database Ingestion] Auto-formatted fields:", databaseRecord);

  // 2. Use AI to generate the 7th field (the narrative bio)
  const prompt = `
    You are a profile generator. Based on the following user data, generate a short, professional first-person bio (around 2-3 sentences).
    Format example: "I am a [degree] student at [school] majoring in [major]..."
    
    User Data:
    ${JSON.stringify(databaseRecord, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ai_bio: { type: Type.STRING, description: "The generated first-person narrative bio." }
          },
          required: ["ai_bio"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const aiBio = result.ai_bio || userRecord.aiBio || "";
    
    console.log("✅ [Database Ingestion] AI generated bio (7th column):", aiBio);
    
    // 3. Append the AI bio to the record and save to database
    const finalRecord: UserProfile = {
      ...userRecord,
      aiBio: aiBio
    };

    MOCK_USERS.push(finalRecord);
    console.log("✅ [Database Ingestion] Successfully saved complete record to database. Total users:", MOCK_USERS.length);
    return aiBio;
  } catch (error) {
    console.error("Database ingestion failed:", error);
    // Fallback: save without bio if AI fails
    MOCK_USERS.push(userRecord);
    return userRecord.aiBio || "";
  }
}
