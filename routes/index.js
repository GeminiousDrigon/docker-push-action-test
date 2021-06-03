import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faFolderOpen,
  faSitemap,
  faWarehouse,
  faClipboardList,
  faUserCog,
  faCogs,
  faCalendarAlt,
  faPercent,
  faHandHoldingUsd,
  faUserTag,
  faFingerprint,
  faTools,
  faHeartbeat,
  faHandHoldingHeart,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

import { isInAnyRole } from 'components/accessControl/AccessManager';

export const pages = [
  {
    icon: <FontAwesomeIcon icon={faChartLine} />,
    title: 'Dashboard',
    url: '/dashboard',
    roles: '*',
  },
  {
    icon: <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: 10 }} className="anticon" />,
    title: 'Employees',
    url: '/employees',
    roles: ['HR_ACCESS'],
    children: [
      {
        icon: <FontAwesomeIcon icon={faSitemap} />,
        title: 'Employee List',
        url: '/list',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faWarehouse} />,
        title: 'Salary',
        url: '/salary',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        title: 'Attendance Logs',
        url: '/attendance-logs',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        title: 'Employee Attendance',
        url: '/employee-attendance',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        title: 'Work Schedule',
        url: '/work-schedule',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        title: 'Employee Biometric Config',
        url: '/employee-config',
        roles: ['HR_ACCESS'],
      },
    ],
  },
  {
    icon: <FontAwesomeIcon icon={faFolderOpen} className="anticon" />,
    title: 'Transactions',
    url: '/transactions',
    roles: '*',
    children: [
      {
        icon: <FontAwesomeIcon icon={faSitemap} />,
        title: 'Leave',
        url: '/leave',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faWarehouse} />,
        title: 'Overtime',
        url: '/overtime',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        title: 'Loans',
        url: '/loans',
        roles: ['HR_ACCESS'],
      },
    ],
  },
  {
    icon: <FontAwesomeIcon icon={faUserCog} />,
    title: 'Reports',
    url: '/reports',
    roles: '*',
  },
  {
    icon: <FontAwesomeIcon icon={faUserCog} />,
    title: 'Job Openings',
    url: '/job-openings',
    roles: ['HR_ACCESS'],
  },
  {
    icon: <FontAwesomeIcon icon={faTools} className="anticon" />,
    title: 'Payroll',
    url: '/payroll',
    roles: '*',
    children: [
      {
        icon: <FontAwesomeIcon icon={faHeartbeat} />,
        title: 'Processing',
        url: '/processing',
        roles: '*',
      },
    ],
  },
  {
    icon: <FontAwesomeIcon icon={faCogs} className="anticon" />,
    title: 'Configuration',
    url: '/configuration',
    roles: '*',
    children: [
      {
        icon: <FontAwesomeIcon icon={faCalendarAlt} />,
        title: 'Holiday/Events Calendar',
        url: '/event',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faPercent} />,
        title: 'Salary Calculation Rates',
        url: '/salary-calculation',
        roles: ['ROLE_ADMIN'],
      },
      {
        icon: <FontAwesomeIcon icon={faHandHoldingUsd} />,
        title: 'Allowance',
        url: '/allowance',
        roles: ['ROLE_ADMIN', 'HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faUserTag} />,
        title: 'Job Type/Tags',
        url: '/job',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faUserTag} />,
        title: 'Department Work Schedule',
        url: '/department-schedule',
        roles: ['HR_ACCESS'],
      },
      {
        icon: <FontAwesomeIcon icon={faFingerprint} />,
        title: 'Biometric',
        url: '/biometric',
        roles: ['BIOMETRIC_MANAGEMENT'],
      },
      {
        icon: <FontAwesomeIcon icon={faTools} className="anticon" />,
        title: 'Contribution',
        url: '/contribution',
        roles: ['HR_ACCESS'],
        children: [
          {
            icon: <FontAwesomeIcon icon={faHeartbeat} />,
            title: 'PhilHealth',
            url: '/philhealth',
            roles: ['HR_ACCESS'],
          },
          {
            icon: <FontAwesomeIcon icon={faHandHoldingHeart} />,
            title: 'PagIbig',
            url: '/pagibig',
            roles: ['HR_ACCESS'],
          },
          {
            icon: <FontAwesomeIcon icon={faUserShield} />,
            title: 'Social Security System',
            url: '/sss',
            roles: ['HR_ACCESS'],
          },
        ],
      },
    ],
  },
  // {
  //   icon: <FontAwesomeIcon icon={faUserCog} />,
  //   title: 'Account',
  //   url: '/account',
  //   roles: '*',
  // },

  // Format for nested menus
  // {
  //   icon: <AppstoreOutlined />,
  //   title: 'Sample Nested',
  //   url: '/sample',
  //   children: [
  //     {
  //       icon: <AppstoreOutlined />,
  //       title: 'Sample Nested 1',
  //       url: '/sample1',
  //       children: [
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 1-1',
  //           url: '/sample1-1',
  //         },
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 1-2',
  //           url: '/sample1-2',
  //           asUrl: '/patients',
  //           children: [
  //             {
  //               icon: <AppstoreOutlined />,
  //               title: 'Sample Nested 1-2-1',
  //               url: '/sample1-2-1',
  //               asUrl: '/patients',
  //             },
  //             {
  //               icon: <AppstoreOutlined />,
  //               title: 'Sample Nested 1-2-2',
  //               url: '/sample1-2-2',
  //               asUrl: '/patients',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       icon: <AppstoreOutlined />,
  //       title: 'Sample Nested 2',
  //       url: '/sample2',
  //       asUrl: '/patients',
  //       children: [
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 2-1',
  //           url: '/sample2-1',
  //           asUrl: '/patients',
  //         },
  //         {
  //           icon: <AppstoreOutlined />,
  //           title: 'Sample Nested 2-2',
  //           url: '/sample2-2',
  //           asUrl: '/patients',
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export const filterRoute = (rolesRepo) => {
  return (accumulator, value) => {
    let { roles, children } = value;
    if (children?.length > 0) {
      value.children = children.reduce(filterRoute(rolesRepo), []);
    }
    if (roles === '*') return accumulator.concat(value);

    if (isInAnyRole(roles, rolesRepo)) return accumulator.concat(value);
    else return accumulator;
  };
};

export const getPages = (roleRepo) => {
  const allowedPages = pages.reduce(filterRoute(roleRepo), []);
  return allowedPages;
};
