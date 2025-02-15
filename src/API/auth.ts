import { API_BASE_URL } from "../environment";
import { getsuperbaseClient } from "./databaseClient";

type loginBodyType = {
    email: string;
    password: string;
}

type registerBodyType = {
    displayName: string;
    email: string;
    password: string;
}

type refreshTokenBodyType = {
    grant_type: string;
    refresh_token: string;
}

const superbaseClient = getsuperbaseClient();


export const registerApi = async (body :registerBodyType) => {
    const response = await superbaseClient.auth.signUp({
        email: body.email,
        password: body.password
    })
    
    return response;
};

export const loginApi = async (body :loginBodyType) => {
    return await superbaseClient.auth.signInWithPassword({
        email: body.email,
        password: body.password
      })
    
};

export const oAuthLoginApi = async() => {

    const resp = await superbaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: "https://prof-budget.vercel.app/oauth",
        }
    });

    return resp;

};

export const demoLoginApi = (): boolean => {
    try {
        localStorage.setItem('demo', 'true');
    } catch (error) {
        return false;
    }

    return true;
}

export const logoutApi = async () => {
    const demo = Boolean(localStorage.getItem('demo')) || false;
    if(demo) {
        return;
    }
    return await superbaseClient.auth.signOut();
}

export const refreshTokenApi = async (body :refreshTokenBodyType) => {
    const response = await fetch(`${API_BASE_URL}api/auth/refresh_token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return response;
}
