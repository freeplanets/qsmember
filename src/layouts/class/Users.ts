import { User } from '../data/schema';

export const UserTypes = [
    { title: 'Member', value: 0 },
    { title: 'Agent', value: 1 },
    { title: 'WebOwner', value: 2 },
    { title: 'Operator', value: 3 },
    { title: 'Programmer', value: 9 },
];
export default class Users {
    private Data:User;
    constructor(data:User) {
        this.Data = data;
    }
    get Account() {
        return this.Data.Account as string;
    }
    set Account(v:string) {
        this.Data.Account = v;
    }
    get Password() {
        return '***************';
    }
    set Password(v:string) {
        this.Data.Password = v;
    }
}
