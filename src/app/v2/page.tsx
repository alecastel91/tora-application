"use client";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { BottomNav } from "@/components/ui/PageNav";
import { HomeNav } from "@/components/ui/HomeNav";
import { ParallaxBackdrop } from "@/components/sections/home/ParallaxBackdrop";
import { WaveMesh } from "@/components/sections/home/WaveMesh";
import { NodeField } from "@/components/sections/home/NodeField";
import { ScrollThread } from "@/components/sections/home2/ScrollThread";
import { HomeV2 } from "@/components/sections/home2/HomeV2";

/**
 * Home, restructured — one uninterrupted descent instead of six pinned beats.
 *
 * The globe layers are the same ones the live home page uses. Each Scene below
 * covers them with its own room while it is on screen, so the rooms cross-fade
 * into one another as you descend and the globe is left exposed at the top, at
 * the turn, and on the way out. There are no cards and no role icons anywhere:
 * where a photograph carries the role, an icon of the role on top of it is
 * saying the same thing twice.
 *
 * Lives at /v2 so it can be read against / rather than replacing it.
 */
export default function HomeV2Page() {
  return (
    <LenisProvider>
      <HomeNav />
      <ParallaxBackdrop />
      <WaveMesh />
      <NodeField />
      <ScrollThread />
      <HomeV2 />
      <BottomNav />
    </LenisProvider>
  );
}
