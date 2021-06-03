import MainLayout from '../components/mainlayout';
import React from 'react';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { post } from '../shared/global';

const UPSERT_RECORD = gql`
  mutation ChangePassword($username: String, $newPassword: String) {
    resetPassword(username: $username, newPassword: $newPassword) {
      id
    }
  }
`;

export default function ResetPassword({ account }) {
  //const showAlert = alertMessage();

  const [resetPassword, { loading: resultLoading }] = useMutation(UPSERT_RECORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      post('/api/logout')
        .then((response) => {})
        .catch((error) => {})
        .finally(() => {});
    },
  });

  const onSubmit = (formData) => {
    // if (formData.newPassword !== formData.confirmationPassword) {
    //   showAlert('Error', 'Password and Confirmation Password did not match');
    //   return;
    // }

    resetPassword({
      variables: {
        username: account.user.login,
        newPassword: formData.newPassword,
      },
    });
  };

  return (
    <MainLayout account={account}>
      <div className={'forbiddencontainer'}>
        {/* <Row>
          <Col>
            <HRForm size="small" onSubmit={onSubmit}>
              <Form.Group widths="equal">
                <HRInput
                  name={'newPassword'}
                  type={'password'}
                  label={'New Password'}
                  rules={{
                    required: 'Enter Password',
                  }}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <HRInput
                  name={'confirmationPassword'}
                  type={'password'}
                  label={'Confirm Password'}
                  rules={{
                    required: 'Enter Password Confirmation',
                  }}
                />
              </Form.Group>
              <Button primary>Set New Password</Button>
            </HRForm>
          </Col>
        </Row> */}
      </div>

      <style jsx>{`
        .forbiddencontainer {
          margin-top: 10em;
        }
      `}</style>
    </MainLayout>
  );
}
