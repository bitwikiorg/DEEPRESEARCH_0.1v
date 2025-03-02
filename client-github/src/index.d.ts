import { type AgentRuntime, type Client } from "@elizaos/core";
export interface GitHubConfig {
    owner: string;
    repo: string;
    branch?: string;
    path?: string;
    token: string;
}
export declare class GitHubClient {
    private octokit;
    private git;
    private config;
    private runtime;
    private repoPath;
    constructor(runtime: AgentRuntime);
    initialize(): Promise<void>;
    private cloneRepository;
    createMemoriesFromFiles(): Promise<void>;
    createPullRequest(title: string, branch: string, files: Array<{
        path: string;
        content: string;
    }>, description?: string): Promise<{
        url: string;
        id: number;
        node_id: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
        issue_url: string;
        commits_url: string;
        review_comments_url: string;
        review_comment_url: string;
        comments_url: string;
        statuses_url: string;
        number: number;
        state: "open" | "closed";
        locked: boolean;
        title: string;
        user: import("@octokit/openapi-types").components["schemas"]["simple-user"];
        body: string | null;
        labels: {
            id: number;
            node_id: string;
            url: string;
            name: string;
            description: string | null;
            color: string;
            default: boolean;
        }[];
        milestone: import("@octokit/openapi-types").components["schemas"]["nullable-milestone"];
        active_lock_reason?: string | null;
        created_at: string;
        updated_at: string;
        closed_at: string | null;
        merged_at: string | null;
        merge_commit_sha: string | null;
        assignee: import("@octokit/openapi-types").components["schemas"]["nullable-simple-user"];
        assignees?: import("@octokit/openapi-types").components["schemas"]["simple-user"][] | null;
        requested_reviewers?: import("@octokit/openapi-types").components["schemas"]["simple-user"][] | null;
        requested_teams?: import("@octokit/openapi-types").components["schemas"]["team-simple"][] | null;
        head: {
            label: string;
            ref: string;
            repo: import("@octokit/openapi-types").components["schemas"]["repository"];
            sha: string;
            user: import("@octokit/openapi-types").components["schemas"]["simple-user"];
        };
        base: {
            label: string;
            ref: string;
            repo: import("@octokit/openapi-types").components["schemas"]["repository"];
            sha: string;
            user: import("@octokit/openapi-types").components["schemas"]["simple-user"];
        };
        _links: {
            comments: import("@octokit/openapi-types").components["schemas"]["link"];
            commits: import("@octokit/openapi-types").components["schemas"]["link"];
            statuses: import("@octokit/openapi-types").components["schemas"]["link"];
            html: import("@octokit/openapi-types").components["schemas"]["link"];
            issue: import("@octokit/openapi-types").components["schemas"]["link"];
            review_comments: import("@octokit/openapi-types").components["schemas"]["link"];
            review_comment: import("@octokit/openapi-types").components["schemas"]["link"];
            self: import("@octokit/openapi-types").components["schemas"]["link"];
        };
        author_association: import("@octokit/openapi-types").components["schemas"]["author-association"];
        auto_merge: import("@octokit/openapi-types").components["schemas"]["auto-merge"];
        draft?: boolean;
        merged: boolean;
        mergeable: boolean | null;
        rebaseable?: boolean | null;
        mergeable_state: string;
        merged_by: import("@octokit/openapi-types").components["schemas"]["nullable-simple-user"];
        comments: number;
        review_comments: number;
        maintainer_can_modify: boolean;
        commits: number;
        additions: number;
        deletions: number;
        changed_files: number;
    }>;
    createCommit(message: string, files: Array<{
        path: string;
        content: string;
    }>): Promise<void>;
}
export declare const GitHubClientInterface: Client;
export default GitHubClientInterface;
//# sourceMappingURL=index.d.ts.map