import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Reg from "../../model/registration/modulereg.js";
import Astro from "../../model/astrologer/moduleastro.js";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log("hgfhfg", email, password);
    let passwordMatch = null;
    const user = await Reg.findOne({ email: email });
    console.log("user", user);
    //Invalid email or password
    if (user) {
      passwordMatch = await bcrypt.compare(password, user?.password);
    }
    if (!user || !passwordMatch) {
      //Start Astrologer Login
      const astro = await Astro.findOne({ email: email });
      console.log("astro----",astro);
      if (!astro) { 
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password", code: 400 });
      }

      const apasswordMatch = await bcrypt.compare(password, astro?.password);

      if (!apasswordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid email or password", success: false, code: 400 });
      } else {
        const token = jwt.sign({ user: astro._id }, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });

        return res.status(200).json({
          message: "Successfully logged in",
          data: astro,
          accessToken: token,
          success: true,
          code: 200,
        });
      }
      //End Astrologer Login
    }

    //const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false, code: 400 });
    } else {
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      return res.status(200).json({
        message: "Successfully logged in",
        data: user,
        accessToken: token,
        success: true,
        code: 200,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message, success: false, code: 400 });
  }
}
