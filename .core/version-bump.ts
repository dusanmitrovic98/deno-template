import { parse } from "https://deno.land/std@0.208.0/semver/mod.ts";
import { dirname, fromFileUrl, join } from "https://deno.land/std@0.208.0/path/mod.ts";

type BumpType = "major" | "minor" | "patch" | "rollback";

interface VersionHistory {
  current: string;
  previous: string[];
}

const scriptDir = dirname(fromFileUrl(import.meta.url));
const projectRoot = join(scriptDir, "..");

const VERSION_HISTORY_FILE = join(projectRoot, "version-history.json");
const DENO_JSON_PATH = join(projectRoot, "deno.json");
const CHANGELOG_PATH = join(projectRoot, "CHANGELOG.md");

const MAX_HISTORY = 5;

async function readJsonFile(path: string) {
  try {
    const content = await Deno.readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    if (error instanceof SyntaxError) {
      return null;
    }
    console.error(`Error reading file ${path}:`, error);
    throw error;
  }
}

async function writeJsonFile(path: string, content: unknown) {
  try {
    await Deno.writeTextFile(path, JSON.stringify(content, null, 2) + "\n");
  } catch (error) {
    console.error(`Error writing file ${path}:`, error);
    throw error;
  }
}

async function initVersionHistory(): Promise<VersionHistory> {
  const denoJson = await readJsonFile(DENO_JSON_PATH);
  if (!denoJson) {
    throw new Error("deno.json not found");
  }
  
  if (!denoJson.version) {
    denoJson.version = "0.1.0";
    await writeJsonFile(DENO_JSON_PATH, denoJson);
  }
  
  const initialHistory: VersionHistory = {
    current: denoJson.version,
    previous: [],
  };
  
  await writeJsonFile(VERSION_HISTORY_FILE, initialHistory);
  return initialHistory;
}

async function getVersionHistory(): Promise<VersionHistory> {
  const history = await readJsonFile(VERSION_HISTORY_FILE);
  if (!history) {
    return await initVersionHistory();
  }
  return history;
}

async function updateVersionHistory(newVersion: string) {
  const history = await getVersionHistory();
  const updatedHistory: VersionHistory = {
    current: newVersion,
    previous: [history.current, ...history.previous].slice(0, MAX_HISTORY),
  };
  await writeJsonFile(VERSION_HISTORY_FILE, updatedHistory);
}

function bumpVersion(currentVersion: string, bumpType: BumpType): string {
  const version = parse(currentVersion);
  if (!version) throw new Error(`Invalid version: ${currentVersion}`);

  switch (bumpType) {
    case "major":
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case "minor":
      version.minor++;
      version.patch = 0;
      break;
    case "patch":
      version.patch++;
      break;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

async function rollbackVersion(): Promise<string> {
  const history = await getVersionHistory();
  if (history.previous.length === 0) {
    throw new Error("No previous version found to rollback to");
  }

  const newVersion = history.previous[0];
  const updatedHistory: VersionHistory = {
    current: newVersion,
    previous: history.previous.slice(1),
  };

  await writeJsonFile(VERSION_HISTORY_FILE, updatedHistory);
  return newVersion;
}

function parseChangelog(content: string): { unreleased: string; versions: { version: string; date: string; content: string }[] } {
  const lines = content.split('\n');
  let unreleased = '';
  const versions: { version: string; date: string; content: string }[] = [];
  let currentVersion: { version: string; date: string; content: string } | null = null;

  for (const line of lines) {
    if (line.startsWith('## [Unreleased]')) {
      unreleased = '## [Unreleased]\n';
    } else if (line.match(/^## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}/)) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      const [, version, date] = line.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/) || [];
      currentVersion = { version, date, content: line + '\n' };
    } else if (currentVersion && line.trim() !== '') {
      currentVersion.content += line + '\n';
    } else if (unreleased && line.trim() !== '') {
      unreleased += line + '\n';
    }
  }

  if (currentVersion) {
    versions.push(currentVersion);
  }

  return { unreleased, versions };
}

async function updateChangelog(newVersion: string, bumpType: BumpType, changeDescription: string) {
  let changelog = await Deno.readTextFile(CHANGELOG_PATH).catch(() => "# Changelog\n\n## [Unreleased]\n");
  
  const { unreleased, versions } = parseChangelog(changelog);
  
  const today = new Date().toISOString().split('T')[0];
  let newEntry = `## [${newVersion}] - ${today}\n`;
  
  if (bumpType !== "rollback") {
    newEntry += `### ${bumpType.charAt(0).toUpperCase() + bumpType.slice(1)}\n- ${changeDescription}\n`;
  } else {
    newEntry += `### Rollback\n- ${changeDescription}\n`;
  }
  
  const updatedChangelog = `# Changelog\n\n## [Unreleased]\n\n${newEntry.trim()}\n\n${versions.map(v => v.content.trim()).join('\n\n')}\n`;
  
  await Deno.writeTextFile(CHANGELOG_PATH, updatedChangelog);
}

async function gitCommand(args: string[], cwd: string): Promise<string> {
  const process = new Deno.Command("git", {
    args,
    cwd,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await process.output();
  if (code !== 0) {
    throw new Error(`Git command failed: git ${args.join(" ")}\n${new TextDecoder().decode(stderr)}`);
  }
  return new TextDecoder().decode(stdout).trim();
}

async function getCommitHashForVersion(version: string): Promise<string> {
  try {
    return await gitCommand(["rev-list", "-n", "1", `v${version}`], projectRoot);
  } catch (error) {
    console.error(`No tag found for version ${version}. Searching commit history...`);
    const commitMsg = `v${version}`;
    const result = await gitCommand(["log", "--grep", commitMsg, "--format=%H"], projectRoot);
    if (!result) {
      throw new Error(`Unable to find a commit for version ${version}`);
    }
    return result.split("\n")[0]; // Get the first matching commit
  }
}

async function rollbackGitHub(currentVersion: string, previousVersion: string): Promise<void> {
  try {
    const commitHash = await getCommitHashForVersion(previousVersion);
    console.log(`Rolling back to commit: ${commitHash}`);

    // Revert the repository to the previous version
    await gitCommand(["reset", "--hard", commitHash], projectRoot);
    console.log(`Repository reverted to v${previousVersion}`);

    // Update CHANGELOG.md locally
    const changeDescription = `Rolled back from v${currentVersion} to v${previousVersion}`;
    await updateChangelog(previousVersion, "rollback", changeDescription);

    // Commit the updated CHANGELOG.md
    await gitCommand(["add", "CHANGELOG.md"], projectRoot);
    await gitCommand(["commit", "-m", `Rollback v${currentVersion} to v${previousVersion}`], projectRoot);

    // Push the changes to GitHub
    await gitCommand(["push", "-f", "origin", "main"], projectRoot);
    console.log("Changes pushed to GitHub successfully");
  } catch (error) {
    console.error("Error during GitHub rollback:", error.message);
    throw error;
  }
}

async function updateVersion(bumpType: BumpType) {
  const denoJson = await readJsonFile(DENO_JSON_PATH);
  
  if (!denoJson) {
    throw new Error("deno.json not found");
  }
  
  if (!denoJson.version) {
    denoJson.version = "0.1.0";
  }

  const currentVersion = denoJson.version;
  let newVersion: string;
  let changeDescription: string;
  
  if (bumpType === "rollback") {
    const history = await getVersionHistory();
    if (history.previous.length === 0) {
      throw new Error("No previous version found to rollback to");
    }
    newVersion = history.previous[0];
    changeDescription = `Reverted to version ${newVersion}`;
    await rollbackGitHub(currentVersion, newVersion);
    
    // Update version history after successful rollback
    const updatedHistory: VersionHistory = {
      current: newVersion,
      previous: history.previous.slice(1),
    };
    await writeJsonFile(VERSION_HISTORY_FILE, updatedHistory);
    
    // Update deno.json with the rolled back version
    denoJson.version = newVersion;
    await writeJsonFile(DENO_JSON_PATH, denoJson);
  } else {
    newVersion = bumpVersion(currentVersion, bumpType);
    changeDescription = `Updated ${bumpType} version from ${currentVersion} to ${newVersion}`;
    
    denoJson.version = newVersion;
    await writeJsonFile(DENO_JSON_PATH, denoJson);
    await updateVersionHistory(newVersion);
    await updateChangelog(newVersion, bumpType, changeDescription);
    
    console.log(`Version bumped to ${newVersion}`);
  }
}

if (import.meta.main) {
  const bumpType = Deno.args[0] as BumpType;
  
  if (!["major", "minor", "patch", "rollback"].includes(bumpType)) {
    console.error("Please specify: major, minor, patch, or rollback");
    Deno.exit(1);
  }

  try {
    await updateVersion(bumpType);
  } catch (error) {
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

export { updateVersion };