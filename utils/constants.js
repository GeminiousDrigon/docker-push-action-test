export const employeeStatus = [
  { label: 'PERMANENT - FULLTIME', value: 'PERMANENT - FULLTIME' },
  { label: 'CONTRACTUAL - FULLTIME', value: 'CONTRACTUAL - FULLTIME' },
  { label: 'PERMANENT - PARTTIME', value: 'PERMANENT - PARTTIME' },
  { label: 'CONTRACTUAL - PARTTIME', value: 'CONTRACTUAL - PARTTIME' },
  { label: 'ACTIVE ROTATING', value: 'ACTIVE ROTATING' },
  { label: 'OUTSOURCED', value: 'OUTSOURCED' },
];

export const civilStatuses = [
  { label: 'NEW BORN', value: 'NEW BORN' },
  { label: 'CHILD', value: 'CHILD' },
  { label: 'SINGLE', value: 'SINGLE' },
  { label: 'MARRIED', value: 'MARRIED' },
  { label: 'WIDOWED', value: 'WIDOWED' },
  { label: 'ANNULED', value: 'ANNULED' },
  { label: 'SEPARATED', value: 'SEPARATED' },
];

export const DoctorServiceType = [
  'Not Applicable',
  'EENT',
  'Eye Care Center',
  'Gynecology',
  'Medicine',
  'Newborn',
  'Obstetrics',
  'Opthalmology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonary',
  'Surgery (Adult)',
  'Surgery (Pediatrics)',
  'Adult',
  'Antenatal Care',
  'Postnatal Care',
];

export const DoctorServiceClass = [
  'Not Applicable',
  'Pulmonary',
  'Hematology',
  'Allergology',
  'Dermatology',
  'Cardiology',
  'Endocrinology',
  'Oncology',
  'Psychiatry',
  'Rhuematology',
  'Infectious',
  'Nephrology',
  'Toxicology',
  'Neurology',
  'Executive Check-up',
  'Urology',
  'General',
  'Pulmonary',
  'Neurology',
  'Nephrology',
  'Dermatology',
  'Cardiology',
  'Endocrinology',
  'Gastroenterology',
  'General Surgery',
  'Vascular',
  'ENT-Surgery',
  'Orthopedic',
  'Urology',
];

// export const scheduleTypes = [
//   { label: 'Regular (Office Hours)', value: 'Regular (Office Hours)' },
//   { label: 'Regular (Shift Hours)', value: 'Regular (Shift Hours)' },
//   { label: 'Confidential', value: 'Confidential' },
// ];

export const frequency = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Semi-Monthly', value: 'SEMI_MONTHLY' },
];

export const payrollTypes = [
  { label: 'Regular (Office Hours)', value: 'Regular (Office Hours)' },
  { label: 'Regular (Shift Hours)', value: 'Regular (shift Hours)' },
  { label: 'Confidential', value: 'Confidential' },
];

export const payFrequency = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Semi-Monthly', value: 'Semi-Monthly' },
];

export const AddOn = [
  { label: 'Fuel Allowance', value: 'Fuel Allowance' },
  { label: 'Food', value: 'Food' },
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Laundry', value: 'Laundry' },
  { label: 'Rice', value: 'Rice' },
  { label: 'Honorarium', value: 'Honorarium' },
  { label: 'Other Compensation', value: 'Other Compensation' },
];
//====================HOLIDAY TRANSFERABILITY====================\\

export const HolidayTransferability = [
  {
    label: 'Fixed',
    value: 'FIXED',
  },
  {
    label: 'Movable',
    value: 'MOVABLE',
  },
];

export const HolidayTransferabilityTypes = {
  MOVABLE: 'MOVABLE',
  FIXED: 'FIXED',
};

//====================HOLIDAY TRANSFERABILITY====================\\

//==========================HOLIDAY TYPE==========================\\

export const HolidayType = [
  {
    label: 'Regular Holiday',
    value: 'REGULAR',
  },
  {
    label: 'Special Non-working Holiday',
    value: 'SPECIAL_NON_WORKING',
  },
  {
    label: 'Non-Holiday',
    value: 'NON_HOLIDAY',
  },
];

export const HolidayTypes = {
  REGULAR: 'REGULAR',
  SPECIAL: 'SPECIAL_NON_WORKING',
  NON_HOLIDAY: 'NON_HOLIDAY',
};

//==========================HOLIDAY TYPE==========================\\

//==========================REST DAY SETTINGS==========================\\

export const REST_DAY_SCHEDULE_LABEL = 'R';
export const REST_DAY_SCHEDULE_TITLE = 'Rest Day';
export const REST_DAY_SCHEDULE_COLOR = '#95a5a6';

//==========================REST DAY SETTINGS==========================\\

//==========================PAYROLL STATUS==========================\\

export const PAYROLL_STATUS_NEW = 'NEW';
export const PAYROLL_STATUS_CALCULATED = 'CALCULATED';
export const PAYROLL_STATUS_CALCULATING = 'CALCULATING';
export const PAYROLL_STATUS_FINALIZED = 'FINALIZED';

//==========================PAYROLL STATUS==========================\\

//==========================EMPLOYEE ATTENDANCE METHODS==========================\\
export const employeeAttendanceMethods = {
  FINGER: 'FINGER',
  MANUAL: 'MANUAL',
};

//==========================EMPLOYEE ATTENDANCE METHODS==========================\\
