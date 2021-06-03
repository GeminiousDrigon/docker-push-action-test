import React from 'react';
import { PageHeader } from 'antd';
import ComingSoon from 'components/ComingSoon';
import Head from 'next/head';

function Dashboard() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageHeader title="Home Dashboard"></PageHeader>
      <ComingSoon title="Dashboard Feature Is Coming Soon!" />
    </div>
  );
}

export default Dashboard;
