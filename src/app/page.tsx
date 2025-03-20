// File: app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profileForm';
import { Toaster } from '@/components/ui/sonner';
import { columns } from '@/components/usersTable/columns';
import { DataTable } from '@/components/usersTable/data-table';
import { db } from '@/db';

export default async function Page() {
  const data = await db.query.usersTable.findMany();
  return (
    <main className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
      <Toaster />
    </main>
  );
}