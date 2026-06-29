"use client";

import Image from "next/image";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Divider,
  Link,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

const LICENSES = [
  { name: "Next.js", license: "MIT", url: "https://nextjs.org" },
  { name: "React", license: "MIT", url: "https://react.dev" },
  { name: "Firebase", license: "Apache 2.0", url: "https://firebase.google.com" },
  { name: "MUI", license: "MIT", url: "https://mui.com" },
  { name: "Zustand", license: "MIT", url: "https://zustand-demo.pmnd.rs" },
  { name: "Leaflet / React-Leaflet", license: "BSD 2-Clause", url: "https://leafletjs.com" },
  { name: "Framer Motion", license: "MIT", url: "https://www.framer.com/motion" },
  { name: "hCaptcha React", license: "MIT", url: "https://www.hcaptcha.com" },
  { name: "Tailwind CSS", license: "MIT", url: "https://tailwindcss.com" },
];

interface ChangelogEntry {
  version: string;
  date: string;
  url: string;
  features: string[];
  fixes: string[];
}

function parseChangelog(raw: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const versionRe = /^#\s+\[([^\]]+)\]\(([^)]+)\)\s+\((\d{4}-\d{2}-\d{2})\)/;
  const itemRe = /^\*\s+(?:\*\*[^*]+\*\*:\s*)?(.+?)(?:\s+\([a-f0-9]{7}\).+)?$/;

  const lines = raw.split("\n");
  let current: ChangelogEntry | null = null;
  let section: "features" | "fixes" | null = null;

  for (const line of lines) {
    const vMatch = line.match(versionRe);
    if (vMatch) {
      if (current) entries.push(current);
      current = { version: vMatch[1], url: vMatch[2], date: vMatch[3], features: [], fixes: [] };
      section = null;
      continue;
    }
    if (!current) continue;
    if (line.startsWith("### Features")) { section = "features"; continue; }
    if (line.startsWith("### Bug Fixes")) { section = "fixes"; continue; }
    if (line.startsWith("### ")) { section = null; continue; }
    if (line.startsWith("* ") && section) {
      const m = line.match(itemRe);
      if (m) current[section].push(m[1].trim());
    }
  }
  if (current) entries.push(current);
  return entries;
}

const CHANGELOG = parseChangelog(process.env.NEXT_PUBLIC_CHANGELOG || "");

export default function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "16px", mx: 0.5, bgcolor: "#FFFFFF", maxHeight: "90dvh" },
      }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, color: "#9CA3AF", "&:hover": { color: "#6B7280", bgcolor: "#F3F4F6" } }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* App identity */}
      <Box sx={{ textAlign: "center", pt: 3, pb: 2, px: 3 }}>
        <Image
          src="/logo.png"
          alt="KaEatSaan"
          width={200}
          height={67}
          style={{ width: "auto", height: 64, objectFit: "contain" }}
          priority
        />
        <Typography sx={{ fontSize: "0.72rem", color: "#6B7280", lineHeight: 1.5, mt: 1, px: 1 }}>
          Can&apos;t decide where to eat? Spin the wheel and let fate choose your next kainan.
        </Typography>

        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center", gap: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.58rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Version</Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>
              {process.env.NEXT_PUBLIC_APP_VERSION || "—"}
            </Typography>
          </Box>
          <Box sx={{ width: "1px", bgcolor: "#F3F4F6" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.58rem", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Developer</Typography>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>
              John Daryl Homecillo
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Changelog */}
      <Box sx={{ px: 3, py: 2, overflowY: "auto", maxHeight: 320 }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", mb: 1.25 }}>
          Changelog
        </Typography>
        {CHANGELOG.slice(0, 8).map((entry) => (
          <Box key={entry.version} sx={{ mb: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Link href={entry.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>
                v{entry.version}
              </Link>
              <Typography sx={{ fontSize: "0.62rem", color: "#9CA3AF" }}>{entry.date}</Typography>
            </Box>
            {entry.features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", gap: 0.75, alignItems: "flex-start", mb: 0.25 }}>
                <Chip label="feat" size="small" sx={{ height: 16, fontSize: "0.55rem", fontWeight: 700, bgcolor: "#DCFCE7", color: "#16A34A", borderRadius: "4px", flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.68rem", color: "#374151", lineHeight: 1.4 }}>{f}</Typography>
              </Box>
            ))}
            {entry.fixes.map((f, i) => (
              <Box key={i} sx={{ display: "flex", gap: 0.75, alignItems: "flex-start", mb: 0.25 }}>
                <Chip label="fix" size="small" sx={{ height: 16, fontSize: "0.55rem", fontWeight: 700, bgcolor: "#FEF9C3", color: "#CA8A04", borderRadius: "4px", flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.68rem", color: "#374151", lineHeight: 1.4 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Divider />

      {/* Licenses */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", mb: 1 }}>
          Open Source Licenses
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {LICENSES.map(({ name, license, url }) => (
            <Box key={name} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href={url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: "0.72rem", color: "#374151" }}>
                {name}
              </Link>
              <Typography sx={{ fontSize: "0.65rem", color: "#9CA3AF", fontFamily: "monospace" }}>
                {license}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", pb: 2 }}>
        <Typography sx={{ fontSize: "0.62rem", color: "#D1D5DB" }}>
          Made with ❤️ in the Philippines
        </Typography>
      </Box>
    </Dialog>
  );
}
