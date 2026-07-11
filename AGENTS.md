<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Concurrent sessions on this repo

Multiple Claude Code sessions may run against this project folder at the same
time. They share one git index, so `git add` from one session and `git add`
from another both land in the same staging area — whichever session commits
first sweeps in the other's staged files too, even under a message that
doesn't describe them.

Rules:

1. Before `git add`, run `git status --short`. Only stage the exact files
   your own task touched. Never `git add -A` or `git add .`.
2. If `git status --short` shows files staged (first column non-blank) that
   you did not just modify, another session has pending work in this folder.
   Do not commit them. Either wait, or `git reset <file>` to unstage them
   before your own commit — never absorb someone else's staged work into
   your commit.
3. For real parallel work — two sessions actively editing at the same time —
   isolate each session in its own git worktree instead of sharing this
   folder:

   ```
   git worktree add ../latino-carouge-basket-club-<task> -b <task-branch>
   ```

   Work, commit, and push the branch from there; merge/fast-forward into
   `master` instead of two folders committing straight to `master` at once.
   Remove the worktree when done:

   ```
   git worktree remove ../latino-carouge-basket-club-<task>
   ```
