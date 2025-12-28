// // authorize.middleware.js
// const roles = require('../../../config/role.config');

// const authorize = (requiredPermission) => {
//     return (req, res, next) => {
//         console.log("middewlware start ===========================================>")
//         // Ensure req.user exists (populated by your auth middleware)
//         if (!req.user) {
//             return res.status(401).json({ message: 'Unauthorized: No user found.' });
//         }

//         // Using the instance method to check roles
//         const userRoles = req.user.user_type;
//         console.log(userRoles)
//         let isAllowed = false;
//         userRoles.forEach(role => {
//             const permissions = roles[role];
//             if (permissions && permissions.includes(requiredPermission)) {
//                 isAllowed = true;
//             }
//         });

//         if (!isAllowed) {
//             return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
//         }

//         next();
//     };
// };

// module.exports = authorize;
