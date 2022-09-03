<template>
  <div class="addModal">
    <!-- 遮罩层 -->
    <div class="cover"></div>
    <!-- 新建/编辑用户 -->
    <div class="add_box">
      <!-- 标题 -->
      <div class="title">新建/编辑用户</div>
      <div class="form">
        <el-form :model="newMessage" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <!-- 姓名 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="newMessage.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <!-- 性别 -->
          <el-form-item label="性别" prop="gender">
            <el-select class="gender_input" v-model="newMessage.gender" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 年龄 -->
          <el-form-item label="年龄" prop="age">
            <el-input
              class="age_input"
              v-model="newMessage.age"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <!-- 联系电话 -->
          <el-form-item label="联系电话" prop="contact">
            <el-input
              class="contact_input"
              v-model="newMessage.contact"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <!-- 详细地址 -->
          <div class="address_input_box">
            <el-form-item label="详细地址" prop="addressHead">
              <el-cascader
                class="address_chooseInput"
                v-model="newMessage.addressHead"
                :options="addressOptions"
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="addressTail">
              <el-input
                class="address_input"
                v-model="newMessage.addressTail"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <!-- 按钮 -->
          <el-form-item class="btn_group">
            <el-button class="cancel" type="primary" @click="cancel">取消</el-button>
            <el-button class="confirm" type="primary" @click="submitForm('ruleForm')"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addModal',
  props: {
    chooseType: String
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'change' },
          { min: 1, max: 3, message: '请输入合法的年龄', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的联系方式', trigger: 'change' }
        ],
        addressHead: [{ required: true, message: '请选择', trigger: 'change' }],
        addressTail: [{ required: true, message: '请输入详情地址', trigger: 'blur' }]
      },
      newMessage: {},
      // newMessage: {
      //   id: '',
      //   name: '',
      //   gender: '',
      //   age: '',
      //   contact: '',
      //   address: '',
      //   addressHead: '',
      //   addressTail: ''
      // },
      oldMessage: {},
      options: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      addressOptions: [
        {
          value: '广东省',
          label: '广东省',
          children: [
            {
              value: '广州市',
              label: '广州市',
              children: [
                {
                  value: '番禺区',
                  label: '番禺区'
                },
                {
                  value: '越秀区',
                  label: '越秀区'
                },
                {
                  value: '花都区',
                  label: '花都区'
                },
                {
                  value: '海珠区',
                  label: '海珠区'
                },
                {
                  value: '天河区',
                  label: '天河区'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 生成唯一字符
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    // 清空数据表
    reset() {
      this.newMessage = {
        id: '',
        name: '',
        gender: '',
        age: '',
        contact: '',
        address: '',
        addressHead: '',
        addressTail: ''
      }
    },
    // 确定按钮
    submit() {
      // 合并地址
      const addressHead_joined = this.newMessage.addressHead.join('')
      this.newMessage.address = addressHead_joined + this.newMessage.addressTail

      if (this.chooseType == '新建') {
        // 生成唯一识别符
        this.newMessage.id = this.uuid()
        this.$emit('add_item', this.newMessage)
      }
      // 入栈
      this.$parent.dataStack.push(JSON.stringify(this.$parent.tableData))

      const data = JSON.stringify(this.$parent.tableData)
      localStorage.setItem('tableData', data)
      this.$parent.isShowModal = !this.$parent.isShowModal
      this.reset()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.newMessage)
          this.submit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 接受数据
    get_data(row){
      this.newMessage = row
      this.oldMessage = row
    },
    // 取消按钮
    cancel() {
      this.$emit('edit_item', this.oldMessage)
      this.$parent.isShowModal = !this.$parent.isShowModal
      this.reset()
    }
  }
}
</script>

<style scoped lang="scss">
.addModal {
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;

  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.5;
  }

  .add_box {
    position: absolute;
    z-index: 100;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background-color: white;
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    padding: 10px;

    .title {
      font-weight: bold;
      font-size: 1.3rem;
      margin-bottom: 8px;
    }

    .form {
      justify-content: space-between;
      padding: 20px 20px;
      position: relative;
      // background-color: antiquewhite;
      width: 100%;
      box-sizing: border-box;

      ::v-deep .el-form {
        display: flex;
        flex-wrap: wrap;

        .el-form-item {
          display: flex;
          flex-direction: column;
          margin: 10px 15px;

          .el-form-item__label {
            padding: 0;
            width: 150px;
            text-align: left;
            color: black;
            font-size: 1rem;
          }
          .el-input__inner {
            width: 300px;
          }
        }

        .address_input_box {
          display: flex;
          // position: relative;

          .el-form-item {
            display: flex;
            flex-direction: column;
            margin: 10px 15px;
          }

          .el-cascader .el-input__inner {
            width: 200px;
          }
          .address_input .el-input__inner {
            margin-left: 30px;
            width: 400px;
            position: absolute;
            top: 15px;
            left: -30px;
          }
          .address_input + .el-form-item__error {
            width: 150px;
            margin-top: 40px;
          }
        }

        .btn_group {
          // width: 300px;
          position: absolute;
          right: 0;
          bottom: -100px;

          .cancel {
            background-color: #f5f5f5;
            color: black;
            border: none;
            width: 100px;
          }
          .confirm {
            background-color: #3fa5f8;
            border: none;
            width: 100px;
            color: white;
          }
        }
      }
    }
  }
}
</style>
