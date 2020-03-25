export interface IService<T, R> {
    getAll: () => Promise<R[]>;
    getById: (id: string) => Promise<R | null>;
    create: (params: T) => Promise<R>;
    update: (id: string, params: T) => Promise<R>;
    delete: (id: string) => void;
}
