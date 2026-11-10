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
 * The globe layers are the same ones the live home page uses, and so is their
 * narrative: the wave mesh alone under the hero, loose dots fading in with the
 * problem, and the nodes assembling into the globe as the turn — "one platform,
 * every booking" — comes up the screen. The morph is off, though: the cluster
 * positions it gathers into are the live page's pinned card layouts, and this
 * page has no pinned cards. There are no cards and no role icons anywhere:
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
      <NodeField morph={false} />
      <ScrollThread />
      <HomeV2 />
      <BottomNav />
    </LenisProvider>
  );
}
