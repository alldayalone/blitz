import { IssueList } from "@/components/IssueList";
import { RepoTitle } from "@/components/RepoTitle";
import { DaoStateProvider } from "@/stores/daoState";
import { RepoProvider, useRepo} from "@/stores/repo";
import { DVDLogoLoader } from "./DVDLogoLoader";
import { useEffect, useState } from "react";

const Internal = () => {
  const repo = useRepo();
  const [isReady, setReady] = useState(false);


  useEffect(() => {
    setTimeout(() => setReady(true), 1500);
  }, [setReady])

  if (!isReady || !repo) {
    return <DVDLogoLoader />
  }

  return (
    <>
      <RepoTitle />
      <IssueList />
    </>
  )
}

export const Roadmap: React.FC<{ repoName: string }> = ({ repoName }) => {
  return (
    <RepoProvider repoName={repoName}>
      <DaoStateProvider>
        <Internal />
      </DaoStateProvider>
    </RepoProvider>
  );
}