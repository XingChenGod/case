import {Injectable} from '@angular/core';
import {WeekDate} from '~/app/routes/no-car-info-center/scheduling-browse/week-date';
import {NoCarIstrativeApi} from '~/app/noCarApi/noCarIstrative';

@Injectable()

export class ApplyService {

  static whichWeek(day): string {
    let week = '';
    switch (day) {
      case 0:
        week = '周日';
        break;
      case 1:
        week = '周一';
        break;
      case 2:
        week = '周二';
        break;
      case 3:
        week = '周三';
        break;
      case 4:
        week = '周四';
        break;
      case 5:
        week = '周五';
        break;
      case 6:
        week = '周六';
        break;
    }
    return week;
  }
  constructor() {}

  // 处理日期对象yyyy-mm-dd
  public handleDate(date: Date): string {
    const year = date.getFullYear(),
      month = date.getMonth(),
      day = date.getDate();

    return `${year}-${month + 1}-${day}`;
  }

  // 处理日期对象{whichWeek: '', date: 'MM-DD'},参数星期天的日期
  public handleDateWeek(dateStart: Date): any {
    const data: WeekDate[] = [];
    // 当月天数
    const days = this.handleDateGetCurMouthDays(dateStart),
          mouth = dateStart.getMonth(),
          date = dateStart.getDate();
    for (let i = 0; i < 7; i ++) {
      if (date + i > days) {
        // 转到下一月
        const nextMouth = mouth + 1;
        if (nextMouth > 11) { // 下一月超过了当年12月
          const obj = {
            week: ApplyService.whichWeek(i),
            date: `${nextMouth - 11}-${i}`
          };
          data.push(obj);
        } else {
          // 月还在当前年
          const obj = {
            week: ApplyService.whichWeek(i),
            date: `${nextMouth + 1}-${i}`
          };
          data.push(obj);
        }
      } else {
        const obj = {
          week: ApplyService.whichWeek(i),
          date: `${mouth + 1}-${date + i}`
        };
        data.push(obj);
      }
    }
    return data;
  }

  // 处理日期对象获取周几，从0是周日到6是周六
  public handleDateGetWeek(date: Date): any {
    return date.getDay();
  }

  // 处理日期对象，获取当前月供多少天
  public handleDateGetCurMouthDays(date: Date): any {
    const currentMonth = date.getMonth(),
          nextMonth = currentMonth + 1;
    const nextMonthFirstDay: any = new Date(date.getFullYear(), nextMonth, 1);
    const oneDay = 1000 * 60 * 60 * 24,
          lastTime = new Date(nextMonthFirstDay - oneDay);
    return lastTime.getDate();
  }
}
