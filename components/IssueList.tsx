import { useRepo } from "@/stores/repo";
import octokit from "@/utils/octokit";
import { useCallback } from "react";
import { useAsyncState } from '@/hooks/useAsyncState';
import { Issue } from "./Issue";

export function IssueList() {
  const repo = useRepo();
  const getIssues = useCallback(async () => {
    if (!repo) return [];

    const { data } = await octokit.rest.issues.listForRepo({
      owner: repo.owner.login,
      repo: repo.name,
      state: 'open',
    });

    return data;
  }, [repo]);
  const [issues, setState, loading, error] = useAsyncState(getIssues);

  if (!issues || loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }
  return (
    <div className='flex flex-col gap-5'>
      {issues.map((issue) => <Issue key={issue.id} issue={issue} />)}
    </div>
  )
}
