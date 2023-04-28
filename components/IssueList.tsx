import { useRepo } from "@/stores/repo";
import { Issue } from "./Issue";

type Issue = {
  id: string;
  number: number;
  title: string;
}

export function IssueList() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2'>
      {repo.discussions.nodes.map((issue) => <Issue key={issue.number} issue={issue} />)}
    </div>
  )
}
