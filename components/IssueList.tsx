import { useBlitzId, useRepo } from "@theoberton/blitz-core";
import { Issue } from "./Issue";

type Issue = {
  id: string;
  number: number;
  title: string;
}

export function IssueList() {
  const { repo } = useRepo();
  const blitzId = useBlitzId();

  if (!repo) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2'>
      {repo.discussions.nodes.map((issue) => <Issue key={issue.number} userId={blitzId} issue={issue} />)}
    </div>
  )
}
