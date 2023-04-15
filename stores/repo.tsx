import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const RepoContext = createContext<string>('');

export const useRepo = () => {
  return useContext(RepoContext);
}

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [repo, setRepo] = useState<string>('');

  useEffect(() => {
    if (router.query.repo && !Array.isArray(router.query.repo)) {
      setRepo(router.query.repo);
    } else {
      setRepo('theoberton/blitz');
    }
  }, [router.query.repo]);

  return (
    <RepoContext.Provider value={repo}>
      {children}
    </RepoContext.Provider>
  );
}
