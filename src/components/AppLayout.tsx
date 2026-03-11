import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import useRequireAuth from '@/hooks/useRequireAuth';

export default function AppLayout() {
  const ok = useRequireAuth();
  if (!ok) return null;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
