// Generate a deterministic GUID for consistent testing
function generateGuid(): string {
  return 'mock-friend-0000-0000-0000-000000000001';
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  rating: number;
  status: 'online' | 'offline';
  lastSeen: string;
  avatar: string;
  country: string;
  title: string;
  isOnline: boolean;
  friendshipDuration: string;
}

export interface FriendsResponse {
  friends: Friend[];
  totalFriends: number;
  hasMore: boolean;
}

// Mock data based on actual chess.com API response structure
const friendsData: FriendsResponse = {
  friends: [
    {
      id: generateGuid(),
      username: "MOCK USER",
      displayName: "MOCK USER",
      rating: 1200,
      status: "online",
      lastSeen: "2 minutes ago",
      avatar: "https://www.chess.com/bundles/web/images/noavatar_l.84a92436.gif",
      country: "US",
      title: "",
      isOnline: true,
      friendshipDuration: "1 day"
    }
  ],
  totalFriends: 1,
  hasMore: false
};

export default friendsData;
