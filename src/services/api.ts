const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_BASE_URL = configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:4000/api' : '');

const ensureApiUrl = () => {
  if (!API_BASE_URL) {
    throw new Error('Backend API is not configured. Set VITE_API_URL in the deployed frontend service.');
  }
};

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
  ensureApiUrl();
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

export const storageApi = {
  uploadResume: async (file: File) => {
    ensureApiUrl();
    const token = localStorage.getItem('talentsim-token');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/storage/resume`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null) as { message?: string | string[] } | null;
      const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
      throw new ApiError(message || 'Resume upload failed', response.status);
    }

    return response.json() as Promise<{ id: string; fileName: string; storagePath: string }>;
  },
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
