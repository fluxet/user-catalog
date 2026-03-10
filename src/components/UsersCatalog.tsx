import { useEffect, useMemo, useState } from 'react';
import UserCard from './UserCard';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  email: string;
  phone: string;
  image: string;
  age: number;
  company?: {
    name: string;
    title: string;
  };
};

type UsersApiResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

const PAGE_SIZE = 10;
const API_BASE_URL = 'https://dummyjson.com/users';
const DEBOUNCE_DELAY = 350;

const UsersCatalog = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const skip = (currentPage - 1) * PAGE_SIZE;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const base = searchQuery ? `${API_BASE_URL}/search` : API_BASE_URL;
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          skip: String(skip)
        });

        if (searchQuery) {
          params.set('q', searchQuery);
        }

        const response = await fetch(`${base}?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: UsersApiResponse = await response.json();
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Не удалось загрузить пользователей. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, [searchQuery, skip]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let start = Math.max(1, currentPage - half);
    const endLimit = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, endLimit - windowSize + 1);

    const pages: number[] = [];
    for (let page = start; page <= endLimit; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [currentPage, totalPages]);

  const paginationButtonBase =
    'rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Поиск пользователя по имени"
          className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 transition placeholder:text-slate-400 focus:ring-2"
        />
        <div className="flex w-full justify-between text-sm text-slate-600 sm:w-auto sm:gap-5">
          <span>Найдено: {total}</span>
          <span>
            Страница: {Math.min(currentPage, totalPages)} / {totalPages}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {loading && (
        <div className="absolute mt-4 w-full max-w-md rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Загрузка...
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Пользователи не найдены.
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Пагинация">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1 || loading}
          className={paginationButtonBase}
        >
          Назад
        </button>

        {pageNumbers.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${paginationButtonBase} border-slate-300`}
            disabled={loading || page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages || loading}
          className={paginationButtonBase}
        >
          Вперед
        </button>
      </nav>
    </>
  );
}

export default UsersCatalog;
