import type { ImageMetadata } from "astro";

import ceremonyCouple from "../assets/invitation/ceremony/couple-embrace.jpg";
import ceremonyCutout from "../assets/invitation/ceremony/couple-cutout.png";
import closingMirror from "../assets/invitation/closing/mirror.jpg";
import directionsConvertibleProcessed from "../assets/invitation/directions/convertible-processed.jpg";
import directionsConvertible from "../assets/invitation/directions/convertible.jpg";
import directionsMapProcessed from "../assets/invitation/directions/map-processed.png";
import directionsMap from "../assets/invitation/directions/map.png";
import directionsScene from "../assets/invitation/directions/scene.jpg";
import dressCodeCouple from "../assets/invitation/dress-code/couple-embrace.jpg";
import dressCodeCutout from "../assets/invitation/dress-code/couple-cutout.png";
import faqSparklers from "../assets/invitation/faq/sparklers.jpg";
import gardenFormalFull from "../assets/invitation/garden-formal/full-lineup.png";
import gardenFormalGentlemen from "../assets/invitation/garden-formal/gentlemen-lineup.png";
import gardenFormalLadies from "../assets/invitation/garden-formal/ladies-lineup.png";
import gardenFormalLineup from "../assets/invitation/garden-formal/full-lineup-transparent.png";
import gardenFormalScene from "../assets/invitation/garden-formal/scene.jpg";
import giftsSparklers from "../assets/invitation/gifts/sparklers.jpg";
import heroCouple from "../assets/invitation/hero/couple-ring.jpg";
import legacyHeroArtwork from "../assets/invitation/hero/names-date.png";
import parkingCouple from "../assets/invitation/parking/convertible.jpg";
import parkingCutout from "../assets/invitation/parking/couple-cutout.png";
import rsvpCouple from "../assets/invitation/rsvp/sparkler-kiss.jpg";
import sharedDarkGradient from "../assets/invitation/shared/dark-gradient.png";
import storyCouple from "../assets/invitation/story/garden-road.jpg";
import storyCutout from "../assets/invitation/story/couple-cutout.png";
import weddingPartyCouple from "../assets/invitation/wedding-party/holding-hands.jpg";
import weddingPartyCutout from "../assets/invitation/wedding-party/couple-cutout.png";

interface InvitationAsset {
  src: ImageMetadata;
  alt: string;
  position?: `${number}% ${number}%`;
}

const asset = (
  src: ImageMetadata,
  alt: string,
  position?: InvitationAsset["position"],
): InvitationAsset => ({ src, alt, position });

export const invitationAssets = {
  shared: {
    darkGradient: asset(sharedDarkGradient, ""),
  },
  hero: {
    couple: asset(heroCouple, "Victoria and Dorian showing an engagement ring", "50% 45%"),
    legacyNamesDateArtwork: asset(legacyHeroArtwork, ""),
  },
  story: {
    couple: asset(
      storyCouple,
      "Victoria and Dorian walking together along a garden road",
      "50% 45%",
    ),
    cutout: asset(storyCutout, ""),
  },
  ceremony: {
    couple: asset(ceremonyCouple, "Victoria and Dorian embracing outdoors", "50% 45%"),
    cutout: asset(ceremonyCutout, ""),
  },
  parking: {
    couple: asset(parkingCouple, "Victoria and Dorian beside a white convertible", "50% 50%"),
    cutout: asset(parkingCutout, ""),
  },
  dressCode: {
    couple: asset(dressCodeCouple, "Victoria and Dorian embracing", "50% 45%"),
    cutout: asset(dressCodeCutout, ""),
  },
  gardenFormal: {
    fullLineup: asset(gardenFormalFull, "Examples of pastel garden-formal attire"),
    lineup: asset(
      gardenFormalLineup,
      "Examples of pastel garden-formal attire for ladies and gentlemen",
    ),
    scene: asset(
      gardenFormalScene,
      "Victoria and Dorian in a garden, framed for garden-formal attire guidance",
      "50% 45%",
    ),
    ladies: asset(gardenFormalLadies, "Examples of pastel garden-formal attire for women"),
    gentlemen: asset(gardenFormalGentlemen, "Examples of light garden-formal attire for men"),
  },
  weddingParty: {
    couple: asset(weddingPartyCouple, "Victoria and Dorian holding hands in a garden", "50% 50%"),
    cutout: asset(weddingPartyCutout, ""),
  },
  rsvp: {
    couple: asset(rsvpCouple, "Victoria and Dorian kissing under sparklers", "50% 45%"),
  },
  gifts: {
    couple: asset(giftsSparklers, "Victoria and Dorian celebrating with sparklers", "50% 50%"),
  },
  faq: {
    couple: asset(faqSparklers, "Victoria and Dorian standing together among sparklers", "50% 50%"),
  },
  closing: {
    couple: asset(
      closingMirror,
      "Victoria and Dorian reflected in a convertible mirror",
      "50% 50%",
    ),
  },
  directions: {
    convertible: asset(
      directionsConvertible,
      "A white convertible on the road to the venue",
      "50% 50%",
    ),
    convertibleProcessed: asset(directionsConvertibleProcessed, ""),
    scene: asset(
      directionsScene,
      "Victoria and Dorian on the road, traveling to the venue",
      "50% 45%",
    ),
    map: asset(directionsMap, "Map showing the route to Narra Hill Tagaytay"),
    mapProcessed: asset(directionsMapProcessed, ""),
  },
} as const;

export type InvitationAssets = typeof invitationAssets;
