import { useState } from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const userMutation = api.user.create.useMutation();

  const { refetch } = api.user.getUser.useQuery(
    { email },
    {
      enabled: false,
    },
  );

  const handleSignup = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await refetch();
      if (!data) {
        setShowOTP(true);
      } else {
        alert("User already registered!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again.");
    }
  };

  const handleVerify = () => {
    if (otp === "12345678") {
      userMutation.mutate({ name, email, password });
      setName("");
      setEmail("");
      setPassword("");
      alert("User signed up successfully!");
      router.push("/login");
    } else {
      alert("Invalid OTP");
      router.push("/signup");
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Link href="/">
          <button className="max-w-xs rounded-lg bg-white/10 p-4 text-white hover:bg-white/20">
            Home
          </button>
        </Link>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {!showOTP && (
            <form
              onSubmit={handleSignup}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"
            >
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-xs rounded-lg bg-white/10 p-4 text-white focus:outline-none"
              />
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
                Sign Up
              </button>
            </form>
          )}
          {showOTP && (
            <>
              <h5 style={{ color: "white" }}>Verify your email</h5>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="max-w-xs rounded-lg bg-white/10 p-4 text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVerify}
                className="max-w-xs rounded-lg bg-white/10 p-4 text-white hover:bg-white/20"
              >
                Verify
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
