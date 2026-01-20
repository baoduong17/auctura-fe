// pages/auth/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schemas";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { handleApiError } from "@/utils/error-handler";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormField } from "@/components/forms/FormField";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { COLORS } from "@/constants/theme";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID =
  "816422652963-euhfse499nkf8mvfb18t3m1hdroqo7p5.apps.googleusercontent.com";

function rnd() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#")) return;

      const p = new URLSearchParams(hash.slice(1));
      const accessToken = p.get("access_token");
      const idToken = p.get("id_token");

      if (accessToken && idToken) {
        try {
          setIsLoading(true);
          // Remove hash immediately to clean URL
          window.history.replaceState(null, "", window.location.pathname);

          const result = await authService.loginWithGoogle({
            idToken,
            accessToken,
          });
          login(result.token, result.user);
          toast.success("Login with Google successful!");
          navigate("/marketplace");
        } catch (error) {
          handleApiError(error);
          setIsLoading(false);
        }
      }
    };

    handleGoogleCallback();
  }, [login, navigate]);

  const handleGoogleLogin = () => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    // Redirect back to the current page (login page)
    url.searchParams.set("redirect_uri", window.location.origin + "/login");
    url.searchParams.set("response_type", "token id_token");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("nonce", rnd());
    url.searchParams.set("state", rnd());
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("prompt", "select_account");

    window.location.assign(url.toString());
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const result = await authService.login(data);
      login(result.token, result.user);
      toast.success("Login successful!");
      navigate("/marketplace");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          register={register("email")}
          required
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          error={errors.password?.message}
          register={register("password")}
          required
        />

        <Button type="submit" className={`w-full`} disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Signing in...</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full text-white bg-[#1a56db] hover:bg-[#1a56db]/90"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Login with Google
        </Button>

        <div className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
