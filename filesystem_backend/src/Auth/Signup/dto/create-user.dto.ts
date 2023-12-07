export class createUserDto {
  id: string;
  userName: string;
  password: string;
  event: { eventName: string; timeStamp: Date; data: String };
}
