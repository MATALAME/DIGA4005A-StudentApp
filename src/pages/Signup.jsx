import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Signup(){
    const navigate = useNavigate();

    //SignUp section
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    //Create section
    const [createName, setCreateName] = useState("");
    const [createPassword, setCreatePassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showReenterPassword, setShowReenterPassword] = useState(false);
    const [createPasswordError, setCreatePasswordError] = useState("");
    const [createPasswordMatchError, setCreatePasswordMatchError] = useState("");


    const [showCreateAccount, setShowCreateAccount] = useState(false); 

    const allowedDomains = ["students.wits.ac.za", "gmail.com", "icloud.com", "yahoo.com"]

    //function for signup
    const handleSign = (event) => {
      event.preventDefault();
    
      const isEmailValid = allowedDomains.some((domain) =>
        email.endsWith(domain)
      );
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
      navigate("/home");
    };

    //function for create
    const handleCreateAccount = (event) => {
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
  
      // alert(`Account created for ${createName}!`);
      // setShowCreateAccount(false);
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
                  <label className="form-label">NAME & SURNAME</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
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
          )  : (
            <div className="create-account-div">
              <h2>Create Your Account</h2>
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
              <p className="short-policy">By creating an account, you agree to the Terms & Conditions and Privacy Policy</p>
              <p className="back-to-sign">Already have an account?</p>

              <button
                type="button"
                className="back-button"
                onClick={() => setShowCreateAccount(false)}
              >
                Log In Here
              </button>
              </div>
            </div>
          )}

  
          <footer className="signup-footer">© Student Hustle. All rights reserved.</footer>
        </div>
      </div>
    );
  }
  
  export default Signup;
  