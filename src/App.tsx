import React, { createContext, useState } from 'react'
import './App.css'
import IdiomCard from './IdiomCard'
import NshJson from './nsh.json'
import { request } from './request'
import IdiomJson from './idioms.json'

export const ConfigContext = createContext('conf')

function App() {
  const [data, setData] = useState<any[]>([])
  const [current, setCurrent] = useState<string>('')
  const [configs, setConfigs] = useState<any>({})

  const [result, setResult] = useState<any[]>([])
  const [recommond, setRecommond] = useState<any[]>([])

  const handleSubmit = () => {
    const item = current?.trim()
    if (item && item.length === 4) {
      const ret = data?.concat(current)
      setData(ret)
      setCurrent('')
    } else {
      alert('请输入四字成语')
    }
  }

  const handleChange = (e: any) => {
    setCurrent(e.target.value)
  }

  const handleKeyDown = (e: any) => {
    if (e.which === 13) {
      handleSubmit()
    }
  }

  const handleGo = () => {
    const arr = Object.values(configs)
    if (!arr?.length) {
      alert('请输入四字成语')
      return
    }

    // green
    const contain = arr
      ?.filter((o: any) => o.color === 'green')
      .reduce((prev: any, cur: any) => {
        const val = prev[cur.char]
        if (val?.length && !val.includes(cur.pos)) {
          prev[cur.char] = val.concat(cur.pos)
        } else {
          prev[cur.char] = [cur.pos]
        }
        return prev
      }, {})

    // orange
    const wrongLoc = arr
      ?.filter((o: any) => o.color === 'orange')
      .reduce((prev: any, cur: any) => {
        const val = prev[cur.char]
        if (val?.length && !val.includes(cur.pos)) {
          prev[cur.char] = val.concat(cur.pos)
        } else {
          prev[cur.char] = [cur.pos]
        }
        return prev
      }, {})
    // lightgray
    const notContain = arr
      ?.filter((o: any) => o.color === 'lightgray')
      .reduce((prev: any, cur: any) => {
        prev[cur.char] = []
        return prev
      }, {})

    const params = {
      contain,
      wrongLoc,
      notContain,
    }
    const idiomsList = request(params)
    setResult(idiomsList)

    // 推荐: nsh成语库命中
    const recList = idiomsList?.filter((o) => NshJson.data.includes(o.ID))
    setRecommond(recList)
  }

  const handleClear = () => {
    setData([])
    setCurrent('')
    setConfigs([])
    setResult([])
    setRecommond([])
  }

  return (
    <div className="home">
      <div className="search">
        <input
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="请输入成语..."
          type="text"
        />
        <div className="buttons">
          <button onClick={handleClear}>清空</button>
          <button
            onClick={handleSubmit}
            style={{ background: '#0170fe', color: 'white' }}
          >
            提交
          </button>
        </div>
      </div>

      <div className="container">
        <div className="content">
          <div>
            <ConfigContext.Provider value={configs}>
              {data?.map((item) => (
                <IdiomCard data={item} key={item} />
              ))}
            </ConfigContext.Provider>
          </div>

          {data?.length > 0 && (
            <div>
              <button
                className="go"
                onClick={handleGo}
                style={{
                  background: 'transparent',
                  color: '#0170fe',
                  border: '1px solid #0170fe',
                }}
              >
                查询结果
              </button>
              <div className="tip">
                <div>提示：</div>
                <div>
                  1.使用方法
                  <ul>
                    <li>输入成语回车</li>
                    <li>
                      对声母/韵母进行颜色标记( 颜色按[
                      <b style={{ color: 'green' }}>绿</b>/
                      <b style={{ color: 'orange' }}>橙</b>/
                      <b style={{ color: 'lightgray' }}>灰</b>]顺序切换)
                    </li>
                    <li>点击查询结果</li>
                    <li>支持多个成语累计查询</li>
                    <li>
                      <span>推荐词量: {NshJson.data.length}个</span>
                      {'   '}
                      <span>默认词量: {IdiomJson.data.length}个</span>
                    </li>
                  </ul>
                </div>
                <div>
                  2. 可能存在部分问题,欢迎提
                  <a href="https://github.com/CatNulls/guess-idioms/issues">
                    issues
                  </a>
                </div>
                <div>
                  3. 灵感来自 [{' '}
                  <a
                    href="https://github.com/0xVanfer/idioms-nsh"
                    target="_blank"
                    rel="noreferrer"
                  >
                    可达鸭不发呆(雷霆)
                  </a>{' '}
                  ] ,由 [{' '}
                  <a
                    href="https://github.com/CatNulls/guess-idioms"
                    target="_blank"
                    rel="noreferrer"
                  >
                    止戈为武(雷动)
                  </a>{' '}
                  ] 完善
                </div>
                <div>
                  4.{' '}
                  <a
                    href="https://docs.qq.com/sheet/DU2dPUHNyVExkQW5X?tab=BB08J2&scode="
                    target="_blank"
                    rel="noreferrer"
                  >
                    游戏玩家统计
                  </a>
                </div>
                <div>
                  5. 版本: V0.1.2(2022/09/15)
                  <ul>
                    <li>更新成语库</li>
                    <li>移动端适配</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="result">
          {recommond?.length > 0 && (
            <div className="list">
              <div style={{ fontWeight: 'bold' }}>
                推荐({recommond?.length}):
              </div>
              <div>
                {(recommond || []).map((it) => (
                  <span
                    key={`${it.ID}-${it.First}-${it.Second}-${it.Third}-${
                      it.Fourth
                    }-${Math.random()}`}
                  >
                    {it.ID}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result?.length > 0 && (
            <div className="list">
              <div style={{ fontWeight: 'bold' }}>结果({result?.length}):</div>
              <div>
                {(result || []).map((it) => (
                  <span
                    key={`${it.ID}-${it.First}-${it.Second}-${it.Third}-${
                      it.Fourth
                    }-${Math.random()}`}
                  >
                    {it.ID}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="copyright">
        <span>&copy; {new Date().getFullYear()}</span>
        <span>
          <a
            href="https://github.com/0xVanfer/idioms-nsh"
            target="_blank"
            rel="noreferrer"
          >
            雷霆觉醒-可达鸭不发呆
          </a>
        </span>
        <span>&</span>
        <span>
          <a
            href="https://github.com/CatNulls/guess-idioms"
            target="_blank"
            rel="noreferrer"
          >
            雷动九天-止戈为武
          </a>
        </span>
      </div>
    </div>
  )
}

export default App
