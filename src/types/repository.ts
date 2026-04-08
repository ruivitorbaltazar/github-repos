type Repository = {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  language: string
  html_url: string
  forks_count: number
  open_issues_count: number
  owner: {
    login: string
    avatar_url: string
  }
}

type RepoCardProps = {
  name: string
  description: string
  stars: number
  language?: string
  owner?: {
    login: string
    avatar_url: string
  }
  onPress?: () => void
}

export {
  Repository,
  RepoCardProps,
}
