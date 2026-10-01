import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

const owner = process.env.GITHUB_REPO_OWNER || "";
const repo = process.env.GITHUB_REPO_NAME || "";

export async function getCatalogFile() {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: "data/catalog.json",
    });

    if (!Array.isArray(response.data) && response.data.type === "file") {
      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      return {
        sha: response.data.sha,
        content: JSON.parse(content),
      };
    }
  } catch (error: any) {
    // If file doesn't exist, return empty config. Real app would handle this better.
    if (error.status === 404) {
       return { sha: "", content: { products: [] } };
    }
    console.error("Error fetching catalog from GitHub:", error);
  }
  return null;
}

export async function updateCatalogFile(newContent: any, sha: string, commitMessage: string) {
  try {
    const encodedContent = Buffer.from(JSON.stringify(newContent, null, 2)).toString("base64");
    
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: "data/catalog.json",
      message: commitMessage,
      content: encodedContent,
      sha: sha !== "" ? sha : undefined,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating catalog to GitHub:", error);
    return { success: false, error };
  }
}
