export interface ChatChannel {
  id?: string;
  name: string;
  // name_key: string;
  nextChatId: number;
  description: string;
  protected: boolean;
  // msgs?: ChatMsg[];
}

export interface ChatMsg {
  id: number;
  content: string;
  time: any;
  sender: string;
  senderId: string;
  userColour: string;
}  