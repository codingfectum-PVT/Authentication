// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken'); 
// const pool = require('./db');
// const validator = require ('validator');
// const nodemailer = require ('nodemailer');

// const app = express();
// app.use(express.json());
// const userRoutes = require('./Routes/routes')
// app.use('/', userRoutes);
// const JWT_SECRET = 'JWT secret key'; 


// //......... SIGNUP ............//
// const createUser = async (req, res) => {
//   const { name, email, password, age } = req.body;
//   try {
//     if (!name || !email || !password || !age) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const existingUser = await pool.query('SELECT * FROM usersdata WHERE email = $1', [email]);
// if (existingUser.rows.length > 0) {
//   return res.status(400).json({ message: "Email already exists" });
// }

//     if (isNaN(age)) {
//     return res.status(400).json({ error: 'Age must be a number' });
//   }

//     if (password.length < 6) {
//       return res.status(400).json({ error: 'password miust be at least 6 charater' });
//     }
//      const specialChars = "!@#$%^&*_-\|/";
//           let hasSpecialChar = false;
//         for (let i = 0; i < password.length; i++) {
//           if (specialChars.includes(password[i])) {
//                hasSpecialChar = true;
//         break;
//            }
//     }
//     if (!hasSpecialChar) {
//       return res.status(400).json({message: "Password must include at least one special character (!@#$%^&*_-\\/)"});
//     }       

//     if (!validator.isEmail(email)) {               
//       return res.status(400).json({ message: "Invalid email format" });  //valid email format
//     }

//     function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'alexhash95@gmail.com', 
//     pass: 'dseg yntw lxya gtjj'     
//   }
// });

// const otp = generateOTP();
//     await transporter.sendMail({
//       from: 'alexhash95@gmail.com',
//       to: email,
//       subject: 'Verify your Email',
//       text: `Your OTP code is: ${otp}`
//     });


//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const result = await pool.query(
//       'INSERT INTO usersdata (name, email, password, age, otp, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//       [name, email, hashedPassword, age, otp, false]
//     );

//     res.status(201).json({ message: "Verification code sent to your email." });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };


// //............ OTP VERIFICATION............//
// const verifyCode = async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM usersdata WHERE email = $1 AND otp = $2', [email, otp]);
//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid OTP or Email' });
//     }

//     await pool.query('UPDATE usersdata SET verified = true, otp = NULL WHERE email = $1', [email]);
//     res.json({ message: 'Email verified successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };


// //............. LOGIN ...............//
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userResult = await pool.query('SELECT * FROM usersdata WHERE email = $1', [email]);
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     const user = userResult.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ msg: 'Invalid password' });
//     }
//     if (!user.verified) {
//   return res.status(401).json({ msg: 'Email not verified' });
// }
//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '5h' });
//     res.json({ msg: 'Login successful', token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
// //   }
// // };


// //.............. FORGOT PASSWORD ................//
// const forgotPassword =  async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await pool.query('SELECT * FROM usersdata WHERE email = $1', [email]);
//     if (user.rows.length === 0) {
//       return res.status(404).json({ message: "Email not found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await pool.query('UPDATE usersdata SET reset_otp = $1 WHERE email = $2', [otp, email]);

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'alexhash95@gmail.com',
//         pass: 'dseg yntw lxya gtjj'
//       }
//     });

//     await transporter.sendMail({
//       from: 'alexhash95@gmail.com',
//       to: email,
//       subject: 'Reset Your Password',
//       text: `Your OTP for password reset is: ${otp}`
//     });

//     res.json({ message: "OTP sent to email" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };


// //................ RESET PASSWORD ................//
// const resetPassword =  async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   try {
//     const result = await pool.query('SELECT * FROM usersdata WHERE email = $1 AND reset_otp = $2', [email, otp]);

//     if (result.rows.length === 0) {
//       return res.status(400).json({ message: "Invalid OTP or email" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     await pool.query('UPDATE usersdata SET password = $1, reset_otp = NULL WHERE email = $2', [hashedPassword, email]);

//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// //.................. GET USER ...................//
// const getUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }
//     if (!password) {
//       return res.status(400).json({ message: 'Password is required' });
//     }
//     const userResult = await pool.query('SELECT * FROM usersdata WHERE email = $1', [email]);
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const user = userResult.rows[0];
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }
//     const userData = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       age: user.age,
//       verified: user.verified
//     }; res.status(200).json(userData);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// //................. DELETE .................//
// const deleteUser = async (req, res) => {
//   const { email, password } = req.body;
//   try{
//     const userId = req.user.id;
//     const result = await pool.query('DELETE FROM usersdata WHERE id = $1',  [userId] );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'User not found or already deleted' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }
//     res.json({ message: 'User deleted successfully'});
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });

// module.exports = {
//     createUser,
//     verifyCode,
//     loginUser,
//     forgotPassword,
//     resetPassword,
//     getUser,
//     deleteUser
// };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require('express');
// const app = express();
// app.use(express.json());

// const userRoutes = require('./Routes/routes')
// app.use('/', userRoutes);


// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });



