// File: app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profileForm';
import { Toaster } from '@/components/ui/sonner';

export default function Page() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
      <Toaster />
    </main>
  );
}