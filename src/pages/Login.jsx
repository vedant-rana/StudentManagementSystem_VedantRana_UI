import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { setToken, isAuthenticated } from "../utils/auth";
import { Navigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isAuthenticated()) {
    return <Navigate to="/students" replace />;
  }

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await login(data);
      console.log("Login successful, received token:", response); // Debug log
      setToken(response.data.token);
      navigate("/students");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Invalid username or password.";
      setServerError(typeof msg === "string" ? msg : "Login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Student Management System</h1>
        <h2 className="login-subtitle">Sign In</h2>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Username</label>
            <input
              {...register("email", { required: "Username is required" })}
              className={errors.username ? "input-error" : ""}
              placeholder="Enter username"
              autoComplete="username"
            />
            {errors.email && (
              <span className="error-msg">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={errors.password ? "input-error" : ""}
              placeholder="Enter password"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-msg">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
