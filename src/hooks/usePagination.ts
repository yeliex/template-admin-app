import { swrFetcher } from '@/libs/fetch';
import { type TablePaginationConfig } from 'antd';
import { type FilterValue, type SorterResult } from 'antd/es/table/interface';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWR, { type SWRConfiguration } from 'swr';
import { type Fetcher } from 'swr/_internal';

const usePagination = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleTableChange = useCallback((
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<any> | SorterResult<any>[],
    ) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set('page', `${pagination.current}`);
            params.set('size', `${pagination.pageSize}`);

            Object.keys(filters).forEach((key) => {
                const value = filters[key] as FilterValue;
                if (value) {
                    params.set(key, `${value}`);
                } else {
                    params.delete(key);
                }
            });

            sorter = Array.isArray(sorter) ? sorter : [sorter];

            if (Array.isArray(sorter)) {
                sorter.forEach((item) => {
                    if (item.order) {
                        params.set(item.columnKey as string, `${item.order === 'ascend' ? 'asc' : 'desc'}`);
                    } else {
                        params.delete(item.columnKey as string);
                    }
                });
            }

            return params;
        });
    }, [setSearchParams]);

    return {
        searchParams,
        setSearchParams,
        onTableChange: handleTableChange,
    };
};

const useSWRPagination = <
    Data = any,
    Error = any,
    SWROptions extends SWRConfiguration<Data, Error, Fetcher<Data, string>> = SWRConfiguration<Data, Error, Fetcher<Data, string>>>(
    url: string,
    config: SWROptions = {} as any,
) => {
    const pagination = usePagination();

    const { searchParams } = pagination;

    const swr = useSWR<Data, Error>(() => {
        const key = new URL(url, window.location.href);
        const search = new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            ...Object.fromEntries(key.searchParams.entries()),
        });
        key.search = search.toString();

        return key.toString();
    }, swrFetcher, { revalidateOnFocus: false, ...config });

    return {
        ...pagination,
        ...swr,
    };
};

export default useSWRPagination;
