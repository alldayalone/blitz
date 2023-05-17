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
    <div className="my-5 flex flex-col justify-end gap-4">
      <h1 className="text-3xl">
        {repo.owner.login}/{repo.name}
      </h1>
      <p className="text-muted">{repo.description}</p>
      <Button className="xs:self-end" color="fancy" size="large" data-splitbee-event="propose" onClick={propose} target="_blank">
        propose
      </Button>
      {/* <div className="order-4 flex-shrink-0 flex flex-wrap gap-4 w-full xs:w-auto">
        <Button as="a" data-splitbee-event="sponsor" href={`https://github.com/sponsors/${repo.owner.login}`} target="_blank">
          ❤️ sponsor
        </Button>
        <AskAiButton />
        
      </div> */}
    </div>
  );  
}