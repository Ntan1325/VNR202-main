import packageJson from "../../package.json";

export interface SystemInfo {
  groqModel: string;
  boltVersion: string;
  activeTools: string[];
  supabaseVersion: string;
  reactVersion: string;
  viteVersion: string;
  serverStatus: string;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const supabaseVersion =
    packageJson.dependencies["@supabase/supabase-js"]?.replace("^", "") || "2.57.4";
  const reactVersion = packageJson.dependencies["react"]?.replace("^", "") || "18.3.1";
  const viteVersion = packageJson.devDependencies["vite"]?.replace("^", "") || "5.4.2";

  const activeTools = [
    "Supabase",
    "React",
    "Vite",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "React Router",
    "i18next",
    "Groq API",
    "React Markdown",
  ];

  return {
    groqModel: "Groq llama-3.3-70b-versatile",
    boltVersion: "1.0.0",
    activeTools,
    supabaseVersion,
    reactVersion,
    viteVersion,
    serverStatus: "Active until February 2026",
  };
}
