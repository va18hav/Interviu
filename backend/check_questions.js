import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nfgforfzxarpjauiycar.supabase.co';
const supabaseKey = 'sb_publishable_3jcEXhWkwMXxLHIyzP2b9w_90EUHSUf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestions() {
    const { data, error } = await supabase
        .from('sde_questions')
        .select('round_num')
        .eq('company', 'Apple')
        .eq('role', 'Software Engineer ICT 3');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Question Round Nums:", data);
    }
}

checkQuestions();
