import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class Loggingintercepter implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();

		if (requestType === 'http') {
			/* Develop if needed for rest api */
		} else if (requestType === 'graphql') {
			/* (1) Print Request */
			const gqlContext = GqlExecutionContext.create(context);
			this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, `REQUEST`);

			/* (2) Error Handling via GraphQL  */

			/* (3) No Error, Giving Response below  */

			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE');
				}),
			);
		}
	}

	private stringify(context: ExecutionContext): string {
		return JSON.stringify(context).slice(0, 75);
	}
}


// import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
// import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//     private readonly logger: Logger = new Logger();

//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const recordTime = Date.now();
//     const requestType = context.getType<GqlContextType>();

//     if(requestType === "http"){
//     } else if (requestType === "graphql") {
//         const gqlContext = GqlExecutionContext.create(context);
//         this.logger.log(`Type ${this.stringify(gqlContext.getContext().req.body)}`,'REQUEST');
        
//         return next.handle().pipe(
//             tap((context) => {
//                 const responseTime = Date.now() - recordTime;
//                 this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`,'RESPONSE');
//             }
//             ),
//           );
//       }
//     }

//     private stringify(context: ExecutionContext):string {
//         return JSON.stringify(context).slice(0,75);
//     }
// }