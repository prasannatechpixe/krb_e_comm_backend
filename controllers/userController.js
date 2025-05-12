const async = require("async");
const fs = require("fs");
const client = require("../db/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../middlewares/functions")();
const sendEmail = require("../utils/nodemailer");
const { decrypt } = require("dotenv");
const User = require('../models/userModel');
const path = require('path');
const { counter } = require("speakeasy");
const { error } = require("console");

// Define upload directory based on environment
const domain = process.env.NODE_ENV === 'production' ? 'camcapture.smartaihr.com' : 'localhost:3000';


exports.deviceinfo = async (req, res) => {
  const ipAddress = getipfromRequest(req);
  const split = ipAddress.split(":");
  const load = split[3];
  const deviceInfo = getdeviceinfo(req);
  const location = getiptolocation(load);
  const data = JSON.parse(str);
  console.log({ location, deviceInfo, load });
  let _res = ({ data, location, ipAddress, deviceInfo, responsecode: 0 });
  res.setHeader("responseheader", encryptresponse(_res));
  res.send(_res);
};

exports.Register = async (req, res) => {
  const { email, password, username, phoneno, country } = req.body;
  if (isEmptyOrNull(email) || isEmptyOrNull(password) || isEmptyOrNull(username) || isEmptyOrNull(phoneno) || isEmptyOrNull(country)) {
    return res.status(500).json({ success: false, message: "All fields are required", responsecode: 0 });
  } else {
    try {
      client.query('SELECT * FROM "Users" WHERE email = $1', [email.toLowerCase()], async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
        }
        else if (foundUser.rowCount === 1) {
          return res.status(500).json({ success: false, message: "Email already exists, please login to access your account", responsecode: 201 });
        }
        if (foundUser.rowCount === 0) {
          bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
            } else {
              const user = {
                email,
                username,
                phoneno,
                password: hash,
                user_status: "Pending",
                users_profile_picture: 'https://myaltpay.fra1.cdn.digitaloceanspaces.com/profile.png',
                country,
                role: "user",
              };
              client.query(`INSERT INTO "Users"(name, email, phoneno, password, profilepic, status, country, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [user.username, user.email.toLowerCase(), user.phoneno, user.password, user.users_profile_picture, user.user_status, user.country, user.role],
                async (err, result) => {
                  if (err) {
                    return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
                  }
                  const uid = customencrypt(result.rows[0].id);
                  const Eemail = customencrypt(email);
                  const user_full_name = user.username;
                  const message = `<a style='background: #8357d4; padding: 15px 35px; text-align: center; font-size: 16px; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;' href='${process.env.websiteurl}accountverify/${uid}/${Eemail}'>Verify</a>`;
                  sendEmail({
                    to: email,
                    subject: "Email Verification",
                    text: getOtpEmailTemplate(user_full_name, message),
                    priority: 'High'
                  });
                  return res.status(200).json({ success: true, message: "OTP sent to your email", Eemail, uid, responsecode: 200 });
                }
              );
            };
          });
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Database error while registering user", responsecode: -1 });
    }
  }
};


exports.ValidateRegister = async (req, res) => {
  const { Eemail, uid } = req.body;
  if (isEmptyOrNull(Eemail) || isEmptyOrNull(uid)) {
    return res.status(500).json({ success: false, message: "All fields are required", responsecode: 0 });
  } else {
    const Email = customdecrypt(Eemail);
    const userid = customdecrypt(uid);
    const query = `SELECT * FROM "Users" WHERE id = $1 and email = $2`;
    const values = [Number(userid), Email];

    client.query(query, values, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
      } else {
        if (foundUser.rowCount === 0) {
          return res.status(500).json({ success: false, message: "User not found", responsecode: -9 });
        } else if (foundUser.rowCount === 1) {
          if (foundUser.rows[0].status === "Pending") {
            const userStatus = "Active";
            const query = `UPDATE "Users" SET status = $1 WHERE id = $2 AND email = $3`;
            const values = [userStatus, userid, Email];
            client.query(query, values, async (err, result) => {
              if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
              } else if (result.rowCount === 1) {
                return res.status(200).json({ success: true, message: "Email Verification Done", responsecode: 200 });
              } else {
                return res.status(500).json({ success: false, message: "Unable to verify, try again sometime", responsecode: -1 });
              }
            });
          } else if (foundUser.rows[0].status === "Active") {
            return res.status(201).json({ success: false, message: "Already verified", responsecode: 201 });
          } else {
            return res.status(500).json({ success: false, message: "Unable to access, please try again", responsecode: 202 });
          }
        } else if (foundUser.rowCount > 1) {
          return res.status(500).json({ success: false, message: "Duplicate data found", responsecode: 201 });
        }
      }
    });
  }
};


exports.Login = async (req, res) => {
  const { email, password } = req.body;
  if (isEmptyOrNull(email) || isEmptyOrNull(password)) {
    return res.status(500).json({ success: false, message: "Some details are missing", responsecode: 0 });
  } else {
    try {
      const query = `SELECT u.*,COUNT(c."userId") AS cart_count FROM "Users" u LEFT JOIN "Carts" c ON u.id = c."userId"::integer WHERE u.email = $1 GROUP BY u.id;`;
      const values = [email];

      client.query(query, values, async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: 1 });
        } else if (foundUser.rowCount === 1) {
          if (foundUser.rows[0].status === "Active") {
            const hashedPassword = bcrypt.compareSync(password, foundUser.rows[0].password);
            if (!hashedPassword) {
              return res.status(500).json({ success: false, message: "Wrong Password", responsecode: 500 });
            } else {
              const token = jwt.sign({ email: foundUser.rows[0].email, role: foundUser.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '9h' });
              const query = 'UPDATE "Users" SET token = $1 WHERE email = $2 RETURNING id, name, email, country, phoneno, status, role, profilepic';
              const values = [token, email];
              client.query(query, values, (err, tokenUpdate) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err.message, responsecode: 2 });
                } else if (tokenUpdate.rowCount === 0) {
                  return res.status(200).json({ success: false, message: "Something went wrong", responsecode: 200 });
                } else {
                  return res.status(200).json({ success: true, message: "Login Successful", token, profiledata: tokenUpdate.rows[0], cartcount: foundUser.rows[0].cart_count, responsecode: 200 });
                }
              });
            }
          } else {
            return res.status(500).json({ success: false, message: `Account is on ${foundUser.rows[0].status}`, responsecode: 500 });
          }
        } else if (foundUser.rowCount > 1) {
          return res.status(500).json({ success: false, message: "Duplicate data found", responsecode: 500 });
        } else if (foundUser.rowCount === 0) {
          return res.status(500).json({ success: false, message: "No Email Registered With This Mail-Id", responsecode: 500 });
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
    }
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (isEmptyOrNull(email)) {
    return res.status(500).json({ success: false, message: "Details are Missing", responsecode: 500 });
  } else {
    try {
      const query = `SELECT * FROM "Users" WHERE email = $1`;
      const values = [email];

      client.query(query, values, async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
        } else {
          if (foundUser.rowCount === 0) {
            return res.status(500).json({ success: false, message: "Email not found", responsecode: 500 });
          } else if (foundUser.rowCount === 1) {
            const user_full_name = foundUser.rows[0].name;
            const uid = customencrypt(foundUser.rows[0].id);
            const Eemail = customencrypt(foundUser.rows[0].email);
            const message = "<a style='background: #8357d4; padding: 15px 35px; text-align: center; font-size: 16px; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;' href='" + process.env.websiteurl + `resetpassword/${uid}/${Eemail}` + "'>Reset Password</a>";

            sendEmail({
              to: email,
              subject: "Password Reset Request",
              text: getForgotPasswordEmailTemplate(user_full_name, message),
              priority: 'High'
            });

            return res.status(201).json({ success: true, message: "Reset Link sent", responsecode: 201 });
          } else if (foundUser.rowCount > 1) {
            return res.status(500).json({ success: false, message: "Duplicate data found", responsecode: 500 });
          }
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Email could not be sent", responsecode: 500 });
    }
  }
};


exports.resetpassword = async (req, res) => {
  const { Eemail, uid, new_password } = req.body;

  if (isEmptyOrNull(Eemail) || isEmptyOrNull(uid)) {
    return res.status(500).json({ success: false, message: "Details are Missing", responsecode: 0 });
  } else {
    try {
      const decodedID = customdecrypt(uid);
      const decodedEmail = customdecrypt(Eemail);
      const new_passwordHash = bcrypt.hashSync(new_password, 10);

      const query = `SELECT * FROM "Users" WHERE email = $1 AND id = $2`;
      const values = [decodedEmail, decodedID];
      client.query(query, values, async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: -1 });
        } else if (foundUser.rowCount === 1) {
          const query = `UPDATE "Users" SET password = $1 WHERE email = $2 AND id = $3`;
          const values = [new_passwordHash, decodedEmail, decodedID];
          client.query(query, values, async (err, data) => {
            if (err) {
              return res.status(500).json({ success: false, message: err.message, responsecode: -2 });
            } else {
              if (data.rowCount === 0) {
                return res.status(500).json({ success: false, message: "Password Not updated", responsecode: -1 });
              } else if (data.rowCount === 1) {
                return res.status(200).json({ success: true, message: "Password updated", responsecode: 200 });
              } else if (data.rowCount > 1) {
                return res.status(500).json({ success: false, message: "Duplicate data found", responsecode: -1 });
              }
            }
          });
        } else {
          return res.status(500).json({ success: false, message: "User not found", responsecode: 500 });
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message, responsecode: -500 });
    }
  }
};


exports.ChangePassword = async (req, res) => {
  const { token, old_password, new_password } = req.body;

  if (isEmptyOrNull(token) || isEmptyOrNull(old_password) || isEmptyOrNull(new_password)) {
    return res.status(400).json({ success: false, message: "Details are Missing", responsecode: 400 });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const email = decoded.email;

      const query = 'SELECT * FROM "Users" WHERE email = $1';
      const values = [email];

      client.query(query, values, async (err, foundUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
        }
        else if (foundUser.rowCount === 1) {
          const userID = foundUser.rows[0].id;
          const old_hashedPassword = bcrypt.compareSync(old_password, foundUser.rows[0].password);

          if (old_hashedPassword === true) {
            const new_passwordHash = bcrypt.hashSync(new_password, 10);
            const updateQuery = 'UPDATE "Users" SET password = $1 WHERE email = $2 AND id = $3';
            const updateValues = [new_passwordHash, email, userID];

            client.query(updateQuery, updateValues, (err, result) => {
              if (err) {
                return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
              } else if (result.rowCount === 1) {
                return res.status(200).json({ success: true, message: "Password changed", responsecode: 200 });
              } else {
                return res.status(500).json({ success: false, message: "Password not updated", responsecode: 500 });
              }
            });
          } else {
            return res.status(400).json({ success: false, message: "Old password doesn't match", responsecode: 400 });
          }
        } else {
          return res.status(404).json({ success: false, message: "User Not Found", responsecode: 400 });
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message, responsecode: 500 });
    }
  };
};


exports.ContactForm = async (req, res) => {
  try {
    const { message, name, email, phone } = req.body;

    // Validate input fields
    if (!message || !name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate email content using the provided template
    const emailContent = getContactFormEmailTemplate(name, email, phone, message);

    // Send email
    const emailResponse = await sendEmail({
      to: "krbmetaldetectors@gmail.com",
      subject: "Contact Request",
      text: emailContent,
    });

    // Handle the response based on the email sending status
    if (emailResponse.success) {
      return res.status(200).json({ success: true, message: 'Email sent successfully', data: emailResponse });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send email', error: emailResponse.error });
    }
  } catch (error) {
    console.error("Error sending contact form email:", error);
    return res.status(500).json({ error: "Failed to send email", details: error.message });
  }
};

// manual pdf uplaod (Admin Only)
exports.profileUpdate = async (req, res) => {
  const { token, name, phoneno } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing required fields", responsecode: 1 });
  } else {
    getUserProfileFromToken(token, async (err, foundUser) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message, responsecode: 3 });
      } else {
        try {
          const profilePic = req.file ? `https://${domain}/uploads/profilePics/${req.file.filename}` : foundUser.profilepic;

          // Ensure oldImageUrls is an array
          const oldImageUrls = Array.isArray(foundUser.profilepic) ? foundUser.profilepic : (foundUser.profilepic ? [foundUser.profilepic] : []);

          // Find images to delete
          const imagesToDelete = oldImageUrls.filter(oldUrl => oldUrl !== profilePic);

          // Delete the old images from the filesystem
          imagesToDelete.forEach(imageUrl => {
            if (imageUrl.includes('/uploads/profilePics/')) { // Adjusted for profilePics
              const fileName = imageUrl.split('/uploads/profilePics/')[1];
              const filePath = path.join(__dirname, '..', 'uploads', 'profilePics', fileName);

              fs.unlink(filePath, (err) => {
                if (err) {
                  console.error(`Failed to delete file: ${filePath}`, err);
                } else {
                  console.log(`Deleted file: ${filePath}`);
                }
              });
            } else {
              console.warn(`Skipping invalid image URL: ${imageUrl}`);
            }
          });

          // Retain existing values if not provided
          const user = {
            id: foundUser.id,
            name: name || foundUser.name,
            profilepic: profilePic,
            phoneno: phoneno || foundUser.phoneno,
          };

          // Update user in the database
          const updateQuery = `UPDATE public."Users" SET name = $1, phoneno = $2, profilepic = $3 WHERE id = $4 RETURNING id, name, email, country, phoneno, status, role, profilepic`;
          const updateValues = [user.name, user.phoneno, user.profilepic, user.id];

          const updateResult = await client.query(updateQuery, updateValues);

          if (updateResult.rowCount === 1) {
            return res.status(200).json({ success: true, message: "Profile updated", profile: updateResult.rows[0], responsecode: 6 });
          } else {
            return res.status(500).json({ success: false, message: "Failed to update profile", responsecode: 7 });
          }
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message, debug: error, responsecode: 8 });
        }
      }
    });
  }
};


exports.Logout = async (req, res) => {
  const { token } = req.body;

  if (isEmptyOrNull(token)) {
    return res.status(400).json({ success: false, result: "Token not found", responsecode: 0 });
  } else {
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      return res.status(200).json({ success: true, message: "Logout successful.", responsecode: 200 });
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token", responsecode: -1 });
    }
  };
};