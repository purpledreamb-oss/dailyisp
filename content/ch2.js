const CH2 = {
  title: "前處理與 Demosaic",
  sections: [
    {
      id: "ch2_1",
      title: "Black Level Correction 與 OB Clamping",
      content: `<h3>Black Level Correction 與 OB Clamping</h3>

<p>Black Level Correction（BLC，黑階校正）是 ISP Pipeline 的第一個處理模組，也是最基礎的步驟。它的作用是消除感測器輸出中固有的黑階偏移（Black Level Offset），將「真正的零信號」對應到數位值 0。這個步驟看似簡單，但如果校正不正確，將會影響後續所有處理模組的精確性。</p>

<h4>黑階偏移的來源</h4>

<p>感測器在完全無光照的情況下（即鏡頭蓋蓋上），讀出的數位值並不為零。這個非零的底線值就是 Black Level。它的來源主要有以下幾個：</p>

<table>
<thead>
<tr><th>來源</th><th>英文</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>暗電流</td><td>Dark Current</td><td>光電二極體中熱激發產生的電子，與溫度正相關</td></tr>
<tr><td>讀出電路偏移</td><td>Readout Offset</td><td>ADC 和放大器的固定偏置電壓</td></tr>
<tr><td>類比增益偏移</td><td>Gain-dependent Offset</td><td>不同 Analog Gain 設定下的偏移量變化</td></tr>
<tr><td>行/列固定模式雜訊</td><td>Row/Column FPN</td><td>每行或每列的讀出電路差異造成的系統性偏移</td></tr>
</tbody>
</table>

<p>感測器廠商通常會在設計時故意引入一個正向偏移量（Pedestal），確保即使存在負向雜訊波動，ADC 的輸入也不會低於零（避免截斷負值訊號）。典型的 Black Level 值在 10-bit 感測器中約為 64（即 6.25% 的滿量程）。</p>

<div class="diagram">
<svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <defs>
    <marker id="arrowBLC" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#6a8a7a"/></marker>
  </defs>
  <rect x="0" y="0" width="800" height="380" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">感測器輸出與 OB (Optical Black) 區域示意圖</text>

  <!-- Full sensor area -->
  <rect x="80" y="50" width="640" height="290" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="2"/>

  <!-- OB rows (top) -->
  <rect x="80" y="50" width="640" height="40" rx="0" fill="#5a5550" opacity="0.2"/>
  <text x="400" y="75" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">OB Rows（光學遮蔽行）— 上方</text>

  <!-- OB columns (left) -->
  <rect x="80" y="50" width="50" height="290" rx="0" fill="#5a5550" opacity="0.3"/>
  <text x="105" y="200" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold" transform="rotate(-90,105,200)">OB Columns（左側）</text>

  <!-- Active area -->
  <rect x="135" y="95" width="580" height="240" rx="2" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="2"/>
  <text x="425" y="220" text-anchor="middle" font-size="16" fill="#6a8a7a" font-weight="bold">Active Pixel Area</text>
  <text x="425" y="242" text-anchor="middle" font-size="11" fill="#8a8580">有效像素區域（實際影像）</text>

  <!-- OB rows (bottom) - optional -->
  <rect x="80" y="300" width="640" height="40" rx="0" fill="#5a5550" opacity="0.15"/>
  <text x="400" y="325" text-anchor="middle" font-size="10" fill="#5a5550">OB Rows（下方，部分感測器提供）</text>

  <!-- Annotations -->
  <line x1="55" y1="50" x2="55" y2="90" stroke="#e74c3c" stroke-width="1.5"/>
  <line x1="50" y1="50" x2="60" y2="50" stroke="#e74c3c" stroke-width="1.5"/>
  <line x1="50" y1="90" x2="60" y2="90" stroke="#e74c3c" stroke-width="1.5"/>
  <text x="45" y="74" text-anchor="end" font-size="9" fill="#e74c3c">OB</text>

  <line x1="55" y1="95" x2="55" y2="335" stroke="#6a8a7a" stroke-width="1.5"/>
  <line x1="50" y1="95" x2="60" y2="95" stroke="#6a8a7a" stroke-width="1.5"/>
  <line x1="50" y1="335" x2="60" y2="335" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="45" y="220" text-anchor="end" font-size="9" fill="#6a8a7a">Active</text>

  <!-- Metal shield indicator -->
  <rect x="82" y="52" width="46" height="36" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="3,2"/>
  <text x="750" y="60" font-size="9" fill="#e74c3c">● 金屬遮光罩</text>
  <text x="750" y="75" font-size="8" fill="#8a8580">  覆蓋 OB 區域</text>

  <!-- Signal level diagram on the right side would be below -->
  <text x="400" y="370" text-anchor="middle" font-size="10" fill="#8a8580">OB 區域的像素被金屬遮罩覆蓋，永遠不受光照，其讀出值即為 Black Level</text>
</svg>
<div class="caption">圖 2-1：感測器晶片上 Optical Black (OB) 區域與有效像素區域的佈局 — OB 像素用於即時 Black Level 量測</div>
</div>

<h4>OB Clamping 原理</h4>

<p>Optical Black（OB）區域是感測器上一組被金屬遮光罩（Metal Light Shield）永久遮蔽的像素行/列。由於這些像素永遠不會接收到光子，它們的讀出值完全反映了當前環境下的 Black Level。ISP 可以利用 OB 像素的統計值進行即時的 Black Level 追蹤和校正，這個過程稱為 OB Clamping。</p>

<p>OB Clamping 的基本演算法如下：</p>

<pre>
// OB Clamping 基本流程
1. 讀取當前幀的 OB 行/列像素值
2. 分別計算 R/Gr/Gb/B 四個通道的 OB 均值
   OB_R  = mean(OB_pixels where CFA == R)
   OB_Gr = mean(OB_pixels where CFA == Gr)
   OB_Gb = mean(OB_pixels where CFA == Gb)
   OB_B  = mean(OB_pixels where CFA == B)
3. 可選：使用時域 IIR 濾波平滑，避免幀間跳動
   OB_filtered = α × OB_current + (1-α) × OB_previous
4. 從每個像素值中減去對應通道的 OB 值
   pixel_corrected = pixel_raw - OB_channel
5. 低於 0 的值截斷為 0（Clamp to zero）
</pre>

<div class="info-box key">
<div class="box-title">重點</div>
<p>BLC 必須分通道（Per-channel）進行，因為 R/Gr/Gb/B 四個通道的 Black Level 可能不同。此外，Black Level 會隨溫度變化（暗電流與溫度呈指數關係），也會隨 Analog Gain 變化。因此，使用 OB 像素進行即時校正比使用固定的查表值更加準確。</p>
</div>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>如果 BLC 校正不準確，會造成以下問題：(1) 黑階偏高 — 暗部細節被壓縮，影像對比度降低；(2) 黑階偏低 — 暗部出現截斷，資訊丟失；(3) 四通道黑階不一致 — Demosaic 後出現固定的色偏（Color Tint），尤其在暗部區域最為明顯。在車用高溫環境下（85°C+），暗電流可能是常溫的 10 倍以上，BLC 的準確性尤為關鍵。</p>
</div>

<h4>靜態 BLC vs 動態 OB Clamping</h4>

<table>
<thead>
<tr><th>方法</th><th>原理</th><th>優點</th><th>缺點</th></tr>
</thead>
<tbody>
<tr><td>靜態 BLC</td><td>使用出廠時校準的固定 Black Level 值</td><td>簡單、無需額外硬體</td><td>無法追蹤溫度/增益變化</td></tr>
<tr><td>動態 OB Clamping</td><td>每幀使用 OB 像素即時計算</td><td>自適應、準確度高</td><td>OB 區域佔感測器面積、OB 像素有雜訊</td></tr>
<tr><td>混合方法</td><td>靜態基準 + OB 微調</td><td>兼顧穩定性與準確性</td><td>實現較複雜</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在 ISP Tuning 時，BLC 的驗證方法是：蓋上鏡頭蓋（或使用遮光箱），設定不同的 Analog Gain（1x, 2x, 4x, 8x...），檢查 BLC 校正後的影像均值是否穩定接近 0，且四通道之間沒有明顯差異。如果在某些增益設定下暗部出現彩色條紋，通常是 BLC 的通道間校正不精確。</p>
</div>`,
      keyPoints: [
        "BLC 是 ISP Pipeline 的第一步，消除感測器固有的黑階偏移",
        "OB (Optical Black) 像素被金屬遮罩覆蓋，提供即時 Black Level 參考值",
        "BLC 必須分 R/Gr/Gb/B 四通道獨立校正，且需要適應溫度和增益的變化"
      ]
    },
    {
      id: "ch2_2",
      title: "Bad Pixel Correction",
      content: `<h3>Bad Pixel Correction</h3>

<p>Bad Pixel Correction（BPC，壞點校正）是 ISP Pipeline 中緊隨 BLC 之後的處理模組。由於半導體製程的不完美，影像感測器上不可避免地存在一些行為異常的像素，這些像素稱為 Defective Pixel（缺陷像素）或 Bad Pixel（壞點）。如果不加以校正，壞點會在影像中表現為明顯的亮點、暗點或固定色彩點，嚴重影響影像品質。</p>

<h4>壞點的分類</h4>

<div class="diagram">
<svg viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <rect x="0" y="0" width="800" height="350" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">壞點類型與特徵示意圖</text>

  <!-- Normal pixel reference -->
  <g transform="translate(30,55)">
    <text x="80" y="0" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">正常像素</text>
    <text x="80" y="16" text-anchor="middle" font-size="9" fill="#8a8580">Normal Pixel</text>
    <!-- Small sensor grid -->
    <g transform="translate(20,25)">
      <rect x="0" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="48" width="24" height="24" fill="#777" stroke="#fff" stroke-width="1"/><rect x="72" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
    </g>
    <text x="80" y="155" text-anchor="middle" font-size="9" fill="#8a8580">均勻、無異常</text>
  </g>

  <!-- Dead pixel -->
  <g transform="translate(200,55)">
    <text x="80" y="0" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Dead Pixel（死點）</text>
    <text x="80" y="16" text-anchor="middle" font-size="9" fill="#8a8580">輸出永遠為 0 或極低值</text>
    <g transform="translate(20,25)">
      <rect x="0" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="48" width="24" height="24" fill="#111" stroke="#e74c3c" stroke-width="2"/><rect x="72" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
    </g>
    <text x="80" y="155" text-anchor="middle" font-size="9" fill="#e74c3c">中央像素 = 暗點</text>
  </g>

  <!-- Hot pixel -->
  <g transform="translate(400,55)">
    <text x="80" y="0" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Hot Pixel（熱點）</text>
    <text x="80" y="16" text-anchor="middle" font-size="9" fill="#8a8580">輸出異常高（暗電流大）</text>
    <g transform="translate(20,25)">
      <rect x="0" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="0" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="0" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="24" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="24" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="48" width="24" height="24" fill="#fff" stroke="#e74c3c" stroke-width="2"/><rect x="72" y="48" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="48" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="24" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="48" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="72" y="72" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="96" y="72" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="24" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="48" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/><rect x="72" y="96" width="24" height="24" fill="#888" stroke="#fff" stroke-width="1"/><rect x="96" y="96" width="24" height="24" fill="#999" stroke="#fff" stroke-width="1"/>
    </g>
    <text x="80" y="155" text-anchor="middle" font-size="9" fill="#e74c3c">中央像素 = 亮點</text>
  </g>

  <!-- Stuck pixel -->
  <g transform="translate(600,55)">
    <text x="80" y="0" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Stuck Pixel（卡點）</text>
    <text x="80" y="16" text-anchor="middle" font-size="9" fill="#8a8580">輸出固定在某值不變</text>
    <g transform="translate(20,25)">
      <rect x="0" y="0" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="24" y="0" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="48" y="0" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="72" y="0" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="96" y="0" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="24" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="24" y="24" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="48" y="24" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="72" y="24" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="96" y="24" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="48" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="24" y="48" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="48" y="48" width="24" height="24" fill="#bbb" stroke="#e74c3c" stroke-width="2"/><rect x="72" y="48" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="96" y="48" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="72" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="24" y="72" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="48" y="72" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="72" y="72" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="96" y="72" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/>
      <rect x="0" y="96" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="24" y="96" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="48" y="96" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/><rect x="72" y="96" width="24" height="24" fill="#555" stroke="#fff" stroke-width="1"/><rect x="96" y="96" width="24" height="24" fill="#666" stroke="#fff" stroke-width="1"/>
    </g>
    <text x="80" y="155" text-anchor="middle" font-size="9" fill="#e74c3c">中央像素 = 固定值</text>
  </g>

  <!-- Correction illustration -->
  <rect x="80" y="240" width="640" height="90" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="400" y="265" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="bold">BPC 插值校正示意</text>
  <text x="150" y="290" font-size="10" fill="#5a5550">壞點 P(x,y) 的校正值 = f( 同色相鄰像素 )</text>
  <text x="150" y="310" font-size="9" fill="#8a8580">常見方法：取同色鄰域中位值 (Median)，或方向加權平均 (Directional Weighted Average)</text>
</svg>
<div class="caption">圖 2-2：三種主要壞點類型比較及其 BPC 插值校正原理 — 壞點用周圍同色正常像素插值替換</div>
</div>

<h4>BPC 檢測與校正演算法</h4>

<p>BPC 通常分為兩個階段：<strong>檢測（Detection）</strong>和<strong>校正（Correction）</strong>。</p>

<p><strong>靜態壞點校正（Static BPC）</strong>：在產線或出廠時，透過拍攝暗場（Dark Frame）和亮場（Light Frame），掃描所有像素找出壞點位置，記錄在壞點表（Bad Pixel Map / Defect Table）中。ISP 在處理每幀時查表，直接對表中的位置進行插值校正。</p>

<p><strong>動態壞點校正（Dynamic BPC）</strong>：即時檢測每幀影像中的異常像素。演算法原理是比較目標像素與同色相鄰像素的差異，如果差異超過閾值，則判定為壞點並進行校正。</p>

<pre>
// 動態 BPC 演算法（以 Green 通道為例）
// 目標像素 P(x,y) 在 Bayer 中的同色鄰居（十字形）:
//    P(x, y-2)
// P(x-2, y)  P(x, y)  P(x+2, y)
//    P(x, y+2)

neighbors = [P(x,y-2), P(x-2,y), P(x+2,y), P(x,y+2)]
med = median(neighbors)
diff = abs(P(x,y) - med)

if (diff > threshold):
    P(x,y) = med   // 替換為中位值
</pre>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>動態 BPC 的閾值（Threshold）設定需要非常謹慎。閾值太低會把正常的高對比度邊緣（如黑白交界處）誤判為壞點，導致邊緣細節被磨平。閾值太高則可能漏掉一些不太嚴重的壞點。在高 Analog Gain（如夜景模式）下，雜訊增大，更容易產生誤判。通常需要根據增益等級動態調整閾值。</p>
</div>

<div class="info-box key">
<div class="box-title">重點</div>
<p>BPC 必須在 Demosaic 之前完成。如果帶有壞點的 RAW Data 直接進入 Demosaic，壞點的異常值會通過插值擴散到周圍像素，形成一個 3×3 甚至 5×5 的色彩污染區域（Color Artifact），修復難度大幅增加。壞點在 Bayer 域中只影響 1 個像素，但在 Demosaic 後可能影響 9~25 個像素。</p>
</div>

<h4>壞點的成因與演化</h4>

<p>壞點會隨著感測器的使用時間和環境條件而增加。宇宙射線（Cosmic Ray）的累積輻射會損傷矽晶格，產生新的暗電流陷阱（Dark Current Trap），這就是為什麼衛星和太空相機需要更強的 BPC 演算法。在車用領域，長時間的高溫工作環境也會加速壞點的產生，因此動態 BPC 在車用 ISP 中尤為重要。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在 ISP Tuning 驗證 BPC 效果時，可以在暗場（Lens Cap On）下使用長曝光（如 1 秒）和高增益（如 32x）來放大壞點。觀察 BPC 校正前後的影像，確認所有可見壞點都被正確消除，且沒有在正常邊緣區域產生誤校正。</p>
</div>`,
      keyPoints: [
        "壞點分為 Dead Pixel（死點）、Hot Pixel（熱點）和 Stuck Pixel（卡點）三種主要類型",
        "BPC 包含靜態校正（查表法）和動態校正（即時檢測），通常兩者配合使用",
        "BPC 必須在 Demosaic 之前完成，否則壞點會通過插值擴散造成更大面積的色彩污染"
      ]
    },
    {
      id: "ch2_3",
      title: "Lens Shading Correction 與 Vignetting",
      content: `<h3>Lens Shading Correction 與 Vignetting</h3>

<p>Lens Shading Correction（LSC，鏡頭陰影校正）是用於補償鏡頭造成的影像亮度和色彩不均勻性的處理模組。在實際的光學系統中，影像的邊緣和角落通常比中心更暗，色彩也可能偏移。這種現象統稱為 Lens Shading，其中亮度衰減的部分稱為 Vignetting（暗角）。</p>

<h4>Lens Shading 的物理成因</h4>

<p>Lens Shading 主要由以下物理效應造成：</p>

<table>
<thead>
<tr><th>效應</th><th>英文</th><th>衰減規律</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>餘弦四次方定律</td><td>cos⁴θ Law</td><td>I(θ) = I₀ × cos⁴θ</td><td>離軸角 θ 處的照度與 cos⁴θ 成正比，是最基本的物理定律</td></tr>
<tr><td>機械暗角</td><td>Mechanical Vignetting</td><td>邊緣截斷</td><td>鏡筒、濾鏡環等物理遮擋造成邊緣光線不足</td></tr>
<tr><td>光學暗角</td><td>Optical Vignetting</td><td>漸進衰減</td><td>鏡片邊緣的有效光圈面積減小</td></tr>
<tr><td>色彩陰影</td><td>Color Shading</td><td>通道差異</td><td>微透鏡與感測器表面的角度效應，R/G/B 通道衰減程度不同</td></tr>
</tbody>
</table>

<div class="formula">cos⁴θ Law: I(θ) = I₀ × cos⁴(θ)，當 θ = 30° 時，I = 0.56 × I₀（衰減 44%）</div>

<div class="diagram">
<svg viewBox="0 0 780 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:780px">
  <rect x="0" y="0" width="780" height="380" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="390" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">Vignetting 亮度衰減剖面圖</text>

  <!-- Axes -->
  <line x1="80" y1="300" x2="700" y2="300" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="80" y1="300" x2="80" y2="60" stroke="#5a5550" stroke-width="1.5"/>
  <text x="390" y="340" text-anchor="middle" font-size="11" fill="#5a5550">感測器位置（中心 → 邊緣）</text>
  <text x="40" y="180" text-anchor="middle" font-size="11" fill="#5a5550" transform="rotate(-90,40,180)">相對亮度</text>

  <!-- Y-axis labels -->
  <text x="72" y="68" text-anchor="end" font-size="9" fill="#8a8580">100%</text>
  <line x1="75" y1="65" x2="85" y2="65" stroke="#d5cec7" stroke-width="1"/>
  <text x="72" y="128" text-anchor="end" font-size="9" fill="#8a8580">80%</text>
  <line x1="75" y1="125" x2="700" y2="125" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
  <text x="72" y="188" text-anchor="end" font-size="9" fill="#8a8580">60%</text>
  <line x1="75" y1="185" x2="700" y2="185" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
  <text x="72" y="248" text-anchor="end" font-size="9" fill="#8a8580">40%</text>
  <line x1="75" y1="245" x2="700" y2="245" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
  <text x="72" y="305" text-anchor="end" font-size="9" fill="#8a8580">20%</text>

  <!-- X-axis labels -->
  <text x="80" y="318" text-anchor="middle" font-size="9" fill="#8a8580">邊緣</text>
  <text x="235" y="318" text-anchor="middle" font-size="9" fill="#8a8580">1/2</text>
  <text x="390" y="318" text-anchor="middle" font-size="9" fill="#8a8580">中心</text>
  <text x="545" y="318" text-anchor="middle" font-size="9" fill="#8a8580">1/2</text>
  <text x="700" y="318" text-anchor="middle" font-size="9" fill="#8a8580">邊緣</text>

  <!-- Ideal (flat) line -->
  <line x1="80" y1="65" x2="700" y2="65" stroke="#d5cec7" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="720" y="65" font-size="9" fill="#d5cec7">理想</text>

  <!-- Vignetting curve (before correction) - parabolic -->
  <path d="M 80 245 Q 160 195 235 135 Q 310 85 390 65 Q 470 85 545 135 Q 620 195 700 245" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <text x="720" y="250" font-size="9" fill="#e74c3c">校正前</text>

  <!-- After correction curve (nearly flat) -->
  <path d="M 80 72 Q 160 68 235 66 Q 310 65 390 65 Q 470 65 545 66 Q 620 68 700 72" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="720" y="78" font-size="9" fill="#6a8a7a">校正後</text>

  <!-- Gain illustration -->
  <line x1="120" y1="227" x2="120" y2="70" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="130" y="150" font-size="9" fill="#6a8a7a" transform="rotate(-90,130,150)">LSC Gain ≈ 3.3x</text>

  <line x1="390" y1="65" x2="390" y2="65" stroke="#6a8a7a" stroke-width="1"/>
  <text x="400" y="55" font-size="9" fill="#6a8a7a">Gain = 1.0x</text>

  <!-- Fill area showing gain needed -->
  <path d="M 80 245 Q 160 195 235 135 Q 310 85 390 65 Q 470 85 545 135 Q 620 195 700 245 L 700 72 Q 620 68 545 66 Q 470 65 390 65 Q 310 65 235 66 Q 160 68 80 72 Z" fill="#6a8a7a" opacity="0.08"/>

  <!-- Legend -->
  <rect x="250" y="350" width="280" height="25" rx="4" fill="#fff" stroke="#d5cec7"/>
  <line x1="260" y1="363" x2="290" y2="363" stroke="#e74c3c" stroke-width="2"/>
  <text x="298" y="367" font-size="9" fill="#5a5550">校正前 (Vignetting)</text>
  <line x1="400" y1="363" x2="430" y2="363" stroke="#6a8a7a" stroke-width="2"/>
  <text x="438" y="367" font-size="9" fill="#5a5550">校正後 (LSC Applied)</text>
</svg>
<div class="caption">圖 2-3：Vignetting 亮度衰減剖面圖 — 紅線為感測器邊緣到中心的原始亮度分佈，綠線為 LSC 校正後的均勻亮度</div>
</div>

<h4>LSC 校正方法</h4>

<p>LSC 的核心思想是對每個像素乘以一個位置相關的增益值（Gain），使邊緣的亮度被提升到與中心一致。增益值的分佈通常稱為 Gain Map 或 Shading Table。</p>

<p><strong>1. 查表法（LUT-based LSC）</strong>：將感測器區域分割為 N×M 的網格（如 17×13），每個網格節點儲存一個增益值，網格之間的像素使用雙線性插值（Bilinear Interpolation）計算增益。這是最常見的硬體 LSC 實現方式。</p>

<p><strong>2. 多項式擬合法（Polynomial Fitting）</strong>：使用徑向多項式來描述增益分佈。</p>

<div class="formula">Gain(r) = a₀ + a₁r² + a₂r⁴ + a₃r⁶，其中 r 為像素到影像中心的歸一化距離</div>

<p><strong>3. Per-channel LSC</strong>：由於 Color Shading 的存在，R/G/B 三個通道的衰減程度不同。因此 LSC 需要為每個通道（R/Gr/Gb/B）分別維護獨立的 Gain Map，共 4 張表。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>LSC 校正的品質直接影響 AWB 和色彩還原的準確性。如果 Lens Shading 沒有被正確校正，影像邊緣會出現色偏（例如偏綠或偏品紅），AWB 的統計也會被汙染。因此 LSC 的校準精度至關重要。</p>
</div>

<h4>LSC 校準流程</h4>

<pre>
// LSC 校準標準流程
1. 準備均勻光源（Light Box / Integrating Sphere）
2. 在多個色溫（如 2700K, 4000K, 5500K, 6500K）下各拍攝均勻白場影像
3. 對每個色溫的白場影像，計算每個像素位置的亮度與中心亮度的比值
4. 對 R/Gr/Gb/B 四通道分別計算 Gain Map
   Gain(x,y) = Center_Value / Pixel_Value(x,y)
5. 將連續 Gain Map 下採樣到 ISP 支援的網格尺寸（如 17×13）
6. 儲存到 ISP 的 LSC 參數表中
7. 對多個色溫的 LSC 表，ISP 可根據 AWB 估計的色溫進行插值混合
</pre>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>LSC 校正會放大邊緣像素的值，同時也會放大雜訊。邊角處的增益可能高達 3x~5x，這意味著邊角的雜訊也被放大了 3x~5x。因此，在強 LSC 校正的情況下，降噪模組需要對影像邊緣施加更強的降噪力度。部分 ISP 會根據 LSC 增益動態調整降噪強度（LSC-aware NR）。</p>
</div>`,
      keyPoints: [
        "Lens Shading 由 cos⁴θ 定律、機械暗角、光學暗角和色彩陰影共同造成",
        "LSC 使用 Per-channel Gain Map 對四個 Bayer 通道分別補償",
        "LSC 校正會放大邊緣雜訊，降噪模組需要配合進行 LSC-aware 的強度調整"
      ]
    },
    {
      id: "ch2_4",
      title: "Linearization 與 Sensor 特性曲線",
      content: `<h3>Linearization 與 Sensor 特性曲線</h3>

<p>Linearization（線性化）是 ISP Pipeline 中用於校正感測器非線性響應特性的處理步驟。理想的影像感測器應該具有完美的線性響應 — 入射光子數量與輸出數位值成正比。然而，在實際的感測器中，由於各種物理效應，這種線性關係並非總是成立的。</p>

<h4>感測器響應的非線性來源</h4>

<p>感測器的光電轉換函數（Photo-Response Function）描述了入射光照度（Illuminance，lux）與輸出數位值（Digital Number, DN）之間的關係。造成非線性的主要因素包括：</p>

<table>
<thead>
<tr><th>非線性來源</th><th>說明</th><th>影響程度</th></tr>
</thead>
<tbody>
<tr><td>光電二極體飽和</td><td>接近滿阱容量時，響應曲線開始壓縮（Roll-off）</td><td>高光區域</td></tr>
<tr><td>ADC 非線性</td><td>ADC 的 DNL/INL（微分/積分非線性）誤差</td><td>全範圍均勻分佈</td></tr>
<tr><td>列放大器非線性</td><td>Column Amplifier 在高增益下的非線性失真</td><td>高增益設定</td></tr>
<tr><td>故意壓縮曲線</td><td>部分 HDR 感測器使用非線性壓縮來擴展動態範圍</td><td>整體設計選擇</td></tr>
<tr><td>Dual/Multi Conversion Gain</td><td>DCG 切換點附近可能產生非連續</td><td>特定亮度區間</td></tr>
</tbody>
</table>

<div class="diagram">
<svg viewBox="0 0 750 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:750px">
  <rect x="0" y="0" width="750" height="400" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="375" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">Sensor 響應特性曲線 — 線性 vs 非線性</text>

  <!-- Axes -->
  <line x1="100" y1="340" x2="680" y2="340" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="100" y1="340" x2="100" y2="55" stroke="#5a5550" stroke-width="1.5"/>
  <!-- Arrow heads -->
  <polygon points="680,340 673,335 673,345" fill="#5a5550"/>
  <polygon points="100,55 95,62 105,62" fill="#5a5550"/>

  <text x="400" y="375" text-anchor="middle" font-size="11" fill="#5a5550">入射光照度 (Illuminance, lux)</text>
  <text x="45" y="200" text-anchor="middle" font-size="11" fill="#5a5550" transform="rotate(-90,45,200)">輸出數位值 (DN)</text>

  <!-- Y-axis labels -->
  <text x="90" y="340" text-anchor="end" font-size="9" fill="#8a8580">0</text>
  <text x="90" y="60" text-anchor="end" font-size="9" fill="#8a8580">Max</text>

  <!-- Ideal linear curve -->
  <line x1="100" y1="340" x2="640" y2="70" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="650" y="68" font-size="10" fill="#6a8a7a" font-weight="bold">理想線性</text>
  <text x="650" y="82" font-size="8" fill="#6a8a7a">Linear</text>

  <!-- Actual nonlinear curve (with saturation roll-off) -->
  <path d="M 100 340 Q 200 280 300 200 Q 400 135 480 100 Q 550 82 600 78 Q 640 76 660 76" fill="none" stroke="#e74c3c" stroke-width="2.5"/>
  <text x="670" y="100" font-size="10" fill="#e74c3c" font-weight="bold">實際響應</text>
  <text x="670" y="114" font-size="8" fill="#e74c3c">Nonlinear</text>

  <!-- Linearized curve (after correction) -->
  <path d="M 100 340 L 640 72" fill="none" stroke="#2980b9" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="660" y="140" font-size="10" fill="#2980b9" font-weight="bold">線性化後</text>
  <text x="660" y="154" font-size="8" fill="#2980b9">Linearized</text>

  <!-- Saturation region annotation -->
  <rect x="490" y="68" width="175" height="30" rx="3" fill="#e74c3c" opacity="0.08" stroke="#e74c3c" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="577" y="88" text-anchor="middle" font-size="9" fill="#e74c3c">飽和壓縮區 (Saturation Roll-off)</text>

  <!-- Linear region annotation -->
  <rect x="110" y="200" width="200" height="30" rx="3" fill="#6a8a7a" opacity="0.08" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="210" y="220" text-anchor="middle" font-size="9" fill="#6a8a7a">線性區域 (Linear Region)</text>

  <!-- Arrow showing linearization correction -->
  <line x1="500" y1="93" x2="500" y2="108" stroke="#2980b9" stroke-width="1.5"/>
  <polygon points="500,108 496,101 504,101" fill="#2980b9"/>
  <text x="530" y="175" font-size="9" fill="#2980b9">Linearization</text>
  <text x="530" y="188" font-size="9" fill="#2980b9">校正量</text>

  <!-- Knee point for companding sensor -->
  <circle cx="300" cy="200" r="5" fill="none" stroke="#f39c12" stroke-width="2"/>
  <text x="260" y="165" font-size="9" fill="#f39c12">部分 HDR 感測器</text>
  <text x="260" y="178" font-size="9" fill="#f39c12">在此處有 Knee Point</text>
</svg>
<div class="caption">圖 2-4：感測器響應特性曲線比較 — 理想線性、實際非線性響應、及線性化校正後的結果</div>
</div>

<h4>Linearization 校正方法</h4>

<p><strong>1. LUT (Look-Up Table) 方法</strong>：最直接的方式是使用一個一維查找表。輸入為感測器的原始 DN 值，輸出為線性化後的值。LUT 的大小取決於 Bit Depth（10-bit 需要 1024 個 entry，12-bit 需要 4096 個 entry）。</p>

<pre>
// LUT-based Linearization
// 校準流程：
1. 使用可變亮度光源（或 ND Filter 組合），拍攝多組不同照度的影像
2. 記錄每個照度等級對應的平均 DN 值
3. 擬合理想線性函數 DN_ideal = k × Illuminance
4. 建立映射表 LUT[DN_actual] = DN_linear
5. ISP 處理時，每個像素查表替換：
   pixel_linear = LUT[pixel_raw]
</pre>

<p><strong>2. 分段線性近似（Piecewise Linear, PWL）</strong>：用多段直線來近似 Linearization 曲線，大幅減少記憶體需求。典型配置為 8~16 段。這在硬體實現中非常常見。</p>

<div class="formula">PWL: 在區間 [x_i, x_{i+1}] 內，y = slope_i × (x - x_i) + offset_i</div>

<p><strong>3. 多項式擬合</strong>：使用低階多項式（如 3~5 階）來描述反非線性曲線。</p>

<h4>HDR 感測器的 Decompanding</h4>

<p>許多車用 HDR 感測器（如 Sony IMX490、OmniVision OX03C10）使用非線性壓縮（Companding）來將超高動態範圍（120+ dB）壓縮到有限的 Bit Depth（如 12-bit 或 20-bit）中。壓縮曲線通常是分段線性的，暗部保持線性（保持細節），亮部進行壓縮（用較少的 bit 表示更大的亮度範圍）。</p>

<p>ISP 中的 Decompanding 模組負責將壓縮的資料還原為線性域。這一步必須在所有線性處理（如 BLC、LSC、WB Gain）之前完成，否則增益運算的結果將是錯誤的。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>ISP Pipeline 中大部分的處理模組（BLC、LSC、AWB Gain、CCM）都假設輸入資料是線性的。如果感測器輸出非線性資料而未經 Linearization 校正，所有的增益運算都會產生誤差。例如，LSC 的增益是乘法運算，只有在線性域中乘法才能正確補償亮度衰減。因此 Linearization 是確保 ISP Pipeline 數學正確性的基礎。</p>
</div>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>驗證 Linearization 效果的方法：使用灰階色卡（如 X-Rite ColorChecker 的灰階 Patch），在固定光源下拍攝，測量各灰階 Patch 的 DN 值。線性化後，相鄰灰階 Patch 之間的 DN 比值應該與反射率比值一致。如果不一致，說明 Linearization 表需要重新校準。</p>
</div>`,
      keyPoints: [
        "感測器的實際響應並非完美線性，飽和區域的 Roll-off 和 HDR 壓縮是主要非線性來源",
        "Linearization 使用 LUT 或分段線性近似 (PWL) 將非線性數據還原為線性域",
        "線性化是 ISP Pipeline 數學正確性的基礎，LSC、WB Gain、CCM 等模組都依賴線性輸入"
      ]
    },
    {
      id: "ch2_5",
      title: "Demosaic 演算法原理",
      content: `<h3>Demosaic 演算法原理</h3>

<p>Demosaic（又稱 Demosaicing、Debayering、色彩插值）是 ISP Pipeline 中最關鍵的處理步驟之一。它的任務是將 Bayer CFA 格式的單通道 RAW Data 轉換為完整的三通道 RGB 影像。在 Bayer 格式中，每個像素只記錄了 R、G、B 其中一種顏色的資訊，因此每個像素都缺少另外兩種顏色的資訊。Demosaic 演算法透過空間插值（Spatial Interpolation）來估計每個像素缺失的色彩分量。</p>

<div class="diagram">
<svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <defs>
    <marker id="arrowDem" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6a8a7a"/></marker>
  </defs>
  <rect x="0" y="0" width="800" height="360" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">Demosaic 過程：從 Bayer RAW 到 Full RGB</text>

  <!-- Before: Bayer pattern 5x5 -->
  <text x="130" y="58" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Bayer RAW（單通道）</text>
  <g transform="translate(30,70)">
    <rect x="0" y="0" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="20" y="25" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
    <rect x="40" y="0" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="60" y="25" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="80" y="0" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="100" y="25" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
    <rect x="120" y="0" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="140" y="25" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="160" y="0" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="180" y="25" text-anchor="middle" font-size="10" fill="#5a5550">R</text>

    <rect x="0" y="40" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="20" y="65" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="40" y="40" width="40" height="40" fill="#2980b9" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="60" y="65" text-anchor="middle" font-size="10" fill="#5a5550">B</text>
    <rect x="80" y="40" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="100" y="65" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="120" y="40" width="40" height="40" fill="#2980b9" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="140" y="65" text-anchor="middle" font-size="10" fill="#5a5550">B</text>
    <rect x="160" y="40" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="180" y="65" text-anchor="middle" font-size="10" fill="#5a5550">G</text>

    <rect x="0" y="80" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="20" y="105" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
    <rect x="40" y="80" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="60" y="105" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="80" y="80" width="40" height="40" fill="#e74c3c" opacity="0.5" stroke="#5a5550" stroke-width="2"/><text x="100" y="105" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">R?</text>
    <rect x="120" y="80" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="140" y="105" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="160" y="80" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="180" y="105" text-anchor="middle" font-size="10" fill="#5a5550">R</text>

    <rect x="0" y="120" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="20" y="145" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="40" y="120" width="40" height="40" fill="#2980b9" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="60" y="145" text-anchor="middle" font-size="10" fill="#5a5550">B</text>
    <rect x="80" y="120" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="100" y="145" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="120" y="120" width="40" height="40" fill="#2980b9" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="140" y="145" text-anchor="middle" font-size="10" fill="#5a5550">B</text>
    <rect x="160" y="120" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="180" y="145" text-anchor="middle" font-size="10" fill="#5a5550">G</text>

    <rect x="0" y="160" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="20" y="185" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
    <rect x="40" y="160" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="60" y="185" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="80" y="160" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="100" y="185" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
    <rect x="120" y="160" width="40" height="40" fill="#27ae60" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="140" y="185" text-anchor="middle" font-size="10" fill="#5a5550">G</text>
    <rect x="160" y="160" width="40" height="40" fill="#e74c3c" opacity="0.4" stroke="#fff" stroke-width="1"/><text x="180" y="185" text-anchor="middle" font-size="10" fill="#5a5550">R</text>
  </g>

  <!-- Arrow -->
  <text x="290" y="175" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="bold">Demosaic</text>
  <line x1="260" y1="185" x2="330" y2="185" stroke="#6a8a7a" stroke-width="3" marker-end="url(#arrowDem)"/>
  <text x="295" y="205" text-anchor="middle" font-size="9" fill="#8a8580">插值缺失的</text>
  <text x="295" y="218" text-anchor="middle" font-size="9" fill="#8a8580">G 和 B 通道</text>

  <!-- After: Full RGB for the R pixel -->
  <text x="560" y="58" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Full RGB（三通道）</text>
  <g transform="translate(350,70)">
    <!-- R channel -->
    <text x="70" y="-5" text-anchor="middle" font-size="10" fill="#e74c3c" font-weight="bold">R Channel</text>
    <rect x="0" y="0" width="140" height="70" rx="3" fill="#e74c3c" opacity="0.15" stroke="#e74c3c" stroke-width="1"/>
    <text x="70" y="28" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold">R</text>
    <text x="70" y="52" text-anchor="middle" font-size="9" fill="#e74c3c">已知（原始值）</text>

    <!-- G channel -->
    <text x="70" y="85" text-anchor="middle" font-size="10" fill="#27ae60" font-weight="bold">G Channel</text>
    <rect x="0" y="90" width="140" height="70" rx="3" fill="#27ae60" opacity="0.15" stroke="#27ae60" stroke-width="1"/>
    <text x="70" y="118" text-anchor="middle" font-size="24" fill="#27ae60" font-weight="bold">G</text>
    <text x="70" y="145" text-anchor="middle" font-size="9" fill="#27ae60">插值估計</text>

    <!-- B channel -->
    <text x="70" y="178" text-anchor="middle" font-size="10" fill="#2980b9" font-weight="bold">B Channel</text>
    <rect x="0" y="183" width="140" height="70" rx="3" fill="#2980b9" opacity="0.15" stroke="#2980b9" stroke-width="1"/>
    <text x="70" y="211" text-anchor="middle" font-size="24" fill="#2980b9" font-weight="bold">B</text>
    <text x="70" y="238" text-anchor="middle" font-size="9" fill="#2980b9">插值估計</text>
  </g>

  <!-- Merge arrow -->
  <text x="600" y="150" font-size="10" fill="#5a5550">合成</text>
  <line x1="560" y1="160" x2="560" y2="230" stroke="#5a5550" stroke-width="1"/>
  <line x1="560" y1="230" x2="620" y2="195" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowDem)"/>

  <!-- Final pixel -->
  <rect x="630" y="160" width="130" height="70" rx="8" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="695" y="185" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">完整 RGB 像素</text>
  <text x="695" y="205" text-anchor="middle" font-size="15" fill="#5a5550">(R, G, B)</text>
  <text x="695" y="225" text-anchor="middle" font-size="8" fill="#8a8580">每個像素三通道</text>

  <text x="400" y="345" text-anchor="middle" font-size="10" fill="#8a8580">中央像素原本只有 R 值，Demosaic 後獲得完整的 (R, G, B) 三通道值</text>
</svg>
<div class="caption">圖 2-5：Demosaic 處理過程 — 對 R 位置的像素，原始只有 R 值，需要插值估計 G 和 B 值</div>
</div>

<h4>基本插值方法</h4>

<p><strong>1. Bilinear Interpolation（雙線性插值）</strong>：最簡單的方法，直接取同色相鄰像素的平均值。計算量最小，但在邊緣區域容易產生模糊和色彩偽影。</p>

<pre>
// 雙線性插值範例：在 R 像素位置估計 G 值
// Bayer 排列（R 位於中心）:
//     G
//  G  R  G
//     G
G_estimated = (G_top + G_bottom + G_left + G_right) / 4
</pre>

<p><strong>2. Edge-Directed Interpolation（邊緣導向插值）</strong>：這是現代 ISP 中最常用的 Demosaic 方法的核心思想。在進行插值之前，先判斷當前像素位置的邊緣方向（水平或垂直），然後沿著邊緣方向進行插值，避免跨越邊緣。</p>

<div class="diagram">
<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px">
  <rect x="0" y="0" width="700" height="250" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="350" y="24" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="bold">Edge-Directed Demosaic 邊緣方向判斷</text>

  <!-- Horizontal edge scenario -->
  <g transform="translate(30,45)">
    <text x="130" y="0" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">水平邊緣場景</text>
    <!-- Grid showing horizontal edge -->
    <rect x="0" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="52" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="104" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="156" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="208" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/>
    <rect x="0" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="52" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="104" y="67" width="52" height="52" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/><rect x="156" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="208" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/>
    <rect x="0" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="52" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="104" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="156" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="208" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/>
    <!-- Arrow showing interpolation direction -->
    <line x1="60" y1="93" x2="95" y2="93" stroke="#6a8a7a" stroke-width="3" marker-end="url(#arrowDem)"/>
    <line x1="200" y1="93" x2="165" y2="93" stroke="#6a8a7a" stroke-width="3" marker-end="url(#arrowDem)"/>
    <text x="130" y="190" text-anchor="middle" font-size="9" fill="#6a8a7a">✓ 沿水平方向插值（不跨邊緣）</text>
  </g>

  <!-- Vertical edge scenario -->
  <g transform="translate(380,45)">
    <text x="130" y="0" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">垂直邊緣場景</text>
    <rect x="0" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="52" y="15" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="104" y="15" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="156" y="15" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="208" y="15" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/>
    <rect x="0" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="52" y="67" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="104" y="67" width="52" height="52" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/><rect x="156" y="67" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="208" y="67" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/>
    <rect x="0" y="119" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="52" y="119" width="52" height="52" fill="#ddd" stroke="#fff" stroke-width="1"/><rect x="104" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="156" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/><rect x="208" y="119" width="52" height="52" fill="#888" stroke="#fff" stroke-width="1"/>
    <!-- Arrow showing interpolation direction -->
    <line x1="130" y1="23" x2="130" y2="58" stroke="#6a8a7a" stroke-width="3" marker-end="url(#arrowDem)"/>
    <line x1="130" y1="163" x2="130" y2="128" stroke="#6a8a7a" stroke-width="3" marker-end="url(#arrowDem)"/>
    <text x="130" y="190" text-anchor="middle" font-size="9" fill="#6a8a7a">✓ 沿垂直方向插值（不跨邊緣）</text>
  </g>
</svg>
<div class="caption">圖 2-6：Edge-Directed Demosaic — 根據局部梯度判斷邊緣方向，沿邊緣方向進行插值以保持邊緣銳利</div>
</div>

<p>邊緣方向的判斷通常基於水平和垂直梯度的比較：</p>

<div class="formula">ΔH = |G(x-2,y) - G(x+2,y)| + |2×R(x,y) - R(x-2,y) - R(x+2,y)|（水平梯度）</div>
<div class="formula">ΔV = |G(x,y-2) - G(x,y+2)| + |2×R(x,y) - R(x,y-2) - R(x,y+2)|（垂直梯度）</div>

<p>如果 ΔH < ΔV，表示水平方向變化小，存在垂直邊緣，應沿水平方向插值。反之亦然。如果 ΔH ≈ ΔV，則取兩個方向的平均值。</p>

<h4>進階 Demosaic 演算法</h4>

<p>現代 ISP 中使用的 Demosaic 演算法遠比簡單的雙線性或方向性插值複雜。以下是幾種代表性的進階演算法：</p>

<table>
<thead>
<tr><th>演算法</th><th>核心思想</th><th>品質</th><th>複雜度</th></tr>
</thead>
<tbody>
<tr><td>Malvar-He-Cutler (MHC)</td><td>基於梯度校正的 5×5 線性濾波器</td><td>良好</td><td>低</td></tr>
<tr><td>AHD (Adaptive Homogeneity-Directed)</td><td>在多個方向插值後，選擇最均勻的結果</td><td>優秀</td><td>中</td></tr>
<tr><td>DLMMSE</td><td>最小均方差估計，利用色差恆常性假設</td><td>優秀</td><td>中高</td></tr>
<tr><td>VNG (Variable Number of Gradients)</td><td>在 8 個方向計算梯度，選擇低梯度方向插值</td><td>優秀</td><td>高</td></tr>
<tr><td>CNN-based</td><td>深度學習方法，端到端訓練</td><td>最佳</td><td>極高</td></tr>
</tbody>
</table>

<div class="info-box key">
<div class="box-title">重點</div>
<p>Demosaic 演算法的核心挑戰在於邊緣區域。在平坦區域（Flat Region），幾乎所有演算法都能產生良好的結果。但在高頻邊緣（如黑白條紋、細密紋理）區域，低品質的 Demosaic 會產生各種偽影（Artifacts），包括 Zipper Effect、False Color 和 Moiré Pattern。下一節將詳細討論這些偽影。</p>
</div>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在硬體 ISP 中，Demosaic 演算法的選擇需要在影像品質和硬體成本之間取得平衡。越複雜的演算法需要更大的 Line Buffer（因為需要更大的鄰域窗口，如 5×5 或 7×7），以及更多的乘加運算器。手機 ISP 通常採用中等複雜度的邊緣導向演算法（5×5 鄰域），而高階影像處理軟體（如 Adobe Lightroom）則可以使用更複雜的 VNG 或 AHD 演算法。</p>
</div>`,
      keyPoints: [
        "Demosaic 將 Bayer 單通道 RAW 轉換為完整三通道 RGB，是 ISP 最關鍵的步驟之一",
        "Edge-Directed Interpolation 根據梯度判斷邊緣方向，沿邊緣插值以避免跨邊緣模糊",
        "演算法複雜度與影像品質成正比，硬體 ISP 需要在品質和成本之間平衡"
      ]
    },
    {
      id: "ch2_6",
      title: "Demosaic Artifacts",
      content: `<h3>Demosaic Artifacts</h3>

<p>Demosaic 是一個「猜測缺失資訊」的過程，因此不可避免地會引入各種偽影（Artifacts）。這些偽影在影像的高頻區域（如細密紋理、高對比度邊緣）最為明顯。理解 Demosaic Artifacts 的成因和特徵，對於 ISP Tuning 工程師在評估和改善影像品質時至關重要。</p>

<h4>主要的 Demosaic Artifacts 類型</h4>

<div class="diagram">
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <rect x="0" y="0" width="800" height="500" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">三種主要 Demosaic Artifacts 示意圖</text>

  <!-- 1. Zipper Artifact -->
  <g transform="translate(30,50)">
    <rect x="0" y="0" width="220" height="190" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
    <text x="110" y="22" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Zipper Artifact（拉鏈偽影）</text>

    <!-- Illustration: alternating bright/dark pixels at edge -->
    <g transform="translate(25,35)">
      <!-- Left side: dark -->
      <rect x="0" y="0" width="25" height="120" fill="#444"/>
      <!-- Edge zone with zipper -->
      <rect x="25" y="0" width="25" height="15" fill="#444"/><rect x="25" y="15" width="25" height="15" fill="#ccc"/>
      <rect x="25" y="30" width="25" height="15" fill="#444"/><rect x="25" y="45" width="25" height="15" fill="#ccc"/>
      <rect x="25" y="60" width="25" height="15" fill="#444"/><rect x="25" y="75" width="25" height="15" fill="#ccc"/>
      <rect x="25" y="90" width="25" height="15" fill="#444"/><rect x="25" y="105" width="25" height="15" fill="#ccc"/>
      <!-- Another zipper column -->
      <rect x="50" y="0" width="25" height="15" fill="#ccc"/><rect x="50" y="15" width="25" height="15" fill="#444"/>
      <rect x="50" y="30" width="25" height="15" fill="#ccc"/><rect x="50" y="45" width="25" height="15" fill="#444"/>
      <rect x="50" y="60" width="25" height="15" fill="#ccc"/><rect x="50" y="75" width="25" height="15" fill="#444"/>
      <rect x="50" y="90" width="25" height="15" fill="#ccc"/><rect x="50" y="105" width="25" height="15" fill="#444"/>
      <!-- Right side: bright -->
      <rect x="75" y="0" width="25" height="120" fill="#ccc"/>
      <rect x="100" y="0" width="25" height="120" fill="#ccc"/>
      <rect x="125" y="0" width="25" height="120" fill="#ccc"/>
      <!-- Border -->
      <rect x="0" y="0" width="150" height="120" fill="none" stroke="#d5cec7" stroke-width="1"/>
    </g>
    <text x="110" y="175" text-anchor="middle" font-size="9" fill="#8a8580">邊緣處出現亮暗交替的</text>
    <text x="110" y="188" text-anchor="middle" font-size="9" fill="#8a8580">鋸齒狀圖案（像拉鏈）</text>
  </g>

  <!-- 2. False Color -->
  <g transform="translate(290,50)">
    <rect x="0" y="0" width="220" height="190" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
    <text x="110" y="22" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">False Color（偽色）</text>

    <g transform="translate(25,35)">
      <!-- Gray edge with false color artifacts -->
      <rect x="0" y="0" width="150" height="30" fill="#888"/>
      <rect x="0" y="30" width="50" height="15" fill="#888"/>
      <rect x="50" y="30" width="25" height="15" fill="#c47a7a"/><!-- false red -->
      <rect x="75" y="30" width="25" height="15" fill="#7ac47a"/><!-- false green -->
      <rect x="100" y="30" width="50" height="15" fill="#888"/>
      <rect x="0" y="45" width="150" height="15" fill="#bbb"/>
      <rect x="0" y="60" width="25" height="15" fill="#bbb"/>
      <rect x="25" y="60" width="25" height="15" fill="#7a7ac4"/><!-- false blue -->
      <rect x="50" y="60" width="25" height="15" fill="#c4c47a"/><!-- false yellow -->
      <rect x="75" y="60" width="75" height="15" fill="#bbb"/>
      <rect x="0" y="75" width="150" height="45" fill="#bbb"/>
      <rect x="0" y="0" width="150" height="120" fill="none" stroke="#d5cec7" stroke-width="1"/>
    </g>
    <text x="110" y="175" text-anchor="middle" font-size="9" fill="#8a8580">灰色邊緣區域出現不存在的</text>
    <text x="110" y="188" text-anchor="middle" font-size="9" fill="#8a8580">彩色斑點（紅/綠/藍/黃）</text>
  </g>

  <!-- 3. Moiré Pattern -->
  <g transform="translate(550,50)">
    <rect x="0" y="0" width="220" height="190" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
    <text x="110" y="22" text-anchor="middle" font-size="12" fill="#5a5550" font-weight="bold">Moiré Pattern（摩爾紋）</text>

    <g transform="translate(25,35)">
      <!-- Fine stripe pattern creating moiré -->
      <rect x="0" y="0" width="150" height="120" fill="#ccc"/>
      <!-- Concentric circles suggesting moiré -->
      <circle cx="75" cy="60" r="55" fill="none" stroke="#888" stroke-width="3" opacity="0.3"/>
      <circle cx="75" cy="60" r="45" fill="none" stroke="#aaa" stroke-width="4" opacity="0.3"/>
      <circle cx="75" cy="60" r="35" fill="none" stroke="#888" stroke-width="3" opacity="0.4"/>
      <circle cx="75" cy="60" r="25" fill="none" stroke="#aaa" stroke-width="4" opacity="0.4"/>
      <circle cx="75" cy="60" r="15" fill="none" stroke="#888" stroke-width="3" opacity="0.5"/>
      <circle cx="75" cy="60" r="5" fill="none" stroke="#aaa" stroke-width="4" opacity="0.5"/>
      <!-- Some color bands -->
      <ellipse cx="75" cy="60" rx="50" ry="30" fill="none" stroke="#c47a7a" stroke-width="2" opacity="0.4" transform="rotate(30,75,60)"/>
      <ellipse cx="75" cy="60" rx="40" ry="20" fill="none" stroke="#7a7ac4" stroke-width="2" opacity="0.4" transform="rotate(-20,75,60)"/>
      <rect x="0" y="0" width="150" height="120" fill="none" stroke="#d5cec7" stroke-width="1"/>
    </g>
    <text x="110" y="175" text-anchor="middle" font-size="9" fill="#8a8580">高頻細密紋理（如布料紋路）</text>
    <text x="110" y="188" text-anchor="middle" font-size="9" fill="#8a8580">產生低頻彩色波浪圖案</text>
  </g>

  <!-- Detailed explanations below -->
  <rect x="30" y="260" width="740" height="220" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1"/>

  <text x="60" y="285" font-size="11" fill="#5a5550" font-weight="bold">Artifact 成因分析：</text>

  <text x="60" y="310" font-size="10" fill="#e74c3c" font-weight="bold">● Zipper Artifact</text>
  <text x="80" y="328" font-size="9" fill="#5a5550">成因：Demosaic 在邊緣處的插值方向判斷錯誤，跨越邊緣進行插值。亮暗像素值交替出現形成鋸齒。</text>
  <text x="80" y="344" font-size="9" fill="#8a8580">好發位置：高對比度的水平或垂直邊緣（如黑白交界處）。</text>

  <text x="60" y="370" font-size="10" fill="#9b59b6" font-weight="bold">● False Color（偽色/色彩偽影）</text>
  <text x="80" y="388" font-size="9" fill="#5a5550">成因：R/G/B 通道的空間取樣率不同（Nyquist 頻率不同），高頻亮度信號被錯誤地插值為色彩變化。</text>
  <text x="80" y="404" font-size="9" fill="#8a8580">好發位置：灰色或白色的高頻邊緣（如金屬反光邊緣）。本質上是亮度信號的 Aliasing 進入色彩通道。</text>

  <text x="60" y="430" font-size="10" fill="#2980b9" font-weight="bold">● Moiré Pattern（摩爾紋）</text>
  <text x="80" y="448" font-size="9" fill="#5a5550">成因：場景中的高頻規則紋理（空間頻率接近或超過 Bayer 陣列的 Nyquist 頻率）產生取樣混疊（Aliasing）。</text>
  <text x="80" y="464" font-size="9" fill="#8a8580">好發位置：細密規則紋理（如織物、百葉窗、電視螢幕翻拍）。表現為大範圍的彩色波浪圖案。</text>
</svg>
<div class="caption">圖 2-7：三種主要 Demosaic Artifacts — Zipper（邊緣鋸齒）、False Color（偽色）和 Moiré Pattern（摩爾紋）</div>
</div>

<h4>Artifacts 的頻率域解釋</h4>

<p>從頻率域（Frequency Domain）的角度來理解 Demosaic Artifacts 更為透徹。Bayer CFA 對 R/B 通道的取樣率只有 G 通道的一半（因為 G 佔 50%，R 和 B 各佔 25%）。根據 Nyquist 取樣定理，R/B 通道的最大可表示空間頻率只有 G 通道的一半。</p>

<p>當場景中包含空間頻率接近或超過 Nyquist 頻率的高頻成分時，這些成分會被「折疊」（Aliasing）到低頻，表現為 Moiré 或 False Color。這是取樣理論的本質限制，任何 Demosaic 演算法都無法完全消除。</p>

<div class="formula">Bayer 陣列 Nyquist 頻率：R/B 通道 = 1/(4×Pixel Pitch)，G 通道 = 1/(2×Pixel Pitch × √2)</div>

<h4>減少 Artifacts 的策略</h4>

<table>
<thead>
<tr><th>策略</th><th>方法</th><th>效果</th><th>副作用</th></tr>
</thead>
<tbody>
<tr><td>更好的 Demosaic 演算法</td><td>Edge-Directed、AHD、VNG</td><td>顯著減少 Zipper 和 False Color</td><td>增加計算複雜度</td></tr>
<tr><td>Anti-aliasing Filter (OLPF)</td><td>鏡頭前加光學低通濾波器</td><td>從源頭消除高頻混疊</td><td>犧牲整體銳度</td></tr>
<tr><td>後處理 False Color Suppression</td><td>在色度通道施加低通濾波</td><td>有效消除 False Color</td><td>可能降低真實色彩邊緣的飽和度</td></tr>
<tr><td>Demosaic 前的 RAW NR</td><td>在 Bayer 域先降噪</td><td>減少雜訊對 Demosaic 的干擾</td><td>可能損失微細節</td></tr>
<tr><td>更高解析度感測器</td><td>更高的取樣率</td><td>提升 Nyquist 頻率上限</td><td>更小像素、更多資料量</td></tr>
</tbody>
</table>

<h4>False Color Suppression</h4>

<p>在 Demosaic 之後，許多 ISP 會加入一個 False Color Suppression（FCS，偽色抑制）模組。其核心原理是利用「自然影像中色度（Chrominance）的空間頻率通常低於亮度（Luminance）」這一統計特性。FCS 對 Demosaic 輸出的色差通道（如 Cr = R-G, Cb = B-G）施加空間低通濾波，在保持亮度細節的同時消除高頻色彩偽影。</p>

<pre>
// False Color Suppression 基本原理
// 將 RGB 轉換為 YCbCr
Y  = 0.299*R + 0.587*G + 0.114*B   // 亮度
Cb = B - Y                           // 色差 Blue
Cr = R - Y                           // 色差 Red

// 對色差通道施加低通濾波（如 3×3 或 5×5 Gaussian）
Cb_filtered = LPF(Cb)
Cr_filtered = LPF(Cr)

// 混合（可根據邊緣強度調整混合比例）
α = edge_strength   // 邊緣處 α 較大，施加更強的 FCS
Cb_out = (1-α) × Cb + α × Cb_filtered
Cr_out = (1-α) × Cr + α × Cr_filtered

// 轉回 RGB
R_out = Y + Cr_out
B_out = Y + Cb_out
G_out = Y - 0.299*Cr_out - 0.114*Cb_out  // (simplified)
</pre>

<div class="info-box key">
<div class="box-title">重點</div>
<p>Demosaic Artifacts 的嚴重程度受多個因素影響：(1) Demosaic 演算法的品質；(2) 場景內容（高頻紋理越多、偽影越明顯）；(3) 銳化強度（銳化會放大偽影）；(4) 雜訊水平（雜訊會干擾邊緣方向判斷）。ISP Tuning 工程師需要在銳度、降噪和偽色抑制之間取得平衡，這是 IQ Tuning 中最具挑戰性的部分之一。</p>
</div>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>在評估 Demosaic 品質時，最常使用的測試圖案是 ISO 12233 解析力卡中的斜線和星型圖案（Siemens Star）。在 Siemens Star 的中心區域，由於線條間距小於 Nyquist 極限，Moiré 和 False Color 最為明顯。注意這些偽影是取樣的物理限制，並非 ISP 的「故障」，但 ISP 的 Demosaic 演算法品質決定了偽影的嚴重程度。</p>
</div>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>現代越來越多的高階手機已經開始嘗試使用 AI/ML-based Demosaic（如 Google 的 Pixel ISP、Apple 的 ProRAW 處理）。這些方法使用深度學習模型端到端地學習從 Bayer RAW 到 RGB 的映射，能夠在邊緣保持、偽色抑制和細節還原方面達到傳統演算法難以企及的效果。但其缺點是計算量大、需要 NPU 加速，且在訓練分佈之外的場景可能產生不可預期的結果。</p>
</div>`,
      keyPoints: [
        "Demosaic 的三大主要偽影為 Zipper Artifact（邊緣鋸齒）、False Color（偽色）和 Moiré Pattern（摩爾紋）",
        "偽影的根本原因是 Bayer 陣列的取樣率限制導致高頻信號混疊（Aliasing）",
        "False Color Suppression 透過對色差通道施加低通濾波來抑制偽色，是 Demosaic 後的重要補救步驟"
      ]
    }
  ]
};

