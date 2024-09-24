my-vue3-common-components
================
### 对element-plus进行二次封装，使用示例及源码可在[这里](https://github.com/ZhangChuan01/my-vue3-common-components)查看
#### 如何使用
1. 安装
    ```  
    yarn add my-vue3-common-components --save
    or
    npm install my-vue3-common-components --save
    ```
2. 引入及使用  
    在main.ts中进行组件引入，全局注册，使用类似于element-plus
    ```
    import MyVue3CommonComponents from 'my-vue3-common-components/dist'
    import 'my-vue3-common-components/dist/style.css'

    const app = createApp(App)
    app
      .use(MyVue3CommonComponents)
      .mount('#app')
    ```      
    全局配置(可选项)    
    ```use(MyVue3CommonComponents,{ formCol: 1, formLabelPosition: 'right' })```
    formCol 表单列数，可选项为1,2，默认值为2      
    formLabelPosition  表单label对齐方式，参考element-plus的table组件，默认值为top
3. TypeScript支持    
    在```tsconfig.json```中的```types```字段中添加```"my-vue3-common-components/dist/components"```即可获得组件及字段提示   
    如果需要基础组件类型可自行引入   
    ```import { Input, Select, Date, Switch, ColorPicker } from 'my-vue3-common-components/dist/components/global/base/base'```
4. 其他  
    table组件中有v-has指令，用于按钮权限判断，根据实际业务自行实现或者复制本人源码中此指令代码    
    组件搭配本人开发的hooks使用将更加快捷方便    
    [一个基础的增删改查页面示例](https://github.com/ZhangChuan01/my-vue3-common-components/blob/main/src/views/Home/HomePage.vue)