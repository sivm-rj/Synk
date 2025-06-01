
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
    setIsProfileDialogOpen(false); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between"> {/* Increased height to h-16 */}
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-7 w-7 text-primary" /> {/* Increased icon size */}
          <span className="font-bold sm:inline-block font-headline text-2xl text-foreground"> {/* Increased text size and changed color */}
            Synk
          </span>
        </Link>
        
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md"> {/* max-w-md from lg */}
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> {/* Increased icon size and left padding */}
              <Input
                type="search"
                placeholder="Search Synk..." // Simplified placeholder
                className="h-10 pl-11 w-full rounded-full bg-secondary border-transparent focus:bg-background focus:border-primary" // Changed to rounded-full, new bg, border, focus style
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
                <Button variant="ghost" className="rounded-full p-0 w-10 h-10 hover:bg-secondary"> {/* Custom size and hover */}
                  <User className="h-5 w-5 text-foreground" />
                  <span className="sr-only">Open Profile</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl"> {/* Increased rounding */}
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
                  <Button variant="outline" onClick={onLogoutClick} className="w-full sm:w-auto rounded-md">
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
