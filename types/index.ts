export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  events: Event[];
  attendedEvents: Event[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  organizer: User;
  attendees: User[];
}
