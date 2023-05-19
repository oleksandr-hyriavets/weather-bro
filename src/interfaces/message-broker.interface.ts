export interface IMessageBroker {
    sendMessage(...args: unknown[]): Promise<void>
}