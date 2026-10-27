"use client";

import dynamic from "next/dynamic";
import MockupFrame from "../_shared/MockupFrame";

const DeskScene = dynamic(() => import("./DeskScene"), { ssr: false });

export default function DioramaMockup() {
  return (
    <MockupFrame slug="diorama">
      <DeskScene />
    </MockupFrame>
  );
}
