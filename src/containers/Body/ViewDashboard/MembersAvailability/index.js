import React from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import isEmpty from "lodash.isempty";
import { connect } from "react-redux";
import { Card, Col } from "antd";
import { FaUserClock } from "react-icons/fa";
import Bold from "~components/Body/Bold";
import CalendarContainer from "~components/Body/CalendarContainer";
import Flex from "~components/Body/Flex";
import FlexEnd from "~components/Body/FlexEnd";
import FlexStart from "~components/Body/FlexStart";
import Float from "~components/Body/Float";
import List from "~components/Body/List";
import ListItem from "~components/Body/ListItem";
import LoadingPanel from "~components/Body/LoadingPanel";
import NoAvailability from "~components/Body/NoAvailability";
import columns from "../Columns";

const iconStyle = {
	verticalAlign: "middle",
	marginRight: 10,
	fontSize: 22,
};

const listItemStyle = {
	fontSize: 16,
};

const listStyle = { height: 200, overflowY: "auto", padding: "0 5px" };

const tableHeader = {
	backgroundColor: "#025f6d",
	color: "#fff",
	marginTop: 10,
	padding: "0 5px",
	borderRadius: 3,
	fontSize: 18,
};

const format = "MM/DD/YYYY";

const MembersAvailability = ({ membersAvailability, months, isLoading }) => (
	<Col {...columns}>
		<Card
			bodyStyle={{ minHeight: "300px" }}
			title={
				<>
					<FaUserClock style={iconStyle} />
					<span css="vertical-align: middle;">Availability</span>
				</>
			}
			extra={
				!isEmpty(months) ? (
					<span css="color: #fff; font-size: 16px;">
						{moment(months[0]).format(format)} -{" "}
						{moment(months[1]).format(format)}
					</span>
				) : null
			}
		>
			{isLoading ? (
				<LoadingPanel />
			) : !isEmpty(membersAvailability) ? (
				<CalendarContainer>
					<Flex style={tableHeader}>
						<FlexStart>Employee</FlexStart>
						<FlexEnd>Availability (%)</FlexEnd>
					</Flex>
					<List style={listStyle}>
						{membersAvailability.map(({ id, availability }, key) => (
							<ListItem
								key={id}
								style={{
									...listItemStyle,
									backgroundColor: key % 2 ? "#ebebeb" : "transparent",
								}}
							>
								<Bold>{id}</Bold>
								<Float direction="right">{availability}&#37;</Float>
							</ListItem>
						))}
					</List>
				</CalendarContainer>
			) : (
				<NoAvailability />
			)}
		</Card>
	</Col>
);

MembersAvailability.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	membersAvailability: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			availability: PropTypes.number,
		}),
	),
	months: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = ({ dashboard }) => ({
	isLoading: dashboard.membersAvailability.isLoading,
	membersAvailability: dashboard.membersAvailability.data,
	months: dashboard.membersAvailability.months,
});

export default connect(mapStateToProps)(MembersAvailability);
