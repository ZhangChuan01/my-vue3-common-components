<script setup lang='ts'>
const dataSource = reactive({
  thead: [
    [
      {
        value: '测试<br/>1',
        rowspan: 2
      },
      {
        value: '测试2'
      },
      {
        value: '测试3'
      },
      {
        value: '测试4'
      },
      {
        value: '测试5'
      }
    ],
    [
      {
        value: 'thead2-1'
      },
      {
        value: 'thead2-2'
      },
      {
        value: 'thead2-3'
      },
      {
        value: 'thead2-4'
      }
    ]
  ],
  tbody: [
    [
      {
        value: '1-1',
        type: 'input',
        code: 'a'
      },
      {
        value: '1-2',
        colspan: 2,
        type: 'input',
        code: 'b'
      },
      {
        value: '1-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-31-3',
        colspan: 2,
        type: 'input',
        code: 'c'
      }
    ],
    [
      {
        value: '2-1',
        rowspan: 2,
        type: 'input',
        code: 'a'
      },
      {
        value: '2-2',
        type: 'input',
        code: 'b'
      },
      {
        value: '2-3',
        colspan: 3,
        type: 'input',
        code: 'c'
      }
    ],
    [
      {
        value: '3-1',
        type: 'input',
        code: 'a'
      },
      {
        value: '3-2',
        type: 'input',
        code: 'd'
      },
      {
        value: '3-3',
        colspan: 2,
        type: 'input',
        code: 'f'
      }
    ]
  ]
})

const nativeTable = ref()
let res = ref('')
const getData = () => {
  res.value = nativeTable.value.getData()
}
</script>

<template>
  <div>
    <NavtiveTable
      ref="nativeTable"
      :data-source="dataSource"
    />
    <div style="text-align: right;">
      <el-button
        type="primary"
        @click="getData"
      >
        获取数据
      </el-button>
    </div>
    <div>{{ res }}</div>
  </div>
</template>
