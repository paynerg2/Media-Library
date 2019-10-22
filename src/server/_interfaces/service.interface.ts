export interface IService<T, R> {
    getAll: () => Promise<R[]>;
    getById: (id: string) => Promise<R | null>;
    create: (params: T) => void;
    update: (id: string, params: T) => void;
    delete: (id: string) => void;
}
