import { useRepo } from "@/stores/repo";
import { AskAiButton } from "./askAiButton";
import Button from "@/components/Button";

export function RepoTitle() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  const propose = async () => {
    const mutation = "propose";
    const title = prompt("what's your idea?");
    const body = title;
    const repositoryId = repo.id;
    const categoryId = (repo.discussionCategories.nodes.find(c => c.name === 'Ideas') ?? repo.discussionCategories.nodes[0]).id;

    const result = await fetch(`https://pasha.npkn.net/blitz-issues/${repo.nameWithOwner}`, {
      method: 'POST',
      body: JSON.stringify({ mutation, title, body, repositoryId, categoryId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json());

    alert("yep, i see. lemme put it in the roadmap")
    console.log(result);
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
          <Button data-splitbee-event="propose" onClick={propose} target="_blank">
            propose
          </Button>
      </div>
       
       
      </div>
    </div>
  );  
}