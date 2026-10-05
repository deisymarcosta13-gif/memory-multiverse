type HomeProps = {
    setNivel: (nivel: string) => void;
};

function Home({ setNivel }: HomeProps) {
    return (
        <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative overflow-hidden"
        style={{ backgroundImage: "url('/img/fondoRick.jpg')" }}
        >
        {/* EFECTO PORTAL */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,0,0.15)_0%,transparent_70%)] animate-pulse"></div>

        {/* EFECTO COLOR EXTRA */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-purple-500/20 to-cyan-400/20 mix-blend-overlay"></div>

        {/* CONTENIDO */}
        <div className="relative z-10 bg-black/20 backdrop-blur-lg p-8 rounded-3xl shadow-[0_0_40px_rgba(0,255,0,0.4)] text-center w-[90%] max-w-md border border-green-300/40">
            
            {/* TÍTULO */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-300 mb-4 tracking-widest 
                        drop-shadow-[0_0_20px_rgba(0,255,0,1)] animate-pulse">
            MEMORY MULTIVERSE
            </h1>

            {/* FRASE */}
            <p className="text-green-100 mb-6 text-sm md:text-base italic">
            "Wubba Lubba Dub Dub! Tu memoria decide si sobrevives al multiverso."
            </p>

            {/* BOTONES */}
            <div className="flex flex-col gap-5">
            
            <button
                onClick={() => setNivel("facil")}
                className="py-3 rounded-xl bg-green-400/20 border border-green-300 text-green-200 font-bold tracking-wide
                        hover:bg-green-400 hover:text-black
                        hover:scale-110 hover:rotate-1
                        hover:shadow-[0_0_30px_#22ff00]
                        transition-all duration-300"
            >
                NIVEL FÁCIL
            </button>

            <button
                onClick={() => setNivel("medio")
                
                }
                className="py-3 rounded-xl bg-purple-400/20 border border-purple-300 text-purple-200 font-bold tracking-wide
                        hover:bg-purple-400 hover:text-black
                        hover:scale-110 hover:rotate-1
                        hover:shadow-[0_0_30px_#a855f7]
                        transition-all duration-300"
            >
                NIVEL MEDIO
            </button>

            <button
                onClick={() => setNivel("dificil")}
                className="py-3 rounded-xl bg-cyan-400/20 border border-cyan-300 text-cyan-200 font-bold tracking-wide
                        hover:bg-cyan-400 hover:text-black
                        hover:scale-110 hover:rotate-1
                        hover:shadow-[0_0_30px_#22d3ee]
                        transition-all duration-300"
            >
                NIVEL DIFÍCIL
            </button>

            </div>
        </div>
        </div>
    );
}

export default Home;