const { User } = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../Util/ScecretToken.js")


const Signup = async (req, res, next) => {

    try {
        // FETCHING THE DATA FROM THE USER SUBMISSION
        const { name, email, password, created_At } = req.body;
        console.log(name);
        console.log(email);

        //CHECKING THAT USER IS EXISTING OR NOT 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ "message": "THE USER IS ALREADY EXISTING " });
        }

        // CONVERT THE PASSWORD INTO THE HASHED FORM 
        const hashedpassword = await bcrypt.hash(password, 10)

        //CREATE THE NEWUSER FOR ADDING IT TO THE DATABASE 
        const newUser = new User({
            name: name,
            email: email,
            password: hashedpassword,
            created_At: created_At
        });

        // NOW ADD THAT USER INTO THE DATABASE 
        const user = await newUser.save();

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            secure: true,           // required for HTTPS (Render is HTTPS)
            sameSite: "none",
        })

        return res.status(201).json({ message: "USER SIGNED IN SUCCESSFULLY ", success: true, user });

    } catch (error) {

        console.log("Something went wrong : " + error)

    }
}

const Login = async (req, res, next) => {

    try {

        //WE FETCHED THE EMAIL AND PASSWORD THAT GIVEN BY THE USER 
        const { email, password } = req.body;

        //CHECK IS EMAIL AND PASSWORD ARE ENTERED BY THE USER OR NOT 
        if (!email || !password) {

            return res.json({ "message": "ALL FIELDS ARE REQUIRED " });
        }

        // FIND OUT THAT THE USER EXISTS OR NOT IN OUR DATABASE ACCORDING TO THE GIVEN EMAIL 
        const user = await User.findOne({ email });

        //CHECK IS OUR USER EXISTS OR NOT 
        if (!user) {
            return res.json({ "message": "INCORRECT EMAIL AND PASSWORD " })
        }

        // IF THE USER EXISTS THEN WE COMPARE THE GIVEN PASSWORD TO THE EXISTING PASSWORD IN THE DATABASE 
        const auth = await bcrypt.compare(password, user.password);

        //CHECK IS THAT IS PASSWORD ARE MATCHED OR NOT 
        if (!auth) {
            return res.json({ "message": "INCORRECT EMAIL AND PASSWORD " })
        }


        // IF THE PASSWORD IS MATCHED THEN WE CREATE A TOKEN BY USING THE CREATESCRETETOKEN 
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            secure: true,           // required for HTTPS (Render is HTTPS)
            sameSite: "none",
        });

        res.status(201).json({ message: "User logged in successfully", success: true });

    } catch (error) {

        console.log("SOMETHING WENT WRONG : " + error);
        res.status(500).json({ message: "Internal Server Error" });

    }



}

module.exports = { Signup, Login };






