import type { IconType } from "react-icons";
import {
  GiSkateboard,
  GiViolin,
  GiPianoKeys,
  GiGamepad,
  GiDiceTwentyFacesTwenty,
  GiPokerHand,
} from "react-icons/gi";

// Shared content for all five hobby mockups. Edit the text here and every
// mockup picks it up. Only facts from the resume, transcript, and GitHub are
// used; the short "flavor" lines are placeholders for you to rewrite.
export interface Hobby {
  id: "skate" | "violin" | "piano" | "gamejams" | "dnd" | "puzzles";
  name: string;
  icon: IconType;
  file: string; // used by the terminal mockup: `cat <file>`
  kind: string; // short category, e.g. "Instrument"
  blurb: string; // one sentence
  details: string[]; // a few facts
  stats: { label: string; value: string }[]; // used by the inventory cards
  flavor: string; // placeholder line in your own voice
  accent: "--pf-accent" | "--pf-accent-2" | "--pf-accent-3";
}

export const HOBBIES: Hobby[] = [
  {
    id: "skate",
    name: "Skateboarding",
    icon: GiSkateboard,
    file: "skate.md",
    kind: "Sport",
    blurb: "Four wheels, one board, and a lot of practice.",
    details: ["The board on this page is a real 3D model you can spin and flip."],
    stats: [
      { label: "Type", value: "Street / cruising" },
      { label: "Gear", value: "1 board" },
    ],
    flavor: "Placeholder: your favorite trick or spot.",
    accent: "--pf-accent",
  },
  {
    id: "violin",
    name: "Violin",
    icon: GiViolin,
    file: "violin.md",
    kind: "Instrument",
    blurb: "Playing violin in the Purdue String Orchestra.",
    details: ["Purdue String Orchestra every semester since Fall 2023."],
    stats: [
      { label: "Ensemble", value: "String Orchestra" },
      { label: "Semesters", value: "7" },
    ],
    flavor: "Placeholder: a favorite piece to play.",
    accent: "--pf-accent-2",
  },
  {
    id: "piano",
    name: "Piano",
    icon: GiPianoKeys,
    file: "piano.md",
    kind: "Instrument",
    blurb: "Learned piano alongside violin at Purdue.",
    details: ["Class Piano I and II at Purdue."],
    stats: [
      { label: "Courses", value: "Class Piano I & II" },
      { label: "Grade", value: "A, A" },
    ],
    flavor: "Placeholder: what you like to play.",
    accent: "--pf-accent-3",
  },
  {
    id: "gamejams",
    name: "Game Jams",
    icon: GiGamepad,
    file: "gamejams.md",
    kind: "Creative",
    blurb: "Building whole games in a weekend with Godot.",
    details: [
      "Pirate Software Game Jam, BoilerMake 2024, BoilerMake XII, and the C3 Game Jam.",
      "Tia's Sailing Simulator pairs a Godot game with a live Llama 3.1 voice companion.",
    ],
    stats: [
      { label: "Jams", value: "4" },
      { label: "Engine", value: "Godot" },
    ],
    flavor: "Placeholder: your favorite jam moment.",
    accent: "--pf-accent",
  },
  {
    id: "dnd",
    name: "Dungeons & Dragons",
    icon: GiDiceTwentyFacesTwenty,
    file: "dnd.md",
    kind: "Tabletop",
    blurb: "Running campaigns as the Dungeon Master.",
    details: ["Built DM Workbench, an offline desktop app for running D&D 5e campaigns."],
    stats: [
      { label: "Role", value: "Dungeon Master" },
      { label: "Edition", value: "5e" },
    ],
    flavor: "Placeholder: a memorable session.",
    accent: "--pf-accent-2",
  },
  {
    id: "puzzles",
    name: "Puzzles & Strategy",
    icon: GiPokerHand,
    file: "puzzles.md",
    kind: "Strategy",
    blurb: "Estimathons, poker theory, and anything with numbers.",
    details: ["Built an Estimathon scoreboard app and a poker solver."],
    stats: [
      { label: "Favorite", value: "Estimathon" },
      { label: "Side project", value: "Poker solver" },
    ],
    flavor: "Placeholder: a puzzle you love.",
    accent: "--pf-accent-3",
  },
];

export const MOCKUPS = [
  { slug: "shell", title: "Hobby shell", summary: "An interactive terminal. Type or click commands; ./skate flips the 3D board." },
  { slug: "skatepark", title: "Neon skatepark", summary: "Scroll to ride the board through a glowing wireframe bowl as hobby cards pop up." },
  { slug: "diorama", title: "3D desk diorama", summary: "A low-poly desk with objects for each hobby. Hover and click to explore." },
  { slug: "cards", title: "Inventory cards", summary: "RPG-style item cards with stats that tilt on hover and flip for the story." },
  { slug: "game", title: "Skate mini-game", summary: "Ollie over code obstacles and collect hobbies to unlock them." },
] as const;
