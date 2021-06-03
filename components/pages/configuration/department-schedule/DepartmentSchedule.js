import React, { useContext, useState } from 'react';
import { HRButton, HRDivider, HRList, HRListItem } from '@components/commons';
import { Col, Row, Typography, Modal, message, Dropdown, Menu } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { gql, useMutation } from '@apollo/client';
import {
  REST_DAY_SCHEDULE_COLOR,
  REST_DAY_SCHEDULE_LABEL,
  REST_DAY_SCHEDULE_TITLE,
} from '@utils/constants';
import CopyDepartmentScheduleModal from './CopyDepartmentScheduleModal';
import DepartmentScheduleFormModal from './DepartmentScheduleFormModal';
import { hasPermission } from '@utils/accessFunctions';
import { AccountContext } from '@components/accessControl/AccountContext';
import AccessControl from '@components/accessControl/AccessControl';
import useHasPermission from '@hooks/useHasPermission';

const DELETE_DEPT_SCHED = gql`
  mutation($id: UUID) {
    data: deleteDepartmentSchedule(id: $id) {
      success
      message
    }
  }
`;

const CLEAR_DEPT_SCHED = gql`
  mutation($id: UUID) {
    data: clearSchedule(id: $id) {
      success
      message
    }
  }
`;

const scheduleHeaders = [
  {
    text: 'Title',
    span: 7,
  },
  {
    text: 'Label',
    span: 3,
  },
  {
    text: 'Time Start',
    span: 4,
  },
  {
    text: 'Time End',
    span: 4,
  },
  {
    text: 'Color',
    span: 4,
  },
  {
    text: 'Actions',
    span: 2,
  },
];

const DepartmentSchedule = ({ department = {}, ...props }) => {
  const accountContext = useContext(AccountContext);
  const [formModal, setFormModal] = useState(false);
  const [copyModal, setCopyModal] = useState(false);
  const [value, setValue] = useState({});
  const isAllowed = useHasPermission([
    'manage_dept_sched_config',
    'copy_dept_sched_config',
    'clear_department_schedule_config',
  ]);
  const allowedManageDeptSchedule = useHasPermission(['manage_dept_sched_config']);
  const allowedCopyDeptSched = useHasPermission(['copy_dept_sched_config']);
  const allowedClearDeptSched = useHasPermission(['clear_department_schedule_config']);

  const [deleteDepartmentSchedule, { loading: loadingDeleteSchedule }] = useMutation(
    DELETE_DEPT_SCHED,
    {
      onCompleted: (result) => {
        const data = result?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted department schedule config.');
          props?.refetch();
        } else message.error(data?.message ?? 'Failed to delete department schedule config.');
      },
    },
  );
  const [clearDepartmentSchedule, { loading: loadingClearDepartmentSchedule }] = useMutation(
    CLEAR_DEPT_SCHED,
    {
      onCompleted: (result) => {
        const data = result?.data || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully deleted department schedule config.');
          props?.refetch();
        } else message.error(data?.message ?? 'Failed to delete department schedule config.');
      },
    },
  );

  const handleFormModal = (selectedRow = {}, willRefetch) => {
    setValue({ ...selectedRow });
    if (willRefetch) props?.refetch();
    setFormModal(!formModal);
  };
  const handleCopyModal = (willRefetch) => {
    if (willRefetch) props?.refetch();
    setCopyModal(!copyModal);
  };

  const handleClearDepartmentSchedule = () => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to clear department schedule?',
      onOk: () =>
        clearDepartmentSchedule({
          variables: {
            id: department?.id,
          },
        }),
    });
  };

  const handleDeleteSchedule = (id) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this schedule?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => deleteDepartmentSchedule({ variables: { id } }),
    });
  };

  const dept = department;
  let schedules = dept?.schedules || [];
  schedules = [
    {
      title: REST_DAY_SCHEDULE_TITLE,
      label: REST_DAY_SCHEDULE_LABEL,
      color: REST_DAY_SCHEDULE_COLOR,
    },
    ...schedules,
  ];

  return (
    <span key={dept?.id}>
      <HRDivider>{dept?.departmentName}</HRDivider>
      {/* <HRButton
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => handleFormModal({ department: dept?.id })}
      >
        Create Schedule
      </HRButton> */}
      <HRList
        title="Department Schedule"
        headers={scheduleHeaders}
        dataSource={schedules || []}
        titleActions={
          isAllowed && [
            <Dropdown
              key="options"
              trigger={['click']}
              overlay={
                <Menu>
                  {allowedManageDeptSchedule && (
                    <Menu.Item onClick={() => handleFormModal({ department: dept?.id })}>
                      Create Schedule
                    </Menu.Item>
                  )}
                  {allowedCopyDeptSched && (
                    <Menu.Item onClick={() => handleCopyModal(false)}>Copy Schedule</Menu.Item>
                  )}
                  {allowedClearDeptSched && (
                    <Menu.Item danger onClick={handleClearDepartmentSchedule}>
                      Clear Schedule
                    </Menu.Item>
                  )}
                </Menu>
              }
              placement="bottomRight"
            >
              <HRButton shape="circle" icon={<MoreOutlined />} />
            </Dropdown>,
          ]
        }
        renderItem={(item) => {
          return (
            <HRListItem noAction itemKey={item?.id}>
              <Row style={{ width: '100%' }}>
                <Col span={7} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography.Text>{item.title || 'N/A'}</Typography.Text>
                </Col>
                <Col span={3} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography.Text>{item.label || 'N/A'}</Typography.Text>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography.Text>{item?.dateTimeStart ?? 'N/A'}</Typography.Text>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography.Text>{item?.dateTimeEnd ?? 'N/A'}</Typography.Text>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  {item?.color ? (
                    <span
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: item?.color,
                        display: 'inline-block',
                        borderRadius: 25,
                      }}
                    />
                  ) : (
                    'N/A'
                  )}
                </Col>
                <Col span={2} style={{ display: 'flex', alignItems: 'center' }}>
                  {item?.label !== REST_DAY_SCHEDULE_LABEL && (
                    <span>
                      <HRButton
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => handleFormModal(item)}
                      />
                      <HRDivider type="vertical" />
                      <HRButton
                        danger
                        type="primary"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteSchedule(item?.id)}
                      />
                    </span>
                  )}
                </Col>
              </Row>
            </HRListItem>
          );
        }}
      />
      <DepartmentScheduleFormModal
        visible={formModal}
        handleModal={handleFormModal}
        department={department?.id}
        value={value}
      />
      <CopyDepartmentScheduleModal
        visible={copyModal}
        handleModal={handleCopyModal}
        department={department?.id}
      />
    </span>
  );
};

// export default DepartmentSchedule;
export default React.memo(DepartmentSchedule, (prevProps, props) => {
  let department = JSON.stringify(props?.department);
  let prevDepartment = JSON.stringify(prevProps?.department);

  return department === prevDepartment;
});
