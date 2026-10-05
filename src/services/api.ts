export const fetchCharacters = async (limit: number, filtro: string) => {
    try {
        let url = "https://rickandmortyapi.com/api/character";

        if (filtro !== "all") {
            url += `/?status=${filtro}`;
        } else {
            url += "?page=1";
        }

        const response = await fetch(url);
        const data = await response.json();

        return data.results.slice(0, limit);
    } catch (error) {
        console.error("Error al obtener personajes:", error);
        return [];
    }
};