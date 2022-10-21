import { IUser } from 'types/users';
import sampleProducts from './sample-product';

// const data = [...sampleProducts];

const generateId = (dataN: any) => dataN.reduce((acc: any, current: any) => Math.max(acc, current.id), 0) + 1;

export const insertItem = (item: any, data: IUser[]) => {
    item.id = generateId(data);
    item.inEdit = false;
    data.unshift(item);
    return data;
};

export function getItems(data: IUser[]) {
    return data;
}

export const updateItem = (item: any, data: IUser[]) => {
    const index = data.findIndex((record: any) => record.id === item.id);
    data[index] = item;
    return data;
};

export const deleteItem = (item: any, data: IUser[]) => {
    const index = data.findIndex((record: any) => record.id === item.id);
    data.splice(index, 1);
    return data;
};
