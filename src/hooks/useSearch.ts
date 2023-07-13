import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultKeyword = searchParams.get('keyword') || '';

    const handleSearch = useCallback((value?: string) => {
        setSearchParams((prev) => {
            value ? prev.set('keyword', value) : prev.delete('keyword');

            return prev;
        });
    }, [setSearchParams]);

    return {
        defaultKeyword,
        handleSearch,
    }
};

export default useSearch;
