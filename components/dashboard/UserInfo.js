export default function UserInfo({ user }) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "ST";

  return (
    <div className="p-6 sm:p-8 md:p-10 rounded-3xl border border-[color:var(--border)] bg-gradient-to-br from-[color:var(--card)] to-[color:var(--background)] shadow-xl max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[color:var(--foreground)]">
              {user?.name || "Super User"}
            </h2>
            <p className="text-sm text-[color:var(--secondary)]">
              {user?.email || "Not Provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
