import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main
      id="main-content"
      className="bg-cream flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-rustic shadow-rustic h-64 animate-pulse bg-white" />
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
