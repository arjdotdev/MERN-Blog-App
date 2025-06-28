Scaffold & Tooling (4–6 hrs)

Backend: TypeScript + Express + dotenv + Mongoose + “Hello world” endpoint

Frontend: CRA (TS) + Tailwind + basic router setup

Verify health endpoints and styling

Database & Auth (6–8 hrs)

Connect to MongoDB, define User schema

/api/auth/register & /api/auth/login endpoints

Password hashing (bcrypt) + JWT issuance

Auth UI & State (6–8 hrs)

Build signup/login forms (no lib)

Wire up Context API for auth state

Persist token (HTTP-only cookie or localStorage)

Posts Backend CRUD (6–8 hrs)

Define Post schema (title, body, author, timestamps)

POST/GET/PUT/DELETE /api/posts endpoints with population

Posts Frontend (8–10 hrs)

List, detail, create/edit/delete pages

Fetch data via fetch or axios, update Context

Comments Feature (6–8 hrs)

Comment schema & endpoints (/api/posts/:id/comments)

UI to add/list comments under a post

Routing & Code-Splitting (4–6 hrs)

Organize routes with react-router-dom

Lazy-load heavy pages using React.lazy + Suspense

Basic Testing (4–6 hrs)

React Testing Library: a few unit tests for forms & context

Jest (or supertest) for one or two backend routes

Docker & Docker Compose (4 hrs)

Dockerfile for both services

Compose file for backend + Mongo + frontend (optional)

CI/CD with GitHub Actions (6 hrs)

Lint, type-check, test on each PR

Build & push Docker images to registry

AWS Deployment (6–8 hrs)

Push images to ECR

Deploy to ECS Fargate (or Elastic Beanstalk)

Configure env vars via Secrets Manager

Social Login & Final Polishing (6 hrs)

Add Google OAuth to your JWT flow (later swap in Auth0 if desired)

Clean up UI, fix edge-case bugs, add final tests

Buffer & Bugfixes (8 hrs)

Address any unexpected blockers

Polish UX, handle error states, finalize README

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
