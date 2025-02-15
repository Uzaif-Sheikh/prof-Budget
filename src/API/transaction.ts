import { API_BASE_URL } from "../environment";
import { bodyType } from "../Pages/Types";
import { getsuperbaseClient } from "./databaseClient";


const superbaseClient = getsuperbaseClient("SERVICE");


export const addTransactionAPI = async (body :bodyType) => {
    
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    const date = [year, month, day].join('-');

    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            data: [
                {
                    id: Number(Date.now()),
                    title: body.title,
                    description: body.description,
                    userId: '1234',
                    value: body.value,
                    income: body.income,
                    date: date,
                    category: body.category,
                    type: body.type,
                    created_at: ''
                }
            ],
            error: null
        }
    }

    return await superbaseClient
    .from('transactions')
    .insert([
        { ...body, date: date },
    ])
    .select();

};

export const getTransactionsAPI = async (ui:string , year:string, month:string, search:string, category:string) => {
    
    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        const todayDate = new Date();
        const dateT =
        todayDate.getFullYear() +
        "-" +
        (todayDate.getMonth() + 1 >= 10
            ? todayDate.getMonth() + 1
            : `0${todayDate.getMonth() + 1}`) +
        "-" +
        todayDate.getDate();

        return {
            data: [
                {
                    id: '0',
                    title: 'Eating out and uber eats',
                    description: 'total eating out',
                    userId: '1234',
                    value: 665.6,
                    income: false,
                    date: dateT,
                    category: 'Eating Out',
                    type: 'Wants',
                    created_at: '',
                },
                {
                    id: '1',
                    title: 'shopping',
                    description: 'shopping at Westfield',
                    userId: '1234',
                    value: 320.56,
                    income: false,
                    date: dateT,
                    category: 'Shopping',
                    type: 'Wants',
                    created_at: '',
                },
                {
                    id: '2',
                    title: 'Groceries',
                    description: 'Groceries at Coles',
                    userId: '1234',
                    value: 279.23,
                    income: false,
                    date: dateT,
                    category: 'Groceries',
                    type: 'Needs',
                    created_at: '',
                },
                {
                    id: '7',
                    title: 'invested in stock',
                    description: 'invested in tech stocks',
                    userId: '1234',
                    value: 129.63,
                    income: false,
                    date: dateT,
                    category: 'Income',
                    type: 'Investments',
                    created_at: '',
                },
                {
                    id: '3',
                    title: 'Movie',
                    description: 'Movie at Ritz',
                    userId: '1234',
                    value: 59.52,
                    income: false,
                    date: dateT,
                    category: 'Entertainment',
                    type: 'Wants',
                    created_at: '',
                },
                {
                    id: '4',
                    title: 'Gas',
                    description: 'Gas bill',
                    userId: '1234',
                    value: 329.96,
                    income: false,
                    date: dateT,
                    category: 'Utilities',
                    type: 'Needs',
                    created_at: '',
                },
                {
                    id: '5',
                    title: 'Income',
                    description: 'Income',
                    userId: '1234',
                    value: 2029.63,
                    income: true,
                    date: dateT,
                    category: 'Income',
                    type: '',
                    created_at: '',
                },
                {
                    id: '6',
                    title: 'Saving',
                    description: 'saving in netsaver',
                    userId: '1234',
                    value: 729.63,
                    income: false,
                    date: dateT,
                    category: 'Income',
                    type: 'Savings',
                    created_at: '',
                }
            ],
            error: null
        }
    }

    return await superbaseClient
    .from('transactions')
    .select('*')
    .eq('owner', ui)
    .gte('date', `${year}-${Number(month)>9?month:String('0')+month}-01`)
    .lte('date', `${year}-${Number(month)>9?month:String('0')+month}-${new Date(Number(year), Number(month), 0).getDate()}`)
    .or(`category.ilike.%${category}%,category.ilike.%%`)
    .or(`title.ilike.%${search}%,title.ilike.%%`)
    .order('date', { ascending: false})
    .range(0, 12);

};

export const getBarDataAPI = async (year: string, month: string) => {
    const response = await fetch(`${API_BASE_URL}api/transaction/getBarData?id=PqN1tRB5aPPYh5SPHXh40vobniG3&year=${year}&month=${month}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    });
    
    return response;
};

export const deleteTransactionAPI = async (transactionId: number) => {

    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            error: null
        };
    }

    return await superbaseClient
    .from('transactions')
    .delete()
    .eq('id', transactionId)
}

export const getIncomeExpenditureAPI = async (year: string, month: string) => {
    const response = await fetch(`${API_BASE_URL}api/transaction/getIncomeExpenditure?id=PqN1tRB5aPPYh5SPHXh40vobniG3&year=${year}&month=${month}` , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          }
    });
    
    return response;
}
