const dir = Deno.cwd();

try {
  await new Deno.Command("git", {
    args: ["push"],
    cwd: dir,
  }).output();
  console.log("Changes pushed successfully.");
} catch {
  console.error("Failed to run git push.");
  Deno.exit(1);
}