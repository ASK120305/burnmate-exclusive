import axios from 'axios';

// Use the Render backend URL in production, proxy in development
export const apiBaseURL = import.meta.env.PROD 
  ? 'https://burnmate-exclusive.onrender.com/api'
  : '/api';

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('burnmate-token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface LoginResponse { token: string; user: AuthUser }

export const authApi = {
  register: (payload: { name: string; email: string; password: string; age?: number; gender?: string }) => {
    console.log('Sending register payload:', payload);
    return api.post<LoginResponse>('/register', payload).then(r => r.data);
  },
  login: (payload: { email: string; password: string }) => {
    console.log('Sending login payload:', payload);
    return api.post<LoginResponse>('/login', payload).then(r => r.data);
  },
};

export const profileApi = {
  getProfile: (id: string) => api.get<AuthUser>(`/profile/${id}`).then(r => r.data),
  updateProfile: (id: string, payload: Partial<AuthUser>) => api.put<AuthUser>(`/profile/${id}`, payload).then(r => r.data),
};

export interface WorkoutDto {
  _id?: string;
  userId?: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date?: string;
}

export const workoutApi = {
  addWorkout: (payload: Omit<WorkoutDto, '_id' | 'userId'>) => api.post<WorkoutDto>('/workout', payload).then(r => r.data),
  getWorkouts: (userId: string) => api.get<WorkoutDto[]>(`/workouts/${userId}`).then(r => r.data),
};

export interface IntakeDto {
  _id?: string;
  userId?: string;
  name: string;
  calories: number;
  protein?: number;
  timestamp?: string;
}

export const intakeApi = {
  add: (payload: Omit<IntakeDto, '_id' | 'userId'>) => api.post<IntakeDto>('/intake', payload).then(r => r.data),
  list: (userId: string, from?: string, to?: string) => api.get<IntakeDto[]>(`/intake/${userId}`, { params: { from, to } }).then(r => r.data),
  remove: (id: string) => api.delete<{ ok: boolean }>(`/intake/${id}`).then(r => r.data),
};

export interface GlobalLeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  totalCalories: number;
  workoutsCount: number;
  rank: number;
}

export const leaderboardApi = {
  getGlobal: () => api.get<GlobalLeaderboardEntry[]>('/leaderboard').then(r => r.data),
  getUserWorkouts: (userId: string) => api.get<WorkoutDto[]>(`/leaderboard/${userId}/workouts`).then(r => r.data),
};
