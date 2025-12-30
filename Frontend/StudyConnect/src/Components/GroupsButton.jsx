import React from "react";
import { authService } from "../api/authservice";

export const GroupsButton = ({
  group,
  index,
  onJoinGroup,
  onLeaveGroup,
  onDeleteGroup,
  isLoading = false,
  className = "",
}) => {
  const handleJoin = () => {
    if (!isLoading) {
      onJoinGroup(group.id, index, group);


    }
  };
  const handleLeave = () => {
    if (!isLoading) {
      onLeaveGroup(group.id, index, group);


    }
  };
  const handleDetele = () => {
    if (!isLoading) {
      onDeleteGroup(group.id, index, group);
    }
  };

  return (

    <>

    {(Number(authService.getUserId()) === Number(group.createdBy)) ?
    
    <button
      onClick={handleDetele}
      disabled={isLoading}
      className={`flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${className}`}
    >
      {isLoading ? "Deleting..." : "Delete Group"}
    </button>


    
    :
    group.member ? (
        <button
          onClick={handleLeave}
          disabled={isLoading}
          className={`flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {isLoading ? "Leaving..." : "Leave Group"}
        </button>
      )

    :
    <button
      onClick={handleJoin}
      disabled={isLoading}
      className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "Joining..." : "Join Group"}
    </button>
    }
    
    
    
    </>
  );
};
