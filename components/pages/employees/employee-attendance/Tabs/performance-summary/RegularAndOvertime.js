import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Card, Col, Row, Typography } from 'antd';

const RegularAndOvertime = ({ performance, ...props }) => {
  return (
    <Card
      title={<Typography.Title level={5}>Regular and Overtime</Typography.Title>}
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
              <Typography.Text type={performance?.countWorked > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countWorked}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day:
              </Typography.Text>

              <Typography.Text type={performance?.countRestDayWorked > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRestDayWorked}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countRestOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRestOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countSpecialHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day:
              </Typography.Text>

              <Typography.Text type={performance?.countSpecialHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.countSpecialHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countSpecialHolidayAndRestDayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.countRegularHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.countRegularHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countRegularHolidayAndRestDayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>

              <Typography.Text type={performance?.countDoubleHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday Overtime:
              </Typography.Text>

              <Typography.Text type={performance?.countDoubleHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.countDoubleHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.countDoubleHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.countDoubleHolidayAndRestDayOvertime}
                />
              </Typography.Text>
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
              <Typography.Text type={performance?.worked > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.worked}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Rest Day Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRestOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRestOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursSpecialHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Special Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.hoursSpecialHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursSpecialHolidayAndRestDayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday Overtime:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursRegularHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Regular Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.hoursRegularHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursRegularHolidayAndRestDayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHoliday > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHoliday}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday Overtime:
              </Typography.Text>

              <Typography.Text type={performance?.hoursDoubleHolidayOvertime > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayOvertime}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day:
              </Typography.Text>
              <Typography.Text type={performance?.hoursDoubleHolidayAndRestDay > 0 && 'success'}>
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayAndRestDay}
                />
              </Typography.Text>
              <br />
              <Typography.Text strong style={{ marginRight: 10 }}>
                Double Holiday and Rest Day Overtime:
              </Typography.Text>
              <Typography.Text
                type={performance?.hoursDoubleHolidayAndRestDayOvertime > 0 && 'success'}
              >
                <NumeralFormatter
                  withPesos={false}
                  format="0,0.[0000]"
                  value={performance?.hoursDoubleHolidayAndRestDayOvertime}
                />
              </Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default RegularAndOvertime;
