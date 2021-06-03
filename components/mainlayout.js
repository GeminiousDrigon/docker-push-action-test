import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
//import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import 'react-datepicker/dist/react-datepicker.css';
import { gql } from 'apollo-boost';
import _ from 'lodash';
import { Layout, Menu, Row, Col, message, Popover } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { post } from '../shared/global';
import { useRouter } from 'next/router';
import Transition from './transistions';
import ComponentTransition from './componentTransition';
import { AccountContext } from './accessControl/AccountContext';
import DefaultSider from 'components/commons/sider/DefaultSider';

// css
import styles from '@styles/header.module.css';

const { Header, Content } = Layout;

const GET_RECORDS = gql`
  query {
    notifications: myownnotifications {
      id
      title
      message
      from
      date_notified_string
      datenotified
    }
  }
`;

const initialState = {
  collapsed: false,
  display: 'block',
  displayLogo: 'none',
  showTitle: false,
  keys: [],
  key: -1,
};

const MainLayout = (props) => {
  const router = useRouter();
  const accountContext = useContext(AccountContext);
  const [state, setState] = useState(initialState);
  const [size, setSize] = useState([0, 0]);
  const [renderPages, setRenderPages] = useState([]);
  // const { loading, error, data, refetch, fetchMore, networkStatus } = useQuery(GET_RECORDS);

  // const loadNotifications = () => {
  //   refetch();
  // };

  const toggle = () => {
    setState({
      ...state,
      collapsed: !state.collapsed,
      display: 'block',
      displayLogo: 'none',
    });
  };

  const logout = () => {
    post('/api/logout')
      .then((resp) => {
        window.location = '/';
      })
      .catch((error) => {
        message.error(error);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={logout}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const toggleCollapsed = () => {
    setState({
      ...state,
      collapsed: !state.collapsed,
    });
  };

  const renderMenuItems = (page, idx) => {
    if (page.children) {
      return (
        <Menu.SubMenu title={page.title} icon={page.icon} key={page.url}>
          {page.children.map((item) => {
            return renderMenuItems(item, `${item.url}`);
          })}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={idx} icon={page.icon}>
        {page.title}
      </Menu.Item>
    );
  };

  return (
    <ComponentTransition>
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Sider theme="light" trigger={null} collapsible collapsed={state.collapsed} width={'300px'}> */}
        <DefaultSider state={state} toggleCollapsed={toggleCollapsed} setState={setState} />

        <Layout className="site-layout">
          <Header
            className={`site-layout-background ${styles['header-transition']}`}
            style={{
              padding: 0,
              position: 'fixed',
              right: 0,
              left: state.collapsed ? 80 : 250,
            }}
          >
            <Row justify="space-between">
              <Col md={12}></Col>
              <Col
                md={12}
                style={{
                  textAlign: 'right',
                  paddingRight: '20px',
                }}
              >
                <span>
                  <Popover
                    placement="bottomRight"
                    content={menu}
                    trigger="click"
                    title={<span>Actions</span>}
                  >
                    <MenuOutlined className="trigger" />
                  </Popover>
                </span>
              </Col>
            </Row>
          </Header>
          <Content
            className="site-layout-background content-transition"
            style={{
              margin: state.collapsed ? '88px 16px 24px 116px' : '88px 16px 24px 286px',
              padding: 24,
              // height: window.innerHeight - 112 + 'px',
              overflowX: 'hidden',
              overflowY: 'hidden',
            }}
          >
            <Transition location={router.pathname}>{props.children}</Transition>
          </Content>
        </Layout>
      </Layout>
      <style global jsx>
        {`
          .trigger {
            font-size: 18px;
            line-height: 64px;
            padding: 0 24px;
            cursor: pointer;
            transition: color 0.3s;
          }

          .trigger:hover {
            color: #1890ff;
          }

          .logo {
            height: 32px;
            margin: 16px;
          }

          .site-layout .site-layout-background {
            background: #fff;
          }

          .content-transition {
            transition: all 0.2s;
            transition-timing-function: ease;
          }

          .transition-in {
            transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
              width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        `}
      </style>
    </ComponentTransition>
  );
};

export default MainLayout;
