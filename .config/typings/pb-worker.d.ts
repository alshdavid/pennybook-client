export {};

declare global {
  var pbWorker: {
    postMessage(data: { id?: string, action: string, payload?: any }): void;
    addEventListener(message: string, cb: (event: { data: { id?: string, action: string, payload: unknown }}) => any, options?: { once?: boolean }): void;
    removeEventListener(...args: Parameters<MessagePort['removeEventListener']>): void;

    subscribe<T>(action: string, ev: (payload: T) => any): () => void
    send<R>(action: string, payload?: any): Promise<R>
  };
}
