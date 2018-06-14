interface ChatChannel {
  id: string;
  name: string;
  name_key: string;
  nextChatId: number;
  description?: string;
  msgs?: ChatMsg[];
}

interface ChatMsg {
  id: number;
  content: string;
  time: any;
  sender: string;
  senderId: string;
  userColour: string;
}  