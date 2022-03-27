const cheerio = require('cheerio');
const xlsx  = require('node-xlsx')
const FS = require('fs');
const path = require('path');
const jobData = require('./file/job')
function dbNewBookHandle(data) {
//cheerio使用之前，需要先cheerio.load,类似初始化，下面的$操作就跟jquery没什么两样,
  $ = cheerio.load(data);
  const newBookData = $('.slide-list ul li');
  let disposeBook = '';
  Array.prototype.forEach.call(newBookData, function(element) {
    const node = $(element);
    disposeBook += `{\n
    书名: ${$(node.find('.title a')).html().replace(/(\n)/g, "").trim()}
    作者: ${$(node.find('.author')).html().replace(/(\n)/g, "").trim()}
    出版时间: ${$(node.find('.more-meta .year')).html().replace(/(\n)/g, "").trim()}
    出版社: ${$(node.find('.more-meta .publisher')).html().replace(/(\n)/g, "").trim()}
    书籍简介: ${$(node.find('.more-meta .abstract')).html().replace(/(\n)/g, "").trim()}
    书籍封面图: ${$(node.find('.cover img')).attr("src").replace(/(\n)/g, "").trim()}
}\n`

  })
  return disposeBook

}
function teacherHandle(data){
  $ = cheerio.load(data);

  // let fileRead = function(arr){
  //   let xlsxData = {};
  //   if (Array.isArray(arr)) {
  //     let is = false;
  //     let jobIndex = null;
  //     let peopleIndex = null;
  //     let educationIndex = null;
  //     for (let i = 0; i < arr.length; i++) {
  //       const element = arr[i];
  //       let workText = '招聘岗位';
  //       let peopleText = '招聘人数';
  //       let education = '学历'
  //       if (element.indexOf(workText) > -1 && jobIndex === null) {
  //         jobIndex = element.indexOf(workText);
  //       }
  //       if (element.indexOf(peopleText) > -1 && peopleIndex === null) {
  //         peopleIndex = element.indexOf(peopleText);
  //       }
  //       if (element.indexOf(education) > -1 && educationIndex === null) {
  //         educationIndex = element.indexOf(education);
  //       }
  //       if (jobIndex !== null && peopleIndex !== null && educationIndex !== null) {
  //         is = true
  //         break;
  //       }
  //     }
  //     if (is) {
  //       const arr2 = arr.slice(4);
  //       for (let j = 0; j < arr2.length; j++) {
  //         const Element = arr2[j];
  //         if (Element[jobIndex]) {
  //           xlsxData[Element[jobIndex]] = {
  //             people: Element[peopleIndex],
  //             education: Element[educationIndex]
  //           }
  //         }
         
  //       }
  //       jobIndex = null;
  //      peopleIndex = null;
  //       educationIndex = null;
  //       is = false;
  //     }

  //   }
  //   return xlsxData
  // }
  // const folder = FS.readdirSync('./file');
  // let jobObj = {}
  // folder.forEach((fileName,index) => {
  //   const filePath = path.join('./file',fileName)
  //     const fileData = xlsx.parse(filePath)[0].data;
  //     ['xls','xlsx'].indexOf(fileName.split('.')[1]) > -1 && (jobObj[fileName.split('.')[0]] = fileRead(fileData))
  // })
  const newBookData = $('.showtable tbody tr');
  let nodeData = {}
  Array.prototype.forEach.call(newBookData, function(element,index) {
    const node = $(element);
    let nodeTitle = node.find('#ZPGWSL1A35A6001A6106A992001').html()
    if (nodeTitle) {
      if (!Array.isArray(nodeData[nodeTitle])) {
        nodeData[nodeTitle] = new Array()
      }
      const job = jobData[nodeTitle];
      const jobType = node.find('td').eq(1) ? node.find('td').eq(1).html() : '';
      const jobDetail = job && jobType ? job[jobType] : '';
      const newNumber = Number(node.find('td').eq(2).find('font') ? node.find('td').eq(2).find('font').html() : 0)
      const titleName =nodeTitle.split(' ');
        nodeData[nodeTitle].push({
          type: jobType,
          number: newNumber,
          jobNumber: jobDetail ? jobDetail.people : '暂无数据',
          edu: jobDetail ? jobDetail.education : '暂无数据',
          percentage: jobDetail ? (newNumber <= jobDetail.people ? '100%' : `${(Number((jobDetail.people / newNumber) * 100).toFixed(4))}`+'%') : '暂无数据',
          titleName: titleName ? titleName[titleName.length - 1] : '',
          id: 10000+index
        })
    }
  })
  const list = [];
  for (const key in nodeData) {
    if (Object.hasOwnProperty.call(nodeData, key)) {
      const element = nodeData[key];
      list.push({
        titleName: key,
        list: element
      })
    }
  }
  return list

}
const Handle = {
  dbNewBookHandle,
  teacherHandle
}
module.exports = Handle