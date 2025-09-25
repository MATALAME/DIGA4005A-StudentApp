import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/SignUp.css";
import bcrypt from "bcryptjs";

function Signup() {
  const navigate = useNavigate();

  // SignUp section
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Create section
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [createPasswordError, setCreatePasswordError] = useState("");
  const [createPasswordMatchError, setCreatePasswordMatchError] = useState("");

  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const allowedDomains = ["students.wits.ac.za", "gmail.com", "icloud.com", "yahoo.com", "example.com"];

  // Function for sign in
  const handleSign = async (event) => {
    event.preventDefault();

    const isEmailValid = allowedDomains.some((domain) => email.endsWith(domain));
    if (!isEmailValid) {
      setEmailError("Email must end with a valid domain like @gmail.com");
      return;
    } else {
      setEmailError("");
    }

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
     
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

     
      const user = users.find((u) => u.email === email);

      if (user) {
      
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
         
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          alert(`Welcome back, ${user.name}!`);
          navigate("/Home");
        } else {
          alert("Invalid email or password. Please try again.");
        }
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function for create account
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    if (createPassword.length < 8) {
      setCreatePasswordError("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(createPassword)) {
      setCreatePasswordError("Password must include at least one capital letter");
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
    } else {
      setCreatePasswordMatchError("");
    }

    try {
      // Check if the email already exists
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      const emailExists = users.some((user) => user.email === createEmail);

      if (emailExists) {
        alert("This email is already registered. Please use a different email.");
        return;
      }

      
      const hashedPassword = await bcrypt.hash(createPassword, 10);

      
      const createResponse = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          password: hashedPassword,
        }),
      });

      if (createResponse.ok) {
        const newUser = await createResponse.json();

        
        localStorage.setItem("loggedInUser", JSON.stringify(newUser));

       
        alert(`Account created for ${createName}! Redirecting to the questionnaire.`);
        navigate("/questionnaire");
      } else {
        alert("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {!showCreateAccount ? (
          <>
            <h2 className="signup-title">SIGN IN</h2>
            <p className="signup-intro">Log in by entering your email address and password</p>

            <form onSubmit={handleSign} className="signup-form">
              <div className="form-group">
                <label className="form-label">EMAIL</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                    onChange={(event) => setPassword(event.target.value)}
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
                {passwordError && <p className="form-error">{passwordError}</p>}
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
                    onClick={() => setShowReenterPassword(!showReenterPassword)}
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
                By creating an account, you agree to the Terms & Conditions and Privacy Policy.
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

        <footer className="signup-footer">© Student Hustle. All rights reserved.</footer>
      </div>
    </div>
  );
}

export default Signup;
