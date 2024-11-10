import LoginForm from "@/components/login/LoginForm";

export default function Home() {
  return (
    <div className="grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <LoginForm />
    </div>
  );
}
