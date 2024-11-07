<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import dayjs from "dayjs";

// 随机生成签到日期（假数据）
const generateFakeData = (daysInYear: number, numSignins: number) => {
  const signins = new Set<number>(); // 使用 Set 确保日期唯一
  while (signins.size < numSignins) {
    const randomDay = Math.floor(Math.random() * daysInYear) + 1;
    signins.add(randomDay); // 随机生成签到天数
  }
  return Array.from(signins);
};

// 生成 365 天内随机的 50 个签到记录
const dataList = ref<number[]>([]);

// 图表数据（`computed` 改为在 `onMounted` 中初始化）
const year = new Date().getFullYear();
const optionsData = ref<any[]>([]);

// 在组件挂载后计算图表数据
onMounted(() => {
  dataList.value = generateFakeData(365, 50); // 生成假数据
  optionsData.value = dataList.value.map((dayOfYear) => {
    const dateStr = dayjs(`${year}-01-01`)
      .add(dayOfYear - 1, "day")
      .format("YYYY-MM-DD");
    return [dateStr, 1];
  });
});

// 图表配置
const option = computed(() => ({
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
    data: optionsData.value,
  },
}));
</script>

<template>
  <e-charts class="calendar" :option="option" />
  <h1 style="visibility: hidden">
    111111111111111111111111111111111111111111111111111111111
  </h1>
</template>

<style>
.calendar {
  height: 400px;
}
</style>
