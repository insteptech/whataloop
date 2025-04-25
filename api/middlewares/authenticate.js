const { verifyToken } = require("../utils/helper");
const { getAllModels } = require("./loadModels");

const CustomError = require("./customError");

const findUser = async (where, next) => {
  try {
    const { User, Role, Permission } = await getAllModels(process.env.DB_TYPE);
    if (typeof where !== "object" || Object.keys(where).length === 0) {
      throw { message: "Invalid where condition" };
    }

    let user = null;
    let includes = [];
    let roleIncludes = [];
    if (Permission) {
      roleIncludes.push({
        model: Permission,
        as: "permissions",
      });
    }
    if (Role) {
      includes.push({
        model: Role,
        as: "roles",
        include: roleIncludes,
      });
    }

    user = await User.findOne({
      where: where,
      include: includes,
    });

    return user;
  } catch (error) {
    return next(
      new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
    );
  }
};

const hasPermission = async (roles, route, action, type) => {
  for (const role of roles) {
    for (const permission of role.permissions) {
      if (
        permission.route.toLowerCase() === route.toLowerCase() &&
        permission.action.toLowerCase() === action.toLowerCase() &&
        permission.type.toLowerCase() === type.toLowerCase()
      ) {
        return true;
      }
    }
  }
  return false;
};

exports.authenticate = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = null;
      const authorization = req.headers.authorization.split(" ");
      if (authorization.length === 2) {
        const key = authorization[0];
        const val = authorization[1];
        if (/^Bearer$/i.test(key)) {
          token = val.replace(/"/g, "");
          if (token) {
            verifyToken(token, async function (err, decoded) {
              if (err) {
                return next(
                  new CustomError(`You are not authenticated! ${err}`, 400)
                );
              }

              req.decoded = decoded;

              let userDetail = await findUser({ id: req.decoded.id }, next);
              if (userDetail) {
                req.user = userDetail; // ✅ FIXED HERE
                next();
              } else {
                return next(new CustomError("Invalid Token", 401));
              }
            });
          }
        }
      } else {
        return next(
          new CustomError(
            "You are not authorized to perform this operation!",
            401
          )
        );
      }
    } else {
      return next(
        new CustomError(
          "You are not authorized to perform this operation!",
          401
        )
      );
    }
  } catch (error) {
    return next(
      new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
    );
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const { Role, Permission } = await getAllModels(process.env.DB_TYPE);
    const apiVersion = process.env.API_VERSION ? process.env.API_VERSION : "v1";
    let baseUrl = `/api/${apiVersion}/`;

    if (req.headers.authorization) {
      let token = null;
      const authorization = req.headers.authorization.split(" ");

      if (authorization.length === 2) {
        const key = authorization[0];
        const val = authorization[1];
        if (/^Bearer$/i.test(key)) {
          token = val.replace(/"/g, "");
          if (token) {
            verifyToken(token, async function (err, decoded) {
              console.log(err, "err");
              if (err) {
                return next(
                  new CustomError(`You are not authenticated! ${err}`, 400)
                );
              }
              req.decoded = decoded;

              let userDetail = await findUser({ id: req.decoded.id }, next);

              let route = `${req.baseUrl.replace(baseUrl, "")}${
                req.route.path
              }`;
              if (userDetail) {
                if (
                  Role &&
                  Permission &&
                  userDetail.roles &&
                  userDetail.roles.length > 0 &&
                  userDetail.roles[0].permissions.length > 0
                ) {
                  let permission = await hasPermission(
                    userDetail.roles,
                    route,
                    req.method,
                    "backend"
                  );
                  if (!permission) {
                    return next(
                      new CustomError(
                        `You have no access for this ${route}`,
                        400
                      )
                    );
                  } else {
                    next();
                  }
                } else {
                  return next(
                    new CustomError(
                      `You have no access for this ${route} api`,
                      401
                    )
                  );
                }
              } else {
                return next(new CustomError("Invalid Token", 401));
              }
            });
          }
        }
      } else {
        return next(
          new CustomError(
            "You are not authorized to perform this operation!",
            401
          )
        );
      }
    } else {
      return next(
        new CustomError(
          "You are not authorized to perform this operation!",
          401
        )
      );
    }
  } catch (error) {
    return next(
      new CustomError(`Unauthorized: Invalid token! ${error.message}`, 401)
    );
  }
};
