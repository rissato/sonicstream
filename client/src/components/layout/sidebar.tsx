import { Home, Search, Library, Wallet } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/discover", icon: Home, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/library", icon: Library, label: "Library" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Sonic Stream
        </h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                location === item.href && "bg-accent text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
