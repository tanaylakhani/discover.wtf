import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const url = request?.nextUrl?.searchParams.get("url") as string;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Query must be a non-empty string" },
        { status: 400 }
      );
    }

    return new Promise<NextResponse>((resolve, reject) => {
      // Spawn crawl4ai process safely
      const child = spawn("crwl", [url, "-o", "markdown"], {
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        shell: true, // sometimes helps with Windows paths
      });

      let output = "";
      let errors = "";

      child.stdout.on("data", (data) => {
        output += data.toString();
        // console.log({ data: data.toString() });
      });

      child.stderr.on("data", (data) => {
        // errors += data.toString();
        console.log({ data: data.toString() });
      });

      child.on("error", (err) => {
        console.error("Failed to start CWLI:", err);
        reject(
          NextResponse.json(
            { error: `Failed to start CLI: ${err.message}` },
            { status: 500 }
          )
        );
      });

      child.on("close", (code) => {
        if (code !== 0) {
          console.error("CLI exited with code", code, "stderr:", errors);
          return resolve(
            NextResponse.json(
              { error: errors || `CLI exited with code ${code}` },
              { status: 500 }
            )
          );
        }

        resolve(NextResponse.json({ output }, { status: 200 }));
      });
    });
  } catch (err) {
    // console.error("Unexpected error in API route:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
