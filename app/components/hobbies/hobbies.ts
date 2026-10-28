import type { IconType } from "react-icons";
import {
  GiSkateboard,
  GiViolin,
  GiPianoKeys,
  GiGamepad,
  GiDiceTwentyFacesTwenty,
  GiPokerHand,
} from "react-icons/gi";

// Content for the Hobbies section (the skatepark run). Edit the text here.
// Only facts from the resume, transcript, and GitHub are used.
export interface Hobby {
  id: "skate" | "violin" | "piano" | "gamejams" | "dnd" | "puzzles";
  name: string;
  icon: IconType;
  file: string; // shown in the terminal-style cards
  kind: string; // short category, e.g. "Instrument"
  blurb: string; // one sentence
  details: string[]; // a few facts
  accent: "--pf-accent" | "--pf-accent-2" | "--pf-accent-3";
  trick: string; // the skatepark trick that unlocks this hobby, as a command
}

export const HOBBIES: Hobby[] = [
  {
    id: "skate",
    name: "Skateboarding",
    icon: GiSkateboard,
    file: "skate.md",
    kind: "Sport",
    blurb: "Four wheels, one board, and a lot of practice.",
    details: ["The board riding this run is a real 3D skateboard model."],
    accent: "--pf-accent",
    trick: "air --out-of-bowl",
  },
  {
    id: "violin",
    name: "Violin",
    icon: GiViolin,
    file: "violin.md",
    kind: "Instrument",
    blurb: "Playing violin in the Purdue String Orchestra.",
    details: ["Purdue String Orchestra every semester since Fall 2023."],
    accent: "--pf-accent-2",
    trick: "ollie --funbox",
  },
  {
    id: "piano",
    name: "Piano",
    icon: GiPianoKeys,
    file: "piano.md",
    kind: "Instrument",
    blurb: "Learned piano alongside violin at Purdue.",
    details: ["Class Piano I and II at Purdue."],
    accent: "--pf-accent-3",
    trick: "boardslide --rail",
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
    accent: "--pf-accent",
    trick: "frontside-air --quarter-pipe",
  },
  {
    id: "dnd",
    name: "Dungeons & Dragons",
    icon: GiDiceTwentyFacesTwenty,
    file: "dnd.md",
    kind: "Tabletop",
    blurb: "Running campaigns as the Dungeon Master.",
    details: ["Built DM Workbench, an offline desktop app for running D&D 5e campaigns."],
    accent: "--pf-accent-2",
    trick: "crooked-grind --ledge",
  },
  {
    id: "puzzles",
    name: "Puzzles & Strategy",
    icon: GiPokerHand,
    file: "puzzles.md",
    kind: "Strategy",
    blurb: "Estimathons, poker theory, and anything with numbers.",
    details: ["Built an Estimathon scoreboard app and a poker solver."],
    accent: "--pf-accent-3",
    trick: "air --kicker",
  },
];

