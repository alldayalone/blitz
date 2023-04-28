import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import splitbee from '@splitbee/web';

export type Repo = {
  id: number;
  nameWithOwner: string
  name: string
  description: string | null
  owner: {
    login: string
  }
  discussionCategories: {
    nodes: {
      id: string
      name: string
    }[]
  }
  discussions: {
    nodes: {
      number: number
      title: string
      category: {
        id: string
      }
    }[] 
  }
}

const RepoContext = createContext<Repo | null>(null);

export const useRepo = () => {
  return useContext(RepoContext);
}

export const RepoProvider: React.FC<PropsWithChildren<{ repoName: string }>> = ({ children, repoName }) => {
  const [repo, setRepo] = useState<Repo | null>(null);

  useEffect(() => {
    async function fetchRepo() {
      if (!repoName) {
        setRepo(null);
        return;
      }

      const data: { repository: Repo } = await fetch(`https://pasha.npkn.net/blitz-issues/${repoName}`).then(res => res.json());
      console.log(data)
      setRepo(data.repository);

      splitbee.track('repo', { repo: data.repository.nameWithOwner });
    }

    fetchRepo();   
  }, [repoName]);

  return (
    <RepoContext.Provider value={repo}>
      {children}
    </RepoContext.Provider>
  );
}
