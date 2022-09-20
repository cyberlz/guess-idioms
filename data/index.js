const jsonFile = require('jsonfile')
const { pinyin } = require('pinyin-pro');
const path = require('path')
const input = path.join(__dirname, './xinhua-idiom.json')
const output = path.join(__dirname,'./idioms.json')

const option = {
  toneType: 'none',
  type: 'array',
  v: true,
}

/**
 * {
 *   "derivation": "语出《法华经·法师功德品》下至阿鼻地狱。”", 
 *   "example": "但也有少数意志薄弱的……逐步上当，终至堕入～。★《上饶集中营·炼狱杂记》", 
 *   "explanation": "阿鼻梵语的译音，意译为无间”，即痛苦无有间断之意。常用来比喻黑暗的社会和严酷的牢狱。又比喻无法摆脱的极其痛苦的境地。", 
 *   "pinyin": "ā bí dì yù", 
 *   "word": "阿鼻地狱",
 *   "abbreviation": "abdy"
 * }
 * 转为
 * {
 *    "ID": "无所适从",
 *    "First": "wu",
 *    "Second": "suo",
 *    "Third": "shi",
 *    "Fourth": "cong"
 *  },
 */
const formatIdioms = () => {
  jsonFile.readFile(input, (err, data) => {
    if (err) throw err
    // 格式化成语
    const wordArr = data.map(item => {
      const ret = pinyin(item.word, option);
      const word = {
        ID: item.word,
        First: ret[0],
        Second: ret[1],
        Third: ret[2],
        Fourth: ret[3],
      }
      return word
    })

    const content = {
      data: wordArr,
    }
    // 保存结果
    jsonFile.writeFile(output, content, (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('数据格式化完成')
    })
  })
}

formatIdioms()
