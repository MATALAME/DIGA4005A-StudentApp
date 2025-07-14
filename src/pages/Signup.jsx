import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function Signup(){
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const allowedDomains = ["students.wits.ac.za", "gmail.com", "icloud.com", "yahoo.coms"]

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
      navigate("/Home");
    };
    

    return (
        <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">SIGN IN</h2>
          <p className="signup-intro">A world of games is waiting for you</p>
  
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
              <label className="form-label">EMAIL</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              {emailError && <p className="form-error">{emailError}</p>}
            </div>
  
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {passwordError && <p className="form-error">{passwordError}</p>}
            </div>
  
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
  
          <footer className="signup-footer">
            © Student Hustle. All rights reserved.
          </footer>
        </div>
  
        {/* <div className="signup-image-container">
          <img src={signup} alt="Person playing Playstation" className="sign-up-image" />
        </div> */}
      </div>
    );
  }
  



export default Signup; 