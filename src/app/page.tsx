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
 * Home — one uninterrupted descent instead of six pinned beats.
 *
 * The globe layers carry the whole page, and so does their narrative: the wave
 * mesh alone under the hero, loose dots fading in with the problem, and the
 * nodes assembling into the globe as the turn — "one platform, every booking" —
 * comes up the screen. The morph is off: the cluster positions it gathers into
 * are the old pinned card layouts, and there are no pinned cards here. There
 * are no role icons either — where a photograph carries the role, an icon of
 * the role on top of it says the same thing twice.
 */
export default function Home() {
  return (
    <LenisProvider>
      <HomeNav />
      <ParallaxBackdrop />
      <WaveMesh />
      <NodeField morph={false} />
      <ScrollThread />
      <HomeV2 />
      <BottomNav />
    </LenisProvider>
  );
}
