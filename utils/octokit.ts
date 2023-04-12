import { Octokit } from "octokit";

const octokit = new Octokit({ 
  retry: { enabled: false } // @todo: remove after solving the problem with 404 -> 403
 });

export default octokit;
