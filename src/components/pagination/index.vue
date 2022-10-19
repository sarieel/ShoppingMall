<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="getPageNo(pageNo - 1)">
      上一页
    </button>
    <button
      :class="{ active: pageNo == 1 }"
      v-if="startAndEnd.start > 1"
      @click="getPageNo(1)"
    >
      1
    </button>

    <button v-if="startAndEnd.start > 2">···</button>
    <button
      v-for="(page, index) in startAndEnd.end"
      :key="index"
      v-show="page >= startAndEnd.start"
      @click="getPageNo(page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>

    <button v-if="startAndEnd.end < totalPage - 1">···</button>
    <button
      v-if="startAndEnd.end < totalPage"
      @click="getPageNo(totalPage)"
      :class="{ active: pageNo == totalPage }"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="startAndEnd.end == totalPage"
      @click="getPageNo(pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
import { computed, ref } from "vue";
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  setup(props, context) {
    // 向上取整
    let totalPage = computed(() => Math.ceil(props.total / props.pageSize));
    let startAndEnd = computed(() => {
      if (props.continues > totalPage) {
        let start = 1;
        let end = props.continues;
        return { start, end };
      } else {
        let start = props.pageNo - parseInt(props.continues / 2);
        let end = props.pageNo + parseInt(props.continues / 2);
        if (start < 1) {
          start = 1;
          end = props.continues;
        } else if (end > totalPage) {
          alert(">total");
          end = totalPage;
          start = totalPage - props.continues + 1;
        }
        return { start, end };
      }
    });
    function getPageNo(page) {
      context.emit("getPageNo", page);
    }
    return {
      totalPage,
      startAndEnd,
      getPageNo,
    };
  },
};
</script>

<style lang='less' scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>