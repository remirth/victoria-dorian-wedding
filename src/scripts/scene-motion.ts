import { animate, inView, scroll, stagger } from "motion";

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const root = document.documentElement;

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const preloadNearbyScenes = () => {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData || connection?.effectiveType?.includes("2g")) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const images = entry.target.querySelectorAll<HTMLImageElement>(
          'picture img[loading="lazy"]:not([data-depth-layer])',
        );
        images.forEach((image) => {
          image.loading = "eager";
          void image.decode().catch(() => {});
        });
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "150% 0px", threshold: 0 },
  );

  document
    .querySelectorAll<HTMLElement>("[data-scene]")
    .forEach((scene) => observer.observe(scene));
};

const requestIdle = (
  window as unknown as {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
).requestIdleCallback;

if (requestIdle) {
  requestIdle.call(window, preloadNearbyScenes, { timeout: 2000 });
} else {
  window.addEventListener("load", preloadNearbyScenes, { once: true });
}

const resetMotionStyles = () => {
  document
    .querySelectorAll<HTMLElement>(
      "[data-reveal], [data-stagger-item], [data-scene-bg], [data-scene-content], [data-scene-wipe], [data-depth-layer]",
    )
    .forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel());
      ["opacity", "transform", "filter", "clip-path"].forEach((property) =>
        element.style.removeProperty(property),
      );
    });
};

const enteredFromBelow = (entry: IntersectionObserverEntry) =>
  entry.boundingClientRect.top >= window.innerHeight;

const setupMotion = () => {
  root.dataset.motion = motionPreference.matches ? "reduced" : "full";
  if (motionPreference.matches) return () => {};

  const cleanups: Array<() => void> = [];
  const activeScrolls = new Set<() => void>();

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    cleanups.push(
      inView(
        element,
        (_element, entry) => {
          if (!enteredFromBelow(entry)) return;

          const light = element.dataset.reveal === "light";
          animate(
            element,
            {
              opacity: [0, 1],
              transform: ["translate3d(0, 20px, 0)", "translate3d(0, 0, 0)"],
              ...(light ? { filter: ["blur(4px)", "blur(0px)"] } : {}),
            },
            { duration: light ? 0.8 : 0.55, ease: [0.22, 1, 0.36, 1] },
          );
        },
        { margin: "0px 0px 18%", amount: 0.05 },
      ),
    );
  });

  document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-stagger-item]"));
    if (!items.length) return;

    cleanups.push(
      inView(
        group,
        (_element, entry) => {
          if (!enteredFromBelow(entry)) return;

          animate(
            items,
            { opacity: [0, 1], transform: ["translate3d(0, 16px, 0)", "translate3d(0, 0, 0)"] },
            { duration: 0.5, delay: stagger(0.075), ease: [0.22, 1, 0.36, 1] },
          );
        },
        { margin: "0px 0px 18%", amount: 0.05 },
      ),
    );
  });

  document.querySelectorAll<HTMLElement>("[data-motion-family~='wipe']").forEach((scene) => {
    const wipe = scene.querySelector<HTMLElement>("[data-scene-wipe]");
    if (!wipe) return;

    cleanups.push(
      inView(
        scene,
        () => {
          animate(
            wipe,
            {
              opacity: [0, 0.34, 0],
              clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0 0 100%)"],
            },
            { duration: 0.85, ease: "easeInOut" },
          );
        },
        { amount: 0.12 },
      ),
    );
  });

  if (!coarsePointer) {
    document.querySelectorAll<HTMLElement>("[data-motion-family~='depth']").forEach((scene) => {
      const background = scene.querySelector<HTMLElement>("[data-scene-bg]");
      const foreground = scene.querySelector<HTMLElement>("[data-depth-layer='foreground']");
      if (!background && !foreground) return;

      cleanups.push(
        inView(scene, () => {
          const cancelScroll = scroll(
            (progress: number) => {
              const centered = progress - 0.5;
              if (background) {
                background.style.transform = `translate3d(0, ${centered * 22}px, 0) scale(1.035)`;
              }
              if (foreground) {
                foreground.style.transform = `translate3d(0, ${centered * -34}px, 0)`;
              }
            },
            { target: scene, offset: ["start end", "end start"] },
          );
          activeScrolls.add(cancelScroll);

          return () => {
            cancelScroll();
            activeScrolls.delete(cancelScroll);
          };
        }),
      );
    });

    document
      .querySelectorAll<HTMLElement>(
        "[data-motion-family~='light'], [data-motion-family~='wipe'], [data-motion-family~='paper']",
      )
      .forEach((scene) => {
        const content = scene.querySelector<HTMLElement>("[data-scene-content]");
        const background = scene.dataset.motionFamily?.includes("depth")
          ? null
          : scene.querySelector<HTMLElement>("[data-scene-bg]");
        if (!content) return;

        cleanups.push(
          inView(scene, () => {
            const cancelScroll = scroll(
              (progress: number) => {
                const centered = progress - 0.5;
                content.style.transform = `translate3d(0, ${centered * -16}px, 0)`;
                if (background) {
                  background.style.transform = `translate3d(0, ${centered * 16}px, 0) scale(1.025)`;
                }
              },
              { target: scene, offset: ["start end", "end start"] },
            );
            activeScrolls.add(cancelScroll);

            return () => {
              cancelScroll();
              activeScrolls.delete(cancelScroll);
            };
          }),
        );
      });
  }

  return () => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
    activeScrolls.forEach((cancelScroll) => cancelScroll());
    activeScrolls.clear();
  };
};

root.dataset.motion = motionPreference.matches ? "reduced" : "full";

let motionStarted = false;
let stopMotion = () => {};

const startMotion = () => {
  if (motionStarted) return;
  motionStarted = true;
  stopMotion = setupMotion();
};

if (root.dataset.invitationOpened === "true") startMotion();
window.addEventListener("invitation:opened", startMotion);
window.addEventListener("hashchange", () => {
  if (location.hash === "#invitation") startMotion();
});

motionPreference.addEventListener("change", () => {
  root.dataset.motion = motionPreference.matches ? "reduced" : "full";
  if (!motionStarted) return;

  stopMotion();
  resetMotionStyles();
  stopMotion = setupMotion();
});
