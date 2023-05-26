<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { FormItemRule } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useCurrentInstance } from '../../../../utils/common';
import Directory from '../../components/Directory.vue';
const [vmInstance] = useCurrentInstance()

interface SDK_BUILD {
	[key: string]: string
}

interface BaseOption {
	value: string
	label: string
}

interface Prebuilt {
	version: string
	prebuilt_platform: string[]
	runtime_platform: string
}

const formRef = ref()
const prebuilt = ref<Prebuilt[]>([])
const platform = ref<BaseOption[]>([])

const formItems = reactive([
	{
    prop: 'sdkVersion',
    label: 'SDK版本',
    render: 'select',
    placeholder: '请选择SDK版本',
		options: computed(() => {
			return prebuilt.value.map(i => ({
				value: i.version,
				label: i.version
			}))
		}),
		change: (val: string) => {
			handlePlatform(val)
			formData.sdkPlatForm = ''
		}
  },
	{
    prop: 'sdkPlatForm',
    label: 'SDK平台',
    render: 'select',
    placeholder: '请选择SDK平台',
		options: computed(() => platform.value)
  },
	{
    prop: 'cmakeArgs',
    label: 'Cmake参数',
    render: 'input',
    placeholder: '请输入Cmake参数，多个命令行参数可以使用空格或分号来分隔，如果命令行参数包含空格或者特殊字符，应该将整个参数用引号括起来',
		type: 'textarea',
		autosize: {
			minRows: 6,
			maxRows: 10
		}
  },
	{
    prop: 'outputPath',
    label: '输出目录',
    render: 'directory',
    placeholder: '请选择输出目录'
  }
])

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
	sdkVersion: [
    { required: true, message: '请选择SDK版本', trigger: 'change' }
  ],
	sdkPlatForm: [
    { required: true, message: '请选择SDK平台', trigger: 'change' }
  ]
})

const formData = reactive<SDK_BUILD>({
	label: '',
	sdkVersion: '',
	sdkPlatForm: '',
	cmakeArgs: '',
	outputPath: ''
})

const handleAddSDK = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			vmInstance?.$vscode.postMessage?.({ 
				id: 'vscode:message save-buildConfig', 
				build_data: JSON.stringify(formData)
			}, '*');
		}
	})
}

const handlePlatform = (val: string) => {
	const p = prebuilt.value.find(i => i.version === val)
	platform.value = p ? p.prebuilt_platform.map(i => ({
		value: i,
		label: i
	})) : []
}

watch(
	() => history?.state?.params,
	(val) => {
		Object.keys(formData).forEach(i => {
			formData[i] = (val?.[i] ?? '') as string
		})

		if (formData.sdkVersion === '') formData.sdkVersion = val?.addition?.Default_version
		prebuilt.value = val?.addition?.Detail?.prebuilt
		handlePlatform(formData.sdkVersion)
	},
	{ immediate: true, deep: true }
)
</script>

<template>
	<div class="build_content">
		<el-form 
			:model="formData"
			:rules="rules"
			label-width="120px"
			ref="formRef"
		>
			<el-form-item
				v-for="(item, key) in formItems"
				:key="'items_' + key"
				:label="item.label"
				:prop="item.prop"
			>
				<!-- input -->
				<el-input
					v-if="item.render === 'input'"
					v-model="formData[item.prop as keyof SDK_BUILD]"
					:type="item?.type"
					:placeholder="item?.placeholder"
					:autosize="item?.autosize"
				/>

				<!-- select -->
				<el-select
					v-if="item.render === 'select'"
					v-model="formData[item.prop as keyof SDK_BUILD]"
					:placeholder="item?.placeholder"
					@change="item?.change"
				>
					<el-option
						v-for="(option, index) in item?.options as BaseOption[]"
						:key="'select_' + index"
						:label="option?.label"
						:value="option?.value"
					/>
				</el-select>

				<!-- directory -->
				<template v-if="item.render === 'directory'">
					<Directory
						v-model:path="formData[item.prop as keyof SDK_BUILD]"
						:placeholder="item?.placeholder"
					/>
				</template>
			</el-form-item>
		</el-form>

		<el-button
			type="primary"
			@click="handleAddSDK"
		>
			<el-icon><Plus /></el-icon>
			添加ZKOS SDK Build
		</el-button>
	</div>
</template>

<style scoped>
.build_content {
	width: 700px;
}
.build_content :deep(.el-select) {
	width: 100%;
}
.build_content .el-icon {
	margin-right: 8px;
}
</style>
