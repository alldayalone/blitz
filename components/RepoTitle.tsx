import { useRepo } from "@/stores/repo";
import { AskAiButton } from "./askAiButton";
import Button from "@/components/Button";

export function RepoTitle() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  return (
    <div className="my-5">
      <div className="flex items-start mb-4">
        <h1 className="flex-grow text-3xl">
          {repo.owner.login}/{repo.name}
        </h1>
        <AskAiButton />
      </div>
     
      <div className="flex items-end gap-3">
        <p className="flex-grow text-muted">{repo.description}</p>
        <div className="flex-shrink-0">
          <Button as="a" data-splitbee-event="sponsor" href={`https://github.com/sponsors/${repo.owner.login}`} target="_blank">
            ❤️ sponsor
          </Button>
        </div>

        <div className="flex-shrink-0">
          <Button as="a" data-splitbee-event="propose" href={`https://github.com/${repo.owner.login}/${repo.name}/issues/new`} target="_blank">
            propose
          </Button>
      </div>
       
       
      </div>
    </div>
  );  
}