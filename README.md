
Here’s a concise yet comprehensive documentation for your authentication project, based on what we’ve worked on together:

Project Documentation: Authentication System with 2FA and JWT
Overview
This project is an Authentication System that incorporates features such as:

. JWT-based authentication.
. Email verification.
. Password reset.
. Two-Factor Authentication (2FA) using OTP sent via email.
. Role-based access control (e.g., for clients and delivery personnel).
. The backend is developed using Node.js with Express, and the frontend is built using React. Data is stored  using MongoDB.



Here’s a concise yet comprehensive documentation for your authentication project, based on what we’ve worked on together:

Project Documentation: Authentication System with 2FA and JWT
Overview
This project is an Authentication System that incorporates features such as:

JWT-based authentication.
Email verification.
Password reset.
Two-Factor Authentication (2FA) using OTP sent via email.
Role-based access control (e.g., for clients and delivery personnel).
The backend is developed using Node.js with Express, and the frontend is built using React. Data is stored using MongoDB.

Technologies Used
Backend
Node.js: JavaScript runtime for building the server-side logic.
Express: Web framework for handling routes and requests.
Mongoose: ODM for MongoDB to handle database interactions.
JWT (JSON Web Token): Used for session management and securing routes.
bcryptjs: For hashing and comparing passwords securely.
Nodemailer: To send OTPs and verification emails.
dotenv: To manage environment variables.

Frontend
React: JavaScript library for building the user interface.
Axios: For making HTTP requests between the frontend and backend.
React Router: For handling different routes in the application.


Project Structure

Backend
├── config
│   └── db.js            # MongoDB connection
├── controllers
│   └── authController.js # Handles registration, login, OTP verification, etc.
├── models
│   └── User.js           # User schema, storing user data, including hashed password and OTP
├── routes
│   └── authRoutes.js     # Defines the routes for authentication actions (login, registration, etc.)
├── services
│   └── emailService.js   # Service to send verification and OTP emails
├── .env                  # Contains environment variables
└── server.js             # Entry point, starts the server


Frontend

src
├── 
│   └── RegistrationForm.jsx  # Registration form component
│   └── LoginForm.jsx         # Login form component
│   └── VerifyEmail.jsx       # Component for email verification
│   └── ForgotPassword.jsx    # Handles forgot password functionality
│   └── ResetPassword.jsx     # Handles resetting the password
├── context
│   └── UserContext.jsx       # Global state for managing user session
└── App.js                    # Main component handling routing



2. Login with 2FA (OTP)
If the user hasn’t logged in for a month, they will be asked to enter an OTP sent to their email before they can fully log in.

Backend:

Route: POST /api/users/login

Controller Function: login

OTP Generation:

If the user’s last login was more than 30 days ago, an OTP is generated and sent via email.
The user’s login is not completed until they enter the correct OTP.
Route: POST /api/users/verify-otp

Controller Function: verifyOTP

Frontend:

After successful login with email and password, if the OTP is required, the user is redirected to the OTP verification page.
3. Password Reset
Users can reset their password by clicking “Forgot Password” and following the steps to reset their password via an email link.

Backend:

Route: POST /api/users/forgot-password
Controller Function: forgotPassword
Route: POST /api/users/reset-password/:token
Controller Function: resetPassword
Frontend:

A form to request a password reset link and another form to set a new password.
4. Email Verification
The user receives a link with a JWT token for verifying their email. When they click the link, they are directed to the verification page, and the token is validated in the backend.

Backend:
Route: GET /api/users/verify/:token
Controller Function: verifyEmail
Frontend:
The verification page handles checking the token by calling the backend API.

How to Run the Project
- Backend
    1- Install dependencies:

            npm install
    
    2- Set up your .env file with:
            DB_URI: MongoDB connection string.
            PORT: Server port.
            JWT_SECRET: Secret for signing JWT tokens.
            EMAIL_USER and EMAIL_PASS: Credentials for sending emails.

    3- Start the backend server:
            npm start

- Frontend
    1- Navigate to the frontend directory and install dependencies:

            npm install

    2- Start the React frontend:

            npm start


    Conclusion
    
    This authentication system provides secure user registration, login, and OTP-based 2FA, ensuring a strong level of security for sensitive operations. It also includes email verification and password reset flows, 
    giving users a robust and complete authentication experience.




