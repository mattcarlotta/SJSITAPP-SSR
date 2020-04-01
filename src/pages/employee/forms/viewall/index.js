import React from "react";
import ViewForms from "~containers/Body/ViewForms";
import requiresStaffCredentials from "~containers/Auth/requiresStaffCredentials";
import { app } from "~utils";
import { parseCookie, parseData } from "~utils/parseResponse";
import { resetForms, setForms } from "~actions/Forms";
import dispatchError from "~utils/dispatchError";
import { stringifyQuery } from "~utils/queryHelpers";

const ViewFormsPage = () => <ViewForms />;

ViewFormsPage.getInitialProps = async ({ store: { dispatch }, req, query }) => {
	const { page } = query;
	const headers = parseCookie(req);

	try {
		dispatch(resetForms());

		const queries = stringifyQuery(!page ? { page: 1, ...query } : query);
		const res = await app.get(`forms/all?${queries}`, headers);
		const data = parseData(res);

		dispatch(setForms(data));
	} catch (e) {
		dispatchError({ dispatch, message: e.toString() });
	}

	return {};
};

export default requiresStaffCredentials(ViewFormsPage);
