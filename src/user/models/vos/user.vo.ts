import { IdeaEntity } from "src/idea/models/entities/idea.entity";
import { IdeaVO } from "src/idea/models/vos/idea.vo";

export class UserVO{

    constructor(
        public id: string,
        public username: string,
        public created: Date,
        public token?: string,
        public ideas?: any[],
        public booksmarks?: IdeaEntity[],

    ){}
}