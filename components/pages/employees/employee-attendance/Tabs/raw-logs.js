import { useState, useEffect, useContext } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { HRButton, HRDivider, HRForm } from '@components/commons';
import { Pagination, Col, DatePicker, Row, Tag, Tooltip, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import MomentFormatter from '@components/utils/MomentFormatter';
import HRTable from '@components/commons/HRTable';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AttendanceModal from './AttendanceModal';
import { hasPermission } from '@utils/accessFunctions';
import { AccountContext } from '@components/accessControl/AccountContext';

const GET_SAVED_EMPLOYEE_ATTENDANCE = gql`
  query($size: Int, $page: Int, $id: UUID, $startDate: Instant, $endDate: Instant) {
    logs: getSavedEmployeeAttendance(
      size: $size
      page: $page
      id: $id
      startDate: $startDate
      endDate: $endDate
    ) {
      content {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        method
        original_attendance_time
        source
        type
        originalType
        employee {
          id
        }
      }
      totalElements
    }
  }
`;

const UPSERT_EMPLOYEE_ATTENDANCE = gql`
  mutation($id: UUID, $employee: UUID, $fields: Map_String_ObjectScalar) {
    data: upsertEmployeeAttendance(id: $id, employee: $employee, fields: $fields) {
      payload {
        additionalNote
        attendance_time
        createdBy
        createdDate
        id
        isIgnored
        isManual
        lastModifiedBy
        lastModifiedDate
        method
        original_attendance_time
        source
        type
      }
      success
      message
    }
  }
`;

const DELETE_EMPLOYEE_ATTENDANCE = gql`
  mutation($id: UUID) {
    data: deleteEmployeeAttendance(id: $id) {
      message
      success
    }
  }
`;

const initialState = {
  size: 25,
  page: 0,
  startDate: null,
  endDate: null,
};
const RawEmployeeLogs = (props) => {
  const router = useRouter();
  const accountContext = useContext(AccountContext);
  const methods = useForm({
    defaultValues: {
      dates: [null, null],
    },
  });
  const [state, setState] = useState(initialState);
  const [attendanceModal, setAttendanceModal] = useState({
    visible: false,
    selectedAttendance: {},
  });

  const [getEmployeeAttendance, { data, loading, refetch }] = useLazyQuery(
    GET_SAVED_EMPLOYEE_ATTENDANCE,
  );
  const [upsertEmployeeAttendance, { loading: loadingUpsertEmployeeAttendance }] = useMutation(
    UPSERT_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully updated employee attendance.');
          getEmployeeAttendance({
            variables: {
              ...state,

              id: router?.query?.id || null,
            },
          });
        } else message.error(data?.message ?? 'Failed to update employee attendance.');
      },
    },
  );
  const [deleteEmployeeAttendance, { loading: loadingDeleteEmployeeAttendance }] = useMutation(
    DELETE_EMPLOYEE_ATTENDANCE,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted employee attendance.');
          getEmployeeAttendance({
            variables: {
              ...state,
              id: router?.query?.id || null,
            },
          });
        } else message.error(data?.message ?? 'Failed to delete employee attendance.');
      },
    },
  );

  useEffect(() => {
    if (router?.query?.startDate && router?.query?.endDate && router?.query?.prefetch == 'true') {
      methods?.setValue('dates', [
        moment(parseInt(router?.query?.startDate)),
        moment(parseInt(router?.query?.endDate)),
      ]);
      getEmployeeAttendance({
        variables: {
          ...state,
          startDate: moment(parseInt(router?.query?.startDate)).startOf('day').utc().format(),
          endDate: moment(parseInt(router?.query?.endDate)).endOf('day').utc().format(),
          id: router?.query?.id || null,
        },
      });
    }
  }, []);

  const handleSubmit = ({ dates }) => {
    getEmployeeAttendance({
      variables: {
        ...state,
        startDate: moment(dates[0]).startOf('day').utc().format(),
        endDate: moment(dates[1]).endOf('day').utc().format(),
        id: router?.query?.id || null,
      },
    });
    setState({
      ...state,
      startDate: moment(dates[0]).startOf('day').utc().format(),
      endDate: moment(dates[1]).endOf('day').utc().format(),
      page: 0,
    });
  };

  const handleAttendanceModal = (selectedAttendance = {}, willRefetch = false) => {
    if (willRefetch) refetch();

    setAttendanceModal({
      visible: !attendanceModal.visible,
      selectedAttendance: { ...selectedAttendance },
    });
  };

  const handleDateChange = (datesValue) => {
    methods.setValue('dates', datesValue, { shouldValidate: true });
  };

  const onClickIgnored = ({ employee, ...logs }) => {
    let newLogs = { ...logs };
    newLogs.isIgnored = !newLogs.isIgnored;
    upsertEmployeeAttendance({
      variables: {
        id: logs?.id || null,
        fields: newLogs,
        employee: employee?.id,
      },
    });
    // Modal.confirm({
    //   title: 'Are you sure',
    //   content: `Are you sure you want to ${logs?.isIgnored ? 'Unignore' : 'Ignore'} this log?`,
    //   onOk: () =>
    //     upsertEmployeeAttendance({
    //       variables: {
    //         id: logs?.id || null,
    //         fields: newLogs,
    //         employee: employee?.id,
    //       },
    //     }),
    // });
  };

  const onClickDeleteAttendance = (id) => {
    Modal.confirm({
      title: 'Are you sure',
      content: `Are you sure you want to delete this log?`,
      onOk: () =>
        deleteEmployeeAttendance({
          variables: {
            id,
          },
        }),
    });
  };

  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
    getEmployeeAttendance({
      variables: {
        ...state,
        page: page - 1,
        size,
        id: router.query?.id || null,
      },
    });
  };

  let columns = [
    {
      title: <strong>Date/Time</strong>,
      dataIndex: 'attendance_time',
      key: 'date-time',
      render: (
        text,
        { isManual, isIgnored, type, originalType, attendance_time, original_attendance_time },
      ) => (
        <>
          <span style={{ marginRight: 5 }}>
            <MomentFormatter value={text} format="ddd, MMMM D, YYYY, h:mm:ss A" />
          </span>
          {isManual && <Tag color="blue">MANUAL</Tag>}
          {isIgnored && <Tag color="red">IGNORED</Tag>}
          {(type !== originalType || attendance_time !== original_attendance_time) && !isManual && (
            <Tag color="green">EDITED</Tag>
          )}
        </>
      ),
    },
    {
      title: <strong>Status</strong>,
      dataIndex: 'type',
      key: 'age',
    },

    {
      title: <strong>Device</strong>,
      dataIndex: 'source',
      key: 'source',
    },
  ];

  if (
    hasPermission(
      ['manage_raw_logs', 'ignore_unignore_attendance_logs'],
      accountContext?.data?.user?.access,
    )
  ) {
    columns = columns.concat({
      title: <strong>Actions</strong>,
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (_, log) => {
        let { isIgnored, id } = log;
        return (
          <>
            <Tooltip title={isIgnored ? 'Unignore' : 'Ignore'}>
              <HRButton
                icon={
                  isIgnored ? <BsEye className="anticon" /> : <BsEyeSlash className="anticon" />
                }
                shape="circle"
                type="danger"
                ghost
                onClick={() => onClickIgnored(log)}
                allowedPermissions={['ignore_unignore_attendance_logs']}
                style={{ marginRight: 10 }}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <HRButton
                icon={<EditOutlined />}
                shape="circle"
                type="primary"
                onClick={() => handleAttendanceModal(log, false)}
                allowedPermissions={['manage_raw_logs']}
              />
            </Tooltip>
          </>
        );
      },
    });
  }

  return (
    <>
      {/* <Typography.Title level={2}>Accumulated Employee Logs</Typography.Title> */}
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
            <Col span={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <HRButton
                type="primary"
                block
                onClick={() => handleAttendanceModal({}, false)}
                allowedPermissions={['manage_raw_logs']}
              >
                Add Log
              </HRButton>
            </Col>
          </Row>
        </HRForm>
      </div>
      <HRDivider />
      <div>
        <Pagination
          defaultCurrent={1}
          total={data?.logs?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
        <HRTable
          loading={loading || loadingUpsertEmployeeAttendance}
          columns={columns}
          dataSource={data?.logs?.content || []}
          style={{ margin: '10px 0' }}
          pagination={false}
        />
        <Pagination
          defaultCurrent={1}
          total={data?.logs?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
      </div>
      <AttendanceModal {...attendanceModal} handleModal={handleAttendanceModal} />
    </>
  );
};

export default RawEmployeeLogs;
