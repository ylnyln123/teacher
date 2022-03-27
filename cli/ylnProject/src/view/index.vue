<template>
  <div>
    <el-table
    :data="tableData"
    style="width: 100%"
    row-key="id"
    border
    lazy
    :load="load"
    height="80vh"
    empty-text="数据加载中....."
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="titleName"
      label="地区"
      width="180">
    </el-table-column>
    <el-table-column
      prop="type"
      label="岗位">
    </el-table-column>
    <el-table-column
      prop="jobNumber"
      label="招聘人数">
    </el-table-column>
        <el-table-column
      prop="edu"
      label="学历要求">
    </el-table-column>
        <el-table-column
      prop="number"
      label="报名人数">
    </el-table-column>
        <el-table-column
      prop="percentage"
      label="录取比例">
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
let tableList = [];
export default {
  data() {
    return {
 tableData: []
    }
  },
  created(){
    this.$axios.get('http://localhost:3000/hello').then(res => {
      console.log('请求成功',res);
      tableList = res.data;
      const list = []
      res.data.forEach((element,index) => {
        list.push({
          titleName: element.titleName,
          id: index+1,
          type:'',
          percentage: '',
          number: '',
          jobNumber: '',
          edu: '',
          hasChildren: true
        })
      });
      this.tableData = list
    })
  },
  methods: {
 load(tree, treeNode, resolve) {
   console.log(tree,treeNode);
   const listData = tableList.find(item => { 
     console.log(item.titleName,tree.titleName );
     return item.titleName == tree.titleName 
     })

          resolve(listData.list)
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
