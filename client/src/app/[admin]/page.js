import { notFound } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';

export default async function AdminPage({ params }) {
  const { admin } = await params;
  
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
