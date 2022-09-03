<template>
  <div class="index">
    <add-modal
      ref="addModal"
      :chooseType="chooseType"
      v-show="isShowModal"
      @add_item="add_item"
      @edit_item="edit_item"
    ></add-modal>
    <div class="center_box">
      <!-- 顶部导航 -->
      <div class="top_box">
        <!-- 左边元素 -->
        <div class="left_box">
          <button class="add_btn" @click="show_modal">新建</button>
          <input class="search" v-model="keywords" type="text" placeholder="请输入需要搜索的名字关键字" />
          <button class="search_btn" @click="search">搜索</button>
        </div>
        <!-- 右边元素 - 撤回按钮 -->
        <button class="recall" @click="recall">撤回</button>
      </div>

      <!-- 显示表格 -->
      <el-table :data="searchResult" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column fixed prop="name" label="名字" width="200"> </el-table-column>
        <el-table-column prop="age" label="年龄" width="200"> </el-table-column>
        <el-table-column prop="gender" label="性别" width="200"> </el-table-column>
        <el-table-column prop="contact" label="联系电话" width="200"> </el-table-column>
        <el-table-column prop="address" label="详细地址" width="560"> </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 批量删除 -->
      <button class="del_choosen" @click="del_choosen">批量删除</button>
    </div>
  </div>
</template>

<script>
import addModal from '@/components/addModal/addModal.vue'

export default {
  name: 'index',
  components: {
    addModal
  },
  data() {
    return {
      isShowModal: false,
      chooseType: null,
      // 全部数据
      tableData: [],
      // 当前选择的选项
      dataonLineListSelections: [],
      // 搜索关键字
      keywords: '',
      // 搜索结果
      searchResult: [],
      // 模拟出入栈操作
      dataStack: []
    }
  },
  methods: {
    // 条件查询
    search() {
      const res = this.tableData.filter((item) => {
        if (item.name.includes(this.keywords)) {
          return item
        }
      })
      this.searchResult = res
    },
    // 撤回功能
    recall() {
      this.$alert(
        '该功能只能撤回修改功能，以及删除的数据不可找回（一次最多撤回5次）是否确定撤回？',
        '提示',
        {
          confirmButtonText: '确定',
          callback: (res) => {
            if (res == 'confirm') {
              if (this.dataStack.length <= 1) {
                this.alertInfo()
              } else {
                // 出栈
                this.dataStack.pop()
                this.searchResult = JSON.parse(this.dataStack[this.dataStack.length - 1])
                this.tableData = JSON.parse(this.dataStack[this.dataStack.length - 1])
                const data = JSON.stringify(this.tableData)
                localStorage.setItem('tableData', data)
              }
            }
          }
        }
      )
    },
    // 撤回提示
    alertInfo() {
      this.$alert('没有可撤回的步骤', '提示', { confirmButtonText: '确定' })
    },
    // 新建数据
    show_modal() {
      this.chooseType = '新建'
      this.isShowModal = !this.isShowModal
    },
    // 添加数据
    add_item(newMessage) {
      this.tableData.push(newMessage)
      this.searchResult = this.tableData
    },
    // 点击取消按钮，取消更改数据
    edit_item(oldMessage) {
      location.reload()
      console.log(oldMessage)
      const index = this.tableData.indexOf(oldMessage)
      console.log(index)
      this.tableData[index] = oldMessage
      this.searchResult = this.tableData
    },
    // 单项删除
    handleDelete(index) {
      this.$alert('你确定要删除这一项数据吗？(不可找回)', '提示', {
        confirmButtonText: '确定',
        callback: (res) => {
          if (res == 'confirm') {
            this.tableData.splice(index, 1)
            const data = JSON.stringify(this.tableData)
            localStorage.setItem('tableData', data)
          }
        }
      })
    },
    // 重新编辑
    editRow(row) {
      this.chooseType = '编辑'
      this.isShowModal = !this.isShowModal
      this.$refs.addModal.get_data(row)
      // this.$refs.addModal.newMessage = row
      // this.$refs.addModal.oldMessage = row
    },
    handleSelectionChange(val) {
      this.dataonLineListSelections = val
    },
    // 批量删除按钮
    del_choosen() {
      console.log('批量删除')
      this.$alert('你确定要批量永久删除数据吗？（不可找回）', '提示', {
        confirmButtonText: '确定',
        callback: (res) => {
          if (res == 'confirm') {
            this.del_them(this.dataonLineListSelections)
          }
        }
      })
    },
    // 批量删除方法
    del_them(selections) {
      const list = this.tableData
      const newList = []
      const str = JSON.stringify(selections)
      console.log(str)
      for (let i = 0; i < list.length; i++) {
        const res = str.includes(list[i].id)
        if (res == false) {
          newList.push(list[i])
        }
      }

      setTimeout(() => {
        this.tableData = newList
        this.searchResult = newList
        const data = JSON.stringify(this.tableData)
        localStorage.setItem('tableData', data)
      }, 500)
    }
  },
  mounted() {
    const data = localStorage.getItem('tableData')
    if (data == null) {
      this.tableData = [
        {
          id: '01bgfbarDFBDFvnndn',
          name: '小明',
          age: '18',
          gender: '男',
          contact: '12345678912',
          address: '广东省广州市番禺区XX镇XX小区XX栋200号',
          addressHead: ['广东省', '广州市', '番禺区'],
          addressTail: 'XX镇XX小区XX栋200号'
        },
        {
          id: '02enteravdbdbdbdfvsvergeg',
          name: '小明',
          age: '18',
          gender: '男',
          contact: '12345678912',
          address: '广东省广州市越秀区XX镇XX小区XX栋201号',
          addressHead: ['广东省', '广州市', '越秀区'],
          addressTail: 'XX镇XX小区XX栋201号'
        },
        {
          id: '03ebetadzbdzbdbbaevwv',
          name: '小明',
          age: '18',
          gender: '男',
          contact: '12345678912',
          address: '广东省广州市花都区XX镇XX小区XX栋202号',
          addressHead: ['广东省', '广州市', '花都区'],
          addressTail: 'XX镇XX小区XX栋202号'
        },
        {
          id: '04veabeatdsvbdfbjheaahev',
          name: '小明',
          age: '18',
          gender: '男',
          contact: '12345678912',
          address: '广东省广州市海珠区XX镇XX小区XX栋203号',
          addressHead: ['广东省', '广州市', '海珠区'],
          addressTail: 'XX镇XX小区XX栋203号'
        },
        {
          id: '05tjDvdfvsdngfmnhwerjykrtnrbeabv',
          name: '小明',
          age: '18',
          gender: '男',
          contact: '12345678912',
          address: '广东省广州市天河区XX镇XX小区XX栋204号',
          addressHead: ['广东省', '广州市', '天河区'],
          addressTail: 'XX镇XX小区XX栋204号'
        }
      ]
      this.searchResult = this.tableData
      // 初始化栈
      this.dataStack.push(JSON.stringify(this.tableData))
    } else {
      this.tableData = JSON.parse(data)
      this.searchResult = this.tableData
      // 初始化栈
      this.dataStack.push(JSON.stringify(this.tableData))
    }
  },
  watch: {
    dataStack: {
      handler(newVal) {
        if (newVal.lenght >= 10) {
          newVal.splice(9)
          this.dataStack = newVal
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
button {
  cursor: pointer;
}
.index {
  position: relative;
  display: flex;
  justify-content: center;
  height: 89.3vh;

  .center_box {
    // background-color: antiquewhite;
    margin-top: 50px;
    width: 80%;

    // 顶部导航
    .top_box {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 10px 0;

      .left_box {
        display: flex;
      }
      .add_btn,
      .recall,
      .search_btn {
        border: none;
        border-radius: 3px;
        background-color: #e9effd;
        color: #016fff;
        width: 60px;
        height: 30px;
      }

      .search {
        width: 300px;
        height: 25px;
        outline: none;
        margin: 0 20px;
        // border: 1px solid #ebeef5;
        border: 1px solid rgb(183, 183, 183);
        border-radius: 5px;
      }
    }

    .el-table {
      width: 100%;
      font-size: 1rem;

      ::v-deep .el-table thead {
        background-color: #fafafa;
      }

      ::v-deep .el-table__cell {
        text-align: center;
        color: black;
      }
    }

    // 批量删除按钮
    .del_choosen {
      margin-top: 10px;
      border: none;
      border-radius: 3px;
      background-color: #e9effd;
      color: #016fff;
      width: 100px;
      height: 30px;
    }
  }
}
</style>
