import { BudgetType } from "../Pages/Types";
import { API_BASE_URL } from "../environment";

export const createBudgetAPI = async (body :BudgetType) => {
    const response = await fetch(`${API_BASE_URL}api/budget/createBudget`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(body),
    });
    
    return response;
};


export const getBudgetAPI = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}api/budget/getBudget?userId=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
    });
    
    return response;
};