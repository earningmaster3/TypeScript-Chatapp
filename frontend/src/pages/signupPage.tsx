import { Loader2, MessageSquare } from "lucide-react";
import { checkAuthStore } from "../store/checkAuthStore";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const signupPage = () => {

  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formdata.fullName.trim())  {toast.error("Full name is required"); return false;};
    if (!formdata.email.trim())  {toast.error("Email is required"); return false;};
    if (!formdata.password.trim())  {toast.error("Password is required"); return false;};
    if (formdata.password.length < 6)
      {toast.error("Password must be at least 6 characters long"); return false;};
    return true;
  };

  const { signup, isSigningUp } = checkAuthStore();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const success = validateForm();
    if (!success) {
      return;
    }
    await signup(formdata);
  };

  return (
    <div className="flex flex-col justify-center min-h-screen items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free account
            </p>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formdata.fullName}
              onChange={(e) =>
                setFormdata({ ...formdata, fullName: e.target.value })
              }
              className="size-full rounded-md border border-base-content/10 px-4 py-2 text-base-content placeholder:text-base-content/50"
              placeholder="Enter your full name"
              required
            />
          </div>
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formdata.email}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              className="size-full rounded-md border border-base-content/10 px-4 py-2 text-base-content placeholder:text-base-content/50"
              placeholder="Enter your email"
              required
            />
          </div>
          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formdata.password}
              onChange={(e) => {
                setFormdata({ ...formdata, password: e.target.value });
              }}
              className="size-full rounded-md border border-base-content/10 px-4 py-2 text-base-content placeholder:text-base-content/50"
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="w-full size-10 rounded-md bg-primary px-4 py-2 text-base-content">
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <button className="w-full size-10 rounded-md bg-secondary px-4 py-2 text-base-content">
            <Link to="/login">Already have an account? Log In</Link>
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default signupPage;
