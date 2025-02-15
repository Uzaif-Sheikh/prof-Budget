import { getsuperbaseClient } from "./databaseClient";

const superbaseClient = getsuperbaseClient("SERVICE");

const todayDate = new Date();
const dateT =
        todayDate.getFullYear() +
        "-" +
        (todayDate.getMonth() + 1 >= 10
            ? todayDate.getMonth() + 1
            : `0${todayDate.getMonth() + 1}`) +
        "-" +
        todayDate.getDate();

type addReminderBodyType  = {
    userId: string;
    message: string;
    date: string;
}

type getRemindersBodyType = {
    id: string;
}

export const addReminderAPI = async (body :addReminderBodyType) => {

    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            data: [
                {
                    id: String(Date.now()),
                    message: body.message,
                    timestamp: dateT,
                    owner: body.userId,
                    created_at: ''
                }
            ],
            error: null
        }
    }

    return await superbaseClient
    .from('reminders')
    .insert([
        { message: body.message, timestamp: body.date, owner: body.userId },
    ])
    .select();
}

export const GetRemindersAPI = async (body: getRemindersBodyType) => {

    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            data: [
                {
                    id: '0',
                    owner: '1234',
                    message: 'phone bill',
                    timestamp: dateT,
                    created_at: ''
                },
                {
                    id: '1',
                    owner: '1234',
                    message: 'GYM payment',
                    timestamp: dateT,
                    created_at: ''
                }
            ],
            error: null
        }
    }

    return await superbaseClient
    .from('reminders')
    .select('*')
    .eq('owner', body.id)
    .range(0,9);
}

export const DeleteReminderAPI = async (id: number) => {

    const demo = Boolean(localStorage.getItem('demo')) || false;
    if (demo) {
        return {
            error: null
        };
    }

    return await superbaseClient
    .from('reminders')
    .delete()
    .eq('id', id)
}