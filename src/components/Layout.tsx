import UsersCatalog from './UsersCatalog';

const Layout = () => (
  <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 px-3 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg shadow-slate-300/40 backdrop-blur sm:p-6">
          <h1 className="text-2xl font-semibold text-slate-600 sm:text-3xl">Каталог пользователей</h1>
        <UsersCatalog />
      </section>
    </main>
)

export default Layout;
