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
  <!-- No coring (identity) -->
  <line x1="120" y1="278" x2="480" y2="62" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="6,4"/>
  <!-- Hard coring -->
  <path d="M120,170 L230,170 L230,106 L300,170" fill="none" stroke="#c4a064" stroke-width="2.5"/>
  <path d="M300,170 L370,234 L370,170 L480,170" fill="none" stroke="#c4a064" stroke-width="2.5"/>
  <!-- Wait, that's wrong. Let me redo hard coring properly -->
  <!-- Hard coring: output=0 for |d|<T, output=d for |d|>=T -->
  <!-- Left side: d goes from negative to positive along x-axis, centered at 300 -->
  <!-- T threshold at about x=230 (left) and x=370 (right) -->
  <line x1="120" y1="170" x2="230" y2="170" stroke="#c4a064" stroke-width="2.5"/>
  <line x1="370" y1="170" x2="480" y2="170" stroke="none"/>
  <!-- at x=230 (d=-T), hard jump to the diagonal -->
  <line x1="230" y1="170" x2="230" y2="212" stroke="#c4a064" stroke-width="2.5"/>
  <line x1="230" y1="212" x2="120" y2="278" stroke="#c4a064" stroke-width="2.5"/>
  <!-- right side -->
  <line x1="300" y1="170" x2="370" y2="170" stroke="#c4a064" stroke-width="2.5"/>
  <line x1="370" y1="170" x2="370" y2="128" stroke="#c4a064" stroke-width="2.5"/>
  <line x1="370" y1="128" x2="480" y2="62" stroke="#c4a064" stroke-width="2.5"/>
  <!-- Soft coring -->
  <path d="M120,265 C180,240 220,180 240,172 Q270,168 300,170 Q330,168 360,172 C380,180 420,240 480,75" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Threshold markers -->
  <line x1="230" y1="165" x2="230" y2="175" stroke="#8a8580" stroke-width="1"/>
  <text x="230" y="188" fill="#8a8580" font-size="10" text-anchor="middle">−T</text>
  <line x1="370" y1="165" x2="370" y2="175" stroke="#8a8580" stroke-width="1"/>
  <text x="370" y="188" fill="#8a8580" font-size="10" text-anchor="middle">+T</text>
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
    }
  ]
};
