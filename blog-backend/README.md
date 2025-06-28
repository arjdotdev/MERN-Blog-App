npm install express jsonwebtoken bcrypt mongoose

What is mongoose?
mongoose: schema-based ORM for MongoDB

Step1: Setup backend(setup express server running at some port) and frontend(create a react app with tailwind)

Step 2: hooking up your backend to MongoDB with Mongoose.
MONGO_URI is a connection string that tells Mongoose where to find your database.
Ways to run MongoDB:
a. locally via Docker: docker installs mongoDB for you inside an isloated environment. It spins up a new container from that image (which are minimal Linux userland and mongodb binary). Inside the container, it runs mongodb. You do not install MongoDB on your OS but the container has everything it needs.
b. locally by installing MongoDB //resource heavy and slows laptop
c. MongoDB Atlas

Step 3: Create a User Schema

Mongoose"Schema" vs "Document"

export interface IUser extends Document {
username: string;
email: string;
password: string;
createdAt: Date;
updatedAt: Date;
}

Extending "Document" adds Mongoose's document methods like .save(), .populate() and the built-in "\_id" property. A "Document" is an individual record in MongoDB collection.

const UserSchema = new Schema<IUser>(
{
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
},
{ timestamps: true }
);

new Schema<IUser>(...) tells TypeScript that documents from this schema conform to our IUser interface. Inside the first object, you define each field i.e. "type:String" JS constructor that maps to MongoDB BSON type, "required:true" validation rule-must be present, "unique:true" creates a database index to enforce uniqueness.

{timestamps:true} is a schema option that automatically adds and maintains "createdAt" and "updatedAt" Date fields on each document.

export default mongoose.model<IUser>('User', UserSchema);
mongoose.model<T>(name, schema) compiles the schema into a Model class. The generic <IUser> ensures that whenever you call, User.findById(), YS knows you will get an object matching IUser.
The User is a model name under the hood Mongoose will look for a MongoDB collection called users(lowercased, plurralized)

You Export this model so elsewhere in your code you can do things like:
import User from './models/User';

// Creating a new user document
const u = new User({ username: 'alice', email: '…', password: '…' });
await u.save();

// Querying
const found = await User.findOne({ email: 'alice@example.com' });

Schema: the structure, types, and rules for your data.

Document: actual records/objects that live in MongoDB and follow that schema.

Model: the compiled class you use in your code to create, query, update, and delete those documents, with full TypeScript support via your IUser interface.

<!-- Lets continue even though the Mongoose is confusing. Lets move on and see it might make sense at last -->

User.findOne({email}) queries MongoDB for any existing user with that email

Step 4: Add Login EndPoint
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
Note: We never expose whether it was the email or password that failed- just "Invalid Credentials."
We re-issue a JWT on every login, with a fresh expiration.

Step 5: Create an Auth Middleware
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
userId: string;
}
// defines TS interface what our JWT payload should contain after verification.
// In our case, when we signed tokens we embedded {userId:user.\_id}, so we expect to get back an object with userId:string

export interface AuthRequest extends Request {
userId?: string;
}
//

export const requireAuth = (
req: AuthRequest,
res: Response,
next: NextFunction
) => {
// 1) Grab the token from headers (you can also use cookies)
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith("Bearer ")) {
return res.status(401).json({ message: "No token provided" });
}
const token = authHeader.split(" ")[1];

try {
// 2) Verify token
const payload = jwt.verify(
token,
process.env.JWT_SECRET as string
) as JwtPayload;

    // 3) Attach userId to the request object
    req.userId = payload.userId;
    next();

} catch {
return res.status(401).json({ message: "Invalid token" });
}
};

A standard middleware always takes (req, res, next)

try {
const payload = jwt.verify(
token,
process.env.JWT_SECRET as string
) as JwtPayload;
jwt.verify(token, secret) checks the signature and expiration
if token is invalid, it throws an error caught below.
We cast the returned payload to our JwtPayload type so TS knows it has userId.

    req.userId = payload.userId;
    next();

} catch {
return res.status(401).json({ message: 'Invalid token' });
}

On success, we store payload.userId on req.userId
Calling next() passes control to next handler
On failure, we give back 401 unauthorized error.

Flow upto auth
connect to DB
Define User Schema
register: takes form info-> checks if email exists->hash Password->save to Database->sign token and give it back as response
login: takes email and pw, checks if email exists(if no email exist, error), checks if pw match or not-> sign token and give it back as response

What are we doing with the token we get as response from register and login?
We save it to client localstorage or session storage

authMiddleware: takes token from headers.authorization-> checks if starts with Bearer->extract token only->jwt.verify our token->call next()
