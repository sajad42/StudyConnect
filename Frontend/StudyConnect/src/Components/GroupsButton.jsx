export const GroupsButton = ({
  isOwner,
  member,
  isFull = false,
  isLoading = false,
  onJoin,
  onLeave,
  onDelete,
  className = "",
}) => {
  if (isOwner) {
    return (
      <button
        type="button"
        onClick={onDelete}
        disabled={isLoading}
        className={`flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer ${className}`}
      >
        {isLoading ? "Deleting..." : "Delete Group"}
      </button>
    );
  }

  if (member) {
    return (
      <button
        type="button"
        onClick={onLeave}
        disabled={isLoading}
        className={`flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      >
        {isLoading ? "Leaving..." : "Leave Group"}
      </button>
    );
  }

  if (isFull) {
    return (
      <button
        type="button"
        disabled
        className={`flex-1 bg-gray-200 text-gray-500 py-2.5 rounded-lg font-medium cursor-not-allowed ${className}`}
      >
        Group Full
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onJoin}
      disabled={isLoading}
      className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {isLoading ? "Joining..." : "Join Group"}
    </button>
  );
};
