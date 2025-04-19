
 const followService = {
  async checkFollowStatus(userId: number) {
    const response = await fetch(`http://localhost:8000/followers/count`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },

  async followUser(followingId: number) {
    const response = await fetch(`http://localhost:8000/follow`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followingId }),
    });
    return response.json();
  },

  async unfollowUser(followingId: number) {
    const response = await fetch(`http://localhost:8000/unfollow`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followingId }),
    });
    return response.json();
  },

  async getFollowList(type: 'followers' | 'following', userId: number) {
    const response = await fetch(`http://localhost:8000/${type}/list`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  }
};

export default followService;