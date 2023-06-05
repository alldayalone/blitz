import { VoteProvider, Vote } from "./VoteProvider";

export class MongoVoteProvider implements VoteProvider {
  url: URL;

  constructor(readonly repo: string) {
    this.url = new URL('https://pasha.npkn.net/blitz-store/');
    this.url.searchParams.append('repo', repo);
  }

  async getVotes(): Promise<Vote[]> {
    try {
      const res = await fetch(this.url.toString());
      const votes = await res.json();
      
      if (!votes || !Array.isArray(votes)) throw new Error('Invalid response');
      
      return votes.filter(Boolean);
    } catch (error) {
      console.error(error);

      return [];
    }
  }

  async insertVote(vote: Vote): Promise<void> {
    await fetch(this.url.toString(), {
      method: 'POST', 
      body: JSON.stringify(vote), 
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}