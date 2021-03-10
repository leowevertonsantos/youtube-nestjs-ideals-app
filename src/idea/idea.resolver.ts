import { Args, Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { CommentService } from "src/comment/comment.service";
import { IdeaService } from "./idea.service";
import { IdeaVO } from "./models/vos/idea.vo";

@Resolver('Idea')
export class IdeaResolver{

    constructor(private ideaService: IdeaService, public commentService: CommentService){}

    @Query()
    public ideas(@Args('page') page: number, @Args('newest') newest: boolean){
        return this.ideaService.findAll(page, newest);
    }

    @ResolveProperty()
    public comments(@Parent() idea: IdeaVO){
        return this.commentService.findByIdea(idea.id);

    }
}