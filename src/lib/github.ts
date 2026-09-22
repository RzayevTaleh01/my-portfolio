import "server-only";

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

const REVALIDATE_SECONDS = 60 * 60;

async function gh<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com${path}`, { headers, next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

async function ownRepos(username: string) {
  const data = await gh<RawRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed`);
  return data?.filter((r) => !r.fork && !r.archived) ?? null;
}

export async function getRepos(username: string, limit = 6): Promise<GitHubRepo[] | null> {
  const repos = await ownRepos(username);
  if (!repos) return null;
  return repos.slice(0, limit).map((r) => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    updatedAt: r.pushed_at,
  }));
}

