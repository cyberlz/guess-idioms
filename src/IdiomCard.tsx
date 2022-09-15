import { memo, useContext, useEffect, useState } from 'react'
import { pinyin } from 'pinyin-pro'
import './IdiomCard.css'
import { ConfigContext } from './App'
const InitialOpt: any = {
  pattern: 'initial',
  toneType: 'none',
  type: 'array',
  v: true, // ü -> v
}

const FinalOpt: any = {
  pattern: 'final',
  toneType: 'none',
  type: 'array',
  v: true, // ü -> v
}

const switchColor = (color: string) => {
  switch (color) {
    case 'green':
      return 'orange'
    case 'orange':
      return 'lightgray'
    case 'lightgray':
      return 'green'
  }
}

function IdiomCard({ data }: { data: string }) {
  const [initialData, setInitialData] = useState<any[]>([])
  const [finalData, setFinalData] = useState<any[]>([])
  const [textData, setTextData] = useState<string[]>([])
  const context: any = useContext(ConfigContext)

  const updateConfig = (item: any) => {
    const key = `${item.pos}-${item.char}`
    context[key] = item
  }

  useEffect(() => {
    const hzArr = data?.split('')
    setTextData(hzArr)
  }, [data])

  useEffect(() => {
    const initialRet: string[] = pinyin(data, InitialOpt) as any
    // 声母 {pos: number, char: string, color: 'green' | 'orange' | 'lightgray'}
    const initArr = initialRet?.map((i: string, idx: number) => ({
      pos: idx + 1,
      char: i,
      color: 'lightgray',
    }))
    setInitialData(initArr)

    initArr.forEach((i: any) => {
      updateConfig(i)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    const finalRet: string[] = pinyin(data, FinalOpt) as any
    // 韵母 {pos: number, char: string, color: 'green' | 'orange' | 'lightgray'}
    const finalArr = finalRet?.map((f: string, idx: number) => ({
      pos: idx + 1,
      char: f,
      color: 'lightgray',
    }))
    setFinalData(finalArr)
    finalArr.forEach((i: any) => {
      updateConfig(i)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleClick = (isFinal: boolean, idx: number) => {
    // 是否韵母
    const tempData = isFinal ? finalData : initialData
    tempData[idx].color = switchColor(tempData[idx].color)
    isFinal ? setFinalData([...tempData]) : setInitialData([...tempData])
    updateConfig(tempData[idx])
  }

  return (
    <div className="card">
      <div className="pinyin">
        {initialData?.map((o: any, idx: number) => (
          <span key={`${o.char}-${o.pos}`}>
            <div
              style={{ color: o.color }}
              onClick={() => handleClick(false, idx)}
            >
              {o.char}
            </div>
            <div
              style={{ color: finalData[idx].color }}
              onClick={() => handleClick(true, idx)}
            >
              {finalData[idx].char}
            </div>
          </span>
        ))}
      </div>
      <div className="hanzi">
        {textData?.map((h: string, idx: number) => (
          <span key={`${h}-${idx}`}>{h}</span>
        ))}
      </div>
    </div>
  )
}

export default memo(IdiomCard)
