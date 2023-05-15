/* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */

export type Entity = any & {
  findAll: <T>({ offset, limit, where, raw }: {
    offset?: number;
    limit?: number;
    where?: Record<string, any>;
    raw?: boolean;
  }) => Promise<T>;
  count: ({ offset, limit, where, raw }: {
    offset?: number;
    limit?: number;
    where?: Record<string, any>;
    raw?: boolean;
  }) => Promise<number>;
  findOne: <T>({ where, raw }: {
    where?: Record<string, any>;
    raw?: boolean;
  }) => Promise<T>;
}
