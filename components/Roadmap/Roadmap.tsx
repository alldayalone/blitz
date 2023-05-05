import { IssueList } from "@/components/IssueList";
import { RepoTitle } from "@/components/RepoTitle";
import { DVDLogoLoader } from "@/components/DVDLogoLoader";
import { DaoStateProvider, RepoProvider, useRepo } from "@theoberton/blitz-core";
import { useEffect, useState } from "react";

const Internal = () => {
  const { repo } = useRepo();
  const [isReady, setReady] = useState(false);


  useEffect(() => {
    setTimeout(() => setReady(true), 1500);
  }, [setReady])

  if (!isReady || !repo) {
    return <DVDLogoLoader />
  }

  return (
    <div className="bg-dark-blue">
      <RepoTitle />
      <IssueList />
    </div>
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