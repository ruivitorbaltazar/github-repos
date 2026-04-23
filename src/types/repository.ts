import { Repository } from "@/schemas/github/repository"

type RepoCardProps = {
  name: string
  description: string | null
  stars: number
  language?: string | null
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
