import { useRepo, useMakeProposal } from "@theoberton/blitz-core";
import { Button } from "@/components/Button";
import { AskAiButton } from "@/components/askAiButton";

export function RepoTitle() {
  const makeProposal = useMakeProposal();
  const { repo } = useRepo();

  if (!repo) {
    return null;
  }

  const propose = async () => {
    const title = prompt("what's your idea?");
    if (!title) return;

    const result = await makeProposal({ oneliner: title, description: '.' })

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