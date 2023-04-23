export interface IMessageable {
    getMessage(...args: unknown[]): Promise<string>
}