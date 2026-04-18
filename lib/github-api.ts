export interface GitHubProfile {
  login: string
  name: string | null
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  twitter_username?: string | null
  blog?: string
  created_at: string
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const res = await fetch(`https://api.github.com/users/${username}`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export async function fetchUserCommits(username: string): Promise<any[]> {
  const res = await fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=100`)
  if (!res.ok) return []
  const data = await res.json()
  return data.items || []
}

export function calculateCommitActivity(commits: any[]) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  })

  const activity = last30Days.map(date => ({
    date,
    count: commits.filter(c => c.commit.author.date.startsWith(date)).length
  })).reverse()

  return activity
}

export function generateAchievements(profile: GitHubProfile, commits: any[]) {
  const achievements = []
  
  if (profile.public_repos >= 10) {
    achievements.push({ id: 'builder', name: 'Active Builder', icon: '🏗️', desc: '10+ repos' })
  }
  if (profile.followers >= 50) {
    achievements.push({ id: 'influencer', name: 'Community Star', icon: '⭐', desc: '50+ followers' })
  }
  if (commits.length >= 100) {
    achievements.push({ id: 'coder', name: 'Code Master', icon: '💻', desc: '100+ commits' })
  }
  if (new Date(profile.created_at).getFullYear() <= 2018) {
    achievements.push({ id: 'veteran', name: 'OG Developer', icon: '🎖️', desc: 'Since 2018' })
  }

  return achievements
}
