export type bodyType = {
    title: string;
    description: string;
    value: number;
    category: string;
    income: boolean;
    owner: string;
    type: string;
}

export type transactionType = {
    id: number;
    title: string;
    description: string;
    userId: string;
    value: number;
    income: boolean;
    date: string;
    category: string;
    type: string;
    created_at: string;
}

export type reminderType = {
    id: number;
    owner: string;
    message: string;
    timestamp: string;
    created_at: string;
}

export type barData = {
    eatingout: Array<Obj1>;
}

export type Obj1 = {
    sum: number;
    id: number;
} 

export type LoginBodyType = {
    email: string;
    password: string;
}
  
export type userInfo = {
    displayName: string;
    email: string;
    expiresIn: string;
    idToken: string;
    kind: string;
    localId: string;
    refreshToken: string;
    registered: boolean;
    fixed: boolean;
    saving: number;
    needs: number;
    reminderDate: string;
};
  
export type refreshTokenBodyType = {
    grant_type: string;
    refresh_token: string;
};

export type RegisterBodyType = {
    displayName: string;
    email: string;
    password: string;
  }

export type BudgetType = {
    needs: number,
    wants: number, 
    investments: number,
    savings : number,
};

export type bType = {
    budget: number,
    category: string
};