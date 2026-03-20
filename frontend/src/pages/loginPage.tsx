import { useState } from "react";
import { checkAuthStore } from "../store/checkAuthStore";
import { MailIcon, MessageSquare, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";

const loginPage = () => {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, authUser } = checkAuthStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formdata);
  };

  if (authUser) return <div>Logging in...</div>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
            <p className="text-base-content/60">Sign in to your account</p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={formdata.email}
                onChange={(e) =>
                  setFormdata({ ...formdata, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={formdata.password}
                onChange={(e) =>
                  setFormdata({ ...formdata, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Sign in"}
          </button>
        </form>
        <button className="btn btn-secondary w-full">
          <Link to="/signup">Dont have an account? Sign up</Link>
        </button>
      </div>
    </div>
  );
};

export default loginPage;
