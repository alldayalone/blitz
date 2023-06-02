import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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

const RepoContext = createContext<{ repo: Repo | null, fetchRepo: () => Promise<void> }>({ repo: null, fetchRepo: async () => {} });

export const useRepo = () => {
  return useContext(RepoContext);
}

export const RepoProvider: React.FC<React.PropsWithChildren<{ repoName: string }>> = ({ children, repoName }) => {
  const [repo, setRepo] = useState<Repo | null>(null);

  const fetchRepo = useCallback(async () => {
    if (!repoName) {
      setRepo(null);
      return;
    }

    const data: { repository: Repo } = await fetch(`https://pasha.npkn.net/blitz-issues/issues/${repoName}`).then(res => res.json());

    setRepo(data.repository);
  }, [repoName]);

  useEffect(() => {
    fetchRepo();   

    return () => setRepo(null);
  }, [fetchRepo]);

  return (
    <RepoContext.Provider value={{ repo, fetchRepo }}>
      {children}
    </RepoContext.Provider>
  );
}



export function useMakeProposal() {
  const { repo, fetchRepo } = useRepo();

  return useCallback(async ({ oneliner, description } : { oneliner: string, description: string }) => {
    if (!repo) return;

    const result = await fetch(`https://pasha.npkn.net/blitz-issues/issues/${repo.nameWithOwner}`, {
      method: 'POST',
      body: JSON.stringify({
        mutation: 'propose',
        title: oneliner,
        body: description,
        repositoryId: repo.id,
        categoryId: (repo.discussionCategories.nodes.find(c => c.name === 'Ideas') ?? repo.discussionCategories.nodes[0]).id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json());

    await fetchRepo();
    return result
  }, [fetchRepo, repo])
}