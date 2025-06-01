
'use client';

import * as React from 'react';
import { Zap, LogOut, Search as SearchIcon, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserProfileCard } from '@/components/user/user-profile-card';
import type { UserProfile } from '@/types';

interface HeaderProps {
  userProfile: UserProfile | null;
  handleLogout: () => void;
}

export function Header({ userProfile, handleLogout }: HeaderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(authStatus);
  }, []);
  
  // Re-check auth status if userProfile changes (e.g. after logout from another tab or explicit logout)
  React.useEffect(() => {
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(authStatus);
  }, [userProfile]);


  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const onLogoutClick = () => {
    handleLogout();
    setIsProfileDialogOpen(false); // Close dialog after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-xl">
            Synk
          </span>
        </Link>
        
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events, communities, forums..."
                className="h-9 pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <nav className="flex items-center">
          {isClient && isAuthenticated && userProfile && (
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Open Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-headline text-center text-2xl">My Profile</DialogTitle>
                  <DialogDescription className="text-center">
                    View your profile information below.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <UserProfileCard profile={userProfile} />
                </div>
                <DialogFooter className="sm:justify-center border-t pt-4">
                  <Button variant="outline" onClick={onLogoutClick} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </nav>
      </div>
    </header>
  );
}
