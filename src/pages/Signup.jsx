import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/SignUp.css";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

function Signup() {
  const navigate = useNavigate();

  
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const allowedDomains = [
    "students.wits.ac.za",
    "gmail.com",
    "icloud.com",
    "yahoo.com",
    "example.com",
  ];

  // ------------------- SIGN IN -------------------
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!allowedDomains.some((d) => email.endsWith(d))) {
      setError("Email must end with a valid domain like @gmail.com");
      return;
    }

    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError("User record not found in Firestore.");
        return;
      }

      const userData = userSnap.data();

      
      const flattenedUser = {
        id: user.uid,
        name: userData.name || "",
        email: user.email,
        accountType: userData.accountType || "student",
        profile: userData.profile || null,
      };
      localStorage.setItem("loggedInUser", JSON.stringify(flattenedUser));

      
      await setDoc(userRef, { online: true, lastActive: serverTimestamp() }, { merge: true });

      
      toast.success(`Welcome back, ${flattenedUser.name || "User"}!`);
      navigate(flattenedUser.profile ? "/home" : "/questionnaire");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
    }
  };

  // ------------------- SIGN UP -------------------
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!allowedDomains.some((d) => email.endsWith(d))) {
      setError("Email must end with a valid domain like @gmail.com");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must be strong (8+ chars, 1 capital, 1 number)");
      return;
    }
    if (password !== reenterPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name,
        email,
        accountType,
        online: true,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        profile: null, 
      });

      
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: user.uid,
          name,
          email,
          accountType,
          profile: null,
        })
      );

      toast.success(`Account created for ${name}!`);
      navigate("/questionnaire", { state: { accountType } });
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err.message || "Failed to create account. Please check your info.");
    }
  };

  // ------------------- UI -------------------
  return (
    <div className="signup-container">
      <div className="signup-box">
        {!isCreatingAccount ? (
          <>
            <h2 className="signup-title">SIGN IN</h2>
            <p className="signup-intro">Log in by entering your email address and password</p>
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
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="submit-button">Sign In</button>
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

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    value="student"
                    checked={accountType === "student"}
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  Student Account
                </label>
                <label>
                  <input
                    type="radio"
                    name="accountType"
                    value="client"
                    checked={accountType === "client"}
                    onChange={(e) => setAccountType(e.target.value)}
                  />
                  Client Account
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
                  >
                    {showPassword ? "Hide" : "Show"}
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
                    onClick={() => setShowReenterPassword(!showReenterPassword)}
                  >
                    {showReenterPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="submit-button">Create Account</button>
            </form>

            <div className="end-text">
              <p className="short-policy">
                By creating an account, you agree to the Terms & Conditions and Privacy Policy.
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
