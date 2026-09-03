// PDF Resume Parser Service using pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source to CDN for browser execution
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ParsedResume {
  rawText: string;
  skills: string[];
  suggestedRole: string;
  strengthScore: number;
  extractedProjects: string[];
}

const COMMON_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++',
  'Go', 'Rust', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'GraphQL',
  'REST API', 'PostgreSQL', 'MongoDB', 'Redis', 'Next.js', 'Tailwind',
  'Git', 'CI/CD', 'Microservices', 'System Design', 'Agile', 'DevOps',
];

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

export function parseResumeSkills(rawText: string): ParsedResume {
  const lower = rawText.toLowerCase();

  // 1. Detect matching skills
  const matchedSkills = COMMON_SKILLS.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );

  // Fallback defaults if few skills detected
  const skills = matchedSkills.length > 0 ? matchedSkills : ['React', 'TypeScript', 'System Architecture'];

  // 2. Infer suggested role
  let suggestedRole = 'Fullstack Engineer';
  if (lower.includes('frontend') || lower.includes('react') || lower.includes('vue')) {
    suggestedRole = 'Senior Frontend Developer';
  } else if (lower.includes('backend') || lower.includes('python') || lower.includes('go')) {
    suggestedRole = 'Backend Platform Engineer';
  } else if (lower.includes('data') || lower.includes('machine learning') || lower.includes('pytorch')) {
    suggestedRole = 'AI / ML Engineer';
  }

  // 3. Extract potential project titles
  const extractedProjects: string[] = [];
  const projectMatches = rawText.match(/(?:Project|Built|Developed|Designed)\s+([A-Z][a-zA-Z0-9\s]{3,20})/g);
  if (projectMatches) {
    projectMatches.slice(0, 3).forEach((p) => extractedProjects.push(p.trim()));
  } else {
    extractedProjects.push('E-Commerce Dashboard', 'Realtime Chat Engine');
  }

  // 4. Calculate strength score based on length and skill density
  const wordCount = rawText.trim().split(/\s+/).length;
  const strengthScore = Math.min(96, Math.max(68, Math.round((wordCount / 400) * 40 + skills.length * 5)));

  return {
    rawText,
    skills,
    suggestedRole,
    strengthScore,
    extractedProjects,
  };
}
