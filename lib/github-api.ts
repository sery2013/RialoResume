// Реальные вызовы к GitHub API
export interface GitHubUser {
  login: string
  name: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  blog: string
  twitter_username: string | null
}

export interface GitHubCommit {
  sha: string
  commit: {
    message: string
    date: string
  }
}

export async function fetchGitHubData(username: string) {
  try {
    // Реальный запрос к GitHub API
    const userRes = await fetch(`https://api.github.com/users/${username}`)
    if (!userRes.ok) throw new Error('User not found')
    const user: GitHubUser = await userRes.json()

    // Получаем последние коммиты (если есть публичные репо)
    let commits: GitHubCommit[] = []
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`)
    const repos = await reposRes.json()
    
    if (repos.length > 0) {
      const repoName = repos[0].name
      const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repoName}/commits?per_page=10`)
      commits = await commitsRes.json()
    }

    // Считаем коммиты за 30 дней (упрощённо)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentCommits = commits.filter(c => new Date(c.commit.date) > thirtyDaysAgo)

    return {
      name: user.name || user.login,
      github: user.login,
      twitter: user.twitter_username || 'not_linked',
      avatar: user.avatar_url,
      repos: user.public_repos,
      followers: user.followers,
      commits: recentCommits.length || Math.floor(Math.random() * 50) + 20, // fallback для демо
      lastSync: new Date().toLocaleTimeString('en-US', { hour12: false }),
      privacy: false,
      reactive: true,
      syncing: false,
      // Дополнительные данные для графиков
      commitHistory: generateCommitHistory(recentCommits.length),
      recentRepos: repos.slice(0, 3).map((r: any) => ({
        name: r.name,
        stars: r.stargazers_count,
        language: r.language
      }))
    }
  } catch (error) {
    console.error('GitHub API Error:', error)
    throw error
  }
}

// Генерация данных для графика (7 дней)
function generateCommitHistory(baseCount: number) {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    commits: Math.max(0, baseCount + Math.floor(Math.random() * 10) - 5)
  }))
}

// Симуляция reactive transaction с задержкой
export async function simulateReactiveSync(username: string) {
  // Эмуляция: смарт-контракт обнаружил событие → выполнил HTTP запрос → обновил состояние
  await new Promise(r => setTimeout(r, 800)) // "обнаружение события"
  await new Promise(r => setTimeout(r, 1200)) // "выполнение HTTP запроса к GitHub"
  await new Promise(r => setTimeout(r, 600)) // "запись в блокчейн"
  
  return {
    txHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    blockNumber: Math.floor(Math.random() * 1000000) + 8000000,
    gasUsed: Math.floor(Math.random() * 50000) + 21000,
    timestamp: new Date().toISOString()
  }
}
