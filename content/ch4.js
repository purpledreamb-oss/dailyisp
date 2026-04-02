const CH4 = {
  title: "色彩處理 Color",
  sections: [
    {
      id: "ch4_1",
      title: "色彩空間基礎 Color Space Fundamentals",
      content: `
<h3>色彩空間的本質</h3>
<p>在 ISP 處理流程中，色彩空間（Color Space）是描述顏色的數學模型。每個色彩空間定義了一組基底色（Primary Colors）與一個白點（White Point），用來建立三維座標系統，讓每個顏色都能用數值來精確表示。理解色彩空間是掌握所有色彩處理演算法的基礎。</p>

<p>人眼的錐狀細胞（Cone Cells）分為 L（Long）、M（Medium）、S（Short）三種，分別對應紅、綠、藍三個波段的光譜響應。CIE 1931 標準觀察者函數（Standard Observer Functions）正是基於人眼感知建立的數學模型，定義了 <code>x̄(λ)</code>、<code>ȳ(λ)</code>、<code>z̄(λ)</code> 三個配色函數（Color Matching Functions）。</p>

<div class="diagram"><svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg">
  <!-- CIE xy chromaticity outline -->
  <rect fill="#f5f0eb" width="700" height="420" rx="8"/>
  <text x="350" y="30" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">RGB Cube 與 CIE xy 色度圖</text>
  <!-- RGB Cube -->
  <g transform="translate(120,80)">
    <text x="80" y="-10" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">RGB Color Cube</text>
    <!-- Back face -->
    <polygon points="40,40 200,40 200,200 40,200" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Top face -->
    <polygon points="40,40 80,10 240,10 200,40" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Right face -->
    <polygon points="200,40 240,10 240,170 200,200" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Axes -->
    <line x1="40" y1="200" x2="200" y2="200" stroke="#c44040" stroke-width="2.5"/>
    <text x="120" y="220" text-anchor="middle" font-size="11" fill="#c44040">R</text>
    <line x1="40" y1="200" x2="40" y2="40" stroke="#40a040" stroke-width="2.5"/>
    <text x="25" y="120" text-anchor="middle" font-size="11" fill="#40a040">G</text>
    <line x1="40" y1="40" x2="80" y2="10" stroke="#4040c0" stroke-width="2.5"/>
    <text x="70" y="8" text-anchor="middle" font-size="11" fill="#4040c0">B</text>
    <!-- Vertices -->
    <circle cx="40" cy="200" r="4" fill="#5a5550"/>
    <text x="20" y="210" font-size="9" fill="#8a8580">(0,0,0)</text>
    <circle cx="200" cy="200" r="4" fill="#c44040"/>
    <text x="200" y="220" font-size="9" fill="#8a8580">(1,0,0)</text>
    <circle cx="40" cy="40" r="4" fill="#40a040"/>
    <text x="10" y="38" font-size="9" fill="#8a8580">(0,1,0)</text>
    <circle cx="240" cy="10" r="4" fill="#4040c0"/>
    <circle cx="240" cy="170" r="4" fill="#c0c040"/>
    <circle cx="200" cy="40" r="4" fill="#40c0c0"/>
    <circle cx="80" cy="10" r="4" fill="#c040c0"/>
  </g>
  <!-- CIE diagram -->
  <g transform="translate(380,50)">
    <text x="130" y="0" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">CIE 1931 xy Chromaticity</text>
    <!-- Spectral locus approximation -->
    <path d="M60,300 Q20,200 40,130 Q60,60 120,25 Q180,5 210,30 Q250,60 260,100 Q270,150 260,200 Q250,250 230,280 L60,300 Z" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="2"/>
    <!-- Axes -->
    <line x1="20" y1="310" x2="280" y2="310" stroke="#d5cec7" stroke-width="1"/>
    <line x1="20" y1="310" x2="20" y2="10" stroke="#d5cec7" stroke-width="1"/>
    <text x="150" y="340" text-anchor="middle" font-size="11" fill="#8a8580">x</text>
    <text x="8" y="160" text-anchor="middle" font-size="11" fill="#8a8580">y</text>
    <!-- sRGB triangle -->
    <polygon points="90,260 120,70 230,220" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="90" y="275" font-size="9" fill="#c44040">R</text>
    <text x="112" y="65" font-size="9" fill="#40a040">G</text>
    <text x="235" y="225" font-size="9" fill="#4040c0">B</text>
    <text x="145" y="200" font-size="10" fill="#6a8a7a">sRGB</text>
    <!-- White point -->
    <circle cx="140" cy="180" r="3" fill="#5a5550"/>
    <text x="150" y="178" font-size="9" fill="#5a5550">D65</text>
    <!-- Wavelength labels -->
    <text x="45" y="128" font-size="8" fill="#8a8580">520nm</text>
    <text x="205" y="25" font-size="8" fill="#8a8580">510nm</text>
    <text x="265" y="105" font-size="8" fill="#8a8580">480nm</text>
    <text x="55" y="305" font-size="8" fill="#8a8580">700nm</text>
  </g>
</svg><div class="caption">圖 4-1：RGB 立方體色彩模型與 CIE 1931 xy 色度圖概覽</div></div>

<h3>常見色彩空間</h3>
<p>ISP 工程師在日常工作中會遇到多種色彩空間，每種都有其特定用途：</p>

<table>
<tr><th>色彩空間</th><th>用途</th><th>特性</th></tr>
<tr><td>Linear RGB（Raw）</td><td>Sensor 原始數據</td><td>線性光響應，未經 Gamma 校正</td></tr>
<tr><td>sRGB</td><td>網頁、消費級顯示器</td><td>Gamma ≈ 2.2，D65 白點</td></tr>
<tr><td>Adobe RGB</td><td>專業攝影後製</td><td>比 sRGB 更廣的綠色區域</td></tr>
<tr><td>Display P3</td><td>Apple 裝置、HDR 內容</td><td>比 sRGB 寬 25% 的色域</td></tr>
<tr><td>BT.2020</td><td>4K/8K HDR 視訊</td><td>超廣色域，涵蓋人眼可見色 75.8%</td></tr>
<tr><td>CIE XYZ</td><td>色彩科學參考</td><td>裝置無關的絕對色彩空間</td></tr>
<tr><td>YCbCr / YUV</td><td>視訊壓縮、ISP 內部處理</td><td>亮度與色度分離，便於壓縮</td></tr>
</table>

<h3>RGB 與 YCbCr 的轉換</h3>
<p>在 ISP 中，影像通常在不同色彩空間之間轉換。RGB 到 YCbCr 的轉換是最常見的操作之一，因為許多降噪和壓縮演算法在 YCbCr 域中效率更高。BT.601 標準定義的轉換公式為：</p>

<div class="formula">Y = 0.299R + 0.587G + 0.114B<br>Cb = -0.169R - 0.331G + 0.500B + 128<br>Cr = 0.500R - 0.419G - 0.081B + 128</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
Y 通道代表亮度（Luminance），攜帶了影像的大部分結構資訊。Cb 和 Cr 分別代表藍色色差和紅色色差。人眼對亮度的敏感度遠高於色度，因此視訊壓縮（如 H.264/H.265）常使用 4:2:0 的 Chroma Subsampling，在色度通道上以一半或四分之一的解析度儲存。
</div>

<h3>CIE XYZ 與色彩科學</h3>
<p>CIE 1931 XYZ 色彩空間是所有色彩空間轉換的橋樑。當我們需要從一個 RGB 色彩空間轉換到另一個時，通常的路徑是：</p>

<p><strong>Source RGB → Linear RGB → CIE XYZ → Linear Target RGB → Target RGB</strong></p>

<p>XYZ 到 xy 色度座標的計算非常簡單：<code>x = X/(X+Y+Z)</code>，<code>y = Y/(X+Y+Z)</code>。這個投影去除了亮度資訊，只保留色度，形成了我們在 CIE 色度圖上看到的馬蹄形光譜軌跡（Spectral Locus）。</p>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在 ISP 開發中，Raw 數據處於 Sensor 原生的線性色彩空間。要正確地將顏色映射到目標色彩空間（例如 sRGB），需要經過 CCM（Color Correction Matrix）的轉換。如果跳過這一步或 CCM 校正不當，影像的色彩準確性會大打折扣——天空可能偏紫、膚色可能偏綠，這些都是 ISP 工程師必須解決的問題。
</div>

<h3>色彩空間的維度與座標</h3>
<p>色彩空間可以是三維的（如 RGB、Lab、XYZ），也可以是用不同座標系統來表示的（如 HSV、HSL）。HSV（Hue-Saturation-Value）將色彩分解為色相、飽和度和明度三個直覺化的維度，特別適合做色彩調整。Lab 色彩空間則以感知均勻性（Perceptual Uniformity）著稱，L 代表亮度，a 和 b 分別代表綠-紅和藍-黃軸。</p>

<p>理解這些色彩空間之間的關係和轉換方法，是設計和調試 ISP 色彩處理模組的基礎。後續章節將深入探討 CCM、White Balance、Gamma 等具體模組如何在這些空間中運作。</p>
`,
      keyPoints: [
        "色彩空間是用數學模型描述顏色的座標系統，由基底色與白點定義",
        "CIE XYZ 是裝置無關的參考色彩空間，是不同色彩空間轉換的橋樑",
        "YCbCr 將亮度與色度分離，適合視訊壓縮與 ISP 降噪處理",
        "ISP 中 Raw 數據處於線性空間，需經 CCM 轉換才能正確映射到目標色彩空間",
        "HSV 適合直覺化色彩調整，Lab 以感知均勻性著稱"
      ]
    },
    {
      id: "ch4_2",
      title: "CCM 原理與 3x3 矩陣設計 Color Correction Matrix",
      content: `
<h3>什麼是 CCM？</h3>
<p>Color Correction Matrix（CCM）是 ISP 中最核心的色彩校正模組之一。由於 Camera Sensor 的 RGB 濾光片（Color Filter Array）的光譜響應與人眼的錐狀細胞光譜響應不同，Sensor 捕捉到的原始 RGB 值無法直接對應到標準色彩空間中正確的顏色。CCM 的作用就是通過一個 3×3 矩陣將 Sensor RGB 映射到目標色彩空間（通常是 sRGB 或 D65 下的線性 RGB）。</p>

<div class="formula">
[R_out]   [C11  C12  C13] [R_in]<br>
[G_out] = [C21  C22  C23] [G_in]<br>
[B_out]   [C31  C32  C33] [B_in]
</div>

<div class="diagram"><svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="300" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">CCM 轉換流程</text>
  <!-- Sensor -->
  <rect x="30" y="80" width="120" height="70" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="90" y="110" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Sensor RGB</text>
  <text x="90" y="130" text-anchor="middle" font-size="9" fill="#8a8580">（原始色彩響應）</text>
  <!-- Arrow -->
  <line x1="150" y1="115" x2="195" y2="115" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4)"/>
  <!-- AWB -->
  <rect x="195" y="80" width="100" height="70" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="245" y="110" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">AWB Gain</text>
  <text x="245" y="130" text-anchor="middle" font-size="9" fill="#8a8580">（白平衡增益）</text>
  <!-- Arrow -->
  <line x1="295" y1="115" x2="340" y2="115" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4)"/>
  <!-- CCM -->
  <rect x="340" y="65" width="130" height="100" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="2"/>
  <text x="405" y="95" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">3×3 CCM</text>
  <text x="405" y="115" text-anchor="middle" font-size="9" fill="#5a5550">矩陣乘法運算</text>
  <text x="405" y="135" text-anchor="middle" font-size="9" fill="#8a8580">線性域處理</text>
  <text x="405" y="150" text-anchor="middle" font-size="9" fill="#8a8580">每 pixel 獨立</text>
  <!-- Arrow -->
  <line x1="470" y1="115" x2="515" y2="115" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4)"/>
  <!-- Output -->
  <rect x="515" y="80" width="140" height="70" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="585" y="110" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Target RGB (sRGB)</text>
  <text x="585" y="130" text-anchor="middle" font-size="9" fill="#8a8580">（標準色彩空間）</text>
  <!-- Matrix detail -->
  <rect x="180" y="190" width="340" height="80" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
  <text x="200" y="215" font-size="10" fill="#5a5550" font-family="monospace">R_out = C11*R + C12*G + C13*B</text>
  <text x="200" y="235" font-size="10" fill="#5a5550" font-family="monospace">G_out = C21*R + C22*G + C23*B</text>
  <text x="200" y="255" font-size="10" fill="#5a5550" font-family="monospace">B_out = C31*R + C32*G + C33*B</text>
  <defs><marker id="arrow4" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 4-2：CCM 在 ISP 中的處理流程，從 Sensor RGB 經 AWB 後由 3×3 矩陣轉換到目標色彩空間</div></div>

<h3>CCM 的校正原理</h3>
<p>CCM 的設計通常使用 Macbeth ColorChecker（24 色卡）作為標準參考。校正流程如下：</p>
<ol>
<li>在特定光源（如 D65、TL84、A 光源）下拍攝色卡</li>
<li>提取每個色塊的 Sensor RGB 值（經過 AWB 校正後）</li>
<li>查找每個色塊在目標色彩空間中的標準值</li>
<li>使用最小二乘法（Least Squares）求解最佳 3×3 矩陣</li>
</ol>

<p>數學上，設 <code>S</code> 為 Sensor 端 N×3 矩陣（N 個色塊的 RGB 值），<code>T</code> 為目標端 N×3 矩陣，則最佳 CCM 為：</p>

<div class="formula">CCM = (S<sup>T</sup>S)<sup>-1</sup> S<sup>T</sup>T</div>

<h3>CCM 的數學特性</h3>
<p>一個良好的 CCM 矩陣通常具有以下特性：</p>
<ul>
<li><strong>行和為 1</strong>：確保白色仍映射為白色（White Preservation）。即 <code>C11+C12+C13 ≈ 1</code></li>
<li><strong>對角線元素最大</strong>：表示各通道以自身為主要貢獻</li>
<li><strong>非對角線元素為負</strong>：表示通道間的色彩串擾校正（Cross-talk Correction）</li>
</ul>

<div class="info-box warn">
<div class="box-title">注意事項</div>
CCM 必須在線性域（Linear Domain）中進行運算，即在 Gamma 校正之前。如果在 Gamma 校正後套用 CCM，由於 Gamma 的非線性特性，矩陣乘法會產生錯誤的結果。這是 ISP 新手最常犯的錯誤之一。
</div>

<h3>多光源 CCM 與插值</h3>
<p>不同色溫的光源下，Sensor 的色彩響應不同，因此單一 CCM 無法適用所有場景。實務上，ISP 會針對多個標準光源（如 2856K 的 A 光源、4000K 的 TL84、6500K 的 D65）分別校正 CCM，然後根據 AWB 偵測到的色溫，在這些 CCM 之間做線性插值（Linear Interpolation）。</p>

<pre>
// 雙光源 CCM 插值範例
float alpha = (current_CT - CT_A) / (CT_D65 - CT_A);
alpha = clamp(alpha, 0.0, 1.0);
CCM_final = (1 - alpha) * CCM_A + alpha * CCM_D65;
</pre>

<h3>CCM 的 Trade-off：色彩準確性 vs. 噪聲放大</h3>
<p>CCM 的一個重要 trade-off 是色彩準確性與噪聲放大之間的平衡。激進的 CCM（非對角線元素較大）可以提高色彩準確性，但也會放大噪聲。這是因為矩陣運算會將各通道的噪聲混合。噪聲放大因子可以用矩陣的 Frobenius 範數（Frobenius Norm）來衡量。</p>

<div class="info-box example">
<div class="box-title">設計範例</div>
在低光場景中，ISP 可以降低 CCM 的強度（使矩陣更接近單位矩陣），以減少噪聲放大。公式為：<code>CCM_adjusted = alpha * CCM + (1 - alpha) * I</code>，其中 alpha 根據 ISO/Gain 動態調整，I 為單位矩陣。這種做法犧牲了部分色彩準確性，但改善了整體畫質。
</div>

<p>進階的 ISP 設計中，有時會使用 3×4 矩陣（增加 offset 項）或者在對數域（Log Domain）中做色彩校正。某些高階平台甚至支援分區 CCM（Regional CCM），針對畫面不同區域使用不同的 CCM，以補償鏡頭邊緣的色彩偏差。</p>
`,
      keyPoints: [
        "CCM 使用 3×3 矩陣將 Sensor RGB 轉換到標準色彩空間",
        "CCM 必須在線性域（Gamma 校正前）進行運算",
        "使用 Macbeth 色卡和最小二乘法求解最佳 CCM",
        "多光源場景需針對不同色溫校正多組 CCM，並根據色溫插值",
        "CCM 強度越大，色彩準確性越高，但噪聲放大也越嚴重"
      ]
    },
    {
      id: "ch4_3",
      title: "White Balance 與 Color Temperature",
      content: `
<h3>White Balance 的目的</h3>
<p>White Balance（WB，白平衡）的目標是消除場景光源色溫對影像色彩的影響，使白色物體在最終影像中呈現為真正的白色（即 R=G=B）。人眼具有色彩恆常性（Chromatic Constancy），能夠在不同光源下自動適應，讓白紙看起來始終是白的。但 Camera Sensor 沒有這種能力，必須通過演算法來補償。</p>

<p>色溫（Color Temperature）以 Kelvin（K）為單位，描述光源的色彩特性。低色溫（如 2700K 的鎢絲燈）偏暖橘色，高色溫（如 7500K 的陰天）偏冷藍色。標準日光 D65 約為 6500K。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Planckian Locus 與 White Balance 增益</text>
  <!-- CIE diagram outline -->
  <g transform="translate(30,50)">
    <text x="140" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">CIE xy 色度圖上的 Planckian Locus</text>
    <path d="M40,280 Q10,180 30,110 Q50,40 100,15 Q160,-5 190,20 Q230,50 240,85 Q250,130 240,185 Q230,230 210,260 L40,280 Z" fill="rgba(106,138,122,0.06)" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Planckian locus curve -->
    <path d="M165,240 Q170,210 160,175 Q145,135 125,110 Q105,90 85,80 Q70,75 60,78" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
    <!-- Color temp points -->
    <circle cx="165" cy="240" r="5" fill="#c4a064"/>
    <text x="175" y="248" font-size="9" fill="#c4a064" font-weight="500">2000K</text>
    <circle cx="168" cy="215" r="5" fill="#c4a064"/>
    <text x="178" y="220" font-size="9" fill="#c4a064">2856K (A)</text>
    <circle cx="160" cy="175" r="5" fill="#c4a064"/>
    <text x="170" y="178" font-size="9" fill="#8a8580">4000K (TL84)</text>
    <circle cx="130" cy="118" r="5" fill="#6a8a7a"/>
    <text x="140" y="115" font-size="9" fill="#6a8a7a" font-weight="500">6500K (D65)</text>
    <circle cx="85" cy="80" r="5" fill="#648cb4"/>
    <text x="45" y="72" font-size="9" fill="#648cb4">10000K</text>
    <!-- Axes -->
    <line x1="5" y1="295" x2="260" y2="295" stroke="#d5cec7" stroke-width="1"/>
    <line x1="5" y1="295" x2="5" y2="5" stroke="#d5cec7" stroke-width="1"/>
    <text x="130" y="320" text-anchor="middle" font-size="10" fill="#8a8580">x</text>
    <text x="-5" y="150" text-anchor="middle" font-size="10" fill="#8a8580">y</text>
  </g>
  <!-- WB Gain illustration -->
  <g transform="translate(370,50)">
    <text x="140" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">WB Gain 校正原理</text>
    <!-- Before WB -->
    <rect x="10" y="30" width="100" height="90" rx="6" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="60" y="55" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">校正前</text>
    <rect x="20" y="65" width="25" height="40" rx="2" fill="#c44040" opacity="0.5"/>
    <text x="32" y="110" text-anchor="middle" font-size="8" fill="#8a8580">R=0.6</text>
    <rect x="50" y="45" width="25" height="60" rx="2" fill="#40a040" opacity="0.5"/>
    <text x="62" y="110" text-anchor="middle" font-size="8" fill="#8a8580">G=1.0</text>
    <rect x="80" y="55" width="25" height="50" rx="2" fill="#4040c0" opacity="0.5"/>
    <text x="92" y="110" text-anchor="middle" font-size="8" fill="#8a8580">B=0.8</text>
    <!-- Arrow -->
    <text x="130" y="80" text-anchor="middle" font-size="16" fill="#6a8a7a">→</text>
    <text x="130" y="95" text-anchor="middle" font-size="8" fill="#6a8a7a">WB Gain</text>
    <!-- Gain values -->
    <rect x="148" y="30" width="70" height="90" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="4,2"/>
    <text x="183" y="55" text-anchor="middle" font-size="9" fill="#6a8a7a">R×1.67</text>
    <text x="183" y="75" text-anchor="middle" font-size="9" fill="#6a8a7a">G×1.00</text>
    <text x="183" y="95" text-anchor="middle" font-size="9" fill="#6a8a7a">B×1.25</text>
    <!-- Arrow -->
    <text x="235" y="80" text-anchor="middle" font-size="16" fill="#6a8a7a">→</text>
    <!-- After WB -->
    <rect x="250" y="30" width="80" height="90" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="290" y="55" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">校正後</text>
    <rect x="255" y="45" width="25" height="60" rx="2" fill="#c44040" opacity="0.5"/>
    <text x="267" y="110" text-anchor="middle" font-size="8" fill="#8a8580">R=1.0</text>
    <rect x="280" y="45" width="25" height="60" rx="2" fill="#40a040" opacity="0.5"/>
    <text x="292" y="110" text-anchor="middle" font-size="8" fill="#8a8580">G=1.0</text>
    <rect x="305" y="45" width="25" height="60" rx="2" fill="#4040c0" opacity="0.5"/>
    <text x="317" y="110" text-anchor="middle" font-size="8" fill="#8a8580">B=1.0</text>
    <!-- Color temp bar -->
    <text x="140" y="160" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">色溫光譜</text>
    <defs>
      <linearGradient id="ctGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#e8a050"/>
        <stop offset="40%" style="stop-color:#f5f0eb"/>
        <stop offset="100%" style="stop-color:#8090c0"/>
      </linearGradient>
    </defs>
    <rect x="10" y="175" width="280" height="24" rx="12" fill="url(#ctGrad)" stroke="#d5cec7" stroke-width="1"/>
    <text x="20" y="215" font-size="9" fill="#c4a064">2000K 暖色</text>
    <text x="125" y="215" font-size="9" fill="#8a8580" text-anchor="middle">5500K</text>
    <text x="260" y="215" font-size="9" fill="#648cb4" text-anchor="end">10000K 冷色</text>
  </g>
</svg><div class="caption">圖 4-3：CIE 色度圖上的 Planckian Locus 與 WB Gain 校正示意</div></div>

<h3>AWB 演算法</h3>
<p>Auto White Balance（AWB）是 ISP 中最具挑戰性的演算法之一，因為它需要在沒有先驗知識的情況下估計場景光源的色溫。常見的 AWB 演算法包括：</p>

<h4>1. Gray World 假設</h4>
<p>假設場景中所有顏色的平均值應為灰色（即 R、G、B 平均值相等）。增益計算為：</p>
<div class="formula">Gain_R = Avg_G / Avg_R，Gain_B = Avg_G / Avg_B</div>
<p>這種方法簡單但在色彩分佈不均勻的場景（如大面積綠色草地）中會失敗。</p>

<h4>2. White Patch 假設</h4>
<p>假設場景中最亮的點是白色的，以最大值來計算增益。對高光飽和的場景效果不佳。</p>

<h4>3. 統計法 AWB</h4>
<p>在 R/G vs. B/G 的色度平面上，統計像素分佈，用預定義的「合法白色區域」（White Zone）來篩選可能是白色的像素，再計算增益。這是目前手機 ISP 中最常用的方法。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
現代 AWB 演算法通常結合多種策略：場景偵測（Scene Detection）、色溫估計（CT Estimation）、機器學習（如 CNN 預測色溫）。高階手機 ISP 甚至利用 Multi-frame 資訊和 Face Detection 結果來優化 AWB——當偵測到人臉時，會優先確保膚色的準確性。
</div>

<h3>WB Gain 的實作</h3>
<p>White Balance 在 ISP 中的實作非常簡單，就是對每個像素的 R、G、B 通道分別乘以增益值。通常 G 通道作為參考（Gain=1.0），R 和 B 通道根據色溫調整。在 Bayer 域處理時，需要注意 CFA Pattern 中 Gr 和 Gb 可能有不同的增益。</p>

<pre>
// WB Gain 基本實作
void apply_wb_gain(uint16_t* raw, int width, int height,
                   float gain_r, float gain_gr, float gain_gb, float gain_b) {
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            float gain;
            if (y%2==0 && x%2==0) gain = gain_r;
            else if (y%2==0 && x%2==1) gain = gain_gr;
            else if (y%2==1 && x%2==0) gain = gain_gb;
            else gain = gain_b;
            raw[y*width+x] = clamp(raw[y*width+x] * gain, 0, 4095);
        }
    }
}
</pre>

<div class="info-box warn">
<div class="box-title">注意事項</div>
WB Gain 應在 BLC（Black Level Correction）之後、Demosaic 之前套用。如果在 BLC 之前套用，黑電平的偏移會被不正確地放大。WB Gain 也必須在 CCM 之前完成，因為 CCM 的校正是以白平衡後的數據為基礎。
</div>

<p>色溫估計的精度直接決定了最終影像的色彩品質。在複雜光源場景（如混合光源、彩色光源）中，AWB 的挑戰尤為巨大，這也是為什麼旗艦手機的 3A（AF、AE、AWB）演算法團隊往往需要投入大量的人力和時間來調試。</p>
`,
      keyPoints: [
        "White Balance 的目標是消除光源色溫對影像色彩的影響",
        "WB 通過對 R/G/B 通道分別乘以增益值來實現",
        "AWB 演算法包括 Gray World、White Patch、統計法等",
        "WB Gain 必須在 BLC 之後、Demosaic 之前、CCM 之前套用",
        "現代 AWB 結合場景偵測、人臉偵測和機器學習提升準確性"
      ]
    },
    {
      id: "ch4_4",
      title: "Gamma Correction",
      content: `
<h3>為什麼需要 Gamma Correction？</h3>
<p>Gamma Correction（伽瑪校正）是 ISP 中連接線性物理世界與非線性人眼感知的關鍵環節。Camera Sensor 的響應是線性的——雙倍的光子數量產生雙倍的電壓。但人眼的亮度感知遵循近似對數的關係——對暗部的變化更為敏感，對亮部的變化則相對遲鈍。這就是 Weber-Fechner 定律（Weber-Fechner Law）的核心。</p>

<p>如果將線性的 Sensor 數據直接顯示，影像會看起來非常暗，因為大量的 Code 被分配給了人眼不太敏感的亮部區域。Gamma Correction 通過非線性轉換，重新分配 Code，使暗部獲得更多的量化級別，讓影像看起來更符合人眼感知。</p>

<div class="diagram"><svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="380" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Gamma 曲線比較：Linear vs sRGB vs Power 2.2</text>
  <!-- Axes -->
  <g transform="translate(80,50)">
    <line x1="0" y1="280" x2="540" y2="280" stroke="#d5cec7" stroke-width="1.5"/>
    <line x1="0" y1="280" x2="0" y2="0" stroke="#d5cec7" stroke-width="1.5"/>
    <text x="270" y="310" text-anchor="middle" font-size="11" fill="#8a8580">Input (Linear)</text>
    <text x="-15" y="140" text-anchor="middle" font-size="11" fill="#8a8580" transform="rotate(-90,-15,140)">Output</text>
    <!-- Grid -->
    <line x1="0" y1="0" x2="540" y2="0" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="70" x2="540" y2="70" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="140" x2="540" y2="140" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="210" x2="540" y2="210" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="135" y1="0" x2="135" y2="280" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="270" y1="0" x2="270" y2="280" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="405" y1="0" x2="405" y2="280" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3,3"/>
    <!-- Scale labels -->
    <text x="-10" y="284" font-size="9" fill="#8a8580">0</text>
    <text x="-15" y="4" font-size="9" fill="#8a8580">1.0</text>
    <text x="535" y="296" font-size="9" fill="#8a8580">1.0</text>
    <text x="130" y="296" font-size="9" fill="#8a8580">0.25</text>
    <text x="265" y="296" font-size="9" fill="#8a8580">0.50</text>
    <text x="400" y="296" font-size="9" fill="#8a8580">0.75</text>
    <!-- Linear (y=x) -->
    <line x1="0" y1="280" x2="540" y2="0" stroke="#d5cec7" stroke-width="2"/>
    <text x="455" y="50" font-size="11" fill="#d5cec7" font-weight="500">Linear (γ=1.0)</text>
    <!-- Gamma 2.2 encoding (y = x^(1/2.2)) -->
    <path d="M0,280 Q30,180 60,145 Q120,80 180,48 Q270,15 360,5 Q450,-2 540,0" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
    <text x="115" y="40" font-size="11" fill="#6a8a7a" font-weight="500">γ = 1/2.2 (Encoding)</text>
    <!-- sRGB (similar but with linear segment at dark end) -->
    <path d="M0,280 L17,255 Q35,200 60,150 Q120,82 180,50 Q270,16 360,5 Q450,-1 540,0" fill="none" stroke="#648cb4" stroke-width="2" stroke-dasharray="8,4"/>
    <text x="130" y="78" font-size="11" fill="#648cb4" font-weight="500">sRGB Curve</text>
    <!-- Gamma 2.2 decoding (y = x^2.2) -->
    <path d="M0,280 Q90,275 180,258 Q270,225 360,165 Q450,80 540,0" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="380" y="200" font-size="11" fill="#c4a064" font-weight="500">γ = 2.2 (Display)</text>
    <!-- Annotation arrow showing dark region boost -->
    <path d="M50,260 L50,160" fill="none" stroke="#6a8a7a" stroke-width="1" marker-end="url(#arrow4g)"/>
    <text x="70" y="210" font-size="9" fill="#6a8a7a">暗部提升</text>
  </g>
  <defs><marker id="arrow4g" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 4-4：Gamma 曲線比較 — Linear、sRGB Encoding、Power 2.2 Display Gamma</div></div>

<h3>Gamma 的數學表示</h3>
<p>簡單的 Power-law Gamma 公式為：</p>
<div class="formula">V_out = V_in<sup>γ</sup></div>
<p>其中 γ < 1 為 Encoding Gamma（壓縮），γ > 1 為 Display Gamma（展開）。典型的工作流程是：</p>
<ul>
<li>Camera 端：線性數據經 Encoding Gamma (γ ≈ 1/2.2 ≈ 0.4545) 壓縮</li>
<li>Display 端：經 Display Gamma (γ ≈ 2.2) 展開回線性</li>
<li>End-to-end：兩者相乘，系統 Gamma ≈ 1.0，實現線性還原</li>
</ul>

<h3>sRGB Transfer Function</h3>
<p>sRGB 的轉換函數並不是簡單的 Power Gamma，而是分段函數：</p>
<div class="formula">
V_out = 12.92 × V_in, 當 V_in ≤ 0.0031308<br>
V_out = 1.055 × V_in<sup>1/2.4</sup> - 0.055, 當 V_in > 0.0031308
</div>
<p>低值區域使用線性段（Slope = 12.92），避免了純冪函數在零點附近的無限斜率問題。這個設計使 sRGB 在暗部有更好的量化行為。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
ISP 中的 Gamma Correction 通常不使用數學公式計算（計算冪函數在硬體中代價較高），而是使用 1D LUT（Look-Up Table）來實現。一張 256 或 1024 個 entry 的查表，搭配線性插值，就能高效地實現任意 Gamma 曲線，並且可以在此基礎上疊加 Tone Mapping 的效果。
</div>

<h3>ISP 中 Gamma 的位置與影響</h3>
<p>Gamma Correction 在 ISP Pipeline 中的位置非常關鍵。它必須在 CCM 之後，因為 CCM 需要在線性域工作。同時，Gamma 之後的所有處理（如銳化、色彩飽和度調整）都是在非線性域進行的，這會影響演算法的設計。</p>

<p>在 8-bit 的系統中，Gamma 編碼後暗部區域（0-0.01 的線性值）會被映射到大約 0-26 的 Code（佔總範圍的 10%），而同樣的範圍在線性編碼中只有 0-2.5 的 Code（不到 1%）。這就是 Gamma 對暗部量化的改善效果。</p>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在調試 ISP 時，如果發現影像的暗部出現色帶（Banding）或量化噪聲，通常不是 Gamma 曲線本身的問題，而是 Gamma 之前的處理（如降噪、CCM）引入了過多的量化誤差。因為 Gamma 會放大暗部，任何在暗部的小誤差都會被明顯放大。
</div>

<h3>進階 Gamma 設計</h3>
<p>現代 ISP 中，Gamma Curve 往往不是固定的 Power 2.2 或 sRGB 曲線，而是可以根據場景動態調整的自訂曲線。例如：夜景模式下，Gamma 曲線會更積極地提亮暗部；高對比場景下，Gamma 曲線會壓縮高光以保留更多細節。這種動態 Gamma 實際上已經跨入了 Tone Mapping 的範疇，將在後續章節深入討論。</p>
`,
      keyPoints: [
        "Gamma Correction 連接線性物理世界與非線性人眼感知",
        "Encoding Gamma (γ≈1/2.2) 壓縮動態範圍，Display Gamma (γ≈2.2) 還原",
        "sRGB 使用分段函數，低值區域為線性段避免量化問題",
        "ISP 中 Gamma 通常用 1D LUT 實現，而非直接計算冪函數",
        "Gamma 放大暗部，前級處理的量化誤差會被明顯放大"
      ]
    },
    {
      id: "ch4_5",
      title: "Color Saturation 與 Hue Adjustment",
      content: `
<h3>飽和度與色相的概念</h3>
<p>Color Saturation（色彩飽和度）描述顏色的鮮豔程度——從灰色（完全不飽和）到純色（完全飽和）。Hue（色相）則是色彩的基本屬性，描述顏色在色輪上的位置，如紅、黃、綠、青、藍、洋紅。在 ISP 中，飽和度和色相調整是影像風格化（Image Style）的核心工具。</p>

<p>HSV（Hue-Saturation-Value）色彩模型將色彩分解為三個直覺的維度。Hue 以角度表示（0°-360°），Saturation 以百分比表示（0%-100%），Value 表示亮度（0%-100%）。這個模型特別適合做選擇性的色彩調整，因為可以獨立操控每個維度。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">HSV 色彩模型與飽和度調整</text>
  <!-- HSV Cylinder -->
  <g transform="translate(50,50)">
    <text x="120" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">HSV Cylinder</text>
    <!-- Cylinder body -->
    <ellipse cx="120" cy="290" rx="100" ry="25" fill="none" stroke="#5a5550" stroke-width="1.5"/>
    <line x1="20" y1="290" x2="20" y2="60" stroke="#5a5550" stroke-width="1.5"/>
    <line x1="220" y1="290" x2="220" y2="60" stroke="#5a5550" stroke-width="1.5"/>
    <ellipse cx="120" cy="60" rx="100" ry="25" fill="rgba(106,138,122,0.08)" stroke="#5a5550" stroke-width="1.5"/>
    <!-- Hue circle on top -->
    <circle cx="120" cy="60" r="0" fill="none"/>
    <!-- Color segments on top ellipse -->
    <path d="M220,60 A100,25 0 0,1 120,85" fill="none" stroke="#c44040" stroke-width="3"/>
    <path d="M120,85 A100,25 0 0,1 20,60" fill="none" stroke="#40a040" stroke-width="3"/>
    <path d="M20,60 A100,25 0 0,1 120,35" fill="none" stroke="#4040c0" stroke-width="3"/>
    <path d="M120,35 A100,25 0 0,1 220,60" fill="none" stroke="#c0c040" stroke-width="3"/>
    <!-- Labels -->
    <text x="230" y="65" font-size="9" fill="#c44040">0° Red</text>
    <text x="105" y="100" font-size="9" fill="#40a040">120° Green</text>
    <text x="105" y="28" font-size="9" fill="#4040c0">240° Blue</text>
    <!-- V axis -->
    <line x1="120" y1="290" x2="120" y2="60" stroke="#8a8580" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="132" y="180" font-size="10" fill="#8a8580">V (Value)</text>
    <!-- S arrow -->
    <line x1="120" y1="60" x2="210" y2="60" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4s)"/>
    <text x="170" y="52" font-size="10" fill="#6a8a7a">S (Saturation)</text>
    <!-- H arrow -->
    <path d="M180,45 A65,18 0 0,1 150,33" fill="none" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arrow4s)"/>
    <text x="175" y="30" font-size="10" fill="#c4a064">H (Hue)</text>
    <!-- Bottom label: black -->
    <text x="120" y="325" text-anchor="middle" font-size="9" fill="#8a8580">V=0 (Black)</text>
  </g>
  <!-- Saturation adjustment -->
  <g transform="translate(370,55)">
    <text x="140" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Saturation 調整效果</text>
    <!-- Low sat -->
    <rect x="10" y="30" width="80" height="60" rx="6" fill="#b0a8a0" stroke="#d5cec7" stroke-width="1"/>
    <text x="50" y="108" text-anchor="middle" font-size="9" fill="#8a8580">Sat = 0.3</text>
    <text x="50" y="120" text-anchor="middle" font-size="8" fill="#8a8580">（低飽和）</text>
    <!-- Normal sat -->
    <rect x="110" y="30" width="80" height="60" rx="6" fill="#7a9a6a" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="150" y="108" text-anchor="middle" font-size="9" fill="#6a8a7a">Sat = 1.0</text>
    <text x="150" y="120" text-anchor="middle" font-size="8" fill="#6a8a7a">（原始）</text>
    <!-- High sat -->
    <rect x="210" y="30" width="80" height="60" rx="6" fill="#40a030" stroke="#40a030" stroke-width="1"/>
    <text x="250" y="108" text-anchor="middle" font-size="9" fill="#40a030">Sat = 1.8</text>
    <text x="250" y="120" text-anchor="middle" font-size="8" fill="#40a030">（高飽和）</text>
    <!-- Hue shift diagram -->
    <text x="140" y="160" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Hue Rotation 色相偏移</text>
    <!-- Color wheel simplified -->
    <circle cx="140" cy="240" r="60" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Hue sectors -->
    <line x1="200" y1="240" x2="140" y2="240" stroke="#c44040" stroke-width="2"/>
    <line x1="140" y1="240" x2="110" y2="188" stroke="#40a040" stroke-width="2"/>
    <line x1="140" y1="240" x2="110" y2="292" stroke="#4040c0" stroke-width="2"/>
    <!-- Rotation arrow -->
    <path d="M195,218 A55,55 0 0,1 170,190" fill="none" stroke="#c4a064" stroke-width="2" marker-end="url(#arrow4s)"/>
    <text x="205" y="200" font-size="9" fill="#c4a064">+30°</text>
    <circle cx="140" cy="240" r="3" fill="#5a5550"/>
  </g>
  <defs><marker id="arrow4s" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 4-5：HSV 圓柱體色彩模型、飽和度調整效果與色相旋轉示意</div></div>

<h3>飽和度調整的數學方法</h3>
<p>在 ISP 中，飽和度調整通常有以下幾種實現方式：</p>

<h4>方法一：RGB 域直接調整</h4>
<p>最簡單的做法是將像素值與灰度值做加權混合：</p>
<div class="formula">R_out = Gray + sat_factor × (R_in - Gray)<br>其中 Gray = 0.299R + 0.587G + 0.114B</div>
<p>當 <code>sat_factor > 1</code> 為增加飽和度，<code>sat_factor < 1</code> 為降低飽和度，<code>sat_factor = 0</code> 時影像變為灰階。</p>

<h4>方法二：HSV 域調整</h4>
<p>將 RGB 轉換到 HSV，直接調整 S 通道，再轉回 RGB。這種方法更直覺，但 RGB↔HSV 的轉換計算量較大。</p>

<h4>方法三：3×3 Saturation Matrix</h4>
<p>利用矩陣運算來實現飽和度調整，這在硬體 ISP 中更為常見，因為可以與 CCM 矩陣合併為一個運算步驟：</p>

<pre>
// Saturation Matrix: S 為飽和度係數
// Luminance weights: Wr=0.299, Wg=0.587, Wb=0.114
float a = (1-S)*Wr + S;   float b = (1-S)*Wr;       float c = (1-S)*Wr;
float d = (1-S)*Wg;       float e = (1-S)*Wg + S;   float f = (1-S)*Wg;
float g = (1-S)*Wb;       float h = (1-S)*Wb;       float i = (1-S)*Wb + S;
// 矩陣 [a b c; d e f; g h i] × [R G B]^T
</pre>

<h3>選擇性色彩調整</h3>
<p>進階的 ISP 提供選擇性色彩調整（Selective Color Adjustment）功能，可以針對特定色相範圍獨立調整飽和度和色相。例如：</p>
<ul>
<li>增加天空的藍色飽和度，讓天空更鮮豔</li>
<li>微調膚色的色相，避免偏黃或偏紅</li>
<li>降低綠色的飽和度，營造電影感</li>
</ul>

<div class="info-box example">
<div class="box-title">設計範例</div>
Qualcomm Spectra ISP 提供 12 個色相分區的獨立調整。每個分區可以單獨設定 Hue Offset、Saturation Gain 和 Brightness Offset。分區之間使用平滑過渡（Smooth Blending），避免色彩邊界出現硬切痕跡。這種設計讓手機廠商可以定制獨特的色彩風格。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
過度增加飽和度會導致 Clipping（色彩溢出），特別是已經很鮮豔的顏色（如紅色花朵、霓虹燈）。Clipping 會造成色彩失真和細節損失。因此，好的飽和度演算法應該包含 Soft Clipping 機制，在接近飽和邊界時自動減緩增益。
</div>
`,
      keyPoints: [
        "HSV 模型將色彩分為 Hue（色相）、Saturation（飽和度）、Value（明度）三個維度",
        "飽和度調整可在 RGB 域用加權混合、HSV 域直接調整、或 3×3 矩陣實現",
        "3×3 Saturation Matrix 可與 CCM 合併，適合硬體 ISP 實作",
        "選擇性色彩調整可針對特定色相範圍獨立調整，用於打造獨特影像風格",
        "過度增加飽和度會導致 Clipping，需搭配 Soft Clipping 機制"
      ]
    },
    {
      id: "ch4_6",
      title: "Color Gamut 色域",
      content: `
<h3>什麼是 Color Gamut？</h3>
<p>Color Gamut（色域）是指一個裝置或色彩空間能夠表示（或重現）的顏色範圍。在 CIE xy 色度圖上，色域表現為一個三角形，三個頂點對應 R、G、B 三個基底色（Primary Colors）。三角形面積越大，表示能表示的顏色越多。色域的選擇和管理是 ISP 色彩處理中不可忽略的環節。</p>

<p>不同的顯示裝置和標準定義了不同的色域。從最小的 sRGB 到最大的 BT.2020，每個色域標準都有其目標應用場景。理解它們的差異和轉換關係，對於確保影像在不同裝置上呈現一致的色彩至關重要。</p>

<div class="diagram"><svg viewBox="0 0 700 450" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="450" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">主要色域比較：sRGB vs Display P3 vs BT.2020</text>
  <g transform="translate(130,50)">
    <!-- CIE outline -->
    <path d="M60,340 Q15,230 35,155 Q60,70 130,30 Q200,-5 240,30 Q285,70 300,120 Q310,175 300,235 Q290,290 265,325 L60,340 Z" fill="rgba(106,138,122,0.04)" stroke="#d5cec7" stroke-width="1.5"/>
    <!-- Axes -->
    <line x1="0" y1="360" x2="380" y2="360" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="360" x2="0" y2="0" stroke="#d5cec7" stroke-width="1"/>
    <text x="190" y="390" text-anchor="middle" font-size="11" fill="#8a8580">x</text>
    <text x="-12" y="180" text-anchor="middle" font-size="11" fill="#8a8580">y</text>
    <!-- Tick marks -->
    <text x="-8" y="364" font-size="8" fill="#8a8580">0</text>
    <text x="363" y="375" font-size="8" fill="#8a8580">0.8</text>
    <text x="-16" y="10" font-size="8" fill="#8a8580">0.9</text>
    <!-- BT.2020 triangle -->
    <polygon points="80,345 145,28 340,260" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="345" y="258" font-size="9" fill="#c4a064" font-weight="500">BT.2020</text>
    <!-- Display P3 triangle -->
    <polygon points="98,310 148,55 290,245" fill="rgba(100,140,180,0.06)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="295" y="242" font-size="9" fill="#648cb4" font-weight="500">Display P3</text>
    <!-- sRGB triangle -->
    <polygon points="110,300 148,80 265,255" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="270" y="252" font-size="9" fill="#6a8a7a" font-weight="500">sRGB</text>
    <!-- White point D65 -->
    <circle cx="170" cy="210" r="4" fill="#5a5550"/>
    <text x="180" y="208" font-size="9" fill="#5a5550">D65</text>
    <!-- Primary labels for sRGB -->
    <circle cx="110" cy="300" r="3" fill="#c44040"/>
    <text x="85" y="313" font-size="8" fill="#c44040">R</text>
    <circle cx="148" cy="80" r="3" fill="#40a040"/>
    <text x="155" y="75" font-size="8" fill="#40a040">G</text>
    <circle cx="265" cy="255" r="3" fill="#4040c0"/>
    <text x="255" y="270" font-size="8" fill="#4040c0">B</text>
    <!-- Spectral wavelength labels -->
    <text x="40" y="153" font-size="8" fill="#8a8580">520nm</text>
    <text x="195" y="22" font-size="8" fill="#8a8580">520nm</text>
    <text x="310" y="128" font-size="8" fill="#8a8580">480nm</text>
    <text x="50" y="345" font-size="8" fill="#8a8580">700nm</text>
    <text x="265" y="340" font-size="8" fill="#8a8580">380nm</text>
  </g>
  <!-- Legend -->
  <g transform="translate(520,80)">
    <text x="0" y="0" font-size="11" fill="#5a5550" font-weight="500">Coverage (CIE 1931)</text>
    <line x1="0" y1="25" x2="15" y2="25" stroke="#6a8a7a" stroke-width="2"/>
    <text x="22" y="29" font-size="10" fill="#6a8a7a">sRGB: 35.9%</text>
    <line x1="0" y1="50" x2="15" y2="50" stroke="#648cb4" stroke-width="2"/>
    <text x="22" y="54" font-size="10" fill="#648cb4">P3: 45.5%</text>
    <line x1="0" y1="75" x2="15" y2="75" stroke="#c4a064" stroke-width="2"/>
    <text x="22" y="79" font-size="10" fill="#c4a064">BT.2020: 75.8%</text>
  </g>
</svg><div class="caption">圖 4-6：CIE 1931 色度圖上 sRGB、Display P3、BT.2020 三種色域的比較</div></div>

<h3>主要色域標準比較</h3>
<table>
<tr><th>標準</th><th>White Point</th><th>CIE 覆蓋率</th><th>典型應用</th></tr>
<tr><td>sRGB</td><td>D65</td><td>35.9%</td><td>網頁、一般消費電子</td></tr>
<tr><td>Adobe RGB</td><td>D65</td><td>52.1%</td><td>專業攝影、印刷</td></tr>
<tr><td>DCI-P3</td><td>D63（綠色調）</td><td>45.5%</td><td>電影院投影</td></tr>
<tr><td>Display P3</td><td>D65</td><td>45.5%</td><td>Apple 裝置、HDR 內容</td></tr>
<tr><td>BT.2020</td><td>D65</td><td>75.8%</td><td>4K/8K HDR 視訊</td></tr>
</table>

<h3>色域轉換與 Gamut Mapping</h3>
<p>當影像的色域大於顯示裝置的色域時，需要進行 Gamut Mapping（色域映射），將超出色域的顏色映射到可顯示的範圍內。常見的策略包括：</p>
<ul>
<li><strong>Clipping</strong>：直接截斷超出色域的值。簡單但會損失漸層</li>
<li><strong>Perceptual Mapping</strong>：等比例壓縮整個色域，保持相對關係</li>
<li><strong>Relative Colorimetric</strong>：只壓縮超出部分，保留色域內的準確性</li>
<li><strong>Saturation Mapping</strong>：優先保持飽和度，適合商業圖表</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
在手機 ISP 中，Sensor 原生的色域通常比 sRGB 更大（因為色彩濾光片的光譜響應較寬）。CCM 的作用之一就是將 Sensor 色域映射到目標色域。如果目標是 Display P3 或 BT.2020，CCM 的設計會有所不同，需要保留更多的色域範圍。現代旗艦手機通常會同時輸出 sRGB 和 P3 版本的影像。
</div>

<h3>Wide Color Gamut 與 HDR 的關係</h3>
<p>Wide Color Gamut（WCG，廣色域）與 HDR 是密不可分的。HDR10 標準要求使用 BT.2020 色域（雖然實際內容通常只覆蓋 P3 範圍），搭配 PQ（Perceptual Quantizer）或 HLG 傳輸函數。</p>

<p>對 ISP 而言，支援 WCG 意味著整個 Pipeline 需要更高的 Bit Depth（10-bit 或 12-bit）來避免量化問題，因為更大的色域在相同 Bit Depth 下，每個 Code 代表更大的色差跨度。</p>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在開發支援 P3 色域的 ISP 時，一個常見的問題是「色域元數據（Gamut Metadata）的正確設定」。即使影像數據本身是 P3，如果 EXIF 或 ICC Profile 標記為 sRGB，顯示裝置就會誤解色域，導致顏色偏淡。確保 Pipeline 端到端的色域元數據一致性是品質保證的關鍵。
</div>
`,
      keyPoints: [
        "Color Gamut 是裝置或色彩空間能表示的顏色範圍，在 CIE 圖上為三角形",
        "sRGB 覆蓋 35.9%、P3 覆蓋 45.5%、BT.2020 覆蓋 75.8% 的 CIE 色域",
        "Gamut Mapping 策略包括 Clipping、Perceptual、Relative Colorimetric 等",
        "WCG 需搭配更高 Bit Depth（10-bit+）避免量化問題",
        "色域元數據（ICC Profile / EXIF）的正確設定是端到端品質的關鍵"
      ]
    },
    {
      id: "ch4_7",
      title: "3D LUT 與 1D LUT",
      content: `
<h3>Look-Up Table 在 ISP 中的角色</h3>
<p>Look-Up Table（LUT，查找表）是 ISP 中最靈活且高效的色彩處理工具。LUT 的基本概念很簡單：預先計算好輸入到輸出的映射關係，存成表格，執行時只需查表而無需即時運算。根據維度的不同，LUT 分為 1D LUT 和 3D LUT 兩種，各有其適用場景。</p>

<div class="diagram"><svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="380" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">1D LUT vs 3D LUT 結構比較</text>
  <!-- 1D LUT -->
  <g transform="translate(30,55)">
    <text x="140" y="0" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">1D LUT</text>
    <text x="140" y="18" text-anchor="middle" font-size="9" fill="#8a8580">每通道獨立映射</text>
    <!-- Curve -->
    <rect x="20" y="40" width="240" height="160" rx="4" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
    <path d="M20,200 Q60,195 100,170 Q140,130 180,80 Q220,50 260,40" fill="none" stroke="#c44040" stroke-width="2"/>
    <path d="M20,200 Q70,190 110,160 Q150,120 190,75 Q230,45 260,40" fill="none" stroke="#40a040" stroke-width="2" stroke-dasharray="6,3"/>
    <path d="M20,200 Q80,185 120,150 Q160,110 200,70 Q240,42 260,40" fill="none" stroke="#4040c0" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="20" y="218" font-size="9" fill="#8a8580">0</text>
    <text x="250" y="218" font-size="9" fill="#8a8580">255</text>
    <text x="8" y="205" font-size="9" fill="#8a8580">0</text>
    <text x="2" y="48" font-size="9" fill="#8a8580">255</text>
    <!-- Table illustration -->
    <rect x="30" y="235" width="220" height="80" rx="4" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="40" y="255" font-size="9" fill="#5a5550" font-family="monospace">Input:  0   1   2  ... 255</text>
    <text x="40" y="272" font-size="9" fill="#c44040" font-family="monospace">R_out:  0   3   7  ... 255</text>
    <text x="40" y="289" font-size="9" fill="#40a040" font-family="monospace">G_out:  0   4   8  ... 255</text>
    <text x="40" y="306" font-size="9" fill="#4040c0" font-family="monospace">B_out:  0   5   9  ... 255</text>
  </g>
  <!-- 3D LUT -->
  <g transform="translate(370,55)">
    <text x="140" y="0" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">3D LUT</text>
    <text x="140" y="18" text-anchor="middle" font-size="9" fill="#8a8580">RGB 三通道交互映射</text>
    <!-- 3D Grid cube -->
    <g transform="translate(40,40)">
      <!-- Back face grid -->
      <rect x="40" y="20" width="120" height="120" fill="none" stroke="#d5cec7" stroke-width="1"/>
      <line x1="70" y1="20" x2="70" y2="140" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="100" y1="20" x2="100" y2="140" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="130" y1="20" x2="130" y2="140" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="40" y1="50" x2="160" y2="50" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="40" y1="80" x2="160" y2="80" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="40" y1="110" x2="160" y2="110" stroke="#d5cec7" stroke-width="0.5"/>
      <!-- Top face -->
      <polygon points="40,20 80,-5 200,-5 160,20" fill="none" stroke="#d5cec7" stroke-width="1"/>
      <!-- Right face -->
      <polygon points="160,20 200,-5 200,115 160,140" fill="none" stroke="#d5cec7" stroke-width="1"/>
      <!-- Grid points (some highlighted) -->
      <circle cx="70" cy="50" r="3" fill="#6a8a7a" opacity="0.6"/>
      <circle cx="100" cy="80" r="4" fill="#6a8a7a"/>
      <circle cx="130" cy="110" r="3" fill="#6a8a7a" opacity="0.6"/>
      <circle cx="70" cy="110" r="3" fill="#c44040" opacity="0.6"/>
      <circle cx="130" cy="50" r="3" fill="#4040c0" opacity="0.6"/>
      <!-- Axes -->
      <text x="100" y="158" text-anchor="middle" font-size="10" fill="#c44040">R</text>
      <text x="25" y="80" text-anchor="middle" font-size="10" fill="#40a040">G</text>
      <text x="195" y="-10" text-anchor="middle" font-size="10" fill="#4040c0">B</text>
    </g>
    <!-- Interpolation -->
    <rect x="10" y="215" width="260" height="100" rx="4" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="140" y="238" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Trilinear Interpolation</text>
    <text x="25" y="260" font-size="9" fill="#8a8580">Input (R,G,B) → 找到周圍 8 個節點</text>
    <text x="25" y="278" font-size="9" fill="#8a8580">→ 三次線性插值 → Output (R',G',B')</text>
    <text x="25" y="296" font-size="9" fill="#6a8a7a">典型大小：17×17×17 或 33×33×33</text>
  </g>
</svg><div class="caption">圖 4-7：1D LUT 每通道獨立映射 vs 3D LUT 三通道交互映射結構</div></div>

<h3>1D LUT 的特性與應用</h3>
<p>1D LUT 對每個色彩通道獨立進行映射。每個通道需要一張查找表，通常為 256（8-bit）或 1024（10-bit）個 Entry。1D LUT 的主要用途包括：</p>
<ul>
<li><strong>Gamma Correction</strong>：最經典的 1D LUT 應用</li>
<li><strong>Tone Curve</strong>：自訂的亮度調整曲線</li>
<li><strong>Contrast Enhancement</strong>：S 曲線增強對比</li>
<li><strong>De-gamma / Re-gamma</strong>：色彩空間轉換中的 Gamma 移除與重建</li>
</ul>

<p>1D LUT 的限制是無法表達通道間的交互關係。例如，它無法實現「當 R 高且 G 低時，增加 B」這樣的條件映射。</p>

<h3>3D LUT 的強大能力</h3>
<p>3D LUT 將整個 RGB 空間離散化為一個三維網格，每個網格節點儲存一組 (R', G', B') 輸出值。輸入 RGB 值落在網格之間時，通過 Trilinear Interpolation（三線性插值）或 Tetrahedral Interpolation（四面體插值）計算輸出。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
3D LUT 可以表達任意的色彩映射關係，包括色相旋轉、選擇性飽和度調整、交叉通道校正等。理論上，CCM + Gamma + Saturation + Hue Adjust 的所有操作都可以被一張 3D LUT 統一表示。這使得 3D LUT 成為「終極色彩處理工具」。
</div>

<h3>3D LUT 的大小與精度</h3>
<table>
<tr><th>網格大小</th><th>節點數</th><th>記憶體（12-bit RGB）</th><th>精度</th></tr>
<tr><td>9×9×9</td><td>729</td><td>~4.4 KB</td><td>低，色彩漸層可能不平滑</td></tr>
<tr><td>17×17×17</td><td>4,913</td><td>~29.5 KB</td><td>中等，一般 ISP 常用</td></tr>
<tr><td>33×33×33</td><td>35,937</td><td>~216 KB</td><td>高，專業級應用</td></tr>
<tr><td>65×65×65</td><td>274,625</td><td>~1.6 MB</td><td>極高，影片後製</td></tr>
</table>

<h3>插值方法比較</h3>
<p>3D LUT 的插值品質直接影響色彩的平滑度。Trilinear Interpolation 計算簡單，但在某些方向上可能出現不連續。Tetrahedral Interpolation 將立方體分為 6 個四面體，在每個四面體內做重心插值，品質更好但計算量稍大。大多數硬體 ISP 使用 Tetrahedral Interpolation。</p>

<pre>
// Trilinear Interpolation 簡化範例
// 設輸入 (r, g, b) 正規化到 [0, N-1]，N 為網格大小
int r0 = floor(r), g0 = floor(g), b0 = floor(b);
float fr = r - r0, fg = g - g0, fb = b - b0;
// 8 corners
RGB c000 = LUT[r0][g0][b0], c001 = LUT[r0][g0][b0+1], ...;
// Interpolate
RGB result = c000*(1-fr)*(1-fg)*(1-fb) + c001*(1-fr)*(1-fg)*fb + ...;
</pre>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在實際產品開發中，3D LUT 通常由色彩科學家使用專業工具（如 3D LUT Creator、DaVinci Resolve）設計，或從 Macbeth 色卡的校正數據自動生成。ISP 工程師的職責是確保硬體正確載入和插值 LUT 數據，並處理好不同場景下的 LUT 切換（如室內/室外、日間/夜間）。
</div>
`,
      keyPoints: [
        "1D LUT 對每個通道獨立映射，適合 Gamma、Tone Curve 等操作",
        "3D LUT 可表達任意 RGB 映射關係，是終極色彩處理工具",
        "常用 3D LUT 大小為 17×17×17 或 33×33×33",
        "Tetrahedral Interpolation 品質優於 Trilinear，是硬體 ISP 首選",
        "3D LUT 可統一實現 CCM + Gamma + Saturation + Hue 的效果"
      ]
    },
    {
      id: "ch4_8",
      title: "色彩準確性：ΔE Color Accuracy",
      content: `
<h3>為什麼要量化色彩準確性？</h3>
<p>在 ISP 調試中，「色彩好不好看」是主觀的，但「色彩準不準確」是可以客觀量化的。ΔE（Delta E）是量化兩個顏色之間差異的標準指標，代表 Color Difference（色差）。ΔE 的計算基於感知均勻的色彩空間（如 CIELAB），使得數值差異與人眼感知差異成正比。</p>

<p>ISP 色彩調試的核心工作就是最小化 ΔE——讓 Camera 拍攝標準色卡後輸出的顏色盡可能接近真實值。這需要精確的 CCM、正確的 White Balance、適當的 Gamma 曲線共同配合。</p>

<div class="diagram"><svg viewBox="0 0 700 440" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="440" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Macbeth ColorChecker 與 ΔE 視覺化</text>
  <!-- Macbeth chart layout 4x6 -->
  <g transform="translate(30,50)">
    <text x="150" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">X-Rite ColorChecker Classic (24 patches)</text>
    <!-- Row 1 -->
    <rect x="0" y="20" width="48" height="38" rx="3" fill="#735244" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="53" y="20" width="48" height="38" rx="3" fill="#c29682" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="106" y="20" width="48" height="38" rx="3" fill="#627a9d" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="159" y="20" width="48" height="38" rx="3" fill="#576c43" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="212" y="20" width="48" height="38" rx="3" fill="#8580b1" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="265" y="20" width="48" height="38" rx="3" fill="#67bdaa" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Row 2 -->
    <rect x="0" y="63" width="48" height="38" rx="3" fill="#d67e2c" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="53" y="63" width="48" height="38" rx="3" fill="#505ba6" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="106" y="63" width="48" height="38" rx="3" fill="#c15a63" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="159" y="63" width="48" height="38" rx="3" fill="#5e3c6c" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="212" y="63" width="48" height="38" rx="3" fill="#9dbc40" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="265" y="63" width="48" height="38" rx="3" fill="#e0a32e" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Row 3 -->
    <rect x="0" y="106" width="48" height="38" rx="3" fill="#383d96" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="53" y="106" width="48" height="38" rx="3" fill="#469449" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="106" y="106" width="48" height="38" rx="3" fill="#af363c" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="159" y="106" width="48" height="38" rx="3" fill="#e7c71f" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="212" y="106" width="48" height="38" rx="3" fill="#bb5695" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="265" y="106" width="48" height="38" rx="3" fill="#0885a1" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Row 4: Grayscale -->
    <rect x="0" y="149" width="48" height="38" rx="3" fill="#f3f3f2" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="53" y="149" width="48" height="38" rx="3" fill="#c8c8c8" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="106" y="149" width="48" height="38" rx="3" fill="#a0a0a0" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="159" y="149" width="48" height="38" rx="3" fill="#7a7a79" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="212" y="149" width="48" height="38" rx="3" fill="#555555" stroke="#d5cec7" stroke-width="0.5"/>
    <rect x="265" y="149" width="48" height="38" rx="3" fill="#343434" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Labels -->
    <text x="24" y="210" text-anchor="middle" font-size="7" fill="#8a8580">1</text>
    <text x="77" y="210" text-anchor="middle" font-size="7" fill="#8a8580">2</text>
    <text x="130" y="210" text-anchor="middle" font-size="7" fill="#8a8580">3</text>
    <text x="183" y="210" text-anchor="middle" font-size="7" fill="#8a8580">4</text>
    <text x="236" y="210" text-anchor="middle" font-size="7" fill="#8a8580">5</text>
    <text x="289" y="210" text-anchor="middle" font-size="7" fill="#8a8580">6</text>
  </g>
  <!-- Delta E visualization -->
  <g transform="translate(370,50)">
    <text x="150" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">ΔE 數值與感知差異</text>
    <!-- Bar chart -->
    <rect x="0" y="30" width="280" height="25" rx="3" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
    <rect x="0" y="30" width="28" height="25" rx="3" fill="#6a8a7a"/>
    <text x="35" y="47" font-size="9" fill="#5a5550">ΔE &lt; 1: 人眼無法察覺差異</text>

    <rect x="0" y="65" width="280" height="25" rx="3" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
    <rect x="0" y="65" width="56" height="25" rx="3" fill="#6a8a7a" opacity="0.8"/>
    <text x="62" y="82" font-size="9" fill="#5a5550">ΔE 1-2: 仔細觀察可辨別</text>

    <rect x="0" y="100" width="280" height="25" rx="3" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
    <rect x="0" y="100" width="100" height="25" rx="3" fill="#c4a064" opacity="0.7"/>
    <text x="106" y="117" font-size="9" fill="#5a5550">ΔE 2-5: 明顯可見差異</text>

    <rect x="0" y="135" width="280" height="25" rx="3" fill="rgba(196,100,100,0.15)" stroke="#c46464" stroke-width="1"/>
    <rect x="0" y="135" width="180" height="25" rx="3" fill="#c46464" opacity="0.6"/>
    <text x="186" y="152" font-size="9" fill="#5a5550">ΔE 5-10: 顯著差異</text>

    <rect x="0" y="170" width="280" height="25" rx="3" fill="rgba(196,64,64,0.15)" stroke="#c44040" stroke-width="1"/>
    <rect x="0" y="170" width="280" height="25" rx="3" fill="#c44040" opacity="0.4"/>
    <text x="145" y="187" font-size="9" fill="#5a5550">ΔE &gt; 10: 完全不同的顏色</text>
  </g>
  <!-- ΔE formula -->
  <g transform="translate(30,310)">
    <rect x="0" y="0" width="640" height="100" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="320" y="25" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">ΔE 計算公式</text>
    <text x="30" y="50" font-size="11" fill="#5a5550" font-family="serif" font-style="italic">ΔE*ab = sqrt( (L*₁-L*₂)² + (a*₁-a*₂)² + (b*₁-b*₂)² )</text>
    <text x="30" y="75" font-size="10" fill="#8a8580">CIEDE2000 (ΔE00) 加入了亮度、色度、色相的加權因子，更貼近人眼感知</text>
    <text x="30" y="92" font-size="10" fill="#6a8a7a">業界標準：Mean ΔE00 &lt; 2.0 為優秀，&lt; 4.0 為可接受</text>
  </g>
</svg><div class="caption">圖 4-8：Macbeth ColorChecker 24 色卡佈局與 ΔE 數值對應的感知差異</div></div>

<h3>ΔE 的演進</h3>
<p>ΔE 的計算方法經歷了多次改良：</p>
<table>
<tr><th>版本</th><th>年份</th><th>特性</th></tr>
<tr><td>ΔE*ab (CIE76)</td><td>1976</td><td>CIELAB 空間的歐幾里德距離，簡單但不夠精確</td></tr>
<tr><td>ΔE*94 (CIE94)</td><td>1994</td><td>加入色度和色相的加權，改善高飽和區域</td></tr>
<tr><td>ΔE00 (CIEDE2000)</td><td>2000</td><td>加入旋轉項（Rotation Term），處理藍色區域的問題</td></tr>
</table>

<p>CIEDE2000 (ΔE00) 是目前業界最廣泛使用的色差公式。它在 CIE76 的基礎上加入了五個修正項：亮度加權 (S_L)、色度加權 (S_C)、色相加權 (S_H)、色度旋轉項 (R_T)、以及色度修正函數。這些修正使得 ΔE00 在所有色彩區域都更好地對應人眼感知。</p>

<h3>Macbeth 色卡的使用</h3>
<p>X-Rite ColorChecker Classic（俗稱 Macbeth 色卡）是 ISP 色彩校正的標準工具。它包含 24 個色塊：</p>
<ul>
<li><strong>第 1-6 列</strong>：自然色——深色皮膚、淺色皮膚、天空藍、樹葉綠、藍色花朵、藍綠色</li>
<li><strong>第 7-12 列</strong>：鮮豔色——橙色、紫藍色、中紅色、紫色、黃綠色、橙黃色</li>
<li><strong>第 13-18 列</strong>：飽和色——藍色、綠色、紅色、黃色、洋紅色、青色</li>
<li><strong>第 19-24 列</strong>：灰階——白色到黑色的 6 階灰度</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
色卡校正流程：(1) 在 D65 標準光源下拍攝色卡 → (2) 提取 24 色塊的 RGB 平均值 → (3) 轉換到 Lab 空間 → (4) 與標準 Lab 值比較計算 ΔE → (5) 調整 CCM/WB/Gamma 參數 → (6) 重複直到 Mean ΔE00 < 目標值。這個 iterative 過程通常需要在多個色溫下分別進行。
</div>

<h3>色彩準確性 vs. 色彩偏好</h3>
<p>一個有趣的現象是：最準確的色彩不一定是最好看的。消費者通常偏好稍微增強飽和度的膚色和天空，而非完全精確的色彩。因此，手機廠商的色彩調試通常分為兩個階段：</p>
<ol>
<li><strong>精確模式</strong>：以 ΔE00 最小化為目標，確保基礎色彩準確性</li>
<li><strong>風格化模式</strong>：在精確的基礎上，根據品牌風格微調膚色、天空、植物等特定色彩</li>
</ol>

<div class="info-box warn">
<div class="box-title">注意事項</div>
在測量 ΔE 時，環境光的控制非常重要。色卡必須在標準光源箱（如 D65、CWF、A 光源）中拍攝，避免混合光源干擾。色卡本身也有老化問題——長期使用後色塊會褪色，需定期更換。此外，色卡拍攝時的曝光必須準確，過曝或欠曝會影響色彩測量結果。
</div>
`,
      keyPoints: [
        "ΔE 是量化兩個顏色差異的標準指標，基於 CIELAB 色彩空間",
        "CIEDE2000 (ΔE00) 是目前最精確的色差公式，業界標準",
        "Mean ΔE00 < 2.0 為優秀，< 4.0 為可接受",
        "Macbeth ColorChecker 24 色卡是 ISP 色彩校正的標準參考",
        "色彩準確性是基礎，品牌風格化是在準確基礎上的微調"
      ]
    },
    {
      id: "ch4_9",
      title: "Chromatic Adaptation 色彩適應",
      content: `
<h3>什麼是 Chromatic Adaptation？</h3>
<p>Chromatic Adaptation（色彩適應）是指人眼在不同光源下自動調整色彩感知的能力。當你從室外走進燭光照明的餐廳，最初會覺得一切偏橘，但幾分鐘後，你的視覺系統就會適應，白色的桌布又看起來是白的。這就是色彩適應——人腦的 Automatic White Balance。</p>

<p>在 ISP 中，Chromatic Adaptation Transform（CAT，色彩適應轉換）用於模擬這個過程。它的核心功能是：將在某個光源下觀察到的顏色，轉換為在另一個光源下看到的等效顏色。這對於 AWB 校正後的跨光源色彩一致性至關重要。</p>

<div class="diagram"><svg viewBox="0 0 700 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="350" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Chromatic Adaptation Transform 流程</text>
  <!-- Source illuminant -->
  <g transform="translate(30,60)">
    <rect x="0" y="20" width="120" height="80" rx="8" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="60" y="50" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Source XYZ</text>
    <text x="60" y="68" text-anchor="middle" font-size="9" fill="#c4a064">光源 A (2856K)</text>
    <text x="60" y="82" text-anchor="middle" font-size="9" fill="#8a8580">偏暖橘色</text>
    <!-- Small warm circle -->
    <circle cx="60" cy="115" r="8" fill="#e8a050" opacity="0.6"/>
  </g>
  <!-- Arrow to LMS -->
  <line x1="155" y1="100" x2="195" y2="100" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4ca)"/>
  <!-- To LMS -->
  <g transform="translate(195,55)">
    <rect x="0" y="0" width="110" height="100" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="55" y="28" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Step 1</text>
    <text x="55" y="45" text-anchor="middle" font-size="10" fill="#5a5550">XYZ → LMS</text>
    <text x="55" y="65" text-anchor="middle" font-size="8" fill="#8a8580">M_CAT × XYZ</text>
    <text x="55" y="82" text-anchor="middle" font-size="8" fill="#8a8580">（錐狀細胞域）</text>
  </g>
  <!-- Arrow -->
  <line x1="310" y1="100" x2="340" y2="100" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4ca)"/>
  <!-- Scale -->
  <g transform="translate(340,45)">
    <rect x="0" y="0" width="130" height="120" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="65" y="28" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Step 2</text>
    <text x="65" y="45" text-anchor="middle" font-size="10" fill="#5a5550">Scale LMS</text>
    <text x="65" y="65" text-anchor="middle" font-size="8" fill="#8a8580">L' = (L_d/L_s) × L</text>
    <text x="65" y="80" text-anchor="middle" font-size="8" fill="#8a8580">M' = (M_d/M_s) × M</text>
    <text x="65" y="95" text-anchor="middle" font-size="8" fill="#8a8580">S' = (S_d/S_s) × S</text>
    <text x="65" y="115" text-anchor="middle" font-size="8" fill="#6a8a7a">（光源比例縮放）</text>
  </g>
  <!-- Arrow -->
  <line x1="475" y1="100" x2="505" y2="100" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4ca)"/>
  <!-- Back to XYZ -->
  <g transform="translate(505,55)">
    <rect x="0" y="0" width="110" height="100" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="55" y="28" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Step 3</text>
    <text x="55" y="45" text-anchor="middle" font-size="10" fill="#5a5550">LMS → XYZ</text>
    <text x="55" y="65" text-anchor="middle" font-size="8" fill="#8a8580">M_CAT⁻¹ × LMS'</text>
    <text x="55" y="82" text-anchor="middle" font-size="8" fill="#8a8580">（回到 XYZ 域）</text>
  </g>
  <!-- Result -->
  <g transform="translate(505,180)">
    <rect x="0" y="0" width="120" height="80" rx="8" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="60" y="28" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Target XYZ</text>
    <text x="60" y="46" text-anchor="middle" font-size="9" fill="#648cb4">光源 D65 (6500K)</text>
    <text x="60" y="60" text-anchor="middle" font-size="9" fill="#8a8580">中性白光</text>
    <circle cx="60" cy="75" r="8" fill="#f0f0f0" stroke="#d5cec7" stroke-width="1"/>
  </g>
  <line x1="560" y1="155" x2="560" y2="178" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4ca)"/>
  <!-- Combined matrix -->
  <rect x="130" y="210" width="340" height="65" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
  <text x="300" y="233" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Combined Matrix: M = M_CAT⁻¹ × Diag(L_d/L_s, M_d/M_s, S_d/S_s) × M_CAT</text>
  <text x="300" y="255" text-anchor="middle" font-size="9" fill="#8a8580">三步合併為一個 3×3 矩陣運算，等效於一次矩陣乘法</text>
  <defs><marker id="arrow4ca" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 4-9：Chromatic Adaptation Transform 三步驟流程——XYZ → LMS → Scale → XYZ</div></div>

<h3>CAT 的數學原理</h3>
<p>Chromatic Adaptation Transform 的核心假設是 Von Kries 模型：人眼的三種錐狀細胞（L、M、S）各自獨立地調整增益，以適應環境光源。數學上表示為：</p>

<div class="formula">
[L']   [L_d/L_s    0        0   ] [L]<br>
[M'] = [  0     M_d/M_s     0   ] [M]<br>
[S']   [  0        0     S_d/S_s] [S]
</div>

<p>其中 (L_s, M_s, S_s) 是源光源的 LMS 值，(L_d, M_d, S_d) 是目標光源的 LMS 值。</p>

<h3>常見的 CAT 矩陣</h3>
<p>不同的 CAT 方法使用不同的 XYZ → LMS 轉換矩陣：</p>

<table>
<tr><th>方法</th><th>特性</th><th>應用</th></tr>
<tr><td>XYZ Scaling</td><td>直接在 XYZ 域縮放，最簡單但不準確</td><td>早期系統</td></tr>
<tr><td>Von Kries (Hunt-Pointer-Estevez)</td><td>基於錐狀細胞響應</td><td>經典方法</td></tr>
<tr><td>Bradford</td><td>引入負值元素，提高藍色區域準確性</td><td>ICC Profile 標準</td></tr>
<tr><td>CAT02</td><td>CIE CAM02 色貌模型配套</td><td>現代色彩管理</td></tr>
<tr><td>CAT16</td><td>CAT02 的改良版，修正了極端條件下的問題</td><td>最新標準</td></tr>
</table>

<div class="info-box key">
<div class="box-title">核心概念</div>
Bradford Transform 是目前最廣泛使用的 CAT 方法，被 ICC（International Color Consortium）採用為色彩管理標準。它的特殊之處在於 LMS 錐體空間中的 S 軸有負值分量，這使得它在藍色區域的適應性能優於純 Von Kries 方法。
</div>

<h3>CAT 在 ISP 中的應用</h3>
<p>在 ISP 中，CAT 主要有以下幾個應用場景：</p>
<ul>
<li><strong>跨色溫 CCM 設計</strong>：使用 CAT 將不同色溫下校正的 CCM 統一到同一參考光源下，減少需要校正的 CCM 數量</li>
<li><strong>AWB 後處理</strong>：當 AWB 估計的色溫不夠精確時，使用 CAT 做微調</li>
<li><strong>混合光源處理</strong>：場景中有多種光源時，使用 CAT 估計並補償局部色彩偏差</li>
<li><strong>色彩一致性</strong>：確保在不同光源下拍攝的同一物體，輸出的顏色保持一致</li>
</ul>

<pre>
// Bradford CAT 矩陣（XYZ → LMS）
float M_bradford[3][3] = {
    { 0.8951,  0.2664, -0.1614},
    {-0.7502,  1.7135,  0.0367},
    { 0.0389, -0.0685,  1.0296}
};
// 完整的 Chromatic Adaptation: Source_XYZ → Target_XYZ
// M_adapt = M_bradford_inv * Diag(Ld/Ls, Md/Ms, Sd/Ss) * M_bradford
</pre>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在實作中，CAT 的三步運算可以合併為一個 3×3 矩陣，這個矩陣又可以進一步與 CCM 合併。因此，CAT 不會增加額外的運算負擔——只要在校正時正確計算合併矩陣即可。這種「離線計算、線上查表」的策略在 ISP 設計中非常普遍。
</div>

<h3>Incomplete Adaptation 與 D Factor</h3>
<p>現實中，人眼的色彩適應通常不是完全的（Incomplete Adaptation）。在混合光源環境中，人眼會在「完全適應」和「不適應」之間找到一個平衡點。CIE CAM02 模型引入了 D Factor 來量化適應程度：</p>

<div class="formula">D = F × [1 - (1/3.6) × e<sup>(-L_A-42)/92</sup>]</div>

<p>其中 F 為場景因子（1.0 為平均場景），L_A 為背景適應亮度。D=1 表示完全適應，D=0 表示不適應。在 ISP 設計中，D Factor 可以用來控制 White Balance 的「完整度」——在某些藝術性場景中，保留一些光源色彩（如暖色調的夕陽）可能比完全白平衡更好看。</p>
`,
      keyPoints: [
        "Chromatic Adaptation 模擬人眼在不同光源下自動調整色彩感知的能力",
        "Von Kries 模型假設三種錐狀細胞各自獨立調整增益",
        "Bradford Transform 是業界最廣泛使用的 CAT 方法，被 ICC 標準採用",
        "CAT 的三步運算可合併為一個 3×3 矩陣，並可與 CCM 合併",
        "D Factor 控制適應程度，在藝術性場景中可保留部分光源色彩"
      ]
    },
    {
      id: "ch4_10",
      title: "ISP 色彩 Pipeline 順序",
      content: `
<h3>為什麼順序如此重要？</h3>
<p>ISP 色彩處理的各個模組並非獨立運作——它們的處理順序會直接影響最終的影像品質。錯誤的順序不僅會產生色彩偏差，還可能導致噪聲放大、Artifact 出現等問題。理解並遵循正確的 Pipeline 順序，是 ISP 工程師的基本功。</p>

<p>色彩 Pipeline 的設計原則可以歸納為：<strong>先校正，後美化；先線性，後非線性；先全域，後局部</strong>。</p>

<div class="diagram"><svg viewBox="0 0 700 520" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="520" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">ISP 完整色彩處理 Pipeline</text>
  <!-- Pipeline boxes -->
  <g transform="translate(80,50)">
    <!-- Stage 1: Raw Domain -->
    <rect x="0" y="0" width="540" height="155" rx="8" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="270" y="18" text-anchor="middle" font-size="10" fill="#c4a064" font-weight="500">Linear / Raw Domain</text>
    <!-- BLC -->
    <rect x="20" y="30" width="90" height="50" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="65" y="52" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">BLC</text>
    <text x="65" y="66" text-anchor="middle" font-size="7" fill="#8a8580">Black Level</text>
    <line x1="110" y1="55" x2="135" y2="55" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- LSC -->
    <rect x="135" y="30" width="90" height="50" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="180" y="52" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">LSC</text>
    <text x="180" y="66" text-anchor="middle" font-size="7" fill="#8a8580">Lens Shading</text>
    <line x1="225" y1="55" x2="250" y2="55" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- WB Gain -->
    <rect x="250" y="30" width="90" height="50" rx="6" fill="rgba(106,138,122,0.18)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="295" y="52" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">WB Gain</text>
    <text x="295" y="66" text-anchor="middle" font-size="7" fill="#8a8580">White Balance</text>
    <line x1="340" y1="55" x2="365" y2="55" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- Demosaic -->
    <rect x="365" y="30" width="90" height="50" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="410" y="52" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Demosaic</text>
    <text x="410" y="66" text-anchor="middle" font-size="7" fill="#8a8580">CFA Interpolation</text>
    <!-- Arrow down -->
    <line x1="410" y1="80" x2="410" y2="100" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- CCM -->
    <rect x="345" y="100" width="110" height="45" rx="6" fill="rgba(106,138,122,0.18)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="400" y="120" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">CCM</text>
    <text x="400" y="134" text-anchor="middle" font-size="7" fill="#8a8580">Color Correction Matrix</text>
  </g>
  <!-- Arrow from linear to nonlinear -->
  <g transform="translate(80,195)">
    <line x1="400" y1="0" x2="400" y2="25" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow4p)"/>
  </g>
  <!-- Stage 2: Nonlinear Domain -->
  <g transform="translate(80,220)">
    <rect x="0" y="0" width="540" height="115" rx="8" fill="rgba(106,138,122,0.04)" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="270" y="18" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Non-linear Domain (Post-Gamma)</text>
    <!-- Gamma -->
    <rect x="345" y="28" width="110" height="45" rx="6" fill="rgba(106,138,122,0.18)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="400" y="48" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Gamma / LUT</text>
    <text x="400" y="62" text-anchor="middle" font-size="7" fill="#8a8580">Tone Curve</text>
    <line x1="345" y1="50" x2="320" y2="50" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4pl)"/>
    <!-- Saturation -->
    <rect x="210" y="28" width="110" height="45" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="265" y="48" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Saturation</text>
    <text x="265" y="62" text-anchor="middle" font-size="7" fill="#8a8580">Color Enhancement</text>
    <line x1="210" y1="50" x2="185" y2="50" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4pl)"/>
    <!-- Hue -->
    <rect x="75" y="28" width="110" height="45" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="130" y="48" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Hue Adjust</text>
    <text x="130" y="62" text-anchor="middle" font-size="7" fill="#8a8580">Selective Color</text>
    <line x1="130" y1="73" x2="130" y2="90" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- 3D LUT -->
    <rect x="75" y="90" width="380" height="20" rx="4" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="265" y="104" text-anchor="middle" font-size="8" fill="#c4a064">或使用 3D LUT 統一實現以上操作</text>
  </g>
  <!-- Stage 3: Output -->
  <g transform="translate(80,350)">
    <rect x="0" y="0" width="540" height="80" rx="8" fill="rgba(100,140,180,0.06)" stroke="#648cb4" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="270" y="18" text-anchor="middle" font-size="10" fill="#648cb4" font-weight="500">Output Stage</text>
    <line x1="130" y1="-15" x2="130" y2="28" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrow4p)"/>
    <!-- Sharpening -->
    <rect x="20" y="28" width="100" height="42" rx="6" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="70" y="48" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Sharpening</text>
    <text x="70" y="60" text-anchor="middle" font-size="7" fill="#8a8580">Edge Enhancement</text>
    <line x1="120" y1="49" x2="155" y2="49" stroke="#648cb4" stroke-width="1.2" marker-end="url(#arrow4pb)"/>
    <!-- NR -->
    <rect x="155" y="28" width="100" height="42" rx="6" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="205" y="48" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Chroma NR</text>
    <text x="205" y="60" text-anchor="middle" font-size="7" fill="#8a8580">色度降噪</text>
    <line x1="255" y1="49" x2="290" y2="49" stroke="#648cb4" stroke-width="1.2" marker-end="url(#arrow4pb)"/>
    <!-- Gamut Mapping -->
    <rect x="290" y="28" width="110" height="42" rx="6" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="345" y="48" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Gamut Map</text>
    <text x="345" y="60" text-anchor="middle" font-size="7" fill="#8a8580">色域映射</text>
    <line x1="400" y1="49" x2="420" y2="49" stroke="#648cb4" stroke-width="1.2" marker-end="url(#arrow4pb)"/>
    <!-- Output -->
    <rect x="420" y="28" width="100" height="42" rx="6" fill="rgba(100,140,180,0.15)" stroke="#648cb4" stroke-width="2"/>
    <text x="470" y="48" text-anchor="middle" font-size="10" fill="#648cb4" font-weight="500">Output</text>
    <text x="470" y="60" text-anchor="middle" font-size="7" fill="#8a8580">sRGB / P3</text>
  </g>
  <!-- Key annotations -->
  <g transform="translate(80,450)">
    <rect x="0" y="0" width="540" height="50" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="20" y="20" font-size="9" fill="#6a8a7a" font-weight="500">設計原則：</text>
    <text x="20" y="38" font-size="9" fill="#5a5550">BLC → LSC → WB → Demosaic → CCM 必須在線性域 | Gamma 後進入非線性域 | 3D LUT 在 Gamma 後</text>
  </g>
  <defs>
    <marker id="arrow4p" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker>
    <marker id="arrow4pl" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill="#6a8a7a"/></marker>
    <marker id="arrow4pb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#648cb4"/></marker>
  </defs>
</svg><div class="caption">圖 4-10：ISP 完整色彩處理 Pipeline 流程圖——從 Raw 到最終輸出</div></div>

<h3>各模組的順序邏輯</h3>
<p>讓我們逐步分析為什麼這個順序是最合理的：</p>

<h4>Step 1: BLC (Black Level Correction)</h4>
<p>必須最先處理。黑電平偏移如果不先校正，後續所有乘法運算（WB Gain、CCM）都會引入偏差。</p>

<h4>Step 2: LSC (Lens Shading Correction)</h4>
<p>在 WB 之前處理，因為 LSC 是乘法增益。如果先做 WB 再做 LSC，WB 的增益會被 LSC 再次影響，導致邊緣色偏。</p>

<h4>Step 3: WB Gain</h4>
<p>在 Demosaic 之前的 Bayer 域處理。這確保了 Demosaic 時的色彩插值不會受到白平衡偏差的影響。</p>

<h4>Step 4: Demosaic</h4>
<p>將 Bayer 單通道數據插值為全彩 RGB。從此處開始，數據變為三通道。</p>

<h4>Step 5: CCM</h4>
<p>在線性域中將 Sensor RGB 映射到目標色彩空間。必須在 Gamma 之前。</p>

<h4>Step 6: Gamma / Tone Curve</h4>
<p>從線性域轉換到非線性域。這是 Pipeline 中的重要分界線。</p>

<h4>Step 7: Saturation & Hue Adjustment</h4>
<p>在 Gamma 之後的非線性域中進行。某些 ISP 也支援在線性域中做飽和度調整，但非線性域的視覺效果通常更好。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
理解「線性域」和「非線性域」的分界至關重要。線性域中，像素值與光強度成正比，適合做物理校正（BLC、LSC、WB、CCM）。非線性域中，像素值與人眼感知成正比，適合做視覺增強（飽和度、銳化、色彩風格化）。Gamma Curve 就是這兩個域之間的橋樑。
</div>

<h3>Pipeline 變體與替代方案</h3>
<p>不同的 ISP 平台可能有略微不同的 Pipeline 順序，但核心原則相同。一些常見的變體：</p>
<ul>
<li><strong>NR 位置</strong>：某些 ISP 在 Demosaic 前做 Raw NR，在 Gamma 後做 Chroma NR。兩者互補</li>
<li><strong>CCM + Saturation 合併</strong>：可以將 CCM 和 Saturation Matrix 合併為一個 3×3 矩陣</li>
<li><strong>3D LUT 替代</strong>：一張 3D LUT 可以替代 CCM + Gamma + Saturation + Hue 的全部功能</li>
<li><strong>雙 Gamma</strong>：某些 ISP 在 CCM 前做 de-gamma（用於 Log 域 NR），CCM 後再做正式 Gamma</li>
</ul>

<div class="info-box warn">
<div class="box-title">注意事項</div>
在調試 Pipeline 時，一個常見的錯誤是在錯誤的域中觀察數據。例如，在線性域中觀察影像會覺得非常暗（因為沒有 Gamma），這是正常的。如果調試工具自動加了 Gamma 顯示，會影響你對 CCM、WB 效果的判斷。確保你清楚每一步的數據是在哪個域中。
</div>

<h3>Pipeline 驗證方法</h3>
<p>驗證色彩 Pipeline 是否正確的最佳方法：</p>
<ol>
<li>使用灰卡驗證 WB：灰卡的 R=G=B 在 WB 後應完全相等</li>
<li>使用白卡驗證 BLC + LSC：白卡在全畫面應均勻</li>
<li>使用 Macbeth 色卡驗證 CCM：計算 ΔE 確認色彩準確性</li>
<li>使用灰階色卡驗證 Gamma：確認灰階的 Tone Response 正確</li>
<li>端到端驗證：拍攝真實場景（膚色、天空、草地），主觀評估色彩品質</li>
</ol>

<div class="info-box example">
<div class="box-title">設計範例</div>
一個完整的色彩 Pipeline 調試 SOP：(1) 先在 D65 下校正 CCM，確認 Mean ΔE00 < 2.0。(2) 在 A 光源和 TL84 下校正額外 CCM，驗證 ΔE00。(3) 設定 AWB 的色溫範圍和增益邊界。(4) 調整 Gamma 曲線，確認 18% 灰卡的輸出值正確。(5) 微調飽和度和色相，進行主觀評估。(6) 在 50+ 個真實場景中驗證。
</div>
`,
      keyPoints: [
        "Pipeline 原則：先校正後美化、先線性後非線性、先全域後局部",
        "BLC → LSC → WB → Demosaic → CCM 必須在線性域處理",
        "Gamma 是線性域與非線性域的分界線",
        "3D LUT 可替代 CCM + Gamma + Saturation + Hue 的功能",
        "驗證 Pipeline 需使用灰卡、白卡、Macbeth 色卡和真實場景"
      ]
    }
  ]
};
