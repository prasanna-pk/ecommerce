import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { refetch } = api.user.getUser.useQuery(
    { email },
    {
      enabled: false,
    },
  );

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await refetch();
      if (data?.email === email && data?.password === password) {
        router.push("/[userId]", data?.id.toString());
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Link href="/">
        <button className="max-w-xs rounded-lg bg-white/10 p-4 text-white hover:bg-white/20">
          Home
        </button>
      </Link>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <form
          onSubmit={handleLogin}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs rounded-lg bg-white/10 p-4 text-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="max-w-xs rounded-lg bg-white/10 p-4 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="max-w-xs rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
