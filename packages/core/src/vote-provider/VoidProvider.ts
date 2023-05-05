import { VoteProvider, Vote } from "./VoteProvider";

export class VoidProvider implements VoteProvider {
  constructor(readonly repo: string = 'void') {}

  async getVotes(): Promise<Vote[]> {
    return [];
  }

  async insertVote(vote: Vote): Promise<void> {
    // do nothing
  }
} 