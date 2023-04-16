import { useRepo } from "@/stores/repo";

export function RepoTitle() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  return (
    <div className="my-5">
      <h1 className="text-3xl">
        {repo.owner.login}/{repo.name}
      </h1>
      <div className="flex justify-between items-end">
        <p>{repo.description}</p>
        <a className="bg-white p-2" href={`https://github.com/${repo.owner.login}/${repo.name}/issues/new`} target="_blank">Propose</a>
      </div>
    </div>
  );  
}