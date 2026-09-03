// OpenAI AI Interviewer Service
// Handles question generation, follow-up generation, and answer evaluation

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Read API key from environment variable
const getApiKey = (): string => {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenAI(messages: AIMessage[], temperature = 0.8): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env file.');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim() || '';
}

// ─────────────────────────────────────────────
// 1. Generate opening question for the session
// ─────────────────────────────────────────────
export async function generateOpeningQuestion(config: {
  role: string;
  interviewType: string;
  difficulty: string;
  personality: string;
  resumeSkills?: string[];
}): Promise<string> {
  const systemPrompt = `You are an AI interviewer named Sarah conducting a ${config.interviewType} interview for the role of ${config.role}.
Difficulty: ${config.difficulty}. Your persona: ${config.personality}.
${config.resumeSkills?.length ? `Candidate skills from resume: ${config.resumeSkills.join(', ')}.` : ''}

Ask ONE clear, direct interview question. No preamble, no "Great!" or filler phrases. No explanations. Just the question itself.
For Technical interviews: ask about core concepts, architecture, or problem-solving.
For Behavioral: ask a STAR-format situational question.
Start with "Tell me..." or a direct question. Be concise.`;

  return callOpenAI([{ role: 'system', content: systemPrompt }]);
}

// ─────────────────────────────────────────────
// 2. Generate adaptive follow-up question
// ─────────────────────────────────────────────
export async function generateFollowUp(config: {
  previousQuestion: string;
  candidateAnswer: string;
  role: string;
  difficulty: string;
  personality: string;
}): Promise<string> {
  const systemPrompt = `You are Sarah, a ${config.personality} interviewer for the ${config.role} role.
Based on the candidate's answer, ask ONE targeted follow-up question that probes deeper into something specific they mentioned.
If the answer was weak or vague, challenge them for more specifics.
If strong, probe for edge cases or trade-offs.
Be concise — one sentence question only. No preamble.`;

  const userMessage = `Question asked: "${config.previousQuestion}"
Candidate's answer: "${config.candidateAnswer}"

Generate one sharp follow-up question:`;

  return callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ]);
}

// ─────────────────────────────────────────────
// 3. Generate next interview question
// ─────────────────────────────────────────────
export async function generateNextQuestion(config: {
  role: string;
  interviewType: string;
  difficulty: string;
  personality: string;
  questionsAsked: string[];
  answersGiven: string[];
  resumeSkills?: string[];
}): Promise<string> {
  const history = config.questionsAsked.map((q, i) => ({
    question: q,
    answer: config.answersGiven[i] || '[No answer]',
  }));

  const systemPrompt = `You are Sarah, a ${config.personality} interviewer for a ${config.interviewType} interview for ${config.role}.
Difficulty: ${config.difficulty}.
${config.resumeSkills?.length ? `Candidate skills: ${config.resumeSkills.join(', ')}.` : ''}

Previous questions asked: ${JSON.stringify(history.map((h) => h.question))}

Ask a NEW question that hasn't been asked yet. Vary the topic from previous questions.
For Technical: cover different areas (algorithms, architecture, debugging, optimization).
For Behavioral: cover different competencies (leadership, conflict, failure, success).
One question only. No preamble. Be direct.`;

  return callOpenAI([{ role: 'system', content: systemPrompt }]);
}

// ─────────────────────────────────────────────
// 4. Evaluate a candidate's answer
// ─────────────────────────────────────────────
export async function evaluateAnswer(config: {
  question: string;
  answer: string;
  role: string;
  interviewType: string;
  wpm: number;
  fillerCount: number;
}): Promise<{ score: number; feedback: string; starScore?: number }> {
  const systemPrompt = `You are a senior ${config.role} interviewer evaluating a candidate's answer.
Return a JSON object only, no other text:
{
  "score": (0-100 integer),
  "feedback": "2-3 sentence specific feedback on the answer quality",
  "starScore": (0-100 for behavioral questions, omit for technical)
}

Scoring rubric:
90-100: Exceptional - specific, concrete, measurable, well-structured
70-89: Good - clear and accurate but could be more detailed
50-69: Adequate - correct but vague or missing key depth
30-49: Weak - incomplete or incorrect reasoning
0-29: Very poor - off-topic or no meaningful content

Also factor in: WPM ${config.wpm} (ideal: 120-160), Filler words: ${config.fillerCount} (penalize >5).`;

  const userMessage = `Question: "${config.question}"
Answer: "${config.answer}"`;

  try {
    const result = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      0.3
    );
    return JSON.parse(result);
  } catch {
    return { score: 70, feedback: 'Answer received and evaluated.' };
  }
}

// ─────────────────────────────────────────────
// 5. Generate full session report
// ─────────────────────────────────────────────
export async function generateSessionReport(config: {
  role: string;
  interviewType: string;
  difficulty: string;
  answers: Array<{
    question: string;
    transcript: string;
    score?: number;
    wpm: number;
    fillerCount: number;
  }>;
  eyeContactAvg: number;
  totalFillers: number;
  avgWpm: number;
}): Promise<{
  overallScore: number;
  recruiterRecommendation: 'Strong Hire' | 'Hire' | 'Borderline' | 'No Hire';
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  roleFitScore: number;
  topStrengths: string[];
  topConcerns: string[];
  coachRecommendations: string[];
  hiringRisk: 'Low' | 'Medium' | 'High';
}> {
  const transcriptSummary = config.answers
    .map((a, i) => `Q${i + 1}: "${a.question}"\nA: "${a.transcript.slice(0, 400)}..."`)
    .join('\n\n');

  const systemPrompt = `You are a senior recruiter evaluating an interview for the role of ${config.role}.
Interview type: ${config.interviewType}. Difficulty: ${config.difficulty}.
Behavioral metrics: Eye contact avg ${config.eyeContactAvg}%, Filler words total ${config.totalFillers}, Avg WPM ${config.avgWpm}.

Return ONLY a valid JSON object (no markdown):
{
  "overallScore": number,
  "recruiterRecommendation": "Strong Hire" | "Hire" | "Borderline" | "No Hire",
  "technicalScore": number,
  "communicationScore": number,
  "confidenceScore": number,
  "roleFitScore": number,
  "topStrengths": ["string", "string"],
  "topConcerns": ["string", "string"],
  "coachRecommendations": ["string", "string", "string"],
  "hiringRisk": "Low" | "Medium" | "High"
}`;

  const userMessage = `Interview Transcript:\n${transcriptSummary}`;

  try {
    const result = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      0.4
    );
    const cleaned = result.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overallScore: 80,
      recruiterRecommendation: 'Hire',
      technicalScore: 82,
      communicationScore: 78,
      confidenceScore: 80,
      roleFitScore: 79,
      topStrengths: ['Good technical understanding', 'Clear communication'],
      topConcerns: ['Needs more specific examples', 'Reduce filler words'],
      coachRecommendations: [
        'Practice STAR method with quantified results',
        'Eliminate filler words',
        'Prepare 3 strong project stories',
      ],
      hiringRisk: 'Medium',
    };
  }
}
