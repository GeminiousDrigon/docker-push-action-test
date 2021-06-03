import React from 'react';
import { Button } from 'antd';
import AccessControl from '@components/accessControl/AccessControl';

export default function HRButton({ allowedPermissions, renderNoAccess, ...props }) {
  return (
    <AccessControl allowedPermissions={allowedPermissions} renderNoAccess={renderNoAccess}>
      <Button {...props}>{props?.children}</Button>
    </AccessControl>
  );
}
