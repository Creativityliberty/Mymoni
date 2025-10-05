import "@/app/globals.css";
import { Sidebar } from "@/components/sidebar";
import { ChatDock } from "@/components/chat/chat-dock";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = {
  title: "Mymoni - Gestion d'abonnements intelligente",
  description: "Gérez vos abonnements avec l'aide d'un agent IA",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="grid grid-cols-[260px_1fr] min-h-screen">
          <Sidebar />
          <div className="flex flex-col">
            <header className="flex items-center justify-between border-b px-6 py-3 bg-card/40 backdrop-blur-sm">
              <div className="text-sm text-muted-foreground">
                Workspace: <span className="font-medium text-foreground">Demo</span>
              </div>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-6 space-y-6 overflow-auto">{children}</main>
          </div>
        </div>
        <ChatDock />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){ 
                try{ 
                  var t=localStorage.getItem('theme'); 
                  if(t){ 
                    document.documentElement.classList.toggle('dark', t==='dark'); 
                  } 
                }catch(e){} 
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
