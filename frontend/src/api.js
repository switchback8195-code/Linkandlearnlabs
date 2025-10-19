import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Learning Paths API
export const learningPathsAPI = {
  getAll: () => api.get('/learning-paths'),
  getById: (id) => api.get(`/learning-paths/${id}`),
  enroll: (id) => api.post(`/learning-paths/${id}/enroll`),
};

// Builds API
export const buildsAPI = {
  getAll: (limit = 10, offset = 0) => api.get(`/builds?limit=${limit}&offset=${offset}`),
  create: (data) => api.post('/builds', data),
  like: (id) => api.post(`/builds/${id}/like`),
};

// Events API
export const eventsAPI = {
  getAll: (upcoming = true) => api.get(`/events?upcoming=${upcoming}`),
  register: (id) => api.post(`/events/${id}/register`),
};

// Forum API
export const forumAPI = {
  getTopics: (category = null, limit = 20, offset = 0) => {
    let url = `/forum/topics?limit=${limit}&offset=${offset}`;
    if (category) url += `&category=${category}`;
    return api.get(url);
  },
  createTopic: (data) => api.post('/forum/topics', data),
  replyToTopic: (id, content) => api.post(`/forum/topics/${id}/reply`, { content }),
};

export default api;