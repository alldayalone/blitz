import { useRepo } from "@/stores/repo";
import Button from "@/components/Button";
import { AskAiButton } from "./askAiButton";

export function RepoTitle() {
  const repo = useRepo();

  if (!repo) {
    return null;
  }

  const propose = async () => {
    const mutation = "propose";
    const title = prompt("what's your idea?");
    if (!title) return;

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
    <div className="my-5 flex flex-wrap justify-end gap-4">
      <h1 className="order-1 basis-full xs:basis-1/2 flex-grow text-3xl">
        {repo.owner.login}/{repo.name}
      </h1>
      <Button className="order-3 xs:order-2" color="fancy" size="large" data-splitbee-event="propose" onClick={propose} target="_blank">
        propose
      </Button>
      

      <p className="order-2 xs:order-3 flex-grow text-muted">{repo.description}</p>

      <div className="order-4 flex-shrink-0 flex flex-wrap gap-4 w-full xs:w-auto">
        <Button as="a" data-splitbee-event="sponsor" href={`https://github.com/sponsors/${repo.owner.login}`} target="_blank">
          ❤️ sponsor
        </Button>
        <AskAiButton />
        
      </div>
    </div>
  );  
}