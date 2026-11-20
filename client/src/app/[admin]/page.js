import { notFound } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage({ params }) {
  const resolvedParams = await params;
  const admin = resolvedParams?.admin;
  
  // Retrieve secret path configuration from env
  const secretPath = process.env.SECRET_ADMIN_PATH || '/secret-admin-door';
  
  // Format slug (strip leading slash if present in env configuration)
  const expectedSlug = secretPath.startsWith('/') ? secretPath.substring(1) : secretPath;

  // Render 404 notFound if access token slug doesn't match secret environment variable
  if (admin !== expectedSlug) {
    notFound();
  }

  return <AdminDashboard />;
}
