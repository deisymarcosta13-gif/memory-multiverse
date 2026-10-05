import confetti from "canvas-confetti";

export const launchConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ["#22ff00", "#a855f7", "#22d3ee"];

    const frame = () => {
        confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true,
        });

        confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true,
        });

        if (Date.now() < end) {
        requestAnimationFrame(frame);
        }
    };

    frame();
};