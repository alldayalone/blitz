import { useRepo } from "@/stores/repo";

export function RepoTitle() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  return (
    <div className="my-5">
      <h1>
        {repo.owner.login}/{repo.name}
      </h1>
      <p>{repo.description}</p>
    </div>
  );  
}