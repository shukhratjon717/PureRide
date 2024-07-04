import { Logger } from "@nestjs/common";
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Server } from "http";

@WebSocketGateway({ transports: ["websocket"], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger("SocketEventsGateWay");
  private summaryClient: number = 0;

  public afterInit(server: Server) {
    this.logger.log(
      `WebSocket Server Initialized total: ${this.summaryClient}`,
    );
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;
    this.logger.log(`== Client Connected Total:${this.summaryClient} ==`);
  }

  handleDisconnect(client: WebSocket) {
    this, this.summaryClient--;
    this.logger.log(`== Client Connected Total:${this.summaryClient}`);
  }
  @SubscribeMessage("message")
  public handleMessage(client: WebSocket, payload: any): string {
    return "Hello world!";
  }
}
