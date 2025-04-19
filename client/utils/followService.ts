const API_BASE_URL = 'http://localhost:8000';

export const followService = {
  async checkFollowStatus(userId: number) {
    const response = await fetch(`${API_BASE_URL}/followers/count`, {
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
    const response = await fetch(`${API_BASE_URL}/follow`, {
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
    const response = await fetch(`${API_BASE_URL}/unfollow`, {
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
    const response = await fetch(`${API_BASE_URL}/${type}/list`, {
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
