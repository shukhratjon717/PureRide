import { Resolver } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.server';

@Resolver()
export class BoardArticleResolver {
    constructor(private readonly boardArticleService: BoardArticleService) {}
}
