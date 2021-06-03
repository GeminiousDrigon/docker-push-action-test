import { useState, useEffect } from 'react';
import {
  HRForm,
  HRPageHeader,
  HRInput,
  HRSelect,
  HRInputNumberNiAyingzkie,
  HRInputNumber,
  HRButton,
  HRSignaturerField,
  HRDatePicker,
  HRDivider,
} from '@components/commons';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, message, Modal, Skeleton } from 'antd';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import {
  employeeStatus,
  civilStatuses,
  DoctorServiceType,
  DoctorServiceClass,
  frequency,
  payrollTypes,
} from '@utils/constants';
import { CheckOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import _ from 'lodash';

const SAVE_USER = gql`
  mutation(
    $id: UUID
    $fields: Map_String_ObjectScalar
    $authorities: [String]
    $permissions: [String]
    $departmentId: UUID
    $departmentOfDutyId: UUID
    $deletedAuthorities: [String]
    $deletedPermissions: [String]
  ) {
    upsertEmployee(
      id: $id
      fields: $fields
      authorities: $authorities
      permissions: $permissions
      departmentId: $departmentId
      departmentOfDutyId: $departmentOfDutyId
      deletedAuthorities: $deletedAuthorities
      deletedPermissions: $deletedPermissions
    ) {
      lastName
      firstName
      middleName
      nameSuffix
      gender
      dob
      address
      country
      stateProvince
      cityMunicipality
      barangay
      gender
      emergencyContactName
      emergencyContactAddress
      emergencyContactRelationship
      emergencyContactNo
      zipCode
      address2
      employeeTelNo
      employeeCelNo
      philhealthNo
      sssNo
      tinNo
      bloodType
      basicSalary
      payFreq
      scheduleType
      positionType
      employeeType
      careProvider
      prcLicenseType
      prcExpiryDate
      prcLicenseNo
      ptrNo
      s2No
      vatable
      pmmcNo
      pfVatRate
      expandedVatRate
      phicGroup
      phicNo
      phicExpiryDate
      serviceType
      specialization
      serviceClass
      bankAccountName
      bankAccountNo
      user {
        login
        password
      }
    }
  }
`;

const GET_USER = gql`
  query($id: UUID) {
    employee(id: $id) {
      lastName
      firstName
      middleName
      nameSuffix
      gender
      dob
      address
      country
      stateProvince
      cityMunicipality
      barangay
      gender
      emergencyContactName
      emergencyContactAddress
      emergencyContactRelationship
      emergencyContactNo
      zipCode
      address2
      employeeTelNo
      employeeCelNo
      employeeType
      philhealthNo
      sssNo
      tinNo
      bloodType
      basicSalary
      payFreq
      scheduleType
      positionType
      careProvider
      prcLicenseType
      prcExpiryDate
      prcLicenseNo
      ptrNo
      s2No
      vatable
      pmmcNo
      pfVatRate
      expandedVatRate
      phicGroup
      phicNo
      phicExpiryDate
      serviceType
      specialization
      serviceClass
      bankAccountName
      bankAccountNo
      pagIbigId
      emailAddress
      nationality
      witholdTaxRate
      civilStatus
      signature1
      signature2
      signature3
      titleInitials
      user {
        login
        password
        access
        roles
      }
      department {
        id
        departmentName
      }
      departmentOfDuty {
        id
        departmentName
      }
    }
    authorities {
      name
    }
    permissions {
      description
      name
    }
    departments {
      id
      departmentName
    }
    phicGroup: getPHICGroup {
      id
      phicGroupName
      description
    }
    positions: getDOHPositions {
      id
      postdesc
      poscode
    }
    groupPolicies {
      id
      description
    }
    specialties: activeSpecialties {
      id
      name
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($username: String) {
    newPassword: changePassword(username: $username)
  }
`;

const EmployeeForm = (props) => {
  const router = useRouter();
  const client = useApolloClient();
  const employeeId = router.query?.id;
  const methods = useForm({ mode: 'onBlur' });

  const [state, setState] = useState({
    loading: false,
    deletedAuthorities: [],
    deletedPermissions: [],
    groupPolicyId: null,
  });

  const [saveUser, { loading: loadingSaveUser }] = useMutation(SAVE_USER, {
    onCompleted: (data) => {
      message.success('Successfully saved employee information.');
    },
  });

  const [changePasswordNow, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      Modal.info({
        title: 'Success',
        content:
          'The temporary password is ' +
          data.newPassword +
          '. Please copy and email this to the user',
        onOk() {},
        onCancel() {},
      });
    },
  });

  const { loading, data, called } = useQuery(GET_USER, {
    variables: {
      id: employeeId,
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let user = data?.employee?.user || {};
      let department = data?.employee?.department || {};
      let departmentOfDuty = data?.employee?.departmentOfDuty || {};
      methods.reset({
        ...data?.employee,
        login: user?.login,
        password: user?.password,
        departmentId: department?.id,
        departmentOfDutyId: departmentOfDuty?.id,
        authorities: user?.roles || [],
        permissions: user?.access || [],
      });
    },
  });

  const { loading: groupPolicyLoading, data: groupPolicyData } = useQuery(
    gql`
      query($groupPolicyId: UUID) {
        groupPolicy: getGroupPolicyById(groupPolicyId: $groupPolicyId) {
          id
          name
          description
          permissions
        }
      }
    `,
    {
      variables: {
        groupPolicyId: state.groupPolicyId,
      },
      skip: !state?.groupPolicyId,
      fetchPolicy: 'network-only',
    },
  );

  useEffect(updatePermissionsField, [groupPolicyData]);

  function updatePermissionsField() {
    if (!groupPolicyLoading) {
      let deletedPermissions = state.deletedPermissions;
      let permissionsToDelete = methods.getValues('permissions') ?? [];
      permissionsToDelete.forEach((item) => {
        deletedPermissions.push(item);
      });

      methods.setValue('permissions', groupPolicyData?.groupPolicy?.permissions ?? []);
    }
  }

  const changePassword = (login) => {
    Modal.confirm({
      title: 'Change Password Confirmation?',
      content: 'Please Confirm to reset Password',
      onOk() {
        changePasswordNow({
          variables: {
            username: login,
          },
        });
      },
      onCancel() {},
    });
  };

  const handleSubmit = (values) => {
    saveUser({
      variables: {
        fields: values,
        id: employeeId,
        authorities: values?.authorities,
        permissions: values?.permissions,
        departmentId: values.departmentId,
        departmentOfDutyId: values.departmentOfDutyId,
        deletedAuthorities: state.deletedAuthorities,
        deletedPermissions: state.deletedPermissions,
      },
    });
  };

  function onDeselectAuthority(item) {
    let deletedAuthorities = state.deletedAuthorities;
    deletedAuthorities.push(item);

    setState({ ...state, deletedAuthorities: deletedAuthorities });
  }

  function onDeselectPermission(item) {
    let deletedPermissions = state.deletedPermissions;
    deletedPermissions.push(item);

    setState({ ...state, deletedPermissions: deletedPermissions });
  }

  function onChangeGroupPolicy(item) {
    setState({ ...state, groupPolicyId: item });
  }

  let groupPolicies = _.map(data?.groupPolicies, (item) => ({
    label: item.description,
    value: item.id,
  }));

  let permissions = _.map(data?.permissions, (item) => ({
    label: item.description,
    value: item.name,
  }));

  let authorities = _.map(data?.authorities, (item) => ({
    label: item.name,
    value: item.name,
  }));

  let departments = _.map(data?.departments, (item) => ({
    label: item.departmentName,
    value: item.id,
  }));

  let employeePositions = _.map(data?.positions, (item) => ({
    label: item.postdesc,
    value: item.postdesc,
  }));

  let subDepartments = _.map(data?.subDepartments, (item) => ({
    label: item.departmentName,
    value: item.id,
  }));

  if (loading) return <Skeleton loading={loading} active />;
  return (
    <>
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <Row gutter={24}>
          <Col md={16} sm={24} xs={24}>
            <HRPageHeader title={'Employee Information'} />

            <Row gutter={8}>
              <Col md={6}>
                <HRInput label={'Firstname'} name={'firstName'} rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label={'Middle name'} name={'middleName'} />
              </Col>
              <Col md={6}>
                <HRInput label={'Lastname'} name={'lastName'} rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label={'Suffix'} name={'nameSuffix'} />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={6}>
                <HRDatePicker label={'Date of birth'} name={'dob'} />
              </Col>
              <Col md={6}>
                <HRSelect
                  label={'Gender'}
                  name={'gender'}
                  options={[
                    { key: 'MALE', value: 'MALE' },
                    { key: 'FEMALE', value: 'FEMALE' },
                  ]}
                  rules={{ required: true }}
                />
              </Col>
              <Col md={6}>
                <HRSelect
                  label={'Position/Designation'}
                  allowClear
                  name={'positionType'}
                  options={employeePositions}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Col>
              <Col md={6}>
                <HRSelect
                  label={'Employment Status'}
                  allowClear
                  name={'employeeType'}
                  options={employeeStatus}
                />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={6}>
                <HRInput label={'Title'} name={'titleInitials'} />
              </Col>
              <Col md={6}>
                <HRInput label={'Email Address'} name={'emailAddress'} />
              </Col>
              <Col md={6}>
                <HRInput label={'Nationality'} name={'nationality'} />
              </Col>
              <Col md={6}>
                <HRSelect
                  label={'Civil/Marital Status'}
                  allowClear
                  name={'civilStatus'}
                  options={civilStatuses}
                />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Employee Address'} />

            <Row gutter={8} style={{ marginRight: 4 }}>
              <Col md={12}>
                <HRInput label={'Street Address'} name={'address'} rules={{ required: true }} />
              </Col>
              <Col md={12}>
                <HRInput label={'Street Address Line 2'} name={'address2'} />
              </Col>
            </Row>

            <Row gutter={8} style={{ marginRight: 4 }}>
              <Col md={6}>
                <HRInput
                  label={'City / Municipality'}
                  name={'cityMunicipality'}
                  rules={{ required: true }}
                />
              </Col>
              <Col md={6}>
                <HRInput
                  label={'State / Province'}
                  name={'stateProvince'}
                  rules={{ required: true }}
                />
              </Col>
              <Col md={6}>
                <HRInput label={'Postal / Zip code'} name={'zipCode'} rules={{ required: true }} />
              </Col>
              <Col md={6}>
                <HRInput label={'Country'} name={'country'} rules={{ required: true }} />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={12}>
                <HRDivider />
                <HRPageHeader title={'Employee Contact'} />

                <Row gutter={8}>
                  <Col md={12}>
                    <HRInput label={'Phone number'} name={'employeeCelNo'} />
                  </Col>
                  <Col md={12}>
                    <HRInput label={'Telephone number'} name={'employeeTelNo'} />
                  </Col>
                </Row>
              </Col>
              <Col md={12}>
                <HRDivider />
                <HRPageHeader title={'Employee Departments'} />

                <Row gutter={8}>
                  <Col md={12}>
                    <HRSelect
                      label={'Department'}
                      name={'departmentId'}
                      options={departments}
                      rules={{ required: true }}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Col>
                  <Col md={12}>
                    <HRSelect
                      label={'Department Of Duty'}
                      name={'departmentOfDutyId'}
                      options={departments}
                      rules={{ required: true }}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Employee Details'} />

            <Row gutter={8}>
              <Col md={6}>
                <HRInput label={'PhilHealth #'} name={'philhealthNo'} />
              </Col>
              <Col md={6}>
                <HRInput label={'SSS #'} name={'sssNo'} />
              </Col>
              <Col md={6}>
                <HRInput label={'TIN #'} name={'tinNo'} />
              </Col>
              <Col md={6}>
                <HRInput label={'Pag-Ibig ID'} name={'pagIbigId'} />
              </Col>
            </Row>
            <Row gutter={8}>
              <Col md={6}>
                <HRInput label={'Blood Type'} name={'bloodType'} />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Incase of Emergency'} />
            <Row gutter={8}>
              <Col md={8}>
                <HRInput label={'Name'} name={'emergencyContactName'} />
              </Col>
              <Col md={8}>
                <HRInput label={'Address'} name={'emergencyContactAddress'} />
              </Col>
              <Col md={8}>
                <HRInput label={'Contact'} name={'emergencyContactNo'} />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Salary Rate'} />

            <Row gutter={8}>
              <Col md={8}>
                <HRInputNumber label={'Basic Salary'} name={'basicSalary'} />
              </Col>
              <Col md={8}>
                <HRSelect
                  label={'Payroll-Type'}
                  name={'scheduleType'}
                  placeholder={'Payroll-Type'}
                  showSearch
                  allowClear
                  options={payrollTypes}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label={'Pay-frequency'}
                  name={'payFreq'}
                  placeHolder={'Pay-frequency'}
                  allowClear
                  options={frequency}
                />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Bank Account Information'} />

            <Row gutter={8}>
              <Col md={12}>
                <HRInput label={'Account Name'} name={'bankAccountName'} />
              </Col>
              <Col md={12}>
                <HRInput label={'Account #'} name={'bankAccountNo'} />
              </Col>
            </Row>

            <HRButton
              allowedPermissions={['edit_employee', 'manage_employee']}
              type="primary"
              style={{ width: '100%' }}
              icon={<CheckOutlined />}
              loading={loadingSaveUser}
              htmlType="submit"
            >
              Save Employee Information
            </HRButton>

            <HRDivider />
            <HRPageHeader title={'Physician License Details'} />

            <Row gutter={8}>
              <Col md={8}>
                <HRInput label={'PRC License Type'} name={'prcLicenseType'} />
              </Col>
              <Col md={8}>
                <HRInput label={'PRC License Number'} name={'prcLicenseNo'} />
              </Col>
              <Col md={8}>
                <HRDatePicker label={'PRC Expiry Date'} name={'prcExpiryDate'} />
              </Col>
            </Row>

            <Row gutter={8}>
              <Col md={8}>
                <HRInput label={'PTR No.'} name={'ptrNo'} />
              </Col>
              <Col md={8}>
                <HRInput label={'S2 No.'} name={'s2No'} />
              </Col>
              <Col md={8}>
                <HRInput label={'PMMC No.'} name={'pmmcNo'} />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Tax Rates'} />
            <Row gutter={8}>
              <Col md={6}>
                <HRSelect
                  label={'VAT / Non-VAT'}
                  allowClear
                  name={'vatable'}
                  options={[
                    { label: 'VAT', value: true },
                    { label: 'Non-VAT', value: false },
                  ]}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name={'witholdTaxRate'}
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      label={'Witholding Tax'}
                      {...inputProps}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name={'pfVatRate'}
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label={'PF VAT Rate'}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={6}>
                <Controller
                  control={methods.control}
                  name={'expandedVatRate'}
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label={'Expanded VAT Rate'}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={6}></Col>
              <Col md={6}></Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Physician (PHIC Details)'} />

            <Row gutter={8}>
              <Col md={8}>
                <HRSelect
                  label={'PHIC Group'}
                  allowClear
                  name={'phicGroup'}
                  options={_.map(data?.phicGroup, (phicgroup, x) => ({
                    key: phicgroup.phicGroupName,
                    value: phicgroup.id,
                  }))}
                />
              </Col>
              <Col md={8}>
                <Controller
                  control={methods.control}
                  name={'phicNo'}
                  render={(inputProps) => (
                    <HRInputNumberNiAyingzkie
                      {...inputProps}
                      label={'PHIC Number'}
                      onChange={(e) => inputProps.onChange(e)}
                    />
                  )}
                />
              </Col>
              <Col md={8}>
                <HRDatePicker label={'PHIC Expiry Data'} name={'phicExpiryDate'} />
              </Col>
            </Row>

            <HRDivider />
            <HRPageHeader title={'Physician Specialization'} />

            <Row gutter={8}>
              <Col md={8}>
                <HRSelect
                  label={'Service Type'}
                  allowClear
                  name={'serviceType'}
                  options={_.map(DoctorServiceType, (svType, x) => ({
                    key: svType,
                    value: svType,
                  }))}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label={'Specialization'}
                  allowClear
                  name={'specialization'}
                  options={_.map(data?.specialties || [], (item) => ({
                    key: item?.name,
                    value: item?.name,
                  }))}
                />
              </Col>
              <Col md={8}>
                <HRSelect
                  label={'Service Class'}
                  allowClear
                  name={'serviceClass'}
                  options={_.map(DoctorServiceClass || [], (svType, x) => ({
                    key: svType,
                    value: svType,
                  }))}
                />
              </Col>
            </Row>

            <HRButton
              allowedPermissions={['edit_employee', 'manage_employee']}
              type="primary"
              style={{ width: '100%', marginBottom: 20 }}
              icon={<CheckOutlined />}
              loading={loadingSaveUser}
              htmlType="submit"
            >
              Save Physician Information
            </HRButton>
          </Col>

          <Col md={8}>
            <Row>
              <Col md={24}>
                {employeeId && (
                  <>
                    <HRPageHeader title={'User Info'} />
                    <HRInput
                      label={'Username'}
                      name={'login'}
                      disabled={!!_.get(data, 'employee.user.login', false)}
                      rules={{
                        required: true,
                        validate: async (value) => {
                          try {
                            if (!data?.employee?.user?.login) {
                              client
                                .query({
                                  query: gql`
                                          {
                                            isLoginUnique(login: "${value}")
                                          }
                                          `,
                                  fetchPolicy: 'network-only',
                                })
                                .then((response) => {
                                  const data = response?.data || {};
                                  if (!data?.isLoginUnique)
                                    methods.setError('login', {
                                      message: '(Username is already taken!)',
                                    });
                                });
                            }
                          } catch (err) {
                            console.log(err);
                          }
                        },
                      }}
                    />

                    <HRInput
                      label={'Password'}
                      name={'password'}
                      type={'password'}
                      autoComplete={'new-password'}
                      disabled={!!_.get(data, 'employee.user.password', false)}
                      rules={{ required: true }}
                      allowClear
                    />

                    {!_.get(data, 'employee.user.password') ? (
                      <HRInput
                        label={'Confirm Password'}
                        name={'confirmPassword'}
                        type={'password'}
                        autoComplete={'new-password'}
                        disabled={!!_.get(data, 'employee.user.password', false)}
                        rules={{
                          required: true,
                          validate: (value) =>
                            methods.getValues('password') == value || '(Password does not match)',
                        }}
                        allowClear
                      />
                    ) : null}

                    <HRSelect
                      label={'Roles'}
                      name={'authorities'}
                      mode="multiple"
                      onDeselect={onDeselectAuthority}
                      options={authorities}
                    />

                    <HRSelect
                      label={'Group Policy'}
                      name={'groupPolicy'}
                      onChange={onChangeGroupPolicy}
                      options={groupPolicies}
                    />

                    <HRSelect
                      label={'Permissions'}
                      name={'permissions'}
                      mode="multiple"
                      onDeselect={onDeselectPermission}
                      options={permissions}
                    />

                    <HRButton
                      allowedPermissions={['edit_employee', 'manage_employee']}
                      type="primary"
                      style={{ width: '100%' }}
                      icon={<CheckOutlined />}
                      loading={loadingSaveUser}
                      htmlType="submit"
                    >
                      Save Credentials
                    </HRButton>

                    {_.get(data, 'employee.user.login') ? (
                      <HRButton
                        allowedPermissions={['edit_employee']}
                        type="danger"
                        style={{ width: '100%', marginTop: 5 }}
                        loading={changePasswordLoading}
                        icon={<LockOutlined />}
                        onClick={() => {
                          changePassword(_.get(data, 'employee.user.login'));
                        }}
                      >
                        Reset Password
                      </HRButton>
                    ) : null}
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col md={24}>
                <HRDivider />
                <HRPageHeader title="Signatures">
                  <Controller
                    control={methods.control}
                    name="signature1"
                    render={(inputProps, { invalid, isTouched, isDirty }) => (
                      <HRSignaturerField
                        label="Signature 1"
                        {...inputProps}
                        onChange={(e) => inputProps.onChange(e)}
                      />
                    )}
                  />
                  <HRDivider />
                  <Controller
                    control={methods.control}
                    name="signature2"
                    render={(inputProps, { invalid, isTouched, isDirty }) => (
                      <HRSignaturerField
                        label="Signature 2"
                        {...inputProps}
                        onChange={(e) => inputProps.onChange(e)}
                      />
                    )}
                  />
                  <HRDivider />
                  <Controller
                    control={methods.control}
                    name="signature3"
                    render={(inputProps, { invalid, isTouched, isDirty }) => (
                      <HRSignaturerField
                        label="Signature 3"
                        {...inputProps}
                        onChange={(e) => inputProps.onChange(e)}
                      />
                    )}
                  />
                  <HRButton
                    allowedPermissions={['edit_employee', 'manage_employee']}
                    type="primary"
                    style={{ width: '100%', margin: '10px 0' }}
                    icon={<CheckOutlined />}
                    loading={loadingSaveUser}
                    htmlType="submit"
                  >
                    Save Signature/s
                  </HRButton>
                </HRPageHeader>
              </Col>
            </Row>
          </Col>
        </Row>
      </HRForm>
    </>
  );
};

export default EmployeeForm;
