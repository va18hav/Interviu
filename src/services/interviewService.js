export const fetchPopularInterviews = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/popular-interviews`);
        if (!response.ok) throw new Error('Failed to fetch popular interviews');

        const data = await response.json();
        return data.popularInterviews;
    } catch (error) {
        console.error("Error fetching popular interviews:", error);
        throw error;
    }
};
