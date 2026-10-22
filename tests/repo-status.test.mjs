import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("../scripts/repo-status.mjs", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "wiv-repo-check-"));
  const remote = join(root, "remote.git");
  const work = join(root, "work");
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (args) => execFileSync("git", ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", ...args], {
    cwd: work, stdio: "pipe", encoding: "utf8",
  }).trim();
  execFileSync("git", ["init", "--bare", "--initial-branch=main", remote], { stdio: "pipe" });
  execFileSync("git", ["init", "--initial-branch=main", work], { stdio: "pipe" });
  git(["commit", "--allow-empty", "-m", "fixture initial"]);
  git(["remote", "add", "origin", remote]);
  git(["push", "--set-upstream", "origin", "main"]);
  const check = (...args) => {
    const run = spawnSync(process.execPath, [script, ...args, "--json"], { cwd: work, encoding: "utf8" });
    assert.equal(run.error, undefined);
    return { code: run.status, data: JSON.parse(run.stdout) };
  };
  return { root, work, git, check };
}

test("remote match and clean tree pass without changing repository state", t => {
  const { git, check } = fixture(t);
  const before = [git(["rev-parse", "HEAD"]), git(["status", "--porcelain=v1"]), git(["reflog", "--format=%H"])];
  const result = check("--verify-remote");
  assert.equal(result.code, 0);
  assert.equal(result.data.currentBranchSynced, true);
  assert.equal(result.data.head, result.data.remoteSha);
  assert.deepEqual([git(["rev-parse", "HEAD"]), git(["status", "--porcelain=v1"]), git(["reflog", "--format=%H"])], before);
});

test("untracked work prevents success even when HEAD is on remote", t => {
  const { work, check } = fixture(t);
  writeFileSync(join(work, "uncommitted.txt"), "work not committed");
  const result = check("--verify-remote");
  assert.equal(result.code, 1);
  assert.equal(result.data.remoteStatus, "matches_head");
  assert.equal(result.data.currentBranchSynced, false);
  assert.ok(result.data.changes.some(line => line.includes("uncommitted.txt")));
});

test("clean tree with an unpushed commit fails remote verification", t => {
  const { git, check } = fixture(t);
  git(["commit", "--allow-empty", "-m", "not pushed"]);
  const result = check("--verify-remote");
  assert.equal(result.code, 1);
  assert.deepEqual(result.data.changes, []);
  assert.equal(result.data.remoteStatus, "differs_from_head");
  assert.equal(result.data.currentBranchSynced, false);
});

test("remote lookup failure cannot be mistaken for cached synchronization", t => {
  const { root, git, check } = fixture(t);
  git(["remote", "set-url", "origin", join(root, "missing.git")]);
  const result = check("--verify-remote");
  assert.equal(result.code, 1);
  assert.deepEqual(result.data.cachedTracking, { ahead: 0, behind: 0 });
  assert.equal(result.data.remoteStatus, "unconfirmed");
  assert.equal(result.data.currentBranchSynced, false);
});

test("offline status and missing upstream never claim remote verification", t => {
  const { git, check } = fixture(t);
  assert.equal(check().data.currentBranchSynced, false);
  assert.equal(check().data.remoteStatus, "not_checked");
  git(["branch", "--unset-upstream"]);
  const result = check("--verify-remote");
  assert.equal(result.code, 1);
  assert.equal(result.data.remoteStatus, "no_remote_upstream");
});
