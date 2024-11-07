<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题目 id" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '240px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>python</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
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
      <template #questionTitle="{ record }">
        {{ record.question.title }}
      </template>
      <template #judgeInfo="{ record }">
        <span v-if="record.judgeInfo">
          <span v-if="record.judgeInfo.message">
            <a-tag color="gray">Message </a-tag>
            {{ translateInfo(record.judgeInfo.message) }}
          </span>
          <span v-if="record.judgeInfo.memory">
            <a-tag color="gray">Memory </a-tag>
            {{ record.judgeInfo.memory }} kb
          </span>
          <span v-if="record.judgeInfo.time">
            <a-tag color="gray">Time </a-tag>
            {{ record.judgeInfo.time }} ms
          </span>
        </span>
      </template>
      <template #status="{ record }">
        <div v-if="record.status === 1">
          <a-spin />
        </div>
        <div v-else>
          {{ translateStatus(record.status) }}
        </div>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #optional1="{ record }">
        <a-button
          type="primary"
          shape="circle"
          @click="toQuestionPage(record.question)"
        >
          <icon-pen />
        </a-button>
      </template>
      <template #optional2="{ record }">
        <a-button type="primary" shape="circle" @click="handleClick(record)">
          <icon-info-circle />
        </a-button>
        <a-modal
          v-model:visible="visible"
          @ok="handleOk"
          @cancel="handleCancel"
          width="auto"
        >
          <template #title>我的代码</template>
          <div
            style="height: 80vh; width: 100vh; line-height: 30px; padding: 5px"
          >
            <highlightjs :language="java" :code="code"></highlightjs>
          </div>
        </a-modal>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionSubmitControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import java from "highlight.js/lib/languages/java";

const tableRef = ref();
const visible = ref(false);
const dataList = ref([]);
const total = ref(0);
const code = ref("");

const handleClick = (record) => {
  code.value = record.code;
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await QuestionSubmitControllerService.listMyQuestionSubmitVoByPageUsingPost(
      {
        ...searchParams.value,
        sortField: "createTime",
        sortOrder: "descend",
      }
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
    title: "题目标题",
    dataIndex: "question.title",
    slot: "questionTitle",
    align: "center",
  },
  {
    title: "编程语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
    align: "center",
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    align: "center",
  },
  {
    title: "提交时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "题目详情",
    slotName: "optional1",
    align: "center",
  },
  {
    title: "我的代码",
    slotName: "optional2",
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

const translateInfo = (status) => {
  const statusMap = new Map([
    ["Accepted", "答案正确"],
    ["Wrong Answer", "答案错误"],
    ["Compile Error", "编译错误"],
    ["Memory Limit Exceeded", "内存溢出"],
    ["Time Limit Exceeded", "超时"],
    ["Presentation Error", "展示错误"],
    ["Waiting", "等待中"],
    ["Output Limit Exceeded", "输出溢出"],
    ["Dangerous Operation", "危险操作"],
    ["Runtime Error", "运行错误"],
    ["System Error", "系统错误"],
  ]);

  return statusMap.get(status) || "未知信息";
};

const translateStatus = (status) => {
  const statusMap = new Map([
    [0, "待判题"],
    [1, "判题中"],
    [2, "判题完成"],
    [3, "判题失败"],
  ]);

  return statusMap.get(status) || "未知状态";
};
</script>

<style scoped>
#questionSubmitView {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
</style>
