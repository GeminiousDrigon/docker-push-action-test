import { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { HRButton, HRDivider, HRForm, HRList, HRListItem } from '@components/commons';
import { Col, DatePicker, Row, Table, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import MomentFormatter from '@components/utils/MomentFormatter';
import moment from 'moment';
import NumeralFormatter from '@components/utils/NumeralFormatter';
import HRTable from '@components/commons/HRTable';

import styles from '@styles/employee-attendance/accumulated-logs.module.css';
import AccumulatedLogsSummary from '@components/pages/employees/employee-attendance/Tabs/AccumulatedLogsSummary';

const GET_SAVED_EMPLOYEE_ATTENDANCE = gql`
  query($startDate: Instant, $endDate: Instant, $id: UUID) {
    logs: getAccumulatedLogs(startDate: $startDate, endDate: $endDate, id: $id) {
      date
      scheduleStart
      scheduleEnd
      inTime
      outTime
      message
      isError
      late
      undertime
      worked
      hoursRestDay
      hoursSpecialHoliday
      hoursSpecialHolidayAndRestDay
      hoursRegularHoliday
      hoursRegularHolidayAndRestDay
      hoursDoubleHoliday
      hoursDoubleHolidayAndRestDay
      hoursRegularOvertime
      hoursRestOvertime
      hoursSpecialHolidayOvertime
      hoursSpecialHolidayAndRestDayOvertime
      hoursRegularHolidayOvertime
      hoursRegularHolidayAndRestDayOvertime
      hoursDoubleHolidayOvertime
      hoursDoubleHolidayAndRestDayOvertime
      hoursNightDifferential
      hoursWorkedNSD
      hoursRestDayNSD
      hoursSpecialHolidayNSD
      hoursSpecialHolidayAndRestDayNSD
      hoursRegularHolidayNSD
      hoursRegularHolidayAndRestDayNSD
      hoursDoubleHolidayNSD
      hoursDoubleHolidayAndRestDayNSD
      countDoubleHolidayAndRestDay
      workedOIC
      hoursSpecialHolidayOIC
      hoursRegularHolidayOIC
      hoursDoubleHolidayOIC
      hoursRegularOICOvertime
      hoursSpecialHolidayOICOvertime
      hoursRegularHolidayOICOvertime
      hoursDoubleHolidayOICOvertime
      hoursWorkedOICNSD
      hoursSpecialHolidayOICNSD
      hoursRegularHolidayOICNSD
      hoursDoubleHolidayOICNSD
      hoursAbsent
      isOvertimeOnly
      isAbsentOnly
      isRestDay
      isRestDayOnly
      isEmpty
    }
  }
`;

const AccumulatedLogsTab = (props) => {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [getEmployeeAttendance, { data, loading, refetch }] = useLazyQuery(
    GET_SAVED_EMPLOYEE_ATTENDANCE,
  );

  const handleSubmit = ({ dates }) => {
    getEmployeeAttendance({
      variables: {
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        id: router?.query?.id || null,
      },
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const headers = [
    { text: 'Date', span: 9 },
    { text: 'In', span: 3 },
    { text: 'Out', span: 3 },
    { text: 'Work', span: 2 },
    { text: 'Late', span: 2 },
    { text: 'Undertime', span: 2 },
    { text: 'OT', span: 2 },
  ];

  const onCell = (record, index) => {
    let props = {};
    if (record?.isAbsentOnly) props.className = `${styles.absent}`;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime}`;
    return props;
  };

  const onCellData = (record, key, withHoursSuffix) => {
    let count = record[key];
    let props = {
      className: '',
    };
    if (record?.isAbsentOnly) props.className = `${styles.absent} `;
    else if (record?.isOvertimeOnly) props.className = `${styles.overtime} `;
    if (count > 0) {
      if (withHoursSuffix) props.className += `${styles[`with-hours-${withHoursSuffix}`]} `;
      else props.className += `${styles['with-hours']} `;
    }
    return props;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 350,
      fixed: 'left',
      render: (text, logs) => (
        <>
          {!logs?.isEmpty && (
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 5 }} />
          )}
          <span style={{ marginRight: 5 }}>
            <MomentFormatter format={'ddd, MMMM D, YYYY'} value={logs?.date} />
          </span>
          {logs?.isError && (
            <Tag color="red">{logs?.message}</Tag>
            // <Tooltip title={logs?.message}>
            //   <ExclamationCircleOutlined style={{ marginRight: 10, color: 'red' }} />
            // </Tooltip>
          )}
          {logs?.isRestDay && <Tag color="blue">REST DAY</Tag>}
        </>
      ),
      onCell,
    },
    {
      title: 'In',
      key: 'in-time',
      width: 200,
      render: (_, { inTime }) =>
        inTime && <MomentFormatter value={inTime} format="MMM D, YYYY, h:mm:ss A" />,
      onCell,
    },
    {
      title: 'Out',
      key: 'out-time',
      width: 200,
      render: (_, { outTime }) =>
        outTime && <MomentFormatter value={outTime} format="MMM D, YYYY, h:mm:ss A" />,
      onCell,
    },
    {
      title: <Typography.Text strong>Underperformances</Typography.Text>,
      children: [
        {
          title: 'Late',
          dataIndex: 'late',
          key: 'late',
          width: 100,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'late', 'red'),
        },
        {
          title: 'Undertime',
          dataIndex: 'undertime',
          key: 'undertime',
          width: 100,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'undertime', 'red'),
        },
        {
          title: 'Absent',
          dataIndex: 'hoursAbsent',
          key: 'hoursAbsent',
          width: 100,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell,
        },
      ],
    },
    {
      title: <Typography.Text strong>Work Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'worked',
          dataIndex: 'worked',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'worked'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularOvertime',
          dataIndex: 'hoursRegularOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursWorkedNSD',
          dataIndex: 'hoursWorkedNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursWorkedNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Work Day OIC</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'workedOIC',
          dataIndex: 'workedOIC',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'workedOIC'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularOICOvertime',
          dataIndex: 'hoursRegularOICOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularOICOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursWorkedOICNSD',
          dataIndex: 'hoursWorkedOICNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursWorkedOICNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Rest Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRestDay',
          dataIndex: 'hoursRestDay',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRestDay'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRestOvertime',
          dataIndex: 'hoursRestOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRestOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRestDayNSD',
          dataIndex: 'hoursRestDayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRestDayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Special Holiday</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHoliday',
          dataIndex: 'hoursSpecialHoliday',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHoliday'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayOvertime',
          dataIndex: 'hoursSpecialHolidayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayNSD',
          dataIndex: 'hoursSpecialHolidayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Special Holiday OIC</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayOIC',
          dataIndex: 'hoursSpecialHolidayOIC',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayOIC'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayOICOvertime',
          dataIndex: 'hoursSpecialHolidayOICOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayOICOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayOICNSD',
          dataIndex: 'hoursSpecialHolidayOICNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayOICNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Special Holiday and Rest Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayAndRestDay',
          dataIndex: 'hoursSpecialHolidayAndRestDay',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDay'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayAndRestDayOvertime',
          dataIndex: 'hoursSpecialHolidayAndRestDayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursSpecialHolidayAndRestDayNSD',
          dataIndex: 'hoursSpecialHolidayAndRestDayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursSpecialHolidayAndRestDayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Regular Holiday</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHoliday',
          dataIndex: 'hoursRegularHoliday',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHoliday'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayOvertime',
          dataIndex: 'hoursRegularHolidayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayNSD',
          dataIndex: 'hoursRegularHolidayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Regular Holiday OIC</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayOIC',
          dataIndex: 'hoursRegularHolidayOIC',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayOIC'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayOICOvertime',
          dataIndex: 'hoursRegularHolidayOICOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayOICOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayOICNSD',
          dataIndex: 'hoursRegularHolidayOICNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayOICNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Regular Holiday and Rest Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayAndRestDay',
          dataIndex: 'hoursRegularHolidayAndRestDay',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDay'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayAndRestDayOvertime',
          dataIndex: 'hoursRegularHolidayAndRestDayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursRegularHolidayAndRestDayNSD',
          dataIndex: 'hoursRegularHolidayAndRestDayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursRegularHolidayAndRestDayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>DoubleHoliday</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHoliday',
          dataIndex: 'hoursDoubleHoliday',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHoliday'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayOvertime',
          dataIndex: 'hoursDoubleHolidayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayNSD',
          dataIndex: 'hoursDoubleHolidayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Double Holiday OIC</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayOIC',
          dataIndex: 'hoursDoubleHolidayOIC',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayOIC'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayOICOvertime',
          dataIndex: 'hoursDoubleHolidayOICOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayOICOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayOICNSD',
          dataIndex: 'hoursDoubleHolidayOICNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayOICNSD'),
        },
      ],
    },
    {
      title: <Typography.Text strong>Double Holiday and Rest Day</Typography.Text>,
      children: [
        {
          title: (
            <Tooltip title="Regular">
              <Typography.Text>R</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayAndRestDay',
          dataIndex: 'hoursDoubleHolidayAndRestDay',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDay'),
        },
        {
          title: (
            <Tooltip title="Overtime">
              <Typography.Text>OT</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayAndRestDayOvertime',
          dataIndex: 'hoursDoubleHolidayAndRestDayOvertime',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDayOvertime'),
        },
        {
          title: (
            <Tooltip title="Night Shift Differential">
              <Typography.Text>NSD</Typography.Text>
            </Tooltip>
          ),
          key: 'hoursDoubleHolidayAndRestDayNSD',
          dataIndex: 'hoursDoubleHolidayAndRestDayNSD',
          width: 80,
          align: 'center',
          render: (text) => (
            <NumeralFormatter format={'0,0.[0000]'} withPesos={false} value={text} />
          ),
          onCell: (record) => onCellData(record, 'hoursDoubleHolidayAndRestDayNSD'),
        },
      ],
    },
  ];

  const scrollProps = { y: 'calc(100vh - 330px)' };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <HRForm methods={methods} onSubmit={handleSubmit}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Controller
                name="dates"
                rules={{
                  validate: (value) => {
                    if (!value) return 'Please select date range.';
                    if (!Array.isArray(value)) {
                      return 'Please select date range.';
                    } else if (Array.isArray(value)) {
                      if (value[0] === null || value[1] === null)
                        return 'Please select date range.';
                    }
                    return true;
                  },
                }}
                render={(inputProps) => (
                  <>
                    <label>
                      Date Range{' '}
                      <label style={{ color: 'red' }}>
                        {methods.errors?.dates && `(${methods.errors?.dates?.message})`}
                      </label>
                    </label>
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      format="MMMM D, YYYY"
                      onCalendarChange={handleDateChange}
                      value={inputProps.value}
                      onBlur={inputProps.onBlur}
                      allowClear
                      allowEmpty
                    />
                  </>
                )}
              />
            </Col>
            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <HRButton type="primary" block htmlType="submit" loading={loading}>
                Submit
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <HRDivider />
      <div>
        <HRTable
          columns={columns}
          loading={loading}
          dataSource={data?.logs || []}
          size="middle"
          scroll={scrollProps}
          pagination={false}
          rowKey="id"
          summary={(pageData) => <AccumulatedLogsSummary pageData={pageData} />}
        />
      </div>
    </>
  );
};

export default AccumulatedLogsTab;
