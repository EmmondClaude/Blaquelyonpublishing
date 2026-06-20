/**
 * Placeholder content for the static-first pass. Every string here is a stub that
 * reads as real editorial copy so the layout is honest — Emmond supplies the final
 * material (named credits, the featured track, roster bios, the ISC proof link).
 *
 * When the blog/roster/songs move to a CMS (Sanity, per the brief) or MDX, this
 * module is the seam: swap these arrays for the data source and the routes don't
 * change shape.
 */

export const brand = {
  name: "Emmond J Smith",
  wordmark: "EMMOND J SMITH",
  parent: "Blaque Lyon Publishing",
  city: "Las Vegas",
  tagline: "After-midnight R&B, written for the room and the radio.",
  description:
    "A Las Vegas–rooted music publishing house with R&B singer-songwriter Emmond J Smith at the forefront — placing songs, building writers, and keeping the catalog moving.",
  // Emmond supplies the real inbox; this is the publishing-inquiry destination.
  inquiryInbox: "publishing@emmondjsmith.com",
  socials: [
    { label: "Instagram", handle: "@emmondjsmith", href: "#" },
    { label: "Spotify", handle: "Emmond J Smith", href: "#" },
    { label: "Apple Music", handle: "Emmond J Smith", href: "#" },
    { label: "YouTube", handle: "Emmond J Smith", href: "#" },
  ],
};

export const accolades = [
  {
    year: "2025",
    title: "ISC Songwriter — Finalist",
    detail:
      "International Songwriting Competition, 2025 finalist. (Emmond: drop the verification link here.)",
    href: "#",
  },
  {
    year: "—",
    title: "Hits written behind the scenes",
    detail:
      "Songs cut by charting artists, written from the writer's room. Named or NDA-safe credits to be confirmed.",
    href: null,
  },
  {
    year: "—",
    title: "Catalog placements",
    detail:
      "Sync and streaming placements across R&B and adjacent rooms. Selected works on request.",
    href: null,
  },
];

export type RosterArtist = {
  slug: string;
  name: string;
  role: string;
  city: string;
  bio: string;
  selectedWorks: string[];
  links: { label: string; href: string }[];
};

export const roster: RosterArtist[] = [
  {
    slug: "emmond-j-smith",
    name: "Emmond J Smith",
    role: "Artist · Writer",
    city: "Las Vegas, NV",
    bio: "The house at the forefront. R&B singer and songwriter working the late-night register — intimate, luxe, built for the room and the radio at once. ISC 2025 finalist; hits cut behind the scenes.",
    selectedWorks: ["Featured: “Neon Confession”", "Selected catalog on request"],
    links: [
      { label: "Spotify", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
  {
    slug: "writer-tbd-01",
    name: "Roster Writer — TBD",
    role: "Writer · Topline",
    city: "Las Vegas, NV",
    bio: "Placeholder roster slot. Emmond supplies the name, photo, bio, and selected works — the card and detail page are already wired to receive them.",
    selectedWorks: ["Selected works — TBD"],
    links: [{ label: "Links", href: "#" }],
  },
  {
    slug: "writer-tbd-02",
    name: "Roster Writer — TBD",
    role: "Producer · Writer",
    city: "Las Vegas, NV",
    bio: "Placeholder roster slot. A producer/writer on the Blaque Lyon roster — replace with real material.",
    selectedWorks: ["Selected works — TBD"],
    links: [{ label: "Links", href: "#" }],
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: "Industry" | "Company" | "Catalog";
  date: string;
  readingMinutes: number;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "isc-2025-finalist",
    title: "ISC 2025: a finalist nod, and what comes next",
    excerpt:
      "On the International Songwriting Competition finalist placement — what it signals for the catalog and the writers we're building.",
    tag: "Company",
    date: "2026-05-12",
    readingMinutes: 4,
    body: [
      "Placeholder post body. This is the interactive blog the brief calls for — industry updates and company movements, list + detail, tags and reading time, all already wired.",
      "When this moves to a CMS (Sanity) or MDX, the route shape stays the same. Emmond writes; the page renders.",
    ],
  },
  {
    slug: "writing-room-las-vegas",
    title: "The writing room, after midnight",
    excerpt:
      "How a Las Vegas R&B catalog gets built between the Strip's noise and a quiet booth — process notes from the house.",
    tag: "Company",
    date: "2026-04-02",
    readingMinutes: 6,
    body: [
      "Placeholder post body for the second entry — process and atmosphere, the after-midnight register the whole brand speaks.",
      "Replace with real editorial copy.",
    ],
  },
  {
    slug: "publishing-101-for-writers",
    title: "Publishing 101 for the writers we sign",
    excerpt:
      "Splits, sync, and the long game — a plain-language primer for writers considering the Blaque Lyon roster.",
    tag: "Industry",
    date: "2026-02-18",
    readingMinutes: 8,
    body: [
      "Placeholder primer body. Industry-facing explainer content lives here.",
      "Replace with real editorial copy.",
    ],
  },
];

export type FeaturedSong = {
  slug: string;
  title: string;
  artist: string;
  year: string;
  lyricTease: string[];
  credits: { role: string; name: string }[];
  streaming: { label: string; href: string }[];
};

export const featuredSong: FeaturedSong = {
  slug: "neon-confession",
  title: "Neon Confession",
  artist: "Emmond J Smith",
  year: "2026",
  lyricTease: [
    "The Strip's still burning when you call —",
    "I confess in neon, never at all.",
  ],
  credits: [
    { role: "Written by", name: "Emmond J Smith" },
    { role: "Produced by", name: "TBD" },
    { role: "Vocals", name: "Emmond J Smith" },
    { role: "Mix", name: "TBD" },
    { role: "Master", name: "TBD" },
    { role: "Publishing", name: "Blaque Lyon Publishing" },
  ],
  streaming: [
    { label: "Spotify", href: "#" },
    { label: "Apple Music", href: "#" },
    { label: "YouTube", href: "#" },
  ],
};

export const projectRoles = [
  "Sync / Licensing",
  "Co-write / Topline",
  "Catalog acquisition",
  "Artist publishing deal",
  "Producer placement",
  "Press / Feature",
  "Other",
] as const;
