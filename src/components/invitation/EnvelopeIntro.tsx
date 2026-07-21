import { domAnimation, LazyMotion, MotionConfig, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "victoria-dorian-invitation-opened";

type Phase = "cover" | "opening" | "opened";

export default function EnvelopeIntro() {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("cover");
  const openButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let wasOpened = location.hash === "#invitation";
    try {
      wasOpened ||= sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // The invitation still works when storage is unavailable.
    }
    if (wasOpened) {
      setPhase("opened");
      document.documentElement.dataset.invitationOpened = "true";
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const invitation = document.querySelector<HTMLElement>("[data-invitation-document]");
    const covered = phase !== "opened";
    const previousOverflow = document.body.style.overflow;

    if (invitation) invitation.inert = covered;
    if (covered) document.body.style.overflow = "hidden";

    return () => {
      if (invitation) invitation.inert = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [hydrated, phase]);

  const openInvitation = () => {
    if (phase !== "cover") return;
    setPhase("opening");
  };

  const showInvitation = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Session persistence is an enhancement, not an access requirement.
    }
    document.documentElement.dataset.invitationOpened = "true";

    setPhase("opened");
    window.dispatchEvent(new Event("invitation:opened"));
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[data-entry-focus]")?.focus({ preventScroll: true });
    });
  };

  const finishOpening = () => {
    if (phase === "opening") showInvitation();
  };

  const replayCover = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Replay remains available without storage.
    }
    delete document.documentElement.dataset.invitationOpened;

    setPhase("cover");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => openButton.current?.focus());
  };

  if (hydrated && phase === "opened") {
    return (
      <button className="envelope-replay" type="button" onClick={replayCover}>
        View invitation cover
      </button>
    );
  }

  const opening = phase === "opening";
  const coverTransition = reduceMotion
    ? { duration: 0.18, ease: "easeOut" as const }
    : { duration: 0.42, delay: 1.72, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <m.section
          className="envelope-intro"
          data-enhanced={hydrated ? "true" : "false"}
          aria-label="Invitation cover"
          initial={false}
          animate={opening ? "opening" : hydrated ? "arrived" : "arrival"}
          variants={{
            arrival: { opacity: 1 },
            arrived: { opacity: 1 },
            opening: { opacity: 0, transition: coverTransition },
          }}
          onAnimationComplete={(definition) => {
            if (definition === "opening") finishOpening();
          }}
        >
          <div className="envelope-intro__ornament" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="envelope-intro__heading">
            <p>Together with their families</p>
            <p className="envelope-intro__names">Victoria &amp; Dorian</p>
            <p>invite you to celebrate their wedding</p>
          </div>

          <a className="envelope-intro__fallback" href="#invitation">
            View invitation
          </a>

          <button className="envelope-intro__skip" type="button" onClick={showInvitation}>
            Skip to invitation
          </button>

          <m.button
            ref={openButton}
            className="envelope-intro__button"
            type="button"
            aria-label="Open Victoria and Dorian's wedding invitation"
            aria-disabled={opening}
            disabled={opening}
            onClick={openInvitation}
            whileHover={opening || reduceMotion ? undefined : { scale: 1.015 }}
            whileTap={opening || reduceMotion ? undefined : { scale: 0.985 }}
          >
            <m.span
              className="envelope"
              aria-hidden="true"
              variants={{
                arrival: { y: 24, scale: 0.96 },
                arrived: { y: 0, scale: 1, transition: { duration: 0.65, ease: "easeOut" } },
                opening: reduceMotion ? { y: 0 } : { y: 8, transition: { duration: 0.8 } },
              }}
            >
              <span className="envelope__back" />
              <m.span
                className="envelope__card"
                variants={{
                  arrival: { y: 16 },
                  arrived: { y: 16 },
                  opening: reduceMotion
                    ? { opacity: 0 }
                    : {
                        y: [16, 16, -118, -160],
                        rotate: [0, 0, -1, 0],
                        scale: [0.92, 0.92, 1, 1.06],
                        transition: { duration: 1.45, times: [0, 0.3, 0.78, 1], ease: "easeInOut" },
                      },
                }}
              >
                <span className="envelope__monogram">
                  V <i>&amp;</i> D
                </span>
                <span className="envelope__date">29 September 2026</span>
              </m.span>
              <m.span
                className="envelope__flap"
                variants={{
                  arrival: { rotateX: 0 },
                  arrived: { rotateX: 0 },
                  opening: reduceMotion
                    ? { opacity: 0 }
                    : {
                        rotateX: -180,
                        transition: { duration: 0.72, delay: 0.28, ease: "easeInOut" },
                      },
                }}
              />
              <span className="envelope__front" />
              <m.span
                className="envelope__seal"
                variants={{
                  arrival: { scale: 1, opacity: 1 },
                  arrived: { scale: 1, opacity: 1 },
                  opening: reduceMotion
                    ? { opacity: 0 }
                    : {
                        scale: [1, 1.16, 0.84, 0],
                        rotate: [0, -5, 4, 0],
                        opacity: [1, 1, 1, 0],
                        transition: { duration: 0.42, ease: "easeInOut" },
                      },
                }}
              >
                VD
              </m.span>
            </m.span>
            <span className="envelope-intro__action">
              {opening ? "Opening invitation" : "Open invitation"}
            </span>
          </m.button>

          <output className="sr-only" aria-live="polite">
            {opening ? "Opening the wedding invitation" : ""}
          </output>
        </m.section>
      </LazyMotion>
    </MotionConfig>
  );
}
