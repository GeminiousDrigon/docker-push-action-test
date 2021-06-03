import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Card, Col, Row, Typography } from 'antd';

const OIC = ({ performance, ...props }) => {
  return (
    <Card title={<Typography.Title level={5}>OIC</Typography.Title>} style={{ marginBottom: 20 }}>
      <Row>
        <Col xs={24} lg={24} xl={12}>
          <Typography.Title level={5}>Count</Typography.Title>
          <Row>
            <Col xs={24} lg={24} xl={12}>
              <Typography.Text strong style={{ marginRight: 10 }}>
                Work:
              </Typography.Text>
              <Typography.Text type={performance?.countWorkedOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countWorkedOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countOICOvertime}
                />
              </Typography.Text>
              <br />

              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>

              <Typography.Text type={performance?.countDoubleHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday Overtime:
              </Typography.Text>

              <Typography.Text type={performance?.countDoubleHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={24} xl={12}>
          <Typography.Title level={5}>Hours</Typography.Title>
          <Row>
            <Col xs={24} lg={24} xl={12}>
              <Typography.Text strong style={{ marginRight: 10 }}>
                Work:
              </Typography.Text>
              <Typography.Text type={performance?.workedOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.workedOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularOICOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHolidayOIC > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayOIC}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday Overtime:
              </Typography.Text>

              <Typography.Text type={performance?.hoursDoubleHolidayOICOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayOICOvertime}
                />
              </Typography.Text>
              <br />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default OIC;
