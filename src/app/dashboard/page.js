import ProtectedRoute from '../../../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Your protected content .. */}
      </div>
    </ProtectedRoute>
  );
} 