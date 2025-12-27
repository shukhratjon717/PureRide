import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { AnalyticsService } from '../components/analytics/analytics.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

interface AnalyticsPayload {
	event: string;
	data: any;
	timestamp: Date;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private logger: Logger = new Logger('SocketEventsGateWay');
	private summaryClient: number = 0;
	private clientsAuthMap = new Map<WebSocket, Member>();
	private messageList: MessagePayload[] = [];
	private analyticsSubscribers = new Set<WebSocket>();
	private analyticsInterval: NodeJS.Timeout;

	constructor(
		private authService: AuthService,
		private analyticsService: AnalyticsService,
	) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized & total [${this.summaryClient}]`);
		
		// Start broadcasting analytics every 5 seconds
		this.startAnalyticsBroadcast();
	}

	private startAnalyticsBroadcast() {
		this.analyticsInterval = setInterval(async () => {
			if (this.analyticsSubscribers.size > 0) {
				try {
					const analytics = await this.analyticsService.getDashboardAnalytics();
					const payload: AnalyticsPayload = {
						event: 'analytics:update',
						data: analytics,
						timestamp: new Date(),
					};
					
					this.broadcastToAnalyticsSubscribers(payload);
				} catch (error) {
					this.logger.error('Error broadcasting analytics:', error);
				}
			}
		}, 5000); // Every 5 seconds
	}

	private broadcastToAnalyticsSubscribers(payload: AnalyticsPayload) {
		const message = JSON.stringify(payload);
		this.analyticsSubscribers.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	}

	public onModuleDestroy() {
		if (this.analyticsInterval) {
			clearInterval(this.analyticsInterval);
		}
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			// console.log("token:", token);
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summaryClient++;
		this.clientsAuthMap.set(client, authMember);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Connection [${clientNick}] & Total [${this.summaryClient}] `);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		//Client Message
		client.send(JSON.stringify({ event: 'getMessages', list: this.messageList }));
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient--;
		this.clientsAuthMap.delete(client);
		this.analyticsSubscribers.delete(client); // Clean up analytics subscription

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Disconnection [${clientNick}] & Total [${this.summaryClient}] `);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'left',
		};

		this.broadcastMessge(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: string): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		const newMessage: MessagePayload = {
			event: 'message',
			text: payload,
			memberData: authMember,
		};

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);

		this.messageList.push(newMessage);
		if (this.messageList.length > 5) this.messageList.splice(0, this.messageList.length - 5);

		this.emitMessage(newMessage);
	}

	@SubscribeMessage('subscribeToAnalytics')
	public handleSubscribeToAnalytics(client: WebSocket): void {
		const authMember = this.clientsAuthMap.get(client);
		
		// Only allow admin users to subscribe
		if (authMember && authMember.memberType === 'ADMIN') {
			this.analyticsSubscribers.add(client);
			this.logger.verbose(`Admin [${authMember.memberNick}] subscribed to analytics`);
			
			// Send initial analytics data immediately
			this.analyticsService.getDashboardAnalytics().then((analytics) => {
				const payload: AnalyticsPayload = {
					event: 'analytics:initial',
					data: analytics,
					timestamp: new Date(),
				};
				client.send(JSON.stringify(payload));
			});
		} else {
			this.logger.warn('Non-admin user attempted to subscribe to analytics');
		}
	}

	@SubscribeMessage('unsubscribeFromAnalytics')
	public handleUnsubscribeFromAnalytics(client: WebSocket): void {
		const authMember = this.clientsAuthMap.get(client);
		this.analyticsSubscribers.delete(client);
		this.logger.verbose(`Admin [${authMember?.memberNick}] unsubscribed from analytics`);
	}

	private broadcastMessge(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

