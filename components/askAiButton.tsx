import { useRepo } from "@/stores/repo";
import octokit from "@/utils/octokit";
import { useCallback, useState } from "react"
import styles from './askAiButton.module.css';

export function AskAiButton() {
  const repo = useRepo();

  const [isLoading, setIsLoading] = useState(false);

  const onClickHandler = useCallback(async () => {
    if (!repo) return;

    setIsLoading(true);
    try {
      const readme = await fetch(`https://raw.githubusercontent.com/${repo.full_name}/main/README.md`).then(res => res.text());
      const issues = await octokit.rest.issues.listForRepo({
        owner: repo.owner.login,
        repo: repo.name,
        state: 'open',
      });
      const roadmap = issues.data.map((issue) => '#' + issue.number + ' ' + issue.title).join('\n');

      const res = await fetch('https://pasha.npkn.net/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoName: repo.name,
          repoHeadline: repo.description,
          repoDescription: readme,
          roadmap,        
        }),
      });

     
      const data = await res.json();

      if (!res.ok) {
        throw new Error('Failed to fetch: ' + JSON.stringify(data));
      }

      alert(data.suggestions);
    } catch (error) {
      alert('ERROR\n' + error);
    } 
    
    setIsLoading(false);
  }, [repo]);

  return (
    <button disabled={isLoading} className={`${styles.btn}`} onClick={onClickHandler}>ask ai{isLoading ? ' ...' : ''}</button>
  )
}