const CH6 = {
  title: "銳化 Sharpening",
  sections: [
    {
      id: "ch6_1",
      title: "為什麼需要銳化？MTF 與光學模糊",
      content: `
<h3>影像為何看起來「不夠銳」？</h3>
<p>在數位相機系統中，從光線進入鏡頭到最終記錄在 Sensor 上，影像會經歷多重模糊（Blur）的疊加效應。首先是<strong>光學繞射（Diffraction）</strong>，任何有限孔徑的鏡頭都無法產生完美的點像，而是形成所謂的 <strong>Airy Disk</strong>。其次是<strong>鏡頭像差（Aberration）</strong>，包含球面像差、色差、像散等，都會進一步擴大點擴散函數（PSF, Point Spread Function）。最後，<strong>Sensor 的空間取樣</strong>本身也帶來了模糊 — 每個像素會將落在其光敏面積上的光子做空間平均。此外，許多相機在 Sensor 前加裝<strong>光學低通濾波器（OLPF, Optical Low-Pass Filter）</strong>以抑制摩爾紋，這又引入額外的模糊。</p>

<p>這些模糊效應的總和導致實際影像的銳度遠低於場景本身的真實對比。為了恢復或增強邊緣對比，ISP 中的<strong>銳化（Sharpening）</strong>模組便成為不可或缺的一環。</p>

<h3>MTF — 調制傳遞函數</h3>
<p><strong>MTF（Modulation Transfer Function）</strong>是描述成像系統解析力的核心指標。它衡量的是系統在不同空間頻率下，能保留多少對比度。數學上，MTF 是系統 PSF 的傅立葉轉換的模（magnitude）。</p>

<div class="formula">MTF(f) = |FT{PSF(x, y)}| = Contrast_output(f) / Contrast_input(f)</div>

<p>在理想系統中，所有頻率的 MTF 值都為 1.0，意味著不論細節多細，對比度都能被完美保留。然而，在真實鏡頭中，隨著空間頻率的升高（越細的紋理），MTF 值會逐漸降低，直到達到截止頻率（Cutoff Frequency）後歸零。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mtfGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6a8a7a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#6a8a7a" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <rect width="600" height="340" fill="#f5f0eb" rx="8"/>
  <!-- axes -->
  <line x1="70" y1="30" x2="70" y2="280" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="70" y1="280" x2="560" y2="280" stroke="#5a5550" stroke-width="1.5"/>
  <text x="30" y="160" fill="#5a5550" font-size="13" text-anchor="middle" transform="rotate(-90,30,160)">MTF</text>
  <text x="310" y="310" fill="#5a5550" font-size="13" text-anchor="middle">空間頻率 (lp/mm)</text>
  <!-- y ticks -->
  <text x="60" y="55" fill="#8a8580" font-size="11" text-anchor="end">1.0</text>
  <line x1="65" y1="50" x2="70" y2="50" stroke="#8a8580"/>
  <text x="60" y="120" fill="#8a8580" font-size="11" text-anchor="end">0.7</text>
  <line x1="65" y1="115" x2="560" y2="115" stroke="#d5cec7" stroke-dasharray="4"/>
  <text x="60" y="185" fill="#8a8580" font-size="11" text-anchor="end">0.4</text>
  <text x="60" y="250" fill="#8a8580" font-size="11" text-anchor="end">0.1</text>
  <text x="60" y="285" fill="#8a8580" font-size="11" text-anchor="end">0</text>
  <!-- ideal -->
  <line x1="70" y1="50" x2="460" y2="50" stroke="#6a8a7a" stroke-width="2.5" stroke-dasharray="8,4"/>
  <line x1="460" y1="50" x2="460" y2="280" stroke="#6a8a7a" stroke-width="2.5" stroke-dasharray="8,4"/>
  <!-- real lens MTF curve -->
  <path d="M70,52 Q180,60 250,100 Q350,165 420,230 Q470,262 530,275" fill="url(#mtfGrad)" stroke="none"/>
  <path d="M70,52 Q180,60 250,100 Q350,165 420,230 Q470,262 530,275" fill="none" stroke="#5a5550" stroke-width="2.5"/>
  <!-- after sharpening -->
  <path d="M70,50 Q180,52 250,75 Q350,130 420,200 Q470,245 530,268" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="6,3"/>
  <!-- legend -->
  <line x1="100" y1="322" x2="130" y2="322" stroke="#6a8a7a" stroke-width="2.5" stroke-dasharray="8,4"/>
  <text x="135" y="326" fill="#5a5550" font-size="11">理想鏡頭 (Ideal)</text>
  <line x1="260" y1="322" x2="290" y2="322" stroke="#5a5550" stroke-width="2.5"/>
  <text x="295" y="326" fill="#5a5550" font-size="11">真實鏡頭 (Real Lens)</text>
  <line x1="440" y1="322" x2="470" y2="322" stroke="#c4a064" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="475" y="326" fill="#5a5550" font-size="11">銳化後 (Sharpened)</text>
  <!-- Nyquist label -->
  <line x1="420" y1="275" x2="420" y2="285" stroke="#8a8580" stroke-width="1"/>
  <text x="420" y="298" fill="#8a8580" font-size="10" text-anchor="middle">Nyquist</text>
</svg><div class="caption">圖 6-1：MTF 曲線 — 理想鏡頭 vs 真實鏡頭 vs 銳化後的響應</div></div>

<h3>MTF 的實際意義</h3>
<p>在 ISP 調適中，我們通常關注幾個關鍵的 MTF 指標：</p>
<ul>
  <li><strong>MTF50</strong>：MTF 值降至 50% 對應的空間頻率，常作為「解析力」的代表值</li>
  <li><strong>MTF10</strong>：接近系統極限的解析能力</li>
  <li><strong>Nyquist MTF</strong>：在 Sensor Nyquist 頻率處的 MTF 值，關乎 Aliasing 風險</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  銳化（Sharpening）的本質是嘗試將真實鏡頭的 MTF 曲線向上提升（如圖中虛線所示），使其更接近理想響應。但要注意：銳化無法恢復超過 Nyquist 頻率的真正資訊，它只能增強已存在但對比被削弱的細節。
</div>

<h3>系統 MTF 的級聯效應</h3>
<p>實際成像系統的總 MTF 是各子系統 MTF 的乘積：</p>
<div class="formula">MTF_total = MTF_lens × MTF_OLPF × MTF_sensor × MTF_processing</div>

<p>這意味著每增加一個模糊來源，整體 MTF 就會進一步下降。ISP 中的銳化模組就是扮演 <code>MTF_processing</code> 的角色 — 它的 MTF 值大於 1（在特定頻率範圍內），藉此補償前面各環節的損失。</p>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  銳化不是無中生有。過度銳化會在邊緣產生 Overshoot/Undershoot（光暈效應），並將噪聲一併放大。銳化的藝術在於找到「恰到好處」的增強幅度，讓影像看起來清晰而不刺眼。
</div>

<h3>銳化在 ISP Pipeline 中的位置</h3>
<p>銳化通常位於 ISP Pipeline 的後段，在降噪（NR）和色彩處理之後。這是因為：</p>
<ol>
  <li>降噪先去除噪聲，避免銳化放大噪聲</li>
  <li>色彩校正後的影像更接近目標色彩空間，便於精確控制增強效果</li>
  <li>Tone Mapping 之後的影像已接近最終輸出，銳化的視覺效果較可預期</li>
</ol>
<p>然而，在一些進階 ISP 設計中，也會在 Pipeline 的不同階段施加不同程度的銳化，例如在 Demosaic 之後做初步的細節恢復，在最後階段做最終的視覺增強。</p>
`,
      keyPoints: [
        "光學繞射、鏡頭像差、Sensor 取樣與 OLPF 共同造成影像模糊",
        "MTF（Modulation Transfer Function）衡量不同空間頻率下的對比保留能力",
        "系統 MTF 為各子系統 MTF 的乘積，銳化的作用是提供大於 1 的 MTF_processing",
        "銳化只能增強已存在的資訊，無法恢復超過 Nyquist 頻率的細節",
        "銳化通常置於 ISP Pipeline 後段，於降噪和色彩處理之後"
      ]
    },
    {
      id: "ch6_2",
      title: "USM 公式與參數",
      content: `
<h3>Unsharp Masking 的歷史與原理</h3>
<p><strong>USM（Unsharp Masking）</strong>是最經典也最廣泛使用的銳化技術，起源於傳統暗房技術。在數位影像處理中，USM 的核心思路極為直觀：先製造一個模糊版本的影像，用原始影像減去模糊影像以提取「細節層」，然後將細節層乘以增益係數加回原始影像，藉此增強邊緣與紋理的對比。</p>

<p>其數學表達式為：</p>
<div class="formula">Sharpened = Original + α × (Original − Blurred)</div>

<p>其中 <code>α</code> 是銳化強度（Amount），<code>Original − Blurred</code> 就是高頻細節（Detail / High-pass）層。</p>

<div class="diagram"><svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="260" fill="#f5f0eb" rx="8"/>
  <!-- Original -->
  <rect x="20" y="40" width="110" height="80" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="75" y="72" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">Original</text>
  <text x="75" y="92" fill="#8a8580" font-size="10" text-anchor="middle">原始影像</text>
  <!-- Arrow to Blur -->
  <line x1="130" y1="80" x2="170" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM)"/>
  <defs><marker id="arrowM" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Gaussian Blur -->
  <rect x="175" y="40" width="110" height="80" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="230" y="68" fill="#5a5550" font-size="11" text-anchor="middle">Gaussian</text>
  <text x="230" y="84" fill="#5a5550" font-size="11" text-anchor="middle">Blur (σ)</text>
  <text x="230" y="105" fill="#8a8580" font-size="10" text-anchor="middle">低通濾波</text>
  <!-- Arrow to Subtract -->
  <line x1="285" y1="80" x2="325" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM)"/>
  <!-- Subtraction -->
  <circle cx="350" cy="80" r="22" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="350" y="85" fill="#6a8a7a" font-size="18" text-anchor="middle" font-weight="bold">−</text>
  <!-- original also feeds to subtract -->
  <path d="M75,120 L75,180 L350,180 L350,102" fill="none" stroke="#5a5550" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowM)"/>
  <text x="200" y="195" fill="#8a8580" font-size="10" text-anchor="middle">Original (bypass)</text>
  <!-- Arrow to Detail -->
  <line x1="372" y1="80" x2="410" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM)"/>
  <!-- Detail -->
  <rect x="415" y="40" width="100" height="80" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="465" y="72" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Detail</text>
  <text x="465" y="92" fill="#8a8580" font-size="10" text-anchor="middle">高頻細節層</text>
  <!-- Arrow & gain -->
  <line x1="515" y1="80" x2="555" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM)"/>
  <text x="535" y="70" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">×α</text>
  <!-- Addition -->
  <circle cx="580" cy="80" r="22" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="580" y="86" fill="#6a8a7a" font-size="18" text-anchor="middle" font-weight="bold">+</text>
  <!-- original also feeds to add -->
  <path d="M75,130 Q75,230 580,230 L580,102" fill="none" stroke="#5a5550" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowM)"/>
  <text x="330" y="245" fill="#8a8580" font-size="10" text-anchor="middle">Original (bypass)</text>
  <!-- Arrow to Output -->
  <line x1="602" y1="80" x2="640" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM)"/>
  <!-- Sharpened -->
  <rect x="645" y="50" width="45" height="60" rx="6" fill="#6a8a7a" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="667" y="76" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">OUT</text>
  <text x="667" y="90" fill="rgba(255,255,255,0.8)" font-size="8" text-anchor="middle">銳化</text>
</svg><div class="caption">圖 6-2：USM 銳化流程 — Original − Blurred = Detail，再乘以增益 α 加回原圖</div></div>

<h3>三個關鍵參數</h3>
<p>USM 銳化的效果完全由三個參數決定：</p>

<table>
  <tr><th>參數</th><th>英文</th><th>說明</th><th>典型範圍</th></tr>
  <tr><td><strong>Amount (α)</strong></td><td>Strength / Gain</td><td>細節層的增益倍數，數值越大銳化越強</td><td>0.5 ~ 3.0</td></tr>
  <tr><td><strong>Radius (σ)</strong></td><td>Blur Sigma</td><td>Gaussian Blur 的標準差，決定銳化影響的「尺度」</td><td>0.5 ~ 5.0 px</td></tr>
  <tr><td><strong>Threshold (T)</strong></td><td>Coring Level</td><td>低於此門檻的細節不銳化，用於避免放大噪聲</td><td>0 ~ 20</td></tr>
</table>

<h4>Radius 的影響</h4>
<p>Radius（即 Gaussian Blur 的 σ）控制了哪些尺度的細節會被銳化：</p>
<ul>
  <li><strong>小 Radius（σ ≈ 0.5-1.0）</strong>：增強精細紋理（如毛髮、皮膚紋理），適合高解析度影像</li>
  <li><strong>中 Radius（σ ≈ 1.5-3.0）</strong>：增強中等尺度邊緣，是最常用的設定</li>
  <li><strong>大 Radius（σ ≈ 4.0-5.0+）</strong>：增強粗糙的邊緣結構，類似 Local Contrast Enhancement 效果</li>
</ul>

<h4>Amount 的影響</h4>
<p>Amount 決定了銳化的強度。在實務中，Amount 的設定需要考量：</p>
<ul>
  <li>輸出介質（螢幕、列印、壓縮影像等需要不同的銳化量）</li>
  <li>影像內容（風景需要較強銳化，人像則較輕柔）</li>
  <li>噪聲水準（高 ISO 影像需要降低 Amount 以避免放大噪聲）</li>
</ul>

<h4>Threshold 的作用</h4>
<p>Threshold 是 USM 中最容易被忽略但最重要的參數之一。它設定了一個「門檻」：只有細節層的振幅超過此門檻時，才進行銳化。這可以有效避免將低振幅的噪聲也銳化。具體來說：</p>
<div class="formula">Detail_thresholded(x,y) = Detail(x,y)  if |Detail(x,y)| > T,  else 0</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在 ISP 調適中，通常先固定 Radius 根據鏡頭特性選擇合適的尺度，接著調整 Amount 到畫面看起來「清晰但不過度」，最後利用 Threshold 來抑制噪聲的放大。建議在 100% 檢視下，觀察平坦區域（如天空、牆面）是否出現顆粒感。
</div>

<h3>頻率域的理解</h3>
<p>從頻率域來看，USM 等同於一個 <strong>High-boost Filter</strong>：</p>
<div class="formula">H_sharpen(f) = 1 + α × (1 − H_blur(f)) = 1 + α × H_highpass(f)</div>

<p>其中 <code>H_blur(f)</code> 是 Gaussian 低通的頻率響應。這意味著 USM 在低頻保持不變（增益 = 1），在高頻提供增益（大於 1），且增益的大小和頻率範圍由 α 和 σ 共同決定。</p>

<div class="info-box example">
  <div class="box-title">📘 範例：典型 USM 設定</div>
  <p>手機相機 ISP 的典型 USM 設定：</p>
  <ul>
    <li>低光場景（ISO 3200+）：Amount=0.5, Radius=1.0, Threshold=15</li>
    <li>一般場景（ISO 100-800）：Amount=1.5, Radius=1.5, Threshold=5</li>
    <li>風景模式：Amount=2.0, Radius=2.0, Threshold=3</li>
  </ul>
</div>
`,
      keyPoints: [
        "USM 核心公式：Sharpened = Original + α × (Original − Blurred)",
        "三個關鍵參數：Amount（強度）、Radius（尺度）、Threshold（門檻）",
        "Radius 控制銳化的空間尺度，小 σ 增強精細紋理，大 σ 增強粗邊緣",
        "Threshold 可避免低振幅噪聲被銳化放大",
        "頻率域中 USM 等同於 High-boost Filter"
      ]
    },
    {
      id: "ch6_3",
      title: "Laplacian Sharpening 與 High-pass Filter",
      content: `
<h3>Laplacian 算子的數學基礎</h3>
<p><strong>Laplacian（拉普拉斯算子）</strong>是一個二階微分算子，在二維影像中定義為：</p>
<div class="formula">∇²f = ∂²f/∂x² + ∂²f/∂y²</div>

<p>Laplacian 的物理意義是：它對影像中的<strong>快速灰度變化</strong>（邊緣和紋理）產生強烈響應，而對平坦區域產生零響應。這使它成為天然的高通濾波器（High-pass Filter）。</p>

<p>Laplacian Sharpening 的公式為：</p>
<div class="formula">Sharpened(x,y) = f(x,y) − α × ∇²f(x,y)</div>

<p>注意此處是減去 Laplacian（因為 Laplacian 在邊緣處通常為負值），等效於增強邊緣的對比。</p>

<h3>離散化 Kernel</h3>
<p>在實際實作中，Laplacian 透過卷積核（Kernel）來近似。最常見的有兩種形式：</p>

<div class="diagram"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#f5f0eb" rx="8"/>
  <!-- 4-connected Laplacian -->
  <text x="150" y="30" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">4-鄰域 Laplacian</text>
  <g transform="translate(75,45)">
    <rect x="0" y="0" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="0" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="50" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="50" width="50" height="50" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="2"/>
    <rect x="100" y="50" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="100" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="100" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="100" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <text x="25" y="30" fill="#8a8580" font-size="16" text-anchor="middle">0</text>
    <text x="75" y="30" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="125" y="30" fill="#8a8580" font-size="16" text-anchor="middle">0</text>
    <text x="25" y="80" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="75" y="80" fill="#5a5550" font-size="16" text-anchor="middle" font-weight="bold">−4</text>
    <text x="125" y="80" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="25" y="130" fill="#8a8580" font-size="16" text-anchor="middle">0</text>
    <text x="75" y="130" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="125" y="130" fill="#8a8580" font-size="16" text-anchor="middle">0</text>
  </g>
  <!-- 8-connected Laplacian -->
  <text x="450" y="30" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">8-鄰域 Laplacian</text>
  <g transform="translate(375,45)">
    <rect x="0" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="50" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="50" width="50" height="50" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="2"/>
    <rect x="100" y="50" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="100" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="100" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="100" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <text x="25" y="30" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="75" y="30" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="125" y="30" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="25" y="80" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="75" y="80" fill="#5a5550" font-size="16" text-anchor="middle" font-weight="bold">−8</text>
    <text x="125" y="80" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="25" y="130" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="75" y="130" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
    <text x="125" y="130" fill="#6a8a7a" font-size="16" text-anchor="middle" font-weight="bold">1</text>
  </g>
  <!-- Frequency response illustration -->
  <text x="300" y="215" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">頻率響應特性</text>
  <line x1="100" y1="230" x2="100" y2="285" stroke="#5a5550" stroke-width="1"/>
  <line x1="100" y1="285" x2="500" y2="285" stroke="#5a5550" stroke-width="1"/>
  <text x="80" y="240" fill="#8a8580" font-size="10" text-anchor="end">|H(f)|</text>
  <text x="300" y="298" fill="#8a8580" font-size="10" text-anchor="middle">頻率 f</text>
  <path d="M100,285 Q200,283 300,260 Q400,237 500,230" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="510" y="232" fill="#6a8a7a" font-size="10">high</text>
  <text x="130" y="280" fill="#8a8580" font-size="10">low</text>
</svg><div class="caption">圖 6-3：Laplacian Kernel（4-鄰域與 8-鄰域）及其頻率響應特性</div></div>

<h3>Laplacian vs USM 的比較</h3>
<table>
  <tr><th>特性</th><th>Laplacian Sharpening</th><th>USM Sharpening</th></tr>
  <tr><td>數學基礎</td><td>二階微分</td><td>原圖減去低通</td></tr>
  <tr><td>可調參數</td><td>僅有增益 α</td><td>Amount, Radius, Threshold</td></tr>
  <tr><td>頻率選擇性</td><td>固定（取決於 kernel 大小）</td><td>可透過 σ 調整</td></tr>
  <tr><td>噪聲敏感度</td><td>高（二階微分放大噪聲）</td><td>可用 Threshold 控制</td></tr>
  <tr><td>運算成本</td><td>低（3×3 卷積）</td><td>較高（需要 Gaussian Blur）</td></tr>
  <tr><td>實用性</td><td>較少單獨使用</td><td>工業主流</td></tr>
</table>

<h3>High-pass Filter 的一般化</h3>
<p>Laplacian 是 High-pass Filter 的一個特例。更一般地，任何高通濾波器都可以用於銳化：</p>
<div class="formula">Sharpened = Original + α × HighPass(Original)</div>

<p>常見的高通濾波方式包括：</p>
<ul>
  <li><strong>Laplacian</strong>：二階微分，最簡單但噪聲敏感</li>
  <li><strong>Unsharp Mask</strong>：Original − GaussianBlur，可調性最佳</li>
  <li><strong>DoG（Difference of Gaussians）</strong>：兩個不同 σ 的 Gaussian 之差，可精確控制頻帶</li>
  <li><strong>Band-pass Filter</strong>：只增強特定頻率範圍的細節</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  所有銳化方法的本質都是「高通 + 原圖」，差別只在於高通濾波器的設計。Laplacian 因結構簡單、運算快速，在硬體 ISP（ASIC/FPGA）中仍有其價值，但在需要精細調控時，USM 或更進階的方法更為常用。
</div>

<h3>LoG（Laplacian of Gaussian）</h3>
<p>為了降低 Laplacian 對噪聲的敏感性，實務上常先對影像做 Gaussian 平滑再求 Laplacian，稱為 <strong>LoG（Laplacian of Gaussian）</strong>。LoG 的數學形式為：</p>
<div class="formula">LoG(x,y) = −(1/(πσ⁴)) × [1 − (x²+y²)/(2σ²)] × exp(−(x²+y²)/(2σ²))</div>

<p>LoG 結合了平滑與邊緣偵測的功能，而且可以證明 LoG 與 DoG（Difference of Gaussians）在數學上近似等價。這也解釋了為何 USM（本質上是 DoG 的一種形式）能在噪聲抑制方面表現更好。</p>

<div class="info-box tip">
  <div class="box-title">💡 硬體實作考量</div>
  在 FPGA/ASIC 等硬體 ISP 中，Laplacian 的 3×3 kernel 只需要極少的乘法器和加法器，非常適合即時處理。若要同時具備噪聲抑制能力，可以先用 3×3 或 5×5 的簡單平滑 kernel 做前處理，再施加 Laplacian，以近似 LoG 的效果。
</div>
`,
      keyPoints: [
        "Laplacian 是二階微分算子，天然具有高通特性",
        "4-鄰域和 8-鄰域 kernel 分別響應十字和全方位的邊緣",
        "相比 USM，Laplacian 參數少、運算快，但噪聲敏感且缺乏頻率選擇性",
        "LoG（Laplacian of Gaussian）結合平滑與邊緣偵測，與 DoG 近似等價",
        "硬體 ISP 中 Laplacian 因運算簡單而仍有重要價值"
      ]
    },
    {
      id: "ch6_4",
      title: "Edge Detection 邊緣偵測",
      content: `
<h3>邊緣偵測在銳化中的角色</h3>
<p>銳化的目的是增強邊緣，但前提是要先<strong>正確辨識邊緣的位置和方向</strong>。邊緣偵測（Edge Detection）在 ISP 中不只用於銳化控制，也是許多自適應演算法（如 Adaptive NR、Demosaic）的基礎。本節介紹最核心的邊緣偵測算子及其在銳化中的應用。</p>

<h3>Sobel 算子</h3>
<p><strong>Sobel Operator</strong> 是最廣泛使用的一階梯度（Gradient）估計器。它同時計算水平方向和垂直方向的梯度：</p>

<div class="formula">G_x = Sobel_x * I,   G_y = Sobel_y * I,   |G| = √(G_x² + G_y²),   θ = arctan(G_y / G_x)</div>

<div class="diagram"><svg viewBox="0 0 650 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="360" fill="#f5f0eb" rx="8"/>
  <!-- Sobel X -->
  <text x="120" y="28" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">Sobel X (水平梯度)</text>
  <g transform="translate(45,35)">
    <rect x="0" y="0" width="50" height="50" fill="rgba(196,160,100,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="0" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="50" width="50" height="50" fill="rgba(196,160,100,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="50" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="50" width="50" height="50" fill="rgba(106,138,122,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="100" width="50" height="50" fill="rgba(196,160,100,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="100" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="100" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <text x="25" y="30" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−1</text>
    <text x="75" y="30" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="125" y="30" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+1</text>
    <text x="25" y="80" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−2</text>
    <text x="75" y="80" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="125" y="80" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+2</text>
    <text x="25" y="130" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−1</text>
    <text x="75" y="130" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="125" y="130" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+1</text>
  </g>
  <!-- Sobel Y -->
  <text x="420" y="28" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">Sobel Y (垂直梯度)</text>
  <g transform="translate(345,35)">
    <rect x="0" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="0" width="50" height="50" fill="rgba(106,138,122,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="0" width="50" height="50" fill="rgba(106,138,122,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="50" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="50" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="50" width="50" height="50" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
    <rect x="0" y="100" width="50" height="50" fill="rgba(196,160,100,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="50" y="100" width="50" height="50" fill="rgba(196,160,100,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <rect x="100" y="100" width="50" height="50" fill="rgba(196,160,100,0.15)" stroke="#d5cec7" stroke-width="1"/>
    <text x="25" y="30" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+1</text>
    <text x="75" y="30" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+2</text>
    <text x="125" y="30" fill="#6a8a7a" font-size="15" text-anchor="middle" font-weight="bold">+1</text>
    <text x="25" y="80" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="75" y="80" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="125" y="80" fill="#8a8580" font-size="15" text-anchor="middle">0</text>
    <text x="25" y="130" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−1</text>
    <text x="75" y="130" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−2</text>
    <text x="125" y="130" fill="#c4a064" font-size="15" text-anchor="middle" font-weight="bold">−1</text>
  </g>
  <!-- Gradient direction illustration -->
  <text x="325" y="210" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">梯度方向（Gradient Direction）</text>
  <circle cx="325" cy="280" r="60" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <circle cx="325" cy="280" r="3" fill="#5a5550"/>
  <!-- 8 directions -->
  <line x1="325" y1="280" x2="385" y2="280" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowE)"/>
  <defs><marker id="arrowE" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6a8a7a"/></marker></defs>
  <line x1="325" y1="280" x2="325" y2="220" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="367" y2="238" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="283" y2="238" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="265" y2="280" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="283" y2="322" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="325" y2="340" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <line x1="325" y1="280" x2="367" y2="322" stroke="#8a8580" stroke-width="1.2" stroke-dasharray="4" marker-end="url(#arrowE)"/>
  <text x="395" y="284" fill="#6a8a7a" font-size="10">0°</text>
  <text x="328" y="215" fill="#6a8a7a" font-size="10">90°</text>
  <text x="375" y="235" fill="#8a8580" font-size="10">45°</text>
  <text x="255" y="235" fill="#8a8580" font-size="10">135°</text>
  <text x="100" y="340" fill="#8a8580" font-size="11">θ = arctan(G_y / G_x)，表示邊緣的法線方向</text>
</svg><div class="caption">圖 6-4：Sobel 算子（水平/垂直）與梯度方向示意</div></div>

<h3>Canny Edge Detection</h3>
<p><strong>Canny 邊緣偵測</strong>被公認為「最優」的邊緣偵測器，它遵循三個準則：</p>
<ol>
  <li><strong>Good Detection</strong>：盡可能偵測到所有真實邊緣</li>
  <li><strong>Good Localization</strong>：偵測到的邊緣位置盡可能準確</li>
  <li><strong>Minimal Response</strong>：每條邊緣只產生一次響應</li>
</ol>

<p>Canny 的處理流程包含四個步驟：</p>
<ol>
  <li><strong>Gaussian Smoothing</strong>：先用 Gaussian 濾波抑制噪聲</li>
  <li><strong>Gradient Computation</strong>：計算梯度大小和方向（通常使用 Sobel）</li>
  <li><strong>Non-Maximum Suppression（NMS）</strong>：沿梯度方向只保留局部最大值，將邊緣細化為一像素寬</li>
  <li><strong>Hysteresis Thresholding</strong>：使用高低兩個門檻值，高門檻確認強邊緣，低門檻連接弱邊緣</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 在銳化中的應用</div>
  在 ISP 銳化模組中，完整的 Canny 偵測通常過於昂貴。實務上多用簡化版：用 Sobel 計算梯度大小作為「邊緣強度圖」(Edge Map)，然後根據此 Edge Map 來調節銳化的局部強度 — 邊緣區域施加較強銳化，平坦區域則降低或不銳化，藉此達到自適應效果。
</div>

<h3>方向感知的銳化</h3>
<p>邊緣偵測提供的梯度方向資訊，可用來實作<strong>方向感知銳化（Directional Sharpening）</strong>：</p>
<ul>
  <li>沿邊緣方向（Tangent Direction）做平滑，以減少噪聲</li>
  <li>垂直於邊緣方向（Normal Direction）做銳化，以增強邊緣對比</li>
  <li>這樣的策略可以在增強銳度的同時保持邊緣的平滑性，避免在邊緣上產生鋸齒</li>
</ul>

<h4>其他常用的梯度算子</h4>
<table>
  <tr><th>算子</th><th>Kernel 大小</th><th>特點</th></tr>
  <tr><td>Roberts Cross</td><td>2×2</td><td>最簡單，但噪聲敏感</td></tr>
  <tr><td>Prewitt</td><td>3×3</td><td>與 Sobel 類似，但無加權</td></tr>
  <tr><td>Sobel</td><td>3×3</td><td>中心加權，噪聲抑制較好</td></tr>
  <tr><td>Scharr</td><td>3×3</td><td>旋轉對稱性更佳</td></tr>
</table>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在硬體 ISP 中，為了節省資源，梯度大小 |G| 常用近似公式 <code>|G| ≈ |G_x| + |G_y|</code> 或 <code>|G| ≈ max(|G_x|, |G_y|) + 0.5 × min(|G_x|, |G_y|)</code> 來替代開根號運算。這些近似在實際效果上差異不大，但能省下大量的硬體面積。
</div>
`,
      keyPoints: [
        "Sobel 算子計算水平與垂直梯度，可推算邊緣強度與方向",
        "Canny 邊緣偵測包含 NMS 和 Hysteresis Thresholding，是最優邊緣偵測器",
        "ISP 中常使用簡化的 Edge Map 來控制銳化的局部強度",
        "方向感知銳化：沿邊緣平滑、垂直邊緣銳化",
        "硬體實作中常用近似公式替代開根號以節省資源"
      ]
    },
    {
      id: "ch6_5",
      title: "Coring 技術",
      content: `
<h3>什麼是 Coring？</h3>
<p><strong>Coring（核心抑制）</strong>是銳化中一項關鍵的噪聲管理技術。它的原理很簡單：在高通濾波產生的細節層中，低振幅的訊號大多是噪聲，而高振幅的訊號才是真正的邊緣和紋理。Coring 透過對細節層施加一個<strong>非線性函數</strong>，將低振幅部分壓制或消除，只保留高振幅的有效細節。</p>

<p>在數學上，Coring 函數 C(d) 作用於細節層 d 上：</p>
<div class="formula">Sharpened = Original + α × C(Detail)</div>

<h3>Hard Coring vs Soft Coring</h3>
<p>Coring 有兩種主要型態：</p>

<h4>Hard Coring（硬核抑制）</h4>
<p>Hard Coring 使用簡單的門檻函數：</p>
<div class="formula">C_hard(d) = d  if |d| > T,  else 0</div>
<p>低於門檻 T 的細節直接歸零，高於門檻的細節完全保留。優點是實作簡單，缺點是在門檻附近會產生<strong>不連續</strong>，導致視覺上的 artifact。</p>

<h4>Soft Coring（軟核抑制）</h4>
<p>Soft Coring 使用平滑的過渡函數，最常見的形式是：</p>
<div class="formula">C_soft(d) = sign(d) × max(0, |d| − T)</div>
<p>或更平滑的版本：</p>
<div class="formula">C_soft(d) = d × max(0, 1 − (T/|d|)²)</div>
<p>Soft Coring 在門檻附近提供平滑的過渡，避免了視覺上的跳變。</p>

<div class="diagram"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="340" fill="#f5f0eb" rx="8"/>
  <text x="300" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Coring 響應曲線</text>
  <!-- Axes -->
  <line x1="80" y1="170" x2="560" y2="170" stroke="#5a5550" stroke-width="1.2"/>
  <line x1="300" y1="40" x2="300" y2="300" stroke="#5a5550" stroke-width="1.2"/>
  <text x="570" y="174" fill="#8a8580" font-size="11">d (input)</text>
  <text x="304" y="38" fill="#8a8580" font-size="11">C(d) (output)</text>
  <!-- Arrow heads -->
  <polygon points="560,170 552,166 552,174" fill="#5a5550"/>
  <polygon points="300,40 296,48 304,48" fill="#5a5550"/>
  <!-- No coring (identity): C(d) = d, diagonal line -->
  <line x1="120" y1="278" x2="480" y2="62" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="6,4"/>
  <!-- Hard Coring: C(d) = d if |d|>T, else 0 -->
  <!-- Left: follows identity from (120,278) to (230,212), then jumps to 0 -->
  <line x1="120" y1="278" x2="230" y2="212" stroke="#c4a064" stroke-width="2.5"/>
  <line x1="230" y1="212" x2="230" y2="170" stroke="#c4a064" stroke-width="2.5" stroke-dasharray="3,3"/>
  <!-- Center: flat at zero -->
  <line x1="230" y1="170" x2="370" y2="170" stroke="#c4a064" stroke-width="2.5"/>
  <!-- Right: jumps from 0 to identity, then follows identity -->
  <line x1="370" y1="170" x2="370" y2="128" stroke="#c4a064" stroke-width="2.5" stroke-dasharray="3,3"/>
  <line x1="370" y1="128" x2="480" y2="62" stroke="#c4a064" stroke-width="2.5"/>
  <!-- Soft Coring (smooth): C(d) = d × max(0, 1−(T/|d|)²) -->
  <!-- Flat at 0 for |d|≤T, smoothly curves toward identity for |d|>T -->
  <path d="M120,262 C150,244 190,170 230,170 L370,170 C410,170 450,96 480,78" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Threshold markers -->
  <line x1="230" y1="165" x2="230" y2="175" stroke="#8a8580" stroke-width="1"/>
  <text x="230" y="192" fill="#8a8580" font-size="10" text-anchor="middle">−T</text>
  <line x1="370" y1="165" x2="370" y2="175" stroke="#8a8580" stroke-width="1"/>
  <text x="370" y="192" fill="#8a8580" font-size="10" text-anchor="middle">+T</text>
  <!-- Legend -->
  <line x1="140" y1="320" x2="170" y2="320" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="175" y="324" fill="#8a8580" font-size="11">No Coring (identity)</text>
  <line x1="310" y1="320" x2="340" y2="320" stroke="#c4a064" stroke-width="2.5"/>
  <text x="345" y="324" fill="#5a5550" font-size="11">Hard Coring</text>
  <line x1="440" y1="320" x2="470" y2="320" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="475" y="324" fill="#5a5550" font-size="11">Soft Coring</text>
</svg><div class="caption">圖 6-5：Coring 響應曲線 — Hard Coring（有跳變） vs Soft Coring（平滑過渡）</div></div>

<h3>Coring 門檻的自適應設定</h3>
<p>在實際 ISP 中，Coring 門檻 T 不會是固定值，而是根據多種條件動態調整：</p>

<table>
  <tr><th>條件</th><th>調整策略</th><th>原因</th></tr>
  <tr><td>ISO / 增益</td><td>高 ISO → 提高 T</td><td>高 ISO 噪聲更大，需要更強的抑制</td></tr>
  <tr><td>亮度</td><td>暗區 → 提高 T</td><td>暗區 Shot Noise 相對較大</td></tr>
  <tr><td>局部方差</td><td>低方差 → 提高 T</td><td>低方差區域更可能是平坦區（噪聲主導）</td></tr>
  <tr><td>邊緣強度</td><td>強邊緣 → 降低 T</td><td>強邊緣處的細節多為真實資訊</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  Coring 是銳化與降噪之間的橋樑。好的 Coring 設計能讓銳化「只增強該增強的」，而不觸碰噪聲。在手機 ISP 中，Coring 的自適應門檻設計往往是區別「頂級」和「普通」畫質的關鍵因素。
</div>

<h3>Coring 的進階變體</h3>
<p>除了基本的門檻式 Coring，還有幾種進階的變體：</p>
<ul>
  <li><strong>Asymmetric Coring</strong>：對正向細節（Overshoot）和負向細節（Undershoot）使用不同的門檻和增益。這可以獨立控制亮邊和暗邊的銳化效果</li>
  <li><strong>Frequency-dependent Coring</strong>：在多尺度銳化中，對不同頻帶使用不同的 Coring 門檻。通常高頻用較高的門檻（因為高頻噪聲更明顯）</li>
  <li><strong>Noise-estimated Coring</strong>：根據降噪模組估計的噪聲標準差 σ_n 來設定門檻，例如 T = k × σ_n（k 通常取 1.5~3.0）</li>
</ul>

<div class="info-box example">
  <div class="box-title">📘 範例：基於噪聲估計的 Coring</div>
  <p>假設降噪模組估計某區域的噪聲標準差為 σ_n = 5，則：</p>
  <ul>
    <li>Coring 門檻 T = 2.5 × σ_n = 12.5</li>
    <li>|Detail| < 12.5 的部分視為噪聲，不銳化</li>
    <li>|Detail| > 12.5 的部分視為真實邊緣，施加銳化</li>
    <li>在 Soft Coring 模式下，12.5 附近會有平滑的過渡</li>
  </ul>
</div>
`,
      keyPoints: [
        "Coring 透過抑制細節層中的低振幅信號來避免噪聲放大",
        "Hard Coring 簡單但有不連續跳變，Soft Coring 提供平滑過渡",
        "Coring 門檻應根據 ISO、亮度、局部方差等條件動態調整",
        "進階變體包括非對稱 Coring、頻率相依 Coring、噪聲估計 Coring",
        "Coring 是銳化品質的關鍵 — 區分噪聲與真實細節"
      ]
    },
    {
      id: "ch6_6",
      title: "Overshoot/Undershoot 控制",
      content: `
<h3>什麼是 Overshoot 與 Undershoot？</h3>
<p>當銳化強度過高時，在邊緣兩側會出現明顯的亮帶（Overshoot）和暗帶（Undershoot），合稱為<strong>Halo Artifacts（光暈效應）</strong>。這是因為銳化本質上是增強邊緣的對比差異 — 亮邊變得更亮（Overshoot），暗邊變得更暗（Undershoot）。</p>

<p>適度的 Overshoot/Undershoot 能讓邊緣看起來更「清晰」，但過度的 Halo 會嚴重影響影像品質，讓畫面看起來不自然。</p>

<div class="diagram"><svg viewBox="0 0 650 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="320" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">邊緣剖面圖 — Overshoot/Undershoot</text>
  <!-- Axes -->
  <line x1="60" y1="50" x2="60" y2="280" stroke="#5a5550" stroke-width="1"/>
  <line x1="60" y1="280" x2="620" y2="280" stroke="#5a5550" stroke-width="1"/>
  <text x="30" y="168" fill="#8a8580" font-size="11" text-anchor="middle" transform="rotate(-90,30,168)">亮度</text>
  <text x="340" y="300" fill="#8a8580" font-size="11" text-anchor="middle">像素位置</text>
  <!-- Original edge (ideal step) -->
  <path d="M80,220 L260,220 L290,100 L600,100" fill="none" stroke="#d5cec7" stroke-width="2" stroke-dasharray="6,4"/>
  <!-- Over-sharpened (with halo) -->
  <path d="M80,220 L220,220 Q250,220 260,250 Q270,265 280,230 Q290,70 310,60 Q320,55 330,70 Q340,90 350,100 L600,100" fill="none" stroke="#c4a064" stroke-width="2.5"/>
  <!-- Well-controlled sharpening -->
  <path d="M80,220 L240,220 Q260,220 270,195 Q280,160 290,105 Q300,95 320,100 L600,100" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Overshoot/Undershoot labels -->
  <line x1="310" y1="60" x2="310" y2="100" stroke="#c4a064" stroke-width="1" stroke-dasharray="3"/>
  <text x="335" y="55" fill="#c4a064" font-size="11" font-weight="500">Overshoot</text>
  <path d="M320,62 L312,70" fill="none" stroke="#c4a064" stroke-width="1" marker-end="url(#arrowC)"/>
  <defs><marker id="arrowC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c4a064"/></marker></defs>
  <line x1="260" y1="220" x2="260" y2="250" stroke="#c4a064" stroke-width="1" stroke-dasharray="3"/>
  <text x="215" y="268" fill="#c4a064" font-size="11" font-weight="500">Undershoot</text>
  <path d="M250,262 L258,252" fill="none" stroke="#c4a064" stroke-width="1" marker-end="url(#arrowC)"/>
  <!-- Legend -->
  <line x1="100" y1="305" x2="130" y2="305" stroke="#d5cec7" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="135" y="309" fill="#8a8580" font-size="11">原始邊緣</text>
  <line x1="250" y1="305" x2="280" y2="305" stroke="#c4a064" stroke-width="2.5"/>
  <text x="285" y="309" fill="#5a5550" font-size="11">過度銳化（有 Halo）</text>
  <line x1="440" y1="305" x2="470" y2="305" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="475" y="309" fill="#5a5550" font-size="11">控制良好的銳化</text>
</svg><div class="caption">圖 6-6：邊緣剖面圖 — 顯示過度銳化的 Halo（光暈）vs 控制良好的銳化</div></div>

<h3>Overshoot/Undershoot 的量化</h3>
<p>在 IQ 評估中，Overshoot/Undershoot 的嚴重程度通常以百分比量化：</p>
<div class="formula">Overshoot% = (Peak − High_level) / (High_level − Low_level) × 100%</div>
<div class="formula">Undershoot% = (Low_level − Valley) / (High_level − Low_level) × 100%</div>

<p>一般而言，Overshoot 和 Undershoot 各自控制在<strong>10-15% 以內</strong>被認為是可接受的範圍。超過 20% 就會在視覺上產生明顯的 Halo 效應。</p>

<h3>控制方法</h3>

<h4>1. Clip/Limit（限幅法）</h4>
<p>最直接的方法是對銳化後的結果進行 Clip：</p>
<div class="formula">Output(x,y) = clip(Sharpened(x,y), Original(x,y) − U_limit, Original(x,y) + O_limit)</div>
<p>其中 <code>O_limit</code> 和 <code>U_limit</code> 分別是 Overshoot 和 Undershoot 的最大允許值。這些限制可以是固定值，也可以根據局部對比度自適應調整。</p>

<h4>2. 非線性增益</h4>
<p>對細節層施加非線性增益函數：小細節給予較高增益（增強弱邊緣），大細節給予較低增益（抑制強邊緣的 Overshoot）。這類似於一種「壓縮」：</p>
<div class="formula">Gain(d) = α × (1 − β × |d| / d_max)</div>

<h4>3. 方向感知限幅</h4>
<p>根據邊緣方向，只在垂直於邊緣的方向上施加銳化，並限制沿邊緣方向的 Overshoot 擴散。</p>

<h4>4. 局部對比度感知</h4>
<p>在高對比度邊緣處自動降低銳化強度或收緊限幅，因為高對比度邊緣最容易產生可見的 Halo：</p>
<ul>
  <li>計算局部對比度 LC = max - min（在 N×N 鄰域內）</li>
  <li>對比度越高，Overshoot/Undershoot 限制越嚴格</li>
  <li>這樣可以讓低對比度的細節得到充分增強，同時避免高對比度邊緣的 Halo</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 常見錯誤</div>
  許多新手在調 ISP 銳化時，只看整體銳度指標（如 MTF50），卻忽略了 Overshoot/Undershoot 控制。結果是 MTF50 數字看起來很漂亮，但實際影像卻到處是 Halo。正確的做法是同時監控銳度指標和 Overshoot 百分比。
</div>

<h3>非對稱控制</h3>
<p>人眼對 Overshoot（亮側光暈）和 Undershoot（暗側光暈）的敏感度不同。一般而言，<strong>Overshoot 比 Undershoot 更容易被察覺</strong>，因為人眼對亮度增加更敏感（Weber's Law）。因此，在實務中常使用非對稱的限制：</p>
<ul>
  <li>Overshoot 限制較嚴格（例如最多 10%）</li>
  <li>Undershoot 限制稍寬鬆（例如最多 15%）</li>
  <li>這樣可以在不產生明顯 Halo 的前提下，獲得更高的感知銳度</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在評估 Overshoot/Undershoot 時，建議使用 ISO 12233 的 Slanted Edge 測試圖，拍攝後分析邊緣剖面。許多 IQ 評估軟體（如 Imatest、DxOMark Analyzer）都能自動量測這些指標。
</div>
`,
      keyPoints: [
        "Overshoot/Undershoot 是銳化過度時在邊緣兩側出現的亮帶與暗帶",
        "一般控制在 10-15% 以內為可接受範圍",
        "控制方法包括限幅、非線性增益、方向感知和局部對比度感知",
        "人眼對 Overshoot 比 Undershoot 更敏感，應使用非對稱控制",
        "評估應使用 Slanted Edge 測試圖並同時監控銳度和 Overshoot 指標"
      ]
    },
    {
      id: "ch6_7",
      title: "Adaptive Sharpening 自適應銳化",
      content: `
<h3>為什麼需要自適應？</h3>
<p>一張影像中包含多種不同特性的區域：銳利的邊緣、精細的紋理、平坦的色塊、以及噪聲主導的暗區。如果對所有區域都施加相同的銳化參數，必然會出現問題 — 平坦區噪聲被放大、邊緣 Halo 過重、紋理區卻可能銳化不足。</p>

<p><strong>Adaptive Sharpening（自適應銳化）</strong>的核心概念就是：<strong>根據每個像素（或區域）的內容特性，動態調整銳化參數</strong>。</p>

<div class="diagram"><svg viewBox="0 0 650 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="350" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">自適應銳化 — 內容感知的區域分類</text>
  <!-- Image representation -->
  <rect x="40" y="50" width="240" height="180" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="160" y="72" fill="#5a5550" font-size="11" text-anchor="middle">原始影像</text>
  <!-- Flat area -->
  <rect x="55" y="90" width="70" height="60" rx="4" fill="rgba(100,140,180,0.15)" stroke="#648cb4" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="90" y="125" fill="#648cb4" font-size="10" text-anchor="middle" font-weight="500">平坦區</text>
  <!-- Texture area -->
  <rect x="140" y="85" width="70" height="55" rx="4" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="175" y="117" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">紋理區</text>
  <!-- Edge area -->
  <rect x="90" y="155" width="85" height="50" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="132" y="184" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">邊緣區</text>
  <!-- Arrows to parameters -->
  <defs><marker id="arrowA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Flat -->
  <line x1="125" y1="115" x2="330" y2="85" stroke="#648cb4" stroke-width="1.2" marker-end="url(#arrowA)"/>
  <!-- Texture -->
  <line x1="210" y1="112" x2="330" y2="155" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrowA)"/>
  <!-- Edge -->
  <line x1="175" y1="185" x2="330" y2="225" stroke="#c4a064" stroke-width="1.2" marker-end="url(#arrowA)"/>
  <!-- Parameter boxes -->
  <rect x="335" y="60" width="280" height="55" rx="6" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="475" y="80" fill="#648cb4" font-size="12" text-anchor="middle" font-weight="500">平坦區域</text>
  <text x="475" y="100" fill="#5a5550" font-size="11" text-anchor="middle">Amount=0 | Coring=高 | 不銳化</text>
  <rect x="335" y="130" width="280" height="55" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="475" y="150" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">紋理區域</text>
  <text x="475" y="170" fill="#5a5550" font-size="11" text-anchor="middle">Amount=中 | Radius=小 | 精細增強</text>
  <rect x="335" y="200" width="280" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="475" y="220" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">邊緣區域</text>
  <text x="475" y="240" fill="#5a5550" font-size="11" text-anchor="middle">Amount=高 | O/U 控制=嚴 | 強化邊緣</text>
  <!-- Classification method -->
  <rect x="100" y="270" width="450" height="55" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="290" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">區域分類依據</text>
  <text x="325" y="310" fill="#8a8580" font-size="11" text-anchor="middle">局部方差 (Variance) | 梯度大小 (Gradient) | 頻率能量 (Spectral Energy)</text>
</svg><div class="caption">圖 6-7：自適應銳化 — 根據內容特性（邊緣/紋理/平坦）施加不同的銳化策略</div></div>

<h3>區域分類方法</h3>
<p>自適應銳化的第一步是分類每個像素或區域的內容類型。常用的方法包括：</p>

<h4>1. 基於局部方差</h4>
<p>計算 N×N 鄰域內的灰度方差：</p>
<div class="formula">Var(x,y) = (1/N²) × Σ(I(i,j) − μ)²</div>
<ul>
  <li>低方差 → 平坦區（噪聲可能主導）→ 低銳化或不銳化</li>
  <li>中方差 → 紋理區 → 中等銳化</li>
  <li>高方差 → 邊緣區 → 較強銳化但要控制 Overshoot</li>
</ul>

<h4>2. 基於梯度資訊</h4>
<p>使用 Sobel 等算子計算的梯度大小和方向：</p>
<ul>
  <li>梯度大小小 → 平坦區</li>
  <li>梯度大小中等且方向一致 → 紋理區</li>
  <li>梯度大小大且方向明確 → 邊緣區</li>
</ul>

<h4>3. 基於 Structure Tensor</h4>
<p>Structure Tensor（結構張量）可以提供更細緻的局部結構分析：</p>
<div class="formula">J = [ Σ(I_x²)  Σ(I_x·I_y) ] <br> &nbsp;&nbsp;&nbsp;&nbsp;[ Σ(I_x·I_y)  Σ(I_y²) ]</div>
<p>其特徵值 λ₁, λ₂ 可以精確分辨：</p>
<ul>
  <li>λ₁ ≈ λ₂ ≈ 0 → 平坦區</li>
  <li>λ₁ >> λ₂ ≈ 0 → 邊緣</li>
  <li>λ₁ ≈ λ₂ >> 0 → 紋理/角點</li>
</ul>

<h3>亮度自適應</h3>
<p>除了內容類型，<strong>亮度值</strong>也是自適應銳化的重要依據。人眼的對比敏感度（Contrast Sensitivity）會隨亮度變化（Weber's Law），因此：</p>
<ul>
  <li><strong>暗區</strong>：噪聲相對較高，且人眼對比敏感度較低 → 降低銳化強度</li>
  <li><strong>中灰區</strong>：人眼最敏感 → 使用標準銳化強度</li>
  <li><strong>高亮區</strong>：可能接近飽和 → 適度降低以避免 Clipping</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  自適應銳化的本質是一個 <strong>Spatially Varying Filter</strong>（空間變化濾波器）。它的銳化參數（Amount、Radius、Coring Threshold）在影像的每個位置都可能不同，由局部內容特徵驅動。這遠比單一全域參數的銳化更能兼顧銳度和乾淨度。
</div>

<h3>ISP 中的典型實作</h3>
<p>現代 ISP 晶片中，自適應銳化通常包含以下模組：</p>
<ol>
  <li><strong>Edge/Texture Detector</strong>：產生每個像素的邊緣強度和紋理指數</li>
  <li><strong>Lookup Table（LUT）</strong>：根據邊緣強度、紋理指數、亮度值查表得到對應的銳化參數</li>
  <li><strong>Sharpening Core</strong>：使用查表得到的參數執行實際的銳化運算</li>
  <li><strong>Overshoot/Undershoot Limiter</strong>：根據局部條件限制 Halo</li>
</ol>
<p>這些 LUT 就是 ISP Tuning 工程師需要調整的參數 — 不同的場景、不同的光照、不同的 ISO 都需要不同的 LUT 設定。</p>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  調適自適應銳化的 LUT 時，建議使用包含多種內容的綜合測試場景（如 Dead Leaves Chart 或真實複雜場景）。分別檢查天空（平坦）、草地/布料（紋理）、建築邊緣（強邊緣）三類區域的表現，確保各類區域都獲得適當的處理。
</div>
`,
      keyPoints: [
        "自適應銳化根據像素的局部特性動態調整銳化參數",
        "區域分類可基於局部方差、梯度資訊或 Structure Tensor",
        "亮度自適應考慮人眼的 Contrast Sensitivity 隨亮度的變化",
        "ISP 中透過 LUT 將邊緣/紋理指數和亮度映射到銳化參數",
        "自適應銳化是 Spatially Varying Filter，遠優於全域固定參數"
      ]
    },
    {
      id: "ch6_8",
      title: "多尺度銳化 Multi-scale Sharpening",
      content: `
<h3>為什麼需要多尺度？</h3>
<p>真實影像中的細節存在於<strong>多種空間尺度</strong>上：毛髮紋理（精細尺度）、布料圖案（中等尺度）、建築輪廓（粗糙尺度）。單一 Radius 的 USM 只能增強某一特定尺度的細節，對其他尺度的效果有限。</p>

<p><strong>多尺度銳化（Multi-scale Sharpening）</strong>的思路是：將影像分解成不同頻率層（尺度），對每層獨立調整增強幅度，最後再合成回去。這樣可以精確控制每個尺度的銳化程度。</p>

<h3>Laplacian Pyramid 分解</h3>
<p>最經典的多尺度分解方法是<strong>Laplacian Pyramid（拉普拉斯金字塔）</strong>：</p>

<div class="diagram"><svg viewBox="0 0 650 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="380" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Laplacian Pyramid 分解與重建</text>
  <defs><marker id="arrowP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Original -->
  <rect x="20" y="50" width="100" height="80" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="70" y="85" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">原圖 G₀</text>
  <text x="70" y="100" fill="#8a8580" font-size="9" text-anchor="middle">W × H</text>
  <!-- Downsample arrow -->
  <line x1="120" y1="90" x2="150" y2="90" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowP)"/>
  <text x="135" y="82" fill="#8a8580" font-size="8">↓2</text>
  <!-- G1 -->
  <rect x="155" y="60" width="75" height="60" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="192" y="87" fill="#5a5550" font-size="10" text-anchor="middle">G₁</text>
  <text x="192" y="100" fill="#8a8580" font-size="8" text-anchor="middle">W/2 × H/2</text>
  <!-- Downsample arrow -->
  <line x1="230" y1="90" x2="258" y2="90" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowP)"/>
  <text x="244" y="82" fill="#8a8580" font-size="8">↓2</text>
  <!-- G2 -->
  <rect x="262" y="68" width="55" height="45" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="290" y="90" fill="#5a5550" font-size="10" text-anchor="middle">G₂</text>
  <text x="290" y="102" fill="#8a8580" font-size="7" text-anchor="middle">W/4</text>
  <!-- Downsample arrow -->
  <line x1="317" y1="90" x2="343" y2="90" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowP)"/>
  <text x="330" y="82" fill="#8a8580" font-size="8">↓2</text>
  <!-- G3 (residual) -->
  <rect x="347" y="73" width="42" height="35" rx="4" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="368" y="94" fill="#5a5550" font-size="9" text-anchor="middle">G₃</text>
  <!-- Laplacian layers (below) -->
  <text x="70" y="168" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">L₀ = G₀ − Up(G₁)</text>
  <rect x="20" y="175" width="100" height="70" rx="4" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="70" y="205" fill="#6a8a7a" font-size="10" text-anchor="middle">高頻細節</text>
  <text x="70" y="220" fill="#8a8580" font-size="9" text-anchor="middle">Fine detail</text>
  <text x="192" y="168" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">L₁ = G₁ − Up(G₂)</text>
  <rect x="155" y="175" width="75" height="60" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="192" y="202" fill="#6a8a7a" font-size="10" text-anchor="middle">中頻細節</text>
  <text x="192" y="217" fill="#8a8580" font-size="9" text-anchor="middle">Medium</text>
  <text x="290" y="168" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">L₂ = G₂ − Up(G₃)</text>
  <rect x="262" y="175" width="55" height="50" rx="4" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="290" y="202" fill="#6a8a7a" font-size="9" text-anchor="middle">低頻</text>
  <text x="368" y="168" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">G₃</text>
  <rect x="347" y="175" width="42" height="42" rx="4" fill="rgba(106,138,122,0.25)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="368" y="200" fill="#5a5550" font-size="9" text-anchor="middle">殘差</text>
  <!-- Enhancement arrows and gains -->
  <text x="325" y="272" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">各層獨立增益控制</text>
  <rect x="30" y="282" width="80" height="35" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="70" y="304" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">α₀ = 2.0</text>
  <rect x="160" y="282" width="65" height="35" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="192" y="304" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">α₁ = 1.5</text>
  <rect x="267" y="282" width="48" height="35" rx="4" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="291" y="304" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">α₂ = 0.8</text>
  <rect x="350" y="282" width="38" height="35" rx="4" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="369" y="304" fill="#648cb4" font-size="11" text-anchor="middle" font-weight="500">×1</text>
  <!-- Reconstruction formula -->
  <rect x="40" y="340" width="560" height="30" rx="4" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="360" fill="#5a5550" font-size="12" text-anchor="middle">重建：Output = Up(Up(Up(G₃) + α₂·L₂) + α₁·L₁) + α₀·L₀</text>
</svg><div class="caption">圖 6-8：Laplacian Pyramid 分解 — 各頻率層獨立增益控制後重建</div></div>

<h3>分解流程</h3>
<p>Laplacian Pyramid 的建構步驟：</p>
<ol>
  <li><strong>建構 Gaussian Pyramid</strong>：G₀ → G₁ → G₂ → ... 每一層都是上一層經過 Gaussian 平滑後下取樣 2 倍</li>
  <li><strong>計算 Laplacian 層</strong>：Lₖ = Gₖ − Upsample(Gₖ₊₁)，即當前解析度層與上取樣回來的低解析度層之差</li>
  <li><strong>最後一層殘差</strong>：最粗糙層的 Gaussian 影像直接作為殘差保留</li>
</ol>

<p>每層 Laplacian 代表了特定頻帶的細節：</p>
<table>
  <tr><th>層</th><th>頻率範圍</th><th>對應的影像內容</th><th>典型增益</th></tr>
  <tr><td>L₀</td><td>最高頻</td><td>噪聲、精細紋理、毛髮</td><td>1.0~2.0（注意噪聲）</td></tr>
  <tr><td>L₁</td><td>中高頻</td><td>細節紋理、小文字</td><td>1.5~2.5</td></tr>
  <tr><td>L₂</td><td>中低頻</td><td>較大結構、輪廓</td><td>0.8~1.5</td></tr>
  <tr><td>Residual</td><td>最低頻</td><td>大面積明暗分佈</td><td>1.0（不動）</td></tr>
</table>

<h3>多尺度銳化的優勢</h3>
<ul>
  <li><strong>精細的頻率控制</strong>：可以獨立增強精細紋理而不影響粗糙邊緣，反之亦然</li>
  <li><strong>更好的噪聲管理</strong>：在最高頻層（L₀）使用較保守的增益或更強的 Coring，因為噪聲主要集中在此</li>
  <li><strong>Clarity / Micro-contrast</strong>：透過增強中頻層可以獲得類似「清晰度」的效果，不依賴傳統銳化</li>
  <li><strong>局部對比度增強</strong>：增強低頻層可提升整體的 Local Contrast</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  多尺度銳化的核心價值在於「分頻處理」。就像音頻 EQ 可以獨立調節低音、中音、高音一樣，多尺度銳化讓你可以獨立調節影像的精細紋理、中等紋理和粗糙結構的增強程度。這提供了單一 USM 無法達到的靈活性。
</div>

<h3>硬體實作考量</h3>
<p>Laplacian Pyramid 在硬體 ISP 中的實作有一些挑戰：</p>
<ul>
  <li><strong>記憶體需求</strong>：需要同時儲存多層影像，記憶體頻寬增加</li>
  <li><strong>延遲</strong>：需要先建構完整的 Pyramid 才能開始重建，增加 Latency</li>
  <li><strong>替代方案</strong>：在硬體限制下，常用「多個不同 Radius 的 USM 並行」來近似多尺度效果，例如同時用 σ=1、σ=3、σ=5 三個 USM，各自有獨立的增益和 Coring 設定</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在手機 ISP 中，常見的做法是使用 2-3 個平行的 USM 通道來近似多尺度銳化，而非真正的 Pyramid 分解。這樣可以在保持即時處理能力的同時，獲得大部分的多尺度銳化優勢。
</div>
`,
      keyPoints: [
        "多尺度銳化將影像分解為不同頻率層，各層獨立控制增益",
        "Laplacian Pyramid 是最經典的多尺度分解方法",
        "高頻層（L₀）含較多噪聲，需保守增益；中頻層增強可獲得 Clarity 效果",
        "硬體 ISP 常用多個不同 Radius 的 USM 並行來近似多尺度效果",
        "多尺度銳化提供了類似音頻 EQ 的精細頻率控制能力"
      ]
    },
    {
      id: "ch6_9",
      title: "Deconvolution Sharpening 反卷積銳化",
      content: `
<h3>從「增強」到「恢復」</h3>
<p>前面討論的 USM、Laplacian 等方法都屬於<strong>增強型銳化（Enhancement Sharpening）</strong>— 它們不考慮模糊的物理成因，只是單純地增強高頻。而<strong>Deconvolution Sharpening（反卷積銳化）</strong>則是一種<strong>恢復型方法（Restoration）</strong>，它嘗試從已知或估計的模糊模型出發，數學上「反轉」模糊過程，恢復原始的銳利影像。</p>

<p>成像過程可以用卷積模型描述：</p>
<div class="formula">g(x,y) = f(x,y) * h(x,y) + n(x,y)</div>
<p>其中 <code>g</code> 是觀測到的模糊影像，<code>f</code> 是原始銳利影像，<code>h</code> 是 PSF（Point Spread Function），<code>n</code> 是噪聲，<code>*</code> 表示卷積。</p>

<p>Deconvolution 的目標就是從 <code>g</code> 和 <code>h</code> 估計出 <code>f</code>。</p>

<div class="diagram"><svg viewBox="0 0 650 240" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="240" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Deconvolution 銳化流程</text>
  <defs><marker id="arrowD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Blurred image -->
  <rect x="20" y="55" width="100" height="75" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="70" y="85" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">模糊影像</text>
  <text x="70" y="102" fill="#8a8580" font-size="10" text-anchor="middle">g(x,y)</text>
  <!-- Arrow -->
  <line x1="120" y1="92" x2="160" y2="92" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowD)"/>
  <!-- PSF estimation -->
  <rect x="165" y="40" width="110" height="45" rx="6" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="220" y="60" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="500">PSF 估計</text>
  <text x="220" y="75" fill="#8a8580" font-size="9" text-anchor="middle">鏡頭資料 / 自動估計</text>
  <!-- PSF feeds into deconv -->
  <line x1="220" y1="85" x2="220" y2="102" stroke="#c4a064" stroke-width="1" marker-end="url(#arrowD)"/>
  <!-- Deconvolution -->
  <rect x="165" y="105" width="110" height="55" rx="6" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="220" y="128" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Deconvolution</text>
  <text x="220" y="145" fill="#8a8580" font-size="9" text-anchor="middle">Wiener / RL / ...</text>
  <!-- Arrow -->
  <line x1="275" y1="132" x2="315" y2="132" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowD)"/>
  <!-- Regularization -->
  <rect x="320" y="105" width="110" height="55" rx="6" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="375" y="128" fill="#648cb4" font-size="11" text-anchor="middle" font-weight="500">正則化</text>
  <text x="375" y="145" fill="#8a8580" font-size="9" text-anchor="middle">Regularization</text>
  <!-- Arrow -->
  <line x1="430" y1="132" x2="470" y2="132" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowD)"/>
  <!-- Post-process -->
  <rect x="475" y="105" width="80" height="55" rx="6" fill="rgba(160,130,180,0.1)" stroke="#a082b4" stroke-width="1.2"/>
  <text x="515" y="128" fill="#a082b4" font-size="11" text-anchor="middle" font-weight="500">後處理</text>
  <text x="515" y="145" fill="#8a8580" font-size="9" text-anchor="middle">Artifact 抑制</text>
  <!-- Arrow -->
  <line x1="555" y1="132" x2="585" y2="132" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowD)"/>
  <!-- Restored -->
  <rect x="590" y="85" width="50" height="60" rx="6" fill="#6a8a7a" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="615" y="112" fill="#fff" font-size="10" text-anchor="middle" font-weight="500">恢復</text>
  <text x="615" y="128" fill="rgba(255,255,255,0.8)" font-size="9" text-anchor="middle">f̂</text>
  <!-- Bottom: noise consideration -->
  <rect x="120" y="185" width="400" height="40" rx="6" fill="rgba(196,160,100,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="320" y="210" fill="#8a8580" font-size="11" text-anchor="middle">噪聲模型 n(x,y) 的估計對 Deconvolution 品質至關重要</text>
</svg><div class="caption">圖 6-9：Deconvolution 銳化流程 — 從模糊影像經 PSF 估計到恢復</div></div>

<h3>常用的 Deconvolution 方法</h3>

<h4>1. Inverse Filter（逆濾波）</h4>
<div class="formula">F̂(u,v) = G(u,v) / H(u,v)</div>
<p>最直接但最不實用的方法。在 H(u,v) 接近零的頻率處會極度放大噪聲，導致結果充滿 artifact。實務上幾乎不使用。</p>

<h4>2. Wiener Filter（維納濾波）</h4>
<div class="formula">F̂(u,v) = [H*(u,v) / (|H(u,v)|² + NSR)] × G(u,v)</div>
<p>其中 NSR（Noise-to-Signal Ratio）是噪聲功率與信號功率之比。Wiener Filter 在最小均方誤差（MMSE）意義下是最優的線性恢復方法。它的關鍵優勢是在噪聲較大的頻率處自動降低增益，避免了逆濾波的噪聲放大問題。</p>

<h4>3. Richardson-Lucy (RL) Deconvolution</h4>
<p>一種迭代式的最大似然估計方法，假設噪聲服從 Poisson 分佈（這正好符合光子計數的物理特性）：</p>
<div class="formula">f̂ₖ₊₁ = f̂ₖ × (h_flipped * [g / (h * f̂ₖ)])</div>
<p>RL Deconvolution 的優點是天然保持非負性（影像值不會為負），且能處理 Poisson 噪聲。但需要控制迭代次數以避免過度恢復。</p>

<h3>PSF 的來源</h3>
<p>Deconvolution 的效果高度依賴 PSF 的準確性。PSF 可以從以下方式獲得：</p>
<ul>
  <li><strong>鏡頭設計資料</strong>：從光學模擬軟體（如 Zemax）獲取理想 PSF</li>
  <li><strong>量測校準</strong>：使用點光源或狹縫直接量測實際 PSF</li>
  <li><strong>Blind Deconvolution</strong>：同時估計 PSF 和銳利影像（計算昂貴）</li>
  <li><strong>參數化模型</strong>：假設 PSF 為 Gaussian 或 Airy Disk，只估計少數參數</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  Deconvolution 常見的問題包括：(1) Ringing Artifact — 在邊緣附近出現震盪紋，特別是使用 Wiener Filter 時；(2) Noise Amplification — 即使有正則化，仍可能在某些頻率放大噪聲；(3) PSF 不準確 — 如果估計的 PSF 與真實 PSF 有偏差，恢復結果可能比原圖更差。
</div>

<h3>ISP 中的實務應用</h3>
<p>在手機 ISP 中，完整的 Deconvolution 因計算量和 PSF 估計的困難度，通常不直接實作。但其概念被應用於：</p>
<ul>
  <li><strong>Lens Shading 感知銳化</strong>：利用鏡頭的 MTF 特性圖，在畫面周邊（MTF 較低處）施加較強的銳化</li>
  <li><strong>簡化的 Wiener 型銳化濾波器</strong>：設計一個考慮了 NSR 的銳化 kernel，而非簡單的 USM</li>
  <li><strong>AI-based Deconvolution</strong>：利用深度學習網路隱式學習 PSF 和反卷積過程</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  如果需要在 ISP 中使用 Deconvolution 概念，建議從簡化的 Wiener-like 方法入手：先用鏡頭量測資料得到不同影像區域的 MTF 值，然後設計一個空間變化的 USM 增益圖，在 MTF 低的區域（通常是四角）施加更強的增強。這比完整 Deconvolution 穩定得多。
</div>
`,
      keyPoints: [
        "Deconvolution 是恢復型銳化，嘗試數學上反轉模糊過程",
        "Wiener Filter 在 MMSE 意義下最優，自動根據 NSR 調節增益",
        "Richardson-Lucy 適合 Poisson 噪聲模型，但需控制迭代次數",
        "PSF 的準確性是 Deconvolution 品質的關鍵",
        "實務 ISP 中常用簡化 Wiener 概念或 AI 方法替代完整 Deconvolution"
      ]
    },
    {
      id: "ch6_10",
      title: "銳化與噪聲交互作用",
      content: `
<h3>銳化與降噪的永恆拉鋸</h3>
<p>在 ISP Pipeline 中，銳化和降噪（Noise Reduction）是一對矛盾的操作：降噪試圖平滑噪聲（本質是移除高頻成分），而銳化試圖增強高頻成分。兩者的交互作用是 IQ Tuning 中最核心也最困難的課題之一。</p>

<p>如果先強力降噪再銳化，影像會失去自然的紋理感；如果降噪不足就銳化，噪聲會被放大成難看的顆粒。</p>

<div class="diagram"><svg viewBox="0 0 650 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="320" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">銳化對噪聲的放大效應</text>
  <!-- Signal+noise input -->
  <text x="100" y="55" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">原始信號（含噪聲）</text>
  <line x1="30" y1="130" x2="280" y2="130" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <!-- Clean signal -->
  <path d="M30,150 L80,150 L85,150 Q120,150 130,90 Q140,80 150,90 Q160,150 180,150 L280,150" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <!-- Noisy signal -->
  <path d="M30,153 L40,148 L50,155 L60,147 L70,152 L80,146 L85,150 Q110,156 120,93 L125,88 L128,96 L130,85 L132,92 L135,82 L138,90 L140,78 L143,86 L148,92 L150,88 L155,100 Q160,150 165,148 L170,155 L175,147 L180,153 L190,146 L200,155 L210,148 L220,153 L230,146 L240,152 L250,148 L260,154 L270,147 L280,152" fill="none" stroke="#c4a064" stroke-width="1.5"/>
  <!-- After sharpening -->
  <text x="480" y="55" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">銳化後（噪聲放大）</text>
  <line x1="350" y1="130" x2="620" y2="130" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <!-- Enhanced signal -->
  <path d="M350,150 L400,150 Q420,150 430,70 Q440,55 450,70 Q460,150 475,150 L620,150" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <!-- Noisy + sharpened -->
  <path d="M350,158 L355,140 L360,162 L365,135 L370,160 L375,138 L380,158 L385,137 L390,155 Q410,165 420,68 L423,55 L426,78 L430,50 L433,72 L436,45 L439,65 L442,52 L448,72 L450,60 L455,85 Q460,150 465,140 L470,162 L475,138 L480,160 L490,132 L500,165 L510,130 L520,162 L530,135 L540,158 L550,132 L560,160 L570,136 L580,162 L590,134 L600,158 L610,140 L620,155" fill="none" stroke="#c4a064" stroke-width="1.5"/>
  <!-- Labels -->
  <line x1="80" y1="275" x2="110" y2="275" stroke="#6a8a7a" stroke-width="2"/>
  <text x="115" y="279" fill="#5a5550" font-size="11">真實信號 (Signal)</text>
  <line x1="270" y1="275" x2="300" y2="275" stroke="#c4a064" stroke-width="1.5"/>
  <text x="305" y="279" fill="#5a5550" font-size="11">含噪聲信號 (Signal + Noise)</text>
  <!-- Annotation -->
  <rect x="120" y="195" width="400" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="320" y="215" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">銳化不分真實邊緣與噪聲 — 兩者同時被放大</text>
  <text x="320" y="235" fill="#8a8580" font-size="11" text-anchor="middle">平坦區的噪聲放大最為明顯（因為沒有真實細節來「掩蓋」噪聲）</text>
</svg><div class="caption">圖 6-10：銳化對噪聲的放大效應 — 原始噪聲（左）vs 銳化後噪聲增大（右）</div></div>

<h3>噪聲放大的數學分析</h3>
<p>從頻率域來看，如果 USM 的頻率響應為 H_sharp(f) = 1 + α × H_hp(f)，那麼噪聲的功率譜也會被放大：</p>
<div class="formula">PSD_noise_output(f) = |H_sharp(f)|² × PSD_noise_input(f)</div>

<p>在高頻處 |H_sharp(f)| > 1，噪聲功率被放大 |H_sharp|² 倍。如果 α = 2.0 且在某頻率 H_hp = 1（完全高通），則噪聲在該頻率被放大 (1+2)² = 9 倍！</p>

<h3>處理策略</h3>

<h4>策略一：先降噪後銳化（標準流程）</h4>
<p>這是最常見的處理順序。先用降噪移除噪聲，再用銳化恢復被降噪「過度平滑」的邊緣。</p>
<ul>
  <li><strong>優點</strong>：概念簡單，每個模組獨立調適</li>
  <li><strong>缺點</strong>：降噪不可避免地會損失一些真實紋理，銳化無法完全恢復</li>
</ul>

<h4>策略二：聯合降噪與銳化</h4>
<p>將降噪和銳化視為一個聯合優化問題。例如使用 Wiener Filter，它同時考慮了 PSF（模糊）和噪聲：</p>
<div class="formula">H_wiener(f) = H*(f) / (|H(f)|² + NSR(f))</div>
<p>在信噪比高的頻率做反卷積（銳化），在信噪比低的頻率做抑制（降噪）。</p>

<h4>策略三：Coring 為橋樑</h4>
<p>如前所述，Coring 是銳化中處理噪聲最直接的工具。好的 Coring 設計能讓銳化「自動」忽略噪聲級別的細節。</p>

<h4>策略四：頻率分離</h4>
<p>將影像分解為不同頻帶，在噪聲主導的高頻帶做較弱的銳化（或甚至做降噪），在信號主導的中低頻帶做較強的銳化。</p>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  銳化和降噪的目標可以統一為：<strong>最大化 SNR 加權的銳度</strong>。在 SNR 高的地方大膽銳化，在 SNR 低的地方保守銳化或反過來降噪。所有的自適應方法（Coring、多尺度、Wiener 等）本質上都在追求這個目標。
</div>

<h3>ISO 自適應的銳化-降噪平衡</h3>
<table>
  <tr><th>ISO</th><th>SNR 特性</th><th>降噪強度</th><th>銳化強度</th><th>Coring 門檻</th></tr>
  <tr><td>100</td><td>SNR 高</td><td>弱</td><td>強</td><td>低</td></tr>
  <tr><td>400</td><td>SNR 中</td><td>中</td><td>中</td><td>中</td></tr>
  <tr><td>1600</td><td>SNR 低</td><td>強</td><td>弱</td><td>高</td></tr>
  <tr><td>6400+</td><td>SNR 很低</td><td>很強</td><td>很弱或不銳化</td><td>很高</td></tr>
</table>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在調適銳化與降噪的平衡時，一個有用的檢查方法是：在 100% 裁切下觀察天空等平坦區域。如果能看到明顯的顆粒狀噪聲，說明銳化過強或 Coring 不足；如果紋理區域（如草地、頭髮）看起來像「塗抹」的油畫效果，說明降噪過強。理想的狀態是平坦區乾淨、紋理區自然。
</div>
`,
      keyPoints: [
        "銳化和降噪是一對矛盾的操作 — 降噪去除高頻、銳化增強高頻",
        "銳化對噪聲功率的放大是 |H_sharp|² 倍",
        "主要策略：先降噪後銳化、聯合 Wiener 優化、Coring 橋樑、頻率分離",
        "銳化-降噪的統一目標是最大化 SNR 加權的銳度",
        "ISO 越高，降噪越強、銳化越弱、Coring 門檻越高"
      ]
    },
    {
      id: "ch6_11",
      title: "YUV vs RGB Domain 銳化",
      content: `
<h3>色彩空間的選擇對銳化的影響</h3>
<p>在 ISP 中，銳化可以在不同的色彩空間中進行。最常見的兩個選擇是 <strong>RGB Domain</strong> 和 <strong>YUV Domain（或 YCbCr）</strong>。色彩空間的選擇對銳化的效果和可能產生的 artifact 有重大影響。</p>

<h3>RGB Domain 銳化</h3>
<p>在 RGB Domain 中，銳化獨立地施加在 R、G、B 三個通道上：</p>
<div class="formula">R_sharp = R + α × HighPass(R)<br>G_sharp = G + α × HighPass(G)<br>B_sharp = B + α × HighPass(B)</div>

<p><strong>問題</strong>：由於 R、G、B 通道在邊緣處的變化幅度可能不同（特別是在色彩邊緣處），獨立銳化會導致三通道的增強量不一致，產生<strong>色彩偽影（Color Fringing / Zipper Artifact）</strong>。例如，一個紅色區域與綠色區域的邊界，R 通道有強邊緣但 G 通道也有，獨立銳化後可能在邊緣附近出現不自然的彩色條紋。</p>

<h3>YUV Domain 銳化</h3>
<p>在 YUV Domain 中，通常只對 <strong>Y（亮度）通道</strong>進行銳化，而保持 U、V（色度）通道不變：</p>
<div class="formula">Y_sharp = Y + α × HighPass(Y)<br>U_sharp = U (不變)<br>V_sharp = V (不變)</div>

<p>這個策略利用了人眼視覺的特性：人眼對亮度的解析力遠高於對色彩的解析力。因此，只銳化亮度通道就足以產生「銳利」的感知，同時完全避免了色彩偽影。</p>

<div class="diagram"><svg viewBox="0 0 650 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="300" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">RGB vs YUV Domain 銳化 Pipeline</text>
  <defs><marker id="arrowY" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- RGB Pipeline (top) -->
  <text x="325" y="52" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">方案 A：RGB Domain 銳化</text>
  <rect x="30" y="62" width="70" height="40" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="65" y="86" fill="#5a5550" font-size="10" text-anchor="middle">RGB 影像</text>
  <line x1="100" y1="82" x2="130" y2="82" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <!-- R channel -->
  <rect x="135" y="60" width="55" height="15" rx="3" fill="rgba(200,80,80,0.2)" stroke="rgba(200,80,80,0.5)" stroke-width="1"/>
  <text x="162" y="71" fill="#c05050" font-size="8" text-anchor="middle">R → Sharp</text>
  <rect x="135" y="78" width="55" height="15" rx="3" fill="rgba(80,160,80,0.2)" stroke="rgba(80,160,80,0.5)" stroke-width="1"/>
  <text x="162" y="89" fill="#50a050" font-size="8" text-anchor="middle">G → Sharp</text>
  <rect x="135" y="96" width="55" height="15" rx="3" fill="rgba(80,80,200,0.2)" stroke="rgba(80,80,200,0.5)" stroke-width="1"/>
  <text x="162" y="107" fill="#5050c0" font-size="8" text-anchor="middle">B → Sharp</text>
  <line x1="190" y1="82" x2="220" y2="82" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <rect x="225" y="62" width="70" height="40" rx="4" fill="#fff" stroke="#c4a064" stroke-width="1.2"/>
  <text x="260" y="80" fill="#c4a064" font-size="9" text-anchor="middle">RGB 銳化</text>
  <text x="260" y="93" fill="#8a8580" font-size="8" text-anchor="middle">⚠ 色彩偽影</text>
  <!-- Warning icon -->
  <rect x="320" y="65" width="290" height="35" rx="4" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="465" y="80" fill="#c4a064" font-size="10" text-anchor="middle">問題：三通道獨立銳化 → Color Fringing</text>
  <text x="465" y="94" fill="#8a8580" font-size="9" text-anchor="middle">色彩邊緣處 R/G/B 增強量不一致</text>
  <!-- YUV Pipeline (bottom) -->
  <text x="325" y="142" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">方案 B：YUV Domain 銳化（推薦）</text>
  <rect x="30" y="155" width="70" height="40" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="65" y="179" fill="#5a5550" font-size="10" text-anchor="middle">RGB 影像</text>
  <line x1="100" y1="175" x2="130" y2="175" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <!-- RGB to YUV -->
  <rect x="135" y="155" width="70" height="40" rx="4" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="170" y="173" fill="#6a8a7a" font-size="10" text-anchor="middle">RGB→YUV</text>
  <text x="170" y="186" fill="#8a8580" font-size="8" text-anchor="middle">色彩轉換</text>
  <line x1="205" y1="175" x2="235" y2="175" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <!-- Y channel sharpening -->
  <rect x="240" y="152" width="55" height="18" rx="3" fill="rgba(106,138,122,0.25)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="267" y="164" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">Y → Sharp</text>
  <!-- U, V bypass -->
  <rect x="240" y="173" width="55" height="14" rx="3" fill="rgba(100,140,180,0.1)" stroke="#d5cec7" stroke-width="1"/>
  <text x="267" y="183" fill="#8a8580" font-size="8" text-anchor="middle">U → bypass</text>
  <rect x="240" y="190" width="55" height="14" rx="3" fill="rgba(100,140,180,0.1)" stroke="#d5cec7" stroke-width="1"/>
  <text x="267" y="200" fill="#8a8580" font-size="8" text-anchor="middle">V → bypass</text>
  <line x1="295" y1="175" x2="325" y2="175" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <!-- YUV to RGB -->
  <rect x="330" y="155" width="70" height="40" rx="4" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="365" y="173" fill="#6a8a7a" font-size="10" text-anchor="middle">YUV→RGB</text>
  <text x="365" y="186" fill="#8a8580" font-size="8" text-anchor="middle">色彩轉回</text>
  <line x1="400" y1="175" x2="425" y2="175" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowY)"/>
  <rect x="430" y="155" width="70" height="40" rx="4" fill="#6a8a7a" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="465" y="173" fill="#fff" font-size="10" text-anchor="middle" font-weight="500">Output</text>
  <text x="465" y="186" fill="rgba(255,255,255,0.8)" font-size="8" text-anchor="middle">無色偽影</text>
  <!-- Comparison table area -->
  <rect x="50" y="220" width="550" height="60" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="240" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">人眼視覺特性：亮度解析力 >> 色彩解析力</text>
  <text x="325" y="260" fill="#8a8580" font-size="10" text-anchor="middle">因此，只銳化 Y（亮度）通道已足夠產生銳利感知，且完全避免色彩偽影</text>
  <text x="325" y="275" fill="#6a8a7a" font-size="10" text-anchor="middle">→ 業界標準做法是 YUV Domain 銳化</text>
</svg><div class="caption">圖 6-11：RGB vs YUV Domain 銳化 Pipeline 比較</div></div>

<h3>詳細比較</h3>
<table>
  <tr><th>特性</th><th>RGB Domain 銳化</th><th>YUV Domain 銳化</th></tr>
  <tr><td>色彩偽影</td><td>容易產生 Color Fringing</td><td>不會產生（U/V 不動）</td></tr>
  <tr><td>計算量</td><td>3 通道各做一次</td><td>1 通道 + 色彩轉換</td></tr>
  <tr><td>紋理保真度</td><td>可保留色彩紋理</td><td>色彩紋理不增強</td></tr>
  <tr><td>噪聲表現</td><td>RGB 噪聲同時放大</td><td>僅亮度噪聲放大</td></tr>
  <tr><td>業界採用</td><td>少見（特殊場合）</td><td>主流做法</td></tr>
</table>

<h3>進階：色度通道的處理</h3>
<p>雖然標準做法是不銳化 U/V 通道，但在某些情況下，色度通道也需要處理：</p>
<ul>
  <li><strong>色度去噪</strong>：U/V 通道通常有較大的噪聲（特別是使用 Bayer Pattern 時），可以對 U/V 做額外的低通濾波（NR），讓色彩更乾淨</li>
  <li><strong>輕微的色度銳化</strong>：在某些高品質影像管線中，可能對 U/V 做非常輕微的銳化（Amount 為亮度的 10-20%），以避免色彩邊緣看起來「太軟」</li>
  <li><strong>色度 Edge-aware 平滑</strong>：使用 Y 通道的邊緣資訊來引導 U/V 通道的濾波，在邊緣處保持色彩銳利，平坦處抑制色度噪聲</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  YUV Domain 銳化是業界的標準做法，其核心理由是人眼對亮度解析力遠高於色度。只銳化 Y 通道即可獲得銳利感知，同時完全消除色彩偽影風險。額外的色度處理（如去噪或輕微銳化）可視需求選擇性加入。
</div>

<h3>ISP Pipeline 中的位置考量</h3>
<p>在典型的 ISP Pipeline 中，RGB→YUV 轉換後的處理位置需要注意：</p>
<ul>
  <li>如果 ISP 在 RGB Domain 輸出（例如給後續的 AI 處理），銳化可能需要在 RGB 階段完成</li>
  <li>如果直接輸出到 JPEG/H.264 編碼器（工作在 YUV Domain），則 Y-only 銳化非常自然</li>
  <li>某些 ISP 晶片提供了「RGB 域中只銳化亮度成分」的功能，即先計算 Y = 0.299R + 0.587G + 0.114B，對 Y 做銳化得到差值 ΔY，然後將 ΔY 加回 R、G、B — 效果等同於 YUV 域銳化但不需要完整的色彩轉換</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  如果 ISP 架構不方便做完整的 RGB↔YUV 轉換，可以使用「Green Channel Sharpening」作為近似：因為 Bayer Pattern 中 G 通道佔了 50% 的像素且與亮度高度相關，只對 G 通道銳化，R 和 B 通道施加同樣的銳化 delta，可以得到接近 Y-only 銳化的效果。
</div>
`,
      keyPoints: [
        "RGB Domain 銳化三通道獨立處理，容易產生 Color Fringing",
        "YUV Domain 只銳化 Y（亮度）通道是業界標準做法",
        "人眼對亮度解析力遠高於色度，Y-only 銳化已足夠",
        "色度通道可做去噪或 Edge-aware 平滑，但一般不銳化",
        "在 RGB 域也可透過只計算並加回亮度差值 ΔY 來達到等效效果"
      ]
    },
    {
      id: "ch6_12",
      title: "Micro-contrast 與 Clarity",
      content: `
<h3>什麼是 Micro-contrast？</h3>
<p><strong>Micro-contrast（微對比度）</strong>描述的是影像在<strong>中等空間頻率</strong>範圍（大約 0.1~0.5 cycles/pixel）的對比保留能力。不同於傳統「銳度」主要關注高頻邊緣（如 MTF50/MTF10），Micro-contrast 關注的是<strong>紋理的立體感和質感</strong>。</p>

<p>一張 Micro-contrast 好的影像，物體表面的細微起伏、布料的紋理、皮膚的毛孔都會呈現出豐富的層次感，讓影像看起來「有深度」。相反，Micro-contrast 差的影像即使高頻邊緣銳利，物體表面也會顯得平板無趣。</p>

<h3>Clarity（清晰度）</h3>
<p><strong>Clarity</strong>是 Adobe Lightroom/Camera Raw 中推廣的概念，在技術上它就是一種中頻增強：</p>
<div class="formula">Clarity ≈ Local Contrast Enhancement at Medium Frequencies</div>

<p>具體來說，Clarity 增強的是<strong>比傳統銳化更大尺度但比全域 Tone Mapping 更小尺度</strong>的對比。它增強的是 pixel-level 以上、region-level 以下的對比度變化。</p>

<div class="diagram"><svg viewBox="0 0 650 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="350" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Micro-contrast 增強前後效果</text>
  <!-- Before panel -->
  <rect x="30" y="45" width="280" height="180" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="170" y="68" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">增強前 (Before)</text>
  <!-- Simulated surface texture - flat -->
  <g opacity="0.5">
    <rect x="50" y="80" width="240" height="130" rx="4" fill="#ccc7c0"/>
    <line x1="50" y1="100" x2="290" y2="100" stroke="#c0bab3" stroke-width="1"/>
    <line x1="50" y1="120" x2="290" y2="120" stroke="#c5bfb8" stroke-width="1"/>
    <line x1="50" y1="140" x2="290" y2="140" stroke="#c0bab3" stroke-width="1"/>
    <line x1="50" y1="160" x2="290" y2="160" stroke="#c5bfb8" stroke-width="1"/>
    <line x1="50" y1="180" x2="290" y2="180" stroke="#c0bab3" stroke-width="1"/>
    <circle cx="120" cy="130" r="30" fill="#c5c0ba" stroke="#bfb9b2" stroke-width="1"/>
    <circle cx="220" cy="145" r="22" fill="#c8c3bd" stroke="#bfb9b2" stroke-width="1"/>
  </g>
  <text x="170" y="200" fill="#8a8580" font-size="10" text-anchor="middle">紋理平淡、缺乏立體感</text>
  <!-- After panel -->
  <rect x="340" y="45" width="280" height="180" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="480" y="68" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">增強後 (After)</text>
  <!-- Simulated surface texture - enhanced -->
  <g>
    <rect x="360" y="80" width="240" height="130" rx="4" fill="#ccc7c0"/>
    <line x1="360" y1="100" x2="600" y2="100" stroke="#b0a89f" stroke-width="1.5"/>
    <line x1="360" y1="120" x2="600" y2="120" stroke="#d5cec7" stroke-width="1.5"/>
    <line x1="360" y1="140" x2="600" y2="140" stroke="#aea69d" stroke-width="1.5"/>
    <line x1="360" y1="160" x2="600" y2="160" stroke="#d8d2cb" stroke-width="1.5"/>
    <line x1="360" y1="180" x2="600" y2="180" stroke="#b0a89f" stroke-width="1.5"/>
    <circle cx="430" cy="130" r="30" fill="#bab4ad" stroke="#a09890" stroke-width="2"/>
    <circle cx="430" cy="130" r="30" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="3"/>
    <circle cx="530" cy="145" r="22" fill="#c2bcb6" stroke="#a8a098" stroke-width="1.5"/>
  </g>
  <text x="480" y="200" fill="#6a8a7a" font-size="10" text-anchor="middle">紋理層次豐富、有立體深度感</text>
  <!-- Frequency scale -->
  <text x="325" y="252" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">不同增強方式的頻率範圍</text>
  <!-- Scale bar -->
  <line x1="60" y1="275" x2="590" y2="275" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="60" y="290" fill="#8a8580" font-size="9" text-anchor="middle">低頻</text>
  <text x="590" y="290" fill="#8a8580" font-size="9" text-anchor="middle">高頻</text>
  <!-- Global tone mapping range -->
  <rect x="60" y="300" width="150" height="18" rx="3" fill="rgba(160,130,180,0.2)" stroke="#a082b4" stroke-width="1"/>
  <text x="135" y="313" fill="#a082b4" font-size="9" text-anchor="middle">Global Tone Mapping</text>
  <!-- Clarity/micro-contrast range -->
  <rect x="170" y="300" width="200" height="18" rx="3" fill="rgba(106,138,122,0.25)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="270" y="313" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">Clarity / Micro-contrast</text>
  <!-- Traditional sharpening range -->
  <rect x="340" y="300" width="250" height="18" rx="3" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1"/>
  <text x="465" y="313" fill="#c4a064" font-size="9" text-anchor="middle">Traditional Sharpening</text>
  <!-- Overlap indicators -->
  <text x="325" y="340" fill="#8a8580" font-size="10" text-anchor="middle">← 各種增強方式在頻率軸上的覆蓋範圍 →</text>
</svg><div class="caption">圖 6-12：Micro-contrast 增強前後對比，以及不同增強方式的頻率範圍</div></div>

<h3>實作方法</h3>

<h4>方法一：大 Radius USM</h4>
<p>使用較大的 Radius（σ = 10~30 pixels）的 USM，可以選擇性地增強中頻細節：</p>
<div class="formula">Clarity = Image + α × (Image − GaussianBlur(Image, σ=15))</div>
<p>注意這裡的 Radius 遠大於傳統銳化（σ = 1~3），所以增強的是更大尺度的對比變化。</p>

<h4>方法二：多尺度方法中的中頻層增強</h4>
<p>在 Laplacian Pyramid 中，選擇性地增強中間的 1-2 層（如 L₁ 和 L₂），而保持最高頻層（L₀）和最低頻層不變。</p>

<h4>方法三：Local Histogram Equalization</h4>
<p>CLAHE（Contrast Limited Adaptive Histogram Equalization）透過局部直方圖均衡化來增強局部對比。它可以有效增強 Micro-contrast，但需要小心設定 Clip Limit 以避免過度增強。</p>

<h3>Micro-contrast 與鏡頭品質</h3>
<p>在攝影界，常有「某支鏡頭的 Micro-contrast 特別好」的說法。這是因為：</p>
<ul>
  <li>高品質鏡頭在中頻範圍的 MTF 值更高（而不只是高頻 MTF50/MTF10 好）</li>
  <li>低色散鏡片減少了色差造成的中頻對比損失</li>
  <li>良好的抗眩光鍍膜減少了內部反射造成的對比下降</li>
</ul>
<p>ISP 中的 Clarity 增強可以部分補償鏡頭 Micro-contrast 的不足，但真正好的鏡頭 + 好的 ISP 處理仍是最佳組合。</p>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  Micro-contrast/Clarity 增強的是「中頻帶」的對比度 — 介於全域 Tone Mapping（低頻）和傳統銳化（高頻）之間。它賦予影像紋理的「質感」和「立體感」，是從「清晰」到「有味道」的關鍵一步。在現代手機 ISP 中，Clarity 調整已成為標準功能。
</div>

<h3>Clarity 調適的注意事項</h3>
<ul>
  <li><strong>正向 Clarity</strong>：增強中頻對比，畫面更「硬朗」，適合風景、建築</li>
  <li><strong>負向 Clarity</strong>：柔化中頻對比，畫面更「柔和」，適合人像、皮膚</li>
  <li><strong>過度的正向 Clarity</strong> 會讓影像看起來像 HDR 過度處理，天空出現不自然的暈染</li>
  <li><strong>Halo 問題</strong>：大 Radius 的增強容易在高對比邊緣（如建築天際線）產生寬大的 Halo，需要 Edge-aware 的處理來避免</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在 ISP Tuning 中實作 Clarity 時，建議使用 Edge-preserving Filter（如 Bilateral Filter 或 Guided Filter）來替代 Gaussian Blur 作為低通基底。這樣可以在增強中頻紋理的同時，避免在強邊緣處產生 Halo。公式變為：Clarity = Image + α × (Image − EdgePreservingSmooth(Image, r=15))。
</div>
`,
      keyPoints: [
        "Micro-contrast 描述中頻範圍的對比保留能力，決定紋理的質感與立體感",
        "Clarity 增強的頻率範圍介於 Global Tone Mapping 和傳統 Sharpening 之間",
        "實作方法包括大 Radius USM、多尺度中頻增強、CLAHE",
        "正向 Clarity 適合風景建築，負向 Clarity 適合人像 — 過度會產生 HDR 感",
        "建議使用 Edge-preserving Filter 替代 Gaussian Blur 以避免 Halo"
      ]
    },
    {
      id: "ch6_13",
      title: "銳化硬體架構：Line Buffer Pipeline 設計",
      content: `
<h3>Line Buffer 在銳化硬體中的核心角色</h3>
<p>在即時影像處理硬體（ASIC / FPGA）中，銳化濾波器必須以<strong>逐像素串流（Pixel Streaming）</strong>的方式運作。與軟體可以隨機存取整張影像不同，硬體 ISP 的資料通常是以 Raster Scan 順序逐行送入。為了在串流模式下實現二維空間濾波（如 3×3、5×5、7×7 Kernel），硬體需要同時存取多行像素資料，這就是 <strong>Line Buffer</strong> 的存在意義。</p>

<p>Line Buffer 本質上是一組 FIFO（First-In First-Out）暫存器，每條 Line Buffer 的深度等於影像寬度。若要實現一個 K×K 的 2D 濾波器，需要 <strong>(K-1)</strong> 條 Line Buffer，加上當前正在讀入的那一行。例如 5×5 Kernel 需要 4 條 Line Buffer，才能在任一時刻提供連續 5 行的像素窗口。</p>

<div class="formula">Line Buffer 總容量 = (Kernel_Height - 1) × Image_Width × Bit_Depth</div>

<p>以 4K 影像（3840 像素寬）、12-bit 資料、7×7 Kernel 為例：Line Buffer 容量 = 6 × 3840 × 12 = 276,480 bits ≈ 33.8 KB。這是純 SRAM 面積，在先進製程中雖不算龐大，但在多模組 ISP 中累積起來仍是重要的面積考量。</p>

<h3>N-tap FIR 濾波器硬體設計</h3>
<p>銳化濾波器的核心是一個 2D FIR（Finite Impulse Response）濾波器。以 Unsharp Mask 為例，典型的操作是先用一個低通 Kernel（如 Gaussian）對影像做平滑，再將原始像素與平滑結果相減得到高頻分量，最後加權疊回原始影像。</p>

<p>在硬體中，2D FIR 通常分解為<strong>可分離（Separable）</strong>的兩組 1D 濾波：先做水平方向的 1D 濾波，再做垂直方向的 1D 濾波。這樣一個 K×K 的 2D 濾波就從 K² 次乘法降為 2K 次乘法，大幅節省面積和功耗。</p>

<div class="info-box key">
  <div class="box-title">🔑 可分離濾波的效益</div>
  <table>
    <tr><th>Kernel Size</th><th>直接 2D 乘法次數</th><th>可分離 1D+1D 乘法次數</th><th>節省比例</th></tr>
    <tr><td>3×3</td><td>9</td><td>6</td><td>33%</td></tr>
    <tr><td>5×5</td><td>25</td><td>10</td><td>60%</td></tr>
    <tr><td>7×7</td><td>49</td><td>14</td><td>71%</td></tr>
    <tr><td>9×9</td><td>81</td><td>18</td><td>78%</td></tr>
  </table>
</div>

<h3>Pipeline 架構與平行 MAC 單元</h3>
<p>硬體 FIR 濾波器的核心運算單元是 <strong>MAC（Multiply-Accumulate）</strong>。在每個時脈週期中，MAC 單元執行一次乘法和一次加法：<code>Acc = Acc + Coeff[i] × Pixel[i]</code>。對於一個 K-tap 1D FIR，需要 K 個 MAC 單元平行工作，才能在單一時脈週期內完成一個輸出像素的運算。</p>

<p>Pipeline 的典型架構如下：</p>
<ol>
  <li><strong>Stage 1 — Tap Register File</strong>：從 Line Buffer 讀取 K 行的像素值，形成 K×K 窗口</li>
  <li><strong>Stage 2 — 水平 FIR</strong>：對每一行執行 K-tap 1D 水平濾波，輸出 K 個中間值</li>
  <li><strong>Stage 3 — 垂直 FIR</strong>：對 K 個水平濾波結果執行 K-tap 1D 垂直濾波，輸出最終濾波值</li>
  <li><strong>Stage 4 — Sharpening Core</strong>：計算 Output = Original + Gain × (Original − Filtered)</li>
  <li><strong>Stage 5 — Clamp/Saturation</strong>：將結果限制在有效範圍內</li>
</ol>

<div class="diagram"><svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="420" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Line Buffer Based Sharpening Pipeline</text>
  <!-- Input stream -->
  <rect x="20" y="60" width="100" height="40" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="70" y="84" fill="#5a5550" font-size="11" text-anchor="middle">Pixel Stream In</text>
  <line x1="120" y1="80" x2="155" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM13)"/>
  <defs><marker id="arrowM13" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Line Buffers -->
  <rect x="160" y="45" width="130" height="70" rx="5" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="225" y="65" fill="#6a8a7a" font-size="11" font-weight="bold" text-anchor="middle">Line Buffers</text>
  <text x="225" y="82" fill="#8a8580" font-size="10" text-anchor="middle">(K-1) × Width × BPP</text>
  <text x="225" y="100" fill="#8a8580" font-size="9" text-anchor="middle">SRAM FIFO Array</text>
  <line x1="290" y1="80" x2="325" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM13)"/>
  <!-- Tap Window -->
  <rect x="330" y="45" width="100" height="70" rx="5" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="380" y="65" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Tap Window</text>
  <text x="380" y="82" fill="#8a8580" font-size="10" text-anchor="middle">K×K Register</text>
  <text x="380" y="98" fill="#8a8580" font-size="9" text-anchor="middle">Shift Register Array</text>
  <line x1="430" y1="80" x2="465" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM13)"/>
  <!-- H-FIR -->
  <rect x="470" y="45" width="90" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="515" y="65" fill="#5a5550" font-size="10" text-anchor="middle">H-FIR (K MAC)</text>
  <!-- V-FIR -->
  <rect x="470" y="85" width="90" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="515" y="105" fill="#5a5550" font-size="10" text-anchor="middle">V-FIR (K MAC)</text>
  <line x1="515" y1="75" x2="515" y2="85" stroke="#5a5550" stroke-width="1"/>
  <line x1="560" y1="100" x2="595" y2="100" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM13)"/>
  <!-- Sharp Core -->
  <rect x="600" y="75" width="100" height="50" rx="5" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="2"/>
  <text x="650" y="96" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">Sharpening</text>
  <text x="650" y="112" fill="#5a5550" font-size="9" text-anchor="middle">Out=Orig+G×HF</text>
  <line x1="700" y1="100" x2="735" y2="100" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM13)"/>
  <!-- Output -->
  <rect x="740" y="80" width="50" height="40" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="765" y="104" fill="#5a5550" font-size="10" text-anchor="middle">Out</text>
  <!-- Delay path for original pixel -->
  <path d="M380,115 L380,160 L650,160 L650,125" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrowM13)"/>
  <text x="510" y="155" fill="#8a8580" font-size="9" text-anchor="middle">Delayed Original Pixel (bypass)</text>
  <!-- Area/Power table -->
  <rect x="40" y="200" width="720" height="200" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="225" fill="#5a5550" font-size="13" font-weight="bold" text-anchor="middle">面積 / 功耗 / 延遲比較 (4K @12-bit)</text>
  <line x1="60" y1="240" x2="740" y2="240" stroke="#d5cec7" stroke-width="1"/>
  <text x="120" y="258" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Kernel</text>
  <text x="250" y="258" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Line Buffer</text>
  <text x="390" y="258" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">MAC Units</text>
  <text x="530" y="258" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Latency (lines)</text>
  <text x="670" y="258" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Relative Area</text>
  <line x1="60" y1="268" x2="740" y2="268" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="120" y="290" fill="#5a5550" font-size="11" text-anchor="middle">3×3</text>
  <text x="250" y="290" fill="#8a8580" font-size="11" text-anchor="middle">2 × 3840 = 7680</text>
  <text x="390" y="290" fill="#8a8580" font-size="11" text-anchor="middle">6 (separable)</text>
  <text x="530" y="290" fill="#8a8580" font-size="11" text-anchor="middle">2</text>
  <text x="670" y="290" fill="#6a8a7a" font-size="11" text-anchor="middle">1.0×</text>
  <text x="120" y="315" fill="#5a5550" font-size="11" text-anchor="middle">5×5</text>
  <text x="250" y="315" fill="#8a8580" font-size="11" text-anchor="middle">4 × 3840 = 15360</text>
  <text x="390" y="315" fill="#8a8580" font-size="11" text-anchor="middle">10 (separable)</text>
  <text x="530" y="315" fill="#8a8580" font-size="11" text-anchor="middle">4</text>
  <text x="670" y="315" fill="#6a8a7a" font-size="11" text-anchor="middle">2.2×</text>
  <text x="120" y="340" fill="#5a5550" font-size="11" text-anchor="middle">7×7</text>
  <text x="250" y="340" fill="#8a8580" font-size="11" text-anchor="middle">6 × 3840 = 23040</text>
  <text x="390" y="340" fill="#8a8580" font-size="11" text-anchor="middle">14 (separable)</text>
  <text x="530" y="340" fill="#8a8580" font-size="11" text-anchor="middle">6</text>
  <text x="670" y="340" fill="#6a8a7a" font-size="11" text-anchor="middle">3.5×</text>
  <text x="120" y="365" fill="#5a5550" font-size="11" text-anchor="middle">9×9</text>
  <text x="250" y="365" fill="#8a8580" font-size="11" text-anchor="middle">8 × 3840 = 30720</text>
  <text x="390" y="365" fill="#8a8580" font-size="11" text-anchor="middle">18 (separable)</text>
  <text x="530" y="365" fill="#8a8580" font-size="11" text-anchor="middle">8</text>
  <text x="670" y="365" fill="#6a8a7a" font-size="11" text-anchor="middle">5.0×</text>
</svg><div class="caption">圖 6-13：Line Buffer 銳化 Pipeline 硬體架構與不同 Kernel Size 的資源比較</div></div>

<h3>Latency 分析與設計取捨</h3>
<p>Line Buffer Pipeline 的延遲（Latency）由兩部分組成：</p>
<div class="formula">Total Latency = Line Buffer Latency + Pipeline Register Latency = (K-1)/2 × Line_Time + N_stages × Clock_Period</div>

<p>其中 <strong>Line Buffer Latency</strong> 是主要延遲來源。以 7×7 Kernel 為例，輸出像素相對於輸入延遲了 3 行的時間。在 4K@30fps 下，一行的時間約為 8.6μs，因此 3 行延遲約為 25.8μs — 對於即時影像處理來說完全可接受。但 Pipeline Register 額外增加的幾個 Clock 延遲（通常 3-5 Clocks）在高時脈設計中可以忽略不計。</p>

<h3>Line Buffer 的 SRAM 實現策略</h3>
<p>在實際 ASIC 設計中，Line Buffer 通常使用 <strong>Single-Port 或 Dual-Port SRAM Macro</strong> 實現，而非暫存器陣列。SRAM 的面積效率遠高於暫存器（約 6-8 倍），但需要考慮讀寫時序。常見的策略包括：</p>
<ul>
  <li><strong>Ping-Pong Buffer</strong>：兩組 SRAM 交替讀寫，一組寫入新行數據，另一組讀出舊行數據</li>
  <li><strong>Circular Buffer</strong>：使用讀/寫指標在單一 SRAM 中循環存取，節省面積但控制邏輯較複雜</li>
  <li><strong>Register-based</strong>：僅在小 Kernel（3×3）且解析度不高時使用，面積大但時序最簡單</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在多模組 ISP 中，不同模組（如降噪、銳化、色彩校正）各自需要 Line Buffer。一個高效的設計是<strong>共享 Line Buffer Pool</strong>，讓多個模組依序使用同一組 SRAM，透過時分復用（TDM）減少總 SRAM 面積。在 SoC 層級的 ISP 中，Line Buffer 可佔總面積的 20-40%，因此共享設計的節省效益十分顯著。
</div>

<h3>邊界處理（Border Handling）</h3>
<p>當濾波窗口移動到影像邊緣時，部分像素會超出有效範圍。硬體必須處理這些邊界條件：</p>
<ul>
  <li><strong>Zero Padding</strong>：用 0 填充，實現最簡單，但會導致邊緣變暗</li>
  <li><strong>Replicate</strong>：複製最近的有效像素，結果較自然，硬體需額外 MUX 控制</li>
  <li><strong>Mirror</strong>：鏡像反射邊緣像素，品質最好但控制邏輯最複雜</li>
</ul>
<p>在 ISP 實務中，<strong>Replicate</strong> 是最常用的策略，因為它在品質與硬體成本之間取得最佳平衡。</p>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  Line Buffer 的時脈頻率必須與 Pixel Clock 匹配。在高解析度、高幀率的場景下（如 8K@60fps），Pixel Clock 可能超過 600MHz，此時 SRAM 的存取速度成為瓶頸。設計時需要注意 SRAM Macro 的 Setup/Hold Time 裕量，必要時採用多 Bank 交錯存取或更高速的 SRAM Cell 結構。
</div>
`,
      keyPoints: [
        "Line Buffer 是 2D 濾波串流處理的關鍵硬體元件，深度 = (K-1) × 影像寬度",
        "可分離濾波將 K² 乘法降為 2K 乘法，大幅節省 MAC 單元數量",
        "Pipeline 包含 Line Buffer → Tap Window → H-FIR → V-FIR → Sharpening Core → Clamp",
        "Line Buffer 通常用 SRAM Macro 實現，可透過共享 Pool 減少總面積",
        "邊界處理以 Replicate 模式最常用，兼顧品質與硬體成本"
      ]
    },
    {
      id: "ch6_14",
      title: "定點數銳化運算：係數量化與溢位處理",
      content: `
<h3>為何使用定點數？</h3>
<p>在 ISP 硬體中，所有運算都採用<strong>定點數（Fixed-Point）</strong>而非浮點數。浮點運算單元（FPU）的面積和功耗約為同位寬定點運算的 10-20 倍，在每秒處理數億像素的 ISP 中完全不可接受。因此，銳化 Kernel 的係數必須從浮點數量化為定點數表示，同時確保精度損失在可接受範圍內。</p>

<h3>係數量化方法</h3>
<p>以典型的 Unsharp Mask 為例，假設我們使用 5×5 Gaussian Kernel 做為低通濾波器。其浮點係數如下（σ=1.0）：</p>
<pre>
1/273 × [1  4  7  4  1]    (可分離 1D Kernel)
         [4 16 26 16  4]
         [7 26 41 26  7]
         [4 16 26 16  4]
         [1  4  7  4  1]
</pre>

<p>量化步驟如下：</p>
<ol>
  <li><strong>選擇縮放因子</strong>：選取 2 的冪次作為分母，例如 256（2⁸）。將每個浮點係數乘以 256 並四捨五入為整數</li>
  <li><strong>確保係數總和</strong>：所有量化後的整數係數相加應等於縮放因子（256），以保證直流增益為 1.0。若有差值，調整中心係數補償</li>
  <li><strong>使用移位替代除法</strong>：輸出結果右移 8 位（除以 256），在硬體中只需要接線改變，零成本</li>
</ol>

<div class="formula">Quantized_Coeff[i] = round(Float_Coeff[i] × 2^N), 其中 N 為定點小數位數</div>

<div class="info-box example">
  <div class="box-title">📝 範例</div>
  <p>5×5 Gaussian 可分離 1D Kernel（σ=1.0）量化為 8-bit 定點：</p>
  <p>浮點：[0.0037, 0.0147, 0.0256, 0.0147, 0.0037] × 歸一化</p>
  <p>整數（×256）：[1, 16, 41, 16, 1]，總和 = 75</p>
  <p>但因為是 2D 可分離，最終除以 75×75 ≈ 不是 2 的冪次。</p>
  <p>實務做法：調整為 [1, 16, 30, 16, 1]，總和 = 64 = 2⁶，右移 6 位即可。</p>
  <p>2D 總除數 = 64 × 64 = 4096 = 2¹²，右移 12 位。精度損失 < 0.5%。</p>
</div>

<h3>中間位寬分析</h3>
<p>定點運算中最關鍵的設計決策是<strong>中間位寬（Intermediate Bit-Width）</strong>。每一步運算都會增加所需的位元數：</p>

<div class="diagram"><svg viewBox="0 0 800 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="380" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">定點運算各階段位寬分析（12-bit Input, 5×5 Kernel）</text>
  <defs><marker id="arrowM14" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Stage 1: Input -->
  <rect x="30" y="60" width="110" height="55" rx="5" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="85" y="82" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Input Pixel</text>
  <text x="85" y="100" fill="#6a8a7a" font-size="13" font-weight="bold" text-anchor="middle">12 bits</text>
  <line x1="140" y1="87" x2="165" y2="87" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM14)"/>
  <!-- Stage 2: Multiply -->
  <rect x="170" y="60" width="120" height="55" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="230" y="78" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Multiply</text>
  <text x="230" y="93" fill="#8a8580" font-size="9" text-anchor="middle">12b pixel × 6b coeff</text>
  <text x="230" y="108" fill="#6a8a7a" font-size="13" font-weight="bold" text-anchor="middle">18 bits</text>
  <line x1="290" y1="87" x2="315" y2="87" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM14)"/>
  <!-- Stage 3: H-Accumulate -->
  <rect x="320" y="60" width="120" height="55" rx="5" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="380" y="78" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">H-Accumulate</text>
  <text x="380" y="93" fill="#8a8580" font-size="9" text-anchor="middle">5 taps sum</text>
  <text x="380" y="108" fill="#6a8a7a" font-size="13" font-weight="bold" text-anchor="middle">21 bits</text>
  <line x1="440" y1="87" x2="465" y2="87" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM14)"/>
  <!-- Stage 4: V-Accumulate -->
  <rect x="470" y="60" width="120" height="55" rx="5" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="530" y="78" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">V-Accumulate</text>
  <text x="530" y="93" fill="#8a8580" font-size="9" text-anchor="middle">5 rows sum + shift</text>
  <text x="530" y="108" fill="#6a8a7a" font-size="13" font-weight="bold" text-anchor="middle">24 bits → 12b</text>
  <line x1="590" y1="87" x2="615" y2="87" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM14)"/>
  <!-- Stage 5: Sharpen -->
  <rect x="620" y="60" width="110" height="55" rx="5" fill="#6a8a7a" opacity="0.35" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="675" y="78" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Sharpen</text>
  <text x="675" y="93" fill="#8a8580" font-size="9" text-anchor="middle">Orig + G×(Orig-Filt)</text>
  <text x="675" y="108" fill="#6a8a7a" font-size="13" font-weight="bold" text-anchor="middle">14 bits → 12b</text>
  <!-- Bit growth explanation -->
  <rect x="30" y="145" width="740" height="220" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="170" fill="#5a5550" font-size="13" font-weight="bold" text-anchor="middle">位寬增長詳細分析</text>
  <line x1="50" y1="180" x2="750" y2="180" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="60" y="200" fill="#5a5550" font-size="11">1. Multiply: 12b × 6b = 18b（乘法位寬 = 被乘數 + 乘數）</text>
  <text x="60" y="225" fill="#5a5550" font-size="11">2. H-Accumulate: 5 個 18b 值相加 → 需要 ceil(log2(5)) = 3 額外位 → 21b</text>
  <text x="60" y="250" fill="#5a5550" font-size="11">3. V-Accumulate: 5 個 21b 值相加 → 需要 3 額外位 → 24b，然後右移 12b 回到 12b</text>
  <text x="60" y="275" fill="#5a5550" font-size="11">4. High-pass = Original(12b) - Filtered(12b) = 13b（帶符號）</text>
  <text x="60" y="300" fill="#5a5550" font-size="11">5. Gain × HP: 13b × 4b(gain) = 17b（帶符號）</text>
  <text x="60" y="325" fill="#5a5550" font-size="11">6. Output = Original(12b) + Scaled_HP(17b) → 18b（帶符號）→ Clamp 至 12b unsigned</text>
  <text x="60" y="350" fill="#8a8580" font-size="10">* 若在任何中間階段截斷位寬，會引入量化誤差，在弱紋理區域表現為 Banding / False Contour</text>
</svg><div class="caption">圖 6-14：定點銳化運算各階段的位寬增長與數據流標註</div></div>

<h3>溢位與下溢處理</h3>
<p>銳化運算的高頻疊加步驟 <code>Output = Original + Gain × (Original - Filtered)</code> 可能產生超出有效範圍的值：</p>
<ul>
  <li><strong>溢位（Overflow）</strong>：在明亮邊緣的亮側，加上正的高頻分量後超過最大值（如 4095 for 12-bit）</li>
  <li><strong>下溢（Underflow）</strong>：在明亮邊緣的暗側，加上負的高頻分量後低於 0</li>
</ul>

<p>硬體中的處理方式是<strong>飽和運算（Saturation Arithmetic）</strong>：</p>
<pre>
if (result > MAX_VAL)
    output = MAX_VAL;    // Clamp to maximum
else if (result < 0)
    output = 0;          // Clamp to minimum
else
    output = result;     // Pass through
</pre>

<p>在 RTL 中，飽和邏輯通常只需要檢查最高位元（MSB）：若帶符號結果的 MSB 為 1 且應為正值（溢位），則輸出全 1；若結果小於零，則輸出全 0。這僅需一個 MUX 和幾個 Gate，幾乎零面積成本。</p>

<h3>不同精度的品質比較</h3>
<p>中間運算位寬的選擇直接影響最終影像品質：</p>

<div class="info-box key">
  <div class="box-title">🔑 精度比較</div>
  <table>
    <tr><th>中間精度</th><th>量化誤差</th><th>品質影響</th><th>面積成本</th></tr>
    <tr><td>10-bit</td><td>±4 LSB @12b</td><td>弱紋理 Banding 明顯，梯度區域假輪廓</td><td>最小</td></tr>
    <tr><td>12-bit</td><td>±1 LSB @12b</td><td>大部分場景可接受，極暗區域偶有 Banding</td><td>中等</td></tr>
    <tr><td>16-bit</td><td>< 0.1 LSB @12b</td><td>無可見量化誤差，品質等同浮點</td><td>較大</td></tr>
  </table>
  <p>實務建議：中間運算使用 <strong>16-bit 或更寬</strong>的位寬，僅在最終輸出階段截斷至目標位寬（10/12/14-bit）。中間位寬增加的面積主要在加法器和暫存器上，相對於 SRAM Line Buffer 的面積而言很小。</p>
</div>

<h3>係數歸一化策略</h3>
<p>為了讓硬體的除法可以用移位替代，係數的歸一化策略十分重要：</p>
<ul>
  <li><strong>Power-of-2 Normalization</strong>：調整係數使總和為 2^N，輸出右移 N 位。這是最常用的策略，零硬體成本</li>
  <li><strong>Rounding Mode</strong>：右移截斷等同於向下取整（Floor）。為了減少偏差，可以在右移前加上 2^(N-1)，實現四捨五入（Round-to-Nearest）。成本僅一個加法器</li>
  <li><strong>Dithered Rounding</strong>：在截斷位加上 LFSR 產生的隨機位元，將量化誤差分散為白噪聲，避免 Fixed Pattern Noise。適用於高品質要求的場景</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  定點量化最容易被忽略的問題是<strong>非對稱截斷誤差</strong>。如果 Kernel 係數的量化誤差不對稱，會導致濾波器在平坦區域產生直流偏移（DC Offset）。驗證方式：輸入全灰色（均勻值）影像，檢查輸出是否完全等於輸入。任何差值都代表量化偏差。
</div>
`,
      keyPoints: [
        "ISP 硬體全部使用定點數運算，浮點 Kernel 係數需量化為整數",
        "係數總和應為 2 的冪次，使得除法可用免費的位元右移實現",
        "中間位寬隨乘法和累加逐步增長，必須完整保留以避免量化誤差",
        "溢位/下溢以飽和運算處理，僅需極少邏輯面積",
        "建議中間運算使用 16-bit 以上位寬，僅在最終輸出時截斷"
      ]
    },
    {
      id: "ch6_15",
      title: "Shoot Control 硬體實現",
      content: `
<h3>什麼是 Overshoot 與 Undershoot？</h3>
<p>當銳化濾波器增強邊緣對比時，不可避免地會在邊緣兩側產生<strong>過衝（Overshoot）</strong>和<strong>下衝（Undershoot）</strong>。以一個從暗到亮的邊緣為例：銳化後，亮側會比原始值更亮（Overshoot），暗側會比原始值更暗（Undershoot）。這種現象在視覺上表現為邊緣旁的<strong>白色或黑色光暈（Halo）</strong>，嚴重影響影像品質。</p>

<p>Overshoot/Undershoot 的幅度與銳化增益成正比：</p>
<div class="formula">Overshoot = Gain × |High_Pass_Component| = Gain × |Original - LowPass(Original)|</div>

<p>在高對比邊緣（如天空與建築的交界），高頻分量本身就很大，乘上銳化增益後很容易產生可見的 Halo。因此，<strong>Shoot Control</strong> 是銳化模組中不可或缺的子模組。</p>

<h3>Clip-based Shoot Control</h3>
<p>最直接的方法是對銳化增強量設定一個<strong>硬性上限（Hard Clip）</strong>：</p>
<pre>
high_pass = original - lowpass;
enhanced_hp = gain * high_pass;

// Hard clip
if (enhanced_hp > shoot_limit_pos)
    enhanced_hp = shoot_limit_pos;
if (enhanced_hp < -shoot_limit_neg)
    enhanced_hp = -shoot_limit_neg;

output = original + enhanced_hp;
</pre>

<p>硬體實現只需要兩個比較器和兩個 MUX，面積極小。但 Hard Clip 的問題是在 Clip 點附近會產生<strong>非線性截斷</strong>，導致邊緣出現不自然的平坦區域（Flat Top Artifact）。</p>

<h3>Smooth Compression Shoot Control</h3>
<p>為了避免 Hard Clip 的非線性問題，進階設計使用<strong>平滑壓縮（Smooth Compression）</strong>曲線。常見的實現方式包括：</p>
<ul>
  <li><strong>Soft Knee</strong>：在 Clip 點附近使用線性內插過渡，取代突然的截斷</li>
  <li><strong>Power Curve</strong>：使用 <code>f(x) = sign(x) × min(|x|, T) + sign(x) × max(0, |x|-T)^α</code>，α < 1 使超出閾值的部分被壓縮</li>
  <li><strong>LUT-based</strong>：使用查表實現任意壓縮曲線，靈活度最高</li>
</ul>

<div class="diagram"><svg viewBox="0 0 750 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="750" height="400" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Shoot Control 響應曲線比較</text>
  <defs><marker id="arrowM15" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Left graph: response curves -->
  <rect x="30" y="45" width="330" height="300" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <line x1="60" y1="195" x2="340" y2="195" stroke="#5a5550" stroke-width="1"/>
  <line x1="195" y1="60" x2="195" y2="330" stroke="#5a5550" stroke-width="1"/>
  <text x="345" y="200" fill="#8a8580" font-size="9">Input HP</text>
  <text x="195" y="55" fill="#8a8580" font-size="9" text-anchor="middle">Output HP</text>
  <!-- No control (linear) -->
  <line x1="80" y1="310" x2="310" y2="80" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Hard clip -->
  <path d="M80,310 L140,250 L170,220 L195,195 L220,170 L250,140 L250,140 L340,140" fill="none" stroke="#c4a064" stroke-width="2"/>
  <path d="M80,310 L80,250 M80,250 L140,250" fill="none" stroke="#c4a064" stroke-width="2"/>
  <line x1="60" y1="140" x2="340" y2="140" stroke="#c4a064" stroke-width="0.5" stroke-dasharray="3,3"/>
  <line x1="60" y1="250" x2="340" y2="250" stroke="#c4a064" stroke-width="0.5" stroke-dasharray="3,3"/>
  <!-- Soft knee -->
  <path d="M80,310 L140,250 L170,220 L195,195 L220,170 Q260,145 300,142 L340,141" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <path d="M80,310 Q80,270 100,255 L140,250" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Legend -->
  <line x1="55" y1="350" x2="85" y2="350" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="90" y="354" fill="#5a5550" font-size="10">No Control (Linear)</text>
  <line x1="195" y1="350" x2="225" y2="350" stroke="#c4a064" stroke-width="2"/>
  <text x="230" y="354" fill="#5a5550" font-size="10">Hard Clip</text>
  <line x1="310" y1="350" x2="340" y2="350" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="345" y="354" fill="#5a5550" font-size="10">Soft Knee</text>
  <!-- Right diagram: hardware block -->
  <rect x="400" y="45" width="330" height="300" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="565" y="70" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">Shoot Control Hardware</text>
  <!-- Input -->
  <rect x="420" y="90" width="80" height="35" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="460" y="112" fill="#5a5550" font-size="10" text-anchor="middle">HP Input</text>
  <line x1="500" y1="107" x2="520" y2="107" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM15)"/>
  <!-- Abs -->
  <rect x="525" y="90" width="55" height="35" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="552" y="112" fill="#5a5550" font-size="10" text-anchor="middle">|HP|</text>
  <line x1="580" y1="107" x2="600" y2="107" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM15)"/>
  <!-- Compare -->
  <rect x="605" y="85" width="80" height="45" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="645" y="104" fill="#5a5550" font-size="9" text-anchor="middle">Compare</text>
  <text x="645" y="120" fill="#8a8580" font-size="8" text-anchor="middle">|HP| > Threshold?</text>
  <!-- Threshold input -->
  <rect x="620" y="145" width="70" height="25" rx="3" fill="none" stroke="#8a8580" stroke-width="1"/>
  <text x="655" y="162" fill="#8a8580" font-size="9" text-anchor="middle">Threshold</text>
  <line x1="645" y1="145" x2="645" y2="130" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM15)"/>
  <!-- MUX -->
  <rect x="520" y="185" width="80" height="40" rx="4" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="560" y="200" fill="#5a5550" font-size="10" text-anchor="middle">MUX</text>
  <text x="560" y="215" fill="#8a8580" font-size="8" text-anchor="middle">Select</text>
  <line x1="645" y1="130" x2="645" y2="190" stroke="none"/>
  <path d="M645,130 L645,175 L600,195" fill="none" stroke="#5a5550" stroke-width="1"/>
  <!-- Clipped path -->
  <rect x="430" y="185" width="70" height="40" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="465" y="200" fill="#5a5550" font-size="9" text-anchor="middle">Clip to</text>
  <text x="465" y="215" fill="#8a8580" font-size="8" text-anchor="middle">±Limit</text>
  <line x1="500" y1="205" x2="520" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM15)"/>
  <!-- Sign restore -->
  <rect x="510" y="245" width="100" height="35" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="560" y="267" fill="#5a5550" font-size="10" text-anchor="middle">Sign Restore</text>
  <line x1="560" y1="225" x2="560" y2="245" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM15)"/>
  <!-- Output -->
  <rect x="510" y="295" width="100" height="35" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="560" y="317" fill="#5a5550" font-size="10" text-anchor="middle">Controlled HP</text>
  <line x1="560" y1="280" x2="560" y2="295" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM15)"/>
</svg><div class="caption">圖 6-15：Shoot Control 響應曲線比較（左）與硬體方塊圖（右）</div></div>

<h3>非對稱 Shoot Control</h3>
<p>人眼對亮側 Overshoot（白色 Halo）和暗側 Undershoot（黑色 Halo）的敏感度不同。在大多數場景中：</p>
<ul>
  <li><strong>暗側 Undershoot</strong> 比亮側 Overshoot 更不容易被察覺，因為人眼在暗區的對比敏感度較低</li>
  <li><strong>亮側 Overshoot</strong> 在天空、白牆等均勻亮區中特別刺眼</li>
</ul>

<p>因此，進階 ISP 設計使用<strong>非對稱 Shoot Control</strong>：對正向增強（Overshoot）使用較低的閾值，對負向增強（Undershoot）使用較高的閾值。典型比例為 Overshoot_Limit : Undershoot_Limit = 1 : 1.5 至 1 : 2。</p>

<pre>
// Asymmetric shoot control
if (enhanced_hp > 0)
    enhanced_hp = min(enhanced_hp, overshoot_limit);    // 較緊的限制
else
    enhanced_hp = max(enhanced_hp, -undershoot_limit);   // 較寬鬆的限制
</pre>

<h3>基於局部對比的自適應 Shoot Control</h3>
<p>固定閾值的 Shoot Control 無法同時兼顧所有場景。在高對比邊緣需要強力的 Shoot Control，但在低對比紋理區域，過度的限制會抑制正常的銳化效果。解決方案是讓 Shoot Threshold 隨<strong>局部對比（Local Contrast）</strong>動態調整：</p>

<div class="formula">Shoot_Threshold(x,y) = Base_Threshold + k × Local_Contrast(x,y)</div>

<p>其中 Local Contrast 可以用局部窗口內的最大值與最小值之差來估算：<code>Local_Contrast = Max(window) - Min(window)</code>。在高對比邊緣，Local Contrast 大，Shoot Threshold 相應提高（因為 Halo 在高對比背景下較不明顯）；在低對比紋理區域，Local Contrast 小，Shoot Threshold 降低以提供適度的限制。</p>

<div class="info-box key">
  <div class="box-title">🔑 硬體設計要點</div>
  <p>局部最大/最小值計算可以複用 Line Buffer 和滑動窗口硬體。在已有的 K×K 窗口中，使用樹狀比較器找出最大和最小值，所需比較器數量為 2×(K²-1)。對於 5×5 窗口，需要 48 個比較器 — 面積可觀但可接受。也可以改用較小的 3×3 窗口近似估算，減少至 16 個比較器。</p>
</div>

<h3>Shoot Control 的 Pipeline 整合</h3>
<p>在完整的銳化 Pipeline 中，Shoot Control 位於增益乘法之後、最終加法之前：</p>
<ol>
  <li>計算高頻分量：HP = Original - LowPass</li>
  <li>增益調整：Enhanced_HP = Gain × HP</li>
  <li><strong>Shoot Control：Controlled_HP = ShootCtrl(Enhanced_HP, Threshold)</strong></li>
  <li>重建：Output = Original + Controlled_HP</li>
  <li>最終飽和：Output = Clamp(Output, 0, MAX)</li>
</ol>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  Shoot Control 的閾值設定需要在「Halo 抑制」與「銳度保留」之間取得平衡。閾值太低會讓銳化效果不足（相當於降低了有效增益），閾值太高則 Halo 抑制不夠。建議在 Tuning 階段使用人眼 + 量化指標（如 Overshoot Ratio）共同評估。
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在車用相機的 ADAS 應用中，Shoot Control 特別重要。過度的 Overshoot/Undershoot 可能導致物件偵測演算法誤判邊緣特徵，影響車道線偵測或行人辨識的準確度。建議車用 ISP 的 Shoot Control 閾值設定偏保守。
</div>
`,
      keyPoints: [
        "Overshoot/Undershoot 是銳化的固有副作用，在高對比邊緣表現為 Halo",
        "Hard Clip 實現最簡單，但截斷點附近有 Flat Top Artifact",
        "Soft Knee / Smooth Compression 曲線提供更自然的過渡",
        "非對稱 Shoot Control 利用人眼對暗側不敏感的特性，Overshoot 限制較 Undershoot 更嚴格",
        "自適應 Shoot Threshold 根據局部對比動態調整，兼顧高對比邊緣與低對比紋理"
      ]
    },
    {
      id: "ch6_16",
      title: "Edge-directed Sharpening 硬體設計",
      content: `
<h3>為什麼需要方向感知銳化？</h3>
<p>傳統的等向性（Isotropic）銳化濾波器對所有方向施加相同的增強。這在邊緣處會產生一個問題：銳化不僅增強了<strong>沿著邊緣方向的紋理</strong>（有益），也增強了<strong>垂直於邊緣方向的對比</strong>（這正是產生 Halo 和 Ringing 的根源）。理想的銳化應該只增強<strong>沿邊緣方向（Edge-parallel）</strong>的對比，而不增強<strong>垂直邊緣方向（Edge-perpendicular）</strong>的對比。</p>

<p><strong>Edge-directed Sharpening</strong>（方向感知銳化）正是基於這個原理設計的。它首先偵測每個像素位置的邊緣方向，然後選擇與邊緣<strong>平行</strong>方向的 1D 銳化濾波器進行增強，避免在垂直方向上產生不必要的 Overshoot。</p>

<h3>方向偵測硬體</h3>
<p>方向偵測的核心是計算多個方向的<strong>梯度強度（Gradient Magnitude）</strong>，然後選擇梯度最小的方向作為邊緣方向（因為沿邊緣方向的變化最小）。</p>

<p><strong>4-Direction 方案</strong>（最常見）：</p>
<ul>
  <li><strong>水平 (H)</strong>：G_H = |P(x-1,y) - P(x+1,y)|</li>
  <li><strong>垂直 (V)</strong>：G_V = |P(x,y-1) - P(x,y+1)|</li>
  <li><strong>對角45° (D1)</strong>：G_D1 = |P(x-1,y-1) - P(x+1,y+1)|</li>
  <li><strong>對角135° (D2)</strong>：G_D2 = |P(x+1,y-1) - P(x-1,y+1)|</li>
</ul>

<p>為了提高精度，通常使用 3×3 或 5×5 窗口內的多點梯度取平均：</p>
<pre>
// 水平梯度（使用 3 行取平均提高穩定性）
G_H = |P(x-1,y-1) - P(x+1,y-1)| +
      |P(x-1, y ) - P(x+1, y )| +
      |P(x-1,y+1) - P(x+1,y+1)|;

// 類似地計算 G_V, G_D1, G_D2
</pre>

<div class="diagram"><svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="450" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Edge-directed Sharpening Pipeline</text>
  <defs><marker id="arrowM16" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Input + Line Buffer -->
  <rect x="20" y="55" width="100" height="40" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="70" y="79" fill="#5a5550" font-size="10" text-anchor="middle">Line Buffers</text>
  <line x1="120" y1="75" x2="150" y2="75" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <!-- 3x3 window -->
  <rect x="155" y="50" width="80" height="50" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="195" y="72" fill="#5a5550" font-size="10" text-anchor="middle">3×3 Window</text>
  <text x="195" y="88" fill="#8a8580" font-size="8" text-anchor="middle">Tap Registers</text>
  <!-- Branch to gradient and filter -->
  <line x1="235" y1="65" x2="275" y2="55" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <line x1="235" y1="85" x2="275" y2="120" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <!-- Gradient Engine -->
  <rect x="280" y="35" width="160" height="80" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="2"/>
  <text x="360" y="55" fill="#6a8a7a" font-size="11" font-weight="bold" text-anchor="middle">Gradient Engine</text>
  <text x="360" y="72" fill="#5a5550" font-size="9" text-anchor="middle">G_H, G_V, G_D1, G_D2</text>
  <text x="360" y="87" fill="#8a8580" font-size="8" text-anchor="middle">12 subtractors + 12 abs + 4 adders</text>
  <text x="360" y="102" fill="#8a8580" font-size="8" text-anchor="middle">4 gradient magnitudes output</text>
  <!-- Direction Selector -->
  <rect x="470" y="35" width="120" height="80" rx="5" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="530" y="55" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Direction</text>
  <text x="530" y="72" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Selector</text>
  <text x="530" y="90" fill="#8a8580" font-size="8" text-anchor="middle">Min(G_H,G_V,G_D1,G_D2)</text>
  <text x="530" y="105" fill="#8a8580" font-size="8" text-anchor="middle">→ 2-bit direction code</text>
  <line x1="440" y1="75" x2="470" y2="75" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <!-- Filter Bank -->
  <rect x="280" y="140" width="160" height="110" rx="5" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="360" y="162" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">1D Filter Bank</text>
  <rect x="295" y="172" width="130" height="18" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="0.5"/>
  <text x="360" y="185" fill="#5a5550" font-size="8" text-anchor="middle">H-Filter: [-1, 2, -1] horizontal</text>
  <rect x="295" y="194" width="130" height="18" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="0.5"/>
  <text x="360" y="207" fill="#5a5550" font-size="8" text-anchor="middle">V-Filter: [-1, 2, -1] vertical</text>
  <rect x="295" y="216" width="130" height="18" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="0.5"/>
  <text x="360" y="229" fill="#5a5550" font-size="8" text-anchor="middle">D1-Filter: [-1, 2, -1] diag45</text>
  <rect x="295" y="238" width="130" height="18" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="0.5"/>
  <text x="360" y="251" fill="#5a5550" font-size="8" text-anchor="middle">D2-Filter: [-1, 2, -1] diag135</text>
  <!-- MUX -->
  <rect x="480" y="170" width="80" height="50" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="520" y="193" fill="#5a5550" font-size="10" text-anchor="middle">4:1 MUX</text>
  <text x="520" y="210" fill="#8a8580" font-size="8" text-anchor="middle">Dir Select</text>
  <line x1="440" y1="195" x2="480" y2="195" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <path d="M530,115 L530,140 L530,170" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#arrowM16)"/>
  <text x="545" y="148" fill="#6a8a7a" font-size="8">dir_code</text>
  <!-- Gain + Shoot Control -->
  <rect x="590" y="155" width="100" height="40" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="640" y="172" fill="#5a5550" font-size="10" text-anchor="middle">Gain ×</text>
  <text x="640" y="187" fill="#8a8580" font-size="8" text-anchor="middle">Shoot Control</text>
  <line x1="560" y1="195" x2="590" y2="175" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <!-- Adder -->
  <rect x="590" y="215" width="100" height="35" rx="4" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="640" y="237" fill="#5a5550" font-size="10" text-anchor="middle">Orig + HP</text>
  <line x1="640" y1="195" x2="640" y2="215" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM16)"/>
  <!-- Output -->
  <rect x="720" y="220" width="60" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="750" y="239" fill="#5a5550" font-size="10" text-anchor="middle">Out</text>
  <line x1="690" y1="232" x2="720" y2="235" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM16)"/>
  <!-- Cost table -->
  <rect x="30" y="290" width="740" height="140" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="315" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">方向偵測硬體成本分析</text>
  <line x1="50" y1="325" x2="750" y2="325" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="120" y="345" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">方案</text>
  <text x="280" y="345" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">方向數</text>
  <text x="420" y="345" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">運算單元</text>
  <text x="580" y="345" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">面積增加</text>
  <text x="700" y="345" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">品質提升</text>
  <line x1="50" y1="355" x2="750" y2="355" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="120" y="375" fill="#5a5550" font-size="10" text-anchor="middle">4-Direction</text>
  <text x="280" y="375" fill="#8a8580" font-size="10" text-anchor="middle">H, V, D45, D135</text>
  <text x="420" y="375" fill="#8a8580" font-size="10" text-anchor="middle">12 sub + 4 add</text>
  <text x="580" y="375" fill="#6a8a7a" font-size="10" text-anchor="middle">+15%</text>
  <text x="700" y="375" fill="#6a8a7a" font-size="10" text-anchor="middle">Good</text>
  <text x="120" y="400" fill="#5a5550" font-size="10" text-anchor="middle">8-Direction</text>
  <text x="280" y="400" fill="#8a8580" font-size="10" text-anchor="middle">+ 22.5°間隔</text>
  <text x="420" y="400" fill="#8a8580" font-size="10" text-anchor="middle">24 sub + 8 add</text>
  <text x="580" y="400" fill="#6a8a7a" font-size="10" text-anchor="middle">+30%</text>
  <text x="700" y="400" fill="#6a8a7a" font-size="10" text-anchor="middle">Very Good</text>
  <text x="120" y="420" fill="#5a5550" font-size="10" text-anchor="middle">Isotropic</text>
  <text x="280" y="420" fill="#8a8580" font-size="10" text-anchor="middle">None</text>
  <text x="420" y="420" fill="#8a8580" font-size="10" text-anchor="middle">Baseline</text>
  <text x="580" y="420" fill="#6a8a7a" font-size="10" text-anchor="middle">Baseline</text>
  <text x="700" y="420" fill="#6a8a7a" font-size="10" text-anchor="middle">Baseline</text>
</svg><div class="caption">圖 6-16：Edge-directed Sharpening Pipeline 與方向偵測成本分析</div></div>

<h3>方向選擇邏輯</h3>
<p>四個方向的梯度計算完成後，需要找出<strong>最小梯度方向</strong>（即邊緣方向）。硬體實現使用樹狀比較器：</p>
<pre>
// 4-way minimum finder
min_01 = (G_H < G_V) ? {G_H, DIR_H} : {G_V, DIR_V};
min_23 = (G_D1 < G_D2) ? {G_D1, DIR_D1} : {G_D2, DIR_D2};
{min_grad, best_dir} = (min_01.grad < min_23.grad) ? min_01 : min_23;

// Flat region detection
if (max_gradient - min_gradient < flat_threshold)
    best_dir = DIR_ISOTROPIC;  // Use isotropic filter for flat regions
</pre>

<p>關鍵設計點是<strong>平坦區域偵測</strong>：當所有方向的梯度都很相似時（差異低於閾值），表示該區域沒有明確的邊緣方向，此時應退回等向性濾波器，避免方向性 Artifact。</p>

<h3>方向選擇性濾波器組</h3>
<p>根據偵測到的邊緣方向，從預先設計的 Filter Bank 中選擇對應的 1D 銳化濾波器：</p>
<ul>
  <li><strong>水平邊緣（梯度最小方向 = 水平）</strong>：使用水平 1D 銳化濾波器，沿水平方向增強紋理</li>
  <li><strong>垂直邊緣</strong>：使用垂直 1D 銳化濾波器</li>
  <li><strong>對角邊緣</strong>：使用對應方向的對角 1D 銳化濾波器</li>
  <li><strong>等向性（無邊緣）</strong>：使用標準 2D 銳化濾波器</li>
</ul>

<p>硬體上，4 個方向的 1D 濾波器可以<strong>並行計算</strong>，然後由 4:1 MUX 根據方向選擇結果輸出。這種設計的延遲等同於單一濾波器，但面積增加約 4 倍。或者，可以使用<strong>時分復用</strong>設計，4 個方向共享一組 MAC，分 4 個 Clock 計算，節省面積但增加延遲。</p>

<div class="info-box key">
  <div class="box-title">🔑 品質與成本的權衡</div>
  <p>在實際 ISP 產品中，4-Direction 方案是最常見的選擇，它以約 15% 的額外面積獲得顯著的邊緣品質提升。8-Direction 方案品質更好，但面積增加約 30%，僅在高階旗艦手機 ISP 中採用。而在車用 ISP 中，由於 ADAS 對邊緣品質要求更高，8-Direction 越來越普遍。</p>
</div>

<h3>避免跨邊緣銳化</h3>
<p>Edge-directed Sharpening 的核心原則是<strong>不跨越邊緣銳化</strong>。具體來說：</p>
<ul>
  <li>偵測到垂直邊緣時，使用水平方向的 1D 濾波器 — 這個濾波器<strong>沿著</strong>邊緣方向取樣，不會跨過邊緣</li>
  <li>偵測到水平邊緣時，使用垂直方向的 1D 濾波器</li>
  <li>如果用 2D 等向性濾波器，則會跨過邊緣取樣，將邊緣兩側不同亮度的像素混合，導致 Halo</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  Edge-directed Sharpening 與 Edge-directed Demosaic 的方向偵測邏輯非常相似。在 ISP Pipeline 設計中，可以考慮將 Demosaic 階段計算的方向資訊<strong>傳遞</strong>給後續的銳化模組，避免重複計算。這需要額外的 Line Buffer 來延遲傳輸方向 Map，但可節省梯度計算的硬體面積。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  方向偵測在噪聲環境下容易出錯。當 SNR 較低時，噪聲引起的隨機梯度可能導致方向判斷不穩定，造成相鄰像素使用不同方向的濾波器，產生視覺上的「碎裂」（Fragmentation）Artifact。解決方案包括：(1) 在方向偵測前先做輕微的預平滑，(2) 增加平坦區域偵測閾值，讓更多區域退回等向性濾波，(3) 對方向 Map 做 Median Filter 後處理。
</div>
`,
      keyPoints: [
        "等向性銳化會在垂直邊緣方向產生不必要的 Halo，方向感知銳化可避免此問題",
        "4-Direction 梯度偵測（H/V/D1/D2）以 15% 面積增加獲得顯著品質提升",
        "方向選擇邏輯找最小梯度方向為邊緣方向，平坦區域退回等向性濾波",
        "Filter Bank 可並行計算 + MUX 選擇（低延遲）或時分復用（低面積）",
        "方向偵測在低 SNR 下易出錯，需預平滑或方向 Map 後處理來穩定"
      ]
    },
    {
      id: "ch6_17",
      title: "Texture/Edge/Flat 區域分類器硬體",
      content: `
<h3>為什麼需要區域分類？</h3>
<p>在一張影像中，不同區域有截然不同的銳化需求：</p>
<ul>
  <li><strong>紋理區域（Texture）</strong>：如樹葉、草地、布料 — 需要<strong>較強的銳化</strong>以呈現豐富的細節</li>
  <li><strong>邊緣區域（Edge）</strong>：如建築輪廓、人臉輪廓 — 需要<strong>適中的銳化</strong>，且必須配合 Shoot Control 以避免 Halo</li>
  <li><strong>平坦區域（Flat）</strong>：如天空、白牆、皮膚 — 需要<strong>極少或零銳化</strong>，因為銳化只會放大噪聲而無真正細節可增強</li>
</ul>

<p>如果對整張影像施加相同的銳化強度，必然會在某些區域過度銳化（如平坦區域噪聲被放大），同時在另一些區域銳化不足（如紋理區域細節不夠突出）。<strong>區域自適應銳化</strong>（Region-adaptive Sharpening）透過<strong>分類器（Classifier）</strong>偵測每個像素所屬的區域類型，然後施加對應的銳化強度。</p>

<h3>基於方差的紋理偵測器</h3>
<p>紋理區域的特徵是像素值在局部窗口內有<strong>中等程度的變化</strong>。方差（Variance）是最直接的紋理度量指標：</p>

<div class="formula">Var(x,y) = (1/N²) × Σ[I(i,j) - μ(x,y)]² , 其中 μ = (1/N²) × ΣI(i,j)</div>

<p>在硬體中，方差的計算可以用平方和公式簡化：</p>
<div class="formula">Var = E[I²] - (E[I])² = (ΣI²)/N² - (ΣI/N²)²</div>

<p>這避免了逐像素減去均值再平方的運算，只需要兩個累加器：一個累加像素值，一個累加像素值的平方。但平方運算在硬體中仍然成本較高（乘法器面積大），因此實務中常用<strong>絕對差值和（SAD, Sum of Absolute Differences）</strong>替代方差：</p>
<div class="formula">SAD(x,y) = Σ|I(i,j) - I(x,y)| , 使用中心像素替代均值</div>

<p>SAD 只需要減法器和絕對值運算，不需要乘法器，硬體面積約為方差運算的 1/3。品質上，SAD 與方差的相關度超過 0.95，足以做為紋理指標使用。</p>

<h3>基於梯度的邊緣偵測器</h3>
<p>邊緣區域的特徵是在某個方向上有<strong>強烈的亮度跳變</strong>。梯度幅度（Gradient Magnitude）是最常用的邊緣偵測指標。硬體中通常用 Sobel 或簡化的差分運算：</p>

<pre>
// 簡化梯度（避免乘法，僅需加法和移位）
Gx = |P(x+1,y) - P(x-1,y)|;
Gy = |P(x,y+1) - P(x,y-1)|;
Gradient = Gx + Gy;  // L1 norm, 避免平方根運算
</pre>

<p>邊緣與紋理的區分在於：邊緣的梯度是<strong>方向性的</strong>（某個方向梯度很大，其他方向較小），而紋理的梯度在多個方向都有中等值。因此，可以用方向性指標（Directionality）來區分：</p>
<div class="formula">Directionality = |Gx - Gy| / (Gx + Gy + ε)</div>
<p>接近 1 為強方向性（邊緣），接近 0 為等向性（紋理或平坦）。</p>

<h3>分類狀態機與決策邏輯</h3>
<p>結合紋理偵測器和邊緣偵測器的輸出，分類邏輯如下：</p>

<div class="diagram"><svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="440" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Texture/Edge/Flat 區域分類器硬體架構</text>
  <defs><marker id="arrowM17" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Input window -->
  <rect x="20" y="55" width="100" height="45" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="70" y="75" fill="#5a5550" font-size="10" text-anchor="middle">5×5 Window</text>
  <text x="70" y="90" fill="#8a8580" font-size="8" text-anchor="middle">(from Line Buf)</text>
  <!-- Branch to three detectors -->
  <line x1="120" y1="68" x2="160" y2="55" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <line x1="120" y1="78" x2="160" y2="120" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <line x1="120" y1="88" x2="160" y2="185" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <!-- SAD Texture Detector -->
  <rect x="165" y="35" width="150" height="50" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="240" y="55" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">SAD Texture Detector</text>
  <text x="240" y="72" fill="#8a8580" font-size="8" text-anchor="middle">Σ|P(i,j) - P(center)|</text>
  <!-- Gradient Edge Detector -->
  <rect x="165" y="100" width="150" height="50" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="240" y="120" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">Gradient Edge Detector</text>
  <text x="240" y="137" fill="#8a8580" font-size="8" text-anchor="middle">Gx + Gy (L1 norm)</text>
  <!-- Directionality -->
  <rect x="165" y="165" width="150" height="50" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="240" y="185" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">Directionality</text>
  <text x="240" y="202" fill="#8a8580" font-size="8" text-anchor="middle">|Gx-Gy|/(Gx+Gy+ε)</text>
  <!-- Decision Logic -->
  <rect x="380" y="70" width="160" height="130" rx="6" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="460" y="92" fill="#6a8a7a" font-size="11" font-weight="bold" text-anchor="middle">Decision Logic</text>
  <line x1="400" y1="100" x2="540" y2="100" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="400" y="118" fill="#5a5550" font-size="9">if Grad < T_flat</text>
  <text x="420" y="132" fill="#8a8580" font-size="9">→ FLAT</text>
  <text x="400" y="148" fill="#5a5550" font-size="9">elif Dir > T_edge</text>
  <text x="420" y="162" fill="#8a8580" font-size="9">→ EDGE</text>
  <text x="400" y="178" fill="#5a5550" font-size="9">else</text>
  <text x="420" y="192" fill="#8a8580" font-size="9">→ TEXTURE</text>
  <!-- Arrows to decision -->
  <line x1="315" y1="60" x2="380" y2="100" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <line x1="315" y1="125" x2="380" y2="135" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <line x1="315" y1="190" x2="380" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <!-- Strength Mapping -->
  <rect x="590" y="55" width="180" height="160" rx="6" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="680" y="78" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Strength Mapping LUT</text>
  <line x1="600" y1="88" x2="760" y2="88" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="610" y="95" width="60" height="25" rx="3" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1"/>
  <text x="640" y="112" fill="#5a5550" font-size="9" text-anchor="middle">TEXTURE</text>
  <text x="720" y="112" fill="#6a8a7a" font-size="10" font-weight="bold">Gain = 1.5-3.0</text>
  <rect x="610" y="128" width="60" height="25" rx="3" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="640" y="145" fill="#5a5550" font-size="9" text-anchor="middle">EDGE</text>
  <text x="720" y="145" fill="#6a8a7a" font-size="10" font-weight="bold">Gain = 0.8-1.5</text>
  <rect x="610" y="161" width="60" height="25" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="1"/>
  <text x="640" y="178" fill="#5a5550" font-size="9" text-anchor="middle">FLAT</text>
  <text x="720" y="178" fill="#6a8a7a" font-size="10" font-weight="bold">Gain = 0.0-0.3</text>
  <line x1="540" y1="135" x2="590" y2="135" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM17)"/>
  <text x="565" y="128" fill="#8a8580" font-size="8">class</text>
  <!-- Output -->
  <line x1="680" y1="215" x2="680" y2="240" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM17)"/>
  <rect x="630" y="245" width="100" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="680" y="264" fill="#5a5550" font-size="10" text-anchor="middle">Adaptive Gain</text>
  <!-- Decision tree diagram -->
  <rect x="30" y="300" width="740" height="120" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="322" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">分類決策樹</text>
  <!-- Root -->
  <rect x="340" y="335" width="120" height="25" rx="12" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="400" y="352" fill="#5a5550" font-size="9" text-anchor="middle">Gradient < T_flat?</text>
  <!-- Yes: Flat -->
  <line x1="360" y1="360" x2="200" y2="390" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <text x="260" y="373" fill="#8a8580" font-size="8">Yes</text>
  <rect x="150" y="390" width="80" height="22" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="1"/>
  <text x="190" y="405" fill="#5a5550" font-size="9" text-anchor="middle">FLAT</text>
  <!-- No: check directionality -->
  <line x1="440" y1="360" x2="560" y2="380" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM17)"/>
  <text x="510" y="368" fill="#8a8580" font-size="8">No</text>
  <rect x="500" y="380" width="130" height="25" rx="12" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="565" y="397" fill="#5a5550" font-size="9" text-anchor="middle">Directionality > T_edge?</text>
  <!-- Edge -->
  <line x1="530" y1="405" x2="460" y2="410" stroke="#5a5550" stroke-width="1"/>
  <text x="475" y="408" fill="#8a8580" font-size="8">Yes</text>
  <rect x="400" y="410" width="80" height="22" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="440" y="425" fill="#5a5550" font-size="9" text-anchor="middle">EDGE</text>
  <!-- Texture -->
  <line x1="600" y1="405" x2="660" y2="410" stroke="#5a5550" stroke-width="1"/>
  <text x="640" y="408" fill="#8a8580" font-size="8">No</text>
  <rect x="620" y="410" width="80" height="22" rx="4" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1"/>
  <text x="660" y="425" fill="#5a5550" font-size="9" text-anchor="middle">TEXTURE</text>
</svg><div class="caption">圖 6-17：區域分類器硬體架構與決策樹 — 依分類結果映射不同銳化強度</div></div>

<h3>Per-Region 銳化強度映射</h3>
<p>分類結果不應是硬性的離散分類，而是<strong>連續的強度映射</strong>。實務上常用 LUT（Look-Up Table）將紋理度量（如 SAD 值）映射為銳化增益：</p>

<pre>
// Continuous strength mapping using LUT
texture_level = SAD(x,y);  // 0 ~ MAX
sharpening_gain = LUT[texture_level >> shift];  // LUT indexed by quantized SAD
</pre>

<p>LUT 的形狀通常是 S 曲線（Sigmoid）：SAD 很低時增益為 0（平坦區域不銳化），SAD 中等時增益快速上升（紋理區域強銳化），SAD 很高時增益回落或保持（邊緣區域配合 Shoot Control）。</p>

<div class="info-box key">
  <div class="box-title">🔑 分類器閾值的 ISO 依賴</div>
  <p>分類閾值必須隨 ISO（增益）調整。在高 ISO 下，噪聲會提高所有區域的 SAD/Gradient 值，導致平坦區域被誤判為紋理區域。因此：</p>
  <ul>
    <li>T_flat 應隨 ISO 提高而增大，讓更多區域被歸類為平坦</li>
    <li>T_edge 也應相應提高，避免噪聲邊緣被誤判為真實邊緣</li>
    <li>這些閾值通常儲存在 ISP 的 ISO-indexed 參數表中</li>
  </ul>
</div>

<h3>硬體資源估算</h3>
<p>完整的 Texture/Edge/Flat 分類器的硬體資源如下（以 5×5 窗口、12-bit 像素為基準）：</p>
<table>
  <tr><th>模組</th><th>主要運算</th><th>硬體資源</th></tr>
  <tr><td>SAD 計算</td><td>24 個減法 + 24 個絕對值 + 累加樹</td><td>~24 subtractors + 1 adder tree</td></tr>
  <tr><td>梯度計算</td><td>2 個減法 + 2 個絕對值 + 1 加法</td><td>~5 ALU operations</td></tr>
  <tr><td>方向性</td><td>1 減法 + 1 除法（或移位近似）</td><td>~3 ALU operations</td></tr>
  <tr><td>決策邏輯</td><td>2-3 個比較器 + MUX</td><td>Negligible</td></tr>
  <tr><td>LUT</td><td>64-256 entry × 8-bit</td><td>64-256 bytes ROM</td></tr>
</table>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在面積敏感的設計中，可以用更粗粒度的分類（如 8×8 Block 級別）替代逐像素分類。這樣 SAD/Gradient 只需要在每個 Block 計算一次，然後 Block 內所有像素共享同一個銳化增益。品質損失很小（因為區域類型在空間上是連續的），但運算量減少到 1/64。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  分類器的轉變區域（Transition Region）可能產生視覺上的<strong>帶狀效應（Banding）</strong>。例如在天空中有輕微漸層的區域，分類器可能在某一行將區域從 FLAT 切換為 TEXTURE，導致銳化強度突然跳變。解決方案是確保 LUT 映射曲線平滑連續，避免階梯式的增益跳變。
</div>
`,
      keyPoints: [
        "紋理/邊緣/平坦三類區域需要不同的銳化強度，分類器實現自適應銳化",
        "SAD（絕對差值和）是紋理偵測的高效替代方案，免除乘法器需求",
        "梯度幅度偵測邊緣，方向性指標區分邊緣與紋理",
        "分類閾值必須隨 ISO 動態調整，避免高 ISO 下噪聲被誤判為紋理",
        "LUT 映射實現連續的銳化強度過渡，避免離散分類的帶狀效應"
      ]
    },
    {
      id: "ch6_18",
      title: "多頻段銳化硬體：Band-pass Decomposition",
      content: `
<h3>單頻段銳化的局限性</h3>
<p>傳統 USM（Unsharp Mask）只使用一個 Radius（即一個低通濾波器截止頻率）來分離高頻與低頻。這意味著所有超過截止頻率的頻率成分都被同等增強。然而，不同空間頻率帶（Frequency Band）對影像品質的貢獻截然不同：</p>
<ul>
  <li><strong>低頻（Low Frequency）</strong>：大尺度的亮度變化，如光影、漸層 — 不需要銳化</li>
  <li><strong>中頻（Mid Frequency）</strong>：紋理和細節的主要成分，如皮膚紋理、布料質感 — 需要<strong>適度增強</strong></li>
  <li><strong>高頻（High Frequency）</strong>：最細微的細節和邊緣，但也包含大量噪聲 — 需要<strong>選擇性增強</strong></li>
</ul>

<p>理想的銳化應該能獨立控制每個頻段的增益，這就是<strong>多頻段銳化（Multi-band Sharpening）</strong>的核心思想。</p>

<h3>頻段分解方法</h3>
<p>在硬體中，頻段分解通常使用 <strong>Gaussian Pyramid</strong> 的概念。對原始影像依次用不同 σ 的 Gaussian 濾波器平滑，得到多個平滑版本。相鄰兩層平滑影像的差就是對應頻段的 Band-pass 分量：</p>

<div class="formula">Band_k = Smooth_{k-1} - Smooth_k , 其中 Smooth_0 = Original Image</div>

<p>例如，3 頻段分解：</p>
<ol>
  <li>L0 = Original（σ=0）</li>
  <li>L1 = Gaussian(Original, σ=1)，Band_High = L0 - L1</li>
  <li>L2 = Gaussian(Original, σ=3)，Band_Mid = L1 - L2</li>
  <li>Base = L2（低頻基底）</li>
</ol>

<p>重建公式：Output = Base + G_mid × Band_Mid + G_high × Band_High，其中 G_mid 和 G_high 是各頻段的增益控制。</p>

<h3>硬體高效的 Gaussian 近似：Binomial Filter</h3>
<p>在硬體中，精確的 Gaussian 濾波器需要浮點係數，且 Kernel Size 隨 σ 增大而增大。<strong>Binomial Filter</strong>（二項式濾波器）是硬體友好的近似方案：</p>

<pre>
// 3-tap Binomial: [1, 2, 1] / 4  (σ ≈ 0.5)
// 5-tap Binomial: [1, 4, 6, 4, 1] / 16  (σ ≈ 0.7)
// 多次疊代 3-tap 等效於更大 σ：
//   2次 [1,2,1]: σ ≈ 1.0
//   3次 [1,2,1]: σ ≈ 1.22
//   4次 [1,2,1]: σ ≈ 1.41
</pre>

<p>Binomial Filter 的所有係數都是 2 的冪次，因此乘法可用移位替代（完全無乘法器成本）。除法也是 2 的冪次（右移）。這使得 Binomial Filter 成為 ISP 硬體中 Gaussian 近似的首選。</p>

<div class="info-box key">
  <div class="box-title">🔑 級聯 Binomial 的設計技巧</div>
  <p>級聯多個 [1,2,1] 濾波器來近似大 σ Gaussian 時，每一級只需要一個 3-tap 的 Line Buffer + 加法器。相比直接使用大 Kernel（如 9×9），級聯設計的 Line Buffer 深度從 (K-1) 條降為每級 2 條，大幅減少 SRAM。但要注意級聯引入的累積延遲：N 級級聯的延遲為 N 行。</p>
</div>

<div class="diagram"><svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="430" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">多頻段銳化硬體：分解與重建</text>
  <defs><marker id="arrowM18" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Input -->
  <rect x="20" y="80" width="70" height="35" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="55" y="102" fill="#5a5550" font-size="10" text-anchor="middle">Original</text>
  <!-- Stage 1: small sigma -->
  <line x1="90" y1="97" x2="120" y2="97" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <rect x="125" y="75" width="100" height="45" rx="4" fill="none" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="175" y="93" fill="#5a5550" font-size="9" text-anchor="middle">Gaussian σ=1</text>
  <text x="175" y="108" fill="#8a8580" font-size="8" text-anchor="middle">[1,2,1]×2 cascade</text>
  <!-- L1 output -->
  <line x1="225" y1="97" x2="260" y2="97" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <text x="242" y="90" fill="#8a8580" font-size="8">L1</text>
  <!-- Stage 2: larger sigma -->
  <rect x="265" y="75" width="100" height="45" rx="4" fill="none" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="315" y="93" fill="#5a5550" font-size="9" text-anchor="middle">Gaussian σ=3</text>
  <text x="315" y="108" fill="#8a8580" font-size="8" text-anchor="middle">[1,2,1]×4 cascade</text>
  <line x1="365" y1="97" x2="395" y2="97" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <text x="380" y="90" fill="#8a8580" font-size="8">L2=Base</text>
  <!-- Subtractors for band extraction -->
  <!-- Band High = L0 - L1 -->
  <line x1="55" y1="115" x2="55" y2="170" stroke="#5a5550" stroke-width="1"/>
  <line x1="55" y1="170" x2="140" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <line x1="175" y1="120" x2="175" y2="160" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <circle cx="175" cy="170" r="12" fill="none" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="175" y="174" fill="#6a8a7a" font-size="12" text-anchor="middle">−</text>
  <line x1="187" y1="170" x2="220" y2="170" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <text x="215" y="163" fill="#5a5550" font-size="8" font-weight="bold">Band_High</text>
  <!-- Band Mid = L1 - L2 -->
  <line x1="175" y1="120" x2="175" y2="140" stroke="none"/>
  <line x1="242" y1="97" x2="242" y2="230" stroke="#5a5550" stroke-width="1"/>
  <line x1="242" y1="230" x2="280" y2="230" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <line x1="315" y1="120" x2="315" y2="220" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <circle cx="315" cy="230" r="12" fill="none" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="315" y="234" fill="#6a8a7a" font-size="12" text-anchor="middle">−</text>
  <line x1="327" y1="230" x2="360" y2="230" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <text x="355" y="223" fill="#5a5550" font-size="8" font-weight="bold">Band_Mid</text>
  <!-- Gain controls -->
  <rect x="225" y="155" width="60" height="30" rx="4" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1"/>
  <text x="255" y="174" fill="#5a5550" font-size="9" text-anchor="middle">× G_high</text>
  <rect x="365" y="215" width="60" height="30" rx="4" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1"/>
  <text x="395" y="234" fill="#5a5550" font-size="9" text-anchor="middle">× G_mid</text>
  <!-- Reconstruction adder -->
  <line x1="285" y1="170" x2="470" y2="170" stroke="#5a5550" stroke-width="1"/>
  <line x1="425" y1="230" x2="470" y2="230" stroke="#5a5550" stroke-width="1"/>
  <line x1="395" y1="97" x2="470" y2="97" stroke="#5a5550" stroke-width="1"/>
  <text x="440" y="90" fill="#8a8580" font-size="8">Base</text>
  <!-- Sum node -->
  <rect x="475" y="130" width="80" height="60" rx="6" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/>
  <text x="515" y="155" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">Σ Rebuild</text>
  <text x="515" y="175" fill="#8a8580" font-size="8" text-anchor="middle">Base+G×Bands</text>
  <line x1="470" y1="97" x2="475" y2="140" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <line x1="470" y1="170" x2="475" y2="160" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <line x1="470" y1="230" x2="475" y2="180" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM18)"/>
  <!-- Output -->
  <line x1="555" y1="160" x2="585" y2="160" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM18)"/>
  <rect x="590" y="145" width="60" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="620" y="164" fill="#5a5550" font-size="10" text-anchor="middle">Output</text>
  <!-- Frequency spectrum illustration -->
  <rect x="30" y="290" width="740" height="120" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="312" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">各頻段增益控制策略</text>
  <!-- Frequency axis -->
  <line x1="60" y1="380" x2="750" y2="380" stroke="#5a5550" stroke-width="1"/>
  <text x="400" y="400" fill="#8a8580" font-size="9" text-anchor="middle">空間頻率 →</text>
  <!-- Bands -->
  <rect x="60" y="330" width="200" height="45" rx="3" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="160" y="350" fill="#5a5550" font-size="10" text-anchor="middle">Low Freq (Base)</text>
  <text x="160" y="366" fill="#8a8580" font-size="9" text-anchor="middle">Gain = 1.0 (不增強)</text>
  <rect x="270" y="330" width="220" height="45" rx="3" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1"/>
  <text x="380" y="350" fill="#5a5550" font-size="10" text-anchor="middle">Mid Freq (Texture)</text>
  <text x="380" y="366" fill="#6a8a7a" font-size="9" font-weight="bold" text-anchor="middle">Gain = 1.5~3.0 (主要增強)</text>
  <rect x="500" y="330" width="250" height="45" rx="3" fill="#6a8a7a" opacity="0.15" stroke="#d5cec7" stroke-width="1"/>
  <text x="625" y="350" fill="#5a5550" font-size="10" text-anchor="middle">High Freq (Detail+Noise)</text>
  <text x="625" y="366" fill="#8a8580" font-size="9" text-anchor="middle">Gain = 0.5~1.5 (選擇性增強)</text>
</svg><div class="caption">圖 6-18：多頻段銳化硬體 — Gaussian Pyramid 分解、Per-Band 增益控制與重建</div></div>

<h3>Per-Band 增益控制策略</h3>
<p>多頻段銳化的核心優勢在於可以對每個頻段獨立設定增益：</p>

<table>
  <tr><th>頻段</th><th>內容</th><th>典型增益</th><th>策略</th></tr>
  <tr><td>Low (Base)</td><td>大尺度明暗、漸層</td><td>1.0</td><td>保持不變，避免 Halo</td></tr>
  <tr><td>Mid</td><td>紋理、細節、Micro-contrast</td><td>1.5 ~ 3.0</td><td>主要增強目標</td></tr>
  <tr><td>High</td><td>最細微細節 + 噪聲</td><td>0.5 ~ 1.5</td><td>ISO 依賴：低 ISO 增強，高 ISO 抑制</td></tr>
</table>

<p>高頻段的增益需要特別謹慎。在低 ISO（低噪聲）下，可以適度增強高頻以提升最細微的解析力。但在高 ISO 下，高頻段中噪聲佔主導，此時增益應降至 1.0 以下（等同於輕微降噪），或至少設為 1.0（不增強）。</p>

<h3>硬體資源與面積分析</h3>
<p>多頻段銳化的硬體成本主要在級聯 Gaussian 濾波器的 Line Buffer：</p>
<ul>
  <li><strong>2 頻段</strong>（High + Low）：1 個 Gaussian → 需要 K-1 條 Line Buffer</li>
  <li><strong>3 頻段</strong>（High + Mid + Low）：2 個 Gaussian → 累計 Line Buffer 加倍</li>
  <li><strong>4 頻段</strong>：3 個 Gaussian → 在 4K 解析度下 Line Buffer 可能超過 100KB</li>
</ul>

<p>使用級聯 Binomial [1,2,1] 的方案可以大幅降低 Line Buffer 需求。每級 Binomial 只需 2 條 Line Buffer（對於可分離 2D 實現）。3 頻段分解所需的累計 Line Buffer 約為直接大 Kernel 方案的 40-60%。</p>

<h3>重建與 Artifact 預防</h3>
<p>頻段分解 → 增益調整 → 重建的過程必須確保<strong>完美重建（Perfect Reconstruction）</strong>性質：當所有增益為 1.0 時，重建結果應完全等於原始影像。這要求：</p>
<ul>
  <li>所有 Band-pass 分量之和加上 Base 等於原始影像（數學上保證）</li>
  <li>定點量化和截斷不破壞重建精度（需要足夠的中間位寬）</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  多頻段銳化在頻段交界處可能出現 <strong>Ringing Artifact</strong>。這是因為有限長度的 Gaussian 濾波器不是理想的低通濾波器，其頻率響應有旁瓣（Sidelobe）。如果在旁瓣對應的頻率上施加過大增益，會產生振鈴效應。解決方案是使用足夠長的 Gaussian Kernel（旁瓣更小），或在增益曲線上避免相鄰頻段增益的急劇跳變。
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在手機 ISP 中，多頻段銳化常與<strong>降噪模組共享</strong>頻率分解硬體。降噪需要分離噪聲（高頻）和信號（低頻/中頻），而多頻段銳化也需要類似的分解。透過共享 Gaussian 濾波器和 Line Buffer，可以同時實現降噪和多頻段銳化，面積效率最大化。
</div>
`,
      keyPoints: [
        "多頻段銳化對不同空間頻率獨立控制增益，比單一 USM 更精確",
        "頻段分解使用 Gaussian Pyramid，相鄰層差值為 Band-pass 分量",
        "Binomial Filter [1,2,1] 是硬體中 Gaussian 的高效近似，無需乘法器",
        "中頻是主要增強目標，高頻增益需隨 ISO 調整以平衡細節與噪聲",
        "多頻段銳化可與降噪共享頻率分解硬體，最大化面積效率"
      ]
    },
    {
      id: "ch6_19",
      title: "銳化參數 Tuning：Gain Curve 與 ISO-dependent 設計",
      content: `
<h3>銳化參數的系統觀</h3>
<p>在 ISP 產品化的過程中，銳化演算法的設計只是第一步。真正決定最終影像品質的是<strong>參數調適（Tuning）</strong>。一個設計優秀但調適不當的銳化模組，效果可能還不如一個簡單但精心調適過的 USM。銳化 Tuning 涉及多個維度的參數交織，需要系統化的方法論。</p>

<p>典型 ISP 銳化模組的主要可調參數包括：</p>
<table>
  <tr><th>參數</th><th>作用</th><th>典型範圍</th></tr>
  <tr><td>Sharpening Gain / Amount</td><td>銳化增強幅度</td><td>0.0 ~ 4.0</td></tr>
  <tr><td>Radius / Sigma</td><td>Low-pass 濾波器的平滑程度（影響增強的空間尺度）</td><td>σ = 0.5 ~ 3.0</td></tr>
  <tr><td>Coring Threshold</td><td>低於此閾值的高頻分量不增強（抑制噪聲銳化）</td><td>0 ~ 20 (for 12-bit)</td></tr>
  <tr><td>Shoot Limit (Pos/Neg)</td><td>Overshoot / Undershoot 的最大允許值</td><td>0 ~ 200 (for 12-bit)</td></tr>
  <tr><td>Texture Gain Map</td><td>基於紋理度量的銳化強度調節</td><td>LUT: 0.0 ~ 3.0</td></tr>
</table>

<h3>ISO-dependent 參數表設計</h3>
<p>所有銳化參數都必須隨<strong>感測器增益（ISO / Analog Gain）</strong>調整。原因很直接：隨著 ISO 升高，噪聲增加，如果維持相同的銳化增益，噪聲會被等比例放大，導致高 ISO 下影像品質急劇惡化。</p>

<p>ISP 中典型的 ISO-indexed 參數表結構如下：</p>
<pre>
// ISO-dependent sharpening parameter table
ISO_INDEX:     [100,  200,  400,  800, 1600, 3200, 6400, 12800]
SHARP_GAIN:    [2.5,  2.2,  1.8,  1.4,  1.0,  0.7,  0.5,  0.3]
CORING_THR:    [  2,    3,    5,    8,   12,   18,   25,   35]
SHOOT_POS:     [100,   90,   75,   60,   45,   35,   25,   20]
SHOOT_NEG:     [150,  135,  110,   90,   70,   55,   40,   30]
RADIUS_SIGMA:  [1.0,  1.0,  1.2,  1.2,  1.5,  1.5,  2.0,  2.0]
</pre>

<p>關鍵趨勢：</p>
<ul>
  <li><strong>Gain 隨 ISO 下降</strong>：高 ISO 減少銳化以避免放大噪聲</li>
  <li><strong>Coring Threshold 隨 ISO 上升</strong>：更高的閾值濾除更多噪聲級別的高頻分量</li>
  <li><strong>Shoot Limit 隨 ISO 下降</strong>：高 ISO 下更嚴格地限制 Overshoot</li>
  <li><strong>Radius 隨 ISO 略微增大</strong>：更大的平滑範圍避免銳化高頻噪聲</li>
</ul>

<h3>Signal-level Dependent Sharpening Gain Curve</h3>
<p>除了 ISO 依賴外，銳化增益還應根據<strong>像素亮度（Signal Level）</strong>調整。原因是感測器噪聲的特性：暗區的 SNR 低於亮區（Shot Noise 遵循 Poisson 分佈，SNR ∝ √Signal）。因此：</p>
<ul>
  <li><strong>暗區</strong>（低亮度像素）：降低銳化增益，避免放大暗區噪聲</li>
  <li><strong>中間調</strong>：使用正常銳化增益</li>
  <li><strong>高光區</strong>：可以略微增加銳化增益（SNR 高，有更多銳化裕量）</li>
</ul>

<div class="diagram"><svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="420" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">銳化增益曲線族：ISO × Signal Level</text>
  <defs><marker id="arrowM19" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Left graph: Gain vs Signal Level -->
  <rect x="30" y="45" width="350" height="280" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="205" y="68" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">Sharpening Gain vs Signal Level</text>
  <!-- Axes -->
  <line x1="70" y1="80" x2="70" y2="300" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="70" y1="300" x2="360" y2="300" stroke="#5a5550" stroke-width="1.5"/>
  <text x="50" y="195" fill="#5a5550" font-size="10" text-anchor="middle" transform="rotate(-90,50,195)">Gain</text>
  <text x="215" y="318" fill="#5a5550" font-size="10" text-anchor="middle">Signal Level (0~4095)</text>
  <!-- Y ticks -->
  <text x="60" y="110" fill="#8a8580" font-size="9" text-anchor="end">3.0</text>
  <text x="60" y="160" fill="#8a8580" font-size="9" text-anchor="end">2.0</text>
  <text x="60" y="230" fill="#8a8580" font-size="9" text-anchor="end">1.0</text>
  <text x="60" y="303" fill="#8a8580" font-size="9" text-anchor="end">0</text>
  <!-- X ticks -->
  <text x="70" y="313" fill="#8a8580" font-size="8" text-anchor="middle">0</text>
  <text x="170" y="313" fill="#8a8580" font-size="8" text-anchor="middle">1024</text>
  <text x="265" y="313" fill="#8a8580" font-size="8" text-anchor="middle">2048</text>
  <text x="355" y="313" fill="#8a8580" font-size="8" text-anchor="middle">4095</text>
  <!-- ISO 100 curve (high gain) -->
  <path d="M70,260 Q100,230 140,155 Q180,120 230,108 Q280,100 350,95" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- ISO 400 curve -->
  <path d="M70,275 Q100,260 140,200 Q180,170 230,162 Q280,158 350,155" fill="none" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="8,4"/>
  <!-- ISO 1600 curve -->
  <path d="M70,287 Q100,280 140,248 Q180,232 230,228 Q280,225 350,222" fill="none" stroke="#8a8580" stroke-width="2"/>
  <!-- ISO 6400 curve -->
  <path d="M70,295 Q100,293 140,278 Q180,270 230,267 Q280,265 350,262" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="5,3"/>
  <!-- Legend -->
  <line x1="80" y1="335" x2="110" y2="335" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="115" y="339" fill="#5a5550" font-size="9">ISO 100</text>
  <line x1="170" y1="335" x2="200" y2="335" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="205" y="339" fill="#5a5550" font-size="9">ISO 400</text>
  <line x1="260" y1="335" x2="290" y2="335" stroke="#8a8580" stroke-width="2"/>
  <text x="295" y="339" fill="#5a5550" font-size="9">ISO 1600</text>
  <!-- Right: Tuning parameter space -->
  <rect x="420" y="45" width="360" height="280" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="600" y="68" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">Tuning 參數空間概覽</text>
  <!-- Parameter items -->
  <rect x="440" y="80" width="150" height="30" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="515" y="99" fill="#5a5550" font-size="10" text-anchor="middle">ISO / Gain</text>
  <rect x="610" y="80" width="150" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="685" y="99" fill="#5a5550" font-size="10" text-anchor="middle">Signal Level</text>
  <rect x="440" y="120" width="150" height="30" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="515" y="139" fill="#5a5550" font-size="10" text-anchor="middle">Texture Level</text>
  <rect x="610" y="120" width="150" height="30" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="1"/>
  <text x="685" y="139" fill="#5a5550" font-size="10" text-anchor="middle">Edge Direction</text>
  <!-- Central node -->
  <rect x="500" y="170" width="120" height="40" rx="6" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/>
  <text x="560" y="194" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Final Gain</text>
  <!-- Arrows to central -->
  <line x1="515" y1="110" x2="540" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="685" y1="110" x2="580" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="515" y1="150" x2="540" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="685" y1="150" x2="580" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM19)"/>
  <!-- Output parameters -->
  <line x1="560" y1="210" x2="560" y2="235" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM19)"/>
  <rect x="435" y="240" width="80" height="25" rx="3" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="475" y="257" fill="#5a5550" font-size="9" text-anchor="middle">Gain</text>
  <rect x="525" y="240" width="80" height="25" rx="3" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="565" y="257" fill="#5a5550" font-size="9" text-anchor="middle">Coring</text>
  <rect x="615" y="240" width="80" height="25" rx="3" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="655" y="257" fill="#5a5550" font-size="9" text-anchor="middle">Shoot Lim</text>
  <!-- Workflow -->
  <rect x="435" y="280" width="330" height="40" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="600" y="300" fill="#5a5550" font-size="10" text-anchor="middle">Final_Gain = ISO_Gain × Signal_Curve × Texture_Map × Dir_Weight</text>
  <!-- Bottom: workflow steps -->
  <rect x="30" y="350" width="740" height="55" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="370" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Tuning Workflow</text>
  <text x="100" y="393" fill="#6a8a7a" font-size="10" text-anchor="middle">1. ISO100 基準</text>
  <text x="250" y="393" fill="#6a8a7a" font-size="10" text-anchor="middle">2. ISO 遞增調整</text>
  <text x="410" y="393" fill="#6a8a7a" font-size="10" text-anchor="middle">3. Signal Curve</text>
  <text x="560" y="393" fill="#6a8a7a" font-size="10" text-anchor="middle">4. Texture/Edge 微調</text>
  <text x="700" y="393" fill="#6a8a7a" font-size="10" text-anchor="middle">5. 整體驗證</text>
  <line x1="155" y1="393" x2="185" y2="393" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="310" y1="393" x2="350" y2="393" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="465" y1="393" x2="495" y2="393" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM19)"/>
  <line x1="620" y1="393" x2="645" y2="393" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM19)"/>
</svg><div class="caption">圖 6-19：銳化增益曲線族（ISO × Signal Level）與 Tuning 參數空間</div></div>

<h3>Texture-level Dependent Sharpening</h3>
<p>在區域分類器（ch6_17）提供的紋理度量基礎上，銳化增益可以進一步根據<strong>紋理強度</strong>微調：</p>
<ul>
  <li><strong>低紋理（Flat 區域）</strong>：增益 → 0（不銳化，避免噪聲放大）</li>
  <li><strong>中等紋理</strong>：增益 → 正常值（標準銳化）</li>
  <li><strong>強紋理</strong>：增益可略微提高（安全地增強密集紋理）</li>
  <li><strong>極強紋理（可能是邊緣）</strong>：增益回落（配合 Shoot Control）</li>
</ul>

<p>這種「先升後降」的增益曲線形狀稱為 <strong>Bell Curve</strong> 或 <strong>Inverted U</strong>，確保在紋理最豐富的區域獲得最強銳化，同時在平坦區域和強邊緣處都有所克制。</p>

<h3>Coring Threshold 曲線設計</h3>
<p>Coring 是指將小於某個閾值的高頻分量歸零（不增強）。這是一種簡單有效的<strong>噪聲抑制型銳化</strong>策略：假設小幅度的高頻變化主要是噪聲而非真正的細節。</p>

<div class="formula">Cored_HP(x,y) = sign(HP) × max(0, |HP| - Coring_Threshold)</div>

<p>Coring Threshold 的設計考量：</p>
<ul>
  <li><strong>閾值太低</strong>：噪聲被銳化，在平坦區域產生顆粒狀 Artifact</li>
  <li><strong>閾值太高</strong>：弱紋理細節被抑制，影像看起來「太滑」</li>
  <li><strong>理想閾值</strong>：約等於噪聲的 1-2 倍標準差（1σ ~ 2σ），可以濾除大部分噪聲同時保留多數真實細節</li>
</ul>

<h3>USM 參數組合：Radius / Amount / Threshold</h3>
<p>在以 USM 為基礎的銳化中，三個核心參數的交互關係如下：</p>
<ul>
  <li><strong>Radius（σ）增大</strong>：增強更大尺度的對比（類似 Clarity），但增加 Halo 寬度</li>
  <li><strong>Amount（Gain）增大</strong>：增加增強幅度，但增加 Halo 亮度和噪聲放大</li>
  <li><strong>Threshold（Coring）增大</strong>：抑制更多噪聲，但也抑制更多弱紋理</li>
</ul>

<div class="info-box example">
  <div class="box-title">📝 範例</div>
  <p>典型手機相機 ISP 的 USM 參數設定（12-bit Pipeline）：</p>
  <table>
    <tr><th>ISO</th><th>Radius (σ)</th><th>Amount</th><th>Coring</th><th>Shoot+</th><th>Shoot-</th></tr>
    <tr><td>100</td><td>1.0</td><td>2.5</td><td>2</td><td>100</td><td>150</td></tr>
    <tr><td>400</td><td>1.2</td><td>1.8</td><td>5</td><td>75</td><td>110</td></tr>
    <tr><td>1600</td><td>1.5</td><td>1.0</td><td>12</td><td>45</td><td>70</td></tr>
    <tr><td>6400</td><td>2.0</td><td>0.5</td><td>25</td><td>25</td><td>40</td></tr>
  </table>
</div>

<h3>實務 Tuning Workflow</h3>
<p>系統化的銳化 Tuning 流程：</p>
<ol>
  <li><strong>Step 1 — ISO 100 基準調適</strong>：在最低 ISO 下調整 Gain、Radius、Shoot Limit，目標是達到最佳銳度而無可見 Halo</li>
  <li><strong>Step 2 — ISO 遞增調適</strong>：逐步提高 ISO，降低 Gain、提高 Coring，確保每個 ISO 檔位的噪聲 / 銳度平衡</li>
  <li><strong>Step 3 — Signal Level Curve</strong>：在每個 ISO 下，微調暗區 / 亮區的增益比例</li>
  <li><strong>Step 4 — Texture/Edge 微調</strong>：調整紋理分類器的閾值和增益映射 LUT</li>
  <li><strong>Step 5 — 整體驗證</strong>：使用標準測試圖卡（ISO 12233, Dead Leaves）和真實場景影像，全面檢驗</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 品質檢查點</div>
  <ul>
    <li>MTF50 是否達到目標值？（ISO 12233 圖卡測量）</li>
    <li>平坦區域（18% Gray Card）是否有可見的噪聲放大？</li>
    <li>高對比邊緣（Black/White 刀刃）是否有可見 Halo？</li>
    <li>弱紋理區域（布料、皮膚）細節是否被保留？</li>
    <li>高 ISO 下是否有 False Contour / Banding？</li>
    <li>不同色溫光源下銳化效果是否一致？</li>
  </ul>
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  銳化 Tuning 必須在<strong>降噪 Tuning 完成之後</strong>進行。如果在降噪參數確定之前就調適銳化，當降噪參數改變時（例如更換降噪演算法或調整強度），所有銳化參數都需要重新調適。這是 ISP Tuning 中最常見的返工原因之一。
</div>
`,
      keyPoints: [
        "所有銳化參數必須建立 ISO-indexed 表格，隨增益動態調整",
        "Signal-level Gain Curve 讓暗區銳化較弱、亮區銳化較強，匹配 SNR 分佈",
        "Coring Threshold 約為噪聲 1-2σ，濾除噪聲同時保留弱紋理",
        "Tuning 流程應從 ISO100 開始，逐步擴展至高 ISO 再微調各維度",
        "銳化 Tuning 必須在降噪 Tuning 完成之後進行，避免返工"
      ]
    },
    {
      id: "ch6_20",
      title: "色彩相關銳化：Y Channel Sharpening 與 Chroma Artifact",
      content: `
<h3>為什麼只銳化亮度通道？</h3>
<p>在 ISP 銳化設計中，最重要的原則之一是<strong>只對亮度（Luminance / Y Channel）進行銳化</strong>，而不銳化色度（Chrominance / Cb, Cr）通道。原因有三：</p>

<ol>
  <li><strong>人眼特性</strong>：人眼對亮度解析力的敏感度遠高於色彩解析力。HVS（Human Visual System）的亮度 MTF50 約為色彩 MTF50 的 3-5 倍。因此，銳化亮度的視覺效益遠大於銳化色彩。</li>
  <li><strong>噪聲特性</strong>：在 Bayer Sensor 中，色彩資訊是透過不同顏色通道的差值計算得到。差值運算會放大噪聲（兩個獨立噪聲源相減，噪聲增加 √2 倍）。色度通道的 SNR 天生就比亮度低，銳化色度會大幅放大色彩噪聲。</li>
  <li><strong>Demosaic 頻寬</strong>：Bayer Demosaic 後的色彩通道有效頻寬只有亮度通道的一半（因為每個顏色通道的取樣率只有 Full Resolution 的 1/4 或 1/2）。銳化無法恢復不存在的色彩高頻資訊。</li>
</ol>

<h3>硬體 YUV 轉換</h3>
<p>ISP Pipeline 在銳化階段通常處於 RGB 域。為了實現 Y-only Sharpening，需要在銳化模組入口將 RGB 轉換為 YCbCr（或 YUV），對 Y 做銳化後，再轉回 RGB：</p>

<div class="formula">Y = 0.299R + 0.587G + 0.114B （BT.601）<br/>
Cb = -0.169R - 0.331G + 0.500B + 128<br/>
Cr = 0.500R - 0.419G - 0.081B + 128</div>

<p>銳化後的反轉換：</p>
<div class="formula">R' = Y' + 1.402(Cr - 128)<br/>
G' = Y' - 0.344(Cb - 128) - 0.714(Cr - 128)<br/>
B' = Y' + 1.772(Cb - 128)</div>

<p>在硬體中，這些矩陣乘法使用定點 MAC 實現。正向和反向轉換各需要 9 個乘法器和 6 個加法器（3×3 矩陣乘法），或透過共享和時分復用減少到 3 個乘法器。</p>

<div class="diagram"><svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="400" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Y-only Sharpening Pipeline 與 Chroma Artifact 防護</text>
  <defs><marker id="arrowM20" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Input RGB -->
  <rect x="20" y="70" width="70" height="80" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="55" y="90" fill="#c44" font-size="11" font-weight="bold" text-anchor="middle">R</text>
  <text x="55" y="110" fill="#4a4" font-size="11" font-weight="bold" text-anchor="middle">G</text>
  <text x="55" y="130" fill="#44c" font-size="11" font-weight="bold" text-anchor="middle">B</text>
  <text x="55" y="145" fill="#8a8580" font-size="8" text-anchor="middle">Input</text>
  <!-- RGB to YCbCr -->
  <line x1="90" y1="110" x2="120" y2="110" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM20)"/>
  <rect x="125" y="75" width="100" height="70" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="175" y="100" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">RGB→YCbCr</text>
  <text x="175" y="117" fill="#8a8580" font-size="8" text-anchor="middle">3×3 Matrix</text>
  <text x="175" y="132" fill="#8a8580" font-size="8" text-anchor="middle">9 MAC units</text>
  <!-- Y path -->
  <line x1="225" y1="90" x2="260" y2="90" stroke="#5a5550" stroke-width="2" marker-end="url(#arrowM20)"/>
  <text x="242" y="83" fill="#5a5550" font-size="9" font-weight="bold">Y</text>
  <!-- Sharpening on Y -->
  <rect x="265" y="65" width="130" height="50" rx="5" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/>
  <text x="330" y="85" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Y Sharpening</text>
  <text x="330" y="103" fill="#8a8580" font-size="8" text-anchor="middle">USM + Shoot Ctrl</text>
  <!-- Y' out -->
  <line x1="395" y1="90" x2="430" y2="90" stroke="#5a5550" stroke-width="2" marker-end="url(#arrowM20)"/>
  <text x="412" y="83" fill="#6a8a7a" font-size="9" font-weight="bold">Y'</text>
  <!-- CbCr bypass path -->
  <path d="M225,120 L245,120 L245,200 L430,200" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="330" y="195" fill="#8a8580" font-size="9" text-anchor="middle">Cb, Cr bypass (delayed)</text>
  <!-- Chroma artifact suppression -->
  <rect x="265" y="225" width="130" height="45" rx="5" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="330" y="245" fill="#5a5550" font-size="10" text-anchor="middle">Chroma Smooth</text>
  <text x="330" y="260" fill="#8a8580" font-size="8" text-anchor="middle">Edge-aware LPF</text>
  <line x1="330" y1="208" x2="330" y2="225" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM20)"/>
  <line x1="395" y1="247" x2="430" y2="200" stroke="#8a8580" stroke-width="1" marker-end="url(#arrowM20)"/>
  <!-- YCbCr to RGB -->
  <rect x="435" y="75" width="100" height="70" rx="5" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="485" y="100" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">YCbCr→RGB</text>
  <text x="485" y="117" fill="#8a8580" font-size="8" text-anchor="middle">Inverse 3×3</text>
  <text x="485" y="132" fill="#8a8580" font-size="8" text-anchor="middle">Matrix</text>
  <!-- Output RGB -->
  <line x1="535" y1="110" x2="565" y2="110" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM20)"/>
  <rect x="570" y="70" width="70" height="80" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="605" y="90" fill="#c44" font-size="11" font-weight="bold" text-anchor="middle">R'</text>
  <text x="605" y="110" fill="#4a4" font-size="11" font-weight="bold" text-anchor="middle">G'</text>
  <text x="605" y="130" fill="#44c" font-size="11" font-weight="bold" text-anchor="middle">B'</text>
  <text x="605" y="145" fill="#8a8580" font-size="8" text-anchor="middle">Output</text>
  <!-- Artifact examples at bottom -->
  <rect x="30" y="300" width="740" height="85" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="322" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">常見 Chroma Artifact 類型</text>
  <rect x="50" y="335" width="160" height="40" rx="4" fill="#c44" opacity="0.1" stroke="#c44" stroke-width="1"/>
  <text x="130" y="352" fill="#5a5550" font-size="9" text-anchor="middle">Color Fringing</text>
  <text x="130" y="366" fill="#8a8580" font-size="8" text-anchor="middle">紫/綠邊緣色散</text>
  <rect x="230" y="335" width="160" height="40" rx="4" fill="#c4a064" opacity="0.15" stroke="#c4a064" stroke-width="1"/>
  <text x="310" y="352" fill="#5a5550" font-size="9" text-anchor="middle">Colored Halo</text>
  <text x="310" y="366" fill="#8a8580" font-size="8" text-anchor="middle">邊緣帶色光暈</text>
  <rect x="410" y="335" width="160" height="40" rx="4" fill="#44c" opacity="0.1" stroke="#44c" stroke-width="1"/>
  <text x="490" y="352" fill="#5a5550" font-size="9" text-anchor="middle">Chroma Noise Boost</text>
  <text x="490" y="366" fill="#8a8580" font-size="8" text-anchor="middle">色彩噪聲放大</text>
  <rect x="590" y="335" width="160" height="40" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="670" y="352" fill="#5a5550" font-size="9" text-anchor="middle">False Color</text>
  <text x="670" y="366" fill="#8a8580" font-size="8" text-anchor="middle">邊緣假色彩</text>
</svg><div class="caption">圖 6-20：Y-only Sharpening Pipeline — RGB↔YCbCr 轉換與 Chroma Artifact 防護</div></div>

<h3>Chroma Artifact 的成因</h3>
<p>即使只銳化 Y 通道，仍可能產生色彩相關的 Artifact。原因在於 RGB → YCbCr → RGB 的轉換過程中，Y 通道的修改會間接影響 RGB 各通道的相對比例：</p>

<ul>
  <li><strong>Color Fringing（色散邊緣）</strong>：鏡頭的橫向色差（Lateral Chromatic Aberration, LCA）導致 RGB 三色的影像有微小的位移。Y-only 銳化會增強這個位移造成的邊緣色彩差異，使紫色/綠色邊緣更明顯。</li>
  <li><strong>Colored Halo</strong>：在飽和色彩的邊緣（如紅花 vs 綠葉），Y 通道的 Overshoot 經反轉換後，可能在某個 RGB 通道超出範圍，被 Clamp 後造成色彩失真。</li>
  <li><strong>False Color at Edges</strong>：Demosaic 在高頻區域可能產生的 Zipper / False Color，經銳化後會被放大。</li>
</ul>

<h3>False Color 抑制</h3>
<p>銳化後的 False Color 抑制是 ISP 的重要後處理步驟：</p>

<pre>
// False Color Suppression post-sharpening
for each pixel (x, y):
    // 計算局部 Chroma 方差
    chroma_var = variance_of(Cb, Cr) in 3×3 window;
    // 計算局部 Luma 梯度
    luma_grad = gradient(Y) at (x, y);

    // 如果 Luma 梯度高但 Chroma 方差也高 → 可能是 False Color
    if (luma_grad > edge_thr && chroma_var > chroma_thr):
        // 用周圍像素的 Chroma 均值替代
        Cb'(x,y) = weighted_average(Cb, neighbors);
        Cr'(x,y) = weighted_average(Cr, neighbors);
</pre>

<h3>Edge-aware Chroma Smoothing</h3>
<p>更精密的做法是在銳化 Pipeline 中整合<strong>邊緣感知的色度平滑（Edge-aware Chroma Smoothing）</strong>。這個模組利用 Y 通道的邊緣資訊來引導 CbCr 通道的平滑：</p>
<ul>
  <li>在<strong>邊緣處</strong>：對 CbCr 做較強的低通濾波，抑制色散和 False Color</li>
  <li>在<strong>非邊緣處</strong>：對 CbCr 保持不變或輕微平滑</li>
  <li>引導信號是 Y 通道的梯度幅度，閾值以上為邊緣，以下為非邊緣</li>
</ul>

<p>硬體上，這等同於一個以 Y 梯度為權重的 Bilateral-like CbCr 濾波器。可以簡化為：</p>
<div class="formula">Cb'(x,y) = (1-α) × Cb(x,y) + α × Mean_Cb(window)</div>
<div class="formula">α = clamp(Luma_Gradient / Threshold, 0, 1)</div>

<div class="info-box key">
  <div class="box-title">🔑 簡化實現的替代方案</div>
  <p>如果 ISP Pipeline 已經在 YCbCr 域進行處理（例如在 JPEG 壓縮前），可以省去 RGB↔YCbCr 的轉換成本。許多 ISP 的設計是在 Demosaic 輸出後立即轉到 YCbCr 域，後續的降噪、銳化、色彩增強都在 YCbCr 域進行，最後再轉回 RGB 輸出。這種設計的硬體效率更高，因為只需要一次正向轉換和一次反向轉換。</p>
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在實務中，另一種常見的「Y-only」近似方案是直接對 G 通道做銳化，再將增強量按比例分配到 R 和 B 通道：Delta_R = Delta_G × (R/G)，Delta_B = Delta_G × (B/G)。這避免了 RGB↔YCbCr 轉換的成本，因為在 Bayer Pattern 中 G 通道有最高的解析度（2 倍），G 就是亮度的最佳近似。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  在高飽和度色彩邊緣（如紅色 vs 藍色），Y-only 銳化的 Overshoot 可能導致反轉換後某些 RGB 通道超出 [0, MAX] 範圍。此時的 Clamp 會改變色相（Hue Shift），產生不自然的色彩。解決方案是在反轉換後做色相保護型 Clamp：按比例縮放 RGB 使其不超出範圍，而非獨立截斷各通道。
</div>
`,
      keyPoints: [
        "銳化應只對亮度通道（Y）進行，不銳化色度（CbCr），因為人眼對色彩解析力不敏感",
        "RGB → YCbCr → 銳化 Y → YCbCr → RGB 的轉換需要正反向矩陣乘法",
        "常見 Chroma Artifact 包括 Color Fringing、Colored Halo、False Color",
        "Edge-aware Chroma Smoothing 利用 Y 梯度引導 CbCr 平滑，抑制邊緣色彩 Artifact",
        "替代方案：直接銳化 G 通道按比例分配至 R/B，省去色彩空間轉換"
      ]
    },
    {
      id: "ch6_21",
      title: "銳化與 NR 的聯合優化",
      content: `
<h3>NR 與 Sharpening 的矛盾本質</h3>
<p>降噪（NR, Noise Reduction）和銳化（Sharpening）是 ISP 中一對天然矛盾的處理。降噪的目標是去除高頻噪聲，而銳化的目標是增強高頻細節。兩者都在高頻域操作，差異僅在於對「信號」和「噪聲」的判別。如果降噪和銳化獨立設計、獨立調適，很容易發生以下問題：</p>
<ul>
  <li><strong>降噪過度 + 銳化過度</strong>：NR 先將影像「磨平」，銳化再人工製造假邊緣 → 影像看起來「塑膠感」</li>
  <li><strong>降噪不足 + 銳化增強噪聲</strong>：NR 未充分去噪，銳化放大殘餘噪聲 → 影像顆粒明顯</li>
  <li><strong>降噪和銳化相互抵消</strong>：NR 去除的細節被銳化「恢復」（實際是放大噪聲），等於浪費了兩個模組的功耗</li>
</ul>

<p>最佳的策略是將 NR 和 Sharpening 作為<strong>聯合系統</strong>來設計和調適，而非兩個獨立模組。</p>

<h3>Pipeline 順序：NR-then-Sharpen vs Sharpen-then-NR</h3>
<p>幾乎所有 ISP 都採用 <strong>NR → Sharpening</strong> 的順序，原因如下：</p>

<table>
  <tr><th>順序</th><th>優點</th><th>缺點</th></tr>
  <tr><td><strong>NR → Sharpen</strong></td><td>銳化不會放大噪聲（已被 NR 去除）；NR 可以放心使用較強的平滑</td><td>NR 可能同時去除真正的細節，銳化也無法恢復</td></tr>
  <tr><td>Sharpen → NR</td><td>銳化看到原始細節，不受 NR 影響</td><td>NR 必須處理被銳化放大的噪聲（更困難）；Overshoot 被 NR 視為噪聲可能被錯誤去除</td></tr>
</table>

<p>在進階 ISP 中，某些設計採用<strong>多階段混合</strong>：先做輕度 NR（去除最明顯的噪聲），再做銳化，最後做第二輪精細 NR（處理銳化引入的殘餘 Artifact）。這種設計品質最高但硬體成本也最大。</p>

<h3>Joint NR + Sharpening 參數設計</h3>
<p>聯合設計的核心是確保 NR 和 Sharpening 的參數在同一 ISO 下<strong>互補</strong>：</p>

<div class="info-box example">
  <div class="box-title">📝 範例</div>
  <p>ISO-dependent Joint NR + Sharpening 參數表：</p>
  <table>
    <tr><th>ISO</th><th>NR Strength</th><th>NR Texture Preservation</th><th>Sharp Gain</th><th>Sharp Coring</th><th>整體策略</th></tr>
    <tr><td>100</td><td>Low (0.3)</td><td>High</td><td>2.5</td><td>2</td><td>輕微 NR，強銳化</td></tr>
    <tr><td>400</td><td>Medium (0.6)</td><td>Medium-High</td><td>1.8</td><td>5</td><td>平衡 NR 與銳化</td></tr>
    <tr><td>1600</td><td>High (1.0)</td><td>Medium</td><td>1.0</td><td>12</td><td>較強 NR，適度銳化</td></tr>
    <tr><td>6400</td><td>Very High (1.5)</td><td>Low-Medium</td><td>0.5</td><td>25</td><td>強 NR，輕微銳化</td></tr>
    <tr><td>25600</td><td>Maximum (2.0)</td><td>Low</td><td>0.2</td><td>40</td><td>極強 NR，幾乎不銳化</td></tr>
  </table>
  <p>關鍵是 NR Strength 和 Sharp Gain 呈反向關係：NR 越強時銳化越弱。</p>
</div>

<h3>Noise-aware Sharpening</h3>
<p>更進階的做法是讓銳化模組直接感知噪聲水平，而非僅依賴預設的 ISO 參數表。<strong>Noise-aware Sharpening</strong> 的原理：</p>

<ol>
  <li>NR 模組在處理過程中會估算每個像素的<strong>噪聲水平（Noise Level）</strong>或<strong>殘餘噪聲（Residual Noise）</strong></li>
  <li>這些噪聲估算資訊作為 Side Information 傳遞給銳化模組</li>
  <li>銳化模組根據噪聲水平動態調整每個像素的銳化增益和 Coring Threshold</li>
</ol>

<div class="formula">Sharp_Gain(x,y) = Base_Gain × max(0, 1 - Noise_Level(x,y) / Noise_Threshold)</div>

<p>當 Noise_Level 接近零時（乾淨區域），銳化增益為 Base_Gain。當 Noise_Level 超過 Noise_Threshold 時，銳化增益降為零。</p>

<h3>共享邊緣 Map</h3>
<p>NR 和 Sharpening 都需要邊緣偵測：NR 需要邊緣 Map 來保護邊緣不被過度平滑（Edge-preserving NR），Sharpening 需要邊緣 Map 來控制銳化方向和強度。在硬體中，<strong>共享同一組邊緣偵測硬體</strong>可以顯著節省面積：</p>

<div class="diagram"><svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="420" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">Joint NR-Sharpening Pipeline 與共享 Edge Map</text>
  <defs><marker id="arrowM21" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Input -->
  <rect x="20" y="90" width="70" height="35" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="55" y="112" fill="#5a5550" font-size="10" text-anchor="middle">Input</text>
  <line x1="90" y1="107" x2="120" y2="107" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM21)"/>
  <!-- Shared Edge/Noise Estimator -->
  <rect x="125" y="55" width="160" height="105" rx="6" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="2"/>
  <text x="205" y="75" fill="#6a8a7a" font-size="11" font-weight="bold" text-anchor="middle">Shared Analysis Engine</text>
  <line x1="140" y1="82" x2="270" y2="82" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="140" y="90" width="130" height="25" rx="3" fill="#6a8a7a" opacity="0.15" stroke="none"/>
  <text x="205" y="107" fill="#5a5550" font-size="9" text-anchor="middle">Edge Map (gradient + direction)</text>
  <rect x="140" y="120" width="130" height="25" rx="3" fill="#6a8a7a" opacity="0.15" stroke="none"/>
  <text x="205" y="137" fill="#5a5550" font-size="9" text-anchor="middle">Noise Level Estimate</text>
  <!-- NR Module -->
  <rect x="330" y="50" width="140" height="60" rx="5" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="400" y="72" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">NR Module</text>
  <text x="400" y="90" fill="#8a8580" font-size="8" text-anchor="middle">Edge-preserving Denoise</text>
  <text x="400" y="102" fill="#8a8580" font-size="8" text-anchor="middle">uses Edge Map + Noise Est.</text>
  <!-- Arrows from shared to NR -->
  <line x1="285" y1="90" x2="330" y2="75" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#arrowM21)"/>
  <!-- NR to Sharpen -->
  <line x1="470" y1="80" x2="510" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM21)"/>
  <text x="490" y="73" fill="#8a8580" font-size="8">denoised</text>
  <!-- Sharpen Module -->
  <rect x="515" y="50" width="140" height="60" rx="5" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="585" y="72" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Sharpening Module</text>
  <text x="585" y="90" fill="#8a8580" font-size="8" text-anchor="middle">Dir-Sharpening + Shoot Ctrl</text>
  <text x="585" y="102" fill="#8a8580" font-size="8" text-anchor="middle">uses Edge Map + Noise Est.</text>
  <!-- Arrows from shared to Sharpen -->
  <path d="M285,120 L310,120 L310,175 L535,175 L535,110" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,2" marker-end="url(#arrowM21)"/>
  <text x="420" y="170" fill="#6a8a7a" font-size="8">shared edge map + noise (delayed)</text>
  <!-- Output -->
  <line x1="655" y1="80" x2="690" y2="80" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM21)"/>
  <rect x="695" y="63" width="70" height="35" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="730" y="85" fill="#5a5550" font-size="10" text-anchor="middle">Output</text>
  <!-- Residual noise feedback -->
  <path d="M470,100 L490,120 L490,140 L535,140 L535,110" fill="none" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arrowM21)"/>
  <text x="512" y="148" fill="#c4a064" font-size="8">residual noise</text>
  <!-- Bottom: Quality optimization strategies -->
  <rect x="30" y="220" width="740" height="180" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="245" fill="#5a5550" font-size="13" font-weight="bold" text-anchor="middle">整體紋理品質優化策略</text>
  <line x1="50" y1="255" x2="750" y2="255" stroke="#d5cec7" stroke-width="0.5"/>
  <!-- Strategy boxes -->
  <rect x="50" y="265" width="220" height="55" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="160" y="282" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">低 ISO (100-400)</text>
  <text x="160" y="298" fill="#8a8580" font-size="9" text-anchor="middle">輕 NR + 強 Sharpening</text>
  <text x="160" y="312" fill="#8a8580" font-size="8" text-anchor="middle">目標：最大化解析力與紋理細節</text>
  <rect x="290" y="265" width="220" height="55" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="282" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">中 ISO (800-3200)</text>
  <text x="400" y="298" fill="#8a8580" font-size="9" text-anchor="middle">中 NR + 中 Sharpening</text>
  <text x="400" y="312" fill="#8a8580" font-size="8" text-anchor="middle">目標：平衡噪聲抑制與紋理保留</text>
  <rect x="530" y="265" width="220" height="55" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#d5cec7" stroke-width="1"/>
  <text x="640" y="282" fill="#5a5550" font-size="10" font-weight="bold" text-anchor="middle">高 ISO (6400+)</text>
  <text x="640" y="298" fill="#8a8580" font-size="9" text-anchor="middle">強 NR + 弱/無 Sharpening</text>
  <text x="640" y="312" fill="#8a8580" font-size="8" text-anchor="middle">目標：噪聲控制優先，保留主要輪廓</text>
  <!-- Key metric -->
  <rect x="50" y="335" width="700" height="50" rx="4" fill="#6a8a7a" opacity="0.08" stroke="none"/>
  <text x="400" y="355" fill="#5a5550" font-size="11" text-anchor="middle">核心評估指標：Texture MTF（Dead Leaves Chart）— 同時衡量 NR 的紋理保留和 Sharpening 的紋理增強</text>
  <text x="400" y="375" fill="#8a8580" font-size="10" text-anchor="middle">Texture MTF = 降噪後紋理保留率 × 銳化增強倍率 — 兩者的乘積決定最終紋理品質</text>
</svg><div class="caption">圖 6-21：Joint NR-Sharpening 優化 Pipeline — 共享邊緣 Map、噪聲估算與整體策略</div></div>

<h3>整體紋理品質的優化目標</h3>
<p>NR 和 Sharpening 聯合優化的最終目標是最大化 <strong>Texture MTF</strong>（或稱 Texture Acutance）。Texture MTF 可以用 <strong>Dead Leaves Chart</strong>（ISO 19567）測量，它同時反映了降噪的紋理保留能力和銳化的紋理增強能力：</p>

<div class="formula">Effective_Texture_MTF = NR_Texture_Preservation × Sharpening_Enhancement</div>

<p>如果 NR 過強（Preservation = 0.5）而銳化試圖彌補（Enhancement = 2.0），數學上 Texture_MTF = 1.0，但實際視覺品質很差 — 紋理的自然結構已被 NR 破壞，銳化只是增強了人工的假邊緣。因此，最佳策略是讓 NR 盡可能保留真實紋理（Preservation 接近 1.0），然後只需要輕度銳化即可達到目標 MTF。</p>

<div class="info-box key">
  <div class="box-title">🔑 聯合調適原則</div>
  <ul>
    <li><strong>NR First, Sharpen Second</strong>：先確定 NR 的紋理保留能力，再設定銳化增益來達到目標 MTF</li>
    <li><strong>Preserve over Recover</strong>：NR 保留 1% 的真實紋理，勝過銳化恢復 10% 的假紋理</li>
    <li><strong>Noise Floor 一致性</strong>：確保 NR 後的殘餘噪聲 Floor 均勻（空間上和灰度上），避免銳化放大不均勻噪聲</li>
    <li><strong>Shared Tuning Session</strong>：NR 和 Sharpening 的參數應在同一 Tuning Session 中聯合調整，而非分別由不同工程師獨立調適</li>
  </ul>
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  在某些 ISP 設計中，NR 模組和 Sharpening 模組由不同團隊開發，使用不同的 Line Buffer 和邊緣偵測邏輯。這導致兩個模組對「邊緣」的定義不一致 — NR 可能在某處保護了邊緣，但 Sharpening 在同一位置判斷為非邊緣而不增強。反之亦然。共享邊緣 Map 可以完全消除這個問題。
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  在硬體預算充裕的情況下，一些高階 ISP 採用<strong>NR 殘差回饋銳化</strong>的架構：NR 模組輸出降噪後的影像，同時輸出被移除的噪聲殘差（Noise Residual = Input - Denoised）。銳化模組檢查 Noise Residual，如果其中包含有結構性的紋理成分（透過空間一致性檢測判斷），則將這些成分加回到銳化輸出中。這等於讓銳化模組「挽救」被 NR 誤殺的紋理。
</div>
`,
      keyPoints: [
        "NR 和 Sharpening 天然矛盾，必須作為聯合系統設計和調適",
        "Pipeline 順序幾乎都是 NR → Sharpening，確保銳化不放大噪聲",
        "Noise-aware Sharpening 根據噪聲估算動態調整逐像素銳化增益",
        "共享邊緣 Map 確保 NR 和 Sharpening 對邊緣定義一致，節省硬體面積",
        "最終紋理品質取決於 NR 保留率 × 銳化增強率，保留真紋理優於恢復假紋理"
      ]
    },
    {
      id: "ch6_22",
      title: "車用相機銳化需求",
      content: `
<h3>車用 vs 手機：截然不同的銳化目標</h3>
<p>車用相機的銳化需求與手機/消費級相機有本質性的差異。手機相機的銳化主要服務<strong>人眼觀看</strong> — 目標是讓照片看起來清晰悅目。而車用相機的銳化同時服務<strong>兩個客戶</strong>：</p>
<ul>
  <li><strong>ADAS/AD 演算法（機器視覺）</strong>：物件偵測、車道線辨識、交通號誌識別等 — 需要精確的邊緣和高可靠性</li>
  <li><strong>駕駛員顯示（人眼觀看）</strong>：後視鏡替代螢幕、環景顯示 — 需要自然舒適的觀看體驗</li>
</ul>

<p>這兩個目標有時是衝突的。例如，ADAS 演算法偏好<strong>較少處理的原始影像</strong>（避免 Artifact 干擾偵測），而人眼顯示偏好<strong>適度銳化增強的影像</strong>。因此，車用 ISP 常需要<strong>雙路輸出</strong>：一路為 ADAS（較輕或無銳化），一路為顯示（正常銳化）。</p>

<h3>遠場銳化：小物體可見性</h3>
<p>在車用場景中，<strong>遠場（Far-field）</strong>的小物體辨識至關重要：遠處的行人、交通號誌、障礙物等。這些物體在 Sensor 上可能只佔<strong>數個像素</strong>，如果銳化不足，會被模糊到幾乎不可見。</p>

<p>遠場銳化的特殊考量：</p>
<ul>
  <li><strong>高頻增強</strong>：遠場小物體的邊緣在 Sensor 上接近 Nyquist 頻率，需要在不引入 Aliasing 的前提下盡可能增強高頻</li>
  <li><strong>Overshoot 嚴格控制</strong>：小物體的 Overshoot 可能在面積上等同甚至大於物體本身，嚴重干擾偵測</li>
  <li><strong>SNR 限制</strong>：遠場物體反射光較少，像素信號較弱，SNR 較低，銳化噪聲放大的風險更高</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 車用遠場銳化策略</div>
  <p>針對遠場區域（影像上半部，通常是天際線以上），建議使用較高的 Coring Threshold（抑制噪聲）搭配中等的 Sharpening Gain。Shoot Control 必須設為嚴格模式。相比手機 ISP 偏好「看起來銳利」，車用 ISP 偏好「物體邊緣準確可靠」。</p>
</div>

<h3>Ringing Artifact 對 ADAS 感知的影響</h3>
<p>銳化產生的 <strong>Ringing（振鈴效應）</strong>在人眼觀看時可能不太明顯，但對 ADAS 演算法有嚴重影響：</p>
<ul>
  <li><strong>車道線偵測</strong>：Ringing 在車道線旁產生的假邊緣（Ghost Edge）可能被 Hough Transform 或 CNN 誤偵測為額外的車道線</li>
  <li><strong>行人偵測</strong>：行人輪廓的 Overshoot/Undershoot 改變了 HOG（Histogram of Oriented Gradients）特徵的分佈，降低 SVM/CNN 的分類準確度</li>
  <li><strong>交通號誌辨識</strong>：號誌文字/符號周圍的 Halo 降低 OCR 和圖案匹配的可靠度</li>
  <li><strong>深度估算</strong>：立體視覺（Stereo Vision）中，左右影像的 Ringing Pattern 不完全一致，導致 Disparity 計算誤差</li>
</ul>

<div class="diagram"><svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="430" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">車用相機銳化場景：距離相關需求</text>
  <defs><marker id="arrowM22" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Road scene illustration -->
  <rect x="30" y="45" width="400" height="250" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <!-- Sky area -->
  <rect x="30" y="45" width="400" height="80" rx="4" fill="#6a8a7a" opacity="0.05"/>
  <text x="230" y="75" fill="#8a8580" font-size="10" text-anchor="middle">遠場 (>100m): 交通號誌、遠方行人</text>
  <text x="230" y="92" fill="#8a8580" font-size="9" text-anchor="middle">像素大小: 2-10 px | SNR: Low</text>
  <!-- Mid area -->
  <rect x="30" y="125" width="400" height="80" fill="#6a8a7a" opacity="0.08"/>
  <text x="230" y="155" fill="#5a5550" font-size="10" text-anchor="middle">中場 (20-100m): 前車、行人、車道線</text>
  <text x="230" y="172" fill="#8a8580" font-size="9" text-anchor="middle">像素大小: 10-100 px | SNR: Medium</text>
  <!-- Near area -->
  <rect x="30" y="205" width="400" height="90" rx="4" fill="#6a8a7a" opacity="0.12"/>
  <text x="230" y="235" fill="#5a5550" font-size="10" text-anchor="middle">近場 (<20m): 地面紋理、車道標線、路面</text>
  <text x="230" y="252" fill="#8a8580" font-size="9" text-anchor="middle">像素大小: >100 px | SNR: High</text>
  <!-- Road perspective lines -->
  <line x1="180" y1="295" x2="210" y2="125" stroke="#d5cec7" stroke-width="1"/>
  <line x1="280" y1="295" x2="250" y2="125" stroke="#d5cec7" stroke-width="1"/>
  <!-- Right side: requirements table -->
  <rect x="460" y="45" width="320" height="250" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="620" y="68" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">距離相關銳化需求</text>
  <line x1="475" y1="78" x2="765" y2="78" stroke="#d5cec7" stroke-width="0.5"/>
  <!-- Far field -->
  <text x="480" y="98" fill="#6a8a7a" font-size="10" font-weight="bold">遠場策略:</text>
  <text x="490" y="115" fill="#5a5550" font-size="9">• Gain: Medium (1.0-1.5)</text>
  <text x="490" y="130" fill="#5a5550" font-size="9">• Coring: High (抑制低 SNR 噪聲)</text>
  <text x="490" y="145" fill="#5a5550" font-size="9">• Shoot: Very Strict (小物體保護)</text>
  <!-- Mid field -->
  <text x="480" y="170" fill="#6a8a7a" font-size="10" font-weight="bold">中場策略:</text>
  <text x="490" y="187" fill="#5a5550" font-size="9">• Gain: Medium-High (1.5-2.0)</text>
  <text x="490" y="202" fill="#5a5550" font-size="9">• Coring: Medium</text>
  <text x="490" y="217" fill="#5a5550" font-size="9">• Shoot: Moderate (邊緣品質平衡)</text>
  <!-- Near field -->
  <text x="480" y="242" fill="#6a8a7a" font-size="10" font-weight="bold">近場策略:</text>
  <text x="490" y="259" fill="#5a5550" font-size="9">• Gain: Low-Medium (0.5-1.0)</text>
  <text x="490" y="274" fill="#5a5550" font-size="9">• 近場細節已足夠，避免過度銳化</text>
  <!-- Bottom: special considerations -->
  <rect x="30" y="310" width="740" height="100" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="332" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">車用特殊考量</text>
  <rect x="50" y="345" width="165" height="50" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="132" y="362" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">溫度 MTF 補償</text>
  <text x="132" y="378" fill="#8a8580" font-size="8" text-anchor="middle">-40°C~+85°C 鏡頭</text>
  <text x="132" y="390" fill="#8a8580" font-size="8" text-anchor="middle">熱膨脹 → MTF 漂移</text>
  <rect x="230" y="345" width="165" height="50" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="312" y="362" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">環景拼接一致性</text>
  <text x="312" y="378" fill="#8a8580" font-size="8" text-anchor="middle">4/6 鏡頭銳化參數</text>
  <text x="312" y="390" fill="#8a8580" font-size="8" text-anchor="middle">需完全一致</text>
  <rect x="410" y="345" width="165" height="50" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="492" y="362" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">低延遲需求</text>
  <text x="492" y="378" fill="#8a8580" font-size="8" text-anchor="middle">ADAS: <33ms 端到端</text>
  <text x="492" y="390" fill="#8a8580" font-size="8" text-anchor="middle">銳化 Pipeline ≤2 行延遲</text>
  <rect x="590" y="345" width="165" height="50" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="672" y="362" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">功能安全 (ISO 26262)</text>
  <text x="672" y="378" fill="#8a8580" font-size="8" text-anchor="middle">銳化異常自檢</text>
  <text x="672" y="390" fill="#8a8580" font-size="8" text-anchor="middle">Fail-safe: 關閉銳化</text>
</svg><div class="caption">圖 6-22：車用相機銳化場景 — 遠場/中場/近場策略與特殊考量</div></div>

<h3>溫度相關的 MTF 補償</h3>
<p>車用相機面臨<strong>極端溫度範圍</strong>（-40°C 至 +85°C 甚至 +105°C）。溫度變化會影響鏡頭的光學性能：</p>
<ul>
  <li><strong>熱膨脹</strong>：鏡片間距改變，焦距偏移，導致 MTF 下降</li>
  <li><strong>折射率變化</strong>：光學材料的折射率隨溫度漂移，影響像差校正</li>
  <li><strong>鏡筒變形</strong>：塑膠鏡筒在高溫下可能膨脹，改變光軸對齊</li>
</ul>

<p>為了補償溫度引起的 MTF 變化，車用 ISP 的銳化參數需要<strong>溫度索引</strong>：</p>
<pre>
// Temperature-indexed sharpening gain adjustment
temp_range:     [-40°C, -20°C,  0°C, 25°C, 50°C, 85°C]
mtf_degradation: [0.92,  0.95, 0.98, 1.00, 0.97, 0.90]
sharp_gain_comp: [1.10,  1.06, 1.02, 1.00, 1.04, 1.15]
</pre>

<p>溫度感測器的讀數（通常來自 Sensor 的溫度暫存器或模組上的 NTC 熱敏電阻）經過 ADC 轉換後，用於查表選擇對應的銳化增益補償量。</p>

<h3>環景拼接的銳化一致性</h3>
<p>在 Surround View System 中，4-6 個廣角相機的影像需要拼接成鳥瞰圖。如果各相機的銳化參數不一致，在拼接邊界處會出現明顯的<strong>銳度不連續</strong>（一側較銳，另一側較模糊）。解決方案：</p>
<ul>
  <li>所有相機使用<strong>完全相同的銳化參數表</strong></li>
  <li>定期校正每個相機的 MTF 差異，用銳化增益補償使輸出 MTF 一致</li>
  <li>在拼接邊界的 Blending 區域內，銳化增益需要額外的漸變過渡</li>
</ul>

<h3>低延遲需求</h3>
<p>ADAS 系統對<strong>端到端延遲（End-to-end Latency）</strong>有嚴格要求：從光子到達 Sensor 到 ISP 輸出最終影像，通常要求在 <strong>33ms（30fps 的一個 Frame Time）</strong>以內完成。銳化模組作為 ISP Pipeline 的一環，其延遲預算非常有限：</p>
<ul>
  <li>銳化 Line Buffer 延遲：≤ 2 行（使用 3×3 或 5×5 小 Kernel）</li>
  <li>禁止使用需要多 Frame 參考的銳化演算法（如 Temporal Sharpening）</li>
  <li>Pipeline Register 深度應盡量控制在 5 個 Clock 以內</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  車用 ISP 必須考慮<strong>功能安全（Functional Safety, ISO 26262）</strong>。銳化模組需要內建自檢機制：如果 Line Buffer SRAM 發生位翻轉（SEU, Single Event Upset）或邏輯故障，可能導致輸出影像出現嚴重 Artifact，進而影響 ADAS 決策。Fail-safe 策略是：偵測到異常時自動 Bypass 銳化模組（直接輸出未銳化影像），而非輸出可能有 Artifact 的影像。
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  針對 ADAS 和顯示雙路輸出的需求，一種高效的硬體設計是在銳化 Pipeline 的增益乘法階段使用<strong>雙組增益暫存器</strong>：一組為 ADAS 路徑（保守增益），一組為顯示路徑（正常增益）。Line Buffer 和濾波邏輯完全共享，僅在最終增益和 Shoot Control 階段分叉，面積增加 < 10%。
</div>
`,
      keyPoints: [
        "車用銳化同時服務 ADAS（精確邊緣）和顯示（自然觀感），常需雙路輸出",
        "遠場小物體需要高 Coring + 嚴格 Shoot Control 的銳化策略",
        "Ringing Artifact 對車道線偵測、行人辨識、深度估算均有負面影響",
        "溫度範圍-40°C~+85°C 導致鏡頭 MTF 漂移，銳化增益需溫度補償",
        "功能安全要求銳化模組具備自檢和 Fail-safe Bypass 機制"
      ]
    },
    {
      id: "ch6_23",
      title: "銳化品質評估與 Debug",
      content: `
<h3>銳化品質的量化評估</h3>
<p>銳化效果的評估不能僅依賴主觀觀感，需要建立<strong>量化指標體系</strong>來系統性地衡量銳化品質。在 ISP 開發和 Tuning 過程中，以下指標是最常用的：</p>

<h3>MTF / SFR 測量</h3>
<p><strong>SFR（Spatial Frequency Response）</strong>是衡量銳化效果的首要指標，與 MTF 數值相同但測量方法不同。SFR 使用<strong>斜邊（Slanted Edge）</strong>測量法（ISO 12233 標準）：</p>

<ol>
  <li>拍攝一個約 5° 傾斜的黑白邊緣（Slanted Edge Chart）</li>
  <li>透過 Sub-pixel 取樣重建 Edge Spread Function (ESF)</li>
  <li>對 ESF 微分得到 Line Spread Function (LSF)</li>
  <li>對 LSF 做 FFT 得到 MTF 曲線</li>
</ol>

<div class="formula">MTF(f) = |FFT{LSF(x)}| = |FFT{d/dx ESF(x)}|</div>

<p>關鍵的 MTF 指標：</p>
<table>
  <tr><th>指標</th><th>定義</th><th>銳化前典型值</th><th>銳化後目標</th></tr>
  <tr><td>MTF50</td><td>MTF = 50% 的頻率</td><td>0.25-0.35 cy/px</td><td>0.35-0.45 cy/px</td></tr>
  <tr><td>MTF50P</td><td>MTF 最高點後降至 50% 的頻率</td><td>N/A</td><td>接近 MTF50 (無 Overshoot 時相等)</td></tr>
  <tr><td>MTF at Nyquist</td><td>在 0.5 cy/px 的 MTF 值</td><td>0.05-0.15</td><td>< 0.3 (過高表示 Aliasing)</td></tr>
</table>

<p>如果銳化導致 MTF 曲線在某個頻率超過 1.0（表示增強了該頻率的對比），且曲線的形狀出現<strong>峰值後回落</strong>的特徵，就表明有 Overshoot。MTF50P（MTF 從峰值降至 50% 的點）與 MTF50 的差值越大，Overshoot 越嚴重。</p>

<h3>Overshoot Ratio 測量</h3>
<p>直接測量邊緣的 Overshoot 幅度：</p>

<div class="formula">Overshoot_Ratio = (Peak_Value - Steady_State_Value) / Edge_Contrast × 100%</div>

<p>其中 Edge Contrast 是邊緣兩側穩態亮度值的差。典型標準：</p>
<ul>
  <li><strong>手機相機</strong>：Overshoot Ratio < 10-15% 可接受</li>
  <li><strong>車用相機（ADAS）</strong>：Overshoot Ratio < 5% 較理想</li>
  <li><strong>專業攝影</strong>：Overshoot Ratio < 8-10%</li>
</ul>

<h3>Texture MTF（Dead Leaves）</h3>
<p><strong>Dead Leaves Chart（ISO 19567）</strong>用於測量 NR + Sharpening 聯合處理後的<strong>紋理保留/增強能力</strong>。與 SFR 使用的人工邊緣不同，Dead Leaves 包含各種方向和頻率的隨機紋理，更接近真實場景：</p>
<ul>
  <li>Texture MTF > 1.0 表示紋理被銳化增強</li>
  <li>Texture MTF < 1.0 表示紋理被降噪削弱</li>
  <li>理想目標：所有目標頻率的 Texture MTF ≥ 1.0（紋理被保留或增強）</li>
</ul>

<div class="diagram"><svg viewBox="0 0 800 430" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="430" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">銳化品質 Debug 流程圖</text>
  <defs><marker id="arrowM23" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- Start -->
  <rect x="300" y="50" width="200" height="35" rx="17" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="400" y="72" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">影像品質問題報告</text>
  <line x1="400" y1="85" x2="400" y2="105" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM23)"/>
  <!-- Decision 1: Over or Under? -->
  <polygon points="400,110 520,145 400,180 280,145" fill="#f5f0eb" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="400" y="142" fill="#5a5550" font-size="10" text-anchor="middle">過度銳化</text>
  <text x="400" y="156" fill="#5a5550" font-size="10" text-anchor="middle">or 不足？</text>
  <!-- Over-sharpened branch (left) -->
  <line x1="280" y1="145" x2="200" y2="145" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM23)"/>
  <text x="240" y="138" fill="#c44" font-size="9">過度銳化</text>
  <rect x="40" y="125" width="155" height="40" rx="5" fill="#c44" opacity="0.1" stroke="#c44" stroke-width="1"/>
  <text x="117" y="142" fill="#5a5550" font-size="9" text-anchor="middle">症狀檢查</text>
  <text x="117" y="158" fill="#8a8580" font-size="8" text-anchor="middle">Halo? Ringing? 噪聲放大?</text>
  <!-- Sub-branches for over-sharpened -->
  <line x1="117" y1="165" x2="117" y2="185" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM23)"/>
  <!-- Halo -->
  <rect x="20" y="190" width="90" height="55" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="65" y="207" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">Halo</text>
  <text x="65" y="220" fill="#8a8580" font-size="7" text-anchor="middle">→ 降低 Gain</text>
  <text x="65" y="232" fill="#8a8580" font-size="7" text-anchor="middle">→ 收緊 Shoot Ctrl</text>
  <text x="65" y="244" fill="#8a8580" font-size="7" text-anchor="middle">→ 減小 Radius</text>
  <!-- Noise amp -->
  <rect x="120" y="190" width="90" height="55" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="165" y="207" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">噪聲放大</text>
  <text x="165" y="220" fill="#8a8580" font-size="7" text-anchor="middle">→ 提高 Coring</text>
  <text x="165" y="232" fill="#8a8580" font-size="7" text-anchor="middle">→ 降低高頻 Gain</text>
  <text x="165" y="244" fill="#8a8580" font-size="7" text-anchor="middle">→ 檢查 NR 強度</text>
  <!-- Under-sharpened branch (right) -->
  <line x1="520" y1="145" x2="600" y2="145" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM23)"/>
  <text x="560" y="138" fill="#6a8a7a" font-size="9">銳化不足</text>
  <rect x="605" y="125" width="155" height="40" rx="5" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="1"/>
  <text x="682" y="142" fill="#5a5550" font-size="9" text-anchor="middle">症狀檢查</text>
  <text x="682" y="158" fill="#8a8580" font-size="8" text-anchor="middle">模糊? 紋理喪失? 塑膠感?</text>
  <!-- Sub-branches for under-sharpened -->
  <line x1="682" y1="165" x2="682" y2="185" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM23)"/>
  <!-- Blurry -->
  <rect x="600" y="190" width="90" height="55" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="645" y="207" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">整體模糊</text>
  <text x="645" y="220" fill="#8a8580" font-size="7" text-anchor="middle">→ 提高 Gain</text>
  <text x="645" y="232" fill="#8a8580" font-size="7" text-anchor="middle">→ 確認 NR 未過度</text>
  <text x="645" y="244" fill="#8a8580" font-size="7" text-anchor="middle">→ 檢查光學對焦</text>
  <!-- Plastic look -->
  <rect x="700" y="190" width="90" height="55" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="745" y="207" fill="#5a5550" font-size="9" font-weight="bold" text-anchor="middle">塑膠感</text>
  <text x="745" y="220" fill="#8a8580" font-size="7" text-anchor="middle">→ NR 過度平滑</text>
  <text x="745" y="232" fill="#8a8580" font-size="7" text-anchor="middle">→ 增加中頻增強</text>
  <text x="745" y="244" fill="#8a8580" font-size="7" text-anchor="middle">→ 降低 NR 紋理</text>
  <!-- Common artifacts section -->
  <rect x="30" y="270" width="740" height="140" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="292" fill="#5a5550" font-size="12" font-weight="bold" text-anchor="middle">常見銳化 Artifact 診斷速查表</text>
  <line x1="50" y1="302" x2="750" y2="302" stroke="#d5cec7" stroke-width="0.5"/>
  <!-- Artifact items -->
  <text x="60" y="320" fill="#5a5550" font-size="10" font-weight="bold">Artifact</text>
  <text x="250" y="320" fill="#5a5550" font-size="10" font-weight="bold">外觀</text>
  <text x="470" y="320" fill="#5a5550" font-size="10" font-weight="bold">根因</text>
  <text x="670" y="320" fill="#5a5550" font-size="10" font-weight="bold">修正</text>
  <line x1="50" y1="328" x2="750" y2="328" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="60" y="345" fill="#5a5550" font-size="9">White/Black Halo</text>
  <text x="250" y="345" fill="#8a8580" font-size="9">邊緣旁亮/暗帶</text>
  <text x="470" y="345" fill="#8a8580" font-size="9">Gain 過高, Shoot Ctrl 不足</text>
  <text x="670" y="345" fill="#6a8a7a" font-size="9">↓Gain, ↑Shoot Limit</text>
  <text x="60" y="363" fill="#5a5550" font-size="9">Ringing</text>
  <text x="250" y="363" fill="#8a8580" font-size="9">邊緣旁振盪條紋</text>
  <text x="470" y="363" fill="#8a8580" font-size="9">大 Kernel + 高 Gain</text>
  <text x="670" y="363" fill="#6a8a7a" font-size="9">↓Radius, ↓Gain</text>
  <text x="60" y="381" fill="#5a5550" font-size="9">Noise Amplification</text>
  <text x="250" y="381" fill="#8a8580" font-size="9">平坦區顆粒感</text>
  <text x="470" y="381" fill="#8a8580" font-size="9">Coring 不足, NR 不足</text>
  <text x="670" y="381" fill="#6a8a7a" font-size="9">↑Coring, ↑NR, ↓Flat Gain</text>
  <text x="60" y="399" fill="#5a5550" font-size="9">Aliasing Enhancement</text>
  <text x="250" y="399" fill="#8a8580" font-size="9">鋸齒/摩爾紋加劇</text>
  <text x="470" y="399" fill="#8a8580" font-size="9">Nyquist 附近增強過多</text>
  <text x="670" y="399" fill="#6a8a7a" font-size="9">↓高頻 Gain, 加 LPF</text>
</svg><div class="caption">圖 6-23：銳化品質 Debug 流程 — 過度/不足診斷與 Artifact 速查表</div></div>

<h3>常見 Artifact 詳細診斷</h3>

<h4>1. Halo（光暈）</h4>
<p>最常見的銳化 Artifact。表現為高對比邊緣旁的白色（Overshoot）或黑色（Undershoot）帶狀。診斷方式：</p>
<ul>
  <li>用 100% Crop 查看天空與建築交界、文字邊緣等高對比區域</li>
  <li>測量 Overshoot Ratio（> 15% 通常需要修正）</li>
  <li>修正：降低 Gain、收緊 Shoot Control、減小 Radius</li>
</ul>

<h4>2. Ringing（振鈴）</h4>
<p>邊緣旁出現週期性的明暗交替條紋。通常由較大 Kernel 的旁瓣引起。比 Halo 更難處理，因為它是濾波器頻率響應的固有特性。</p>
<ul>
  <li>常見於使用 Laplacian of Gaussian（LoG）或大 Radius USM 的情況</li>
  <li>修正：改用較小 Kernel、降低 Gain、或改用多頻段銳化避免單一大 Kernel</li>
</ul>

<h4>3. Noise Amplification（噪聲放大）</h4>
<p>在平坦區域（天空、白牆）出現明顯的顆粒或斑點。本質上是銳化增強了殘餘噪聲。</p>
<ul>
  <li>在高 ISO 下最嚴重</li>
  <li>修正：提高 Coring Threshold、降低平坦區域的銳化增益、增強 NR 強度</li>
</ul>

<h4>4. Aliasing Enhancement（鋸齒增強）</h4>
<p>原本就存在的 Aliasing（如斜線的鋸齒、重複紋理的摩爾紋）被銳化進一步放大。</p>
<ul>
  <li>銳化增強了接近 Nyquist 頻率的成分，等同於放大了 Aliased 信號</li>
  <li>修正：限制銳化的頻率範圍（不增強最高頻）、或在銳化前加輕微 Anti-aliasing Filter</li>
</ul>

<h3>Debug Workflow</h3>
<p>系統化的銳化 Debug 流程：</p>
<ol>
  <li><strong>首先確認問題不是光學/對焦問題</strong>：關閉銳化後查看原始影像。如果原始影像就很模糊，問題在光學而非銳化</li>
  <li><strong>關閉所有銳化</strong>：確認 NR 後的影像品質是否合理（紋理保留、噪聲水平）</li>
  <li><strong>只開啟基本銳化（低增益、無附加功能）</strong>：確認基本增強效果</li>
  <li><strong>逐步加入功能</strong>：Coring → Shoot Control → Direction → Texture Adaptation，每一步驗證</li>
  <li><strong>ISO 遍歷</strong>：從低 ISO 到高 ISO 逐一檢查</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 Debug 黃金法則</div>
  <p>銳化 Debug 的核心方法是<strong>逐一隔離變因</strong>。永遠不要同時調整多個參數 — 每次只改變一個參數，觀察結果，然後決定下一步。如果同時調整了 Gain 和 Coring，你無法判斷品質改善是因為哪個參數的貢獻。</p>
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  一個非常有用的 Debug 工具是<strong>輸出銳化 Delta Map</strong>：將銳化增強量（Output - Original）乘以 10 倍後顯示為灰階影像。在這個 Map 上，真正的邊緣增強應該表現為沿邊緣的線條，而噪聲放大會表現為隨機斑點。如果 Delta Map 上斑點多於線條，說明 Coring 不足或 NR 不足。大部分 ISP 都支持將中間結果輸出到 Debug Port，善用這個功能可以大幅加速 Debug 效率。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  銳化品質評估必須在<strong>最終輸出格式</strong>下進行。如果最終輸出是 JPEG，JPEG 壓縮的量化步驟會與銳化交互作用 — 高銳化增益會增加 JPEG 的高頻係數，導致壓縮率下降或品質劣化。評估時應使用與產品一致的 JPEG QF 設定。如果評估用的是 RAW→BMP 但產品輸出是 JPEG，結論可能不適用。
</div>
`,
      keyPoints: [
        "SFR/MTF 是銳化效果的首要量化指標，使用 Slanted Edge 方法測量",
        "Overshoot Ratio 直接衡量 Halo 嚴重程度，手機 <15%、車用 <5%",
        "Dead Leaves Texture MTF 評估 NR+銳化聯合效果的紋理保留/增強",
        "四大常見 Artifact：Halo、Ringing、Noise Amplification、Aliasing Enhancement",
        "Debug 流程核心：逐一隔離變因，善用 Delta Map 視覺化銳化效果"
      ]
    },
    {
      id: "ch6_24",
      title: "進階銳化技術：AI-based Sharpening 與 Super-Resolution",
      content: `
<h3>傳統銳化的極限</h3>
<p>無論多麼精心設計的傳統銳化演算法（USM、多頻段、Edge-directed），都受限於一個基本物理事實：<strong>銳化無法恢復不存在的資訊</strong>。如果某個紋理細節因為光學模糊或 Sensor 取樣而完全消失（在 Nyquist 頻率以上），傳統銳化只能增強殘餘的對比，無法從無中創造新的細節。</p>

<p>近年來，<strong>AI-based Sharpening 和 Super-Resolution（SR）</strong>技術打破了這個限制。基於深度學習的模型可以從大量影像中「學習」高頻紋理的統計規律，在推論（Inference）時根據低解析度輸入「合成」出合理的高頻細節。雖然這些合成細節不是光學意義上的「恢復」，但在視覺上可以顯著提升影像的主觀銳度和細節感。</p>

<h3>主要 AI Super-Resolution 架構</h3>

<h4>SRCNN (Super-Resolution CNN)</h4>
<p>最早的 SR 深度學習架構（2014）。由 3 個卷積層組成：Patch Extraction → Non-linear Mapping → Reconstruction。模型極小（約 57K 參數），但品質相對於後續架構較弱。在 ISP 硬體中是<strong>最容易實現的 AI SR</strong>，可以用小型固定功能 CNN 加速器實現。</p>

<h4>ESPCN (Efficient Sub-Pixel CNN)</h4>
<p>改進方案（2016），關鍵創新是在低解析度空間做所有卷積運算（減少運算量），最後用 <strong>Sub-pixel Shuffle（Pixel Shuffle）</strong>上採樣到高解析度。對於 2× SR，Sub-pixel Shuffle 將每個低解析度像素的多個通道重新排列為 2×2 高解析度塊。運算量約為 SRCNN 在高解析度空間運算的 1/4。</p>

<h4>Real-ESRGAN</h4>
<p>面向真實世界退化（非理想 Bicubic 下採樣）的 SR 模型（2021）。使用 RRDB（Residual-in-Residual Dense Block）作為骨幹網路，搭配 GAN（Generative Adversarial Network）訓練產生更自然的紋理。模型較大（約 16M 參數），通常需要 GPU 或高效能 NPU。</p>

<h3>硬體加速：NPU / DSP</h3>
<p>AI-based Sharpening 在 ISP 中的部署面臨<strong>巨大的運算挑戰</strong>。即使是最輕量的 SRCNN，處理 4K 影像也需要數十億次 MAC 運算。傳統 ISP 的 Fixed-function Pipeline 無法執行 CNN 推論，需要額外的<strong>神經網路加速器（NPU）</strong>或<strong>數位信號處理器（DSP）</strong>：</p>

<table>
  <tr><th>加速器類型</th><th>典型算力</th><th>適用模型大小</th><th>功耗</th><th>延遲</th></tr>
  <tr><td>Small NPU (ISP 內建)</td><td>0.5-2 TOPS</td><td>SRCNN-like (< 100K params)</td><td>< 100 mW</td><td>1-5 ms/frame</td></tr>
  <tr><td>Medium NPU (SoC 級)</td><td>2-10 TOPS</td><td>ESPCN-like (< 1M params)</td><td>200-500 mW</td><td>5-15 ms/frame</td></tr>
  <tr><td>Large NPU / GPU</td><td>10-50+ TOPS</td><td>Real-ESRGAN (10M+ params)</td><td>1-5 W</td><td>15-50 ms/frame</td></tr>
  <tr><td>Fixed-function CNN</td><td>Model-specific</td><td>固定架構 (不可重配)</td><td>< 50 mW</td><td>< 1 ms/frame</td></tr>
</table>

<div class="diagram"><svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="440" fill="#f5f0eb" rx="8"/>
  <text x="400" y="28" fill="#5a5550" font-size="15" font-weight="bold" text-anchor="middle">AI Sharpening Pipeline 與 NPU 加速器整合</text>
  <defs><marker id="arrowM24" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#5a5550"/></marker></defs>
  <!-- ISP Pipeline (top) -->
  <rect x="20" y="50" width="760" height="55" rx="4" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="400" y="68" fill="#6a8a7a" font-size="11" font-weight="bold" text-anchor="middle">ISP Pipeline (Fixed-Function Hardware)</text>
  <!-- Pipeline stages -->
  <rect x="35" y="78" width="65" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="67" y="92" fill="#5a5550" font-size="8" text-anchor="middle">Demosaic</text>
  <rect x="110" y="78" width="45" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="132" y="92" fill="#5a5550" font-size="8" text-anchor="middle">WB</text>
  <rect x="165" y="78" width="45" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="187" y="92" fill="#5a5550" font-size="8" text-anchor="middle">CCM</text>
  <rect x="220" y="78" width="55" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="247" y="92" fill="#5a5550" font-size="8" text-anchor="middle">Gamma</text>
  <rect x="285" y="78" width="45" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="307" y="92" fill="#5a5550" font-size="8" text-anchor="middle">NR</text>
  <rect x="340" y="78" width="80" height="20" rx="3" fill="#6a8a7a" opacity="0.25" stroke="#6a8a7a" stroke-width="1"/>
  <text x="380" y="92" fill="#5a5550" font-size="8" text-anchor="middle">Classical Sharp</text>
  <rect x="430" y="78" width="60" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="460" y="92" fill="#5a5550" font-size="8" text-anchor="middle">Color Enh</text>
  <rect x="500" y="78" width="55" height="20" rx="3" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="527" y="92" fill="#5a5550" font-size="8" text-anchor="middle">Scaler</text>
  <!-- DMA / Memory interface -->
  <rect x="250" y="125" width="300" height="35" rx="4" fill="none" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="400" y="147" fill="#5a5550" font-size="10" text-anchor="middle">DRAM / Frame Buffer (DDR Interface)</text>
  <line x1="380" y1="105" x2="380" y2="125" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM24)"/>
  <text x="365" y="118" fill="#8a8580" font-size="7">write</text>
  <line x1="420" y1="125" x2="420" y2="105" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM24)"/>
  <text x="435" y="118" fill="#8a8580" font-size="7">read</text>
  <!-- NPU Block -->
  <line x1="400" y1="160" x2="400" y2="185" stroke="#5a5550" stroke-width="1.5" marker-end="url(#arrowM24)"/>
  <rect x="200" y="190" width="400" height="130" rx="6" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="400" y="212" fill="#6a8a7a" font-size="12" font-weight="bold" text-anchor="middle">NPU / AI Accelerator</text>
  <line x1="220" y1="220" x2="580" y2="220" stroke="#d5cec7" stroke-width="0.5"/>
  <!-- NPU internals -->
  <rect x="220" y="230" width="100" height="40" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="270" y="248" fill="#5a5550" font-size="9" text-anchor="middle">MAC Array</text>
  <text x="270" y="262" fill="#8a8580" font-size="7" text-anchor="middle">256-1024 MACs</text>
  <rect x="335" y="230" width="80" height="40" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="375" y="248" fill="#5a5550" font-size="9" text-anchor="middle">Activation</text>
  <text x="375" y="262" fill="#8a8580" font-size="7" text-anchor="middle">ReLU / PReLU</text>
  <rect x="430" y="230" width="80" height="40" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="470" y="248" fill="#5a5550" font-size="9" text-anchor="middle">Weight Buf</text>
  <text x="470" y="262" fill="#8a8580" font-size="7" text-anchor="middle">On-chip SRAM</text>
  <rect x="220" y="280" width="100" height="30" rx="4" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="270" y="299" fill="#5a5550" font-size="8" text-anchor="middle">Data Tiling Engine</text>
  <rect x="335" y="280" width="80" height="30" rx="4" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="375" y="299" fill="#5a5550" font-size="8" text-anchor="middle">Pixel Shuffle</text>
  <rect x="430" y="280" width="80" height="30" rx="4" fill="#6a8a7a" opacity="0.1" stroke="none"/>
  <text x="470" y="299" fill="#5a5550" font-size="8" text-anchor="middle">DMA Ctrl</text>
  <!-- Hybrid pipeline -->
  <rect x="30" y="345" width="740" height="75" rx="6" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="400" y="365" fill="#5a5550" font-size="11" font-weight="bold" text-anchor="middle">Hybrid Classical + AI Sharpening Pipeline</text>
  <!-- Pipeline flow -->
  <rect x="50" y="380" width="80" height="28" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#d5cec7" stroke-width="1"/>
  <text x="90" y="398" fill="#5a5550" font-size="8" text-anchor="middle">NR Output</text>
  <line x1="130" y1="394" x2="150" y2="394" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM24)"/>
  <rect x="155" y="380" width="100" height="28" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="205" y="398" fill="#5a5550" font-size="8" text-anchor="middle">Classical Sharp</text>
  <line x1="255" y1="394" x2="275" y2="394" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM24)"/>
  <rect x="280" y="380" width="100" height="28" rx="4" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="330" y="398" fill="#5a5550" font-size="8" text-anchor="middle">AI Enhancement</text>
  <line x1="380" y1="394" x2="400" y2="394" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM24)"/>
  <rect x="405" y="380" width="80" height="28" rx="4" fill="none" stroke="#d5cec7" stroke-width="1"/>
  <text x="445" y="398" fill="#5a5550" font-size="8" text-anchor="middle">Blending α</text>
  <line x1="485" y1="394" x2="505" y2="394" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowM24)"/>
  <rect x="510" y="380" width="80" height="28" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="550" y="398" fill="#5a5550" font-size="8" text-anchor="middle">Final Output</text>
  <!-- Alpha blending annotation -->
  <text x="600" y="398" fill="#8a8580" font-size="8">Out = α×AI + (1-α)×Classical</text>
</svg><div class="caption">圖 6-24：AI Sharpening Pipeline — ISP + NPU 整合與混合銳化架構</div></div>

<h3>Hybrid Classical + AI Sharpening</h3>
<p>在現實的 ISP 產品中，純 AI 銳化面臨算力和延遲的限制。最實用的方案是<strong>混合架構（Hybrid）</strong>：</p>

<ol>
  <li><strong>Classical Sharpening</strong> 作為基礎層，在 ISP Fixed-function Pipeline 中即時處理，提供基本的邊緣增強</li>
  <li><strong>AI Enhancement</strong> 作為增強層，在 NPU 上以較低幀率（如 15fps）或較低解析度處理，提供紋理細節補充</li>
  <li><strong>Blending</strong>：將 AI 增強的結果與 Classical 結果混合，混合比例 α 可以根據場景/ISO/電池狀態動態調整</li>
</ol>

<div class="formula">Final = α × AI_Enhanced + (1-α) × Classical_Sharpened, 0 ≤ α ≤ 1</div>

<p>這種設計的優勢：</p>
<ul>
  <li>Classical Sharpening 保證了<strong>最低品質保障</strong>（即使 NPU 繁忙或 AI 模型故障）</li>
  <li>AI Enhancement 在算力允許時提供<strong>額外的品質提升</strong></li>
  <li>可以根據電池/溫度/工作負載動態調整 α，實現功耗/品質的靈活權衡</li>
</ul>

<h3>Digital Zoom 與 AI Super-Resolution</h3>
<p>AI SR 在手機相機中最成功的應用是<strong>Digital Zoom（數位變焦）</strong>。當用戶進行 2×、5×、10× 數位變焦時，相當於裁剪影像中心區域再放大。傳統放大（Bilinear / Bicubic Interpolation）只是平滑地插值像素，無法增加真實細節。AI SR 可以「合成」合理的紋理細節，使放大後的影像看起來更清晰自然。</p>

<p>典型的 Digital Zoom AI SR Pipeline：</p>
<ol>
  <li>從 Full Resolution 影像中裁剪 ROI（Region of Interest）</li>
  <li>ISP 正常處理（Demosaic、NR、Classical Sharpening）</li>
  <li>將裁剪區域傳入 NPU，執行 2× 或 4× AI SR</li>
  <li>與 Bicubic 上採樣結果混合（漸進式提升，避免 AI Artifact 過於明顯）</li>
</ol>

<h3>運算成本與即時可行性分析</h3>
<p>AI SR 的運算成本是實際部署的最大挑戰：</p>

<div class="info-box key">
  <div class="box-title">🔑 運算量分析</div>
  <table>
    <tr><th>模型</th><th>參數量</th><th>4K 單幀 MACs</th><th>@30fps 所需算力</th><th>適用場景</th></tr>
    <tr><td>SRCNN (3層)</td><td>57K</td><td>~52 GMACs</td><td>~1.6 TOPS</td><td>Always-on ISP 增強</td></tr>
    <tr><td>ESPCN (4層)</td><td>~100K</td><td>~12 GMACs (低解析度)</td><td>~0.4 TOPS</td><td>2× Digital Zoom</td></tr>
    <tr><td>Lightweight SR</td><td>~500K</td><td>~200 GMACs</td><td>~6 TOPS</td><td>高品質 Zoom</td></tr>
    <tr><td>Real-ESRGAN</td><td>16.7M</td><td>~4500 GMACs</td><td>~135 TOPS</td><td>離線處理 / Cloud</td></tr>
  </table>
  <p>可以看到，只有最輕量的模型（SRCNN、ESPCN）能在 ISP 內建的小型 NPU 上實現 4K@30fps 即時處理。中等複雜度的模型需要 SoC 級 NPU，而大型模型則僅適合離線後處理或雲端。</p>
</div>

<h3>AI Sharpening 的挑戰與風險</h3>
<p>AI-based Sharpening 雖然潛力巨大，但在量產 ISP 產品中仍面臨諸多挑戰：</p>

<ul>
  <li><strong>Hallucination（幻覺）</strong>：AI 模型可能生成不存在的紋理細節。在消費級攝影中可接受，但在車用/醫療影像中絕對不可接受</li>
  <li><strong>一致性（Temporal Consistency）</strong>：連續幀之間 AI 增強的結果可能不一致，在錄影中表現為閃爍（Flickering）</li>
  <li><strong>Domain Shift</strong>：訓練資料與實際場景的差異導致模型在某些場景表現不佳（如特殊紋理、異常光照）</li>
  <li><strong>定點量化</strong>：NPU 通常使用 INT8 甚至 INT4 運算，模型的量化精度損失需要仔細管理</li>
  <li><strong>功耗與散熱</strong>：NPU 運算帶來額外的功耗和發熱，在手機/車用場景中需要嚴格控制</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意</div>
  在車用（ADAS/AD）場景中，AI Super-Resolution 的使用必須極度謹慎。AI 合成的紋理細節可能欺騙感知演算法 — 例如 AI 可能在模糊的遠場「合成」出一個不存在的行人輪廓，導致假陽性（False Positive）偵測。在安全關鍵的應用中，AI SR 應該限於<strong>顯示路徑</strong>，ADAS 路徑仍應使用傳統處理。
</div>

<div class="info-box tip">
  <div class="box-title">💡 提示</div>
  對於想要在 ISP 中嘗試 AI Sharpening 的工程師，建議從最簡單的架構開始：一個 3 層 CNN（如 SRCNN），使用 3×3 Convolution，通道數限制在 16-32，INT8 量化。這樣的模型可以在 ISP 旁的小型 CNN 加速器（< 1 TOPS）上即時運行，面積 < 0.5mm² @ 7nm。先驗證品質提升是否達到預期，再考慮升級到更大的模型。
</div>
`,
      keyPoints: [
        "AI Super-Resolution 可以「合成」傳統銳化無法恢復的高頻紋理細節",
        "SRCNN / ESPCN 是最輕量的 AI SR 架構，可在小型 NPU 上即時運行",
        "Hybrid Classical + AI 混合架構是最實用的產品方案，提供品質保障和彈性",
        "Digital Zoom 是 AI SR 在手機 ISP 中最成功的應用場景",
        "AI Sharpening 面臨 Hallucination、Temporal Consistency、功耗等挑戰，車用場景需格外謹慎"
      ]
    }
  ]
};
