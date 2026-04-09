import { Repository } from "@/types/repository"

type RootStackParamList = {
  RepoList: undefined
  RepoDetails: { repo: Repository }
}

export {
  RootStackParamList,
}
