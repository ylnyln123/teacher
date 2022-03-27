const FS = require('fs');
const Handle = require('./handle');
// 项目文件夹使用中文名称是不符合规范的，因为只是写个示例，就没有去纠结了，小伙伴谨记
const dbWriteUrl = './file/job.js';
async function dbHandle(params) {
  const data = await Handle.dbNewBookHandle(params);//数据过滤放在handle.js中处理
  FS.writeFileSync(dbWriteUrl, params);//文件写入
  return data
}
async function teacherHandle(params) {
  const data = await Handle.teacherHandle(params);//数据过滤放在handle.js中处理
  // FS.writeFileSync(dbWriteUrl, JSON.stringify(data));//文件写入
  return data
}
const Index = {
  dbHandle,
  teacherHandle
}
module.exports = Index