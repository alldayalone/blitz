import { IssueList } from "@/components/IssueList";
import { RepoTitle } from "@/components/RepoTitle";
import { DaoStateProvider } from "@/stores/daoState";
import { RepoProvider} from "@/stores/repo";

export const Roadmap: React.FC<{ repoName: string }> = ({ repoName }) => {
  return (
    <RepoProvider repoName={repoName}>
      <DaoStateProvider>
        <RepoTitle />
        <IssueList />
      </DaoStateProvider>
    </RepoProvider>
  );
}