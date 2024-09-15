import { Link } from "@remix-run/react";
import {
  SignOutButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@clerk/remix';

// TODO: Children overlap header on scroll
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 pt-14 pb-2">
        <div className="relative w-full">
          <nav className="flex justify-center space-x-8 text-white">
            <Link
              to="/"
              className="text-lg font-semibold hover:text-gray-300 transition-colors"
            >
              Configure
            </Link>
            <Link
              to="/dashboard"
              className="text-lg font-semibold hover:text-gray-300 transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          <div className="absolute right-20 top-0 flex items-center space-x-4">
            <SignedIn>
              <SignOutButton>
                  <button className="text-lg font-semibold hover:text-gray-300 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">{children}</main>
    </div>
  );
}
