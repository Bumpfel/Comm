interface ChatChannel {
  id: string;
  name: string;
  nextChatId: number;
  description?: string;
  msgs?: ChatMsg[];
}

interface ChatMsg {
  id: number;
  content: string;
  time: any;
  sender: string;
  senderUid: string;
  userColour: string;
}  