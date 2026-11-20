import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

/**
 * Helper to dynamically get AI clients based on current environment variables.
 * This ensures keys updated at runtime are respected.
 */
function getAIClients() {
  let genAI = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  let openai = null;
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  return { genAI, openai };
}

/**
 * Extract text content from PDF file buffer
 */
export async function extractTextFromPdf(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (err) {
    console.error('Error parsing PDF:', err);
    throw new Error('Failed to parse PDF resume file.');
  }
}

/**
 * Generate a response for the portfolio AI chatbot
 */
export async function generateChatbotResponse(history, userMessage, portfolioData) {
  // Create system instructions defining chatbot role, context and limits
  const systemPrompt = `You are a smart, professional, and friendly AI assistant representing the software developer, ${portfolioData.profile.name}.
Your job is to answer questions about ${portfolioData.profile.name}'s professional experience, skills, projects, achievements, education, and certifications.

Here is ${portfolioData.profile.name}'s professional portfolio data:
- Name: ${portfolioData.profile.name}
- Title: ${portfolioData.profile.title}
- Biography: ${portfolioData.profile.bio}
- Contact Email: ${portfolioData.profile.email}
- GitHub: ${portfolioData.profile.github}
- LinkedIn: ${portfolioData.profile.linkedin}

WORK EXPERIENCE:
${(portfolioData.experience || []).map(e => `- ${e.role} at ${e.company} (${e.date}): ${e.description}\n  GitHub: ${e.githubUrl || 'N/A'}`).join('\n')}

EDUCATION:
${(portfolioData.education || []).map(edu => `- ${edu.degree} from ${edu.institution} (${edu.date}): ${edu.description}\n  GitHub: ${edu.githubUrl || 'N/A'}`).join('\n')}

CERTIFICATIONS:
${(portfolioData.certifications || []).map(c => `- ${c.title} by ${c.issuer} (${c.date}): ${c.description}\n  GitHub: ${c.githubUrl || 'N/A'}`).join('\n')}

SKILLS:
${(portfolioData.skills || []).map(s => `- ${s.name} (${s.category}, ${s.percentage}% proficiency)`).join('\n')}

PROJECTS:
${(portfolioData.projects || []).map(p => `- ${p.title}: ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}\n  GitHub: ${p.githubUrl || 'N/A'}, Demo: ${p.demoUrl || 'N/A'}`).join('\n')}

ACHIEVEMENTS:
${(portfolioData.achievements || []).map(a => `- ${a.title} (Issued by ${a.issuer} in ${a.date}): ${a.description}`).join('\n')}

Rules for your answers:
1. Always be polite, professional, and confident about ${portfolioData.profile.name}'s skills.
2. If someone asks something unrelated to ${portfolioData.profile.name} or their professional profile, politely guide the conversation back to their skills and experience.
3. Keep answers relatively concise and easy to read. Use markdown bullet points where appropriate.
4. Do NOT make up information. If something is not in the portfolio data, state that you don't have that detail but suggest contact via email (${portfolioData.profile.email}).
5. You are speaking as ${portfolioData.profile.name}'s representative. You can say "Dhamodharan is..." or "He has..." or "My creator, Dhamodharan, is..." (Use the name provided in profile).`;

  const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'Visitor' : 'Assistant'}: ${msg.text}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\nChat History:\n${formattedHistory}\nVisitor: ${userMessage}\nAssistant:`;

  const { genAI, openai } = getAIClients();

  // Try Gemini API first
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.error('Gemini chatbot error, falling back to OpenAI:', err.message);
    }
  }

  // Try OpenAI API second
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          { role: 'user', content: userMessage }
        ]
      });
      return response.choices[0].message.content.trim();
    } catch (err) {
      console.error('OpenAI chatbot error:', err.message);
    }
  }

  // Fallback offline mock bot
  return generateOfflineResponse(userMessage, portfolioData);
}

/**
 * Enhance professional text (Biography / Project Description)
 */
export async function enhanceText(text, fieldName = 'text') {
  const prompt = `You are a professional copywriter and technical writer. 
Enhance the following ${fieldName} to make it sound premium, professional, engaging, and clear.
Keep the original meaning, but use stronger verbs and polish the sentence structures.
Provide only the polished text as your output, with no introduction, markdown formatting (unless bullet points are appropriate), or explanation.

Text to enhance:
"${text}"`;

  const { genAI, openai } = getAIClients();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.error('Gemini text enhancer error, trying OpenAI:', err.message);
    }
  }

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } catch (err) {
      console.error('OpenAI text enhancer error:', err.message);
    }
  }

  // Offline fallback
  return `Enhanced (Offline Fallback): ${text}. Powered by local AI suggestions. Please set API keys in the environment for full enhancements.`;
}

/**
 * Analyze an uploaded resume and give feedback
 */
export async function analyzeResume(resumeText, portfolioData) {
  const prompt = `You are an expert technical recruiter and resume consultant.
Provide a detailed, structured feedback report on the following candidate resume text.
Your review should evaluate how their profile compares to the standards of ${portfolioData.profile.name} (a ${portfolioData.profile.title}) and suggest career improvements.

Resume Text to analyze:
"""
${resumeText}
"""

Provide your feedback in clean Markdown format with the following sections:
1. **Overall Impression**: A summary rating of the resume (out of 10) and brief overview.
2. **Key Strengths**: Highlight 3-4 strong areas detected in the text (e.g. key technologies, structured formatting, experience).
3. **Areas for Improvement**: Highlight 3-4 specific things that could be improved (e.g. missing metrics, weak verbs, vague descriptions).
4. **Actionable Suggestions**: Specific steps they can take next to get hired or improve their resume structure.
5. **Skills Gap Analysis**: Compare their skills against the portfolio creator's core technologies: ${ (portfolioData.skills || []).map(s => s.name).join(', ') }. Highlight any missing skills that would make them more competitive.`;

  const { genAI, openai } = getAIClients();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.error('Gemini resume analysis error, trying OpenAI:', err.message);
    }
  }

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } catch (err) {
      console.error('OpenAI resume analysis error:', err.message);
    }
  }

  // Offline fallback
  return `### Resume Review Report (Offline Fallback)

*Note: Please configure a GEMINI_API_KEY in your server .env file to generate dynamic, advanced AI analyses.*

1. **Overall Impression**: 7/10
   - The resume structure is clear and lists relevant contact information.

2. **Key Strengths**:
   - Mentions standard software engineering patterns.
   - Clean structural sections (Experience, Education, Projects).

3. **Areas for Improvement**:
   - Could include more quantitative details (e.g., "improved speed by 20%").
   - Highlight proficiency and depth of modern web tools.

4. **Actionable Suggestions**:
   - Align resume bullet points to the STAR framework (Situation, Task, Action, Result).
   - Learn newer React patterns and LLM integrations.

5. **Skills Gap Analysis**:
   - To match **${portfolioData.profile.name}**'s level, consider adding skills like **${ (portfolioData.skills || []).slice(0, 3).map(s => s.name).join(', ') }**.`;
}

/**
 * Generate a smart response offline based on basic keyword matching
 */
function generateOfflineResponse(userMessage, portfolioData) {
  const msg = userMessage.toLowerCase();
  const name = portfolioData.profile.name;
  
  if (/\b(hello|hi|hey|greetings)\b/i.test(msg)) {
    return `Hi there! I am the AI assistant representing ${name}. Ask me about his projects, skills, work experience, education, certifications, or how to contact him. How can I help you today?`;
  }
  if (/\b(achievement|achievements|award|awards|milestone|milestones|prize|prizes)\b/i.test(msg)) {
    const list = (portfolioData.achievements || []).map(a => `- **${a.title}** by ${a.issuer} (${a.date})`).join('\n');
    return `Here are some of ${name}'s key achievements and prizes:\n\n${list}`;
  }
  if (/\b(certification|certifications|certificate|certificates)\b/i.test(msg)) {
    const list = (portfolioData.certifications || []).map(c => `- **${c.title}** by ${c.issuer} (${c.date}): ${c.description}`).join('\n');
    return `Here are some of ${name}'s professional certifications:\n\n${list}`;
  }
  if (/\b(education|study|studies|college|university|degree|gpa|cgpa|btech)\b/i.test(msg)) {
    const list = (portfolioData.education || []).map(edu => `- **${edu.degree}** from **${edu.institution}** (${edu.date}): ${edu.description}`).join('\n');
    return `Here is ${name}'s educational background:\n\n${list}`;
  }
  if (/\b(experience|intern|internship|job|jobs|work|works)\b/i.test(msg)) {
    const list = (portfolioData.experience || []).map(e => `- **${e.role}** at **${e.company}** (${e.date}): ${e.description}`).join('\n');
    return `Here is ${name}'s work experience:\n\n${list}`;
  }
  if (/\b(project|projects|portfolio)\b/i.test(msg)) {
    const list = (portfolioData.projects || []).map(p => `**${p.title}**: ${p.description} (Tech: ${p.techStack.join(', ')})`).join('\n\n');
    return `Here are some of ${name}'s featured projects:\n\n${list}\n\nWould you like more details on any of these?`;
  }
  if (/\b(skill|skills|tech|technologies|language|languages|know|knowledge)\b/i.test(msg)) {
    const list = (portfolioData.skills || []).map(s => `- **${s.name}** (${s.category}: ${s.percentage}%)`).join('\n');
    return `Here are ${name}'s core skills:\n\n${list}\n\nHe is constantly learning and applying new technologies.`;
  }
  if (/\b(contact|hire|email|linkedin|github|reach)\b/i.test(msg)) {
    return `You can get in touch with ${name} via:\n- **Email**: ${portfolioData.profile.email || 'N/A'}\n- **LinkedIn**: [LinkedIn Profile](${portfolioData.profile.linkedin})\n- **GitHub**: [GitHub Profile](${portfolioData.profile.github})\n\nYou can also submit the contact form on this page!`;
  }
  if (/\b(about|bio|background|profile)\b/i.test(msg)) {
    return `${name}'s Profile: **${portfolioData.profile.title}**\n\n${portfolioData.profile.bio}`;
  }

  return `Thanks for asking! I'm currently running in offline fallback mode (Please check if you saved your Gemini API Key in the Admin Dashboard), but I can tell you that ${name} is a skilled **${portfolioData.profile.title}** experienced in React, Next.js, Node.js, and AI API integrations. Feel free to contact him directly at ${portfolioData.profile.email || 'dhamodharanr08@gmail.com'} or upload your resume for feedback.`;
}
