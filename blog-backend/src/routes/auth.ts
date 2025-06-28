import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { requireAuth, AuthRequest } from "../middleware/auth";
// User is Mongoose model
import { config } from "dotenv";
config();

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  // async so we can await hashing and database
  try {
    const { username, email, password } = req.body;

    // Prevent duplicates
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    // makes random salt string with 10 rounds of complexity, not 10 character work
    // why salt: protects against hacking. Identical pw donot make identical hashes
    console.log("salt", salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //User.create() is shorthand for newUser().save(): writes new record into MongoDB and returns saved documents. It constructs a document and writes it to the users collection.
    // The returned "user" oject includes auto-generated fields like _id, plus createdAt/updatedAt from schema's timestamps.
    console.log("user", user);
    //     {
    //   username: 'rj777',
    //   email: 'rj@gmail.com',
    //   password: '$2b$10$XJJ56ZRuU8sn4OFIR/ylReDVCOK5QGlQeI34kdm3jwGCUjsJsWWbW',
    //   _id: new ObjectId('685d9f005b05b9459b75cc59'),
    //   createdAt: 2025-06-26T19:26:56.305Z,
    //   updatedAt: 2025-06-26T19:26:56.305Z,
    //   __v: 0
    // }

    // Sign a JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    // Payload {userId: user._id} so you can identify the user from the token later.
    // Secret: must match the one you use to verify tokens
    // Options: we set tokent o expire in 1 hour

    console.log("token", token);

    // Return the token
    return res.status(201).json({ token });
    // 201 indicates a new resource was made
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //   Find User by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Sign a fresh JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Server Error" });
  }
});

export default router;
