export interface CompanyQuestion {
  id: string;
  company: 'Google' | 'Amazon' | 'Microsoft' | 'Zoho' | 'Meta';
  category: 'technical' | 'behavioral' | 'system-design';
  role: string;
  text: string;
  followUp: string;
  evaluationCriteria: string[];
}

export const COMPANY_QUESTION_BANKS: Record<string, CompanyQuestion[]> = {
  Google: [
    {
      id: 'g-1',
      company: 'Google',
      category: 'technical',
      role: 'Senior Software Engineer',
      text: 'Tell me about how you would design a high-throughput, low-latency rate limiter that handles 100,000 requests per second across distributed edge servers.',
      followUp: 'How do you handle clock drift across distributed nodes in your sliding window log implementation?',
      evaluationCriteria: ['Distributed Systems', 'Sliding Window Algorithm', 'Redis/Memcached Memory Efficiency'],
    },
    {
      id: 'g-2',
      company: 'Google',
      category: 'system-design',
      role: 'Senior Frontend Developer',
      text: 'Explain how you optimize critical rendering paths and web vitals (LCP, INP, CLS) for a high-traffic web application with complex dynamic bundles.',
      followUp: 'How do you structure code splitting and dynamic import boundaries to prevent hydration mismatch?',
      evaluationCriteria: ['Core Web Vitals', 'DOM Optimization', 'Bundle Code Splitting'],
    },
  ],
  Amazon: [
    {
      id: 'a-1',
      company: 'Amazon',
      category: 'behavioral',
      role: 'Software Development Engineer',
      text: 'Describe a situation where you had to make a high-stakes technical decision with incomplete data under tight deadlines. (Leadership Principle: Bias for Action)',
      followUp: 'What metrics did you track after deployment to verify your assumption was correct?',
      evaluationCriteria: ['STAR Format Alignment', 'Bias for Action', 'Calculated Risk Taking'],
    },
    {
      id: 'a-2',
      company: 'Amazon',
      category: 'technical',
      role: 'Software Development Engineer',
      text: 'Tell me about a time you dove deep into a complex production outage that others could not resolve. (Leadership Principle: Dive Deep)',
      followUp: 'What root cause prevention mechanisms did you implement in CI/CD to ensure it never happens again?',
      evaluationCriteria: ['Root Cause Analysis', 'CI/CD Safeguards', 'Metric Telemetry'],
    },
  ],
  Microsoft: [
    {
      id: 'm-1',
      company: 'Microsoft',
      category: 'technical',
      role: 'Cloud & Fullstack Engineer',
      text: 'How do you design zero-downtime database migrations and blue-green deployments for large-scale microservice platforms?',
      followUp: 'How do you handle backward compatibility during the dual-write migration phase?',
      evaluationCriteria: ['Blue-Green Deployment', 'Dual Write Pattern', 'Backward Compatibility'],
    },
  ],
  Zoho: [
    {
      id: 'z-1',
      company: 'Zoho',
      category: 'technical',
      role: 'Product Developer',
      text: 'Explain how you design custom memory allocation or caching mechanisms without relying heavily on third-party heavy dependencies.',
      followUp: 'How do you handle cache eviction policies like LRU vs LFU under memory-constrained environments?',
      evaluationCriteria: ['Core Fundamentals', 'Custom Cache Structures', 'LRU Memory Bounds'],
    },
  ],
  Meta: [
    {
      id: 'meta-1',
      company: 'Meta',
      category: 'system-design',
      role: 'Software Engineer',
      text: 'How would you architect a real-time messaging sync engine capable of handling billions of active WebSocket connections with end-to-end encryption?',
      followUp: 'How do you handle offline message queuing and message delivery guarantees (at-least-once vs exactly-once)?',
      evaluationCriteria: ['Realtime Messaging', 'WebSocket State Scaling', 'E2E Encryption Keys'],
    },
  ],
};

export function getQuestionsForCompany(company: string): CompanyQuestion[] {
  return COMPANY_QUESTION_BANKS[company] || COMPANY_QUESTION_BANKS.Google;
}
