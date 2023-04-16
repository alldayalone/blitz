import { useRepo } from "@/stores/repo";
import octokit from "@/utils/octokit";
import { useCallback } from "react";
import { Issue } from "./Issue";
import { useQuery } from "react-query";

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

  const query = useQuery('issues', getIssues)

  if (!query.data || query.isLoading) {
    return <p>Loading...</p>
  }

  if (query.isError) {
    return <p>{query.error as string}</p>
  }
  return (
    <div className='flex flex-col gap-5'>
      {query.data.map((issue) => <Issue key={issue.id} issue={issue} />)}
    </div>
  )
}
