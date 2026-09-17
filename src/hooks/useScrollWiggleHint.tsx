"use client";

import { RefObject, useEffect, useRef } from "react";

const WIGGLE_DELAY_MS = 5000;
const WIGGLE_DISTANCE_PX = 30;
const WIGGLE_MAX_REPEATS = 3;
const SLIDE_OUT_DURATION_MS = 650;
const SLIDE_BACK_DURATION_MS = 500;
const BOUNCE_DIP_PX = 8;
const BOUNCE_DIP_DURATION_MS = 120;
const BOUNCE_SETTLE_DURATION_MS = 380;

// Ease-out cúbico: saída rápida com uma freada bem suave.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Ease-in-out cúbico: suave nas duas pontas - usado na volta, sem "quique" nenhum aqui (esse
// vem depois, via transform).
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function animateScrollLeft(
    el: HTMLElement,
    from: number,
    to: number,
    duration: number,
    easing: (t: number) => number,
    onDone?: () => void
) {
    const start = performance.now();

    const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        el.scrollLeft = from + (to - from) * easing(t);

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            onDone?.();
        }
    };

    requestAnimationFrame(step);
}

/**
 * Nudges a horizontally-scrollable element a little to the side and back every few seconds,
 * for as long as it's on screen and hasn't been scrolled yet - just enough for people to
 * notice a row is scrollable without being told.
 *
 * The slide out and back is hand-animated (not the browser's native smooth-scroll) so it can
 * ease out slowly instead of the fairly mechanical feel of two chained `scrollTo` calls. The
 * landing "mini bounce" is done separately via a CSS transform, not by overshooting
 * `scrollLeft` itself: browsers clamp `scrollLeft` at 0, and this hint almost always returns
 * to exactly 0 (nothing has been scrolled yet), so an overshoot on the scroll position alone
 * would be silently swallowed right when it matters most.
 *
 * Stops for good once the user scrolls it themselves (an arrow button click also fires a
 * scroll event, so that counts too) or after a few nudges, so it never nags forever.
 */
export function useScrollWiggleHint(scrollRef: RefObject<HTMLElement | null>) {
    const hasInteractedRef = useRef(false);
    const isWigglingRef = useRef(false);
    const wiggleCountRef = useRef(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let intervalId: number | undefined;
        let bounceTimeoutId: number | undefined;

        const stop = () => {
            if (intervalId !== undefined) {
                window.clearInterval(intervalId);
                intervalId = undefined;
            }
        };

        const resetTransform = () => {
            if (bounceTimeoutId !== undefined) {
                window.clearTimeout(bounceTimeoutId);
                bounceTimeoutId = undefined;
            }
            el.style.transition = "";
            el.style.transform = "";
        };

        const handleScroll = () => {
            if (isWigglingRef.current) return;
            hasInteractedRef.current = true;
            stop();
        };
        el.addEventListener("scroll", handleScroll, { passive: true });

        const wiggle = () => {
            if (hasInteractedRef.current || wiggleCountRef.current >= WIGGLE_MAX_REPEATS) {
                stop();
                return;
            }

            if (el.scrollWidth <= el.clientWidth + 1) {
                stop();
                return;
            }

            wiggleCountRef.current += 1;
            isWigglingRef.current = true;
            const original = el.scrollLeft;

            animateScrollLeft(el, original, original + WIGGLE_DISTANCE_PX, SLIDE_OUT_DURATION_MS, easeOutCubic, () => {
                animateScrollLeft(el, el.scrollLeft, original, SLIDE_BACK_DURATION_MS, easeInOutCubic, () => {
                    // Um quiquezinho na chegada, feito com transform (que aceita valores
                    // negativos) em vez de mexer no scroll de novo.
                    el.style.transition = `transform ${BOUNCE_DIP_DURATION_MS}ms ease-out`;
                    el.style.transform = `translateX(-${BOUNCE_DIP_PX}px)`;

                    bounceTimeoutId = window.setTimeout(() => {
                        el.style.transition = `transform ${BOUNCE_SETTLE_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
                        el.style.transform = "translateX(0px)";

                        bounceTimeoutId = window.setTimeout(() => {
                            resetTransform();
                            isWigglingRef.current = false;
                        }, BOUNCE_SETTLE_DURATION_MS);
                    }, BOUNCE_DIP_DURATION_MS);
                });
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && intervalId === undefined && !hasInteractedRef.current) {
                    intervalId = window.setInterval(wiggle, WIGGLE_DELAY_MS);
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);

        return () => {
            el.removeEventListener("scroll", handleScroll);
            observer.disconnect();
            stop();
            resetTransform();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
