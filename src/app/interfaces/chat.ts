interface ChatChannel {
  id?: any; //number
  name: string;
  nextChatId: number;
  description?: string;
}

interface ChatMsg {
  id: number;
  content: string;
  time: any;
  sender: string;
  senderUid: string;
  userColour: string;
}  