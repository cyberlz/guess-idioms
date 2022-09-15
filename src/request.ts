import IdiomJson from './idioms.json'

const PosAttribute: string[] = ['Zero', 'First', 'Second', 'Third', 'Fourth']
// 声母表
const InitialWords = [
  'b',
  'p',
  'm',
  'f',
  'd',
  't',
  'n',
  'l',
  'g',
  'k',
  'h',
  'j',
  'q',
  'x',
  'zh',
  'ch',
  'sh',
  'r',
  'z',
  'c',
  's',
  'y',
  'w',
]

// const FinalWords = [
//   'a', // ia
//   'o',
//   'e', // ue
//   'i',
//   'u',
//   'v',
//   'ai',
//   'ei',
//   'ui',
//   'ao', // iao
//   'ou',
//   'iu',
//   'ie',
//   've',
//   'er',
//   'an', // ian uan
//   'en',
//   'in',
//   'un',
//   'vn',
//   'ang', // iang uang
//   'eng',
//   'ing',
//   'ong', // iong
// ]

const wordRange: Record<string, string[]> = {
  a: ['ia'],
  o: ['ao', 'iao'],
  e: ['ie', 'ue'],
  i: ['ai', 'ei', 'ui'],
  u: ['ou', 'iu'],
  an: ['ian', 'uan'],
  ang: ['iang', 'uang'],
  ong: ['iong'],
}

const SpecialFianalLetters = Object.keys(wordRange)

/**
 * 判断拼音是否包含指定声母韵母
 * @param word 拼音
 * @param char 声母/韵母
 * @returns
 */
const IsContainWords = (word: string, char: string) => {
  const isInitail = InitialWords.includes(char)
  // 声母
  if (isInitail) {
    // 特殊声母判定
    if (['z', 'c', 's'].includes(char)) {
      return (
        (word || '').startsWith(char) && !(word || '').startsWith(`${char}h`)
      )
    }
    return (word || '').startsWith(char)
  } else {
    // 特殊韵母判定
    if (SpecialFianalLetters.includes(char)) {
      return (
        (word || '').endsWith(char) &&
        !wordRange[char].some((o) => (word || '').endsWith(o))
      )
    }
    return (word || '').endsWith(char)
  }
}

// 模拟接口
export const request = ({
  contain,
  wrongLoc,
  notContain,
}: {
  contain: any
  wrongLoc: any
  notContain: any
}) => {
  const needLetters = Object.keys(contain)
  const wrongLetters = Object.keys(wrongLoc)
  const unNeedLetters = Object.keys(notContain)

  // 若声母韵母有存在选项 则剔除不包含的这些拼音
  const deniedLetters = unNeedLetters.filter(
    (i) => !(needLetters.includes(i) || wrongLetters.includes(i)) && i
  )

  const ret = IdiomJson.data.filter((o: any) => {
    // 过滤掉包含灰色声母韵母的成语
    const flag1 = deniedLetters.every((char) => {
      return !(
        IsContainWords(o.First, char) ||
        IsContainWords(o.Second, char) ||
        IsContainWords(o.Third, char) ||
        IsContainWords(o.Fourth, char)
      )
    })

    // 过滤掉不包含绿色声母韵母的成语
    const flag2 = needLetters.every((char) => {
      const posArr = contain[char]
      return posArr.every((i: number) => {
        const attr = PosAttribute[i]

        return IsContainWords(o[attr], char)
      })
    })

    // 过滤掉位置不正确的声母韵母
    const flag3 = wrongLetters.every((char) => {
      const posArr = wrongLoc[char]
      const otherArr = [1, 2, 3, 4].filter((i) => !posArr.includes(i))
      // 指定位置不存在
      const notExistLoc = posArr.every((i: number) => {
        const attr = PosAttribute[i]

        return !IsContainWords(o[attr], char)
      })
      // 其他位置存在
      const exsitOtherLoc = otherArr.some((i: number) => {
        const attr = PosAttribute[i]
        return IsContainWords(o[attr], char)
      })

      return notExistLoc && exsitOtherLoc
    })

    return flag1 && flag2 && flag3
  })

  return ret
}
