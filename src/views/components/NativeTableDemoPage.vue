<script setup lang='ts'>
const dataSource = reactive({
  thead: [
    [
      {
        value: '测试1',
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
        type: 'input'
      },
      {
        value: '1-2',
        colspan: 2
      },
      {
        value: '1-3',
        colspan: 2
      }
    ],
    [
      {
        value: '2-1',
        rowspan: 2
      },
      {
        value: '2-2'
      },
      {
        value: '2-3',
        colspan: 3
      }
    ],
    [
      {
        value: '3-1'
      },
      {
        value: '3-2'
      },
      {
        value: '3-3',
        colspan: 2
      }
    ]
  ]
})
</script>

<template>
  <div>
    <NavtiveTable :data-source="dataSource" />
  </div>
</template>
