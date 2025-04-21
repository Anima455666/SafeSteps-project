import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // This function will be triggered after successful Telegram login
  window.onTelegramAuth = function (user) {
    console.log('Telegram user:', user);
    
    // Send the user data to the backend for verification
    fetch("http://localhost:5000/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Successfully authenticated, redirect to the payment page
          navigate('/payment');
        } else {
          // Handle invalid login or error
          console.error(data.message);
          alert("Invalid Telegram login.");
        }
      })
      .catch((error) => {
        console.error("Error authenticating user:", error);
        alert("An error occurred. Please try again.");
      });
  };

  useEffect(() => {
    // Dynamically add Telegram login script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'SafeSisterBot'); // replace with your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    document.getElementById('telegram-login-container')?.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Login with Telegram</h2>
        <div id="telegram-login-container"></div>
      </div>
    </div>
  );
}

export default Login;
