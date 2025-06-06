
import { LoginForm } from '@/components/auth/login-form';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">Synk</h1>
      </div>
      <LoginForm />
      <p className="mt-4 text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
