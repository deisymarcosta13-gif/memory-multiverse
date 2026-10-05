export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                // pareja incorrecta
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "20%, 60%": { transform: "translateX(-4px)" },
                    "40%, 80%": { transform: "translateX(4px)" },
                },
                // pareja correcta
                pop: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.06)" },
                },
                "modal-in": {
                    from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
                    to: { opacity: "1", transform: "none" },
                },
            },
            animation: {
                shake: "shake 400ms ease-in-out",
                pop: "pop 320ms ease-out",
                "modal-in": "modal-in 200ms ease-out",
            },
        },
    },
    plugins: [],
}
