import { useEffect, useContext } from 'react';
import { HRButton, HRForm, HRModal, HRSelect } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import { Alert, message, Spin, TimePicker, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { gql, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { isTimeGreaterThan, isTimeGreaterThanOrEqual } from '@utils/moment';

const UPDATE_EMPLOYEE_SCHED = gql`
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

const GET_SCHEDULE = gql`
  query($id: UUID) {
    schedule: getSchedule(id: $id) {
      id
      color
      dateTimeEndRaw
      dateTimeStartRaw
      isOvertime
      isRestDay
      label
      locked
      mealBreakEnd
      mealBreakStart
      title
      department {
        id
        departmentName
        departmentCode
      }
    }
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

const CustomScheduleModal = (props) => {
  const methods = useForm({
    defaultValues: {
      dateTimeStartRaw: null,
      dateTimeEndRaw: null,
      department: null,
    },
  });
  const [getDepartment, { data: departmentData, loading: loadingDepartment }] = useLazyQuery(
    GET_DEPARTMENT,
  );
  const [setEmployeeSched, { loading: loadingSetEmployeeSched }] = useMutation(
    UPDATE_EMPLOYEE_SCHED,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          props?.handleModal({}, true);
          message.success(data?.message ?? 'Successfully updated employee schedule.');
        } else message.error(data?.message ?? 'Failed to update employee schedule.');
      },
      fetchPolicy: 'no-cache',
    },
  );
  const [getSchedule, { data, loading: loadingGetSchedule }] = useLazyQuery(GET_SCHEDULE, {
    onCompleted: (result) => {
      let { schedule } = result || {};
      let currentScheduleString = moment(props?.selectedData?.date).format('MM_DD_YYYY');
      let currentSchedule = props?.selectedData?.employee?.employeeSchedule[currentScheduleString];
      if (schedule?.id) {
        methods?.reset({
          dateTimeEndRaw: moment(schedule?.dateTimeEndRaw),
          dateTimeStartRaw: moment(schedule?.dateTimeStartRaw),
          department: props?.isOIC ? schedule?.department?.id : currentSchedule?.department,
        });
      }
    },
  });

  const onCancelModal = () => {
    props?.handleModal({}, false);
  };

  const handleSubmit = (values) => {
    let dateTimeStart = moment(values.dateTimeStartRaw);
    let dateTimeEnd = moment(values.dateTimeStartRaw);
    dateTimeEnd.hour(values.dateTimeEndRaw.hour());
    dateTimeEnd.seconds(values.dateTimeEndRaw.seconds());
    dateTimeEnd.millisecond(values.dateTimeEndRaw.millisecond());
    if (isTimeGreaterThan(dateTimeStart, dateTimeEnd)) {
      dateTimeEnd.add(1, 'day');
    }

    let { date = {}, employee = {} } = props?.selectedData || {};
    let dateKey = date.format('MM_DD_YYYY');
    let selectedSchedule = props?.isOIC
      ? employee?.employeeSchedule[`${dateKey}_OIC`]
      : employee?.employeeSchedule[dateKey];
    let { department, departmentName, ...schedule } = selectedSchedule || {};
    setEmployeeSched({
      variables: {
        id: schedule?.id || null,
        employee_id: employee?.id || null,
        department: values?.department,
        fields: {
          ...schedule,
          dateTimeStartRaw: dateTimeStart.utc().format(),
          dateTimeEndRaw: dateTimeEnd.utc().format(),
          isOvertime: false,
          isCustom: props?.isCustom,
          isOIC: props?.isOIC,
        },
      },
    });
  };

  useEffect(() => {
    if (props?.visible) {
      let { employee, date } = props?.selectedData || {};
      let dateKey = date.format('MM_DD_YYYY');
      let selectedSchedule = employee?.employeeSchedule[dateKey];
      let { department, departmentName, ...schedule } = selectedSchedule || {};
      if (schedule?.id) {
        //get schedule
        getDepartment();
        getSchedule({
          variables: {
            id: schedule?.id,
          },
        });
      } else {
        getDepartment();
        methods?.reset({
          dateTimeStartRaw: moment(date).startOf('day'),
          dateTimeEndRaw: moment(date).startOf('day').add(1, 'hour').minutes(0),
          department: employee?.department,
        });
      }
    } else methods.reset();
  }, [props?.visible, props?.schedule, props?.selectedData?.department]);

  const { dateTimeStartRaw } = props?.schedule || {};
  let { dateTimeStartRaw: timeStart, dateTimeEndRaw: timeEnd } = methods.watch([
    'dateTimeStartRaw',
    'dateTimeEndRaw',
  ]);

  let isLessThan = false;
  if (timeEnd) isLessThan = isTimeGreaterThanOrEqual(timeStart, timeEnd);
  return (
    <HRModal
      visible={props?.visible}
      title={`${props?.isCustom ? 'Custom' : 'OIC'} Schedule`}
      onCancel={onCancelModal}
      footer={null}
    >
      <Spin spinning={loadingDepartment || loadingGetSchedule}>
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Typography.Title level={4}>
            Date: <MomentFormatter value={props?.selectedData?.date} format="dddd, MMMM D, YYYY" />
            <br />
          </Typography.Title>
          {isLessThan && (
            <Alert
              style={{ marginTop: 10 }}
              message={`If the "Time End" is less than or earlier than "Time Start", this means it will end the "Next Day".`}
              message={
                <Typography.Text>
                  If the <Typography.Text strong>"Time End"</Typography.Text> is less than or
                  earlier than <Typography.Text strong>"Time Start"</Typography.Text>, this means it
                  will end the <Typography.Text strong>"Next Day"</Typography.Text>.
                </Typography.Text>
              }
              type="info"
              showIcon
            />
          )}
          <HRSelect
            name="department"
            label="Select Department"
            options={departmentData?.departments || []}
            placeholder="Search Department"
            allowClear={true}
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={props?.isOIC}
          />
          <Controller
            name="dateTimeStartRaw"
            render={(inputProps) => {
              return (
                <>
                  <label>Time Start</label>
                  <TimePicker
                    showNow={false}
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                  />
                </>
              );
            }}
          />
          <Controller
            name="dateTimeEndRaw"
            render={(inputProps) => {
              return (
                <>
                  <label>Time End</label>
                  <TimePicker
                    showNow={false}
                    use12Hours
                    format="h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                  />
                </>
              );
            }}
          />
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
            <HRButton style={{ marginRight: 10 }} onClick={onCancelModal}>
              Cancel
            </HRButton>
            <HRButton htmlType="submit" type="primary" loading={loadingSetEmployeeSched}>
              Submit
            </HRButton>
          </div>
        </HRForm>
      </Spin>
    </HRModal>
  );
};

export default CustomScheduleModal;
