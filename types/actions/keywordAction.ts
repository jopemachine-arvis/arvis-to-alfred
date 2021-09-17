export {};

declare global {
  export interface KeywordAction extends Action {
    readonly type: 'keyword';
    readonly argType?: 'required' | 'optional' | 'no';
    command: string;
    actions: Action[];
    title?: string;
    subtitle?: string;
    withspace?: boolean;
  }
}
