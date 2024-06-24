// import jwt from "jsonwebtoken";

// export async function userLogout(req, res) {
//   try {
//     const authorizationHeader = req.headers.authorization; // no need to clear token from header

//     if (!authorizationHeader) {
//       return res.status(401).json({
//         message: "Unauthorized: Missing Authorization header",
//         success: false,
//         code: 401,
//       });
//     }

//     const token = authorizationHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT_SECRET);

//     return res.status(200).json({
//       message: "Successfully logged out",
//       success: true,
//       code: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(400)
//       .json({ message: "Logout failed", success: false, code: 400 });
//   }
// }

import jwt from "jsonwebtoken";

export function userLogout(req, res) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided", code: 401 });
    }
    const token = authorizationHeader.split(" ")[1];
    return res
      .status(200)
      .json({ message: "Successfully logged out", success: true, code: 200 });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message, success: false, code: 400 });
  }
}
