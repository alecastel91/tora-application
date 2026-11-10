"use client";

import Image from "next/image";

/**
 * The club photograph behind a role card, lit in that role's own colour. The
 * radial tint is what ties the room to the role: the library's rooms were
 * already lit purple / green / amber / red, so the two layers reinforce each
 * other instead of fighting.
 *
 * Two variants, because the copy sits differently in each layout:
 *  - "card" (desktop morph) — copy is centred in the lower half, so the room
 *    can stay bright at the top and darken under the text.
 *  - "row" (mobile stack) — copy runs across the whole card, so the room is
 *    dimmer overall. At the card variant's brightness the amber and green
 *    rooms washed straight through the sentence.
 */
export function RoomBackdrop({
  photo,
  color,
  variant = "card",
}: {
  photo: string;
  color: string;
  variant?: "card" | "row";
}) {
  const row = variant === "row";
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl">
      <Image
        src={photo}
        alt=""
        fill
        sizes={row ? "100vw" : "(min-width: 768px) 320px, 100vw"}
        className={row ? "object-cover opacity-[0.55]" : "object-cover opacity-[0.78]"}
      />
      <div
        className="absolute inset-0"
        style={{
          background: row
            ? `radial-gradient(85% 90% at 18% 50%, ${color}33, transparent 78%), linear-gradient(180deg, rgba(10,10,10,0.52) 0%, rgba(10,10,10,0.72) 100%)`
            : `radial-gradient(78% 68% at 50% 34%, ${color}3d, transparent 74%), linear-gradient(180deg, rgba(10,10,10,0.28) 0%, rgba(10,10,10,0.55) 46%, rgba(10,10,10,0.84) 100%)`,
        }}
      />
    </div>
  );
}
