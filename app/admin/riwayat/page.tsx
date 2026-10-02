import { Octokit } from "@octokit/rest";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Clock } from "lucide-react";

export const revalidate = 0;

export default async function AdminRiwayatPage() {
  let commits: { sha: string; message: string; date: string; author: string }[] = [];

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
    const owner = process.env.GITHUB_REPO_OWNER || "";
    const repo = process.env.GITHUB_REPO_NAME || "";

    const response = await octokit.repos.listCommits({
      owner,
      repo,
      path: "data/catalog.json",
      per_page: 30,
    });

    commits = response.data.map((c) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      date: c.commit.committer?.date || c.commit.author?.date || "",
      author: c.commit.author?.name || "Unknown",
    }));
  } catch (error) {
    console.error("Failed to fetch commits:", error);
  }

  const getActionBadge = (message: string) => {
    if (message.startsWith("Add")) return <Badge className="bg-emerald-500 hover:bg-emerald-600">Tambah</Badge>;
    if (message.startsWith("Update")) return <Badge className="bg-blue-500 hover:bg-blue-600">Edit</Badge>;
    if (message.startsWith("Delete")) return <Badge className="bg-red-500 hover:bg-red-600">Hapus</Badge>;
    return <Badge variant="secondary">Lainnya</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Perubahan</h1>
        <p className="text-muted-foreground mt-1">
          Log perubahan data catalog.json dari GitHub. Menampilkan {commits.length} commit terakhir.
        </p>
      </div>

      {commits.length === 0 ? (
        <div className="border rounded-md bg-card p-8 text-center text-muted-foreground">
          <p>Belum ada riwayat perubahan. Perubahan akan muncul setelah Anda menambah/mengedit produk dari Admin.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {commits.map((commit, i) => (
                <div key={commit.sha + i} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full shrink-0">
                    <GitCommit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{commit.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(commit.date).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">{commit.sha}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {getActionBadge(commit.message)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
