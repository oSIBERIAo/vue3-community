<template>
  <div>
    <br />
    <el-form
      status-icon
      :rules="rules"
      :model="ruleForm"
      ref="ruleFormRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          ref="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          登录
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { url } from '../../../api'

console.log('url', url.register)
console.log('axios', axios)

export default defineComponent({
  name: 'Signup',
  setup() {
    const router = useRouter()
    const ruleForm = reactive({
      username: '',
      password: '',
    })
    const ruleFormRef: any = ref(null)
    // const myRef = ref(null)
    const checkUsername = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('名字不能为空'))
      } else if (value.length <= 4) {
        callback(new Error('名字长度不得小于4'))
      } else {
        callback()
      }
    }
    const validatePass = (rule: any, value: string, callback: any) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (ruleForm.password !== '') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          ruleFormRef.value.validateField('checkPass')
        }
        callback()
      }
    }
    const rules = {
      password: [{ validator: validatePass, required: true, trigger: 'blur' }],
      username: [{ validator: checkUsername, required: true, trigger: 'blur' }],
    }
    const register = (form: {
      username: string | Blob
      password: string | Blob
    }) => {
      const data = new FormData()
      data.append('username', form.username)
      data.append('password', form.password)
      axios
        .post(url.token, data)
        .then(response => {
          if (response.status === 201) {
            ElMessage.success({
              message: '恭喜你，登录成功，即将转跳至首页页面～',
              type: 'success',
            })
          }
          localStorage.setItem(
            'token',
            'Basic ' + btoa(response.data.token + ':'),
          )
          setTimeout(() => {
            router.push('/')
          }, 3000)
        })
        .catch(error => {
          console.log(error)
          ElMessage.warning({
            message: '登录失败～',
            type: 'warning',
          })
        })
    }
    const submitForm = () => {
      const result = ruleFormRef.value.validate()
      result
        .then(() => {
          register(ruleForm)
        })
        .catch((e: any) => {
          console.log('false', e)
        })
    }
    const resetForm = () => {
      ruleFormRef.value.resetFields()
    }
    return {
      submitForm,
      ruleForm,
      rules,
      ruleFormRef,
      resetForm,
    }
  },
})
</script>

<style></style>
