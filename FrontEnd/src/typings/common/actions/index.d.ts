
declare type errorType = string | Error | ErrorEvent;

/** 
 * actions
 */
export interface promiseAction<returnPayload> {
  type: string;
  payload: Promise<returnPayload>;
}

export interface valueAction<T> {
  type: string;
  payload: T;
}

export interface metaAction<T> extends valueAction<T> {
  meta: {
    status: number;
  };
}

export interface errorAction {
  type: string;
  payload: errorType;
}
