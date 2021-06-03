export const patientStatusFormatter = (value = null) => {
	switch (value) {
		case "CONFIRM_ARRIVAL":
			return "Arrival Confirmed";
		case "CANCELLED":
			return "Cancelled";
		case "NO_SHOW":
			return "No Show";
		case "OPEN":
			return "Open";
		case "CLOSE":
			return "Close";
		case "VOID":
			return "Void";
		default:
			return null;
	}
};

export const paymentTypeFormatter = (value = null) => {
	switch (value) {
		case "ACKNOWLEDGEMENT_RECEIPT":
			return "Acknowledgement Receipt";
		case "OFFICIAL_RECEIPT":
			return "Official Receipt";
		default:
			return null;
	}
};

export const roleFormatter = (value = null) => {
	switch (value) {
		case "ROLE_ADMIN":
			return "Admin";
		case "ROLE_DOCTOR":
			return "Doctor";
		case "ROLE_OWNER":
			return "Owner";
		case "ROLE_STAFF":
			return "Staff";
		case "ROLE_USER":
			return "User";
		default:
			return null;
	}
};

export const payrollProcessingStatusColor = (value = null) => {
	switch (value) {
		case "NEW":
			return "blue";
		case "CALCULATING":
			return "lime";
		case "CALCULATED":
			return "orange";
		case "INVALID":
			return "red";
		case "FINALIZED":
			return "green";
		default:
			return null;
	}
};

export const payrollLogFlagStatusColor = (value = null) => {
	switch (value) {
		case "UNRESOLVED":
			return "red";
		case "RESOLVED":
			return "green";
		default:
			return null;
	}
};

export const employeePayFrequency = (value = null) => {
	switch (value) {
		case "MONTHLY":
			return "Monthly";
		case "SEMI_MONTHLY":
			return "Semi-Monthly";
		default:
			return null;
	}
};
