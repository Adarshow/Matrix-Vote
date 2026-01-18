import { Suspense } from "react";
import { ResetPasswordPage } from "@/components/ui/reset-password-flow";

function ResetPasswordContent({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  const token = searchParams.token || null;
  const email = searchParams.email || null;
  
  return <ResetPasswordPage token={token} email={email} logoSrc="/logo.png" companyName="Matrix Vote" />;
}

export default function ResetPassword({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
