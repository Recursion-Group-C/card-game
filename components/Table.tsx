
const handleTableCreate = (glossary: string) => {
  if (glossary === "blackjack") {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Deal</td>
                <td>画面下右側に配置されたボタン。
              Betチップにて掛け金を確定した後にこのボタンを押すとカードが配られてゲームが始まります。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Clear</td>
                <td>画面下左側に配置されたボタン
              Betチップにて掛けた金額を0にします。</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Hit</td>
                <td>配られたカード（ハンド）にもう1枚カード追加すること。
              カードの合計数が21以内であれば何度でもヒットを行い、カードを追加することができます。</td>
              </tr>
            </tbody>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>4</th>
                <td>Stand</td>
                <td>配られたカード（ハンド）にそれ以上のカードの追加は行わないという宣言です。
              プレイヤーは手元のカードの数字でディーラーとの勝負に挑みます。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>5</th>
                <td>Double</td>
                <td>掛け金をゲーム開始時の倍にして3枚目のカードを引く宣言です。
              ただし、DOUBLEの宣言を行うと3枚目以上のカードを引くことはできなくなります。</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>6</th>
                <td>Bust</td>
                <td>配られたカード（ハンド）の点数が21点をオーバーしてしまったこと。
              BUSTをしてしまうと、負けとなります。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
  else if (glossary === "rummy") {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>メルド</td>
                <td>手札の一部を使ってシーケンスやグループを作ること</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>グループ</td>
                <td>セットとも呼ばれ、3枚以上の同じランクのカードを作ること</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>シーケンス</td>
                <td>ランとも呼ばれ、3枚以上の同スートで連続したランクのカード。Aは常に1として扱う（Kとはつながらない）。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
  else if (glossary === "speed") {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>ストレートにおけるAの取り扱い</td>
                <td>ストレート（およびストレートフラッシュ）では、AはKとも2ともつなげる事が出来る。すなわちA-2-3-4-5も10-J-Q-K-Aもストレートとみなされる。しかしQ-K-A-2-3のようにK-A-2を含むものはストレートとはみなされない。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>同一の役が出来た場合の強弱</td>
                <td>二人のプレイヤーが同一の役を作った場合、以下のようにしてハンドの強弱を決める。カードの強さは、A→K→Q→J→10→...→2となる。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
  else if (glossary === "war") {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>カードの強さ</td>
                <td>A → K → Q → J → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>勝利条件</td>
                <td>誰かの手札がなくなった時点で、一番多くのカードを手札を持っている人が1位。以下、手札の枚数が多い順に順位が決まる。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
  else if (glossary === "poker") {
    return (
      <>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>ロイヤルストレートフラッシュ</td>
                <td>同じマークの10、J、Q、K、Aをそろえる。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>ストレートフラッシュ</td>
                <td>画面下左側に配置されたボタン
              Betチップにて掛けた金額を0にします。</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>フォーカード</td>
                <td>同じ数字のカードが4枚ある。</td>
              </tr>
            </tbody>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>4</th>
                <td>フルハウス</td>
                <td>スリーカードとワンペアが1組ずつできる。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>5</th>
                <td>フラッシュ</td>
                <td>同じマークのカードが5枚ある。</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>6</th>
                <td>ストレート</td>
                <td>マークに関係なく5枚の数字が連続する。
              （10-J-Q-K-AはストレートとなるがQ-K-A-2-3はストレートにならない。）</td>
              </tr>
            </tbody>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>7</th>
                <td>スリーカード</td>
                <td>同じ数字のカードが3枚ある。</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>8</th>
                <td>ツーペア</td>
                <td>同じ数字のカードが2組ある。</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>9</th>
                <td>ワンペア</td>
                <td>同じ数字のカードが1組だけある。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }
  else if (glossary === "holdem") {
    return (
      <>
        準備中
      </>
    )
  }
};

export default handleTableCreate;
