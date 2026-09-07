const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export type ApiAuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  user: ApiAuthUser;
  accessToken: string;
};

const request = async <T>(path: string, options: RequestInit = {}, authenticated = false): Promise<T> => {
  const token = localStorage.getItem('talentsim-token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new ApiError(message || 'Request failed', response.status);
  }

  return response.json() as Promise<T>;
};

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

  export type CreateInterviewInput = {
    role: string;
    company?: string;
    interviewType: string;
    difficulty: string;
  };

  export type CreateAnswerInput = {
    questionText: string;
    transcript: string;
    wpm: number;
    fillerCount: number;
    pauseCount: number;
    durationSeconds: number;
  };

  export const interviewsApi = {
    create: (input: CreateInterviewInput) =>
      request<{ id: string }>('/interviews', {
        method: 'POST',
        body: JSON.stringify(input),
      }, true),
    addAnswer: (sessionId: string, input: CreateAnswerInput) =>
      request(`/interviews/${sessionId}/answers`, {
        method: 'POST',
        body: JSON.stringify(input),
      }, true),
    complete: (sessionId: string) =>
      request(`/interviews/${sessionId}/complete`, { method: 'POST' }, true),
    list: () =>
      request<Array<{
        id: string;
        role: string;
        company: string | null;
        interviewType: string;
        status: string;
        createdAt: string;
        answers: Array<{ aiScore: number | null }>;
      }>>('/interviews', { method: 'GET' }, true),
  };
