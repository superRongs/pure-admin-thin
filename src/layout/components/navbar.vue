<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import Notice from "./notice/index.vue";
import avatars from "/@/assets/avatars.jpg";
import { transformI18n } from "/@/plugins/i18n";
import Hamburger from "./sidebar/hamBurger.vue";
import { useRouter, useRoute } from "vue-router";
import { storageSession } from "/@/utils/storage";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import { useAppStoreHook } from "/@/store/modules/app";
import { unref, watch, getCurrentInstance } from "vue";
import { deviceDetection } from "/@/utils/deviceDetection";
import screenfull from "../components/screenfull/index.vue";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import globalization from "/@/assets/svg/globalization.svg?component";

const instance =
  getCurrentInstance().appContext.config.globalProperties.$storage;
const pureApp = useAppStoreHook();
const router = useRouter();
const route = useRoute();
let usename = storageSession.getItem("info")?.username;
const { locale } = useI18n();

const getDropdownItemStyle = computed(() => {
  return t => {
    return {
      background: locale.value === t ? useEpThemeStoreHook().epThemeColor : "",
      color: locale.value === t ? "#f4f4f5" : "#000"
    };
  };
});

watch(
  () => locale.value,
  () => {
    //@ts-ignore
    document.title = transformI18n(
      //@ts-ignore
      unref(route.meta.title),
      unref(route.meta.i18n)
    ); // 动态title
  }
);

// 退出登录
const logout = (): void => {
  storageSession.removeItem("info");
  router.push("/login");
};

function onPanel() {
  emitter.emit("openPanel");
}

function toggleSideBar() {
  pureApp.toggleSideBar();
}

// 简体中文
function translationCh() {
  instance.locale = { locale: "zh" };
  locale.value = "zh";
}

// English
function translationEn() {
  instance.locale = { locale: "en" };
  locale.value = "en";
}
</script>

<template>
  <div class="navbar">
    <Hamburger
      :is-active="pureApp.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb class="breadcrumb-container" />

    <div class="vertical-header-right">
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 全屏 -->
      <screenfull id="header-screenfull" v-show="!deviceDetection()" />
      <!-- 国际化 -->
      <el-dropdown id="header-translation" trigger="click">
        <globalization />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle('zh')"
              @click="translationCh"
              ><IconifyIconOffline
                class="check-zh"
                v-show="locale === 'zh'"
                icon="check"
              />简体中文</el-dropdown-item
            >
            <el-dropdown-item
              :style="getDropdownItemStyle('en')"
              @click="translationEn"
              ><el-icon class="check-en" v-show="locale === 'en'"
                ><IconifyIconOffline icon="check" /></el-icon
              >English</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登陆 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="avatars" />
          <p>{{ usename }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                icon="logout-circle-r-line"
                style="margin: 5px"
              />{{ $t("buttons.hsLoginOut") }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon
        class="el-icon-setting"
        :title="$t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline icon="setting" />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    :deep(.dropdown-badge) {
      &:hover {
        background: #f6f6f6;
      }
    }

    .screen-full {
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .globalization {
      height: 48px;
      width: 40px;
      padding: 11px;
      cursor: pointer;

      &:hover {
        background: #f6f6f6;
      }
    }

    .el-dropdown-link {
      width: 100px;
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      &:hover {
        background: #f6f6f6;
      }

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }

    .el-icon-setting {
      height: 48px;
      width: 38px;
      padding: 12px;
      display: flex;
      cursor: pointer;
      align-items: center;

      &:hover {
        background: #f6f6f6;
      }
    }
  }

  .breadcrumb-container {
    float: left;
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
