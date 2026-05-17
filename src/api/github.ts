import { BASE_URL, ENDPOINTS } from './endpoints';
import { GithubSearchResponse } from '../types/github';

export const fetchTrendingRepos = async (page: number = 1): Promise<GithubSearchResponse> => {
  const q = encodeURIComponent('created:>2023-01-01'); // arbitrary recent date to simulate trending
  const sort = 'stars';
  const order = 'desc';
  
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.SEARCH_REPOSITORIES}?q=${q}&sort=${sort}&order=${order}&page=${page}&per_page=20`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending repositories');
  }
  
  return response.json();
};

export const searchRepos = async (query: string, page: number = 1): Promise<GithubSearchResponse> => {
  if (!query) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }
  
  const q = encodeURIComponent(query);
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.SEARCH_REPOSITORIES}?q=${q}&page=${page}&per_page=20`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search repositories');
  }
  
  return response.json();
};

export const searchUsers = async (query: string, page: number = 1): Promise<import('../types/github').GithubUserSearchResponse> => {
  if (!query) {
    return { total_count: 0, incomplete_results: false, items: [] };
  }
  
  const q = encodeURIComponent(query);
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.SEARCH_USERS}?q=${q}&page=${page}&per_page=20`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search users');
  }
  
  return response.json();
};
