import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  HRButton,
  HRDivider,
  HRList,
  HRListItem,
  HRPageHeader,
  HRSelect,
} from '@components/commons';
import { Col, Row, Input, Tooltip, Pagination } from 'antd';
import { useRouter } from 'next/router';
import { EMPLOYEE_QUERY } from '../list';
import { UnorderedListOutlined } from '@ant-design/icons';

export const DEPARTMENT_QUERY = gql`
  {
    departments {
      id
      departmentCode
      departmentName
      departmentDesc
      parentDepartment {
        id
        departmentName
        departmentCode
      }
    }
  }
`;

const initialState = {
  filter: '',
  department: null,
  size: 25,
  page: 0,
};

const EmployeeAttendanceLogsPage = (props) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const { loading: departmentLoading, data: departmentData } = useQuery(DEPARTMENT_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { loading = true, data, refetch } = useQuery(EMPLOYEE_QUERY, {
    variables: {
      filter: state.filter,
      department: state.department,
      page: state.page,
      size: state.size,
    },
  });
  const onQueryChange = (field, value) => {
    setState({
      ...state,
      page: 0,
      [field]: value,
    });
  };

  const addEmployee = () => {
    router.push('manage');
  };
  const getEmployeeLogs = (id) => {
    router.push(`/employees/employee-attendance/${id}`);
  };

  const onNexPage = (page, size) => {
    setState({ ...state, page: page - 1, size });
  };

  const renderEmployees = (employee) => {
    return (
      <HRListItem>
        <Row style={{ width: '100%' }}>
          <Col span={10}>{employee?.fullName}</Col>
          <Col span={10}>{employee?.department?.departmentName || 'N/A'}</Col>
          <Col md={4}>
            <Tooltip title="View Attendance Logs">
              <HRButton
                shape="circle"
                ghost
                icon={<UnorderedListOutlined />}
                type="primary"
                onClick={() => getEmployeeLogs(employee?.id)}
              />
            </Tooltip>
          </Col>
        </Row>
      </HRListItem>
    );
  };

  const headers = [
    {
      text: 'Employee Name',
      span: 10,
    },
    {
      text: 'Department',
      span: 10,
    },
    {
      text: 'Action',
      span: 4,
    },
  ];
  return (
    <>
      <HRPageHeader title="Employee Attendance" />
      <Row type={'flex'} gutter={8}>
        <Col span={12}>
          <Input.Search
            style={{ width: '100%' }}
            placeholder="Search Employees"
            onSearch={(value) => onQueryChange('filter', value)}
            allowClear
          />
        </Col>
        <Col span={6}>
          <HRSelect
            options={departmentData?.departments.map((item) => {
              return {
                value: item.id,
                label: item.departmentName,
              };
            })}
            placeholder="Search Department"
            allowClear={true}
            onChange={(value) => onQueryChange('department', value)}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Col>
      </Row>
      <HRDivider />
      <div style={{ marginTop: 10 }}>
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
        <HRList
          dataSource={data?.employees?.content || []}
          headers={headers}
          renderItem={renderEmployees}
          style={{ margin: '10px 0' }}
        />
        <Pagination
          defaultCurrent={1}
          total={data?.employees?.totalElements}
          pageSize={state.size}
          onChange={onNexPage}
          current={state.page + 1}
        />
      </div>
    </>
  );
};

export default EmployeeAttendanceLogsPage;
