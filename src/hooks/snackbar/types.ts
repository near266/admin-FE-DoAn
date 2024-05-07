export type MessageType = 'success' | 'error' | 'warning' | 'info';

export interface Notify {
  type: MessageType;
  message: string;
}
