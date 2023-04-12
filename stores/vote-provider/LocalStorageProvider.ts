import { VoteProvider, Vote } from "./VoteProvider";

export class LocalStorageProvider implements VoteProvider {
  key = 'votes';

  async getVotes(): Promise<Vote[]> {
    const votes = localStorage?.getItem(this.key);
    return votes ? JSON.parse(votes) : [];
  }

  async insertVote(vote: Vote): Promise<void> {
    const votes = await this.getVotes();
    votes.push(vote);
    localStorage?.setItem(this.key, JSON.stringify(votes));
  }
} 