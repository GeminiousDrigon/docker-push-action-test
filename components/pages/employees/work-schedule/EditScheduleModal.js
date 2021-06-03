import { useEffect, useContext } from 'react';
import { HRButton, HRForm, HRModal, HRSelect, HRCheckbox } from '@components/commons';
import MomentFormatter from '@components/utils/MomentFormatter';
import { Alert, message, Spin, DatePicker, Typography } from 'antd';
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

const EditScheduleModal = (props) => {
  const methods = useForm({
    defaultValues: {
      dateTimeStartRaw: null,
      dateTimeEndRaw: null,
      department: null,
      isOIC: false,
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
      if (schedule?.id) {
        methods?.reset({
          dateTimeEndRaw: moment(schedule?.dateTimeEndRaw),
          dateTimeStartRaw: moment(schedule?.dateTimeStartRaw),
          department: schedule?.department?.id,
          isOIC: schedule?.isOIC,
        });
      }
    },
  });

  const onCancelModal = () => {
    props?.handleModal({}, false);
  };

  const handleSubmit = (values) => {
    console.log(values);
    let dateTimeStart = moment(values.dateTimeStartRaw);
    let dateTimeEnd = moment(values.dateTimeStartRaw);
    dateTimeEnd.hour(values.dateTimeEndRaw.hour());
    dateTimeEnd.seconds(values.dateTimeEndRaw.seconds());
    dateTimeEnd.millisecond(values.dateTimeEndRaw.millisecond());
    if (isTimeGreaterThan(dateTimeStart, dateTimeEnd)) {
      dateTimeEnd.add(1, 'day');
    }

    // console.log(`Start: ${moment(dateTimeStart).format('dddd, MMMM D, YYYY, h:mm A')}`);
    // console.log(`End: ${moment(dateTimeEnd).format('dddd, MMMM D, YYYY, h:mm A')}`);
    // console.log(values?.department);

    let { department, departmentName, ...schedule } = props?.schedule || {};
    setEmployeeSched({
      variables: {
        id: props?.schedule?.id || null,
        employee_id: props?.employee?.id || null,
        department: values?.department,
        fields: {
          ...schedule,
          dateTimeStartRaw: dateTimeStart.utc().format(),
          dateTimeEndRaw: dateTimeEnd.utc().format(),
          isOvertime: props?.isOvertime,
          isOIC: values?.isOIC || false,
        },
      },
    });
  };

  useEffect(() => {
    if (props?.visible) {
      if (props?.schedule?.id) {
        //get schedule
        getDepartment();
        getSchedule({
          variables: {
            id: props?.schedule?.id,
          },
        });
      } else {
        getDepartment();
        methods?.reset({
          dateTimeStartRaw: moment(props?.selectedDate).startOf('day'),
          dateTimeEndRaw: moment(props?.selectedDate).startOf('day').add(1, 'hour').minutes(0),
          department: props?.employee?.department,
          isOIC: false,
        });
      }
    } else methods.reset();
  }, [props?.visible, props?.schedule]);

  const disabledDate = (current) => {
    if (props?.isOvertime) {
      if (
        moment(current).startOf('day').format('MM_DD_YYYY') ==
        moment(props?.selectedDate).startOf('day').format('MM_DD_YYYY')
      )
        return false;
      return (
        current < moment(props?.selectedDate).endOf('day') ||
        current > moment(props?.selectedDate).add(1, 'days').endOf('day')
      );
    } else return false;
  };

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
      title={`${props?.schedule ? 'Edit' : 'Create'} Schedule`}
      onCancel={onCancelModal}
      footer={null}
    >
      <Spin spinning={loadingDepartment || loadingGetSchedule}>
        <HRForm onSubmit={handleSubmit} methods={methods}>
          <Typography.Title level={4}>
            Date: <MomentFormatter value={props?.selectedDate} format="dddd, MMMM D, YYYY" />
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

          <div style={{ marginTop: 10 }}>
            {props?.isOvertime && <HRCheckbox name="isOIC">OIC</HRCheckbox>}
          </div>

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
            disabled={props?.schedule?.isOIC}
          />
          <Controller
            name="dateTimeStartRaw"
            render={(inputProps) => {
              return (
                <>
                  <label>Time Start</label>
                  <DatePicker
                    showNow={false}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabled={
                      props?.schedule?.isOIC
                        ? false
                        : !props?.isOvertime && !props?.schedule?.isCustom
                    }
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
                  <DatePicker
                    showNow={false}
                    showTime
                    format="MMMM D, YYYY, h:mm A"
                    style={{ width: '100%' }}
                    {...inputProps}
                    value={inputProps.value && moment(inputProps.value)}
                    disabled={
                      props?.schedule?.isOIC
                        ? false
                        : !props?.isOvertime && !props?.schedule?.isCustom
                    }
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

export default EditScheduleModal;
