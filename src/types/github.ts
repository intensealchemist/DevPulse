export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  open_issues_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}
