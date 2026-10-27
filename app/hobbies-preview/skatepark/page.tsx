"use client";

import dynamic from "next/dynamic";
import MockupFrame from "../_shared/MockupFrame";

const SkateparkScene = dynamic(() => import("./SkateparkScene"), { ssr: false });

export default function SkateparkMockup() {
  return (
    <MockupFrame slug="skatepark" bare>
      <SkateparkScene />
    </MockupFrame>
  );
}
