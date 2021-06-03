export const config = ['/', '/register', '/login'];

export const newConfig = {
  '/': {
    isPublic: true,
  },
  '/dashboard': {
    isPublic: false,
    roles: ['ROLE_USER', 'ROLE_STAFF'],
  },
  '/account': {
    isPublic: false,
    roles: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF'],
  },
  //====================================EMPLOYEES===================================\\
  '/employees/list': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/attendance-logs': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/employee-attendance': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/employee-attendance/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/employee-config': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/manage/[id]': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/salary': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/employees/work-schedule': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //====================================EMPLOYEES===================================\\
  //===================================JOB-OPENING==================================\\
  '/job-openings': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //===================================JOB-OPENING==================================\\
  //===================================TRANSACTION==================================\\
  '/transactions/loans': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/transactions/leave': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/transactions/overtime': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  //===================================TRANSACTION==================================\\
  //==================================CONFIGURATION=================================\\
  '/configuration/allowance': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/biometric': {
    isPublic: false,
    roles: ['BIOMETRIC_MANAGEMENT'],
  },
  '/configuration/contribution/pagibig': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/contribution/philhealth': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/contribution/sss': {
    isPublic: false,
    roles: ['HR_ACCESS', 'ROLE_ADMIN'],
  },
  '/configuration/department-schedule': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/configuration/event': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/configuration/job': {
    isPublic: false,
    roles: ['HR_ACCESS'],
  },
  '/configuration/salary-calculation': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  //==================================CONFIGURATION=================================\\
  //=====================================PAYROLL====================================\\
  '/payroll/generate': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/processing': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  '/payroll/view/[id]': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  //=====================================PAYROLL====================================\\
  //=====================================REPORTS====================================\\
  '/reports': {
    isPublic: false,
    roles: ['ROLE_ADMIN', 'HR_ACCESS'],
  },
  //=====================================REPORTS====================================\\
};
