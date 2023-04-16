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
      <div className="flex items-end gap-3">
        <p className="flex-grow">{repo.description}</p>
        <a className="bg-white p-2" data-splitbee-event="Sponsor" href={`https://github.com/sponsors/${repo.owner.login}`} target="_blank">
          ❤️ Sponsor
        </a>
        <a className="bg-white p-2" data-splitbee-event="Propose" href={`https://github.com/${repo.owner.login}/${repo.name}/issues/new`} target="_blank">Propose</a>
      </div>
    </div>
  );  
}