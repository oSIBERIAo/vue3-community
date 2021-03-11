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
      <el-form-item label="重复密码" prop="checkPass">
        <el-input
          type="password"
          ref="checkPass"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          注册
        </el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { stringifyQuery, useRouter } from 'vue-router'
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
      checkPass: '',
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
    const validatePass2 = (rule: any, value: string, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== ruleForm.password) {
        console.log('value2', value)
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    // onMounted(() => {
    //   console.dir('ruleFormRef')
    //   console.log(ruleFormRef)
    // })

    const rules = {
      password: [{ validator: validatePass, required: true, trigger: 'blur' }],
      checkPass: [
        { validator: validatePass2, required: true, trigger: 'blur' },
      ],
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
        .post(url.register, data)
        .then(response => {
          if (response.status === 201) {
            ElMessage.success({
              message: '恭喜你，注册成功，即将转跳至登录页面～',
              type: 'success',
            })
          }
          setTimeout(() => {
            router.push('/')
          }, 3000)
        })
        .catch(error => {
          console.log(error)
          ElMessage.warning({
            message: '注册失败～',
            type: 'warning',
          })
        })
    }
    const submitForm = (e: any) => {
      console.log('e', e)
      const result = ruleFormRef.value.validate()
      result
        .then((e: any) => {
          console.log(e)
          // console.log('ruleForm', ruleForm)
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
      // formData,
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
