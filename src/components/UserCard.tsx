import type { User } from './UsersCatalog';

type UserCardProps = {
  user: User;
};

const UserCard = ({user}: UserCardProps) => (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
      <img
        src={user.image}
        alt={`${user.firstName} ${user.lastName}`}
        loading="lazy"
        className="h-16 w-16 rounded-xl bg-slate-100 object-cover"
      />
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-slate-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="truncate text-sm text-gray-500 font-bold">{user.email}</p>
        <p className="text-sm text-slate-600">{user.phone}</p>
        <p className="mt-1 text-sm text-slate-600">
          Возраст: {user.age}
          {user.company ? ` • ${user.company.title}, ${user.company.name}` : ''}
        </p>
      </div>
    </div>
  );

export default UserCard;
