const dir = Deno.cwd();

try {
    await new Deno.Command("git", {
        args: ["push", "origin", "main"],
        cwd: dir,
    }).output();
    console.log("Changes pushed to origin/main successfully.");
} catch {
    console.error("Failed to run git push to origin/main.");
    Deno.exit(1);
}
