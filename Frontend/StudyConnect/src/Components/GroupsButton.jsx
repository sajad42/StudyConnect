import React from "react";

export const GroupsButton = ({
  group,
  index,
  onJoinGroup,
  isLoading = false,
  className = "",
}) => {
  const handleClick = () => {
    if (!isLoading) {
      console.log("group.id: " + group);
      onJoinGroup(group.id, index, group);


    }
  };

  return (

    <>

    {JSON.parse(localStorage.getItem('user')).id == group.createdBy ?
    
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${className}`}
    >
      {isLoading ? "Deleting..." : "Delete Group"}
    </button>


    
    :
    
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "Joining..." : "Join Group"}
    </button>
    }
    
    
    
    </>
  );
};
