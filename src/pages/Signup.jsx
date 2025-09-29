import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/SignUp.css";
import bcrypt from "bcryptjs";
import { addUserToFirestore, setUserOnlineStatus } from "../firebaseUtils";

function Signup() {
  const navigate = useNavigate();

  // SignIn state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Create account state
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [createPasswordError, setCreatePasswordError] = useState("");
  const [createPasswordMatchError, setCreatePasswordMatchError] =
    useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [accountType, setAccountType] = useState("student");

  const allowedDomains = [
    "students.wits.ac.za",
    "gmail.com",
    "icloud.com",
    "yahoo.com",
    "example.com",
  ];

  // ------------------ SIGN IN ------------------
  const handleSign = async (event) => {
    event.preventDefault();

    // Email validation
    if (!allowedDomains.some((d) => email.endsWith(d))) {
      setEmailError("Email must end with a valid domain like @gmail.com");
      return;
    } else setEmailError("");

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must include at least one capital letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must include at least one number");
      return;
    }
    setPasswordError("");

    try {
      const response = await fetch("http://localhost:5001/users");
      const users = await response.json();
      const user = users.find((u) => u.email === email);

      if (!user) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      // Ensure user has an id (fallback to email if old users)
      const userWithId = { ...user, id: user.id || user.email };
      localStorage.setItem("loggedInUser", JSON.stringify(userWithId));

    
      setUserOnlineStatus(user.email, true);

      alert(`Welcome back, ${user.name}!`);
      setTimeout(() => navigate("/home"), 100);
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // ------------------ CREATE ACCOUNT ------------------
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (createPassword.length < 8) {
      setCreatePasswordError("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(createPassword)) {
      setCreatePasswordError(
        "Password must include at least one capital letter"
      );
      return;
    }
    if (!/[0-9]/.test(createPassword)) {
      setCreatePasswordError("Password must include at least one number");
      return;
    }
    setCreatePasswordError("");

    if (createPassword !== reenterPassword) {
      setCreatePasswordMatchError("Passwords do not match");
      return;
    } else setCreatePasswordMatchError("");

    try {
      const response = await fetch("http://localhost:5001/users");
      const users = await response.json();
      if (users.some((u) => u.email === createEmail)) {
        alert(
          "This email is already registered. Please use a different email."
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(createPassword, 10);

      // Create user in JSON Server
      const createResponse = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now().toString(),
          name: createName,
          email: createEmail,
          password: hashedPassword,
          accountType,
        }),
      });

      if (!createResponse.ok) {
        alert("Failed to create account. Please try again.");
        return;
      }

      const newUser = await createResponse.json();

      localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    
      addUserToFirestore(newUser);
      setUserOnlineStatus(newUser.email, true);

      alert(`Account created for ${createName}!`);
      setTimeout(
        () => navigate("/questionnaire", { state: { accountType } }),
        100
      );
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // ------------------ UI ------------------
  return (
    <div className="signup-container">
      <div className="signup-box">
        {!showCreateAccount ? (
          <>
            <h2 className="signup-title">SIGN IN</h2>
            <p className="signup-intro">
              Log in by entering your email address and password
            </p>

            <form onSubmit={handleSign} className="signup-form">
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <p className="form-error">{emailError}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">PASSWORD</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input password-input"
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
                {passwordError && (
                  <p className="form-error">{passwordError}</p>
                )}
              </div>

              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>

            <div className="Create-Section">
              <button
                type="button"
                className="create-button"
                onClick={() => setShowCreateAccount(true)}
              >
                Create Account
              </button>
            </div>
          </>
        ) : (
          <div className="create-account-div">
            <h2>CREATE YOUR ACCOUNT</h2>

            <form onSubmit={handleCreateAccount} className="create-form">
              <div className="form-group">
                <label className="form-label">NAME & SURNAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
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
                    type={showCreatePassword ? "text" : "password"}
                    className="form-input"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                  >
                    {showCreatePassword ? "Hide" : "Show"}
                  </button>
                </div>
                {createPasswordError && (
                  <p className="form-error">{createPasswordError}</p>
                )}
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
                  >
                    {showReenterPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {createPasswordMatchError && (
                  <p className="form-error">{createPasswordMatchError}</p>
                )}
              </div>

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
                  onClick={() => setShowCreateAccount(false)}
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
