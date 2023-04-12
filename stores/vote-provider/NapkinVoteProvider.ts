import { VoteProvider, Vote } from "./VoteProvider";

export class NapkinVoteProvider implements VoteProvider {
  url = 'https://pasha.npkn.net/dao-store/';

  async getVotes(): Promise<Vote[]> {
    return fetch(this.url).then(res => res.json()).then(votes => votes.filter(Boolean));
  }

  async insertVote(vote: Vote): Promise<void> {
    await fetch(this.url, {
      method: 'POST', 
      body: JSON.stringify(vote), 
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}