import {Component, OnInit} from '@angular/core';
import {ApplyService} from '~/app/routes/no-car-info-center/services/apply-service';
import {WeekDate} from '~/app/routes/no-car-info-center/scheduling-browse/week-date';

@Component({
  selector: 'app-scheduling-browse',
  templateUrl: './scheduling-browse.component.html',
  styleUrls: ['./scheduling-browse.component.scss']
})

export class SchedulingBrowseComponent implements OnInit {
  // 当前日期, 保留的上一页日期周日的日期
  currentDate: Date;
  // 当前年
  currentYear: number;
  // 表头，周几和日期
  tHeads: WeekDate[] = [];
  // 表内部数据
  tbodyData: any[] = [];

  constructor(private applyService: ApplyService) { }

  ngOnInit(): void {
    this.getCurrentDate();
    this.tbodyData = [
      ['刘数', 0, 0, 1, 0, 1, 0, 0]
    ];
  }

  // 进入时获取时间
  getCurrentDate() {
          // 当前日期
    const currentDate = new Date(),
          // 当前是周几
          currentWeek = currentDate.getDay(),
          // 格式化日期
          formatCurrentDate = this.applyService.handleDate(currentDate);
    this.currentYear = currentDate.getFullYear();
    // 当前是几月,年份
    let currentMouth: number = currentDate.getMonth(), // (0 -- 11月)
        currentYear: number = currentDate.getFullYear();
    // 这是周天的日期x = currentWeek, 这是周六的日期y = 6 - currentWeek
    let currentSundayDate = currentDate.getDate() - currentWeek;
    // 当前月共多少天
    // const currentDays = this.applyService.handleDateGetCurMouthDays(currentDate);
    if (currentSundayDate <= 0) {
      // 跳转到上一月
      currentMouth --;
      if (currentMouth < 0) {
        // 跳转到上一年
        currentYear --;
        currentMouth = 11;
        const preYearDate = new Date(currentYear, currentMouth);
        const preYearDateMouthDays = this.applyService.handleDateGetCurMouthDays(preYearDate);
        currentSundayDate = preYearDateMouthDays - Math.abs(currentSundayDate);
      } else {
        // 还在当前年，到上一月
        const preMouthDate = new Date(currentYear, currentMouth);
        const preMouthDays = this.applyService.handleDateGetCurMouthDays(preMouthDate);
        currentSundayDate = preMouthDays - Math.abs(currentSundayDate);
      }
    }
    this.currentDate = new Date(currentYear, currentMouth, currentSundayDate);
    this.tHeads = this.applyService.handleDateWeek(this.currentDate);
  }

  // 点击左箭头
  preData() {
    let preSundayDate = this.currentDate.getDate() - 7,
        preMouth = this.currentDate.getMonth(), // (0 - 11)
        preYear = this.currentDate.getFullYear();
    if (preSundayDate <= 0) {
      // 跳转到上一月
      preMouth --;
      if (preMouth < 0) {
        // 跳转上一年
        preYear --;
        preMouth = 11;
        const preYearDate = new Date(preYear, preMouth);
        const preYearDateMouthDays = this.applyService.handleDateGetCurMouthDays(preYearDate);
        preSundayDate = preYearDateMouthDays - Math.abs(preSundayDate);
      } else {
        // 还在当年，到上一月
        const preYearDate = new Date(preYear, preMouth);
        const preYearDateMouthDays = this.applyService.handleDateGetCurMouthDays(preYearDate);
        preSundayDate = preYearDateMouthDays - Math.abs(preSundayDate);
      }
    }
    this.currentDate = new Date(preYear, preMouth, preSundayDate);
    this.tHeads = this.applyService.handleDateWeek(this.currentDate);
    this.currentYear = this.currentDate.getFullYear();
  }

  // 点击右箭头
  nextData() {
    let nextSundayDate = this.currentDate.getDate() + 7,
        nextMouth = this.currentDate.getMonth(), // (0 - 11)
        nextYear = this.currentDate.getFullYear();
    const nextMouthDays = this.applyService.handleDateGetCurMouthDays(this.currentDate);
    if (nextSundayDate > nextMouthDays) {
      // 跳转到下一月
      nextMouth ++;
      if (nextMouth > 11) { // 月份（0-11）
        // 跳转下一年
        nextYear ++;
        nextMouth = 0;
      }
      nextSundayDate = nextSundayDate - nextMouthDays;
    }
    this.currentDate = new Date(nextYear, nextMouth, nextSundayDate);
    this.tHeads = this.applyService.handleDateWeek(this.currentDate);
    this.currentYear = this.currentDate.getFullYear();
  }

  // 点击排班日历
  resetScheduling() {
    this.getCurrentDate();
  }
}
