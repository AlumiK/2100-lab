<template>
  <Basic :items="items">
    <div class="body">
      <div class="head-container">
        <div class="head-title">
          <h1>相关课程</h1>
        </div>
        <h6>第 {{ page }}/{{ num_pages }} 页，共 {{ rows }} 条数据</h6>
      </div>
      <Alert
        :count_down="wrong_count_down"
        :instruction="wrong"
        variant="danger"
        @decrease="wrong_count_down-1"
        @zero="wrong_count_down=0"/>
      <div class="table-div">
        <table class="table table-striped">
          <thead>
            <tr>
              <td
                v-for="title in titles"
                :key="title.id">
                {{ title.label }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in logs"
              :key="log.id">
              <td class="lg-td">{{ log.course_codename }}</td>
              <td class="lg-td">{{ log.course_title }}</td>
              <td class="s-td">{{ log.progress }}</td>
              <td class="s-td">{{ compute_date(log.latest_learn) }}</td>
              <td class="s-td">{{ compute_burnt(log.is_burnt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination
        :rows="rows"
        :perpage="per_page"
        @change="change_page"/>
    </div>
  </Basic>
</template>

<script>
import Pagination from '../../components/pagination'
import Basic from '../basic/basic'
import axios from 'axios'
import Alert from '../../components/alert'
export default {
  name: 'Course',
  components: { Alert, Basic, Pagination },
  /**
   * @returns {{
   * items: *[], 面包屑路由地址
   * titles: Array, 用户学习记录标题
   * logs: Array, 用户学习记录数据
   * rows: number, 数据总条数
   * page: number, 当前页数
   * per_page: number, 单页数据条数
   * num_pages: number, 数据总页数
   * dismiss_second: number,
   * wrong_count_down: number,
   * wrong: string
   * Alert组件所需参数
   * }}
   */
  data () {
    return {
      items: [
        {
          text: '主页',
          href: '/admin/main'
        },
        {
          text: '用户管理',
          href: '/admin/user'
        },
        {
          text: this.$route.query.user_id,
          href: '/admin/user/detail?user_id=' + this.$route.query.user_id
        },
        {
          text: '相关课程',
          active: true
        }
      ],
      titles: [
        { label: '课程代码' },
        { label: '课程名' },
        { label: '学习进度' },
        { label: '最近学习时间' },
        { label: '是否焚毁' }
      ],
      logs: [],
      rows: 10,
      page: 1,
      per_page: 15,
      num_pages: 0,
      wrong_count_down: 0,
      dismiss_second: 5,
      wrong: ''
    }
  },
  /**
   * 该函数初始化用户学习记录页面，
   * 向后端通过get方法发送当前页面用户ID，当前页数以及单页最大数据量的数据，
   * 获得后端返回的学习记录信息，记录总条数以及总页数，
   * 进行错误捕捉进行相应提示。
   */
  created () {
    const that = this
    axios
      .get(
        'http://localhost/api/v1/customers/backstage/customer-management/get-customer-learning-log-list/',
        {
          params: {
            customer_id: that.$route.query.user_id,
            page: that.page,
            page_limit: that.per_page
          }
        }
      )
      .then(function (response) {
        that.logs = response.data.content
        that.rows = response.data.count
        if (response.data.num_pages === 0) {
          that.num_pages = 1
        } else {
          that.num_pages = response.data.num_pages
        }
      })
      .catch(function (error) {
        if (error.response.data.message === 'Object not found.') {
          that.wrong = '该用户不存在，无法查找学习记录！'
          that.wrong_count_down = that.dismiss_second
        } else {
          that.wrong = '获取此用户的学习记录失败！'
          that.wrong_count_down = that.dismiss_second
        }
      })
  },
  methods: {
    /**
     * 该函数实现翻页，
     * 获取表示翻页后页数的参数，
     * 更改当前页数，并执行查询操作更新页面数据。
     * @param page
     */
    change_page: function (page) {
      this.page = page
      const that = this
      axios
        .get(
          'http://localhost/api/v1/customers/backstage/customer-management/get-customer-learning-log-list/',
          {
            params: {
              customer_id: that.$route.query.user_id,
              page: that.page,
              page_limit: that.per_page
            }
          }
        )
        .then(function (response) {
          that.logs = response.data.content
          that.rows = response.data.count
          if (response.data.num_pages === 0) {
            that.num_pages = 1
          } else {
            that.num_pages = response.data.num_pages
          }
        })
        .catch(function (error) {
          if (error.response.data.message === 'Object not found.') {
            that.wrong = '该用户不存在，无法查找学习记录！'
            that.wrong_count_down = that.dismiss_second
          } else {
            that.wrong = '获取此用户的学习记录失败！' + error
            that.wrong_count_down = that.dismiss_second
          }
        })
    },
    /**
     * 该函数接收一个表示日期的字符串参数，
     * 截取表示年月日的字符串，
     * 返回转换后的字符串。
     * @param val
     * @returns {*}
     */
    compute_date: function (val) {
      return val.slice(0, 10)
    },
    /**
     * 该函数接收Boolean类型的参数，
     * 返回表示课程是否被焚毁的字符串。
     * @param val
     * @returns {string}
     */
    compute_burnt: function (val) {
      if (val) {
        return '已焚毁'
      } else {
        return '未焚毁'
      }
    }
  }
}
</script>

<style scoped>
.body {
  padding: 20px;
  margin: 70px 20px 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

h1,
h6 {
  color: #23527c;
  text-align: left;
}

h6 {
  font-weight: bold;
}

.table-div {
  padding: 0 15px;
  margin-bottom: 25px;
  overflow-x: auto;
}

table {
  margin-bottom: 20px;
  border-top: 1px solid #d3d9df;
}

.table td {
  font-size: 1rem;
  vertical-align: middle;
}

.table thead tr {
  font-weight: bold;
  color: #999;
}

.s-td {
  width: 200px;
}

.lg-td {
  width: 250px;
}

.head-title {
  display: flex;
  margin: 25px 0;
}

.head-container {
  padding: 0 15px;
  margin-bottom: 15px;
  text-align: left;
}
</style>
