<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import dayjs from "dayjs";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

// 签到日期列表
const dataList = ref<number[]>([]);
// 当前年份
const year = new Date().getFullYear();

// 请求后端获取数据
const fetchDataList = async () => {
  try {
    const res = await UserControllerService.getUserSignInRecordUsingGet(year);
    dataList.value = res.data;
  } catch (e: any) {
    message.error("获取刷题签到记录失败，" + e.message);
  }
};

const itemCount = computed(() => dataList.value.length);

// 图表配置项
const options = ref({});

// 生成图表数据
const generateOptions = () => {
  const optionsData = dataList.value.map((dayOfYear) => {
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, "day")
      .format("YYYY-MM-DD");
    return [dateStr, 1];
  });

  options.value = {
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: ["#efefef", "lightgreen"],
      },
    },
    calendar: {
      range: year,
      left: 20,
      cellSize: ["auto", 16],
      yearLabel: {
        position: "top",
        formatter: `${year} 年刷题记录`,
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: optionsData,
    },
  };
};

// 组件挂载时获取数据并生成图表配置
onMounted(async () => {
  await fetchDataList();
  generateOptions();
});
</script>

<template>
  <e-charts class="calendar" :option="options" />
  <h1 style="text-align: center">
    您今年在本站累计刷题{{ itemCount }}天，继续加油吧！
  </h1>
  <h1 style="visibility: hidden">
    111111111111111111111111111111111111111111111111111111111
  </h1>
</template>

<style>
.calendar {
  height: 400px;
}
</style>
