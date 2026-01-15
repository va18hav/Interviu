import { supabase } from '../supabaseClient';
import TechInterviews from '../pages/TechInterviews';

export const seedInterviews = async () => {
    console.log("Starting seed process for Technical Interviews...");

    const formattedData = TechInterviews.map(item => ({
        company: item.company,
        role: item.role,
        level: item.level,
        total_duration: item.totalDuration,
        skills: item.skills, // Array of strings, Supabase supports text[]
        overview: item.overview,
        company_traits: item.companyTraits, // Mapping to snake_case column
        rounds: item.rounds, // JSONB column
        icon_url: item.icon, // Using the URL string directly
    }));

    const { data, error } = await supabase
        .from('popular_interviews')
        .insert(formattedData)
        .select();

    if (error) {
        console.error("Error seeding interviews:", error);
        alert("Error seeding data: " + error.message);
    } else {
        console.log("Successfully seeded interviews:", data);
        alert("Successfully added interviews to Supabase!");
    }
};
