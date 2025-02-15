import { createClient } from "@supabase/supabase-js";

const superbaseUrl = import.meta.env.VITE_API_BASE_URL;
const superbaseKey = import.meta.env.VITE_CLIENT_KEY;
const serviceKey = import.meta.env.VITE_SERVICE_KEY;


const getsuperbaseClient =  (key: string = '') => {
    if (key === 'SERVICE') {
       return createClient(String(superbaseUrl), String(serviceKey));
    }

    return createClient(String(superbaseUrl), String(superbaseKey));
    
};



export { getsuperbaseClient };