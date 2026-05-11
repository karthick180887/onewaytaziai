import type { NextConfig } from "next";
import { ALL_DISTRICTS } from "./lib/districts";

type RedirectRule = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

const OLD_SUFFIX_MAP: { suffix: string; newPrefix: string }[] = [
  { suffix: "-outstation-cab", newPrefix: "outstation-cabs-in-" },
  { suffix: "-outstation-cabs", newPrefix: "outstation-cabs-in-" },
  { suffix: "-airport-taxi", newPrefix: "cab-service-in-" },
  { suffix: "-one-way-taxi", newPrefix: "one-way-taxi-in-" },
  { suffix: "-taxi-service", newPrefix: "taxi-service-in-" },
  { suffix: "-cab-service", newPrefix: "cab-service-in-" },
  { suffix: "-drop-taxi", newPrefix: "drop-taxi-in-" },
  { suffix: "-call-taxi", newPrefix: "call-taxi-in-" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    const rules: RedirectRule[] = [];
    for (const d of ALL_DISTRICTS) {
      for (const { suffix, newPrefix } of OLD_SUFFIX_MAP) {
        rules.push({
          source: `/${d.slug}${suffix}`,
          destination: `/${newPrefix}${d.slug}`,
          statusCode: 301,
        });
      }
    }
    return rules;
  },
};

export default nextConfig;
