import React from 'react';
import UserDetail from './user_detail';
import UserMainContainer from './user_main_container';

const UserProfile = (props) => {
  const { userId, user, fetchUser } = props;

  React.useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  if (!user || Object.keys(user).length === 0) {
    return null;
  }

  return (
    <div className="user-profile">
      <UserDetail user={user} />
      <UserMainContainer userId={userId} />
    </div>
  );
};

export default UserProfile;
