<template>
  <div>
    <typeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName }}<i @click="deleteCategory">×</i>
            </li>
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="deleteKeyword">×</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="deleteTrade">×</i>
            </li>
            <li
              class="with-x"
              v-for="(p, index) in searchParams.props"
              :key="index"
            >
              {{ p.split(":")[1] }}<i @click="deleteAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @tradeAdd="tradeAdd" @attrAdd="attrAdd" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>
                    综合
                    <span class="order-icon" v-show="isOne">
                      <i
                        class="iconfont"
                        :class="{
                          'icon-xiangshang': isAsc,
                          'icon-paixu': isDesc,
                        }"
                      />
                    </span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>
                    价格
                    <span class="order-icon" v-show="isTwo">
                      <i
                        class="iconfont"
                        :class="{
                          'icon-xiangshang': isAsc,
                          'icon-paixu': isDesc,
                        }"
                      />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="g in goodsList" :key="g.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${g.id}`">
                      <img :src="g.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ g.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ g.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="totalItem"
            :continues="5"
            @getPageNo="getPageNo"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  computed,
  onBeforeMount,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";

export default {
  name: "Search",
  components: { SearchSelector },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    // 需要多次请求数据，所以封装为函数
    function getData() {
      store.dispatch("search/getSearchLists", searchParams);
    }
    // 服务器要求的请求参数
    let searchParams = reactive({
      category1Id: "",
      category2Id: "",
      category3Id: "",
      categoryName: "",
      keyword: "",
      order: "1:desc", // 初始值为‘综合降序’
      pageNo: 1,
      pageSize: 10,
      props: [],
      trademark: "",
    });
    // 在mounted前将参数准备完毕
    onBeforeMount(() => {
      searchParams = Object.assign(searchParams, route.query, route.params);
    });
    onMounted(() => {
      getData();
    });
    let goodsList = computed(() => store.getters["search/goodsList"]);
    // 当路由变化时，重新向服务器请求数据
    watch(route, () => {
      // 由于id三选一，所以先清空所有id
      searchParams.category1Id = undefined;
      searchParams.category2Id = undefined;
      searchParams.category3Id = undefined;
      searchParams = Object.assign(searchParams, route.query, route.params);
      getData();
    });
    // 删除类名面包屑
    function deleteCategory() {
      // 不能直接改route的属性
      // 以下属性都是可选项，设为undefined不会发送服务器
      searchParams.categoryName = undefined;
      searchParams.category1Id = undefined;
      searchParams.category2Id = undefined;
      searchParams.category3Id = undefined;
      getData();
      // 通过路由跳转，修改请求路径，注意保留查询参数params
      router.push({ name: "Search", params: route.params });
    }
    // 在setup函数中获取实例对象并定义bus
    const instance = getCurrentInstance();
    const bus = instance.appContext.config.globalProperties.$bus;
    // 删除查询参数面包屑
    function deleteKeyword() {
      searchParams.keyword = undefined;
      getData();
      // 清除搜索栏内容
      bus.emit("clear");
      router.push({ name: "Search", query: route.query });
    }
    // 点击增加/删除品牌名面包屑
    function tradeAdd(trade) {
      searchParams.trademark = `${trade.tmId}:${trade.tmName}`;
      getData();
    }
    function deleteTrade() {
      searchParams.trademark = undefined;
      getData();
    }
    // 点击增加属性名面包屑
    function attrAdd(attr, attrValue) {
      let newAttr = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 防止重复添加
      if (searchParams.props.indexOf(newAttr) === -1) {
        searchParams.props.push(newAttr);
        getData();
      } else {
        alert("该属性已添加");
      }
    }
    function deleteAttr(index) {
      searchParams.props.splice(index, 1);
      getData();
    }
    // 切换排序
    let isOne = computed(() => searchParams.order.indexOf("1") != -1);
    let isTwo = computed(() => searchParams.order.indexOf("2") != -1);
    let isDesc = computed(() => searchParams.order.indexOf("desc") != -1);
    let isAsc = computed(() => searchParams.order.indexOf("asc") != -1);
    function changeOrder(num) {
      let originNum = searchParams.order.split(":")[0];
      let originOrder = searchParams.order.split(":")[1];
      // 排序标准不变，切换降序/升序
      if (originNum == num) {
        searchParams.order = `${originNum}:${
          originOrder == "desc" ? "asc" : "desc"
        }`;
      } else {
        searchParams.order = `${num}:desc`;
      }
      getData();
    }
    // 分页器相关
    let totalItem = computed(() => store.state.search.searchList.total);
    function getPageNo(page) {
      searchParams.pageNo = page;
      getData();
    }
    return {
      goodsList,
      searchParams,
      deleteCategory,
      deleteKeyword,
      tradeAdd,
      deleteTrade,
      attrAdd,
      deleteAttr,
      isOne,
      isTwo,
      isDesc,
      isAsc,
      changeOrder,
      totalItem,
      getPageNo,
    };
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;

                .order-icon {
                  .iconfont {
                    font-size: 10px;
                  }
                }
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: 0px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>