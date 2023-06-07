

export type AuthAction = {
    type: Symbol;
    payload: string
}

type AuthDispatchType = (args: AuthAction) => AuthAction;