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
    },
    {
      id: "ch4_11",
      title: "CCM 硬體實現與定點運算 CCM Hardware Implementation",
      content: `
<h3>CCM 硬體架構概述</h3>
<p>Color Correction Matrix（CCM）是 ISP 色彩 Pipeline 中最核心的模組之一。在硬體實現中，CCM 本質上是一個 3×3 矩陣乘法器，將 Sensor RGB 映射到標準色彩空間（如 sRGB）。看似簡單的矩陣乘法，在硬體設計中卻需要考慮定點數格式、溢位處理、Pipeline 時序等諸多細節。</p>

<div class="formula">
[R']   [C00 C01 C02] [R]   [Offset_R]
[G'] = [C10 C11 C12] [G] + [Offset_G]
[B']   [C20 C21 C22] [B]   [Offset_B]
</div>

<p>每個輸出通道需要 3 次乘法和 2 次加法（再加 Offset），因此 3 個通道共需 9 次乘法、9 次加法。在高速 ISP 中，這必須在 1 個 clock cycle 內完成，或使用 Pipeline 分段處理。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="340" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">CCM 硬體 Pipeline 架構</text>
  <!-- Input registers -->
  <rect x="20" y="50" width="70" height="30" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="55" y="69" text-anchor="middle" font-size="10" fill="#c4a064">R_in</text>
  <rect x="20" y="90" width="70" height="30" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="55" y="109" text-anchor="middle" font-size="10" fill="#6a8a7a">G_in</text>
  <rect x="20" y="130" width="70" height="30" rx="4" fill="rgba(74,122,181,0.15)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="55" y="149" text-anchor="middle" font-size="10" fill="#4a7ab5">B_in</text>
  <!-- Multipliers stage -->
  <rect x="130" y="40" width="120" height="140" rx="6" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="1"/>
  <text x="190" y="58" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">9 Multipliers</text>
  <text x="190" y="75" text-anchor="middle" font-size="8" fill="#8a8580">C00×R  C01×G  C02×B</text>
  <text x="190" y="90" text-anchor="middle" font-size="8" fill="#8a8580">C10×R  C11×G  C12×B</text>
  <text x="190" y="105" text-anchor="middle" font-size="8" fill="#8a8580">C20×R  C21×G  C22×B</text>
  <rect x="145" y="115" width="90" height="20" rx="3" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="190" y="129" text-anchor="middle" font-size="7" fill="#c4a064">Pipeline Reg Stage 1</text>
  <!-- Adder stage -->
  <line x1="250" y1="100" x2="280" y2="100" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="280" y="50" width="100" height="120" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="330" y="70" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Adder Tree</text>
  <text x="330" y="88" text-anchor="middle" font-size="8" fill="#8a8580">R' = sum + Offset_R</text>
  <text x="330" y="103" text-anchor="middle" font-size="8" fill="#8a8580">G' = sum + Offset_G</text>
  <text x="330" y="118" text-anchor="middle" font-size="8" fill="#8a8580">B' = sum + Offset_B</text>
  <rect x="290" y="130" width="80" height="20" rx="3" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="330" y="144" text-anchor="middle" font-size="7" fill="#c4a064">Pipeline Reg Stage 2</text>
  <!-- Clamp stage -->
  <line x1="380" y1="100" x2="410" y2="100" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="410" y="60" width="80" height="100" rx="6" fill="rgba(196,64,64,0.08)" stroke="#c44040" stroke-width="1"/>
  <text x="450" y="80" text-anchor="middle" font-size="9" fill="#c44040" font-weight="500">Clamp</text>
  <text x="450" y="98" text-anchor="middle" font-size="8" fill="#8a8580">Overflow →Max</text>
  <text x="450" y="113" text-anchor="middle" font-size="8" fill="#8a8580">Underflow →0</text>
  <text x="450" y="128" text-anchor="middle" font-size="8" fill="#8a8580">Round & Shift</text>
  <!-- Output -->
  <line x1="490" y1="100" x2="520" y2="100" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="520" y="70" width="60" height="60" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="550" y="98" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">R'G'B'</text>
  <text x="550" y="112" text-anchor="middle" font-size="7" fill="#8a8580">Output</text>
  <!-- Bit width annotation -->
  <text x="300" y="210" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">定點數位寬設計範例</text>
  <rect x="50" y="225" width="500" height="100" rx="6" fill="rgba(213,206,199,0.15)" stroke="#d5cec7" stroke-width="1"/>
  <text x="70" y="248" font-size="9" fill="#5a5550">Input:  12-bit unsigned (0~4095)</text>
  <text x="70" y="268" font-size="9" fill="#5a5550">Coeff:  S4.8 signed fixed-point (1 sign + 4 integer + 8 fraction = 13 bits)</text>
  <text x="70" y="288" font-size="9" fill="#5a5550">Mult:   12 + 13 = 25 bits (signed product)</text>
  <text x="70" y="308" font-size="9" fill="#5a5550">Sum:    25 + 2 = 27 bits (3-input add, +2 guard bits) → Round → Clamp → 12-bit output</text>
</svg><div class="caption">圖 4-11：CCM 硬體 Pipeline 架構與位寬設計</div></div>

<h3>定點數格式選擇</h3>
<p>CCM 係數通常包含負值（Off-diagonal 元素可能為 -0.5 ~ -1.5），因此必須使用有號定點數。常見格式：</p>

<div class="table-container"><table>
<tr><th>格式</th><th>位寬</th><th>範圍</th><th>精度</th><th>適用場景</th></tr>
<tr><td>S3.8</td><td>12 bits</td><td>-8.0 ~ +7.996</td><td>1/256</td><td>低精度、面積受限</td></tr>
<tr><td>S4.8</td><td>13 bits</td><td>-16.0 ~ +15.996</td><td>1/256</td><td>常見設計、平衡選擇</td></tr>
<tr><td>S3.12</td><td>16 bits</td><td>-8.0 ~ +7.9998</td><td>1/4096</td><td>高精度需求</td></tr>
<tr><td>S4.10</td><td>15 bits</td><td>-16.0 ~ +15.999</td><td>1/1024</td><td>高階 ISP</td></tr>
</table></div>

<p>係數精度的選擇直接影響色彩準確度。一般而言，8-bit 小數精度的量化誤差約為 ΔE ≈ 0.3~0.5，對大多數應用已經足夠。但在醫療影像或廣色域（Wide Color Gamut）應用中，可能需要 10-12 bit 小數精度。</p>

<h3>溢位處理策略</h3>
<p>CCM 矩陣乘法後的結果可能超出有效範圍。硬體中的處理策略包括：</p>
<ul>
<li><strong>Hard Clamp</strong>：直接截斷到 [0, Max]，簡單但可能造成色彩失真（飽和色區域）</li>
<li><strong>Soft Clamp</strong>：在接近邊界時使用壓縮曲線，保留更多色彩細節</li>
<li><strong>Guard Bits</strong>：在中間運算中保留額外位元，只在最終輸出時截斷</li>
<li><strong>Rounding Mode</strong>：Round-to-nearest（四捨五入）vs Truncation（截斷），前者精度更好但硬體稍複雜</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
CCM 硬體設計的三大挑戰：(1) 定點係數精度需足以維持 ΔE < 1.0 的色彩準確度。(2) 乘法器面積佔 ISP 面積的很大比例，需考慮資源共享或 Multiplier-less 設計。(3) Pipeline 延遲需控制在可接受範圍內，特別是在 4K/8K 高畫素率場景。
</div>

<h3>面積優化技巧</h3>
<p>在低成本 ISP 中，9 個乘法器的面積可能無法接受。常見的優化技巧：</p>
<ul>
<li><strong>時分多工（TDM）</strong>：使用 3 個乘法器，3 個 clock cycle 完成一組 RGB，適用於低像素率場景</li>
<li><strong>CSD Coding</strong>：將係數編碼為 Canonical Signed Digit，用移位和加法替代乘法</li>
<li><strong>Row Sum = 1 約束</strong>：利用 CCM 行和為 1 的特性，將 3 次乘法簡化為 2 次乘法 + 1 次減法</li>
<li><strong>對稱性利用</strong>：某些 CCM 結構具有近似對稱性，可共享部分乘法器</li>
</ul>

<div class="info-box example">
<div class="box-title">設計範例</div>
以 12-bit input、S4.8 係數為例的 Verilog 風格描述：<br>
<code>wire signed [24:0] prod_r0 = $signed({1'b0, R_in}) * $signed(C00);</code><br>
<code>wire signed [24:0] prod_r1 = $signed({1'b0, G_in}) * $signed(C01);</code><br>
<code>wire signed [24:0] prod_r2 = $signed({1'b0, B_in}) * $signed(C02);</code><br>
<code>wire signed [26:0] sum_r = prod_r0 + prod_r1 + prod_r2 + $signed(Offset_R);</code><br>
<code>wire [11:0] R_out = (sum_r[26]) ? 12'd0 : (sum_r[25:8] > 4095) ? 12'd4095 : sum_r[19:8];</code>
</div>
`,
      keyPoints: [
        "CCM 硬體核心是 3×3 矩陣乘法，需 9 個乘法器和加法器樹",
        "定點格式常用 S4.8 或 S3.12，小數精度影響色彩 ΔE",
        "溢位處理需結合 Guard Bits、Clamp 和 Rounding",
        "面積優化可用時分多工、CSD Coding 或行和約束",
        "Pipeline Register 設計影響時序和延遲的平衡"
      ]
    },
    {
      id: "ch4_12",
      title: "AWB 演算法硬體架構 AWB Hardware Architecture",
      content: `
<h3>AWB 系統概述</h3>
<p>Auto White Balance（AWB）是 ISP 中最關鍵的即時控制演算法之一。AWB 的目標是估計場景的光源色溫，並計算對應的 WB Gain（R_gain, G_gain, B_gain），使白色物體在影像中呈現為中性灰/白。硬體 AWB 系統通常分為兩個部分：<strong>Statistics Engine</strong>（硬體統計引擎）和 <strong>AWB Algorithm</strong>（韌體/軟體演算法）。</p>

<div class="diagram"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="300" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">AWB 硬體/軟體分工架構</text>
  <!-- HW Statistics Engine -->
  <rect x="30" y="50" width="250" height="200" rx="8" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="155" y="72" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Hardware Statistics Engine</text>
  <rect x="50" y="85" width="90" height="35" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="95" y="107" text-anchor="middle" font-size="8" fill="#5a5550">ROI Grid</text>
  <rect x="160" y="85" width="100" height="35" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="210" y="100" text-anchor="middle" font-size="8" fill="#5a5550">Pixel Filter</text>
  <text x="210" y="112" text-anchor="middle" font-size="7" fill="#8a8580">(threshold)</text>
  <rect x="50" y="135" width="210" height="35" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1"/>
  <text x="155" y="150" text-anchor="middle" font-size="8" fill="#5a5550">Sum(R), Sum(G), Sum(B), Count per block</text>
  <text x="155" y="162" text-anchor="middle" font-size="7" fill="#8a8580">Per-block accumulator</text>
  <rect x="50" y="185" width="210" height="35" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1"/>
  <text x="155" y="200" text-anchor="middle" font-size="8" fill="#5a5550">R/G, B/G ratio histogram</text>
  <text x="155" y="212" text-anchor="middle" font-size="7" fill="#8a8580">Optional: color ratio distribution</text>
  <!-- Arrow -->
  <line x1="280" y1="150" x2="320" y2="150" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arw11)"/>
  <text x="300" y="143" text-anchor="middle" font-size="7" fill="#c4a064">IRQ</text>
  <!-- SW Algorithm -->
  <rect x="320" y="50" width="250" height="200" rx="8" fill="rgba(74,122,181,0.06)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="445" y="72" text-anchor="middle" font-size="11" fill="#4a7ab5" font-weight="500">Firmware AWB Algorithm</text>
  <rect x="340" y="85" width="210" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
  <text x="445" y="105" text-anchor="middle" font-size="8" fill="#5a5550">White Point Detection (Gray World / White Patch)</text>
  <rect x="340" y="125" width="210" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
  <text x="445" y="145" text-anchor="middle" font-size="8" fill="#5a5550">Color Temperature Estimation</text>
  <rect x="340" y="165" width="210" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
  <text x="445" y="185" text-anchor="middle" font-size="8" fill="#5a5550">Gain Calculation & Convergence</text>
  <rect x="340" y="205" width="210" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
  <text x="445" y="225" text-anchor="middle" font-size="8" fill="#5a5550">Output: R_gain, B_gain → HW registers</text>
  <defs><marker id="arw11" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#c4a064"/></marker></defs>
</svg><div class="caption">圖 4-12：AWB 硬體統計引擎與軟體演算法分工</div></div>

<h3>Statistics Engine 設計</h3>
<p>AWB 統計引擎的核心功能是在每一幀中收集色彩分佈資訊，提供給韌體演算法使用。典型的統計資料包括：</p>

<div class="table-container"><table>
<tr><th>統計量</th><th>說明</th><th>典型精度</th><th>SRAM 需求</th></tr>
<tr><td>Per-block Sum</td><td>每個 Block 的 R/G/B 累加值</td><td>32-bit per channel</td><td>32×32 grid × 4 × 32b = 16 KB</td></tr>
<tr><td>Per-block Count</td><td>通過 Filter 的像素數量</td><td>16-bit</td><td>32×32 × 16b = 2 KB</td></tr>
<tr><td>R/G Histogram</td><td>R/G 比值的分佈</td><td>256 bins × 20-bit</td><td>~640 B</td></tr>
<tr><td>B/G Histogram</td><td>B/G 比值的分佈</td><td>256 bins × 20-bit</td><td>~640 B</td></tr>
</table></div>

<h3>Gray World 演算法</h3>
<p>最基本的 AWB 演算法。假設場景的平均色彩應為灰色（achromatic），因此 R、G、B 三通道的平均值應相等：</p>
<div class="formula">R_gain = G_avg / R_avg, &nbsp; B_gain = G_avg / B_avg</div>
<p>優點是計算簡單、硬體開銷小。缺點是在大面積單色場景中（如藍天、綠草地）會產生嚴重的色偏。</p>

<h3>White Patch 演算法</h3>
<p>假設場景中最亮的像素應為白色。通過找到 R、G、B 各自的最大值來估計光源色彩：</p>
<div class="formula">R_gain = Max(G) / Max(R), &nbsp; B_gain = Max(G) / Max(B)</div>
<p>對高光過曝的場景敏感，通常需要先排除飽和像素。</p>

<h3>ROI-based 白點偵測</h3>
<p>現代 ISP 通常結合 ROI（Region of Interest）過濾器，只統計「可能是白色/灰色」的像素。過濾條件包括：</p>
<ul>
<li><strong>亮度閾值</strong>：排除過暗（noise 干擾）和過亮（過曝）的像素</li>
<li><strong>色度閾值</strong>：只選擇接近灰軸的像素（|R/G - 1| < threshold 且 |B/G - 1| < threshold）</li>
<li><strong>綠通道範圍</strong>：確保像素有足夠的信噪比</li>
<li><strong>色溫範圍框</strong>：在 R/G vs B/G 空間中定義合法的色溫區域，排除區域外像素</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
AWB 統計引擎的設計品質直接影響 AWB 演算法的表現。一個好的統計引擎應提供：(1) 足夠精細的空間分區（至少 32×32 blocks）。(2) 靈活的像素過濾條件。(3) 色彩比值的分佈直方圖。這些資料讓韌體能實現更複雜的白點檢測策略。
</div>

<h3>Convergence Control 收斂控制</h3>
<p>AWB Gain 不能在幀與幀之間劇烈變化，否則會造成閃爍（flickering）。收斂策略包括：</p>
<ul>
<li><strong>IIR 低通濾波</strong>：<code>Gain[n] = α × Gain_new + (1-α) × Gain[n-1]</code>，α 通常為 0.1~0.3</li>
<li><strong>Step Size 限制</strong>：每幀 Gain 變化量不超過某個上限（如 ±0.02）</li>
<li><strong>Dead Zone</strong>：當誤差小於閾值時不再更新，避免在收斂點附近震盪</li>
<li><strong>場景變化檢測</strong>：當偵測到場景劇變（如平移拍攝）時，加快收斂速度</li>
</ul>

<div class="info-box warn">
<div class="box-title">注意事項</div>
AWB 統計引擎的取樣位置很重要。統計應在 BLC 和 LSC 校正之後、WB Gain 之前進行，這樣統計到的是原始的 Sensor 色彩比值，不會被上一幀的 WB Gain 影響（稱為 pre-gain statistics）。某些 ISP 提供 post-gain statistics，但需要韌體將 Gain 效果扣除。
</div>
`,
      keyPoints: [
        "AWB 系統分為硬體統計引擎和韌體演算法兩部分",
        "統計引擎收集 Per-block 的 RGB Sum/Count 和色彩比值直方圖",
        "Gray World 假設場景平均色為灰色，簡單但對單色場景失效",
        "ROI-based 白點偵測透過亮度、色度、色溫範圍過濾像素",
        "收斂控制使用 IIR 濾波和 Step Size 限制避免閃爍"
      ]
    },
    {
      id: "ch4_13",
      title: "多光源 AWB 與場景偵測 Multi-illuminant AWB",
      content: `
<h3>多光源場景的挑戰</h3>
<p>真實世界的拍攝場景經常包含多種光源：室內日光燈搭配窗外自然光、夜間人造光混合車燈等。傳統 AWB 演算法假設場景只有一個主光源（Single Illuminant Assumption），在多光源場景中會選擇一個「折衷」的色溫，導致畫面部分區域偏色。</p>

<h3>色溫空間中的光源分佈</h3>
<p>在 R/G vs B/G 的二維空間中，不同色溫的光源分佈在一條曲線（Planckian Locus）附近。多光源場景的統計資料會呈現多個聚類（clusters），每個聚類對應一種光源：</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="350" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">R/G vs B/G 空間中的多光源分佈</text>
  <!-- Axes -->
  <line x1="80" y1="300" x2="550" y2="300" stroke="#8a8580" stroke-width="1"/>
  <line x1="80" y1="300" x2="80" y2="50" stroke="#8a8580" stroke-width="1"/>
  <text x="315" y="330" text-anchor="middle" font-size="10" fill="#5a5550">R/G ratio</text>
  <text x="40" y="175" text-anchor="middle" font-size="10" fill="#5a5550" transform="rotate(-90,40,175)">B/G ratio</text>
  <!-- Planckian locus curve -->
  <path d="M130,80 Q200,100 280,160 Q350,210 450,270" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="470" y="265" font-size="8" fill="#c4a064">Planckian Locus</text>
  <!-- Color temperature labels -->
  <text x="120" y="72" font-size="8" fill="#4a7ab5">10000K</text>
  <circle cx="130" cy="80" r="3" fill="#4a7ab5"/>
  <text x="195" y="95" font-size="8" fill="#4a7ab5">7500K</text>
  <text x="270" y="150" font-size="8" fill="#6a8a7a">5500K (D55)</text>
  <circle cx="280" cy="160" r="3" fill="#6a8a7a"/>
  <text x="345" y="200" font-size="8" fill="#c4a064">4000K (TL84)</text>
  <circle cx="350" cy="210" r="3" fill="#c4a064"/>
  <text x="440" y="255" font-size="8" fill="#c44040">2800K (A)</text>
  <circle cx="450" cy="270" r="3" fill="#c44040"/>
  <!-- Cluster 1: Daylight -->
  <ellipse cx="290" cy="165" rx="40" ry="25" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="290" y="200" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">Cluster A: 窗外日光</text>
  <!-- Cluster 2: Indoor -->
  <ellipse cx="380" cy="230" rx="35" ry="20" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="380" y="258" text-anchor="middle" font-size="9" fill="#c4a064" font-weight="500">Cluster B: 室內燈</text>
  <!-- Mixed zone -->
  <ellipse cx="335" cy="195" rx="20" ry="15" fill="rgba(196,64,64,0.1)" stroke="#c44040" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="335" y="185" text-anchor="middle" font-size="7" fill="#c44040">混合區域</text>
</svg><div class="caption">圖 4-13：R/G vs B/G 空間中多光源場景的聚類分佈</div></div>

<h3>多光源 AWB 策略</h3>
<p>處理多光源場景的主要方法：</p>

<h4>1. Weighted Gray World</h4>
<p>根據每個 Block 的色溫估計值，給予不同的權重。接近 Planckian Locus 的 Block 權重較高，偏離較遠的（如大面積綠草地）權重較低。</p>

<h4>2. 最大聚類法（Dominant Illuminant）</h4>
<p>在色溫空間中尋找最大的像素聚類，以其中心作為主光源的估計。適合有明確主光源的場景。</p>

<h4>3. 多區域獨立 AWB</h4>
<p>將畫面分為多個區域，每個區域獨立估計色溫，然後根據區域特徵（如人臉位置、中心權重）融合。這種方法計算量較大，通常只在高階 ISP 中實現。</p>

<h3>場景偵測 Scene Detection</h3>
<p>許多 AWB 失敗案例可以通過場景偵測來避免。常見的場景類型和對應策略：</p>

<div class="table-container"><table>
<tr><th>場景類型</th><th>偵測方法</th><th>AWB 策略</th></tr>
<tr><td>藍天場景</td><td>大面積高亮度 + 高 B/G ratio</td><td>降低藍色區域的 AWB 權重</td></tr>
<tr><td>綠色植物</td><td>大面積高 G/R 且高 G/B ratio</td><td>排除綠色區域的統計</td></tr>
<tr><td>日落/日出</td><td>低色溫 + 天空區域橙色分佈</td><td>保留暖色調、限制 WB 矯正範圍</td></tr>
<tr><td>夜間人造光</td><td>低亮度 + 高對比 + 點狀高亮</td><td>使用白點偵測、忽略暗區統計</td></tr>
<tr><td>膚色主導</td><td>人臉偵測 + 膚色比例高</td><td>限制色溫在膚色友好範圍內</td></tr>
</table></div>

<h3>色溫估計硬體</h3>
<p>快速色溫估計可以在硬體中實現，用於場景偵測的輔助判斷。典型方法是在 R/G vs B/G 空間中，計算統計資料重心到 Planckian Locus 的投影點，然後查表得到對應色溫。硬體實現時，Planckian Locus 可以用分段線性逼近（Piecewise Linear Approximation），用 8~16 段即可達到足夠精度。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
多光源 AWB 的核心難題在於「一組全域 WB Gain 無法同時校正多種光源」。理想的解決方案是局部色彩校正（Local Color Correction），但這需要 per-pixel 或 per-block 的 WB Gain Map，硬體成本很高。實際工程中的折衷方案是：選擇主光源進行全域校正，對次要光源區域容忍一定程度的殘餘色偏。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
調試多光源場景時，建議使用 AWB 統計引擎的 per-block 資料，在 R/G vs B/G 空間中繪製散點圖。這樣可以直觀地看到光源分佈，判斷演算法是否選擇了合理的白點。許多 ISP vendor 的 tuning tool 都提供這樣的視覺化功能。
</div>
`,
      keyPoints: [
        "多光源場景中，單一 WB Gain 無法同時校正所有光源",
        "R/G vs B/G 空間中光源分佈沿 Planckian Locus 排列",
        "場景偵測（藍天、綠草、日落、夜景）可避免常見 AWB 失敗",
        "色溫估計硬體可用 Planckian Locus 分段線性逼近實現",
        "工程折衷：全域校正主光源，容忍次要光源的殘餘色偏"
      ]
    },
    {
      id: "ch4_14",
      title: "Color Space Conversion 硬體 CSC Hardware",
      content: `
<h3>色彩空間轉換的需求</h3>
<p>ISP 內部主要在 RGB 域處理色彩，但輸出時經常需要轉換為 YUV/YCbCr 格式，因為影像壓縮（H.264/H.265）和顯示系統通常使用亮度-色度分離的格式。Color Space Conversion（CSC）模組負責 RGB ↔ YCbCr 的即時轉換，必須嚴格遵循 ITU-R 標準。</p>

<h3>BT.601 / BT.709 / BT.2020 轉換矩陣</h3>
<p>三個主要標準的轉換係數不同，對應不同的色彩空間和解析度：</p>

<div class="table-container"><table>
<tr><th>標準</th><th>適用範圍</th><th>Y 係數 (Kr, Kg, Kb)</th></tr>
<tr><td>BT.601</td><td>SD (480i/576i)</td><td>0.299, 0.587, 0.114</td></tr>
<tr><td>BT.709</td><td>HD (720p/1080p)</td><td>0.2126, 0.7152, 0.0722</td></tr>
<tr><td>BT.2020</td><td>UHD (4K/8K, HDR)</td><td>0.2627, 0.6780, 0.0593</td></tr>
</table></div>

<p>完整的轉換公式（Full Range）：</p>
<div class="formula">
Y  = Kr×R + Kg×G + Kb×B<br>
Cb = (B - Y) / (2×(1-Kb)) + 128<br>
Cr = (R - Y) / (2×(1-Kr)) + 128
</div>

<p>展開為矩陣形式（以 BT.709 為例）：</p>
<div class="formula">
[Y ]   [ 0.2126   0.7152   0.0722] [R]   [  0]<br>
[Cb] = [-0.1146  -0.3854   0.5000] [G] + [128]<br>
[Cr]   [ 0.5000  -0.4542  -0.0458] [B]   [128]
</div>

<h3>Full Range vs Limited Range</h3>
<p>這是一個常見的混淆來源：</p>
<ul>
<li><strong>Full Range</strong>（JPEG/PC Range）：Y ∈ [0, 255], Cb/Cr ∈ [0, 255]（8-bit）</li>
<li><strong>Limited Range</strong>（TV/Studio Range）：Y ∈ [16, 235], Cb/Cr ∈ [16, 240]（8-bit）</li>
</ul>
<p>Limited Range 的轉換需要額外的 Scale 和 Offset。在硬體中，通常用不同的係數集來支援兩種 Range，而非在 Full Range 結果上再做縮放。</p>

<div class="diagram"><svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="220" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">CSC 硬體 Pipeline</text>
  <!-- Input -->
  <rect x="20" y="80" width="70" height="60" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="55" y="105" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">RGB</text>
  <text x="55" y="120" text-anchor="middle" font-size="7" fill="#8a8580">10/12-bit</text>
  <!-- Coeff MUX -->
  <line x1="90" y1="110" x2="120" y2="110" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="120" y="60" width="100" height="100" rx="6" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1"/>
  <text x="170" y="85" text-anchor="middle" font-size="9" fill="#c4a064" font-weight="500">Coeff MUX</text>
  <text x="170" y="102" text-anchor="middle" font-size="7" fill="#8a8580">BT.601</text>
  <text x="170" y="114" text-anchor="middle" font-size="7" fill="#8a8580">BT.709</text>
  <text x="170" y="126" text-anchor="middle" font-size="7" fill="#8a8580">BT.2020</text>
  <text x="170" y="140" text-anchor="middle" font-size="7" fill="#8a8580">Custom</text>
  <!-- Matrix Multiply -->
  <line x1="220" y1="110" x2="250" y2="110" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="250" y="70" width="120" height="80" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="310" y="100" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">3×3 Matrix</text>
  <text x="310" y="115" text-anchor="middle" font-size="8" fill="#8a8580">Multiply + Add</text>
  <text x="310" y="130" text-anchor="middle" font-size="7" fill="#8a8580">+ Offset</text>
  <!-- Clamp -->
  <line x1="370" y1="110" x2="400" y2="110" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="400" y="80" width="80" height="60" rx="6" fill="rgba(196,64,64,0.08)" stroke="#c44040" stroke-width="1"/>
  <text x="440" y="105" text-anchor="middle" font-size="9" fill="#c44040" font-weight="500">Clamp</text>
  <text x="440" y="120" text-anchor="middle" font-size="7" fill="#8a8580">Range Check</text>
  <!-- Output -->
  <line x1="480" y1="110" x2="510" y2="110" stroke="#6a8a7a" stroke-width="1.2"/>
  <rect x="510" y="80" width="70" height="60" rx="4" fill="rgba(74,122,181,0.15)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="545" y="105" text-anchor="middle" font-size="9" fill="#4a7ab5" font-weight="500">YCbCr</text>
  <text x="545" y="120" text-anchor="middle" font-size="7" fill="#8a8580">8/10-bit</text>
  <!-- Note -->
  <text x="300" y="195" text-anchor="middle" font-size="9" fill="#5a5550">同一硬體可透過切換係數支援多種標準，也可支援逆轉換（YCbCr→RGB）</text>
</svg><div class="caption">圖 4-14：CSC 硬體架構——支援多標準切換</div></div>

<h3>定點係數實現</h3>
<p>以 BT.709 的 Y 通道為例，浮點係數 0.2126 需轉換為定點數。若使用 10-bit 小數精度：</p>
<div class="formula">0.2126 × 1024 = 217.7 ≈ 218 → 實際係數 = 218/1024 = 0.21289</div>
<p>量化誤差 = |0.2126 - 0.21289| = 0.00029，對 8-bit 輸出影響不到 0.1 LSB。但對 12-bit HDR 輸出，可能需要 14-bit 小數精度。</p>

<h3>硬體共享策略</h3>
<p>CSC 模組的 3×3 矩陣乘法器可以與 CCM 模組共用。在 ISP Pipeline 中，CCM 和 CSC 不會同時作用在同一個像素上（Pipeline 的不同階段），因此可以時分多工共享乘法器，節省面積。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
CSC 實現中最常見的 Bug 是 Full Range / Limited Range 混淆。如果 ISP 輸出 Full Range YCbCr，但 Display 端設定為 Limited Range，影像會出現「洗白」（黑不黑、白不白）的現象。反之則影像對比過高、暗部和亮部被截斷。務必確保整條影像鏈路的 Range 設定一致。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
調試 CSC 的最佳工具是灰階色卡（Gray Ramp）。轉換後的灰色像素應滿足 Cb = Cr = 128（8-bit Full Range），任何偏離都表示轉換係數或 Offset 有誤。此外，可以使用 Color Bar 測試圖案驗證各色塊的 YCbCr 值是否與標準一致。
</div>
`,
      keyPoints: [
        "CSC 負責 RGB ↔ YCbCr 轉換，需嚴格遵循 BT.601/709/2020 標準",
        "Full Range 和 Limited Range 的混淆是最常見的 Bug 來源",
        "定點係數精度需配合輸出位寬，8-bit 輸出用 10-bit 小數即可",
        "CSC 與 CCM 的乘法器可以時分多工共享以節省面積",
        "灰階色卡是驗證 CSC 正確性的最佳工具"
      ]
    },
    {
      id: "ch4_15",
      title: "色彩飽和度硬體調整 Saturation Adjustment Hardware",
      content: `
<h3>飽和度調整的基本原理</h3>
<p>色彩飽和度（Saturation）描述顏色的鮮豔程度。在 ISP 中，飽和度調整是美化影像最直觀的手段之一。硬體實現的飽和度調整通常在色度通道（Chrominance）上施加增益，同時保持亮度通道（Luminance）不變。</p>

<h3>YCbCr 域飽和度調整</h3>
<p>最簡單的方法是在 YCbCr 域中，直接對 Cb 和 Cr 通道乘以飽和度因子 S：</p>
<div class="formula">
Cb' = (Cb - 128) × S + 128<br>
Cr' = (Cr - 128) × S + 128<br>
Y' = Y （不變）
</div>
<p>S > 1 增加飽和度，S < 1 降低飽和度，S = 0 為灰階影像。硬體上只需 2 個乘法器和加法器。</p>

<h3>RGB 域飽和度矩陣</h3>
<p>在 RGB 域中，飽和度調整可以用一個 3×3 矩陣實現，這個矩陣可以與 CCM 合併：</p>
<div class="formula">
設 Kr=0.2126, Kg=0.7152, Kb=0.0722 (BT.709 亮度係數)<br>
S_matrix = (1-S)×[Kr Kr Kr; Kg Kg Kg; Kb Kb Kb] + S×I<br>
其中 I 為 3×3 單位矩陣，S 為飽和度因子
</div>
<p>這個矩陣的優點是不需要先轉換到 YCbCr 域，可以直接在 RGB Pipeline 中實現，並且可以與 CCM 矩陣相乘合併為一個矩陣。</p>

<h3>Hue-Preserving Saturation（保色相飽和度）</h3>
<p>簡單的飽和度增加可能造成色相偏移（Hue Shift），特別是在高飽和度區域。保色相飽和度調整需要在極坐標（Polar Coordinate）空間中操作：</p>
<ul>
<li>將 Cb/Cr 轉換為極坐標：<code>C = sqrt(Cb² + Cr²)</code>, <code>H = atan2(Cr, Cb)</code></li>
<li>僅調整幅度 C，保持角度 H 不變：<code>C' = C × S</code></li>
<li>轉回直角坐標：<code>Cb' = C' × cos(H)</code>, <code>Cr' = C' × sin(H)</code></li>
</ul>
<p>硬體上 <code>sqrt</code> 和 <code>atan2</code> 的實現成本較高，通常使用 CORDIC 演算法或查表法（LUT）。</p>

<h3>膚色保護（Skin Tone Protection）</h3>
<p>在增加全域飽和度時，膚色區域容易變得過於鮮紅或橙色，看起來不自然。膚色保護機制的原理：</p>

<div class="diagram"><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="280" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">膚色保護飽和度調整流程</text>
  <!-- Pipeline -->
  <rect x="30" y="60" width="100" height="50" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="80" y="82" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">Pixel Input</text>
  <text x="80" y="96" text-anchor="middle" font-size="7" fill="#8a8580">YCbCr</text>
  <line x1="130" y1="85" x2="160" y2="85" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arw15)"/>
  <!-- Skin detection -->
  <rect x="160" y="50" width="120" height="70" rx="5" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="220" y="72" text-anchor="middle" font-size="9" fill="#c4a064" font-weight="500">膚色偵測</text>
  <text x="220" y="88" text-anchor="middle" font-size="7" fill="#8a8580">Cb ∈ [77,127]</text>
  <text x="220" y="100" text-anchor="middle" font-size="7" fill="#8a8580">Cr ∈ [133,173]</text>
  <text x="220" y="112" text-anchor="middle" font-size="7" fill="#8a8580">Y  ∈ [80,220]</text>
  <line x1="280" y1="85" x2="310" y2="85" stroke="#c4a064" stroke-width="1.2" marker-end="url(#arw15)"/>
  <!-- Blend factor -->
  <rect x="310" y="55" width="100" height="60" rx="5" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
  <text x="360" y="78" text-anchor="middle" font-size="9" fill="#4a7ab5" font-weight="500">Blend α</text>
  <text x="360" y="95" text-anchor="middle" font-size="7" fill="#8a8580">skin → α=0 (不調)</text>
  <text x="360" y="107" text-anchor="middle" font-size="7" fill="#8a8580">non-skin → α=1</text>
  <line x1="410" y1="85" x2="440" y2="85" stroke="#4a7ab5" stroke-width="1.2" marker-end="url(#arw15)"/>
  <!-- Saturation adjust -->
  <rect x="440" y="55" width="130" height="60" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="505" y="78" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">Saturation Adj</text>
  <text x="505" y="95" text-anchor="middle" font-size="7" fill="#8a8580">S_eff = 1 + α×(S-1)</text>
  <text x="505" y="107" text-anchor="middle" font-size="7" fill="#8a8580">Cb'=(Cb-128)×S_eff+128</text>
  <!-- Detail text -->
  <text x="300" y="160" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">膚色偵測的 Cb-Cr 範圍圖</text>
  <!-- Cb-Cr plane -->
  <rect x="150" y="170" width="160" height="90" rx="4" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="1"/>
  <text x="230" y="268" text-anchor="middle" font-size="8" fill="#5a5550">Cb axis</text>
  <text x="130" y="215" text-anchor="middle" font-size="8" fill="#5a5550" transform="rotate(-90,130,215)">Cr axis</text>
  <!-- Skin region ellipse -->
  <ellipse cx="215" cy="215" rx="30" ry="20" fill="rgba(196,160,100,0.25)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="215" y="218" text-anchor="middle" font-size="8" fill="#c4a064">膚色區域</text>
  <!-- Transition zone -->
  <ellipse cx="215" cy="215" rx="45" ry="32" fill="none" stroke="#c4a064" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="275" y="200" font-size="7" fill="#8a8580">漸變過渡帶</text>
  <!-- Formula -->
  <text x="430" y="185" text-anchor="middle" font-size="9" fill="#5a5550">過渡帶公式：</text>
  <text x="430" y="205" text-anchor="middle" font-size="8" fill="#8a8580">d = distance to skin center</text>
  <text x="430" y="220" text-anchor="middle" font-size="8" fill="#8a8580">α = smoothstep(r_inner, r_outer, d)</text>
  <text x="430" y="240" text-anchor="middle" font-size="8" fill="#8a8580">確保膚色邊界不出現</text>
  <text x="430" y="255" text-anchor="middle" font-size="8" fill="#8a8580">突兀的飽和度跳變</text>
  <defs><marker id="arw15" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 4-15：膚色保護飽和度調整的硬體流程</div></div>

<h3>Hue-Selective Saturation</h3>
<p>進階的飽和度調整可以針對不同色相（Hue）施加不同的飽和度因子。例如：增強藍天的飽和度、保持膚色不變、降低黃綠色的飽和度。硬體上通常將色相空間分為 6~12 個扇區，每個扇區有獨立的飽和度因子，扇區之間進行線性內插以避免突變。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
飽和度調整看似簡單，但在硬體設計中有兩個關鍵挑戰：(1) 保色相——簡單的 Cb/Cr Scale 會在高飽和度區域造成色相偏移。(2) 邊界處理——飽和度增加後，YCbCr 值可能超出合法範圍（特別是 Limited Range），需要 Gamut Clipping 或 Gamut Mapping。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
飽和度調整的位置很重要。在 Gamma 之前（線性域）做飽和度調整，效果類似於 CCM 的 Off-diagonal 增強。在 Gamma 之後（非線性域）做飽和度調整，對人眼感知更均勻。大部分 ISP 選擇在 Gamma 之後進行飽和度調整，但也有 ISP 在兩處都提供調整點。
</div>
`,
      keyPoints: [
        "YCbCr 域飽和度調整只需 2 個乘法器，簡單高效",
        "RGB 域飽和度矩陣可與 CCM 合併為一個 3×3 矩陣",
        "保色相飽和度需 CORDIC 或 LUT 實現極坐標轉換",
        "膚色保護透過偵測 Cb/Cr 範圍和 Blend Factor 實現",
        "Hue-Selective Saturation 將色相空間分扇區獨立調整"
      ]
    },
    {
      id: "ch4_16",
      title: "3D LUT 硬體實現 3D LUT Hardware Implementation",
      content: `
<h3>3D LUT 概述</h3>
<p>3D Look-Up Table（3D LUT）是 ISP 色彩處理中最靈活的工具。一張 3D LUT 可以實現任意的色彩映射，包括 CCM、Gamma、飽和度調整、色相旋轉等所有操作的綜合效果。它將三維 RGB 輸入空間均勻分割為網格，每個網格頂點儲存對應的輸出 RGB 值，中間值透過插值計算。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="350" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">3D LUT 硬體架構</text>
  <!-- 3D Grid visualization -->
  <g transform="translate(50,50)">
    <text x="80" y="0" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">3D Grid (17×17×17 示意)</text>
    <!-- Simple 3D cube wireframe -->
    <polygon points="20,120 120,120 120,20 20,20" fill="none" stroke="#d5cec7" stroke-width="1"/>
    <polygon points="20,20 50,5 150,5 120,20" fill="none" stroke="#d5cec7" stroke-width="1"/>
    <polygon points="120,20 150,5 150,105 120,120" fill="none" stroke="#d5cec7" stroke-width="1"/>
    <!-- Grid lines -->
    <line x1="53" y1="120" x2="53" y2="20" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="86" y1="120" x2="86" y2="20" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="20" y1="53" x2="120" y2="53" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="20" y1="86" x2="120" y2="86" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Grid points -->
    <circle cx="20" cy="20" r="2.5" fill="#c4a064"/>
    <circle cx="53" cy="20" r="2.5" fill="#c4a064"/>
    <circle cx="86" cy="20" r="2.5" fill="#c4a064"/>
    <circle cx="120" cy="20" r="2.5" fill="#c4a064"/>
    <circle cx="20" cy="53" r="2.5" fill="#c4a064"/>
    <circle cx="53" cy="53" r="2.5" fill="#c4a064"/>
    <circle cx="120" cy="53" r="2.5" fill="#c4a064"/>
    <circle cx="20" cy="86" r="2.5" fill="#c4a064"/>
    <circle cx="120" cy="86" r="2.5" fill="#c4a064"/>
    <circle cx="20" cy="120" r="2.5" fill="#c4a064"/>
    <circle cx="120" cy="120" r="2.5" fill="#c4a064"/>
    <!-- Axes labels -->
    <text x="70" y="140" text-anchor="middle" font-size="8" fill="#c44040">R</text>
    <text x="5" y="70" text-anchor="middle" font-size="8" fill="#40a040">G</text>
    <text x="150" y="0" text-anchor="middle" font-size="8" fill="#4a7ab5">B</text>
  </g>
  <!-- Hardware pipeline -->
  <g transform="translate(230,50)">
    <text x="170" y="0" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">硬體 Pipeline</text>
    <!-- Address calc -->
    <rect x="20" y="15" width="120" height="45" rx="5" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="80" y="33" text-anchor="middle" font-size="8" fill="#c4a064" font-weight="500">Address Generator</text>
    <text x="80" y="47" text-anchor="middle" font-size="7" fill="#8a8580">R[11:8]→idx, R[7:0]→frac</text>
    <!-- SRAM -->
    <line x1="80" y1="60" x2="80" y2="75" stroke="#c4a064" stroke-width="1"/>
    <rect x="10" y="75" width="130" height="50" rx="5" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="75" y="95" text-anchor="middle" font-size="8" fill="#4a7ab5" font-weight="500">SRAM (8 vertices)</text>
    <text x="75" y="110" text-anchor="middle" font-size="7" fill="#8a8580">8 read ports or 2-cycle</text>
    <!-- Interpolation -->
    <line x1="80" y1="125" x2="80" y2="140" stroke="#4a7ab5" stroke-width="1"/>
    <rect x="0" y="140" width="150" height="50" rx="5" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="75" y="160" text-anchor="middle" font-size="8" fill="#6a8a7a" font-weight="500">3D Interpolation</text>
    <text x="75" y="175" text-anchor="middle" font-size="7" fill="#8a8580">Trilinear / Tetrahedral</text>
    <!-- Output -->
    <line x1="75" y1="190" x2="75" y2="210" stroke="#6a8a7a" stroke-width="1"/>
    <rect x="20" y="210" width="120" height="35" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="80" y="232" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">RGB Output</text>
  </g>
  <!-- Memory calculation -->
  <g transform="translate(30,270)">
    <rect x="0" y="0" width="540" height="65" rx="6" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <text x="270" y="18" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">SRAM 容量計算</text>
    <text x="20" y="36" font-size="8" fill="#8a8580">17×17×17 grid × 3 channels × 12 bits = 17³ × 36 = 176,868 bits ≈ 22 KB</text>
    <text x="20" y="52" font-size="8" fill="#8a8580">33×33×33 grid × 3 channels × 12 bits = 33³ × 36 = 1,292,436 bits ≈ 158 KB</text>
  </g>
</svg><div class="caption">圖 4-16：3D LUT 硬體架構與 SRAM 容量計算</div></div>

<h3>Trilinear vs Tetrahedral 插值</h3>
<p>3D LUT 的核心計算是三維插值。兩種主流方法：</p>

<div class="table-container"><table>
<tr><th>特性</th><th>Trilinear</th><th>Tetrahedral</th></tr>
<tr><td>原理</td><td>三軸分別做線性插值</td><td>將 Cube 分為 6 個四面體，在對應四面體內插值</td></tr>
<tr><td>頂點數</td><td>8 個（整個 Cube）</td><td>4 個（所在四面體）</td></tr>
<tr><td>乘法次數</td><td>7 次乘法</td><td>3 次乘法 + 3 次加法</td></tr>
<tr><td>SRAM 讀取</td><td>8 次讀取</td><td>4 次讀取</td></tr>
<tr><td>精度</td><td>Cube 中心附近較好</td><td>更均勻，灰軸附近更好</td></tr>
<tr><td>硬體複雜度</td><td>較高（8 port SRAM 或多 cycle）</td><td>較低（4 port 即可）</td></tr>
</table></div>

<p>大部分 ISP 選擇 Tetrahedral 插值，因為它的硬體成本更低、灰軸精度更好（灰色像素走 Cube 的主對角線，Tetrahedral 的頂點正好在這條線上）。</p>

<h3>Memory Layout 優化</h3>
<p>3D LUT 的 SRAM 存取模式是確定性的（由 RGB 輸入值決定），因此可以針對存取模式優化 Memory Layout：</p>
<ul>
<li><strong>Bank Interleaving</strong>：將 8 個 Cube 頂點分佈在不同 SRAM Bank，實現單 cycle 讀取</li>
<li><strong>Dual-port SRAM</strong>：使用 2 個 Dual-port SRAM，每 cycle 可讀 4 個頂點</li>
<li><strong>Prefetch Buffer</strong>：利用像素掃描的局部性，預取相鄰 Cube 的數據</li>
<li><strong>壓縮儲存</strong>：對 LUT 數據做差分編碼，減少 SRAM 位寬</li>
</ul>

<h3>Grid Size 的選擇</h3>
<p>常見的 Grid Size 和對應的 SRAM 需求：</p>
<ul>
<li><strong>9×9×9</strong>：2.7 KB，精度有限，只適合簡單的色彩風格化</li>
<li><strong>17×17×17</strong>：22 KB，最常見的選擇，平衡精度和成本</li>
<li><strong>33×33×33</strong>：158 KB，高精度需求（如 HDR、廣色域）</li>
<li><strong>65×65×65</strong>：1.2 MB，極致精度，只在專業影像處理設備中使用</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
3D LUT 的威力在於它能實現任意非線性色彩映射。但它的缺點是：(1) SRAM 面積隨 Grid Size 的三次方增長。(2) 無法像矩陣那樣輕鬆在不同色溫間內插——兩張 3D LUT 的線性混合不等於兩種色彩映射的混合。因此，在需要隨色溫連續變化的場景（如 AWB），CCM 仍然比 3D LUT 更靈活。
</div>

<div class="info-box example">
<div class="box-title">設計範例</div>
一個 17³ Tetrahedral 3D LUT 的典型延遲分析：Cycle 1 — Address 計算和四面體判定。Cycle 2 — SRAM 讀取 4 個頂點。Cycle 3 — 三次乘法 + 加法完成插值。總延遲 = 3 clock cycles。在 500 MHz 時鐘下，完全可以支援 4K@60fps（像素率 ≈ 600 Mpixel/s）的即時處理。
</div>
`,
      keyPoints: [
        "3D LUT 可實現任意色彩映射，是最靈活的色彩處理工具",
        "Tetrahedral 插值比 Trilinear 硬體成本低、灰軸精度更好",
        "17×17×17 是最常見的 Grid Size，需約 22 KB SRAM",
        "SRAM 存取可透過 Bank Interleaving 實現單 cycle 讀取",
        "3D LUT 的缺點是無法像 CCM 那樣在不同色溫間連續插值"
      ]
    },
    {
      id: "ch4_17",
      title: "色溫追蹤與 AWB 收斂策略 Color Temperature Tracking",
      content: `
<h3>色溫追蹤的挑戰</h3>
<p>在連續拍攝（Video）模式下，AWB 不僅需要準確估計色溫，還需要平順地追蹤場景光源變化。一個好的 AWB 系統應該做到：光源漸變時平滑過渡，光源突變時快速收斂，穩定場景中不抖動。這三個目標相互矛盾，需要精心設計的控制策略。</p>

<h3>AWB 狀態機設計</h3>
<p>實務中的 AWB 控制器通常包含一個狀態機（FSM），根據場景變化程度切換不同的收斂策略：</p>

<div class="table-container"><table>
<tr><th>狀態</th><th>觸發條件</th><th>收斂行為</th><th>典型 α 值</th></tr>
<tr><td>Stable</td><td>連續 N 幀色溫變化 < T1</td><td>極慢更新或鎖定</td><td>0.02~0.05</td></tr>
<tr><td>Tracking</td><td>色溫變化 ∈ [T1, T2]</td><td>正常速度追蹤</td><td>0.1~0.2</td></tr>
<tr><td>Fast Converge</td><td>色溫變化 > T2 或場景切換</td><td>快速收斂</td><td>0.3~0.5</td></tr>
<tr><td>Initial</td><td>開機或模式切換</td><td>最快速收斂</td><td>0.5~1.0</td></tr>
</table></div>

<h3>Temporal Filtering（時間濾波）</h3>
<p>AWB Gain 的更新使用 IIR 濾波器進行平滑：</p>
<div class="formula">
Gain[n] = α × Gain_target + (1 - α) × Gain[n-1]
</div>
<p>其中 α 是收斂速率，Gain_target 是當前幀統計計算出的目標 Gain。α 越大收斂越快但越容易抖動。自適應 α 的策略：</p>
<ul>
<li>當 |Gain_target - Gain[n-1]| 大時，增大 α（快速反應）</li>
<li>當 |Gain_target - Gain[n-1]| 小時，減小 α（穩定不抖動）</li>
<li>當偵測到場景切換（大面積亮度/色彩突變）時，α 設為最大值</li>
</ul>

<h3>Hysteresis（遲滯效應）</h3>
<p>為了避免 AWB 在兩個色溫之間來回跳動（oscillation），引入遲滯機制：</p>
<ul>
<li><strong>色溫域遲滯</strong>：只有當新的色溫估計與當前值差異超過閾值時，才開始更新</li>
<li><strong>空間遲滯</strong>：在 R/G vs B/G 空間中，當前白點必須離開一個「鎖定區域」才觸發更新</li>
<li><strong>時間遲滯</strong>：場景變化必須持續 N 幀以上，才判定為真正的光源變化（排除短暫遮擋）</li>
</ul>

<h3>Anti-Flicker 防閃爍</h3>
<p>在 50Hz/60Hz 人造光源下，感測器曝光時間若非整數倍的光源週期，則每幀的統計色溫會隨相位不同而波動。Anti-Flicker 策略：</p>
<ul>
<li><strong>曝光時間控制</strong>：AE 模組將曝光時間鎖定為光源週期的整數倍（如 10ms 的倍數，對應 50Hz）</li>
<li><strong>多幀平均</strong>：對 AWB 統計資料進行 2~4 幀的移動平均，消除週期性波動</li>
<li><strong>頻率偵測</strong>：硬體可偵測統計資料中的 50Hz/60Hz 週期成分，自動切換防閃策略</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
AWB 收斂策略的設計本質上是控制理論的應用。核心矛盾是「速度 vs 穩定性」。太快的收斂會造成抖動（overshoot），太慢的收斂會讓使用者感覺 AWB 反應遲鈍。自適應 α 和狀態機是解決這個矛盾的關鍵工具。
</div>

<h3>場景切換偵測</h3>
<p>快速偵測場景切換可以讓 AWB 更快地收斂到正確色溫。常用的偵測指標：</p>
<ul>
<li><strong>亮度突變</strong>：AE 統計的全局亮度在一幀內變化超過閾值</li>
<li><strong>色溫突變</strong>：AWB 統計的 R/G、B/G 均值在一幀內大幅變化</li>
<li><strong>直方圖突變</strong>：色彩直方圖的分佈形狀急劇改變</li>
<li><strong>運動資訊</strong>：來自 Motion Estimation 模組的全域運動量（大面積平移表示可能的場景切換）</li>
</ul>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在實際產品中，AWB 收斂策略的參數往往需要大量場景測試來調整。建議建立一套自動化測試系統，使用數百個標準場景序列（包含室內外轉換、日光/鎢絲燈切換、混合光源等），自動評估 AWB 的收斂速度和穩定性，計算每個場景的色溫誤差和收斂幀數。
</div>
`,
      keyPoints: [
        "AWB 狀態機根據場景變化程度切換收斂速率",
        "IIR 濾波器的自適應 α 平衡速度與穩定性",
        "遲滯機制（色溫域、空間域、時間域）防止來回跳動",
        "Anti-Flicker 需配合曝光時間控制和多幀平均",
        "場景切換偵測結合亮度、色溫、直方圖和運動資訊"
      ]
    },
    {
      id: "ch4_18",
      title: "ISP 色彩校正 Tuning 參數 CCM Tuning Parameters",
      content: `
<h3>CCM Tuning 流程概述</h3>
<p>CCM 的校正（Calibration）和調校（Tuning）是 ISP 色彩品質的核心工作。一組好的 CCM 參數可以讓色彩準確、自然；一組差的參數則會導致膚色偏綠、紅色過飽和等問題。CCM Tuning 需要在多種標準光源下進行，並考慮不同色溫之間的平滑過渡。</p>

<h3>Per-Illuminant CCM 校正</h3>
<p>每種光源下的最佳 CCM 是不同的，因為 Sensor 的光譜響應函數不隨光源改變，但場景中物體的顏色外觀（在不同光源下）會改變。典型的校正光源組合：</p>

<div class="table-container"><table>
<tr><th>光源</th><th>色溫</th><th>CIE 標準</th><th>典型應用場景</th></tr>
<tr><td>Horizon (A)</td><td>2856K</td><td>CIE Illuminant A</td><td>白熾燈、暖色室內</td></tr>
<tr><td>CWF/TL84</td><td>3500-4100K</td><td>CIE F2/F11</td><td>辦公室、商場日光燈</td></tr>
<tr><td>D50</td><td>5000K</td><td>CIE D50</td><td>印刷標準光源</td></tr>
<tr><td>D65</td><td>6500K</td><td>CIE D65</td><td>日光、顯示器白點</td></tr>
<tr><td>D75</td><td>7500K</td><td>CIE D75</td><td>陰天、北方日光</td></tr>
</table></div>

<h3>CCM 校正方法</h3>
<p>使用 Macbeth ColorChecker（24 色卡）進行校正。流程如下：</p>
<ol>
<li>在標準光源下拍攝 Macbeth 色卡</li>
<li>擷取 24 個色塊的 Raw RGB 平均值</li>
<li>減去黑電平（BLC），應用 LSC 和 WB Gain</li>
<li>以最小化 ΔE（色差）為目標，使用最小平方法（Least Squares）或最佳化演算法求解 CCM 係數</li>
<li>驗證：計算每個色塊的 ΔE00，確認 Mean ΔE00 < 2.0，Max ΔE00 < 5.0</li>
</ol>

<div class="formula">
最佳化目標：min Σ ΔE00²(Lab_measured, Lab_target)<br>
約束條件：CCM 行和 = 1（保白性），係數範圍 ∈ [-2, 3]
</div>

<h3>多光源 CCM 插值</h3>
<p>ISP 在不同色溫下需要使用不同的 CCM。AWB 估計出當前色溫後，在最近的兩組 CCM 之間進行線性插值：</p>
<div class="formula">
CCM_current = w × CCM_low + (1 - w) × CCM_high<br>
w = (CT_high - CT_current) / (CT_high - CT_low)
</div>
<p>其中 CT 為色溫值。注意：直接對 CCM 係數做線性插值在數學上是正確的（線性映射的線性組合仍是線性映射），但可能在中間色溫產生略微不理想的色彩。某些高階 ISP 存儲 5 組以上的 CCM，以減少插值距離。</p>

<h3>AWB 與 CCM 的聯動</h3>
<p>AWB 和 CCM 在 ISP 中是緊密耦合的：</p>
<ul>
<li>AWB 先估計色溫 → 選擇對應的 CCM</li>
<li>CCM 的效果影響 AWB 統計 → AWB 統計應在 CCM 之前取樣（pre-CCM statistics）</li>
<li>WB Gain 和 CCM 都在線性域運算，理論上可以合併為一個矩陣</li>
<li>但實務中分開處理更靈活：WB Gain 每幀更新，CCM 只在色溫變化時切換</li>
</ul>

<h3>Golden Sample 校正</h3>
<p>量產時，每顆 Sensor 的光譜響應會有差異（Module-to-Module Variation）。Golden Sample 校正流程：</p>
<ol>
<li>選擇一顆「黃金樣品」Sensor，進行完整的多光源 CCM 校正</li>
<li>對每顆量產模組進行簡化校正（如只在 D65 下校正）</li>
<li>計算量產模組與黃金樣品之間的「偏差矩陣」</li>
<li>用偏差矩陣修正黃金樣品的 CCM，得到每顆模組的專屬 CCM</li>
<li>將校正結果寫入模組的 OTP（One-Time Programmable）記憶體</li>
</ol>

<div class="info-box key">
<div class="box-title">核心概念</div>
CCM Tuning 的終極目標不僅是最小化 ΔE，還要考慮「視覺品質」。有時數值上 ΔE 最小的 CCM 在主觀評估中不是最好看的——因為人眼對不同顏色的容忍度不同。膚色、天空、草地等「記憶色」（Memory Color）的偏差比其他顏色更容易被察覺。因此，高階 Tuning 會對記憶色施加更高的權重。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
CCM 校正時的常見錯誤：(1) 忘記先做 BLC 和 LSC 校正，導致 CCM 試圖補償黑電平和 Shading 的影響。(2) WB Gain 和 CCM 的順序搞反。(3) 在非標準光源下校正（如使用普通 LED 燈而非標準 D65 燈箱）。(4) Macbeth 色卡老化褪色但未更換。這些錯誤都會導致 CCM 不準確。
</div>
`,
      keyPoints: [
        "CCM 需在多種標準光源（A/TL84/D50/D65/D75）下分別校正",
        "校正使用 Macbeth 色卡，以最小化 ΔE00 為目標",
        "不同色溫的 CCM 之間可進行線性插值",
        "Golden Sample 校正用於修正量產模組之間的光譜差異",
        "高階 Tuning 對記憶色（膚色、天空）施加更高權重"
      ]
    },
    {
      id: "ch4_19",
      title: "膚色保護與特殊色處理 Skin Tone & Memory Color",
      content: `
<h3>記憶色的重要性</h3>
<p>人類視覺系統對某些特定顏色有強烈的「記憶」和期望。這些顏色稱為「記憶色」（Memory Color），包括膚色、天空藍、草地綠、黃色/紅色水果等。即使色彩數值上完全準確（ΔE ≈ 0），如果這些顏色不符合人的心理期望，使用者仍會覺得「不好看」。因此，ISP 色彩處理不只追求色彩準確性，更要追求「記憶色增強」。</p>

<h3>膚色保護機制</h3>
<p>膚色是所有記憶色中最重要的。人眼對膚色的偏差極為敏感——即使只有 ΔE ≈ 2 的偏差，也能被輕易察覺。膚色保護的完整流程：</p>

<h4>Step 1: 膚色偵測</h4>
<p>在 YCbCr 或 RGB 色彩空間中定義膚色區域。不同人種的膚色在 Cb-Cr 空間中的分佈有差異，但核心區域高度重疊：</p>

<div class="table-container"><table>
<tr><th>膚色區域</th><th>Cb 範圍 (8-bit)</th><th>Cr 範圍 (8-bit)</th><th>Y 範圍 (8-bit)</th></tr>
<tr><td>核心區域</td><td>77 ~ 127</td><td>133 ~ 173</td><td>80 ~ 220</td></tr>
<tr><td>擴展區域</td><td>70 ~ 135</td><td>125 ~ 185</td><td>50 ~ 240</td></tr>
<tr><td>橢圓模型中心</td><td>Cb=109</td><td>Cr=152</td><td>—</td></tr>
</table></div>

<h4>Step 2: 膚色置信度計算</h4>
<p>不是二元判斷（是/否膚色），而是計算一個 0~1 的置信度（Confidence）值。使用橢圓距離模型：</p>
<div class="formula">
d² = ((Cb - Cb_center)/σ_cb)² + ((Cr - Cr_center)/σ_cr)²<br>
Confidence = max(0, 1 - d/r_max)
</div>

<h4>Step 3: 選擇性處理</h4>
<p>根據 Confidence 值，混合「正常處理」和「膚色友好處理」：</p>
<ul>
<li>飽和度：膚色區域使用較低的飽和度增益，避免膚色過紅</li>
<li>色相：膚色區域的色相不做調整，或僅做微小的暖色偏移</li>
<li>降噪：膚色區域使用較強的 Chroma NR，讓膚色更乾淨</li>
<li>銳化：膚色區域降低銳化強度，避免毛孔和瑕疵被強調</li>
</ul>

<h3>天空增強</h3>
<p>藍色天空是另一個重要的記憶色。人們期望天空呈現純淨、鮮豔的藍色。天空偵測和增強的策略：</p>
<ul>
<li><strong>偵測</strong>：高亮度 + 高 B/G ratio + 低紋理（天空通常是平滑的）</li>
<li><strong>增強</strong>：增加藍色區域的飽和度、微調色相朝向純藍（240°）</li>
<li><strong>注意</strong>：過度增強會導致天空出現色帶（Banding），特別是低 bit depth 時</li>
</ul>

<h3>草地/植物增強</h3>
<p>綠色植物的增強需要謹慎。過度增加綠色飽和度會讓草地看起來像人工草坪。推薦策略：</p>
<ul>
<li>略微增加黃綠色（90°~120° Hue）的飽和度</li>
<li>微調色相朝向鮮綠色（避免偏黃或偏藍綠）</li>
<li>保持暗部綠色的自然感，只增強中等亮度的綠色</li>
</ul>

<h3>Hue-Selective Processing 硬體架構</h3>
<p>上述所有的選擇性處理可以統一在一個 Hue-Selective 框架中實現。硬體架構的核心是一個「色相分類器」和「Per-Hue 參數集」：</p>

<div class="diagram"><svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="250" rx="8"/>
  <text x="300" y="25" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="500">Hue-Selective Processing 硬體架構</text>
  <!-- Hue wheel simplified -->
  <g transform="translate(100,140)">
    <circle cx="0" cy="0" r="70" fill="none" stroke="#d5cec7" stroke-width="1"/>
    <!-- Hue sectors -->
    <line x1="0" y1="0" x2="70" y2="0" stroke="#c44040" stroke-width="1.5"/>
    <text x="78" y="4" font-size="7" fill="#c44040">0° Red</text>
    <line x1="0" y1="0" x2="35" y2="-60" stroke="#c4a064" stroke-width="1.5"/>
    <text x="40" y="-62" font-size="7" fill="#c4a064">60° Yellow</text>
    <line x1="0" y1="0" x2="-35" y2="-60" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="-80" y="-62" font-size="7" fill="#6a8a7a">120° Green</text>
    <line x1="0" y1="0" x2="-70" y2="0" stroke="#4a9a9a" stroke-width="1.5"/>
    <text x="-95" y="4" font-size="7" fill="#4a9a9a">180° Cyan</text>
    <line x1="0" y1="0" x2="-35" y2="60" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="-80" y="68" font-size="7" fill="#4a7ab5">240° Blue</text>
    <line x1="0" y1="0" x2="35" y2="60" stroke="#8a5aaa" stroke-width="1.5"/>
    <text x="40" y="68" font-size="7" fill="#8a5aaa">300° Magenta</text>
    <text x="0" y="95" text-anchor="middle" font-size="8" fill="#5a5550">6-sector Hue Wheel</text>
  </g>
  <!-- Per-hue parameters -->
  <g transform="translate(250,50)">
    <rect x="0" y="0" width="310" height="170" rx="6" fill="rgba(213,206,199,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <text x="155" y="20" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Per-Hue 參數表</text>
    <text x="15" y="42" font-size="8" fill="#8a8580">Sector</text>
    <text x="70" y="42" font-size="8" fill="#8a8580">Sat Gain</text>
    <text x="130" y="42" font-size="8" fill="#8a8580">Hue Shift</text>
    <text x="195" y="42" font-size="8" fill="#8a8580">Luma Gain</text>
    <text x="260" y="42" font-size="8" fill="#8a8580">Protect</text>
    <line x1="10" y1="48" x2="300" y2="48" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="62" font-size="8" fill="#c44040">Red</text>
    <text x="80" y="62" font-size="8" fill="#5a5550">1.1</text>
    <text x="140" y="62" font-size="8" fill="#5a5550">-3°</text>
    <text x="205" y="62" font-size="8" fill="#5a5550">1.0</text>
    <text x="265" y="62" font-size="8" fill="#5a5550">Skin</text>
    <text x="15" y="78" font-size="8" fill="#c4a064">Yellow</text>
    <text x="80" y="78" font-size="8" fill="#5a5550">1.0</text>
    <text x="140" y="78" font-size="8" fill="#5a5550">0°</text>
    <text x="205" y="78" font-size="8" fill="#5a5550">1.05</text>
    <text x="265" y="78" font-size="8" fill="#5a5550">—</text>
    <text x="15" y="94" font-size="8" fill="#6a8a7a">Green</text>
    <text x="80" y="94" font-size="8" fill="#5a5550">1.15</text>
    <text x="140" y="94" font-size="8" fill="#5a5550">+5°</text>
    <text x="205" y="94" font-size="8" fill="#5a5550">1.0</text>
    <text x="265" y="94" font-size="8" fill="#5a5550">—</text>
    <text x="15" y="110" font-size="8" fill="#4a9a9a">Cyan</text>
    <text x="80" y="110" font-size="8" fill="#5a5550">1.0</text>
    <text x="140" y="110" font-size="8" fill="#5a5550">0°</text>
    <text x="205" y="110" font-size="8" fill="#5a5550">1.0</text>
    <text x="265" y="110" font-size="8" fill="#5a5550">—</text>
    <text x="15" y="126" font-size="8" fill="#4a7ab5">Blue</text>
    <text x="80" y="126" font-size="8" fill="#5a5550">1.2</text>
    <text x="140" y="126" font-size="8" fill="#5a5550">-2°</text>
    <text x="205" y="126" font-size="8" fill="#5a5550">0.95</text>
    <text x="265" y="126" font-size="8" fill="#5a5550">Sky</text>
    <text x="15" y="142" font-size="8" fill="#8a5aaa">Magenta</text>
    <text x="80" y="142" font-size="8" fill="#5a5550">0.9</text>
    <text x="140" y="142" font-size="8" fill="#5a5550">0°</text>
    <text x="205" y="142" font-size="8" fill="#5a5550">1.0</text>
    <text x="265" y="142" font-size="8" fill="#5a5550">—</text>
    <text x="155" y="165" text-anchor="middle" font-size="7" fill="#8a8580">扇區間使用線性內插避免色彩突變</text>
  </g>
</svg><div class="caption">圖 4-19：Hue-Selective Processing 的色相分區與參數表</div></div>

<div class="info-box key">
<div class="box-title">核心概念</div>
記憶色處理是 ISP 色彩品質從「準確」到「好看」的關鍵跳躍。工程師需要理解：色彩準確性（ΔE）是基礎，但最終決定影像品質的是「人眼感受」。不同品牌的手機有不同的色彩風格（如三星偏鮮豔、Apple 偏自然），這些差異很大程度上來自記憶色處理策略的不同。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
膚色偵測的 Cb-Cr 範圍需要根據目標市場調整。亞洲膚色的 Cb-Cr 分佈中心與歐洲膚色略有不同，非洲膚色的亮度範圍更寬。建議使用多人種的膚色資料庫來建立穩健的膚色模型。此外，化妝、紋身、光影效果都會影響膚色偵測，需要在實際場景中反覆驗證。
</div>
`,
      keyPoints: [
        "記憶色（膚色、天空、草地）對影像品質的主觀感受至關重要",
        "膚色偵測使用 Cb-Cr 橢圓模型和置信度計算",
        "Hue-Selective Processing 將色相空間分為 6~12 個扇區獨立調整",
        "天空增強需注意 Banding 問題，草地增強需避免過度飽和",
        "不同品牌的色彩風格差異主要來自記憶色處理策略"
      ]
    },
    {
      id: "ch4_20",
      title: "HDR 色彩處理 Color Processing for HDR",
      content: `
<h3>HDR 色彩處理的獨特挑戰</h3>
<p>High Dynamic Range（HDR）影像的色彩處理與 SDR 有本質不同。HDR 的動態範圍可達 10,000 nits 以上（SDR 通常只有 100~300 nits），色域通常使用 BT.2020 或 DCI-P3（比 sRGB 大得多）。這些擴展帶來了全新的色彩處理挑戰。</p>

<h3>Wide Color Gamut (WCG)</h3>
<p>HDR 內容通常搭配廣色域（WCG）。主要的色域標準比較：</p>

<div class="table-container"><table>
<tr><th>色域</th><th>覆蓋 CIE 1931 比例</th><th>典型用途</th><th>白點</th></tr>
<tr><td>sRGB / BT.709</td><td>35.9%</td><td>SDR 顯示、網頁</td><td>D65</td></tr>
<tr><td>DCI-P3</td><td>45.5%</td><td>數位電影、Apple 裝置</td><td>D65 (Display P3)</td></tr>
<tr><td>BT.2020</td><td>75.8%</td><td>UHD TV、HDR 內容</td><td>D65</td></tr>
<tr><td>Adobe RGB</td><td>52.1%</td><td>攝影、印刷</td><td>D65</td></tr>
</table></div>

<h3>PQ 與 HLG 傳輸曲線</h3>
<p>SDR 使用 Gamma 曲線（BT.1886），HDR 則使用兩種新的傳輸曲線（Transfer Function）：</p>

<h4>PQ (Perceptual Quantizer, SMPTE ST 2084)</h4>
<p>基於人眼的 Barten 模型設計，將 0~10,000 nits 的亮度映射到 10-bit 編碼空間。PQ 曲線的特點是在每個亮度級別都提供剛好能被人眼感知的最小量化步長，因此編碼效率最高。</p>
<div class="formula">
PQ EOTF: L = 10000 × [(max(V^(1/m2) - c1, 0)) / (c2 - c3×V^(1/m2))]^(1/m1)<br>
其中 m1=0.1593, m2=78.8438, c1=0.8359, c2=18.8516, c3=18.6875
</div>

<h4>HLG (Hybrid Log-Gamma, ARIB STD-B67)</h4>
<p>設計為向後相容 SDR 的 HDR 格式。低亮度區域使用類似 Gamma 的曲線，高亮度區域使用對數曲線。HLG 是 scene-referred（場景參考），不指定絕對亮度，由顯示端決定映射。</p>

<h3>Tone Mapping 與色彩的交互作用</h3>
<p>HDR 內容在 SDR 顯示器上顯示時需要 Tone Mapping（色調映射）。Tone Mapping 會壓縮亮度範圍，但如果只壓縮亮度不處理色彩，會出現以下問題：</p>
<ul>
<li><strong>飽和度下降</strong>：高亮度區域的色彩在 Tone Mapping 後飽和度降低</li>
<li><strong>色相偏移</strong>：不均勻的亮度壓縮導致 RGB 比例改變，引起色相偏移</li>
<li><strong>色彩斷裂</strong>：Tone Mapping 的非線性可能造成相鄰色彩的順序反轉</li>
</ul>

<p>解決方案是 「色彩保持 Tone Mapping」（Color-Preserving Tone Mapping）：</p>
<ol>
<li>將 RGB 分解為亮度 L 和色度 (a, b)（如在 ICtCp 或 IPT 空間中）</li>
<li>只對亮度 L 做 Tone Mapping → L'</li>
<li>根據 L'/L 的比值縮放色度，保持色相和相對飽和度</li>
<li>轉回 RGB</li>
</ol>

<h3>Color Volume Mapping</h3>
<p>HDR 的色彩處理需要考慮「色彩體積」（Color Volume）而非僅僅是 2D 色域。Color Volume 是三維的——包括色度 (x, y) 和亮度 (L)。不同亮度級別的可用色域大小不同：高亮度時可用色域縮小，低亮度時也縮小。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
HDR 色彩處理的核心思想轉變：從「2D 色域映射」到「3D 色彩體積映射」。SDR 時代只需要考慮平面的色域轉換（如 sRGB → P3），HDR 時代需要考慮不同亮度下的色域邊界都不同。ISP 中的 3D LUT 正好適合處理這種三維映射。
</div>

<h3>ISP 中的 HDR 色彩 Pipeline</h3>
<p>HDR ISP 的色彩處理 Pipeline 需要特別注意：</p>
<ul>
<li><strong>位寬</strong>：HDR 需要至少 12-bit（典型 14-16 bit），SDR 用 8-10 bit 即可</li>
<li><strong>CCM</strong>：在線性域處理，目標色域可能是 BT.2020 而非 sRGB</li>
<li><strong>Gamma</strong>：替換為 PQ 或 HLG 曲線，LUT 的精度需求更高（至少 12-bit 輸入）</li>
<li><strong>色域映射</strong>：需要 BT.2020 → Display P3 或 sRGB 的映射（大部分顯示器不支援完整 BT.2020）</li>
<li><strong>Metadata</strong>：需要生成/傳遞 HDR Metadata（MaxCLL、MaxFALL、Mastering Display Info）</li>
</ul>

<div class="info-box tip">
<div class="box-title">實務提示</div>
調試 HDR 色彩時，最常見的問題是「在 SDR 螢幕上觀察 HDR 內容」。這會讓高亮度區域看起來過曝或色彩失真——這不是 ISP 的問題，而是觀察環境的問題。建議使用支援 HDR10/Dolby Vision 的專業監控顯示器來進行 HDR 色彩調校。
</div>
`,
      keyPoints: [
        "HDR 色彩處理從 2D 色域映射擴展到 3D 色彩體積映射",
        "PQ 曲線基於人眼感知模型，HLG 向後相容 SDR",
        "Tone Mapping 需配合色彩保持策略避免飽和度下降和色相偏移",
        "HDR Pipeline 需要更高的位寬（12-16 bit）和更精確的 LUT",
        "BT.2020 廣色域到 Display P3/sRGB 的映射是實務中的必要步驟"
      ]
    },
    {
      id: "ch4_21",
      title: "色彩品質 Debug 與量測 Color Quality Debug",
      content: `
<h3>色彩品質量測指標</h3>
<p>ISP 色彩品質的客觀量測是 Tuning 和 Debug 的基礎。工程師需要理解各種色彩差異指標，才能量化「色彩準不準」這個問題。</p>

<h3>ΔE 色差公式</h3>
<p>CIE 定義了多種色差公式，精度和複雜度逐步提升：</p>

<div class="table-container"><table>
<tr><th>公式</th><th>年份</th><th>計算複雜度</th><th>特點</th></tr>
<tr><td>ΔE*ab (CIE76)</td><td>1976</td><td>低（歐氏距離）</td><td>簡單但不均勻，藍色區域敏感度過高</td></tr>
<tr><td>ΔE*94 (CIE94)</td><td>1994</td><td>中</td><td>加入色度和色相的權重因子</td></tr>
<tr><td>ΔE00 (CIEDE2000)</td><td>2000</td><td>高（含旋轉項）</td><td>最準確，業界標準，包含亮度/色度/色相權重 + 藍色區域旋轉修正</td></tr>
</table></div>

<p>ΔE 的感知意義（以 ΔE00 為例）：</p>
<ul>
<li><strong>ΔE00 < 1.0</strong>：人眼無法分辨差異（肉眼不可見）</li>
<li><strong>ΔE00 1.0 ~ 2.0</strong>：仔細觀察可以察覺微小差異</li>
<li><strong>ΔE00 2.0 ~ 5.0</strong>：明顯的色彩差異</li>
<li><strong>ΔE00 > 5.0</strong>：嚴重色偏，不可接受</li>
</ul>

<h3>Macbeth ColorChecker 分析</h3>
<p>Macbeth 24 色卡（X-Rite ColorChecker Classic）是 ISP 色彩校正和驗證的標準工具。使用流程：</p>
<ol>
<li>在標準光源下拍攝色卡（D65 燈箱，均勻照明）</li>
<li>擷取 24 個色塊的 RGB/YCbCr 值（取中心區域平均，避開邊緣）</li>
<li>轉換到 CIE Lab 色彩空間</li>
<li>與色卡的標準 Lab 值比較，計算每個色塊的 ΔE00</li>
<li>統計 Mean ΔE00、Max ΔE00、膚色色塊 ΔE00</li>
</ol>

<div class="table-container"><table>
<tr><th>品質等級</th><th>Mean ΔE00</th><th>Max ΔE00</th><th>膚色 ΔE00</th></tr>
<tr><td>優秀</td><td>< 1.5</td><td>< 3.0</td><td>< 1.5</td></tr>
<tr><td>良好</td><td>< 2.5</td><td>< 5.0</td><td>< 2.5</td></tr>
<tr><td>可接受</td><td>< 4.0</td><td>< 8.0</td><td>< 4.0</td></tr>
<tr><td>不合格</td><td>> 4.0</td><td>> 8.0</td><td>> 4.0</td></tr>
</table></div>

<h3>常見色彩 Debug 場景與失敗模式</h3>
<p>根據多年 ISP 調試經驗，以下是最常見的色彩問題和診斷方法：</p>

<h4>問題 1: 全局色偏（Color Cast）</h4>
<p><strong>症狀</strong>：整張影像偏某個顏色（偏綠、偏紅、偏藍）。<br>
<strong>診斷</strong>：拍攝灰卡，檢查 R/G/B 三通道的比值。若 R/G ≠ 1 或 B/G ≠ 1，表示 WB 不準。<br>
<strong>原因</strong>：AWB 演算法被大面積單色場景誤導，或 WB Gain 未正確應用。</p>

<h4>問題 2: 局部色偏（邊緣偏色）</h4>
<p><strong>症狀</strong>：影像中心色彩正確，但邊緣偏色。<br>
<strong>診斷</strong>：拍攝白卡，觀察邊緣區域的 R/G、B/G 比值。<br>
<strong>原因</strong>：LSC（Lens Shading Correction）不準確，或 LSC 的色彩校正（Color Shading）被忽略。</p>

<h4>問題 3: 膚色偏綠</h4>
<p><strong>症狀</strong>：人臉膚色帶有綠色調。<br>
<strong>診斷</strong>：檢查 CCM 係數，特別是 G 通道的 Off-diagonal 元素。<br>
<strong>原因</strong>：CCM 校正時目標色彩空間的綠色基底不準確，或 CCM 插值出錯。</p>

<h4>問題 4: 飽和色失真</h4>
<p><strong>症狀</strong>：高飽和度的紅色/藍色物體顏色不正確（如紅玫瑰偏橙）。<br>
<strong>診斷</strong>：拍攝高飽和度色卡或真實物體，分析 Hue 偏移。<br>
<strong>原因</strong>：CCM 溢位處理（Clamp）導致高飽和區域色彩被截斷，或 Gamma 曲線在高值區域不合理。</p>

<h4>問題 5: AWB 閃爍</h4>
<p><strong>症狀</strong>：影片中色彩不斷微幅變化，如同呼吸般閃動。<br>
<strong>診斷</strong>：記錄每幀的 WB Gain 和色溫估計值，分析時間域波動。<br>
<strong>原因</strong>：AWB 收斂策略的 Dead Zone 太小，或防閃爍機制未啟用。</p>

<h3>Color Checker 工具與自動化</h3>
<p>建議建立自動化色彩測試系統：</p>
<ul>
<li><strong>自動色卡偵測</strong>：使用影像辨識自動定位色卡中的 24 個色塊</li>
<li><strong>自動 ΔE 計算</strong>：自動計算所有色塊的 ΔE00 並生成報告</li>
<li><strong>趨勢追蹤</strong>：在不同韌體版本之間比較色彩品質，防止退化</li>
<li><strong>多光源自動化</strong>：使用可程式化光源（Tunable LED），自動在多種色溫下測試</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
色彩 Debug 的黃金法則：「先灰後彩、先全域後局部、先客觀後主觀」。先用灰卡驗證 WB 和灰階 Linearity，確認無色偏。再用 Macbeth 色卡驗證 CCM 的色彩準確性。最後用真實場景進行主觀評估。按照這個順序，可以快速定位問題出在 Pipeline 的哪個環節。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
ΔE 量測的常見陷阱：(1) Macbeth 色卡的標準值因批次和老化而不同，務必使用實測的標準值而非理論值。(2) 拍攝時的光源必須均勻，不均勻照明會增加假的 ΔE。(3) 轉換到 Lab 空間時，必須明確使用的白點（D50 還是 D65）和觀察者角度（2° 還是 10°）。(4) 不同的 ΔE 公式（CIE76 vs CIEDE2000）結果差異很大，報告中必須明確使用的公式。
</div>
`,
      keyPoints: [
        "ΔE00 (CIEDE2000) 是業界標準色差公式，ΔE00 < 2.0 為良好品質",
        "Macbeth 24 色卡是 CCM 校正和驗證的標準工具",
        "常見色彩問題：全局色偏、邊緣偏色、膚色偏綠、飽和色失真、AWB 閃爍",
        "Debug 原則：先灰後彩、先全域後局部、先客觀後主觀",
        "自動化色彩測試系統可防止韌體版本更新導致色彩退化"
      ]
    },
    {
      id: "ch4_22",
      title: "車用與醫療色彩要求 Automotive & Medical Color Requirements",
      content: `
<h3>車用 ISP 色彩要求</h3>
<p>車用攝像頭（Automotive Camera）的色彩處理要求與消費級手機截然不同。車用場景優先考慮的是「一致性」和「可靠性」，而非「好看」。色彩處理必須確保駕駛輔助系統（ADAS）和自駕系統能正確辨識交通號誌、車燈、行人等關鍵物件。</p>

<h3>車用色彩一致性要求</h3>
<p>多攝像頭系統（環視、前視、側視）之間的色彩一致性至關重要。人眼在拼接影像中能輕易察覺色彩不一致：</p>

<div class="table-container"><table>
<tr><th>規格項目</th><th>消費級（手機）</th><th>車用（ADAS/AVM）</th></tr>
<tr><td>色溫一致性</td><td>無硬性要求</td><td>同一場景各攝像頭色溫差 < 200K</td></tr>
<tr><td>亮度一致性</td><td>無硬性要求</td><td>同一場景各攝像頭亮度差 < 10%</td></tr>
<tr><td>CCM 校正</td><td>通常 1-2 組</td><td>每顆模組獨立校正 + OTP 儲存</td></tr>
<tr><td>AWB 穩定性</td><td>容忍微幅波動</td><td>嚴格禁止閃爍，收斂後鎖定</td></tr>
<tr><td>溫度漂移補償</td><td>通常不做</td><td>-40°C ~ +105°C 全範圍補償</td></tr>
</table></div>

<h3>LED Flicker 處理</h3>
<p>現代交通號誌和車燈大量使用 LED，而 LED 以 PWM 方式驅動，閃爍頻率通常為 90~500 Hz。當攝像頭的曝光時間與 LED 的 PWM 頻率不同步時，拍攝到的 LED 亮度會隨幀變化（LED Flicker Mitigation, LFM）。</p>
<ul>
<li><strong>症狀</strong>：交通燈在影片中忽亮忽暗，甚至完全消失</li>
<li><strong>影響</strong>：ADAS 系統可能無法正確偵測紅綠燈狀態</li>
<li><strong>硬體解決方案</strong>：使用 Chopped HDR 或 Sub-frame 曝光技術，確保每幀至少有部分曝光時間覆蓋 LED 的亮周期</li>
<li><strong>色彩影響</strong>：LFM 模式下的多次曝光合成可能導致色彩不一致，需要在合成後重新校正 WB</li>
</ul>

<h3>車用色彩校正流程</h3>
<p>車用 ISP 的色彩校正流程比消費級更嚴格：</p>
<ol>
<li>在 EOL（End-of-Line）測試站進行每顆模組的 Golden Sample 校正</li>
<li>校正結果（CCM、WB Gain、LSC 參數）寫入模組 OTP 或 EEPROM</li>
<li>ISP 開機時讀取 OTP 數據，自動載入校正參數</li>
<li>運行時根據溫度感測器（NTC）動態調整參數補償熱漂移</li>
<li>定期進行 OTA（Over-The-Air）更新，修正長期漂移</li>
</ol>

<h3>醫療影像色彩要求</h3>
<p>醫療攝像頭（如內視鏡、手術顯微鏡、皮膚鏡）的色彩準確性直接影響醫師的診斷。色彩要求與車用和消費級都不同：</p>

<div class="table-container"><table>
<tr><th>要求項目</th><th>規格</th><th>原因</th></tr>
<tr><td>色彩準確性</td><td>Mean ΔE00 < 1.5</td><td>需準確呈現組織顏色（如辨別良性/惡性腫瘤）</td></tr>
<tr><td>色彩一致性</td><td>不同裝置間 ΔE00 < 2.0</td><td>不同醫師使用不同裝置應看到相同色彩</td></tr>
<tr><td>飽和度</td><td>禁止自動增強</td><td>飽和度增強可能改變組織外觀，影響診斷</td></tr>
<tr><td>白平衡</td><td>校正到光源色溫，不做審美偏移</td><td>醫療光源固定，不需要場景自適應 AWB</td></tr>
<tr><td>Gamma 曲線</td><td>可選用 DICOM GSDF</td><td>確保灰階在醫療顯示器上均勻可辨</td></tr>
</table></div>

<h3>色盲考量</h3>
<p>設計車用 HMI（Human-Machine Interface）和醫療影像顯示時，需考慮色覺缺陷（Color Vision Deficiency）：</p>
<ul>
<li><strong>紅綠色盲</strong>（Protanopia/Deuteranopia）：影響約 8% 男性。避免僅用紅/綠區分關鍵資訊</li>
<li><strong>ISP 色彩映射</strong>：某些醫療 ISP 提供「色盲模式」，將紅綠差異轉換為亮度或藍黃差異</li>
<li><strong>車用 HUD</strong>：車用抬頭顯示的色彩選擇需確保色盲使用者也能正確判讀</li>
</ul>

<h3>法規與標準</h3>
<p>車用和醫療領域有嚴格的色彩相關法規：</p>
<ul>
<li><strong>ISO 26262</strong>：車用功能安全標準。色彩處理錯誤若影響 ADAS 判斷，屬於安全相關故障</li>
<li><strong>IEC 62471</strong>：光生物安全標準。醫療用 LED 光源的色溫和光譜需符合安全要求</li>
<li><strong>IEC 62563-1</strong>：醫療顯示器校正標準。確保灰階和色彩呈現一致</li>
<li><strong>SAE J3016</strong>：自駕等級定義。不同等級對攝像頭色彩品質的要求不同</li>
<li><strong>ECE R48/R149</strong>：歐洲車燈法規。車用攝像頭需要能在法規範圍內正確辨識車燈色彩</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
車用和醫療 ISP 的色彩設計哲學是「準確和一致優先於好看」。消費級 ISP 追求的是讓使用者覺得照片「好看」（可以增強飽和度、美化膚色），而車用/醫療 ISP 追求的是讓色彩「忠實於真實場景」。這兩種需求的優化方向可能完全相反——消費級 ISP 的最佳參數用在車用場景可能是災難性的。
</div>

<div class="info-box example">
<div class="box-title">設計範例</div>
一個車用環視系統（AVM）的色彩一致性校正流程：(1) 在 EOL 站使用同一張標準灰卡和 Macbeth 色卡。(2) 四顆攝像頭分別校正 WB 和 CCM，目標值統一為同一個色彩空間。(3) 比較四顆攝像頭在相同色塊上的 Lab 值，確認 ΔE00 < 2.0。(4) 將校正參數和交叉校正偏差矩陣寫入 EEPROM。(5) ISP 運行時載入校正參數，確保拼接畫面色彩一致。
</div>
`,
      keyPoints: [
        "車用色彩要求一致性優先：多攝像頭色溫差需 < 200K",
        "LED Flicker 是車用攝像頭的獨特挑戰，需硬體級解決方案",
        "醫療影像禁止自動飽和度增強，色彩準確性 ΔE00 需 < 1.5",
        "色盲考量影響車用 HMI 和醫療顯示的色彩設計",
        "ISO 26262 等法規對車用色彩處理的可靠性有嚴格要求"
      ]
    }
  ]
};
