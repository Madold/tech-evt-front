'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockEvents } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';
import {
  Bell,
  Calendar,
  CalendarDays,
  Clock,
  LogOut,
  MapPin,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { events, setEvents, setUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { user, logout } = useAuthStore();

  useEffect(() => {
    setEvents(mockEvents);
  }, [setEvents]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Events', value: '24', icon: Calendar, color: 'text-blue-500' },
    { label: 'Attending', value: '8', icon: Users, color: 'text-emerald-500' },
    { label: 'Upcoming', value: '12', icon: TrendingUp, color: 'text-amber-500' },
  ];

  const handleLogout = () => {
    // Limpiar el store de autenticación (token, user, localStorage)
    logout();
    
    // Limpiar el store de la aplicación (eventos, usuario)
    setEvents([]);
    setUser(null);
    
    // Limpiar cualquier otra cosa en localStorage si es necesario
    // localStorage.clear(); // ⚠️ Usa esto solo si quieres borrar TODO el localStorage
    
    // Redirigir al login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TechEvents</h1>
              <p className="text-xs text-muted-foreground">Discover & Attend</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-semibold">
                {user?.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-muted-foreground">
              Discover and join amazing tech events happening around you
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Upcoming Events</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  All
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  This Week
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  This Month
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {event.capacity - event.attendees.length} spots
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{format(event.date, 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-emerald-500" />
                        <span>{format(event.date, 'hh:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 text-amber-500" />
                        <span>{event.attendees.length} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Avatar className="h-7 w-7 border">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {event.organizer.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{event.organizer.username}</p>
                        <p className="text-xs text-muted-foreground">Organizer</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Register Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card className="border-none shadow-md">
                <CardContent className="py-16">
                  <div className="text-center">
                    <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No events found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search to find what you're looking for
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
