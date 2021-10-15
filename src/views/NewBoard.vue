<template>
  <div class="Board">
    <br />
    <el-form
      status-icon
      :rules="rules"
      :model="ruleForm"
      ref="ruleFormRef"
      label-width="100px"
      class="ruleForm"
    >
      <el-form-item label="新增Board" prop="content">
        <el-input v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          提交
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
import { url } from '../../api.ts'
import { useStore } from 'vuex'

console.log('url', url.register)
console.log('axios', axios)

export default defineComponent({
  name: 'Newboard',
  setup() {
    const store = useStore()
    const router = useRouter()
    const ruleForm = reactive({
      content: '',
    })
    const ruleFormRef: any = ref(null)
    const checkBoard = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else if (value.length < 1) {
        callback(new Error('长度不得小于1'))
      } else {
        callback()
      }
    }
    const rules = {
      content: [{ validator: checkBoard, required: true, trigger: 'blur' }],
    }
    const submit = (form: { content: string | Blob }) => {
      const payload = new FormData()
      payload.append('content', form.content)
      console.log('store', store)
      store
        .dispatch('addBoard', payload)
        .then(data => {
          ElMessage.success({
            message: '恭喜你，添加成功～',
            type: 'success',
          })
          setTimeout(() => {
            router.push('/')
          }, 500)
          console.log('cg-data', data)
        })
        .catch(e => {
          console.log(e)
          ElMessage.warning({
            message: '添加失败～',
            type: 'warning',
          })
        })
    }
    const submitForm = () => {
      const result = ruleFormRef.value.validate()
      result
        .then(() => {
          submit(ruleForm)
        })
        .catch((e: any) => {
          console.log('false', e)
        })
    }
    const resetForm = () => {
      ruleForm.content = ''
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

<style scoped lang="scss">
.Board {
  box-shadow: 0 2px 20px 2px #dddddd47;
  border: 1px solid #f1f1f1;
  border-radius: 7px;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 40px;
  overflow: hidden;
  padding: 30px 20px 0 10px;
  .ruleForm {
    button {
      margin: 10px 10px;
      color: #4d5d70;
      background-color: #f1f1f1;
      border: #f1f1f1;
    }
  }
}
</style>
