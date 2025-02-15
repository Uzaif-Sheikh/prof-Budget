import { getsuperbaseClient } from "./databaseClient";

type welcomeUserBodyType = {
    name: string,
    id: string,
    fixed: boolean,
    saving: number,
    needs: number,
    income: number
}

const superbaseClient = getsuperbaseClient("SERVICE");

export const welcomeUserApi = async (body: welcomeUserBodyType) => {
    
    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            error: null,
            data: {}
        };
    }

    const response = await superbaseClient
        .from('user_metadata')
        .insert([
            { name: body.name, user_id: body.id, necessities_amount: body.needs, fixed_income: body.fixed, saving_percent: body.saving, income: body.income },
        ])
        .select();

    return response;
};

export const getUserMetadata = async (id: string) => {
    const response = await superbaseClient
        .from('user_metadata')
        .select('*')
        .eq('user_id', id);

    return response;
};