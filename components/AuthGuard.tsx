import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface AuthGuardProps {
    children: React.ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
    const cookieStore = await cookies();
    const isAuth = cookieStore.get('isAuth')?.value === 'true';

    if (!isAuth) {
        redirect('/login');
    }

    return <>{children}</>;
}