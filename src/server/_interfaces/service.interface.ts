export interface IService<T> {
    getAll: () => Promise<T[]>;
    getById: (id: string) => Promise<T | null>;
    create: (params: T) => void;
    update: (id: string, params: T) => void;
    delete: (id: string) => void;
}
