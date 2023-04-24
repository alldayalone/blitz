import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import splitbee from '@splitbee/web';
import octokit from '@/utils/octokit';

export type Repo = GetResponseDataTypeFromEndpointMethod<typeof octokit.rest.repos.get> | null;

const RepoContext = createContext<Repo>(null);

export const useRepo = () => {
  return useContext(RepoContext);
}

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [repo, setRepo] = useState<Repo>(null);

  useEffect(() => {
    async function fetchRepo() {
      if (router.query.repo && !Array.isArray(router.query.repo)) {
        const res = await octokit.rest.repos.get({
          owner: router.query.repo.split('/')[0],
          repo: router.query.repo.split('/')[1],
        });

        setRepo(res.data);
        splitbee.track('repo', { repo: res.data?.full_name });
      } else {
        setRepo(null);
      }
    }

    fetchRepo();   
  }, [router.query.repo]);

  return (
    <RepoContext.Provider value={repo}>
      {children}
    </RepoContext.Provider>
  );
}
