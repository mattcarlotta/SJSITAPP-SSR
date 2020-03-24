import get from "lodash/get";
import { accessDenied, badCredentials } from "messages/errors";
import { sendError } from "~utils/helpers";
import { User } from "~models";

/**
 * Middleware function to check if a user is an admin/staff and the session is valid.
 *
 * @function
 * @returns {function}
 */
export default next => async (req, res) => {
	const user = parseSession(req);
	const role = get(user, ["role"]);

	if (!user || (role !== "admin" && role !== "staff"))
		return sendError(accessDenied, 404, res);

	const existingUser = await User.findOne({ _id: user.id });
	if (!existingUser || existingUser.status === "suspended")
		return sendError(badCredentials, 404, res);

	next(req, res);
};
