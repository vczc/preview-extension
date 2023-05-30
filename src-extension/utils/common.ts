
export const saveState = (context: any, key: string, value: any) => {
    return context.globalState.update(key, JSON.stringify(value));
}

export const getState = (context: any, key: string) => {
    const _d = context.globalState.get(key);
    return _d ? JSON.parse(_d) : {}
}