import { supabase } from '../supabaseClient';

export const fetchPopularInterviews = async () => {
    // Check if table exists by trying to select 1 item, if error, fallback or throw specific error
    const { data, error } = await supabase
        .from('popular_interviews')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching popular interviews:", error);
        throw error;
    }

    // Transform snake_case to camelCase if needed, but our helper function or the component can handle it.
    // However, to keep it compatible with existing code which expects camelCase keys (like 'companyTraits', 'totalDuration'),
    // we should map the response.

    return data.map(interview => ({
        ...interview,
        totalDuration: interview.total_duration,
        companyTraits: interview.company_traits,
        // rounds is already jsonb so keys inside are preserved as they were inserted (which were camelCase)
        // icon needs to be handled in the component using icon_id
    }));
};
