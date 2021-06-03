import { useState, useEffect, useRef } from 'react';
import { HRButton, HRDivider, HRList, HRListItem, HRModal } from '@components/commons';
import { message, Spin, Typography, Modal, List, Tag } from 'antd';
import { gql } from 'apollo-boost';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import MomentFormatter from '@components/utils/MomentFormatter';

import EditScheduleModal from './EditScheduleModal';

const GET_EMPLOYEE_SCHED_DETAILS = gql`
  query($employee: UUID, $startDate: Instant, $endDate: Instant) {
    employee: getEmployeeScheduleDetails(
      employee: $employee
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      fullName
      department
      departmentName
      employeeSchedule
    }
  }
`;

const REMOVE_EMPLOYEE_SCHED_DETAILS = gql`
  mutation($id: UUID) {
    data: removeEmployeeSchedule(id: $id) {
      success
      message
    }
  }
`;

const ScheduleDetailsModal = (props) => {
  let { date, employee } = props?.selectedData || {};
  const willRefetch = useRef(false);
  const [overtimeEdit, setOvertimeEdit] = useState({
    status: false,
    schedule: null,
    isOvertime: false,
  });
  const [
    getEmployeSchedDetails,
    {
      data: employeeSchedDetails,
      loading: loadingEmployeeSchedDetails,
      refetch: refetchEmployeeSchedDetails,
    },
  ] = useLazyQuery(GET_EMPLOYEE_SCHED_DETAILS, {
    variables: {
      employee: employee?.id || null,
      startDate: moment(date).startOf('day').utc().format(),
      endDate: moment(date).endOf('day').utc().format(),
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  const [removeSchedule, { loading: loadingRemoveSchedule }] = useMutation(
    REMOVE_EMPLOYEE_SCHED_DETAILS,
    {
      onCompleted: (data) => {
        data = data?.data || {};
        if (data?.success) {
          willRefetch.current = true;
          message.success(data?.message ?? 'Successfully removed employee schedule.');
          refetchEmployeeSchedDetails();
        } else message.error(data?.message ?? 'Failed to remove employeeSchedule.');
      },
    },
  );

  useEffect(() => {
    if (props.visible) getEmployeSchedDetails();
    else {
      willRefetch.current = false;
      setOvertimeEdit({ status: false, schedule: null });
    }
  }, [props?.visible, props?.selectedData]);

  const handleOvertimeEdit = (schedule, initiateRefetch, isOvertime) => {
    if (initiateRefetch) refetchEmployeeSchedDetails();
    if (!willRefetch.current && initiateRefetch) {
      willRefetch.current = initiateRefetch;
    }
    setOvertimeEdit({ schedule: { ...schedule }, status: !overtimeEdit.status, isOvertime });
  };

  const handleEdit = (item, isOvertime) => {
    handleOvertimeEdit(item, false, isOvertime);
  };

  const onCancelModal = () => {
    props.handleModal({}, willRefetch.current);
  };

  const handleAddOvertime = () => {
    setOvertimeEdit({ status: true, schedule: null, isOvertime: true });
  };

  const handleDeleteSchedule = (id) => {
    Modal.confirm({
      title: 'Are you sure you?',
      content: 'Are you sure you want to delete this schedule?',
      onOk: () =>
        removeSchedule({
          variables: {
            id,
          },
        }),
    });
  };

  const dateFormat = moment(date).format('MM_DD_YYYY');
  let schedule = [];

  if (employeeSchedDetails?.employee?.employeeSchedule[dateFormat])
    schedule = [employeeSchedDetails?.employee?.employeeSchedule[dateFormat]];

  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_OIC`])
    schedule = [...schedule, employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_OIC`]];
  if (employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_REST`])
    schedule = [
      ...schedule,
      employeeSchedDetails?.employee?.employeeSchedule[`${dateFormat}_REST`],
    ];

  let overtime =
    [
      ...(employeeSchedDetails?.employee?.employeeSchedule?.[dateFormat + '_OVERTIME'] || []),
      ...(employeeSchedDetails?.employee?.employeeSchedule?.[dateFormat + '_OVERTIME_OIC'] || []),
    ] || [];
  return (
    <>
      <HRModal
        visible={props?.visible}
        title="Employee Schedule Details"
        width="45%"
        onCancel={onCancelModal}
        footer={null}
      >
        <Spin spinning={loadingEmployeeSchedDetails || loadingRemoveSchedule}>
          <Typography.Title level={4}>
            Date: <MomentFormatter value={date} format="dddd, MMMM D, YYYY" /> <br />
            Name: {employee?.fullName} <br />
            Department: {employee?.departmentName} <br />
          </Typography.Title>
          <HRDivider>Regular Schedule</HRDivider>
          <HRList
            title={null}
            dataSource={schedule || []}
            renderItem={(item) => {
              return (
                <HRListItem
                  handleDelete={() => handleDeleteSchedule(item?.id)}
                  handleEdit={() => handleEdit(item, false)}
                >
                  <List.Item.Meta
                    title={
                      <>
                        <Typography.Text strong>
                          {!item?.isCustom && !item.isOIC && `${item?.title} (${item?.label})—`}
                        </Typography.Text>
                        <Typography.Text strong={item?.isCustom}>
                          {`${item?.timeStart}-${item?.timeEnd}`}
                        </Typography.Text>
                        {item?.isOIC && (
                          <Tag color="red" style={{ marginLeft: 5, marginRight: 0 }}>
                            OIC
                          </Tag>
                        )}
                        {item?.isCustom && (
                          <Tag color="green" style={{ marginLeft: 5, marginRight: 0 }}>
                            CUSTOM
                          </Tag>
                        )}
                        {employee?.department !== item?.department && !item?.isRestDay && (
                          <Tag style={{ marginLeft: 5 }} color="blue">
                            {item?.departmentName}
                          </Tag>
                        )}
                      </>
                    }
                  />
                </HRListItem>
              );
            }}
          />

          <HRDivider>Overtime Schedule</HRDivider>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <HRButton type="primary" onClick={handleAddOvertime}>
              Add
            </HRButton>
          </div>
          <HRList
            title={null}
            dataSource={overtime}
            renderItem={(item) => {
              return (
                <HRListItem
                  handleEdit={() => handleEdit(item, true)}
                  handleDelete={() => handleDeleteSchedule(item?.id)}
                >
                  <Typography.Text strong>
                    {item?.timeStart}—{item?.timeEnd}
                  </Typography.Text>{' '}
                  {item?.isOIC && (
                    <Tag color="red" style={{ marginLeft: 5, marginRight: 0 }}>
                      OIC
                    </Tag>
                  )}
                  {employee?.department !== item?.department && (
                    <Tag style={{ marginLeft: 5 }} color="blue">
                      {item?.departmentName}
                    </Tag>
                  )}
                </HRListItem>
              );
            }}
          />
        </Spin>
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
          <HRButton type="primary" onClick={onCancelModal}>
            Close
          </HRButton>
        </div>
      </HRModal>
      <EditScheduleModal
        visible={overtimeEdit.status}
        handleModal={handleOvertimeEdit}
        schedule={overtimeEdit.schedule}
        isOvertime={overtimeEdit.isOvertime}
        employee={employeeSchedDetails?.employee}
        selectedDate={date}
      />
    </>
  );
};

export default ScheduleDetailsModal;
