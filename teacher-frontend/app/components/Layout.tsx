import { Link } from "@remix-run/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 pt-14 pb-2">
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
      </header>
      
      <main className="flex-1">{children}</main>
    </div>
  );
}
