import { Octokit } from "octokit";

const octokit = new Octokit({ 
  retry: { enabled: false }, // @todo: remove after solving the problem with 404 -> 403
  request: {
    cache: 'no-cache'
  }
 });

export default octokit;
