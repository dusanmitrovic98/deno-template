const dir = Deno.cwd();
const commitMessage = "update";

try {
  const status = await new Deno.Command("git", {
    args: ["status", "--porcelain"],
    cwd: dir,
  }).output();
  const statusString = new TextDecoder().decode(status.stdout);
  if (statusString.length === 0) {
    console.log("Nothing to commit.");
    Deno.exit(0);
  }
} catch {
  console.error("Failed to run git status.");
  Deno.exit(1);
}

try {
  await new Deno.Command("git", {
    args: ["add", "."],
    cwd: dir,
  }).output();
} catch {
  console.error("Failed to run git add.");
  Deno.exit(1);
}

try {
  await new Deno.Command("git", {
    args: ["commit", "-m", commitMessage],
    cwd: dir,
  }).output();
  console.log("Changes committed successfully.");
} catch {
  console.error("Failed to run git commit.");
  Deno.exit(1);
}