<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        class="menu"
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item key="0" :style="{ padding: 0 }" disabled>
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" />
            <div class="title">AlgoArena</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col class="loginUser" flex="100px">
      <div v-if="store.state.user.loginUser.id">
        <div style="display: flex">
          <a-button type="text" @click="handleClick">改名</a-button>
          <a-modal
            v-model:visible="visible"
            title="更改用户名"
            @cancel="handleCancel"
            @before-ok="handleBeforeOk"
          >
            <a-form :model="form">
              <a-form-item field="userName" label="新名字">
                <a-input v-model="form.userName" />
              </a-form-item>
            </a-form>
          </a-modal>
          <a-dropdown>
            <a-button type="text"
              >{{ store.state.user.loginUser.userName ?? "无名" }}
            </a-button>
            <template #content>
              <a-doption @click="logout">登出</a-doption>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div v-else>
        <div style="display: flex">
          <a-button style="margin-right: 8px" type="primary" href="/user/login">
            登录
          </a-button>
          <a-button type="primary" href="/user/register">注册</a-button>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();
const visible = ref(false);
const form = ref({
  userName: "",
});
const handleClick = () => {
  visible.value = true;
};
const handleCancel = () => {
  visible.value = false;
};
const handleBeforeOk = async () => {
  const res = await UserControllerService.updateMyUserUsingPost(form.value);
  if (res.code === 0) {
    message.success("更新成功");
  } else {
    message.error("更新失败，" + res.message);
  }
  await store.dispatch("user/getLoginUser");
  visible.value = false;
};
// 需要展示在导航栏的路由
// 不写computed的话，只会在页面加载时执行一次，不会动态更新，写了computed就会动态更新
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

const logout = async () => {
  await store.dispatch("user/userLoginOut", {});
  message.success("登出成功");
  location.reload();
};
</script>

<style scoped>
#globalHeader {
  max-width: 1300px;
  flex-grow: 1;
  margin-left: auto;
  margin-right: auto;
}

.title-bar {
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.title {
  color: #444;
  margin-left: 8px;
}

.loginUser {
  margin-right: 50px;
}
</style>
