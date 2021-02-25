export class UserVO{

    constructor(
        public id: string,
        public username: string,
        public created: Date,
        public token?: string,
    ){}
}