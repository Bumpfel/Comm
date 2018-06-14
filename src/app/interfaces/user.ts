interface User {
  admin?: boolean;
  guest?: boolean;
  uid: string;
  email: string;
  displayName: string;
  chatName: string;
  chatNameColour?: string;
  photoUrl?: any;
}