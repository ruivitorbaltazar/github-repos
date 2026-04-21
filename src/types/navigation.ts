import { Repository } from "@/types/repository"

type RootStackParamList = {
  Login: undefined
  RepoList: undefined
  RepoDetails: { repo: Repository }
}

export {
  RootStackParamList,
}
