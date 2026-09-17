import { ChangePasswordForm } from "../components/ChangePasswordForm";

export const ChangePasswordPage = () => {
  return (
    <div className="container py-10 max-w-4xl mx-auto flex flex-col items-center">
      <div className="mb-8 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
        <p className="text-muted-foreground mt-2">Ensure your account is using a long, random password to stay secure.</p>
      </div>
      <div className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm w-full max-w-md">
        <ChangePasswordForm />
      </div>
    </div>
  );
};
