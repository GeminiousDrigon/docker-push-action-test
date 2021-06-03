import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Card, Col, Row, Typography } from 'antd';

const NightShiftDifferential = ({ performance, ...props }) => {
  return (
    <Card
      title={<Typography.Title level={5}>Night Shift Differential</Typography.Title>}
      style={{ marginBottom: 20 }}
    >
      <Row>
        <Col xs={24} lg={24} xl={12}>
          <Typography.Title level={5}>Count</Typography.Title>
          <Row>
            <Col xs={24} lg={24} xl={12}>
              <Typography.Text strong style={{ marginRight: 10 }}>
                Work:
              </Typography.Text>
              <Typography.Text type={performance?.countWorkedNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countWorkedNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day:
              </Typography.Text>

              <Typography.Text type={performance?.countRestDayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day:
              </Typography.Text>

              <Typography.Text
                type={performance?.countSpecialHolidayAndRestDayNSD > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text
                type={performance?.countRegularHolidayAndRestDayNSD > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countDoubleHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.countDoubleHolidayAndRestDayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Work:
              </Typography.Text>
              <Typography.Text type={performance?.countWorkedOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countWorkedOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Double Holiday:
              </Typography.Text>

              <Typography.Text type={performance?.countDoubleHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayOICNSD}
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
              <Typography.Text type={performance?.hoursWorkedNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursWorkedNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRestDayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text
                type={performance?.hoursSpecialHolidayAndRestDayNSD > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text
                type={performance?.hoursRegularHolidayAndRestDayNSD > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHolidayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHolidayAndRestDayNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayAndRestDayNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Work:
              </Typography.Text>
              <Typography.Text type={performance?.hoursWorkedOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursWorkedOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayOICNSD}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                OIC Double Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHolidayOICNSD > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayOICNSD}
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

export default NightShiftDifferential;
