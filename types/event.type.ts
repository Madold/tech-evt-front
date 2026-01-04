export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  organizer: User;
  attendees: User[];
}
