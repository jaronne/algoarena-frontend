<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="输入标签后请按回车"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #status="{ record }">
        <img
          v-if="record.status === 1"
          src="/yes.png"
          width="20px"
          title="已解答"
        />
        <img v-else src="/c.png" width="20px" title="未解答" />
      </template>
      <template #tags="{ record }">
        <a-tag v-for="(tag, index) of record.tagList" :key="index" color="gray"
          >{{ tag }}
        </a-tag>
      </template>
      <template #acceptedRate="{ record }">
        <a-progress
          :percent="
            record.submitNum
              ? +(record.acceptedNum / record.submitNum).toFixed(3)
              : 0
          "
          :style="{ width: '120%' }"
        />
      </template>
      <template #difficulty="{ record }">
        <a-tag
          :color="
            handleColor(getDifficulty(record.acceptedNum, record.submitNum))
          "
        >
          {{ getDifficulty(record.acceptedNum, record.submitNum) }}
        </a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-button type="primary" shape="circle" @click="toQuestionPage(record)">
          <icon-pen />
        </a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "题目",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "标签",
    slotName: "tags",
    align: "center",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    align: "center",
  },
  {
    title: "难度",
    slotName: "difficulty", // 添加难度列
    align: "center",
  },
  {
    title: "答题",
    slotName: "optional",
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const getDifficulty = (acceptedNum: number, submitNum: number) => {
  if (submitNum === 0) return "未知"; // 没有提交记录的情况
  const acceptanceRate = (acceptedNum / submitNum) * 100;

  if (acceptanceRate > 80) {
    return "简单";
  } else if (acceptanceRate > 50) {
    return "中等";
  } else {
    return "困难";
  }
};

/**
 * 处理不同难度标签对应不同的颜色
 * @param record
 */
const handleColor = (record: any): string => {
  if (record === "困难") {
    return "red";
  } else if (record === "中等") {
    return "orange";
  } else if (record === "简单") {
    return "green";
  } else {
    return "gray";
  }
};
</script>

<style scoped>
#questionsView {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
