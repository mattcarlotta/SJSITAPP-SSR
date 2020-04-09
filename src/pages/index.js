import React from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { connect } from "react-redux";
import Button from "~components/Body/Button";
import Spinner from "~components/Body/Spinner";

const Home = ({ role }) => {
	const isLoggedin = role && role !== "guest";

	return (
		<Spinner>
			<Button
				tertiary
				marginRight="0px"
				width="200px"
				style={{ margin: "10px auto", background: "transparent" }}
				onClick={() =>
					Router.push(isLoggedin ? "/employee/dashboard" : "/employee/login")
				}
			>
				{isLoggedin ? "Go To Dashboard" : "Employee Login"}
			</Button>
		</Spinner>
	);
};

Home.propTypes = {
	role: PropTypes.string,
};

const mapStateToProps = ({ auth }) => ({ role: auth.role });

export default connect(mapStateToProps)(Home);
