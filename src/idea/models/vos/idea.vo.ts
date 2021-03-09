import { UserVO } from "src/user/models/vos/user.vo";

export class IdeaVO{
    public id?: string;
    public updatedAt: Date;
    public createdAt: Date;
    public idea: string;
    public description: string;
    public author: UserVO;
    public upvotes?: number;
    public downvotes?: number;
    public comments?: any
}