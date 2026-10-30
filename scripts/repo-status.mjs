import { execFileSync } from "node:child_process";

const verifyRemote = process.argv.includes("--verify-remote");
const asJson = process.argv.includes("--json");
let directory = process.cwd();

function git(args, optional = false) {
  try {
    return execFileSync("git", args, {
      cwd: directory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 20000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never" },
    }).trimEnd();
  } catch (error) {
    if (optional) return null;
    throw error;
  }
}

try {
  directory = git(["rev-parse", "--show-toplevel"]);
  const branch = git(["symbolic-ref", "--quiet", "--short", "HEAD"], true);
  const head = git(["rev-parse", "--verify", "HEAD"], true);
  const porcelain = git(["status", "--porcelain=v1", "--untracked-files=normal"]);
  const changes = porcelain ? porcelain.split("\n") : [];
  const ref = branch ? `refs/heads/${branch}` : null;
  const remote = ref ? git(["for-each-ref", "--format=%(upstream:remotename)", ref]) : "";
  const remoteRef = ref ? git(["for-each-ref", "--format=%(upstream:remoteref)", ref]) : "";
  const cached = head && remote ? git(["rev-list", "--left-right", "--count", "HEAD...@{upstream}"], true) : null;
  const counts = cached?.split(/\s+/).map(Number);
  let remoteSha = null;
  let remoteStatus = "not_checked";

  if (verifyRemote) {
    if (!branch || !head || !remote || remote === "." || !remoteRef) {
      remoteStatus = "no_remote_upstream";
    } else {
      const result = git(["ls-remote", "--exit-code", "--", remote, remoteRef], true);
      const entry = result?.split("\n").find(line => line.split("\t")[1] === remoteRef);
      const sha = entry?.split("\t")[0];
      if (sha && /^[a-f0-9]{40,64}$/.test(sha)) {
        remoteSha = sha;
        remoteStatus = sha === head ? "matches_head" : "differs_from_head";
      } else {
        remoteStatus = "unconfirmed";
      }
    }
  }

  const result = {
    checkedAt: new Date().toISOString(),
    branch,
    head,
    changes,
    cachedTracking: counts ? { ahead: counts[0], behind: counts[1] } : null,
    upstream: remote && remoteRef ? { remote, ref: remoteRef } : null,
    remoteStatus,
    remoteSha,
    currentBranchSynced: changes.length === 0 && remoteStatus === "matches_head",
    scope: "当前分支磁盘上的 Git 内容；不检测编辑器未保存缓冲区，不含忽略资料、其他分支、外部配置或恢复演练。",
  };

  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`分支：${branch ?? "detached HEAD"}`);
    console.log(`本地提交：${head ?? "尚无提交"}`);
    console.log(`未提交：${changes.length ? `${changes.length} 条状态记录` : "无"}`);
    for (const change of changes.slice(0, 15)) console.log(`  ${change}`);
    if (changes.length > 15) console.log("  其余文件请用 git status 查看。");
    if (result.cachedTracking) {
      console.log(`本地缓存：ahead ${counts[0]} / behind ${counts[1]}（不能证明实时远端状态）`);
    }
    if (!verifyRemote) {
      console.log("远端：未查询；执行 npm run repo:check 进行实时核验。");
    } else {
      const labels = {
        matches_head: "远端提交与 HEAD 一致",
        differs_from_head: "远端提交与 HEAD 不同，尚未确认同步",
        no_remote_upstream: "没有可核验的远端上游分支",
        unconfirmed: "查询失败或目标分支不存在，未确认",
      };
      console.log(`远端：${labels[remoteStatus]}`);
      if (result.upstream) console.log(`目标：${remote} ${remoteRef}`);
      if (remoteSha) console.log(`远端提交：${remoteSha}`);
      console.log(`结论：${result.currentBranchSynced ? "当前分支已同步并核验" : "未达到当前分支同步条件"}`);
    }
    console.log(`范围：${result.scope}`);
  }
  if (verifyRemote && !result.currentBranchSynced) process.exitCode = 1;
} catch {
  const message = "无法读取仓库状态，未确认同步；请在项目仓库内检查 Git 是否可用。";
  console.log(asJson ? JSON.stringify({ error: message, currentBranchSynced: false }) : message);
  process.exitCode = 2;
}
