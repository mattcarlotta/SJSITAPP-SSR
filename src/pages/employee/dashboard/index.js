import React from "react";
import moment from "moment-timezone";
import requiresBasicCredentials from "~containers/Auth/requiresBasicCredentials";
import ViewDashboard from "~containers/Body/ViewDashboard";
import app from "~utils/axiosConfig";
import { parseCookie, parseData } from "~utils/parseResponse";
import * as actions from "~actions/Dashboard";

const Dashboard = () => <ViewDashboard />;

Dashboard.getInitialProps = async ({ store: { dispatch, getState }, req }) => {
	const { role } = getState().auth;
	const headers = parseCookie(req);

	dispatch(actions.resetDashboard());

	const fetchEvents = async () => {
		const res = await app.get("dashboard/events/today", headers);
		const data = parseData(res);

		dispatch(actions.setEvents(data));
	};

	const fetchAPForm = async () => {
		const res = await app.get("dashboard/ap-form", headers);
		const data = parseData(res);

		dispatch(actions.setAPForm(data));
	};

	const fetchAvailability = async () => {
		if (role !== "employee") {
			// all member availability
			const res = await app.get("dashboard/membersavailability", headers);
			const data = parseData(res);

			dispatch(actions.setMembersAvailability(data));
		} else {
			// signed in user availability
			const res = await app.get("dashboard/availability", headers);
			const data = parseData(res);

			dispatch(actions.setAvailability(data));
		}
	};

	const fetchEventDistribution = async () => {
		const res = await app.get("dashboard/event-distribution", {
			...headers,
			params: {
				startDate: moment().startOf("month").format(),
				endDate: moment().endOf("month").format(),
			},
		});
		const data = parseData(res);

		dispatch(actions.setEventDistribution(data));
	};

	let serverError;
	try {
		await Promise.all([
			fetchEvents(),
			fetchAPForm(),
			fetchAvailability(),
			fetchEventDistribution(),
		]);
	} catch (e) {
		serverError = e.toString();
	}

	return { serverError };
};

export default requiresBasicCredentials(Dashboard);
