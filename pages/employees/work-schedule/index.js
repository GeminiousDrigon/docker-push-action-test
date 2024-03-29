import { useState } from 'react';
import { HRButton, HRForm, HRPageHeader, HRSelect } from '@components/commons';
import { Col, DatePicker, message, Pagination, Row, Spin, Table, Typography } from 'antd';
import Head from 'next/head';
import moment from 'moment';
import { gql } from 'apollo-boost';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { Controller, useForm } from 'react-hook-form';
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from '@utils/constants';
import { MdAvTimer } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { isTimeGreaterThanOrEqual, isTimeLessThan, isTimeLessThanOrEqual } from '@utils/moment';

import CustomScheduleModal from '@components/pages/employees/work-schedule/CustomScheduleModal';
import ScheduleCell from '@components/pages/employees/work-schedule/ScheduleCell';
import ScheduleDetailsModal from '@components/pages/employees/work-schedule/ScheduleDetailsModal';

const GET_EMPLOYEES = gql`
  query($department: UUID, $size: Int, $page: Int, $startDate: Instant, $endDate: Instant) {
    employees: getAllEmployeeSchedule(
      department: $department
      size: $size
      page: $page
      startDate: $startDate
      endDate: $endDate
    ) {
      content {
        id
        fullName
        department
        departmentName
        employeeSchedule
        schedule {
          id
          title
          label
          dateTimeStart
          dateTimeStartRaw
          dateTimeEnd
          dateTimeEndRaw
          mealBreakStart
          mealBreakEnd
          color
        }
      }
      totalElements
    }
    legend: getEmployeeScheduleLegend(
      department: $department
      startDate: $startDate
      endDate: $endDate
    ) {
      color
      title
      label
    }
    holidays: mapEventsToDates(startDate: $startDate, endDate: $endDate)
  }
`;

const GET_DEPARTMENT = gql`
  query {
    departments {
      value: id
      label: departmentName
    }
  }
`;

const SET_EMPLOYEE_SCHED = gql`
  mutation($id: UUID, $employee_id: UUID, $department: UUID, $fields: Map_String_ObjectScalar) {
    data: createEmployeeSchedule(
      id: $id
      employee_id: $employee_id
      department: $department
      fields: $fields
    ) {
      success
      message
    }
  }
`;

const defaultColumn = {
  title: 'Date',
  dataIndex: 'fullName',
  key: 'fullName',
  width: 400,
  fixed: 'left',
  render: (text) => {
    return {
      children: <span style={{ fontSize: 16, fontWeight: '700' }}>{text}</span>,
    };
  },
};

const EmployeeWorkSchedulePage = (props) => {
  const methods = useForm({
    defaultValues: {
      dates: null,
    },
  });
  const [detailsModal, setDetailsModal] = useState({
    status: false,
    date: null,
    employee: null,
    isCustom: false,
    isOIC: false,
  });

  const [state, setState] = useState({
    department: '',
    startDate: null,
    endDate: null,
    page: 0,
    size: 10,
  });
  const [columns, setColumns] = useState([defaultColumn]);

  const [
    getEmployeeSchedule,
    { data, loading, refetch: refetchEmployeeSchedule, fetchMore, previousData },
  ] = useLazyQuery(GET_EMPLOYEES, {
    onCompleted: (result) => {
      formatColumns();
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const { data: dataDepartment, loading: loadingDepartment, refetch: refetchDepartment } = useQuery(
    GET_DEPARTMENT,
  );
  const [setEmployeeSched, { loading: loadingSetEmployeeSched }] = useMutation(SET_EMPLOYEE_SCHED, {
    onCompleted: (result) => {
      let { data } = result || {};
      if (data?.success) {
        message.success(data?.message ?? 'Successfully updated employee schedule.', 1.5);
        fetchMore({
          variables: {
            ...state,
            startDate: moment(state.startDate).startOf('day').utc().format(),
            endDate: moment(state.endDate).endOf('day').utc().format(),
          },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            return fetchMoreResult;
          },
        });
      } else message.error(data?.message ?? 'Failed to update employee schedule.');
    },
  });

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  // function for creating/saving employee schedule
  // this will run when a dropdown menu is selected
  const onClickSchedule = (date /*date selected*/, schedule, record, scheduleKey) => {
    let employeeScheduleDateTimeStart = moment(date);
    let employeeScheduleDateTimeEnd = moment(date);
    let employeeMealBreakDateTimeStart = moment(date);
    let employeeMealBreakDateTimeEnd = moment(date);
    let employeeId = record?.id;
    if (schedule === 'REST_DAY') {
      let scheduleId = record?.employeeSchedule[`${scheduleKey}_REST`];
      let restDayStartRaw = moment(employeeScheduleDateTimeStart).startOf('day').utc().format();
      let restDayEndRaw = moment(employeeScheduleDateTimeStart)
        .startOf('day')
        .add(1, 'day')
        .utc()
        .format();
      setEmployeeSched({
        variables: {
          id: scheduleId?.id || null,
          employee_id: employeeId,
          fields: {
            label: REST_DAY_SCHEDULE_LABEL,
            title: REST_DAY_SCHEDULE_TITLE,
            color: REST_DAY_SCHEDULE_COLOR,
            dateTimeStartRaw: restDayStartRaw,
            dateTimeEndRaw: restDayEndRaw,
            isRestDay: true,
            isOvertime: false,
          },
        },
      });
    } else {
      let scheduleId = record?.employeeSchedule[scheduleKey]?.id;
      let { id, ...restSchedule } = schedule;
      // console.log(restSchedule);

      //==============COMPUTING SCHEDULE==============\\
      // get the dateTimeStart and dateTimeEnd and create new moment objects
      restSchedule.dateTimeStart = moment(restSchedule.dateTimeStartRaw);
      restSchedule.dateTimeEnd = moment(restSchedule.dateTimeEndRaw);
      // set the date and hour of the schedule date time start
      employeeScheduleDateTimeStart.hour(restSchedule.dateTimeStart.hour());
      employeeScheduleDateTimeStart.minute(restSchedule.dateTimeStart.minute());
      // set the date and hour of the schedule date time end
      employeeScheduleDateTimeEnd.hour(restSchedule.dateTimeEnd.hour());
      employeeScheduleDateTimeEnd.minute(restSchedule.dateTimeEnd.minute());
      //==============COMPUTING SCHEDULE==============\\

      //==============COMPUTING MEAL BREAK==============\\
      // check if there is meal break start and end in the schedule
      if (restSchedule.mealBreakStart && restSchedule.mealBreakEnd) {
        restSchedule.mealBreakStart = moment(restSchedule.mealBreakStart);
        restSchedule.mealBreakEnd = moment(restSchedule.mealBreakEnd);
        //set the date, hour and minutes of the meal break start
        employeeMealBreakDateTimeStart.hour(restSchedule.mealBreakStart.hour());
        employeeMealBreakDateTimeStart.minute(restSchedule.mealBreakStart.minute());
        //set the date, hour and minutes of the meal break end
        employeeMealBreakDateTimeEnd.hour(restSchedule.mealBreakEnd.hour());
        employeeMealBreakDateTimeEnd.minute(restSchedule.mealBreakEnd.minute());
      }
      //==============COMPUTING MEAL BREAK==============\\

      if (isTimeLessThan(restSchedule.dateTimeEnd, restSchedule.dateTimeStart)) {
        // add one day to the schedule time end
        employeeScheduleDateTimeEnd.add(1, 'day');
        if (
          isTimeGreaterThanOrEqual(employeeMealBreakDateTimeStart, moment(date).startOf('day')) &&
          isTimeLessThanOrEqual(employeeMealBreakDateTimeStart, employeeScheduleDateTimeEnd)
        )
          employeeMealBreakDateTimeStart.add(1, 'day');
        if (
          isTimeGreaterThanOrEqual(employeeMealBreakDateTimeEnd, moment(date).startOf('day')) &&
          isTimeLessThanOrEqual(employeeMealBreakDateTimeEnd, employeeScheduleDateTimeEnd)
        )
          employeeMealBreakDateTimeEnd.add(1, 'day');
      }

      setEmployeeSched({
        variables: {
          id: scheduleId || null,
          employee_id: employeeId,
          department: record?.department,
          fields: {
            ...restSchedule,
            dateTimeStartRaw: employeeScheduleDateTimeStart.utc().format(),
            dateTimeEndRaw: employeeScheduleDateTimeEnd.utc().format(),
            mealBreakStart: employeeMealBreakDateTimeStart.utc().format(),
            mealBreakEnd: employeeMealBreakDateTimeEnd.utc().format(),
            isOvertime: false,
            isRestDay: false,
          },
        },
      });
    }
  };

  // schedule details modal handler
  const handleDetailsModal = (
    selected = {},
    willRefetch = false,
    isCustom = false,
    isOIC = false,
  ) => {
    if (willRefetch) {
      // console.log(state);
      refetchEmployeeSchedule({
        ...state,
        startDate: moment(state.startDate).startOf('day').utc().format(),
        endDate: moment(state.endDate).endOf('day').utc().format(),
      });
    }

    setDetailsModal({
      ...detailsModal,
      ...selected,
      status: !detailsModal.status,
      isCustom,
      isOIC,
    });
  };

  //handler when the user clicks the cells
  const handleSelectCell = (record, date, isCustom, isOIC) => {
    let selectedDate = moment(date).format('MM_DD_YYYY');
    // console.log(record, selectedDate);
    let employee = {
      ...record,
    };
    handleDetailsModal({ date, employee }, false, isCustom, isOIC);
  };

  const handleClickCuustom = (record, date) => {
    let employee = {
      ...record,
    };
    handleDetailsModal({ date, employee }, false, true);
  };

  // this function will format the columns. Use this when user selects new
  // date range
  const formatColumns = () => {
    let firstDate = moment(state.startDate);
    let secondDate = moment(state.endDate);
    let dateDiff = secondDate.diff(firstDate, 'days');
    let newColumns = [];
    const width = 150;
    for (let i = 0; i <= dateDiff; i++) {
      let date = moment(firstDate).add(i, 'days');
      let key = date.format('MM_DD_YYYY');
      newColumns.push({
        key,
        title: date.format('MMM D'),
        align: 'center',
        width,
        children: [
          {
            title: (
              <div>
                {date.format('ddd')}
                {data?.holidays[key]?.map((item) => {
                  return (
                    <div>
                      <Typography.Text strong danger style={{ color: 'red' }}>
                        {item?.name}
                      </Typography.Text>
                    </div>
                  );
                })}
              </div>
            ),
            width,
            dataIndex: key,
            align: 'center',
            // for the cell color
            onHeaderCell: (column) => {
              return {
                style: {
                  color: date.format('ddd') === 'Sun' ? 'red' : 'inherit',
                },
              };
            },
            // for the cell color
            onCell: (record) => {
              const { employeeSchedule } = record;
              const props = {
                style: { padding: -20, height: 60 },
              };
              if (employeeSchedule[key]?.isCustom) {
                props.style.backgroundColor = 'white';
                props.style.border = '2px solid #3498db';
              } else if (employeeSchedule[key]?.color) {
                props.style.backgroundColor = employeeSchedule[key]?.color;
              } else if (employeeSchedule[key + '_REST'])
                props.style.backgroundColor = employeeSchedule[key + '_REST']?.color;
              return props;
            },
            shouldCellUpdate: (record, prevRecord) => {
              let schedule = record?.employeeSchedule[key];
              let OICSchedule = record?.employeeSchedule[`${key}_OIC`];
              let restSchedule = record?.employeeSchedule[`${key}_REST`];
              let overtimeSchedule = record?.employeeSchedule[`${key}_OVERTIME`] || [];
              let overtimeOICSchedule = record?.employeeSchedule[`${key}_OVERTIME_OIC`] || [];
              let prevSchedule = prevRecord?.employeeSchedule[key];
              let prevOICSchedule = prevRecord?.employeeSchedule[`${key}_OIC`];
              let prevRestSchedule = prevRecord?.employeeSchedule[`${key}_REST`];
              let prevOvertimeSchedule = prevRecord?.employeeSchedule[`${key}_OVERTIME`] || [];
              let prevOvertimeOICSchedule =
                prevRecord?.employeeSchedule[`${key}_OVERTIME_OIC`] || [];

              let overtimeString = JSON.stringify(overtimeSchedule);
              let prevOvertimeString = JSON.stringify(prevOvertimeSchedule);
              let overtimeOICString = JSON.stringify(overtimeOICSchedule);
              let prevOvertimeOICString = JSON.stringify(prevOvertimeOICSchedule);
              let departmentSchedule = JSON.stringify(record?.schedule);
              let prevDepartmentSchedule = JSON.stringify(prevRecord?.schedule);

              let isOvertimeIsEqual = overtimeString !== prevOvertimeString;
              let isOvertimeOICIsEqual = overtimeOICString !== prevOvertimeOICString;
              let departmentScheduleIsEqual = departmentSchedule !== prevDepartmentSchedule;

              // // for testing only.. this if for 5A and BUSINESS FINANCE departments
              // if (
              //   (record?.id === 'fafc4899-1a2d-4941-ae90-0d6afc8f1695' ||
              //     record?.id === 'a405bf90-9ec1-465e-bfbf-c5a49649a39b') &&
              //   key === '03_01_2021'
              // ) {
              //   console.time('isEqual' + record?.id);

              //   console.timeEnd('isEqual' + record?.id);
              //   overtimeSchedule.forEach(
              //     (sched) =>
              //       (overtimeString += `${sched?.department} ${sched?.dateTimeStartRaw} ${sched?.dateTimeEndRaw}`),
              //   );
              //   prevOvertimeSchedule.forEach(
              //     (sched) =>
              //       (prevOvertimeString += `${sched?.department} ${sched?.dateTimeStartRaw} ${sched?.dateTimeEndRaw}`),
              //   );
              // }

              return (
                `${schedule?.label} ${schedule?.dateTimeStartRaw} ${schedule?.dateTimeEndRaw} ${schedule?.color}` !==
                  `${prevSchedule?.label} ${prevSchedule?.dateTimeStartRaw} ${prevSchedule?.dateTimeEndRaw} ${prevSchedule?.color}` ||
                `${restSchedule?.label} ${restSchedule?.dateTimeStartRaw} ${restSchedule?.dateTimeEndRaw} ${restSchedule?.color}` !==
                  `${prevRestSchedule?.label} ${prevRestSchedule?.dateTimeStartRaw} ${prevRestSchedule?.dateTimeEndRaw} ${prevRestSchedule?.color}` ||
                `${OICSchedule?.label} ${OICSchedule?.dateTimeStartRaw} ${OICSchedule?.dateTimeEndRaw} ${OICSchedule?.color}` !==
                  `${prevOICSchedule?.label} ${prevOICSchedule?.dateTimeStartRaw} ${prevOICSchedule?.dateTimeEndRaw} ${prevOICSchedule?.color}` ||
                isOvertimeIsEqual ||
                departmentScheduleIsEqual ||
                isOvertimeOICIsEqual
              );
            },
            render: (text, record, index) => {
              const { employeeSchedule } = record;
              return {
                children: (
                  <ScheduleCell
                    employeeSchedule={employeeSchedule}
                    employeeRecord={record}
                    date={date}
                    cellKey={key}
                    onClickSchedule={onClickSchedule}
                    handleSelectCell={handleSelectCell}
                  />
                ),
              };
            },
          },
        ],
      });
    }
    setColumns([defaultColumn, ...newColumns]);
  };

  // Submit handler when the user clicks the "Get Schedule" button
  const handleSubmit = (values) => {
    let datesValue = values?.dates;
    if (Array.isArray(datesValue)) {
      if (datesValue[0] && datesValue[1]) {
        let startDate = moment(datesValue[0]).startOf('day').utc().format();
        let endDate = moment(datesValue[1]).endOf('day').utc().format();
        setState({
          ...state,
          startDate,
          endDate,
          page: 0,
          department: values?.department,
        });
        getEmployeeSchedule({
          variables: {
            ...state,
            startDate,
            page: 0,
            endDate,
            department: values?.department,
          },
        });
      }
    }
  };

  const manualRefetchEmployeeSchedule = () => {
    refetchEmployeeSchedule({
      variables: {
        ...state,
        startDate: moment(state.startDate).startOf('day').utc().format(),
        endDate: moment(state.endDate).endOf('day').utc().format(),
      },
    });
  };

  // handler for the pagination e.g. page selection
  // and changing the size of the pagination
  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
    fetchMore({
      variables: {
        state,
        page: page - 1,
        size,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        return fetchMoreResult;
      },
    });
  };

  const scrollProps = { x: 0, y: 'calc(100vh - 330px)' };
  let legends = [];
  if (Array.isArray(data?.legend)) {
    legends = [...legends, ...data?.legend];
    legends = [
      ...legends,
      {
        label: REST_DAY_SCHEDULE_LABEL,
        title: REST_DAY_SCHEDULE_TITLE,
        color: REST_DAY_SCHEDULE_COLOR,
      },
      {
        type: 'icon',
        icon: (
          <div
            style={{
              height: 20,
              width: 20,
              backgroundColor: 'white',
              borderColor: '#3498db',
              borderWidth: 2,
              borderStyle: 'solid',
              borderRadius: 30,
              display: 'inline-block',
              marginRight: 10,
            }}
          />
        ),
        title: 'Custom Schedule',
      },
      {
        type: 'icon',
        icon: <BsFillPersonFill style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'OIC',
      },
      {
        type: 'icon',
        icon: <MdAvTimer style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'Overtime',
      },
      {
        type: 'icon',
        icon: <FaBed style={{ fontSize: 20, marginRight: 10 }} />,
        title: 'Rest Day with Scheduled Duty',
      },
    ];
  }
  let { status: detailsModalStatus, isCustom, isOIC, ...selectedData } = detailsModal;
  const departments = [
    {
      label: 'No Departments',
      value: null,
    },
    ...(dataDepartment?.departments || []),
  ];
  return (
    <>
      <Head>
        <title>Schedule</title>
      </Head>
      <HRPageHeader title="Employee Work Schedule" />
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row type="flex" gutter={[12, 12]}>
          <Col span={12}>
            <Row gutter={12}>
              <Col span={24}>
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
            </Row>
          </Col>
          <Col span={12}>
            <Spin spinning={loadingDepartment}>
              <HRSelect
                name="department"
                label="Select Department"
                options={departments || []}
                placeholder="Search Department"
                allowClear={true}
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Spin>
          </Col>
          <Col span={24}>
            <HRButton block type="primary" htmlType="submit">
              Get Schedule
            </HRButton>
          </Col>
        </Row>
      </HRForm>
      {legends.length > 0 && (
        <div style={{ margin: '30px 0' }}>
          <Typography.Title level={4}>Legend</Typography.Title>
          {legends?.map((item) => {
            if (item?.type === 'icon') {
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
                  key={item?.title}
                >
                  {item?.icon}
                  <Typography.Text strong>{`${item?.title}`}</Typography.Text>
                </div>
              );
            } else
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}
                  key={`${item?.title}(${item.label})`}
                >
                  <div
                    style={{
                      height: 20,
                      width: 20,
                      backgroundColor: item?.color,
                      borderRadius: 30,
                      display: 'inline-block',
                      marginRight: 10,
                    }}
                  />

                  <Typography.Text strong>
                    {`${item?.title}(${item.label})`}
                    {/* {item?.timeStart && item?.timeEnd && ` — ${item?.timeStart}-${item?.timeEnd}`} */}
                  </Typography.Text>
                </div>
              );
          })}
        </div>
      )}
      <Row style={{ marginTop: 20 }}>
        <div style={{ width: '100%' }}>
          <Pagination
            defaultCurrent={1}
            total={data?.employees?.totalElements}
            pageSize={state.size}
            onChange={onNexPage}
            current={state.page + 1}
            style={{ marginBottom: 20 }}
            pageSizeOptions={[10, 15, 20, 25]}
          />
          <Table
            columns={columns}
            loading={loading}
            dataSource={data?.employees?.content || []}
            bordered
            size="middle"
            scroll={scrollProps}
            pagination={false}
            rowKey="id"
          />
          <Pagination
            defaultCurrent={1}
            total={data?.employees?.totalElements}
            pageSize={state.size}
            onChange={onNexPage}
            current={state.page + 1}
            style={{ marginTop: 20 }}
            pageSizeOptions={[10, 15, 20, 25]}
          />
        </div>
      </Row>
      <ScheduleDetailsModal
        visible={detailsModalStatus && !isCustom && !isOIC}
        selectedData={selectedData}
        handleModal={handleDetailsModal}
        manualRefetchEmployeeSchedule={manualRefetchEmployeeSchedule}
      />

      <CustomScheduleModal
        visible={detailsModalStatus && (isCustom || isOIC)}
        isOIC={isOIC}
        isCustom={isCustom}
        selectedData={selectedData}
        handleModal={handleDetailsModal}
        manualRefetchEmployeeSchedule={manualRefetchEmployeeSchedule}
      />
    </>
  );
};

export default EmployeeWorkSchedulePage;
