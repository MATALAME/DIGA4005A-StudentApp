import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { toast } from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../Context/AuthContext";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { addUserToFirestore } from "../firebaseUtils";
import "../Styling/SignUp.css";
import LoadingOverlay from "../Components/LoadingOverlay";


function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const allowedDomains = [
    "students.wits.ac.za",
    "gmail.com",
    "icloud.com",
    "yahoo.com",
    "example.com",
  ];

  const firebaseAuthErrorMessages = (err) => {
    if (!err?.code)
      return "An unexpected error occurred. Please try again.";

    switch (err.code) {
      case "auth/invalid-email":
        return "The email address is badly formatted.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed login attempts. Please try again later.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please sign in.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 8 characters, 1 uppercase letter, and 1 number.";
      case "auth/invalid-credential":
        return "Invalid credentials. Please check your email and password.";
      default:
        return "Authentication failed. Please check your credentials.";
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!allowedDomains.some((d) => email.endsWith(d))) {
      setError("Email must end with a valid domain.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError("User record not found in Firestore.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      await setDoc(
        userRef,
        { online: true, lastActive: serverTimestamp() },
        { merge: true }
      );

      const flattenedUser = {
        id: firebaseUser.uid,
        name: userData.name || "",
        email: firebaseUser.email,
        accountType: userData.accountType || "student",
        profile: userData.profile || null,
      };

      login(flattenedUser);

      toast.success(`Welcome back, ${flattenedUser.name || "User"}!`);
      navigate(flattenedUser.profile ? "/home" : "/questionnaire");
    } catch (err) {
      console.error("Sign-in error:", err);
      const friendlyMessage = firebaseAuthErrorMessages(err);
      toast.error(friendlyMessage);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!allowedDomains.some((d) => email.endsWith(d))) {
      setError("Email must end with a valid domain.");
      setLoading(false);
      return;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError("Password must be strong (8+ chars, 1 capital, 1 number).");
      setLoading(false);
      return;
    }
    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userData = {
        id: firebaseUser.uid,
        name,
        email,
        accountType,
        profile: null,
      };

      await addUserToFirestore({ ...userData, online: true });

      login(userData);
      toast.success(`Account created for ${name}!`);
      navigate("/questionnaire", { state: { accountType } });
    } catch (err) {
      console.error("Sign-up error:", err);
      const friendlyMessage = firebaseAuthErrorMessages(err);
      toast.error(friendlyMessage);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay text="Signing you in..." />;

  return (
    <div className="signup-container">
      <div className="signup-box">
        {!isCreatingAccount ? (
          <>
            <h2 className="signup-title">SIGN IN</h2>
            <p className="signup-intro">
              Log in by entering your email address and password
            </p>
            <form onSubmit={handleSignIn} className="signup-form">
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>

            <div className="Create-Section">
              <button
                type="button"
                className="create-button"
                onClick={() => setIsCreatingAccount(true)}
              >
                Create Account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="signup-title">CREATE ACCOUNT</h2>
            <form onSubmit={handleSignUp} className="create-form">
              <div className="form-group">
                <label className="form-label">NAME & SURNAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="account-type-options">
                <label
                  className={`account-option ${
                    accountType === "student" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="student"
                    checked={accountType === "student"}
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  <span className="check-icon">
                    <FiCheck />
                  </span>
                  <span className="option-text">Student</span>
                </label>

                <label
                  className={`account-option ${
                    accountType === "client" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value="client"
                    checked={accountType === "client"}
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  <span className="check-icon">
                    <FiCheck />
                  </span>
                  <span className="option-text">Client</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">RE-ENTER PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showReenterPassword ? "text" : "password"}
                    className="form-input"
                    value={reenterPassword}
                    onChange={(e) => setReenterPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() =>
                      setShowReenterPassword(!showReenterPassword)
                    }
                    aria-label={
                      showReenterPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showReenterPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="submit-button">
                Create Account
              </button>
            </form>

            <div className="end-text">
              <p className="short-policy">
                By creating an account, you agree to the Terms & Conditions and
                Privacy Policy.
              </p>
              <p className="back-to-sign">
                Already have an account?{" "}
                <button
                  type="button"
                  className="signup-link"
                  onClick={() => setIsCreatingAccount(false)}
                >
                  Log in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
