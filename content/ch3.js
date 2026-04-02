const CH3 = {
  title: "降噪 NR",
  sections: [
    {
      id: "ch3_1",
      title: "噪聲的本質：Shot Noise、Read Noise、Thermal Noise",
      content: `
<p>在數位影像系統中，噪聲（Noise）是不可避免的訊號干擾，它直接影響影像品質。要設計有效的降噪演算法，首先必須深入理解噪聲的物理來源。影像感測器（Image Sensor）在光電轉換（Photoelectric Conversion）過程中，各個環節都會引入不同類型的噪聲。根據物理成因，主要可分為三大類：Shot Noise（散粒噪聲）、Read Noise（讀取噪聲）與 Thermal Noise（熱噪聲）。</p>

<div class="diagram">
<svg viewBox="0 0 750 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Background -->
  <rect width="750" height="420" fill="#f5f0eb" rx="8"/>

  <!-- Title -->
  <text x="375" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#5a5550">影像感測器噪聲來源示意圖</text>

  <!-- Photon source -->
  <rect x="30" y="60" width="120" height="50" rx="6" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="90" y="90" text-anchor="middle" font-size="13" fill="#5a5550">光子 Photons</text>

  <!-- Arrows from photon -->
  <line x1="150" y1="85" x2="200" y2="85" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowG)"/>

  <!-- Photodiode -->
  <rect x="200" y="55" width="140" height="60" rx="6" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="270" y="80" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">Photodiode</text>
  <text x="270" y="96" text-anchor="middle" font-size="10" fill="#8a8580">光電轉換</text>

  <!-- Shot Noise label -->
  <rect x="180" y="135" width="180" height="70" rx="6" fill="#fff3e0" stroke="#e8a04a" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="270" y="157" text-anchor="middle" font-size="12" font-weight="bold" fill="#e8a04a">⚡ Shot Noise</text>
  <text x="270" y="173" text-anchor="middle" font-size="10" fill="#5a5550">光子到達的統計波動</text>
  <text x="270" y="189" text-anchor="middle" font-size="10" fill="#8a8580">Poisson 分佈 σ² = μ</text>
  <line x1="270" y1="115" x2="270" y2="135" stroke="#e8a04a" stroke-width="1.5" stroke-dasharray="3,2"/>

  <!-- Arrow to charge storage -->
  <line x1="340" y1="85" x2="390" y2="85" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowG)"/>

  <!-- Charge Storage -->
  <rect x="390" y="55" width="120" height="60" rx="6" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="450" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">電荷儲存</text>
  <text x="450" y="96" text-anchor="middle" font-size="10" fill="#8a8580">Charge Storage</text>

  <!-- Thermal Noise label -->
  <rect x="370" y="135" width="160" height="70" rx="6" fill="#fce4ec" stroke="#d35050" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="450" y="157" text-anchor="middle" font-size="12" font-weight="bold" fill="#d35050">🌡 Thermal Noise</text>
  <text x="450" y="173" text-anchor="middle" font-size="10" fill="#5a5550">暗電流隨溫度增加</text>
  <text x="450" y="189" text-anchor="middle" font-size="10" fill="#8a8580">Dark Current ∝ e^(−Eg/kT)</text>
  <line x1="450" y1="115" x2="450" y2="135" stroke="#d35050" stroke-width="1.5" stroke-dasharray="3,2"/>

  <!-- Arrow to readout -->
  <line x1="510" y1="85" x2="560" y2="85" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowG)"/>

  <!-- Readout Circuit -->
  <rect x="560" y="55" width="150" height="60" rx="6" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="635" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">讀取電路</text>
  <text x="635" y="96" text-anchor="middle" font-size="10" fill="#8a8580">Readout + ADC</text>

  <!-- Read Noise label -->
  <rect x="555" y="135" width="160" height="70" rx="6" fill="#e8eaf6" stroke="#5060b0" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="635" y="157" text-anchor="middle" font-size="12" font-weight="bold" fill="#5060b0">📡 Read Noise</text>
  <text x="635" y="173" text-anchor="middle" font-size="10" fill="#5a5550">放大器與量化噪聲</text>
  <text x="635" y="189" text-anchor="middle" font-size="10" fill="#8a8580">Gaussian 分佈 σ_read</text>
  <line x1="635" y1="115" x2="635" y2="135" stroke="#5060b0" stroke-width="1.5" stroke-dasharray="3,2"/>

  <!-- Output -->
  <rect x="300" y="240" width="180" height="45" rx="6" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="390" y="267" text-anchor="middle" font-size="13" font-weight="bold" fill="#5a5550">RAW 數位訊號 = S + N</text>

  <!-- Convergence arrows -->
  <line x1="270" y1="205" x2="350" y2="240" stroke="#8a8580" stroke-width="1.2"/>
  <line x1="450" y1="205" x2="390" y2="240" stroke="#8a8580" stroke-width="1.2"/>
  <line x1="635" y1="205" x2="440" y2="240" stroke="#8a8580" stroke-width="1.2"/>

  <!-- Noise magnitude comparison -->
  <text x="375" y="315" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">各噪聲量級比較（典型值）</text>

  <!-- Bar chart -->
  <rect x="120" y="335" width="200" height="25" rx="3" fill="#e8a04a" opacity="0.7"/>
  <text x="115" y="352" text-anchor="end" font-size="11" fill="#5a5550">Shot Noise</text>
  <text x="330" y="352" font-size="10" fill="#5a5550">~√N photons（訊號相關）</text>

  <rect x="120" y="368" width="80" height="25" rx="3" fill="#5060b0" opacity="0.7"/>
  <text x="115" y="385" text-anchor="end" font-size="11" fill="#5a5550">Read Noise</text>
  <text x="210" y="385" font-size="10" fill="#5a5550">~2-5 e⁻（固定）</text>

  <rect x="120" y="401" width="50" height="12" rx="3" fill="#d35050" opacity="0.7"/>
  <text x="115" y="411" text-anchor="end" font-size="11" fill="#5a5550">Thermal</text>
  <text x="180" y="411" font-size="10" fill="#5a5550">~0.5-2 e⁻/s（溫度相關）</text>

  <defs>
    <marker id="arrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/>
    </marker>
  </defs>
</svg>
<div class="caption">圖 3-1：影像感測器中三大噪聲來源及其物理位置示意圖</div>
</div>

<h3>Shot Noise（散粒噪聲）</h3>
<p>Shot Noise 是最基本且無法消除的噪聲來源，其根源在於光的量子性質。光子到達感測器的過程是離散的隨機事件，即使在完全均勻的光照條件下，每個曝光期間被 Photodiode 捕捉到的光子數量也會有統計波動。這個過程遵循 Poisson Distribution（泊松分佈），其重要特性是變異數等於期望值：</p>

<div class="formula">σ²_shot = μ_signal（單位：electron count）</div>

<p>這意味著 Shot Noise 的標準差為 σ = √μ，即訊號越強、噪聲的絕對值越大，但 Signal-to-Noise Ratio（SNR）反而改善，因為 SNR = μ/σ = √μ。這就是為什麼高光區域看起來「乾淨」而暗部區域充滿噪點的物理原因。在典型手機感測器中，若一個 Pixel 在某曝光下收集到 10,000 個電子，Shot Noise 的標準差約為 100 個電子，SNR 約為 40 dB。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>Shot Noise 是一種 Signal-Dependent Noise（訊號相關噪聲），其大小與訊號本身的平方根成正比。這是所有降噪演算法必須考慮的關鍵特性，也是為何專業降噪系統需要進行 Variance-Stabilizing Transform（如 Anscombe Transform）的根本原因。</p>
</div>

<h3>Read Noise（讀取噪聲）</h3>
<p>Read Noise 來自感測器的讀取電路，包括 Source Follower Amplifier 的熱噪聲、1/f Noise（Flicker Noise）、以及 ADC（Analog-to-Digital Converter）的量化噪聲。Read Noise 是 Signal-Independent（訊號無關）的，其統計特性近似 Gaussian Distribution：</p>

<div class="formula">n_read ~ N(0, σ²_read)</div>

<p>現代 CMOS 感測器的 Read Noise 已大幅降低。傳統 CCD 時代的 Read Noise 可能高達 20-50 electrons，而現代 BSI（Back-Side Illumination）CMOS 感測器的 Read Noise 可低至 1-3 electrons rms。有些先進的 Stacked CMOS 設計甚至聲稱達到 sub-electron 級別的 Read Noise，實現所謂的 Photon-Counting 能力。</p>

<p>Read Noise 中特別值得注意的是 1/f Noise（又稱 Flicker Noise），其功率譜密度與頻率成反比。在低頻端，1/f Noise 會導致 Column FPN（Fixed Pattern Noise），這在影像中表現為垂直條紋。現代感測器通常使用 CDS（Correlated Double Sampling）技術來有效抑制 Reset Noise（kTC Noise）以及部分低頻噪聲。</p>

<h3>Thermal Noise（熱噪聲）/ Dark Current Noise</h3>
<p>Thermal Noise 主要以 Dark Current 的形式表現。即使在完全黑暗的環境中，感測器的矽基材料也會因熱激發而產生電子-電洞對，這些暗電流（Dark Current）會與光生電流疊加，增加噪聲。Dark Current 與溫度的關係遵循 Arrhenius 方程：</p>

<div class="formula">I_dark ∝ T^(3/2) · exp(−E_g / 2kT)</div>

<p>其中 E_g 是矽的能隙（~1.12 eV），k 是 Boltzmann 常數，T 是絕對溫度。溫度每升高約 6-8°C，Dark Current 大約增加一倍。在典型的手機使用場景中（~40°C sensor temperature），Dark Current 通常產生 0.5 到數個 e⁻/pixel/s 的噪聲。對於長曝光或高溫場景，Dark Current 可以成為主導噪聲源。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在工程實務中，Dark Current 的影響可透過以下方式緩解：(1) 縮短曝光時間、(2) 降低感測器溫度（天文相機常使用 TEC 冷卻）、(3) 拍攝 Dark Frame 後進行減法校正。手機 ISP 通常在 Noise Profile 中將 Dark Current 的影響與其他噪聲源合併建模。</p>
</div>

<h3>其他噪聲源</h3>
<p>除了上述三大主要噪聲外，實務中還需考慮：<strong>Quantization Noise</strong>（ADC 位數不足時引入）、<strong>Banding Noise</strong>（電源干擾或電路串擾造成的行/列條紋）、<strong>PRNU</strong>（Photo Response Non-Uniformity，像素間靈敏度差異造成的固定圖案噪聲）、以及 <strong>DSNU</strong>（Dark Signal Non-Uniformity，暗電流的空間不均勻性）。理解這些噪聲的性質是設計高效降噪演算法的基石。</p>
`
    },
    {
      id: "ch3_2",
      title: "噪聲模型：Poisson-Gaussian Model",
      content: `
<p>在前一節我們瞭解了噪聲的物理來源，本節將建立數學模型來描述影像噪聲的統計特性。一個準確的噪聲模型（Noise Model）是一切降噪演算法的基礎，它決定了演算法如何估計噪聲強度、如何區分訊號與噪聲、以及如何根據訊號強度自適應調整降噪參數。</p>

<div class="diagram">
<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="700" height="400" fill="#f5f0eb" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">Signal-Dependent Noise Variance 曲線</text>

  <!-- Axes -->
  <line x1="80" y1="330" x2="650" y2="330" stroke="#5a5550" stroke-width="2"/>
  <line x1="80" y1="330" x2="80" y2="50" stroke="#5a5550" stroke-width="2"/>

  <!-- X axis label -->
  <text x="365" y="365" text-anchor="middle" font-size="13" fill="#5a5550">Signal Level μ (DN)</text>
  <!-- Y axis label -->
  <text x="25" y="190" text-anchor="middle" font-size="13" fill="#5a5550" transform="rotate(-90,25,190)">Noise Variance σ²</text>

  <!-- X ticks -->
  <text x="80" y="350" text-anchor="middle" font-size="10" fill="#8a8580">0</text>
  <text x="230" y="350" text-anchor="middle" font-size="10" fill="#8a8580">256</text>
  <text x="380" y="350" text-anchor="middle" font-size="10" fill="#8a8580">512</text>
  <text x="530" y="350" text-anchor="middle" font-size="10" fill="#8a8580">768</text>
  <text x="650" y="350" text-anchor="middle" font-size="10" fill="#8a8580">1023</text>

  <!-- Poisson-Gaussian combined line (σ² = a·μ + b) -->
  <path d="M80,280 Q200,230 300,185 Q400,145 500,110 Q580,85 650,65" fill="none" stroke="#6a8a7a" stroke-width="3"/>
  <text x="600" y="55" font-size="12" font-weight="bold" fill="#6a8a7a">σ² = aμ + b</text>
  <text x="600" y="70" font-size="10" fill="#6a8a7a">(Poisson-Gaussian)</text>

  <!-- Pure Poisson component -->
  <path d="M80,320 Q200,270 300,210 Q400,155 500,105 Q580,72 650,42" fill="none" stroke="#e8a04a" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="550" y="38" font-size="11" fill="#e8a04a">aμ (Shot)</text>

  <!-- Read noise floor -->
  <line x1="80" y1="280" x2="650" y2="280" stroke="#5060b0" stroke-width="2" stroke-dasharray="4,3"/>
  <text x="590" y="295" font-size="11" fill="#5060b0">b (Read Noise)</text>

  <!-- Annotations -->
  <rect x="100" y="55" width="200" height="90" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="110" y="75" font-size="12" font-weight="bold" fill="#5a5550">Noise Level Function (NLF)</text>
  <text x="110" y="95" font-size="11" fill="#6a8a7a">σ²(μ) = a · μ + b</text>
  <text x="110" y="112" font-size="10" fill="#8a8580">a = gain × quantum efficiency</text>
  <text x="110" y="127" font-size="10" fill="#8a8580">b = σ²_read (read noise floor)</text>

  <!-- Dark region annotation -->
  <rect x="85" y="220" width="90" height="50" rx="4" fill="#fce4ec" opacity="0.7" stroke="#d35050" stroke-width="1"/>
  <text x="130" y="240" text-anchor="middle" font-size="10" font-weight="bold" fill="#d35050">暗部</text>
  <text x="130" y="255" text-anchor="middle" font-size="9" fill="#d35050">Read Noise 主導</text>

  <!-- Bright region annotation -->
  <rect x="490" y="125" width="90" height="50" rx="4" fill="#fff3e0" opacity="0.7" stroke="#e8a04a" stroke-width="1"/>
  <text x="535" y="145" text-anchor="middle" font-size="10" font-weight="bold" fill="#e8a04a">亮部</text>
  <text x="535" y="160" text-anchor="middle" font-size="9" fill="#e8a04a">Shot Noise 主導</text>

  <!-- Data scatter points -->
  <circle cx="120" cy="270" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="145" cy="258" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="170" cy="245" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="200" cy="238" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="240" cy="218" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="280" cy="198" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="320" cy="180" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="360" cy="158" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="400" cy="142" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="440" cy="125" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="480" cy="112" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="520" cy="100" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="560" cy="85" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="600" cy="75" r="3" fill="#8a8580" opacity="0.5"/>
  <circle cx="630" cy="68" r="3" fill="#8a8580" opacity="0.5"/>
</svg>
<div class="caption">圖 3-2：Noise Level Function (NLF) 曲線 — 噪聲變異數隨訊號強度線性增長</div>
</div>

<h3>基本噪聲觀測模型</h3>
<p>一張含噪影像可表示為乾淨訊號加上噪聲：</p>
<div class="formula">y = x + n(x)</div>
<p>其中 y 是觀測到的含噪像素值，x 是真實無噪訊號，n(x) 是噪聲。關鍵在於 n(x) 不是一個簡單的常數或均勻分佈，它與訊號 x 本身密切相關。</p>

<h3>Poisson-Gaussian 混合模型</h3>
<p>結合 Shot Noise 的 Poisson 特性和 Read Noise 的 Gaussian 特性，感測器的總噪聲可用 Poisson-Gaussian 混合模型精確描述。設光子轉換後的電子數 n_e 服從 Poisson 分佈，讀出後加上 Gaussian Read Noise，經過類比增益 g 和 ADC 數位化後，最終的 RAW 像素值為：</p>

<div class="formula">y = g · Poisson(x/g) + N(0, σ²_read)</div>

<p>對於足夠大的訊號值（通常 &gt; 10 photons），Poisson 分佈可近似為 Gaussian 分佈，此時總噪聲變異數可表示為一個關於訊號均值的簡潔線性函數：</p>

<div class="formula">σ²(μ) = a · μ + b</div>

<p>其中 a 和 b 是兩個與感測器和 ISO 設定相關的參數：</p>
<ul>
  <li><strong>a（斜率）</strong>：代表 Shot Noise 的增益因子，a = g（系統增益，單位 DN/e⁻）。高 ISO 時 g 增大，a 隨之增大。</li>
  <li><strong>b（截距）</strong>：代表 Read Noise 的變異數在 DN 域中的值，b = g² · σ²_read_e。高 ISO 時 b 也增大。</li>
</ul>

<p>這個線性關係就是著名的 <strong>Noise Level Function (NLF)</strong>，也稱為 <strong>Photon Transfer Curve (PTC)</strong> 在 variance 域的表現。它是 ISP 降噪系統中最核心的噪聲描述工具。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>NLF 的線性特性 σ²(μ) = aμ + b 是整個降噪系統的數學基石。參數 (a, b) 完全描述了特定 ISO/增益設定下的噪聲行為。降噪演算法通過查詢 NLF 來確定每個像素位置的噪聲強度，從而實現自適應降噪。</p>
</div>

<h3>異質方差與 Variance-Stabilizing Transform (VST)</h3>
<p>由於噪聲變異數與訊號相關（Heteroscedastic），直接套用假設同質方差（Homoscedastic）的降噪演算法（如 BM3D、Wavelet Thresholding）會導致次優結果。解決方案是先進行 Variance-Stabilizing Transform，將異質方差噪聲轉換為近似均勻方差的噪聲。</p>

<p>最經典的 VST 是 <strong>Anscombe Transform</strong>，適用於純 Poisson 噪聲：</p>
<div class="formula">f(y) = 2√(y + 3/8)</div>

<p>對於 Poisson-Gaussian 混合模型，使用 <strong>Generalized Anscombe Transform (GAT)</strong>：</p>
<div class="formula">f(y) = (2/a) · √(a·y + (3/8)a² + b)</div>

<p>經過 GAT 轉換後，噪聲近似為單位方差的 Gaussian 噪聲，可以直接使用任何 AWGN（Additive White Gaussian Noise）降噪器。降噪完成後，再用 Inverse GAT 轉換回原始域。</p>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>實務流程：(1) 從 Noise Calibration 獲得參數 (a, b)；(2) 對 RAW/YUV 資料施加 GAT；(3) 使用 BM3D 等假設均勻高斯噪聲的演算法降噪；(4) 施加 Inverse GAT 還原。在某些高效實現中，降噪器直接在原始域操作，通過 NLF 查表動態調整局部降噪強度，省去 VST 步驟。</p>
</div>

<h3>多通道噪聲模型</h3>
<p>在 Bayer RAW 域中，不同色彩通道（R, Gr, Gb, B）的噪聲參數 (a, b) 可能不同。這是因為：(1) 不同顏色的 Color Filter 透光率不同，導致有效量子效率不同；(2) White Balance 增益對各通道的放大倍率不同。因此，精確的噪聲模型需要為每個 Bayer 通道分別標定 NLF 參數。</p>

<p>在 YUV 域中，由於 Color Space Conversion 的混合效應，Y/Cb/Cr 通道的噪聲特性也各不相同。Y 通道包含最多的訊號資訊和 Shot Noise，而 Cb/Cr 色度通道的噪聲往往更容易被感知，需要更強的降噪處理。</p>

<h3>超越線性模型</h3>
<p>在某些極端條件下（如非常暗的場景、非線性響應區域、HDR 模式下的多增益讀出），簡單的線性 NLF 可能不足以描述噪聲特性。此時可使用分段線性模型、多項式模型、或基於深度學習的噪聲估計器。近年來，Noise Flow、C2N 等生成式模型可以學習更複雜的噪聲分佈，包括空間相關性、像素間串擾等效應。</p>
`
    },
    {
      id: "ch3_3",
      title: "空間域降噪：Gaussian、Bilateral、NLM、Guided Filter",
      content: `
<p>空間域降噪（Spatial Domain Denoising）是最直覺的降噪方法——直接在像素鄰域上進行加權平均，利用相鄰像素的冗餘資訊來抑制噪聲。本節介紹四種經典的空間域濾波器，它們從簡單到複雜，代表了空間域降噪的發展歷程。</p>

<div class="diagram">
<svg viewBox="0 0 750 520" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="520" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">空間域濾波器核心概念比較</text>

  <!-- Gaussian Filter -->
  <rect x="20" y="50" width="170" height="210" rx="6" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="105" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">Gaussian Filter</text>

  <!-- Gaussian kernel visualization -->
  <rect x="40" y="85" width="26" height="26" fill="#6a8a7a" opacity="0.15"/>
  <rect x="66" y="85" width="26" height="26" fill="#6a8a7a" opacity="0.3"/>
  <rect x="92" y="85" width="26" height="26" fill="#6a8a7a" opacity="0.15"/>
  <rect x="40" y="111" width="26" height="26" fill="#6a8a7a" opacity="0.3"/>
  <rect x="66" y="111" width="26" height="26" fill="#6a8a7a" opacity="0.9"/>
  <rect x="92" y="111" width="26" height="26" fill="#6a8a7a" opacity="0.3"/>
  <rect x="40" y="137" width="26" height="26" fill="#6a8a7a" opacity="0.15"/>
  <rect x="66" y="137" width="26" height="26" fill="#6a8a7a" opacity="0.3"/>
  <rect x="92" y="137" width="26" height="26" fill="#6a8a7a" opacity="0.15"/>

  <text x="53" y="103" text-anchor="middle" font-size="9" fill="#5a5550">1</text>
  <text x="79" y="103" text-anchor="middle" font-size="9" fill="white">2</text>
  <text x="105" y="103" text-anchor="middle" font-size="9" fill="#5a5550">1</text>
  <text x="53" y="129" text-anchor="middle" font-size="9" fill="white">2</text>
  <text x="79" y="129" text-anchor="middle" font-size="9" fill="white">4</text>
  <text x="105" y="129" text-anchor="middle" font-size="9" fill="white">2</text>
  <text x="53" y="155" text-anchor="middle" font-size="9" fill="#5a5550">1</text>
  <text x="79" y="155" text-anchor="middle" font-size="9" fill="white">2</text>
  <text x="105" y="155" text-anchor="middle" font-size="9" fill="#5a5550">1</text>

  <text x="145" y="122" font-size="9" fill="#8a8580">空間距離</text>
  <text x="145" y="136" font-size="9" fill="#8a8580">加權</text>

  <text x="105" y="185" text-anchor="middle" font-size="10" fill="#d35050">✗ 模糊邊緣</text>
  <text x="105" y="200" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 計算簡單</text>
  <text x="105" y="215" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 可分離</text>
  <text x="105" y="240" text-anchor="middle" font-size="9" fill="#8a8580">O(1) separable</text>

  <!-- Bilateral Filter -->
  <rect x="200" y="50" width="170" height="210" rx="6" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="285" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">Bilateral Filter</text>

  <!-- Bilateral dual weights -->
  <rect x="215" y="88" width="60" height="55" rx="3" fill="#e8eaf6" stroke="#5060b0" stroke-width="1"/>
  <text x="245" y="105" text-anchor="middle" font-size="9" fill="#5060b0">空間權重</text>
  <text x="245" y="120" text-anchor="middle" font-size="9" fill="#5060b0">G_s(Δx)</text>
  <text x="245" y="135" text-anchor="middle" font-size="18" fill="#5060b0">×</text>

  <rect x="290" y="88" width="60" height="55" rx="3" fill="#fff3e0" stroke="#e8a04a" stroke-width="1"/>
  <text x="320" y="105" text-anchor="middle" font-size="9" fill="#e8a04a">色彩權重</text>
  <text x="320" y="120" text-anchor="middle" font-size="9" fill="#e8a04a">G_r(ΔI)</text>

  <text x="285" y="165" text-anchor="middle" font-size="10" fill="#5a5550">w = G_s · G_r</text>
  <text x="285" y="185" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 保留邊緣</text>
  <text x="285" y="200" text-anchor="middle" font-size="10" fill="#d35050">✗ 梯度反轉</text>
  <text x="285" y="215" text-anchor="middle" font-size="10" fill="#d35050">✗ 較慢</text>
  <text x="285" y="240" text-anchor="middle" font-size="9" fill="#8a8580">O(r²) per pixel</text>

  <!-- NLM -->
  <rect x="380" y="50" width="170" height="210" rx="6" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="465" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">Non-Local Means</text>

  <!-- Patch matching visualization -->
  <rect x="400" y="88" width="22" height="22" fill="#6a8a7a" opacity="0.8" stroke="#6a8a7a"/>
  <text x="411" y="103" text-anchor="middle" font-size="7" fill="white">P₀</text>
  <rect x="430" y="95" width="22" height="22" fill="#6a8a7a" opacity="0.4" stroke="#6a8a7a"/>
  <text x="441" y="110" text-anchor="middle" font-size="7" fill="white">P₁</text>
  <rect x="460" y="88" width="22" height="22" fill="#6a8a7a" opacity="0.6" stroke="#6a8a7a"/>
  <text x="471" y="103" text-anchor="middle" font-size="7" fill="white">P₂</text>
  <rect x="490" y="100" width="22" height="22" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a"/>
  <text x="501" y="115" text-anchor="middle" font-size="7" fill="#5a5550">P₃</text>

  <line x1="411" y1="110" x2="441" y2="110" stroke="#e8a04a" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="411" y1="110" x2="471" y2="110" stroke="#e8a04a" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="411" y1="110" x2="501" y2="112" stroke="#e8a04a" stroke-width="1" stroke-dasharray="2,2"/>

  <text x="465" y="140" text-anchor="middle" font-size="9" fill="#5a5550">Patch 相似度加權</text>
  <text x="465" y="155" text-anchor="middle" font-size="9" fill="#5a5550">w ∝ exp(−‖P−Q‖²/h²)</text>

  <text x="465" y="185" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 紋理保留佳</text>
  <text x="465" y="200" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 非局部搜尋</text>
  <text x="465" y="215" text-anchor="middle" font-size="10" fill="#d35050">✗ 計算量大</text>
  <text x="465" y="240" text-anchor="middle" font-size="9" fill="#8a8580">O(S² · r²) per pixel</text>

  <!-- Guided Filter -->
  <rect x="560" y="50" width="170" height="210" rx="6" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="645" y="72" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">Guided Filter</text>

  <!-- Linear model -->
  <text x="645" y="100" text-anchor="middle" font-size="11" fill="#5a5550">局部線性模型</text>
  <text x="645" y="120" text-anchor="middle" font-size="11" fill="#6a8a7a">q = a·I + b</text>

  <rect x="585" y="130" width="50" height="40" rx="3" fill="#e8eaf6" stroke="#5060b0" stroke-width="1"/>
  <text x="610" y="147" text-anchor="middle" font-size="8" fill="#5060b0">Guide</text>
  <text x="610" y="160" text-anchor="middle" font-size="8" fill="#5060b0">Image I</text>

  <text x="645" y="155" font-size="14" fill="#5a5550">→</text>

  <rect x="660" y="130" width="50" height="40" rx="3" fill="#fff3e0" stroke="#e8a04a" stroke-width="1"/>
  <text x="685" y="147" text-anchor="middle" font-size="8" fill="#e8a04a">Output</text>
  <text x="685" y="160" text-anchor="middle" font-size="8" fill="#e8a04a">q</text>

  <text x="645" y="195" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ O(1) 快速</text>
  <text x="645" y="210" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ 無梯度反轉</text>
  <text x="645" y="225" text-anchor="middle" font-size="10" fill="#6a8a7a">✓ Edge-aware</text>
  <text x="645" y="240" text-anchor="middle" font-size="9" fill="#8a8580">O(1) with box filter</text>

  <!-- Bilateral filter weight illustration -->
  <text x="375" y="290" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">Bilateral Filter 權重構成詳解</text>

  <!-- Spatial weight curve -->
  <rect x="30" y="305" width="220" height="190" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="140" y="325" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">空間權重 G_s(Δx, Δy)</text>
  <!-- Gaussian bell curve for spatial -->
  <path d="M55,480 Q65,478 80,470 Q100,440 120,380 Q130,350 140,340 Q150,350 160,380 Q180,440 200,470 Q215,478 225,480" fill="none" stroke="#5060b0" stroke-width="2"/>
  <text x="140" y="498" text-anchor="middle" font-size="10" fill="#8a8580">空間距離 ‖Δx‖</text>
  <text x="140" y="340" text-anchor="middle" font-size="9" fill="#5060b0">σ_s</text>

  <!-- Range weight curve -->
  <rect x="265" y="305" width="220" height="190" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="375" y="325" text-anchor="middle" font-size="11" font-weight="bold" fill="#e8a04a">色彩權重 G_r(ΔI)</text>
  <path d="M290,480 Q300,478 315,470 Q335,440 355,380 Q365,350 375,340 Q385,350 395,380 Q415,440 435,470 Q450,478 460,480" fill="none" stroke="#e8a04a" stroke-width="2"/>
  <text x="375" y="498" text-anchor="middle" font-size="10" fill="#8a8580">亮度差 |I_p − I_q|</text>
  <text x="375" y="340" text-anchor="middle" font-size="9" fill="#e8a04a">σ_r</text>

  <!-- Combined weight -->
  <rect x="500" y="305" width="230" height="190" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="615" y="325" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">組合權重 w = G_s × G_r</text>
  <!-- Edge-preserving result -->
  <path d="M530,460 L570,460 L570,370 L580,370 L580,460 L620,460 L620,370 L630,460 L660,460 L660,420 L700,420" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="615" y="498" text-anchor="middle" font-size="10" fill="#8a8580">邊緣處權重驟降→保邊</text>
  <line x1="570" y1="350" x2="570" y2="470" stroke="#d35050" stroke-width="1" stroke-dasharray="3,2"/>
  <text x="570" y="348" text-anchor="middle" font-size="8" fill="#d35050">edge</text>

  <!-- Multiply signs -->
  <text x="252" y="405" font-size="22" fill="#5a5550">×</text>
  <text x="487" y="405" font-size="22" fill="#5a5550">=</text>
</svg>
<div class="caption">圖 3-3：四種空間域濾波器比較及 Bilateral Filter 權重構成詳解</div>
</div>

<h3>Gaussian Filter</h3>
<p>Gaussian Filter（高斯濾波）是最基本的線性低通濾波器，其核函數是二維高斯函數：</p>
<div class="formula">G(x,y) = (1/2πσ²) · exp(−(x² + y²) / 2σ²)</div>
<p>優點是實現簡單且可分離（Separable），即 2D 高斯核可分解為兩個 1D 核的乘積，將計算複雜度從 O(r²) 降至 O(r)。缺點是它不區分邊緣和平坦區域，一律模糊，因此會嚴重破壞邊緣和細節。在實際 ISP 中，純 Gaussian Filter 幾乎不會直接用於降噪，但它是許多進階演算法的基礎組件（如 Bilateral Filter 的空間核、Guided Filter 中的均值計算）。</p>

<h3>Bilateral Filter</h3>
<p>Bilateral Filter（雙邊濾波）由 Tomasi 和 Manduchi 於 1998 年提出，是第一個廣泛使用的 Edge-Preserving Smoothing 濾波器。其核心思想是在空間距離權重之外，增加一個像素值相似度權重：</p>
<div class="formula">BF[I]_p = (1/W_p) · Σ_q G_σs(‖p−q‖) · G_σr(|I_p − I_q|) · I_q</div>
<p>其中 G_σs 是空間域高斯核（控制濾波範圍），G_σr 是值域高斯核（控制邊緣敏感度），W_p 是歸一化因子。參數 σ_s 通常設為 3-10 pixels，σ_r 設為噪聲標準差的 1-3 倍。</p>

<p>Bilateral Filter 的邊緣保留能力來自值域權重：當鄰域像素與中心像素的亮度差異超過 σ_r 時，權重快速趨近於零，因此邊緣另一側的像素不會參與平均。然而，它有一個已知的缺陷——<strong>Gradient Reversal Artifact</strong>（梯度反轉偽影），在某些邊緣附近會產生不自然的亮暗反轉。</p>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>Bilateral Filter 的一個常見問題是 Staircase Effect（階梯效應）：連續的灰度梯度可能被量化為幾個離散的亮度級別。此外，在低 SNR 條件下，噪聲本身會干擾值域權重的計算，導致降噪效果下降。Joint/Cross Bilateral Filter 使用另一張引導圖來計算值域權重，可以緩解這個問題。</p>
</div>

<h3>Non-Local Means (NLM)</h3>
<p>NLM 由 Buades 等人於 2005 年提出，其革命性思想是：像素的相似度不應僅根據單一像素值判斷，而應根據其所在的 Patch（小區塊）的整體相似度判斷。NLM 在一個較大的搜尋視窗（Search Window）中尋找與目標 Patch 相似的 Patch，並加權平均：</p>
<div class="formula">NLM[I]_p = (1/Z_p) · Σ_q exp(−‖P_p − P_q‖² / h²) · I_q</div>
<p>其中 P_p、P_q 分別是以像素 p、q 為中心的 Patch（通常 5×5 或 7×7），h 是控制衰減速度的濾波參數。NLM 的搜尋範圍通常為 21×21 到 35×35。</p>

<p>NLM 對重複紋理的保留效果卓越，因為它能找到影像中多個相似的紋理區塊並利用其冗餘性。但其計算複雜度為 O(S² · r²)，其中 S 是搜尋窗大小、r 是 Patch 大小，對於即時處理來說非常昂貴。實務中常使用 Block-wise NLM、Pre-Selection 等加速策略。</p>

<h3>Guided Filter</h3>
<p>Guided Filter 由 He 等人於 2010 年提出，是一種基於局部線性模型（Local Linear Model）的邊緣保留濾波器。其核心假設是：輸出影像 q 在每個局部視窗內是引導影像 I 的線性函數：</p>
<div class="formula">q_i = a_k · I_i + b_k, ∀i ∈ ω_k</div>
<p>其中 ω_k 是以像素 k 為中心的方形視窗，(a_k, b_k) 是從最小化代價函數求得的線性係數。正則化參數 ε 控制降噪強度：ε 越大，平滑越強；ε 越小，越保留原始細節。</p>

<p>Guided Filter 的最大優勢在於 <strong>O(1) 時間複雜度</strong>（不隨視窗大小改變），因為其核心運算都可用 Box Filter 和 Integral Image 加速。同時，它天然避免了 Bilateral Filter 的 Gradient Reversal 問題，因為線性模型保證了輸出的梯度與引導影像的梯度方向一致。在 ISP 中，Guided Filter 被廣泛用於 HDR 合成中的 Detail Transfer、去霧（Dehazing）後處理等場景。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在實際 ISP 實現中，空間域降噪通常作為降噪管線的一部分。例如，Bilateral Filter 用於 RAW 域的初步降噪，Guided Filter 用於 YUV 域的色度降噪。選擇哪種濾波器取決於：(1) 計算預算（Guided Filter 和可分離 Bilateral 最快）；(2) 紋理保留需求（NLM 最佳）；(3) 邊緣品質要求（Guided Filter 無梯度反轉）。</p>
</div>
`
    },
    {
      id: "ch3_4",
      title: "頻率域降噪：Wavelet、DCT、Wiener Filter",
      content: `
<p>頻率域降噪（Frequency Domain Denoising）的基本哲學是：訊號的能量往往集中在低頻和特定結構化的頻率分量上，而噪聲的能量則均勻分佈在所有頻率。通過在頻率域中選擇性地抑制噪聲主導的頻率分量，可以在保留訊號結構的同時有效降噪。</p>

<div class="diagram">
<svg viewBox="0 0 750 430" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="430" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">頻率域降噪分解示意圖</text>

  <!-- Input image -->
  <rect x="20" y="55" width="90" height="70" rx="4" fill="white" stroke="#5a5550" stroke-width="1.5"/>
  <text x="65" y="82" text-anchor="middle" font-size="10" fill="#5a5550">含噪影像</text>
  <text x="65" y="96" text-anchor="middle" font-size="10" fill="#8a8580">Noisy Image</text>

  <!-- Arrow -->
  <line x1="110" y1="90" x2="145" y2="90" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh34)"/>

  <!-- Transform block -->
  <rect x="145" y="50" width="100" height="80" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="195" y="78" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">正變換</text>
  <text x="195" y="94" text-anchor="middle" font-size="9" fill="#5a5550">DWT / DCT</text>
  <text x="195" y="108" text-anchor="middle" font-size="9" fill="#5a5550">/ DFT</text>

  <line x1="245" y1="90" x2="280" y2="90" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh34)"/>

  <!-- Wavelet decomposition -->
  <rect x="280" y="42" width="200" height="200" rx="6" fill="white" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="380" y="62" text-anchor="middle" font-size="11" font-weight="bold" fill="#5a5550">Wavelet 多尺度分解</text>

  <!-- Level 1 subbands -->
  <rect x="290" y="72" width="60" height="50" fill="#6a8a7a" opacity="0.7" stroke="#6a8a7a"/>
  <text x="320" y="95" text-anchor="middle" font-size="8" fill="white">LL₁</text>
  <text x="320" y="106" text-anchor="middle" font-size="7" fill="white">低頻近似</text>

  <rect x="355" y="72" width="60" height="50" fill="#e8a04a" opacity="0.5" stroke="#e8a04a"/>
  <text x="385" y="95" text-anchor="middle" font-size="8" fill="#5a5550">LH₁</text>
  <text x="385" y="106" text-anchor="middle" font-size="7" fill="#5a5550">水平細節</text>

  <rect x="420" y="72" width="55" height="50" fill="#5060b0" opacity="0.4" stroke="#5060b0"/>
  <text x="447" y="95" text-anchor="middle" font-size="8" fill="#5a5550">HH₁</text>
  <text x="447" y="106" text-anchor="middle" font-size="7" fill="#5a5550">對角細節</text>

  <rect x="290" y="127" width="60" height="50" fill="#e8a04a" opacity="0.5" stroke="#e8a04a"/>
  <text x="320" y="150" text-anchor="middle" font-size="8" fill="#5a5550">HL₁</text>
  <text x="320" y="161" text-anchor="middle" font-size="7" fill="#5a5550">垂直細節</text>

  <!-- Level 2 (smaller, inside LL1) -->
  <rect x="355" y="127" width="55" height="50" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a"/>
  <text x="382" y="150" text-anchor="middle" font-size="8" fill="#5a5550">LL₂</text>

  <rect x="415" y="127" width="55" height="50" fill="#d35050" opacity="0.3" stroke="#d35050"/>
  <text x="442" y="150" text-anchor="middle" font-size="8" fill="#5a5550">Detail₂</text>

  <!-- Noise distribution note -->
  <rect x="290" y="187" width="180" height="45" rx="3" fill="#fce4ec" opacity="0.5" stroke="#d35050" stroke-width="1"/>
  <text x="380" y="203" text-anchor="middle" font-size="9" fill="#d35050">噪聲能量均勻分佈在所有子帶</text>
  <text x="380" y="218" text-anchor="middle" font-size="9" fill="#d35050">訊號能量集中在 LL 和低階 Detail</text>

  <!-- Thresholding -->
  <line x1="480" y1="140" x2="510" y2="140" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh34)"/>

  <rect x="510" y="80" width="100" height="120" rx="4" fill="white" stroke="#d35050" stroke-width="1.5"/>
  <text x="560" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#d35050">閾值處理</text>
  <text x="560" y="122" text-anchor="middle" font-size="9" fill="#5a5550">Thresholding</text>

  <!-- Soft threshold curve -->
  <line x1="525" y1="170" x2="595" y2="170" stroke="#8a8580" stroke-width="0.5"/>
  <line x1="560" y1="135" x2="560" y2="195" stroke="#8a8580" stroke-width="0.5"/>
  <path d="M525,185 L545,170 L575,170 L595,155" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="560" y="200" text-anchor="middle" font-size="8" fill="#8a8580">soft threshold</text>

  <!-- Inverse transform -->
  <line x1="610" y1="140" x2="640" y2="140" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh34)"/>

  <rect x="640" y="100" width="95" height="80" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="687" y="132" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">逆變換</text>
  <text x="687" y="148" text-anchor="middle" font-size="9" fill="#5a5550">IDWT / IDCT</text>

  <!-- DCT block diagram -->
  <text x="375" y="275" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">DCT Block-Based 降噪流程</text>

  <rect x="40" y="295" width="80" height="50" rx="4" fill="white" stroke="#5a5550" stroke-width="1"/>
  <text x="80" y="317" text-anchor="middle" font-size="9" fill="#5a5550">8×8 Block</text>
  <text x="80" y="332" text-anchor="middle" font-size="9" fill="#8a8580">分塊</text>

  <line x1="120" y1="320" x2="155" y2="320" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowCh34)"/>

  <rect x="155" y="295" width="80" height="50" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="195" y="317" text-anchor="middle" font-size="9" fill="#6a8a7a">2D-DCT</text>
  <text x="195" y="332" text-anchor="middle" font-size="9" fill="#8a8580">正變換</text>

  <line x1="235" y1="320" x2="270" y2="320" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowCh34)"/>

  <rect x="270" y="295" width="100" height="50" rx="4" fill="#fce4ec" opacity="0.5" stroke="#d35050" stroke-width="1"/>
  <text x="320" y="317" text-anchor="middle" font-size="9" fill="#d35050">Hard / Soft</text>
  <text x="320" y="332" text-anchor="middle" font-size="9" fill="#d35050">Threshold</text>

  <line x1="370" y1="320" x2="405" y2="320" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowCh34)"/>

  <rect x="405" y="295" width="80" height="50" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1"/>
  <text x="445" y="317" text-anchor="middle" font-size="9" fill="#6a8a7a">IDCT</text>
  <text x="445" y="332" text-anchor="middle" font-size="9" fill="#8a8580">逆變換</text>

  <line x1="485" y1="320" x2="520" y2="320" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowCh34)"/>

  <rect x="520" y="295" width="100" height="50" rx="4" fill="white" stroke="#5a5550" stroke-width="1"/>
  <text x="570" y="317" text-anchor="middle" font-size="9" fill="#5a5550">Overlap-Add</text>
  <text x="570" y="332" text-anchor="middle" font-size="9" fill="#8a8580">重疊平均</text>

  <!-- Wiener Filter -->
  <text x="375" y="380" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">Wiener Filter 頻域最佳估計</text>
  <text x="375" y="405" text-anchor="middle" font-size="12" fill="#6a8a7a">H_w(f) = |S(f)|² / (|S(f)|² + |N(f)|²)</text>
  <text x="375" y="422" text-anchor="middle" font-size="10" fill="#8a8580">在訊號能量強的頻率保留，在噪聲主導的頻率抑制</text>

  <defs>
    <marker id="arrowCh34" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/>
    </marker>
  </defs>
</svg>
<div class="caption">圖 3-4：頻率域降噪架構 — Wavelet 多尺度分解、DCT 區塊處理與 Wiener Filter</div>
</div>

<h3>Wavelet 降噪</h3>
<p>Wavelet Transform（小波變換）將影像分解為多個尺度（Scale）和方向（Orientation）的子帶（Subband）。典型的 2D Discrete Wavelet Transform (DWT) 產生四個子帶：LL（低頻近似）、LH（水平細節）、HL（垂直細節）和 HH（對角細節）。可遞迴地對 LL 子帶繼續分解，形成多級金字塔結構。</p>

<p>Wavelet 降噪的經典方法是 <strong>Wavelet Shrinkage</strong>（小波收縮），由 Donoho 和 Johnstone 於 1994 年提出。其基本步驟為：(1) 對含噪影像進行 DWT；(2) 對細節子帶（LH, HL, HH）的係數進行閾值處理；(3) 逆 DWT 重建。閾值的選擇至關重要：</p>

<div class="formula">Hard Threshold: ŵ = w · 𝟙(|w| > T)<br/>Soft Threshold: ŵ = sign(w) · max(|w| − T, 0)</div>

<p>其中通用閾值（Universal Threshold）為 T = σ · √(2 ln N)，N 是係數總數，σ 是噪聲標準差。Soft Thresholding 比 Hard Thresholding 產生更平滑的結果，但會引入偏差（Bias）。改進方法如 SureShrink、BayesShrink 使用自適應閾值，在每個子帶中根據訊號和噪聲的統計特性選擇最佳閾值。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>常用的小波基函數包括 Haar、Daubechies (db4)、Symlets、Coiflets 等。選擇原則是：(1) 消失矩（Vanishing Moments）越高，對光滑訊號的稀疏表示越好，但計算量也越大；(2) Biorthogonal Wavelet 因對稱性常用於影像處理；(3) 在 ISP 硬體實現中，Haar Wavelet 因其簡單的 ±1 係數最容易實現。</p>
</div>

<h3>DCT 降噪</h3>
<p>DCT（Discrete Cosine Transform）降噪通常以區塊為單位進行。影像被分成 8×8 或 16×16 的重疊塊，對每塊施加 2D-DCT，在頻域中進行閾值處理後再 IDCT 還原。由於使用了重疊塊，重疊區域通過平均來減少塊效應（Blocking Artifact）。</p>

<p>DCT 的優勢在於：(1) 對自然影像的能量壓縮效率高，僅次於 KLT（Karhunen-Loeve Transform）；(2) 有成熟的快速算法，8×8 DCT 可用蝶形結構高效實現；(3) 與 JPEG 壓縮共用變換核，可在解碼端直接進行降噪。DCT 降噪是 BM3D 演算法中的核心組件。</p>

<h3>Wiener Filter</h3>
<p>Wiener Filter 是在最小均方誤差（Minimum Mean Square Error, MMSE）準則下的最佳線性濾波器。在頻率域中，Wiener 濾波器的傳遞函數為：</p>

<div class="formula">H_w(f) = S_xx(f) / (S_xx(f) + S_nn(f)) = 1 / (1 + 1/SNR(f))</div>

<p>其中 S_xx(f) 是訊號的功率譜密度，S_nn(f) 是噪聲的功率譜密度。Wiener Filter 的直覺是：在 SNR 高的頻率分量上幾乎不衰減（保留訊號），在 SNR 低的頻率上強烈衰減（抑制噪聲）。其最大挑戰是需要準確估計訊號和噪聲的功率譜，通常使用初步降噪結果（Pilot Estimate）來近似訊號功率譜。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在 ISP 實務中，頻率域降噪通常不會直接用在即時管線中（DWT/IDCT 的延遲和記憶體需求較高），但其思想深刻影響了現代演算法設計。BM3D 本質上是在 3D Transform 域（2D-DCT + 1D 跨 Patch）中做 Wiener Filtering。近年來的一些硬體 ISP 設計也開始整合 Haar Wavelet 多尺度降噪模組。</p>
</div>
`
    },
    {
      id: "ch3_5",
      title: "時域降噪 TNR",
      content: `
<p>時域降噪（Temporal Noise Reduction, TNR）利用影像序列中相鄰幀之間的時間冗餘（Temporal Redundancy）來抑制噪聲。其基本原理非常直覺：如果場景中的某個像素在多幀中保持靜止，那麼取這些幀對應像素的平均值，就可以有效降低噪聲。對 N 幀取平均，噪聲標準差降低為原來的 1/√N。TNR 是現代手機和監控相機 ISP 中最重要的降噪工具之一。</p>

<div class="diagram">
<svg viewBox="0 0 750 450" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="450" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">TNR Pipeline with Motion Compensation</text>

  <!-- Frame t -->
  <rect x="30" y="60" width="100" height="75" rx="4" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="80" y="92" text-anchor="middle" font-size="12" font-weight="bold" fill="#6a8a7a">Frame t</text>
  <text x="80" y="108" text-anchor="middle" font-size="10" fill="#8a8580">當前幀</text>

  <!-- Frame t-1 (reference) -->
  <rect x="30" y="170" width="100" height="75" rx="4" fill="white" stroke="#5060b0" stroke-width="2"/>
  <text x="80" y="202" text-anchor="middle" font-size="12" font-weight="bold" fill="#5060b0">Frame t-1</text>
  <text x="80" y="218" text-anchor="middle" font-size="10" fill="#8a8580">參考幀（已降噪）</text>

  <!-- Motion Estimation -->
  <line x1="130" y1="97" x2="185" y2="140" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowTNR)"/>
  <line x1="130" y1="207" x2="185" y2="160" stroke="#5060b0" stroke-width="1.5" marker-end="url(#arrowTNR)"/>

  <rect x="185" y="120" width="120" height="60" rx="5" fill="#fff3e0" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="245" y="145" text-anchor="middle" font-size="11" font-weight="bold" fill="#e8a04a">Motion Estimation</text>
  <text x="245" y="162" text-anchor="middle" font-size="9" fill="#5a5550">Block Matching / OF</text>

  <!-- Motion Vector -->
  <line x1="305" y1="150" x2="340" y2="150" stroke="#e8a04a" stroke-width="1.5" marker-end="url(#arrowTNR)"/>
  <text x="322" y="142" text-anchor="middle" font-size="8" fill="#e8a04a">MV</text>

  <!-- Motion Compensation -->
  <rect x="340" y="120" width="120" height="60" rx="5" fill="#e8eaf6" stroke="#5060b0" stroke-width="1.5"/>
  <text x="400" y="143" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">Motion</text>
  <text x="400" y="158" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">Compensation</text>
  <text x="400" y="173" text-anchor="middle" font-size="9" fill="#5a5550">Warp Frame t-1</text>

  <!-- Warped frame output -->
  <line x1="460" y1="150" x2="490" y2="150" stroke="#5060b0" stroke-width="1.5" marker-end="url(#arrowTNR)"/>

  <!-- Blending -->
  <rect x="490" y="80" width="130" height="140" rx="5" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="555" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="#6a8a7a">Temporal Blend</text>

  <text x="555" y="130" text-anchor="middle" font-size="10" fill="#5a5550">α = f(motion, noise)</text>
  <text x="555" y="150" text-anchor="middle" font-size="11" fill="#6a8a7a">Out = α·F_t + (1-α)·F̂_{t-1}</text>

  <rect x="505" y="160" width="100" height="45" rx="3" fill="#fce4ec" opacity="0.5" stroke="#d35050" stroke-width="1"/>
  <text x="555" y="178" text-anchor="middle" font-size="9" fill="#d35050">靜態區: α→0 (強TNR)</text>
  <text x="555" y="192" text-anchor="middle" font-size="9" fill="#d35050">運動區: α→1 (弱TNR)</text>

  <!-- Input from current frame to blend -->
  <line x1="130" y1="80" x2="490" y2="100" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,2"/>

  <!-- Output -->
  <line x1="620" y1="150" x2="660" y2="150" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowTNR)"/>
  <rect x="660" y="120" width="70" height="60" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="2"/>
  <text x="695" y="147" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">Out_t</text>
  <text x="695" y="163" text-anchor="middle" font-size="9" fill="#5a5550">降噪結果</text>

  <!-- Feedback loop -->
  <path d="M695,180 L695,290 L80,290 L80,245" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrowTNR)"/>
  <text x="390" y="306" text-anchor="middle" font-size="10" fill="#8a8580">Feedback: Out_t 成為下一幀的 Reference Frame t-1</text>

  <!-- Motion Detection Detail -->
  <text x="375" y="340" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">Motion-Adaptive Alpha 控制策略</text>

  <!-- Alpha curve -->
  <rect x="100" y="355" width="550" height="85" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <!-- Axis -->
  <line x1="130" y1="420" x2="620" y2="420" stroke="#8a8580" stroke-width="1"/>
  <line x1="130" y1="365" x2="130" y2="425" stroke="#8a8580" stroke-width="1"/>
  <text x="375" y="440" text-anchor="middle" font-size="10" fill="#8a8580">Motion Magnitude |MV| / SAD</text>
  <text x="120" y="395" text-anchor="end" font-size="9" fill="#8a8580">α</text>

  <!-- Alpha curve - smooth transition -->
  <path d="M130,410 L200,410 Q280,410 340,390 Q400,370 450,370 L620,370" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>

  <text x="165" y="405" text-anchor="middle" font-size="9" fill="#6a8a7a">α≈0</text>
  <text x="165" y="395" text-anchor="middle" font-size="8" fill="#8a8580">靜態</text>
  <text x="550" y="385" text-anchor="middle" font-size="9" fill="#6a8a7a">α≈1</text>
  <text x="550" y="375" text-anchor="middle" font-size="8" fill="#8a8580">運動</text>
  <text x="340" y="385" text-anchor="middle" font-size="8" fill="#e8a04a">過渡區</text>

  <defs>
    <marker id="arrowTNR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/>
    </marker>
  </defs>
</svg>
<div class="caption">圖 3-5：TNR 管線示意圖 — 包含 Motion Estimation、Motion Compensation、Adaptive Blending 與回饋迴路</div>
</div>

<h3>TNR 基本架構</h3>
<p>TNR 的核心是一個遞迴濾波器（Recursive Filter / IIR Filter），其基本公式為：</p>
<div class="formula">Out_t = α · Frame_t + (1 − α) · Warp(Out_{t-1}, MV)</div>
<p>其中 Frame_t 是當前幀，Out_{t-1} 是前一幀的降噪輸出，MV 是運動向量（Motion Vector），α 是混合係數。Warp 操作使用 MV 將前一幀的降噪結果對齊到當前幀的座標系。α 的值根據運動量動態調整：靜態區域 α 接近 0（強烈依賴歷史幀，噪聲抑制最大化），運動區域 α 接近 1（主要使用當前幀，避免拖影）。</p>

<h3>Motion Estimation（運動估計）</h3>
<p>準確的運動估計是 TNR 成功的關鍵。常用方法包括：</p>
<ul>
  <li><strong>Block Matching</strong>：將影像分成小塊（如 8×8、16×16），在搜尋範圍內尋找最匹配的塊，產生整數或亞像素精度的運動向量。匹配準則常用 SAD（Sum of Absolute Differences）或 SSD。硬體 ISP 通常使用這種方法。</li>
  <li><strong>Optical Flow</strong>：計算每個像素的稠密運動場，精度更高但計算量更大。Lucas-Kanade 和 Horn-Schunck 是經典方法。</li>
  <li><strong>Global Motion Estimation</strong>：估計整體的攝影機運動（平移、旋轉、縮放），用仿射或透視變換模型表示。適合手持場景。</li>
</ul>

<h3>Motion Compensation（運動補償）</h3>
<p>得到運動向量後，需要用它們將參考幀 Warp（變形）到當前幀的座標系。這個過程稱為 Motion Compensation。Warp 操作通常使用 Bilinear 或 Bicubic Interpolation 來處理亞像素精度的運動。在硬體實現中，通常只支持到 1/4 或 1/8 像素精度。</p>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>TNR 的最大風險是 <strong>Ghost Artifact</strong>（鬼影偽影），當運動估計不準確時，前一幀的內容會在不正確的位置疊加，產生半透明的殘影。常見於：(1) 遮擋/暴露區域（Occlusion）；(2) 物體邊緣；(3) 閃爍光源。有效的 Ghost Detection 和 Alpha Blending 策略是避免鬼影的關鍵。</p>
</div>

<h3>Alpha 混合策略</h3>
<p>α 的控制是 TNR 的核心 Tuning 重點。一個好的 α 控制策略需要考慮多個因素：</p>
<ul>
  <li><strong>運動量</strong>：MV 的大小或 SAD 值越大，α 越接近 1</li>
  <li><strong>噪聲強度</strong>：噪聲越大（高 ISO），α 應更傾向於 0，加強時域平均</li>
  <li><strong>運動估計可靠度</strong>：若 ME 的 SAD 殘差大或匹配不唯一，α 應偏向 1</li>
  <li><strong>場景變化檢測</strong>：檢測到場景切換（Scene Change）時，α 必須瞬間設為 1，避免前一場景的內容混入</li>
</ul>

<p>實務中，α 通常通過查找表（LUT）來映射，輸入是運動量和噪聲強度的組合。有些高階系統使用多級 TNR：先做全局運動補償，再做區域級 Block Matching，最後做像素級 Alpha Blending。</p>

<h3>多幀降噪 MFNR</h3>
<p>Multi-Frame Noise Reduction (MFNR) 是 TNR 的離線版本，常見於手機的拍照模式（vs. 預覽/錄影的即時 TNR）。MFNR 一次性捕捉 4-16 幀短曝光影像，然後進行全局對齊（Global Alignment）+ 局部對齊（Local Alignment）+ 加權融合。Google 的 HDR+ 演算法就是 MFNR 的經典範例，它使用 Tile-Based Alignment 和 Robust Merge，在極暗環境中也能獲得出色的降噪效果。</p>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>一個典型的手機 TNR 設定：搜尋範圍 ±16 pixels、Block 大小 8×8、亞像素精度 1/4 pixel、α 範圍 0.05~0.95。在 ISO 100 時 TNR 幾乎不啟用；ISO 800 以上逐步增強；ISO 3200+ 時 TNR 混合權重可達 70-80%（α≈0.2-0.3）。整個 TNR 模組需要一個全幀的 Line Buffer 來存儲前一幀的降噪結果。</p>
</div>
`
    },
    {
      id: "ch3_6",
      title: "BM3D 演算法家族",
      content: `
<p>BM3D（Block-Matching and 3D Filtering）是由 Dabov 等人於 2007 年提出的降噪演算法，長期以來被視為傳統（非深度學習）降噪方法的 State-of-the-Art（SOTA）。它巧妙地結合了 Non-Local Means 的 Patch 匹配思想、變換域的稀疏表示能力、以及 Wiener 濾波的最佳估計理論，達到了驚人的降噪效果。</p>

<div class="diagram">
<svg viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="500" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">BM3D 演算法管線</text>

  <!-- Stage 1 Header -->
  <rect x="20" y="45" width="710" height="25" rx="4" fill="#6a8a7a" opacity="0.2"/>
  <text x="375" y="63" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">Step 1: Basic Estimate（Hard Thresholding）</text>

  <!-- Step 1.1: Block Matching -->
  <rect x="30" y="80" width="130" height="130" rx="5" fill="white" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="95" y="100" text-anchor="middle" font-size="11" font-weight="bold" fill="#e8a04a">Block Matching</text>

  <!-- Reference patch and similar patches -->
  <rect x="45" y="110" width="24" height="24" fill="#6a8a7a" opacity="0.9" stroke="#6a8a7a"/>
  <text x="57" y="126" text-anchor="middle" font-size="7" fill="white">Ref</text>
  <rect x="75" y="112" width="20" height="20" fill="#6a8a7a" opacity="0.6" stroke="#6a8a7a"/>
  <rect x="100" y="108" width="20" height="20" fill="#6a8a7a" opacity="0.5" stroke="#6a8a7a"/>
  <rect x="125" y="115" width="20" height="20" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a"/>

  <text x="95" y="155" text-anchor="middle" font-size="9" fill="#5a5550">在搜尋窗中找</text>
  <text x="95" y="168" text-anchor="middle" font-size="9" fill="#5a5550">相似 Patch</text>
  <text x="95" y="181" text-anchor="middle" font-size="9" fill="#8a8580">d(P,Q) &lt; τ_match</text>
  <text x="95" y="200" text-anchor="middle" font-size="9" fill="#e8a04a">→ N 個匹配 Patch</text>

  <!-- Arrow -->
  <line x1="160" y1="145" x2="185" y2="145" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowBM3D)"/>

  <!-- Step 1.2: Grouping into 3D stack -->
  <rect x="185" y="80" width="130" height="130" rx="5" fill="white" stroke="#5060b0" stroke-width="1.5"/>
  <text x="250" y="100" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">3D Grouping</text>

  <!-- 3D stack visualization -->
  <rect x="210" y="115" width="40" height="40" fill="#5060b0" opacity="0.2" stroke="#5060b0" stroke-width="0.8"/>
  <rect x="218" y="109" width="40" height="40" fill="#5060b0" opacity="0.35" stroke="#5060b0" stroke-width="0.8"/>
  <rect x="226" y="103" width="40" height="40" fill="#5060b0" opacity="0.5" stroke="#5060b0" stroke-width="0.8"/>
  <rect x="234" y="97" width="40" height="40" fill="#5060b0" opacity="0.7" stroke="#5060b0" stroke-width="0.8"/>

  <text x="250" y="170" text-anchor="middle" font-size="9" fill="#5a5550">堆疊成 3D 陣列</text>
  <text x="250" y="183" text-anchor="middle" font-size="9" fill="#5060b0">Group: k × k × N</text>
  <text x="250" y="200" text-anchor="middle" font-size="8" fill="#8a8580">e.g. 8×8×16</text>

  <!-- Arrow -->
  <line x1="315" y1="145" x2="340" y2="145" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowBM3D)"/>

  <!-- Step 1.3: 3D Transform + Hard Threshold -->
  <rect x="340" y="80" width="160" height="130" rx="5" fill="white" stroke="#d35050" stroke-width="1.5"/>
  <text x="420" y="100" text-anchor="middle" font-size="11" font-weight="bold" fill="#d35050">3D Transform</text>
  <text x="420" y="115" text-anchor="middle" font-size="11" font-weight="bold" fill="#d35050">+ Hard Threshold</text>

  <text x="420" y="138" text-anchor="middle" font-size="9" fill="#5a5550">2D-DCT (空間域)</text>
  <text x="420" y="152" text-anchor="middle" font-size="9" fill="#5a5550">+ 1D-Haar (跨 Patch)</text>
  <text x="420" y="168" text-anchor="middle" font-size="8" fill="#8a8580">→ 3D 變換係數</text>
  <text x="420" y="185" text-anchor="middle" font-size="9" fill="#d35050">Hard Threshold: T=λ·σ</text>
  <text x="420" y="200" text-anchor="middle" font-size="8" fill="#8a8580">保留大係數，去除小係數</text>

  <!-- Arrow -->
  <line x1="500" y1="145" x2="525" y2="145" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowBM3D)"/>

  <!-- Step 1.4: Inverse + Aggregation -->
  <rect x="525" y="80" width="130" height="130" rx="5" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="590" y="100" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">Inverse 3D-T</text>
  <text x="590" y="115" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">+ Aggregation</text>

  <text x="590" y="140" text-anchor="middle" font-size="9" fill="#5a5550">逆變換還原</text>
  <text x="590" y="155" text-anchor="middle" font-size="9" fill="#5a5550">各 Patch 估計值</text>
  <text x="590" y="175" text-anchor="middle" font-size="9" fill="#6a8a7a">加權聚合所有</text>
  <text x="590" y="190" text-anchor="middle" font-size="9" fill="#6a8a7a">重疊 Patch 估計</text>
  <text x="590" y="205" text-anchor="middle" font-size="8" fill="#8a8580">Weight ∝ 1/N_nz</text>

  <!-- Output of Step 1 -->
  <line x1="655" y1="145" x2="680" y2="145" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowBM3D)"/>
  <rect x="680" y="118" width="55" height="55" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="707" y="142" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Basic</text>
  <text x="707" y="155" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Est.</text>
  <text x="707" y="168" text-anchor="middle" font-size="8" fill="#8a8580">ŷ_basic</text>

  <!-- Stage 2 Header -->
  <rect x="20" y="225" width="710" height="25" rx="4" fill="#5060b0" opacity="0.15"/>
  <text x="375" y="243" text-anchor="middle" font-size="13" font-weight="bold" fill="#5060b0">Step 2: Final Estimate（Wiener Filtering）</text>

  <!-- Step 2.1 -->
  <rect x="30" y="260" width="130" height="110" rx="5" fill="white" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="95" y="280" text-anchor="middle" font-size="11" font-weight="bold" fill="#e8a04a">Block Matching</text>
  <text x="95" y="296" text-anchor="middle" font-size="9" fill="#5a5550">使用 Basic Est.</text>
  <text x="95" y="310" text-anchor="middle" font-size="9" fill="#5a5550">做更精確的匹配</text>
  <text x="95" y="330" text-anchor="middle" font-size="8" fill="#8a8580">同時對 noisy 和</text>
  <text x="95" y="343" text-anchor="middle" font-size="8" fill="#8a8580">basic est. 建群組</text>

  <line x1="160" y1="315" x2="185" y2="315" stroke="#5060b0" stroke-width="2" marker-end="url(#arrowBM3D2)"/>

  <!-- Step 2.2 -->
  <rect x="185" y="260" width="130" height="110" rx="5" fill="white" stroke="#5060b0" stroke-width="1.5"/>
  <text x="250" y="280" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">Dual Grouping</text>
  <text x="250" y="300" text-anchor="middle" font-size="9" fill="#5a5550">Noisy Group</text>
  <text x="250" y="315" text-anchor="middle" font-size="9" fill="#5a5550">+ Basic Est. Group</text>
  <text x="250" y="335" text-anchor="middle" font-size="8" fill="#8a8580">兩個 3D 陣列</text>
  <text x="250" y="348" text-anchor="middle" font-size="8" fill="#8a8580">使用相同的分組索引</text>

  <line x1="315" y1="315" x2="340" y2="315" stroke="#5060b0" stroke-width="2" marker-end="url(#arrowBM3D2)"/>

  <!-- Step 2.3 -->
  <rect x="340" y="260" width="160" height="110" rx="5" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="420" y="280" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">3D Transform</text>
  <text x="420" y="295" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">+ Wiener Filter</text>
  <text x="420" y="318" text-anchor="middle" font-size="9" fill="#5a5550">Wiener 係數由</text>
  <text x="420" y="333" text-anchor="middle" font-size="9" fill="#5a5550">Basic Est. 的 PSD 估算</text>
  <text x="420" y="352" text-anchor="middle" font-size="9" fill="#6a8a7a">W = |Ŝ|²/(|Ŝ|²+σ²)</text>

  <line x1="500" y1="315" x2="525" y2="315" stroke="#5060b0" stroke-width="2" marker-end="url(#arrowBM3D2)"/>

  <!-- Step 2.4 -->
  <rect x="525" y="260" width="130" height="110" rx="5" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="590" y="280" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">Inverse 3D-T</text>
  <text x="590" y="295" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">+ Aggregation</text>
  <text x="590" y="318" text-anchor="middle" font-size="9" fill="#5a5550">最終加權聚合</text>
  <text x="590" y="335" text-anchor="middle" font-size="9" fill="#5a5550">Weight ∝ 1/σ²_wiener</text>

  <!-- Final output -->
  <line x1="655" y1="315" x2="680" y2="315" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowBM3D2)"/>
  <rect x="680" y="288" width="55" height="55" rx="4" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="2"/>
  <text x="707" y="312" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Final</text>
  <text x="707" y="325" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Est.</text>
  <text x="707" y="338" text-anchor="middle" font-size="8" fill="#8a8580">ŷ_final</text>

  <!-- Key insight box -->
  <rect x="50" y="395" width="650" height="90" rx="6" fill="white" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="375" y="418" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">BM3D 為何有效？核心洞察</text>
  <text x="375" y="438" text-anchor="middle" font-size="11" fill="#6a8a7a">1. Block Matching: 利用影像中的非局部自相似性（Non-Local Self-Similarity）</text>
  <text x="375" y="455" text-anchor="middle" font-size="11" fill="#5060b0">2. 3D Transform: 在 3D 域中，訊號能量高度集中（稀疏），噪聲均勻分佈</text>
  <text x="375" y="472" text-anchor="middle" font-size="11" fill="#d35050">3. Two-Stage: 第一階段的估計作為第二階段 Wiener Filter 的先驗，層層精煉</text>

  <defs>
    <marker id="arrowBM3D" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/>
    </marker>
    <marker id="arrowBM3D2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#5060b0"/>
    </marker>
  </defs>
</svg>
<div class="caption">圖 3-6：BM3D 二階段管線 — Step 1 使用 Hard Thresholding 產生 Basic Estimate，Step 2 使用 Wiener Filtering 精煉</div>
</div>

<h3>Step 1: Basic Estimate</h3>
<p>BM3D 的第一階段目標是產生一個粗略但合理的降噪估計（Basic Estimate）。具體步驟如下：</p>
<ol>
  <li><strong>Block Matching</strong>：對影像中的每個參考 Patch（通常 8×8），在搜尋窗（如 39×39）內找到所有 L2 距離小於閾值 τ 的相似 Patch。典型匹配數量為 8-32 個。</li>
  <li><strong>Grouping</strong>：將這些相似 Patch 堆疊成一個 3D 陣列（Group），大小為 k × k × N，其中 k 是 Patch 尺寸，N 是匹配的 Patch 數量。</li>
  <li><strong>3D Collaborative Filtering</strong>：對這個 3D Group 施加 3D 變換（空間域用 2D-DCT 或 2D-Bior Wavelet，跨 Patch 維度用 1D-Haar），然後在 3D 變換域中進行 Hard Thresholding。由於相似 Patch 的訊號部分高度相關，3D 變換後訊號能量極度集中在少數大係數上，而噪聲保持分散。</li>
  <li><strong>Inverse Transform + Aggregation</strong>：逆變換還原所有 Patch 的估計值，然後通過加權平均聚合所有重疊的 Patch 估計。權重與 Group 中非零係數的數量成反比——更稀疏的表示（非零係數越少）意味著更好的降噪品質，因此獲得更高權重。</li>
</ol>

<h3>Step 2: Final Estimate (Wiener Filtering)</h3>
<p>第二階段利用 Step 1 的 Basic Estimate 作為「Pilot」來進行更精確的 Wiener Filtering：</p>
<ol>
  <li>使用 Basic Estimate（更乾淨）重新進行 Block Matching，得到更準確的匹配結果。</li>
  <li>使用相同的分組索引，同時對原始含噪影像和 Basic Estimate 建立兩組 3D Group。</li>
  <li>對兩個 Group 都做 3D 變換。Basic Estimate 的變換係數用於估計訊號功率譜，進而計算 Wiener 係數 W = |Ŝ|²/(|Ŝ|²+σ²)。將 Wiener 係數逐元素乘以含噪影像的變換係數。</li>
  <li>逆變換並聚合，得到最終降噪結果。</li>
</ol>

<div class="info-box key">
<div class="box-title">重點</div>
<p>BM3D 的峰值效能在 σ=25 時，對 Lena 影像可達約 32.4 dB PSNR，至今仍是傳統方法的標竿。BM3D 家族的衍生包括：<strong>BM3D-SAPCA</strong>（使用 Shape-Adaptive PCA 取代固定 DCT）、<strong>V-BM4D</strong>（擴展到影片降噪的 4D 版本）、<strong>CBM3D</strong>（彩色版本，對 YCbCr 聯合處理）。然而，BM3D 的計算量非常大（Block Matching 為主要瓶頸），不適合即時 ISP，多用於離線處理或作為評估基準。</p>
</div>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>加速 BM3D 的策略包括：(1) 使用 PCA 降維加速 Block Matching；(2) 僅對部分參考點處理（Stride > 1）；(3) GPU 平行化；(4) 預計算 Integral Image 加速 SAD。在嵌入式系統中，可以只執行 Step 1（約損失 0.3-0.5 dB）以換取 2 倍速度提升。</p>
</div>
`
    },
    {
      id: "ch3_7",
      title: "深度學習降噪：DnCNN、FFDNet",
      content: `
<p>深度學習的引入為影像降噪帶來了革命性的突破。從 2016 年開始，一系列基於卷積神經網路（CNN）的降噪模型先後超越了 BM3D 等傳統方法的效能。本節介紹兩個里程碑式的深度學習降噪網路：DnCNN 和 FFDNet，它們的設計思想深刻影響了後續的研究方向。</p>

<div class="diagram">
<svg viewBox="0 0 750 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="480" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">DnCNN 與 FFDNet 網路架構</text>

  <!-- DnCNN Section -->
  <rect x="20" y="42" width="710" height="22" rx="3" fill="#6a8a7a" opacity="0.2"/>
  <text x="375" y="58" text-anchor="middle" font-size="12" font-weight="bold" fill="#6a8a7a">DnCNN: Residual Learning of Deep CNN (Zhang et al., 2017)</text>

  <!-- Input -->
  <rect x="30" y="75" width="55" height="55" rx="3" fill="white" stroke="#5a5550" stroke-width="1.5"/>
  <text x="57" y="100" text-anchor="middle" font-size="9" fill="#5a5550">Noisy</text>
  <text x="57" y="113" text-anchor="middle" font-size="9" fill="#5a5550">y</text>

  <line x1="85" y1="102" x2="110" y2="102" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowDL)"/>

  <!-- Layer 1: Conv+ReLU -->
  <rect x="110" y="78" width="65" height="48" rx="3" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="1"/>
  <text x="142" y="97" text-anchor="middle" font-size="8" font-weight="bold" fill="#5a5550">Conv</text>
  <text x="142" y="109" text-anchor="middle" font-size="8" fill="#6a8a7a">3×3×64</text>
  <text x="142" y="120" text-anchor="middle" font-size="7" fill="#8a8580">+ ReLU</text>

  <line x1="175" y1="102" x2="190" y2="102" stroke="#6a8a7a" stroke-width="1" marker-end="url(#arrowDL)"/>

  <!-- Layers 2~D-1: Conv+BN+ReLU -->
  <rect x="190" y="78" width="80" height="48" rx="3" fill="#5060b0" opacity="0.2" stroke="#5060b0" stroke-width="1"/>
  <text x="230" y="95" text-anchor="middle" font-size="8" font-weight="bold" fill="#5060b0">Conv+BN</text>
  <text x="230" y="107" text-anchor="middle" font-size="8" fill="#5060b0">3×3×64</text>
  <text x="230" y="118" text-anchor="middle" font-size="7" fill="#8a8580">+ReLU ×(D-2)</text>

  <text x="283" y="102" font-size="14" fill="#8a8580">···</text>

  <rect x="300" y="78" width="80" height="48" rx="3" fill="#5060b0" opacity="0.2" stroke="#5060b0" stroke-width="1"/>
  <text x="340" y="95" text-anchor="middle" font-size="8" font-weight="bold" fill="#5060b0">Conv+BN</text>
  <text x="340" y="107" text-anchor="middle" font-size="8" fill="#5060b0">3×3×64</text>
  <text x="340" y="118" text-anchor="middle" font-size="7" fill="#8a8580">+ReLU</text>

  <line x1="380" y1="102" x2="395" y2="102" stroke="#6a8a7a" stroke-width="1" marker-end="url(#arrowDL)"/>

  <!-- Last layer: Conv -->
  <rect x="395" y="78" width="55" height="48" rx="3" fill="#e8a04a" opacity="0.3" stroke="#e8a04a" stroke-width="1"/>
  <text x="422" y="97" text-anchor="middle" font-size="8" font-weight="bold" fill="#e8a04a">Conv</text>
  <text x="422" y="109" text-anchor="middle" font-size="8" fill="#e8a04a">3×3×1</text>

  <line x1="450" y1="102" x2="475" y2="102" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowDL)"/>

  <!-- Residual output -->
  <rect x="475" y="78" width="55" height="48" rx="3" fill="#fce4ec" stroke="#d35050" stroke-width="1.5"/>
  <text x="502" y="97" text-anchor="middle" font-size="9" fill="#d35050">Noise</text>
  <text x="502" y="110" text-anchor="middle" font-size="9" fill="#d35050">n̂</text>

  <!-- Subtraction -->
  <circle cx="570" cy="102" r="15" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="570" y="107" text-anchor="middle" font-size="16" font-weight="bold" fill="#6a8a7a">−</text>
  <line x1="530" y1="102" x2="555" y2="102" stroke="#d35050" stroke-width="1.5" marker-end="url(#arrowDL)"/>

  <!-- Skip connection from input -->
  <path d="M57,130 L57,145 L570,145 L570,117" fill="none" stroke="#5a5550" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="310" y="157" text-anchor="middle" font-size="9" fill="#8a8580">Skip Connection: y</text>

  <!-- Clean output -->
  <line x1="585" y1="102" x2="620" y2="102" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowDL)"/>
  <rect x="620" y="78" width="55" height="48" rx="3" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="2"/>
  <text x="647" y="97" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Clean</text>
  <text x="647" y="110" text-anchor="middle" font-size="9" fill="#6a8a7a">x̂=y−n̂</text>

  <!-- Key: Residual Learning note -->
  <rect x="690" y="78" width="45" height="48" rx="3" fill="#fff3e0" stroke="#e8a04a" stroke-width="1"/>
  <text x="712" y="98" text-anchor="middle" font-size="7" fill="#e8a04a">Residual</text>
  <text x="712" y="110" text-anchor="middle" font-size="7" fill="#e8a04a">Learning</text>
  <text x="712" y="120" text-anchor="middle" font-size="7" fill="#e8a04a">💡</text>

  <!-- DnCNN info -->
  <text x="375" y="180" text-anchor="middle" font-size="11" fill="#5a5550">D=17 layers (σ known) | D=20 layers (blind) | Receptive Field = (2D+1)×(2D+1) = 35×35</text>

  <!-- FFDNet Section -->
  <rect x="20" y="200" width="710" height="22" rx="3" fill="#5060b0" opacity="0.15"/>
  <text x="375" y="216" text-anchor="middle" font-size="12" font-weight="bold" fill="#5060b0">FFDNet: Flexible & Fast Denoising CNN (Zhang et al., 2018)</text>

  <!-- Input sub-images -->
  <rect x="30" y="235" width="90" height="110" rx="4" fill="white" stroke="#5a5550" stroke-width="1.5"/>
  <text x="75" y="255" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">PixelShuffle ↓2</text>
  <rect x="40" y="265" width="25" height="20" fill="#6a8a7a" opacity="0.5" stroke="#6a8a7a" stroke-width="0.8"/>
  <rect x="68" y="265" width="25" height="20" fill="#6a8a7a" opacity="0.4" stroke="#6a8a7a" stroke-width="0.8"/>
  <rect x="40" y="290" width="25" height="20" fill="#6a8a7a" opacity="0.3" stroke="#6a8a7a" stroke-width="0.8"/>
  <rect x="68" y="290" width="25" height="20" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="0.8"/>
  <text x="75" y="328" text-anchor="middle" font-size="8" fill="#8a8580">4 sub-images</text>
  <text x="75" y="340" text-anchor="middle" font-size="8" fill="#8a8580">H/2 × W/2</text>

  <line x1="120" y1="290" x2="148" y2="290" stroke="#5060b0" stroke-width="1.5" marker-end="url(#arrowDL2)"/>

  <!-- Noise Level Map -->
  <rect x="30" y="355" width="90" height="50" rx="4" fill="#e8a04a" opacity="0.2" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="75" y="377" text-anchor="middle" font-size="10" font-weight="bold" fill="#e8a04a">σ Map</text>
  <text x="75" y="393" text-anchor="middle" font-size="8" fill="#8a8580">Noise Level Map</text>

  <!-- Arrow from sigma map to concat -->
  <path d="M120,380 L140,380 L140,310 L148,310" fill="none" stroke="#e8a04a" stroke-width="1.5" marker-end="url(#arrowDL2)"/>

  <!-- Concat -->
  <rect x="148" y="275" width="40" height="50" rx="3" fill="#fff3e0" stroke="#e8a04a" stroke-width="1"/>
  <text x="168" y="298" text-anchor="middle" font-size="8" fill="#e8a04a">Cat</text>
  <text x="168" y="312" text-anchor="middle" font-size="7" fill="#8a8580">5ch</text>

  <line x1="188" y1="300" x2="210" y2="300" stroke="#5060b0" stroke-width="1.5" marker-end="url(#arrowDL2)"/>

  <!-- CNN body -->
  <rect x="210" y="265" width="70" height="70" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="245" y="290" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Conv</text>
  <text x="245" y="303" text-anchor="middle" font-size="8" fill="#6a8a7a">3×3×96</text>
  <text x="245" y="318" text-anchor="middle" font-size="8" fill="#8a8580">+BN+ReLU</text>

  <line x1="280" y1="300" x2="295" y2="300" stroke="#5060b0" stroke-width="1" marker-end="url(#arrowDL2)"/>

  <rect x="295" y="270" width="90" height="60" rx="4" fill="#5060b0" opacity="0.15" stroke="#5060b0" stroke-width="1.5"/>
  <text x="340" y="293" text-anchor="middle" font-size="9" font-weight="bold" fill="#5060b0">Conv+BN+ReLU</text>
  <text x="340" y="308" text-anchor="middle" font-size="8" fill="#5060b0">×13 layers</text>
  <text x="340" y="322" text-anchor="middle" font-size="8" fill="#8a8580">3×3×96</text>

  <line x1="385" y1="300" x2="400" y2="300" stroke="#5060b0" stroke-width="1" marker-end="url(#arrowDL2)"/>

  <rect x="400" y="270" width="65" height="60" rx="4" fill="#e8a04a" opacity="0.2" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="432" y="293" text-anchor="middle" font-size="9" font-weight="bold" fill="#e8a04a">Conv</text>
  <text x="432" y="308" text-anchor="middle" font-size="8" fill="#e8a04a">3×3×4</text>

  <line x1="465" y1="300" x2="490" y2="300" stroke="#5060b0" stroke-width="1.5" marker-end="url(#arrowDL2)"/>

  <!-- PixelShuffle up -->
  <rect x="490" y="270" width="90" height="60" rx="4" fill="white" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="535" y="293" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a8a7a">PixelShuffle ↑2</text>
  <text x="535" y="310" text-anchor="middle" font-size="8" fill="#8a8580">Sub-pixel conv</text>
  <text x="535" y="322" text-anchor="middle" font-size="8" fill="#8a8580">→ H × W</text>

  <line x1="580" y1="300" x2="610" y2="300" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowDL2)"/>

  <!-- Output -->
  <rect x="610" y="275" width="55" height="50" rx="3" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="2"/>
  <text x="637" y="297" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Clean</text>
  <text x="637" y="310" text-anchor="middle" font-size="9" fill="#6a8a7a">x̂</text>

  <!-- Comparison table -->
  <rect x="50" y="420" width="650" height="55" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="195" y="440" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">特性</text>
  <text x="375" y="440" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a8a7a">DnCNN</text>
  <text x="555" y="440" text-anchor="middle" font-size="10" font-weight="bold" fill="#5060b0">FFDNet</text>
  <line x1="50" y1="445" x2="700" y2="445" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="195" y="462" text-anchor="middle" font-size="9" fill="#5a5550">噪聲水平控制</text>
  <text x="375" y="462" text-anchor="middle" font-size="9" fill="#8a8580">固定σ或Blind</text>
  <text x="555" y="462" text-anchor="middle" font-size="9" fill="#5060b0">σ Map 輸入（彈性）</text>

  <defs>
    <marker id="arrowDL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/></marker>
    <marker id="arrowDL2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#5060b0"/></marker>
  </defs>
</svg>
<div class="caption">圖 3-7：DnCNN（殘差學習架構）與 FFDNet（噪聲等級可控、PixelShuffle 降解析度處理）網路結構對比</div>
</div>

<h3>DnCNN: Residual Learning for Image Denoising</h3>
<p>DnCNN 由張凱等人於 2017 年發表在 IEEE TIP，是第一個在影像降噪上全面超越 BM3D 的深度學習模型。其關鍵設計決策包括：</p>

<p><strong>1. 殘差學習（Residual Learning）</strong>：DnCNN 不直接預測乾淨影像 x̂，而是預測噪聲殘差 n̂ = y − x。最終乾淨影像通過 x̂ = y − n̂ 得到。這種設計的好處是：噪聲比影像本身更「簡單」（結構更少），網路更容易學習。同時，殘差連接允許梯度直接回傳，緩解梯度消失問題。</p>

<p><strong>2. Batch Normalization (BN)</strong>：在每個卷積層後加入 BN，加速訓練收斂並配合殘差學習產生更好的正則化效果。實驗表明 BN 在降噪任務中與殘差學習有很好的協同作用。</p>

<p><strong>3. 不使用 Pooling</strong>：整個網路保持空間解析度不變（全卷積 FCN），避免了下採樣帶來的資訊損失。感受野（Receptive Field）通過堆疊多層 3×3 卷積來擴大，17 層的感受野為 35×35。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>DnCNN 有三種訓練模式：(1) DnCNN-S: 針對特定噪聲水平 σ 訓練，效能最佳；(2) DnCNN-B: 在 σ∈[0,55] 範圍上訓練的 Blind 版本，一個模型處理所有噪聲水平；(3) DnCNN-3: 同時處理降噪、超解析度和 JPEG 去塊的多任務版本。DnCNN-S 在 σ=25 時比 BM3D 高約 0.5-0.8 dB PSNR。</p>
</div>

<h3>FFDNet: Fast and Flexible Denoising CNN</h3>
<p>FFDNet（同為張凱團隊，2018 年 IEEE TIP）解決了 DnCNN 的兩個實用性問題：</p>

<p><strong>1. 噪聲水平可控</strong>：FFDNet 接受一張 Noise Level Map（σ Map）作為額外輸入，與含噪影像一起送入網路。這意味著：(1) 使用者可以透過調整 σ Map 來控制降噪強度——σ 設大一些降噪更強（但可能損失細節），σ 設小一些保留更多細節；(2) σ Map 可以是空間不均勻的，實現空間自適應降噪；(3) 一個模型即可處理所有噪聲水平。</p>

<p><strong>2. PixelShuffle 降維</strong>：FFDNet 在網路入口使用 PixelShuffle（又稱 Space-to-Depth）將輸入影像降採樣 2 倍，把 H×W×1 變成 H/2×W/2×4。這樣做的好處是：(1) 計算量降低約 4 倍（特徵圖面積為 1/4）；(2) 等效增大了感受野（用較少層數覆蓋較大的空間範圍）；(3) 減少了 Checkerboard Artifact 的風險。網路末端使用逆 PixelShuffle 恢復原始解析度。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在實際 ISP 部署中，深度學習降噪面臨的主要挑戰是計算效率。典型的手機 ISP 需要在 33ms 內處理一幀 12MP 影像。當前的策略包括：(1) 模型量化（INT8/INT4）；(2) 知識蒸餾（用大模型訓練小模型）；(3) 使用 DSP/NPU 硬體加速；(4) 只在最耗時的場景（夜景模式）啟用 DL 降噪。近年來的 PMRID、NAFNet 等輕量化設計已可在手機 NPU 上即時運行。</p>
</div>

<h3>後續發展</h3>
<p>DnCNN 和 FFDNet 之後，深度學習降噪領域的重要進展包括：<strong>N2N (Noise2Noise)</strong> 證明不需要乾淨的 Ground Truth 也能訓練降噪器——只需噪聲的成對樣本；<strong>N2V (Noise2Void)</strong> 和 <strong>N2S (Noise2Self)</strong> 進一步放寬到只需要單張含噪影像；<strong>NAFNet</strong> 使用簡化的非線性激活達到了更好的效能；<strong>Restormer</strong> 和 <strong>SwinIR</strong> 引入 Transformer 架構達到了新的 SOTA。這些進展不斷推動著影像降噪的上限。</p>
`
    },
    {
      id: "ch3_8",
      title: "Chroma NR vs Luma NR",
      content: `
<p>人類視覺系統（Human Visual System, HVS）對亮度（Luminance）和色度（Chrominance）的敏感度有顯著差異：我們對亮度變化非常敏感，能感知到細微的紋理和邊緣；但對色度變化的敏感度較低，尤其是在高頻的色彩細節上。這個視覺特性是 ISP 降噪策略的重要基礎——對 Luma 和 Chroma 通道應用不同強度的降噪處理。</p>

<div class="diagram">
<svg viewBox="0 0 750 460" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="460" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">Chroma NR vs Luma NR：通道分離降噪策略</text>

  <!-- Input YCbCr -->
  <rect x="30" y="55" width="100" height="160" rx="5" fill="white" stroke="#5a5550" stroke-width="2"/>
  <text x="80" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">YCbCr 分離</text>

  <!-- Y channel -->
  <rect x="42" y="85" width="76" height="32" rx="3" fill="#f0f0e0" stroke="#8a8a3a" stroke-width="1.5"/>
  <text x="80" y="106" text-anchor="middle" font-size="11" font-weight="bold" fill="#5a5550">Y（亮度）</text>

  <!-- Cb channel -->
  <rect x="42" y="125" width="76" height="32" rx="3" fill="#d0e0f8" stroke="#5070b0" stroke-width="1.5"/>
  <text x="80" y="146" text-anchor="middle" font-size="11" font-weight="bold" fill="#5070b0">Cb（藍色差）</text>

  <!-- Cr channel -->
  <rect x="42" y="165" width="76" height="32" rx="3" fill="#f8d0d0" stroke="#b05050" stroke-width="1.5"/>
  <text x="80" y="186" text-anchor="middle" font-size="11" font-weight="bold" fill="#b05050">Cr（紅色差）</text>

  <!-- Y NR path -->
  <line x1="130" y1="101" x2="175" y2="101" stroke="#8a8a3a" stroke-width="2" marker-end="url(#arrowChNR)"/>

  <rect x="175" y="58" width="200" height="88" rx="5" fill="white" stroke="#8a8a3a" stroke-width="1.5"/>
  <text x="275" y="78" text-anchor="middle" font-size="11" font-weight="bold" fill="#8a8a3a">Luma NR（弱 → 中）</text>
  <text x="275" y="95" text-anchor="middle" font-size="9" fill="#5a5550">Edge-Preserving Filter</text>
  <text x="275" y="110" text-anchor="middle" font-size="9" fill="#5a5550">保留紋理和邊緣細節</text>

  <!-- NR Strength bar for Y -->
  <rect x="188" y="120" width="175" height="15" rx="2" fill="#d5cec7"/>
  <rect x="188" y="120" width="60" height="15" rx="2" fill="#8a8a3a" opacity="0.6"/>
  <text x="275" y="131" text-anchor="middle" font-size="8" fill="white">▎降噪強度：低~中</text>

  <!-- Chroma NR path -->
  <line x1="130" y1="141" x2="175" y2="200" stroke="#5070b0" stroke-width="2" marker-end="url(#arrowChNR)"/>
  <line x1="130" y1="181" x2="175" y2="220" stroke="#b05050" stroke-width="2" marker-end="url(#arrowChNR)"/>

  <rect x="175" y="165" width="200" height="100" rx="5" fill="white" stroke="#5060b0" stroke-width="1.5"/>
  <text x="275" y="185" text-anchor="middle" font-size="11" font-weight="bold" fill="#5060b0">Chroma NR（中 → 強）</text>
  <text x="275" y="202" text-anchor="middle" font-size="9" fill="#5a5550">可激進地平滑色度噪聲</text>
  <text x="275" y="217" text-anchor="middle" font-size="9" fill="#5a5550">HVS 對色度高頻不敏感</text>

  <!-- NR Strength bar for Chroma -->
  <rect x="188" y="232" width="175" height="15" rx="2" fill="#d5cec7"/>
  <rect x="188" y="232" width="140" height="15" rx="2" fill="#5060b0" opacity="0.6"/>
  <text x="275" y="243" text-anchor="middle" font-size="8" fill="white">▎降噪強度：中~高</text>

  <!-- Merge -->
  <line x1="375" y1="101" x2="420" y2="150" stroke="#8a8a3a" stroke-width="1.5"/>
  <line x1="375" y1="215" x2="420" y2="165" stroke="#5060b0" stroke-width="1.5"/>

  <rect x="420" y="130" width="90" height="50" rx="5" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="2"/>
  <text x="465" y="152" text-anchor="middle" font-size="11" font-weight="bold" fill="#6a8a7a">合併</text>
  <text x="465" y="168" text-anchor="middle" font-size="9" fill="#5a5550">YCbCr→RGB</text>

  <line x1="510" y1="155" x2="550" y2="155" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowChNR)"/>

  <rect x="550" y="130" width="80" height="50" rx="4" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="590" y="152" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a8a7a">降噪輸出</text>
  <text x="590" y="167" text-anchor="middle" font-size="9" fill="#8a8580">Clean Image</text>

  <!-- Visual sensitivity comparison -->
  <text x="375" y="300" text-anchor="middle" font-size="14" font-weight="bold" fill="#5a5550">人眼 CSF 對 Luma / Chroma 的敏感度差異</text>

  <rect x="80" y="315" width="590" height="135" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>

  <!-- Axes -->
  <line x1="120" y1="420" x2="630" y2="420" stroke="#8a8580" stroke-width="1"/>
  <line x1="120" y1="325" x2="120" y2="425" stroke="#8a8580" stroke-width="1"/>
  <text x="375" y="445" text-anchor="middle" font-size="10" fill="#8a8580">空間頻率 (cycles/degree)</text>
  <text x="95" y="375" text-anchor="middle" font-size="9" fill="#8a8580" transform="rotate(-90,95,375)">對比敏感度</text>

  <!-- Ticks -->
  <text x="180" y="435" text-anchor="middle" font-size="8" fill="#8a8580">1</text>
  <text x="280" y="435" text-anchor="middle" font-size="8" fill="#8a8580">5</text>
  <text x="400" y="435" text-anchor="middle" font-size="8" fill="#8a8580">10</text>
  <text x="520" y="435" text-anchor="middle" font-size="8" fill="#8a8580">30</text>
  <text x="610" y="435" text-anchor="middle" font-size="8" fill="#8a8580">60</text>

  <!-- Luma sensitivity curve (high, extends far) -->
  <path d="M140,400 Q200,345 280,335 Q350,340 420,360 Q500,390 580,418" fill="none" stroke="#8a8a3a" stroke-width="2.5"/>
  <text x="470" y="378" font-size="11" font-weight="bold" fill="#8a8a3a">Y (Luma)</text>

  <!-- Chroma sensitivity curve (lower, drops faster) -->
  <path d="M140,405 Q180,375 230,370 Q300,380 360,400 Q400,412 440,418" fill="none" stroke="#5060b0" stroke-width="2.5" stroke-dasharray="6,3"/>
  <text x="350" y="410" font-size="11" font-weight="bold" fill="#5060b0">C (Chroma)</text>

  <!-- Annotation -->
  <rect x="450" y="335" width="190" height="50" rx="4" fill="#fff3e0" opacity="0.8" stroke="#e8a04a" stroke-width="1"/>
  <text x="545" y="353" text-anchor="middle" font-size="9" fill="#e8a04a">Chroma 在高頻處</text>
  <text x="545" y="367" text-anchor="middle" font-size="9" fill="#e8a04a">敏感度快速下降</text>
  <text x="545" y="381" text-anchor="middle" font-size="9" fill="#e8a04a">→ 可強力降噪不失真</text>

  <defs>
    <marker id="arrowChNR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/>
    </marker>
  </defs>
</svg>
<div class="caption">圖 3-8：Y/Cb/Cr 通道分離降噪策略及人眼對比敏感度函數（CSF）差異</div>
</div>

<h3>為何分離 Luma 和 Chroma 降噪？</h3>
<p>Contrast Sensitivity Function (CSF) 實驗顯示，人眼對亮度的空間頻率敏感度可達約 30-60 cycles/degree，但對色度的敏感度在 10 cycles/degree 以上就快速下降。這意味著：</p>
<ul>
  <li><strong>Luma 通道</strong>：包含了影像的大部分結構資訊（邊緣、紋理、文字），必須謹慎降噪，過度降噪會立即被察覺為「模糊」或「油畫感」。</li>
  <li><strong>Chroma 通道</strong>：高頻色度噪聲（表現為隨機的彩色斑點，即 Color Noise 或 Chroma Noise）非常刺眼且不自然，但激進的色度平滑幾乎不會造成可察覺的細節損失。</li>
</ul>

<p>因此，ISP 中的標準做法是：在 YCbCr（或 YUV）色彩空間中，對亮度和色度通道施加不同強度的降噪。典型配置是色度降噪強度為亮度降噪的 2-5 倍。</p>

<h3>Luma NR 策略</h3>
<p>亮度降噪的核心挑戰是 <strong>噪聲抑制 vs 細節保留</strong> 的平衡。常用方法包括：</p>
<ul>
  <li><strong>Edge-Preserving Bilateral Filter</strong>：利用邊緣檢測引導降噪強度，在平坦區域強力降噪、邊緣附近保守。</li>
  <li><strong>Multi-Scale 降噪</strong>：在 Wavelet 或 Laplacian Pyramid 的不同尺度上用不同閾值，低頻子帶（大面積的灰度漸變）較強降噪，高頻子帶（細小紋理）較弱降噪。</li>
  <li><strong>Texture-Aware NR</strong>：使用紋理檢測器（如局部方差、梯度直方圖）來識別紋理區域，對紋理豐富的區域降低降噪強度。</li>
</ul>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>Luma NR 過強會導致「蠟像感」（Waxy Skin Effect），尤其在人臉皮膚上特別明顯——皮膚紋理被抹除，看起來像塑膠假人。現代手機 ISP 通常整合人臉檢測，在偵測到的人臉區域自動降低 Luma NR 強度，或使用專門的 Portrait NR 模式。</p>
</div>

<h3>Chroma NR 策略</h3>
<p>色度降噪可以更加激進，常見方法有：</p>
<ul>
  <li><strong>大核 Gaussian / Box Filter</strong>：直接對 Cb/Cr 通道施加大半徑（如 7×7 到 15×15）的低通濾波。由於人眼對色度的空間頻率不敏感，即使使用較大的核也不會產生明顯的模糊感。</li>
  <li><strong>Chroma-Guided Bilateral Filter</strong>：以 Y 通道作為引導圖（Guide Image），對 Cb/Cr 進行 Cross-Bilateral Filtering。這樣可以確保色度降噪在亮度邊緣處保持銳利——即使是強力平滑，色度邊界也與亮度邊界對齊。</li>
  <li><strong>Median Filter</strong>：對色度通道使用 Median Filter 可有效去除離群的彩色斑點噪聲（Impulse-type Chroma Noise），效果優於均值類濾波。</li>
</ul>

<h3>實務中的通道耦合問題</h3>
<p>需注意的是，Y/Cb/Cr 通道並非完全獨立。由於 RGB→YCbCr 的線性轉換，RGB 域的噪聲在轉換後會在各通道間產生相關性。嚴格來說，最優降噪應該考慮通道間的噪聲協方差矩陣。但在實務中，通常忽略這種相關性，分別對各通道獨立降噪，因為其引入的效能損失相比實現的簡化是可以接受的。</p>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>一個典型手機 ISP 的 YUV NR 設定（ISO 3200 條件）：Y 通道使用 σ_spatial=3, σ_range=12 的 Bilateral Filter；Cb/Cr 通道使用 σ_spatial=5, σ_range=25 的 Bilateral Filter，降噪強度約為 Y 通道的 2-3 倍。某些高階 ISP 還會額外對 Cb/Cr 做一次 5×5 Median Filter 去除殘留的彩色點噪聲。全程由 NLF 參數自動驅動，不同 ISO 對應不同的降噪強度 LUT。</p>
</div>
`
    },
    {
      id: "ch3_9",
      title: "RAW Domain NR vs YUV Domain NR",
      content: `
<p>在 ISP 管線中，降噪可以在不同的處理階段進行，最常見的兩個位置是 RAW 域和 YUV 域。由於這兩個階段的訊號特性、噪聲特性和可用資訊截然不同，降噪的策略和效果也有很大差異。理解這兩者的優劣勢是設計高效 ISP 降噪管線的關鍵。</p>

<div class="diagram">
<svg viewBox="0 0 750 420" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="420" fill="#f5f0eb" rx="8"/>
  <text x="375" y="25" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">ISP Pipeline 中 NR 的位置</text>

  <!-- Pipeline flow -->
  <!-- Sensor -->
  <rect x="20" y="52" width="70" height="40" rx="4" fill="#8a8580" opacity="0.2" stroke="#8a8580" stroke-width="1.5"/>
  <text x="55" y="76" text-anchor="middle" font-size="9" font-weight="bold" fill="#5a5550">Sensor</text>

  <line x1="90" y1="72" x2="108" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- BLC -->
  <rect x="108" y="52" width="55" height="40" rx="4" fill="white" stroke="#8a8580" stroke-width="1"/>
  <text x="135" y="70" text-anchor="middle" font-size="8" fill="#5a5550">BLC</text>
  <text x="135" y="82" text-anchor="middle" font-size="7" fill="#8a8580">黑電平</text>

  <line x1="163" y1="72" x2="178" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- RAW NR location -->
  <rect x="178" y="42" width="90" height="60" rx="6" fill="#e8a04a" opacity="0.15" stroke="#e8a04a" stroke-width="2.5"/>
  <text x="223" y="62" text-anchor="middle" font-size="10" font-weight="bold" fill="#e8a04a">RAW NR</text>
  <text x="223" y="78" text-anchor="middle" font-size="8" fill="#e8a04a">Bayer 域降噪</text>
  <text x="223" y="92" text-anchor="middle" font-size="7" fill="#8a8580">⭐ 位置 1</text>

  <line x1="268" y1="72" x2="283" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- Demosaic -->
  <rect x="283" y="52" width="70" height="40" rx="4" fill="white" stroke="#8a8580" stroke-width="1"/>
  <text x="318" y="68" text-anchor="middle" font-size="8" fill="#5a5550">Demosaic</text>
  <text x="318" y="80" text-anchor="middle" font-size="7" fill="#8a8580">去馬賽克</text>

  <line x1="353" y1="72" x2="368" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- AWB + CCM -->
  <rect x="368" y="52" width="70" height="40" rx="4" fill="white" stroke="#8a8580" stroke-width="1"/>
  <text x="403" y="66" text-anchor="middle" font-size="8" fill="#5a5550">AWB</text>
  <text x="403" y="78" text-anchor="middle" font-size="8" fill="#5a5550">+CCM</text>

  <line x1="438" y1="72" x2="453" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- Gamma -->
  <rect x="453" y="52" width="55" height="40" rx="4" fill="white" stroke="#8a8580" stroke-width="1"/>
  <text x="480" y="70" text-anchor="middle" font-size="8" fill="#5a5550">Gamma</text>
  <text x="480" y="82" text-anchor="middle" font-size="7" fill="#8a8580">Tone</text>

  <line x1="508" y1="72" x2="523" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- CSC -->
  <rect x="523" y="52" width="55" height="40" rx="4" fill="white" stroke="#8a8580" stroke-width="1"/>
  <text x="550" y="70" text-anchor="middle" font-size="8" fill="#5a5550">CSC</text>
  <text x="550" y="82" text-anchor="middle" font-size="7" fill="#8a8580">RGB→YUV</text>

  <line x1="578" y1="72" x2="593" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- YUV NR location -->
  <rect x="593" y="42" width="90" height="60" rx="6" fill="#5060b0" opacity="0.15" stroke="#5060b0" stroke-width="2.5"/>
  <text x="638" y="62" text-anchor="middle" font-size="10" font-weight="bold" fill="#5060b0">YUV NR</text>
  <text x="638" y="78" text-anchor="middle" font-size="8" fill="#5060b0">亮度/色度降噪</text>
  <text x="638" y="92" text-anchor="middle" font-size="7" fill="#8a8580">⭐ 位置 2</text>

  <line x1="683" y1="72" x2="698" y2="72" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowRAW)"/>

  <!-- Output -->
  <rect x="698" y="52" width="40" height="40" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="718" y="76" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Out</text>

  <!-- RAW NR Advantages -->
  <rect x="30" y="125" width="330" height="280" rx="6" fill="white" stroke="#e8a04a" stroke-width="2"/>
  <rect x="30" y="125" width="330" height="28" rx="6" fill="#e8a04a" opacity="0.15"/>
  <text x="195" y="143" text-anchor="middle" font-size="13" font-weight="bold" fill="#e8a04a">RAW Domain NR</text>

  <text x="50" y="172" font-size="11" font-weight="bold" fill="#6a8a7a">✓ 優勢</text>
  <text x="50" y="192" font-size="10" fill="#5a5550">• 噪聲模型最純粹：Poisson-Gaussian</text>
  <text x="50" y="209" font-size="10" fill="#5a5550">• 噪聲尚未被 Demosaic 擴散</text>
  <text x="50" y="226" font-size="10" fill="#5a5550">• 線性域，NLF 為嚴格線性</text>
  <text x="50" y="243" font-size="10" fill="#5a5550">• 減少後續 Demosaic 的偽影</text>
  <text x="50" y="260" font-size="10" fill="#5a5550">• 各 Bayer 通道獨立處理</text>

  <text x="50" y="290" font-size="11" font-weight="bold" fill="#d35050">✗ 劣勢</text>
  <text x="50" y="310" font-size="10" fill="#5a5550">• 只有單色 Bayer 資訊</text>
  <text x="50" y="327" font-size="10" fill="#5a5550">• 無法區分 Luma/Chroma</text>
  <text x="50" y="344" font-size="10" fill="#5a5550">• Bayer 格式使鄰域分析複雜</text>
  <text x="50" y="361" font-size="10" fill="#5a5550">• 邊緣方向資訊不完整</text>
  <text x="50" y="378" font-size="10" fill="#5a5550">• 記憶體需求高（14-bit RAW）</text>
  <text x="50" y="398" font-size="9" fill="#8a8580">常用：Bilateral on Bayer, Green Channel Guide</text>

  <!-- YUV NR Advantages -->
  <rect x="390" y="125" width="330" height="280" rx="6" fill="white" stroke="#5060b0" stroke-width="2"/>
  <rect x="390" y="125" width="330" height="28" rx="6" fill="#5060b0" opacity="0.15"/>
  <text x="555" y="143" text-anchor="middle" font-size="13" font-weight="bold" fill="#5060b0">YUV Domain NR</text>

  <text x="410" y="172" font-size="11" font-weight="bold" fill="#6a8a7a">✓ 優勢</text>
  <text x="410" y="192" font-size="10" fill="#5a5550">• 完整的色彩資訊可用</text>
  <text x="410" y="209" font-size="10" fill="#5a5550">• Luma / Chroma 可分別調整</text>
  <text x="410" y="226" font-size="10" fill="#5a5550">• 更好的邊緣與紋理辨識</text>
  <text x="410" y="243" font-size="10" fill="#5a5550">• 符合 HVS 的視覺模型</text>
  <text x="410" y="260" font-size="10" fill="#5a5550">• 豐富的高階特徵可利用</text>

  <text x="410" y="290" font-size="11" font-weight="bold" fill="#d35050">✗ 劣勢</text>
  <text x="410" y="310" font-size="10" fill="#5a5550">• 噪聲已被 Demosaic 擴散和相關化</text>
  <text x="410" y="327" font-size="10" fill="#5a5550">• Gamma 使噪聲模型非線性</text>
  <text x="410" y="344" font-size="10" fill="#5a5550">• CCM 放大了某些通道噪聲</text>
  <text x="410" y="361" font-size="10" fill="#5a5550">• 處理位於管線後端，延遲大</text>
  <text x="410" y="378" font-size="10" fill="#5a5550">• 已損失的高頻細節無法恢復</text>
  <text x="410" y="398" font-size="9" fill="#8a8580">常用：Bilateral, Guided Filter, CNN-based</text>

  <defs>
    <marker id="arrowRAW" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/></marker>
  </defs>
</svg>
<div class="caption">圖 3-9：ISP 管線中 RAW NR 與 YUV NR 的位置及各自的優劣勢比較</div>
</div>

<h3>RAW Domain NR</h3>
<p>RAW 域降噪在 Demosaic 之前進行，直接處理感測器輸出的 Bayer 格式資料。此時的噪聲具有最「乾淨」的統計特性：</p>

<p><strong>噪聲模型優勢</strong>：RAW 資料是線性的（未經 Gamma），噪聲嚴格遵循 Poisson-Gaussian 模型，NLF σ²=aμ+b 的線性關係成立。每個像素的噪聲是獨立的（IID），因為尚未經過任何空間濾波操作。這使得噪聲估計非常準確，降噪演算法可以精確控制。</p>

<p><strong>防止噪聲擴散</strong>：Demosaic 過程會將每個像素的噪聲擴散到鄰域（因為它需要從鄰近像素插值缺失的色彩分量）。如果先降噪再 Demosaic，可以大幅降低 Demosaic 產生的偽色（False Color）和拉鍊效應（Zipper Effect），因為這些偽影很大程度上是由噪聲引起的。</p>

<p><strong>Bayer 格式的挑戰</strong>：RAW 資料是馬賽克格式（RGGB），同一位置只有一個色彩值。這意味著：(1) 無法直接做 Y/Cb/Cr 分離；(2) 鄰域像素可能屬於不同色彩通道，直接比較不合適；(3) 需要特殊的 Bayer-aware 濾波器設計。常見做法是分別對 R、Gr、Gb、B 四個子通道各自降噪，或用 G 通道（密度最高）作為引導圖。</p>

<h3>YUV Domain NR</h3>
<p>YUV 域降噪在 Demosaic、White Balance、Color Correction、Gamma 等處理之後進行。此時擁有完整的色彩資訊和非線性映射後的影像：</p>

<p><strong>Luma/Chroma 分離的優勢</strong>：如上一節所述，在 YUV 域中可以對亮度和色度通道施加差異化降噪，這是 RAW 域無法做到的。這個能力對於最終視覺品質至關重要——強力消除色度噪聲、適度保留亮度細節。</p>

<p><strong>噪聲模型的複雜化</strong>：經過 Demosaic 後，噪聲不再是像素獨立的，相鄰像素的噪聲產生了空間相關性。Gamma Correction 將線性噪聲轉換為非線性，使得暗部噪聲被相對放大、亮部噪聲被相對壓縮。CCM（Color Correction Matrix）可能將某些通道的噪聲放大（特別是 Saturation Enhancement 會放大色度噪聲）。這些都使得精確的噪聲建模更加困難。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>現代高品質 ISP 幾乎都採用 <strong>Dual-Stage NR</strong>（雙階段降噪）架構：第一階段在 RAW 域做基礎降噪（利用純粹的噪聲模型優勢），第二階段在 YUV 域做精細降噪（利用 Luma/Chroma 分離的優勢）。兩個階段互補，合力達到最佳的降噪效果。Qualcomm Spectra、Apple ISP、Samsung SLSI 等主流手機 ISP 都採用這種架構。</p>
</div>

<h3>Hybrid NR 實務設計</h3>
<p>在雙階段架構中，兩個 NR 模組的角色分工通常如下：</p>

<table>
<tr><th>階段</th><th>主要目標</th><th>典型方法</th><th>降噪強度</th></tr>
<tr><td>RAW NR</td><td>消除大部分隨機噪聲，減少 Demosaic 偽影</td><td>Bilateral on Bayer, Wavelet</td><td>中等（60-80% noise removed）</td></tr>
<tr><td>YUV Luma NR</td><td>精細的亮度降噪，保留紋理</td><td>Edge-Preserving Filter, NLM</td><td>低（殘餘噪聲的 20-40%）</td></tr>
<tr><td>YUV Chroma NR</td><td>強力消除色度噪聲</td><td>Large-kernel Bilateral, Median</td><td>高（殘餘色噪的 80-95%）</td></tr>
</table>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>另一種新興的方法是 <strong>RAW-to-RGB End-to-End DL NR</strong>，直接用深度學習模型處理 RAW 資料並輸出最終 RGB 影像，跳過傳統 ISP 管線。Google 的 Night Sight 和某些計算攝影模式就採用了這種方法。優勢是模型可以端到端地優化，避免了 ISP 各模組之間的資訊損失。但挑戰在於需要大量的 RAW-RGB 配對訓練資料，且不同感測器需要分別訓練。</p>
</div>
`
    },
    {
      id: "ch3_10",
      title: "降噪強度 vs 細節保留",
      content: `
<p>降噪（Noise Reduction）與細節保留（Detail Preservation）之間存在根本性的矛盾——這是影像處理中最經典的 Trade-Off 之一。噪聲和細節在統計特性上有很大的重疊：兩者都是高頻的、小幅度的空間變化。任何降噪演算法在移除噪聲時，都不可避免地會損失一部分細節。ISP 工程師的核心任務就是在這兩者之間找到最佳平衡點。</p>

<div class="diagram">
<svg viewBox="0 0 750 450" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="450" fill="#f5f0eb" rx="8"/>
  <text x="375" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">降噪強度 vs 細節保留 Trade-Off 曲線</text>

  <!-- Main chart area -->
  <rect x="80" y="45" width="400" height="300" rx="4" fill="white" stroke="#d5cec7" stroke-width="1"/>

  <!-- Axes -->
  <line x1="100" y1="320" x2="460" y2="320" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="100" y1="320" x2="100" y2="60" stroke="#5a5550" stroke-width="1.5"/>

  <text x="280" y="350" text-anchor="middle" font-size="12" fill="#5a5550">NR Strength（降噪強度）→</text>
  <text x="55" y="190" text-anchor="middle" font-size="11" fill="#5a5550" transform="rotate(-90,55,190)">Quality Metric</text>

  <!-- PSNR/Noise Removal curve (goes up then plateaus) -->
  <path d="M110,300 Q160,230 220,170 Q280,130 340,110 Q400,100 450,98" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="385" y="92" font-size="11" font-weight="bold" fill="#6a8a7a">PSNR (Noise Removal)</text>

  <!-- Detail Preservation curve (goes down) -->
  <path d="M110,80 Q160,85 220,120 Q280,170 340,230 Q400,280 450,305" fill="none" stroke="#d35050" stroke-width="2.5"/>
  <text x="420" y="275" font-size="11" font-weight="bold" fill="#d35050">Detail / Texture</text>

  <!-- Perceptual Quality curve (bell-shaped) -->
  <path d="M110,250 Q160,170 220,120 Q260,105 290,100 Q330,110 370,160 Q420,240 450,280" fill="none" stroke="#5060b0" stroke-width="2.5" stroke-dasharray="6,3"/>
  <text x="330" y="155" font-size="11" font-weight="bold" fill="#5060b0">Perceptual Quality</text>

  <!-- Optimal point -->
  <circle cx="270" cy="100" r="8" fill="#e8a04a" opacity="0.8" stroke="#e8a04a" stroke-width="2"/>
  <text x="270" y="75" text-anchor="middle" font-size="11" font-weight="bold" fill="#e8a04a">最佳平衡點 ★</text>
  <line x1="270" y1="108" x2="270" y2="320" stroke="#e8a04a" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Zones -->
  <rect x="105" y="295" width="80" height="20" rx="2" fill="#6a8a7a" opacity="0.1"/>
  <text x="145" y="309" text-anchor="middle" font-size="8" fill="#6a8a7a">Under-NR</text>
  <rect x="375" y="295" width="80" height="20" rx="2" fill="#d35050" opacity="0.1"/>
  <text x="415" y="309" text-anchor="middle" font-size="8" fill="#d35050">Over-NR</text>

  <!-- Right side: Visual examples -->
  <rect x="510" y="45" width="220" height="300" rx="6" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="620" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">視覺效果對比</text>

  <!-- Under-NR example -->
  <rect x="525" y="80" width="80" height="55" rx="3" fill="#f0f0e0" stroke="#8a8580" stroke-width="1"/>
  <!-- Noise dots -->
  <circle cx="540" cy="95" r="1.5" fill="#8a8580"/><circle cx="555" cy="90" r="1" fill="#8a8580"/>
  <circle cx="570" cy="100" r="1.5" fill="#8a8580"/><circle cx="585" cy="88" r="1" fill="#8a8580"/>
  <circle cx="548" cy="108" r="1" fill="#8a8580"/><circle cx="562" cy="115" r="1.5" fill="#8a8580"/>
  <circle cx="578" cy="105" r="1" fill="#8a8580"/><circle cx="535" cy="118" r="1.5" fill="#8a8580"/>
  <circle cx="592" cy="112" r="1" fill="#8a8580"/><circle cx="545" cy="125" r="1" fill="#8a8580"/>
  <!-- Texture line preserved -->
  <line x1="530" y1="98" x2="600" y2="98" stroke="#5a5550" stroke-width="0.8"/>
  <line x1="530" y1="108" x2="600" y2="108" stroke="#5a5550" stroke-width="0.8"/>

  <text x="620" y="97" font-size="9" fill="#6a8a7a">NR 不足</text>
  <text x="620" y="110" font-size="9" fill="#5a5550">噪聲殘留多</text>
  <text x="620" y="123" font-size="9" fill="#6a8a7a">紋理保留 ✓</text>

  <!-- Optimal NR -->
  <rect x="525" y="148" width="80" height="55" rx="3" fill="#f0f0e0" stroke="#e8a04a" stroke-width="1.5"/>
  <line x1="530" y1="168" x2="600" y2="168" stroke="#5a5550" stroke-width="0.8"/>
  <line x1="530" y1="178" x2="600" y2="178" stroke="#5a5550" stroke-width="0.8"/>
  <circle cx="555" cy="163" r="0.8" fill="#8a8580" opacity="0.5"/>
  <circle cx="580" cy="185" r="0.8" fill="#8a8580" opacity="0.5"/>

  <text x="620" y="165" font-size="9" fill="#e8a04a">★ 最佳平衡</text>
  <text x="620" y="178" font-size="9" fill="#5a5550">噪聲適度抑制</text>
  <text x="620" y="191" font-size="9" fill="#6a8a7a">紋理自然 ✓</text>

  <!-- Over-NR -->
  <rect x="525" y="218" width="80" height="55" rx="3" fill="#f0f0e0" stroke="#d35050" stroke-width="1.5"/>
  <!-- Smooth, no texture -->
  <rect x="535" y="228" width="60" height="35" rx="2" fill="#e8e4d8"/>

  <text x="620" y="237" font-size="9" fill="#d35050">NR 過度</text>
  <text x="620" y="250" font-size="9" fill="#5a5550">蠟像感/油畫感</text>
  <text x="620" y="263" font-size="9" fill="#d35050">紋理消失 ✗</text>

  <!-- Metrics explanation -->
  <rect x="50" y="370" width="650" height="70" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="375" y="390" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">常用品質評估指標</text>
  <text x="140" y="412" text-anchor="middle" font-size="10" fill="#6a8a7a">PSNR / SSIM</text>
  <text x="140" y="427" text-anchor="middle" font-size="9" fill="#8a8580">全參考指標</text>
  <text x="310" y="412" text-anchor="middle" font-size="10" fill="#5060b0">LPIPS / FID</text>
  <text x="310" y="427" text-anchor="middle" font-size="9" fill="#8a8580">感知品質指標</text>
  <text x="480" y="412" text-anchor="middle" font-size="10" fill="#e8a04a">Dead Leaves / SFR</text>
  <text x="480" y="427" text-anchor="middle" font-size="9" fill="#8a8580">紋理解析度指標</text>
  <text x="630" y="412" text-anchor="middle" font-size="10" fill="#d35050">Visual Noise VN</text>
  <text x="630" y="427" text-anchor="middle" font-size="9" fill="#8a8580">噪聲可見度指標</text>
</svg>
<div class="caption">圖 3-10：降噪強度 vs 細節保留的 Trade-Off 曲線，以及不同降噪程度的視覺效果對比</div>
</div>

<h3>Trade-Off 的本質</h3>
<p>從資訊理論的角度看，含噪影像的觀測值 y = x + n 中，訊號 x 和噪聲 n 在頻譜上有大量重疊。高頻的紋理細節（如皮膚毛孔、布料纖維、樹葉紋路）和噪聲都表現為小幅度的空間高頻變化。任何線性濾波器都無法完美區分兩者——抑制高頻噪聲的同時必然也會衰減高頻細節。這就是為什麼 Perceptual Quality 曲線呈倒 U 型：降噪太弱看到噪聲，降噪太強看到模糊，中間某處是感知品質的最佳點。</p>

<h3>客觀評估指標</h3>
<p>衡量降噪效果需要多維度的指標體系：</p>
<ul>
  <li><strong>PSNR（Peak Signal-to-Noise Ratio）</strong>：最基本的全參考指標，衡量重建影像與原始影像的均方誤差。簡單直覺，但與感知品質的相關性較差——PSNR 最高的結果往往過度平滑。</li>
  <li><strong>SSIM（Structural Similarity）</strong>：考慮了亮度、對比度和結構三個維度的相似性，比 PSNR 更貼近人眼感知，但仍不夠理想。</li>
  <li><strong>LPIPS（Learned Perceptual Image Patch Similarity）</strong>：使用深度學習特徵計算的感知距離，與人類主觀評分有更好的相關性。</li>
  <li><strong>Dead Leaves / Texture Acutance</strong>：專門衡量降噪後的紋理解析能力，使用 Dead Leaves 圖卡或類似的紋理測試圖。</li>
  <li><strong>Visual Noise (VN)</strong>：ISO 15739 標準定義的噪聲可見度指標，量化平坦區域中殘留噪聲的感知強度。</li>
</ul>

<div class="info-box key">
<div class="box-title">重點</div>
<p>在 ISP Tuning 中，我們追求的不是 PSNR 最大化，而是 <strong>Perceptual Quality 最大化</strong>。這意味著：(1) 在平坦區域（天空、牆壁）要強力降噪，因為這裡的噪聲最明顯；(2) 在紋理區域（布料、植物）要保守降噪，因為紋理損失比噪聲殘留更不可接受；(3) 在邊緣要精確保留，因為邊緣模糊會被立即察覺。</p>
</div>

<h3>自適應降噪策略</h3>
<p>高品質降噪的關鍵在於 <strong>空間自適應</strong>（Spatially Adaptive）——根據局部內容特性動態調整降噪強度。實現方法包括：</p>

<p><strong>1. 紋理/平坦區域分類</strong>：通過計算局部方差、梯度幅值或 Laplacian 響應，將像素分為「平坦」、「紋理」和「邊緣」三類。平坦區域施加最強降噪，邊緣區域最弱，紋理區域居中。</p>

<p><strong>2. 基於噪聲模型的自適應</strong>：利用 NLF 精確估計每個像素位置的噪聲標準差 σ(μ)，根據局部 SNR 調整降噪閾值。暗部 SNR 低，降噪更強；亮部 SNR 高，降噪較輕。</p>

<p><strong>3. 語意感知降噪</strong>：利用語意分割或物件偵測的結果，對不同語意區域施加不同降噪策略。例如：人臉區域使用特殊的保膚策略、文字區域保留銳利邊緣、天空區域強力降噪。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在實際 ISP Tuning 工作中，工程師需要大量的主觀評測（Subjective Evaluation）。通常會建立一個 Test Image Set（30-100 張不同場景的影像），讓多位評測人員在校準過的顯示器上對不同降噪設定進行盲測評分。最終的降噪參數是客觀指標和主觀評分的綜合結果。業界常用的主觀評測標準包括 ITU-R BT.500 和 DXOMARK 的評分方法。</p>
</div>

<h3>Perception-Distortion Trade-Off</h3>
<p>2018 年 Blau 和 Michaeli 在 ICML 上發表的論文正式證明了 <strong>Perception-Distortion Trade-Off</strong>：不可能同時最小化 Distortion（如 MSE）和最大化 Perceptual Quality（如分佈匹配度）。這意味著：PSNR 最高的降噪結果在感知上可能不是最好的——它往往過於平滑、缺乏自然紋理。近年來的 GAN-based 降噪（如 SRGAN 的降噪版本）可以生成更自然的紋理，但 PSNR 可能略低。ISP 的降噪策略需要在這個根本性的 Trade-Off 上做出選擇。</p>
`
    },
    {
      id: "ch3_11",
      title: "Noise Profile 與 Noise Calibration",
      content: `
<p>Noise Profile（噪聲配置檔）是連接感測器硬體特性和降噪演算法的關鍵橋梁。它記錄了特定感測器在各種 ISO/增益設定下的噪聲特性參數，使 ISP 降噪模組能夠根據當前的拍攝條件自動調整降噪強度。Noise Calibration（噪聲校準）則是獲取這些參數的測量過程。</p>

<div class="diagram">
<svg viewBox="0 0 750 480" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="480" fill="#f5f0eb" rx="8"/>
  <text x="375" y="25" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">Noise Calibration 流程與 Noise Level Function</text>

  <!-- Calibration Setup -->
  <text x="190" y="55" text-anchor="middle" font-size="13" font-weight="bold" fill="#6a8a7a">校準環境設置</text>

  <!-- Light source -->
  <rect x="30" y="70" width="80" height="55" rx="4" fill="#fff3e0" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="70" y="92" text-anchor="middle" font-size="9" font-weight="bold" fill="#e8a04a">均勻光源</text>
  <text x="70" y="106" text-anchor="middle" font-size="8" fill="#8a8580">Integrating</text>
  <text x="70" y="117" text-anchor="middle" font-size="8" fill="#8a8580">Sphere / LED</text>

  <!-- Light rays -->
  <line x1="110" y1="88" x2="145" y2="88" stroke="#e8a04a" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="110" y1="95" x2="145" y2="95" stroke="#e8a04a" stroke-width="1" stroke-dasharray="3,2"/>
  <line x1="110" y1="102" x2="145" y2="102" stroke="#e8a04a" stroke-width="1" stroke-dasharray="3,2"/>

  <!-- Grey chart -->
  <rect x="145" y="68" width="60" height="60" rx="3" fill="white" stroke="#8a8580" stroke-width="1.5"/>
  <!-- Grey patches -->
  <rect x="150" y="73" width="24" height="16" fill="#e0e0e0" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="176" y="73" width="24" height="16" fill="#b0b0b0" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="150" y="91" width="24" height="16" fill="#808080" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="176" y="91" width="24" height="16" fill="#505050" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="150" y="109" width="24" height="16" fill="#303030" stroke="#d5cec7" stroke-width="0.5"/>
  <rect x="176" y="109" width="24" height="16" fill="#101010" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="175" y="142" text-anchor="middle" font-size="8" fill="#8a8580">Grey Scale Chart</text>

  <!-- Camera -->
  <line x1="205" y1="95" x2="240" y2="95" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowNP)"/>

  <rect x="240" y="72" width="70" height="50" rx="4" fill="white" stroke="#6a8a7a" stroke-width="2"/>
  <text x="275" y="93" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Camera</text>
  <text x="275" y="106" text-anchor="middle" font-size="8" fill="#8a8580">+ Sensor</text>

  <!-- Multiple ISOs -->
  <line x1="310" y1="95" x2="345" y2="95" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowNP)"/>

  <rect x="345" y="65" width="90" height="65" rx="4" fill="white" stroke="#5060b0" stroke-width="1.5"/>
  <text x="390" y="85" text-anchor="middle" font-size="9" font-weight="bold" fill="#5060b0">拍攝多組</text>
  <text x="390" y="100" text-anchor="middle" font-size="8" fill="#5a5550">ISO 100/200/400</text>
  <text x="390" y="113" text-anchor="middle" font-size="8" fill="#5a5550">800/1600/3200...</text>
  <text x="390" y="126" text-anchor="middle" font-size="7" fill="#8a8580">每組 N 幀取平均</text>

  <!-- Processing -->
  <line x1="435" y1="95" x2="470" y2="95" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowNP)"/>

  <rect x="470" y="65" width="120" height="65" rx="4" fill="white" stroke="#d35050" stroke-width="1.5"/>
  <text x="530" y="82" text-anchor="middle" font-size="9" font-weight="bold" fill="#d35050">統計分析</text>
  <text x="530" y="98" text-anchor="middle" font-size="8" fill="#5a5550">每個灰度 patch:</text>
  <text x="530" y="112" text-anchor="middle" font-size="8" fill="#5a5550">μ = mean(pixels)</text>
  <text x="530" y="126" text-anchor="middle" font-size="8" fill="#5a5550">σ² = var(pixels)</text>

  <!-- Result -->
  <line x1="590" y1="95" x2="620" y2="95" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrowNP)"/>

  <rect x="620" y="68" width="110" height="58" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="2"/>
  <text x="675" y="87" text-anchor="middle" font-size="9" font-weight="bold" fill="#6a8a7a">Linear Fit</text>
  <text x="675" y="103" text-anchor="middle" font-size="10" fill="#6a8a7a">σ² = a·μ + b</text>
  <text x="675" y="118" text-anchor="middle" font-size="8" fill="#8a8580">→ NLF 參數 (a,b)</text>

  <!-- NLF Chart -->
  <text x="375" y="170" text-anchor="middle" font-size="13" font-weight="bold" fill="#5a5550">NLF 曲線：不同 ISO 下的噪聲水平函數</text>

  <rect x="70" y="185" width="380" height="280" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>

  <!-- Axes -->
  <line x1="100" y1="435" x2="430" y2="435" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="100" y1="435" x2="100" y2="200" stroke="#5a5550" stroke-width="1.5"/>
  <text x="265" y="460" text-anchor="middle" font-size="11" fill="#5a5550">Signal Level μ (DN)</text>
  <text x="65" y="315" text-anchor="middle" font-size="10" fill="#5a5550" transform="rotate(-90,65,315)">Noise Variance σ²</text>

  <!-- ISO 100 - lowest line -->
  <line x1="100" y1="420" x2="425" y2="390" stroke="#6a8a7a" stroke-width="2"/>
  <text x="430" y="393" font-size="9" font-weight="bold" fill="#6a8a7a">ISO 100</text>

  <!-- ISO 400 -->
  <line x1="100" y1="405" x2="425" y2="340" stroke="#5060b0" stroke-width="2"/>
  <text x="430" y="343" font-size="9" font-weight="bold" fill="#5060b0">ISO 400</text>

  <!-- ISO 1600 -->
  <line x1="100" y1="380" x2="425" y2="270" stroke="#e8a04a" stroke-width="2"/>
  <text x="430" y="273" font-size="9" font-weight="bold" fill="#e8a04a">ISO 1600</text>

  <!-- ISO 6400 -->
  <line x1="100" y1="345" x2="425" y2="210" stroke="#d35050" stroke-width="2"/>
  <text x="430" y="213" font-size="9" font-weight="bold" fill="#d35050">ISO 6400</text>

  <!-- Scatter points for ISO 1600 -->
  <circle cx="140" cy="372" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="180" cy="358" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="220" cy="345" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="260" cy="328" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="300" cy="315" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="340" cy="298" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="380" cy="280" r="3" fill="#e8a04a" opacity="0.5"/>
  <circle cx="410" cy="273" r="3" fill="#e8a04a" opacity="0.5"/>

  <!-- Annotations -->
  <path d="M115,340 L115,420" fill="none" stroke="#8a8580" stroke-width="1" marker-start="url(#arrowNP2)" marker-end="url(#arrowNP2)"/>
  <text x="128" y="385" font-size="8" fill="#8a8580">b 增大</text>
  <text x="128" y="396" font-size="8" fill="#8a8580">(Read NF)</text>

  <!-- Right side: Parameter Table -->
  <rect x="490" y="185" width="240" height="280" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="610" y="210" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">Noise Profile 參數表</text>

  <!-- Table -->
  <line x1="500" y1="220" x2="720" y2="220" stroke="#d5cec7" stroke-width="1"/>
  <text x="535" y="237" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">ISO</text>
  <text x="595" y="237" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">a</text>
  <text x="655" y="237" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">b</text>
  <text x="710" y="237" text-anchor="middle" font-size="10" font-weight="bold" fill="#5a5550">σ_r</text>
  <line x1="500" y1="243" x2="720" y2="243" stroke="#d5cec7" stroke-width="1"/>

  <text x="535" y="260" text-anchor="middle" font-size="9" fill="#6a8a7a">100</text>
  <text x="595" y="260" text-anchor="middle" font-size="9" fill="#5a5550">0.08</text>
  <text x="655" y="260" text-anchor="middle" font-size="9" fill="#5a5550">1.2</text>
  <text x="710" y="260" text-anchor="middle" font-size="9" fill="#5a5550">1.3</text>

  <text x="535" y="280" text-anchor="middle" font-size="9" fill="#5060b0">400</text>
  <text x="595" y="280" text-anchor="middle" font-size="9" fill="#5a5550">0.32</text>
  <text x="655" y="280" text-anchor="middle" font-size="9" fill="#5a5550">4.8</text>
  <text x="710" y="280" text-anchor="middle" font-size="9" fill="#5a5550">2.8</text>

  <text x="535" y="300" text-anchor="middle" font-size="9" fill="#e8a04a">1600</text>
  <text x="595" y="300" text-anchor="middle" font-size="9" fill="#5a5550">1.28</text>
  <text x="655" y="300" text-anchor="middle" font-size="9" fill="#5a5550">19.2</text>
  <text x="710" y="300" text-anchor="middle" font-size="9" fill="#5a5550">6.1</text>

  <text x="535" y="320" text-anchor="middle" font-size="9" fill="#d35050">6400</text>
  <text x="595" y="320" text-anchor="middle" font-size="9" fill="#5a5550">5.12</text>
  <text x="655" y="320" text-anchor="middle" font-size="9" fill="#5a5550">76.8</text>
  <text x="710" y="320" text-anchor="middle" font-size="9" fill="#5a5550">12.8</text>

  <line x1="500" y1="330" x2="720" y2="330" stroke="#d5cec7" stroke-width="1"/>

  <text x="610" y="352" text-anchor="middle" font-size="9" fill="#8a8580">a, b: NLF 參數 (RAW domain)</text>
  <text x="610" y="368" text-anchor="middle" font-size="9" fill="#8a8580">σ_r: 總噪聲 rms (DN)</text>
  <text x="610" y="388" text-anchor="middle" font-size="9" fill="#5a5550">a ∝ ISO (analog gain)</text>
  <text x="610" y="404" text-anchor="middle" font-size="9" fill="#5a5550">b ∝ ISO² (gain² × read noise²)</text>

  <!-- Usage flow -->
  <rect x="510" y="420" width="200" height="35" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="610" y="442" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a8a7a">ISP NR 模組查表使用</text>

  <defs>
    <marker id="arrowNP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6a8a7a"/></marker>
    <marker id="arrowNP2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8580"/></marker>
  </defs>
</svg>
<div class="caption">圖 3-11：Noise Calibration 校準流程及不同 ISO 下的 NLF 曲線族</div>
</div>

<h3>什麼是 Noise Profile？</h3>
<p>Noise Profile 是一個結構化的資料集，記錄了感測器在各種操作條件下的噪聲參數。一個完整的 Noise Profile 通常包含：</p>
<ul>
  <li><strong>NLF 參數 (a, b)</strong>：每個 ISO 設定、每個 Bayer 通道（R, Gr, Gb, B）的斜率 a 和截距 b。</li>
  <li><strong>不同溫度下的修正係數</strong>：Dark Current 隨溫度變化，高溫時 b 值會增大。</li>
  <li><strong>曝光時間修正</strong>：長曝光時 Dark Current 積累更多。</li>
  <li><strong>Analog Gain 與 Digital Gain 的區分</strong>：Digital Gain 只放大訊號和噪聲，不改變根本的噪聲特性。</li>
</ul>

<h3>Noise Calibration 流程</h3>
<p>標準的 Noise Calibration 包括以下步驟：</p>

<p><strong>1. 環境設置</strong>：使用積分球（Integrating Sphere）或大面積均勻光源提供穩定、均勻的照明。拍攝灰階圖卡（Grey Scale Chart，如 X-Rite ColorChecker 的灰階部分或專用灰階梯圖卡），確保有覆蓋從暗到亮的多個灰度級別。環境溫度需要控制或至少記錄。</p>

<p><strong>2. 資料採集</strong>：對每個 ISO 設定（從最低 ISO 到最高 ISO），在相同光照條件下拍攝 RAW 影像。每個 ISO 設定拍攝多幀（通常 50-100 幀）用於統計分析。還需要拍攝完全遮光的 Dark Frame（暗幀）用於 Read Noise 的獨立測量。</p>

<p><strong>3. 資料處理</strong>：對灰階圖卡上的每個灰度 Patch：(1) 選取均勻區域的 ROI（Region of Interest）；(2) 計算所有像素的均值 μ 作為訊號強度估計；(3) 計算像素方差 σ² 作為噪聲方差估計；(4) 對 Bayer 格式的四個通道分別計算。</p>

<p><strong>4. 線性擬合</strong>：以均值 μ 為 x 軸、方差 σ² 為 y 軸繪製散點圖，通過最小二乘法（Least Squares）擬合直線 σ² = a·μ + b，得到 NLF 參數。需要檢查擬合的 R² 值確保線性模型的合理性（通常 R² > 0.99）。</p>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>Noise Calibration 的常見陷阱包括：(1) 光源不夠均勻導致同一 Patch 內的方差被空間亮度梯度汙染——解決方法是使用去趨勢（Detrending）處理；(2) 接近飽和的高灰度區域因 Clipping 而方差異常降低——應排除接近飽和點的資料；(3) Defective Pixels（壞點）污染統計——需要先做壞點檢測和排除；(4) 未區分 Analog Gain 和 Digital Gain——兩者對噪聲的影響完全不同。</p>
</div>

<h3>Noise Profile 在 ISP 中的應用</h3>
<p>Noise Profile 以 LUT（Look-Up Table）或多項式擬合的形式儲存在 ISP 的記憶體中。當相機拍攝一張影像時，ISP 根據 EXIF 中記錄的 ISO/Gain 值和感測器溫度，查詢對應的 NLF 參數 (a, b)。然後：</p>
<ul>
  <li>RAW NR 模組用 (a, b) 計算每個像素的局部噪聲強度 σ(μ) = √(a·μ+b)，自適應調整 Bilateral Filter 的 σ_range。</li>
  <li>YUV NR 模組用噪聲強度驅動 Wavelet/BM3D 的閾值參數。</li>
  <li>TNR 模組用噪聲強度調整 Alpha Blending 的曲線。</li>
</ul>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>在 Android Camera2 API 中，Noise Profile 通過 <code>CameraCharacteristics.SENSOR_NOISE_PROFILE</code> 暴露給應用程式。它返回一組 (a, b) 對，對應各 Bayer 通道。Google 的 Camera HAL 規範要求每個感測器供應商必須提供此資料。DNG 檔案格式也在 NoiseProfile Tag 中記錄了 (a, b) 參數，使得後處理軟體可以利用這些校準數據進行最佳降噪。</p>
</div>

<h3>線上噪聲估計</h3>
<p>除了離線校準的 Noise Profile，有些場景需要即時估計噪聲水平（如 Noise Profile 不準確或不可用時）。常見的線上噪聲估計方法包括：(1) <strong>MAD Estimator</strong>：σ = Median(|W_HH|)/0.6745，利用最高頻 Wavelet 子帶的中位絕對偏差估計噪聲；(2) <strong>Percentile-Based</strong>：統計局部方差分佈的低百分位數（假設最「平坦」的區域最能代表純噪聲）；(3) <strong>PCA-Based</strong>：分析局部 Patch 的 PCA 特徵值分佈來分離訊號和噪聲。</p>
`
    },
    {
      id: "ch3_12",
      title: "ISO 與噪聲的關係",
      content: `
<p>ISO 是攝影中最基本的參數之一，它直接控制感測器的增益（Gain），從而深刻影響影像的噪聲水平。理解 ISO 與噪聲的精確關係，是 ISP 降噪系統設計的基礎。本節從電路層面解析 ISO 的實現機制，特別介紹現代感測器的 Dual Gain（雙增益）/ Dual Conversion Gain (DCG) 技術，並分析其對噪聲特性的影響。</p>

<div class="diagram">
<svg viewBox="0 0 750 500" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <rect width="750" height="500" fill="#f5f0eb" rx="8"/>
  <text x="375" y="25" text-anchor="middle" font-size="15" font-weight="bold" fill="#5a5550">ISO vs 噪聲關係及 Dual Gain 感測器</text>

  <!-- ISO vs Noise Chart -->
  <rect x="40" y="42" width="340" height="250" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>

  <!-- Axes -->
  <line x1="75" y1="265" x2="360" y2="265" stroke="#5a5550" stroke-width="1.5"/>
  <line x1="75" y1="265" x2="75" y2="55" stroke="#5a5550" stroke-width="1.5"/>

  <text x="217" y="288" text-anchor="middle" font-size="11" fill="#5a5550">ISO（對數刻度）</text>
  <text x="42" y="160" text-anchor="middle" font-size="10" fill="#5a5550" transform="rotate(-90,42,160)">Noise (σ) / DN</text>

  <!-- ISO ticks -->
  <text x="95" y="280" text-anchor="middle" font-size="8" fill="#8a8580">100</text>
  <text x="150" y="280" text-anchor="middle" font-size="8" fill="#8a8580">200</text>
  <text x="205" y="280" text-anchor="middle" font-size="8" fill="#8a8580">400</text>
  <text x="260" y="280" text-anchor="middle" font-size="8" fill="#8a8580">1600</text>
  <text x="315" y="280" text-anchor="middle" font-size="8" fill="#8a8580">6400</text>
  <text x="345" y="280" text-anchor="middle" font-size="8" fill="#8a8580">12800</text>

  <!-- Total Noise curve -->
  <path d="M95,240 L150,220 L205,195 L260,150 L315,100 L345,75" fill="none" stroke="#d35050" stroke-width="2.5"/>
  <text x="330" y="68" font-size="10" font-weight="bold" fill="#d35050">Total Noise σ_total</text>

  <!-- Shot Noise component -->
  <path d="M95,250 L150,238 L205,220 L260,190 L315,150 L345,130" fill="none" stroke="#e8a04a" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="348" y="135" font-size="9" fill="#e8a04a">Shot σ=√(a·μ)</text>

  <!-- Read Noise component -->
  <path d="M95,248 L150,232 L205,210 L260,180 L315,140 L345,115" fill="none" stroke="#5060b0" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="348" y="110" font-size="9" fill="#5060b0">Read σ=g·σ_r</text>

  <!-- SNR curve (dashed, going down) -->
  <path d="M95,80 L150,100 L205,125 L260,165 L315,210 L345,235" fill="none" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="8,3"/>
  <text x="170" y="75" font-size="10" font-weight="bold" fill="#6a8a7a">SNR (↓)</text>

  <!-- Dual Gain Sensor Diagram -->
  <rect x="410" y="42" width="320" height="250" rx="5" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="570" y="65" text-anchor="middle" font-size="12" font-weight="bold" fill="#5a5550">Dual Conversion Gain (DCG) 原理</text>

  <!-- Photodiode -->
  <rect x="430" y="85" width="65" height="40" rx="3" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="462" y="108" text-anchor="middle" font-size="9" fill="#6a8a7a">PD</text>

  <!-- Switch -->
  <line x1="495" y1="105" x2="530" y2="105" stroke="#5a5550" stroke-width="1.5"/>

  <!-- HCG path (small capacitor) -->
  <rect x="535" y="80" width="55" height="25" rx="3" fill="#e8a04a" opacity="0.3" stroke="#e8a04a" stroke-width="1.5"/>
  <text x="562" y="96" text-anchor="middle" font-size="8" font-weight="bold" fill="#e8a04a">C_small</text>
  <text x="610" y="96" font-size="8" fill="#e8a04a">→ HCG</text>
  <text x="610" y="108" font-size="7" fill="#8a8580">High Conv. Gain</text>

  <!-- LCG path (large capacitor) -->
  <rect x="535" y="115" width="55" height="25" rx="3" fill="#5060b0" opacity="0.3" stroke="#5060b0" stroke-width="1.5"/>
  <text x="562" y="131" text-anchor="middle" font-size="8" font-weight="bold" fill="#5060b0">C_large</text>
  <text x="610" y="131" font-size="8" fill="#5060b0">→ LCG</text>
  <text x="610" y="143" font-size="7" fill="#8a8580">Low Conv. Gain</text>

  <!-- Switch selector -->
  <circle cx="530" cy="105" r="4" fill="#5a5550"/>
  <line x1="530" y1="105" x2="535" y2="92" stroke="#5a5550" stroke-width="1.5"/>
  <text x="530" y="78" text-anchor="middle" font-size="7" fill="#8a8580">DCG Switch</text>

  <!-- Dual gain noise curve -->
  <text x="570" y="170" text-anchor="middle" font-size="11" font-weight="bold" fill="#5a5550">DCG 感測器的噪聲曲線</text>

  <!-- Mini chart -->
  <line x1="435" y1="255" x2="710" y2="255" stroke="#8a8580" stroke-width="1"/>
  <line x1="435" y1="255" x2="435" y2="180" stroke="#8a8580" stroke-width="1"/>
  <text x="572" y="270" text-anchor="middle" font-size="9" fill="#8a8580">ISO</text>
  <text x="425" y="218" text-anchor="end" font-size="8" fill="#8a8580">Read</text>
  <text x="425" y="208" text-anchor="end" font-size="8" fill="#8a8580">Noise</text>

  <!-- LCG region (low ISO) -->
  <path d="M445,230 L500,220 L555,208" fill="none" stroke="#5060b0" stroke-width="2.5"/>
  <text x="500" y="245" text-anchor="middle" font-size="8" fill="#5060b0">LCG 模式</text>

  <!-- Transition point -->
  <circle cx="555" cy="208" r="5" fill="white" stroke="#d35050" stroke-width="2"/>
  <text x="555" y="200" text-anchor="middle" font-size="7" fill="#d35050">切換點</text>

  <!-- HCG region (high ISO) - drops! -->
  <path d="M555,230 L570,238 L610,225 L660,210 L700,195" fill="none" stroke="#e8a04a" stroke-width="2.5"/>
  <text x="650" y="245" text-anchor="middle" font-size="8" fill="#e8a04a">HCG 模式</text>

  <!-- Conventional single gain for comparison -->
  <path d="M445,232 L555,210 L660,190 L700,182" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="660" y="178" font-size="8" fill="#8a8580">傳統單增益</text>

  <!-- Bottom section: ISO relationship formulas -->
  <rect x="40" y="310" width="670" height="180" rx="6" fill="white" stroke="#d5cec7" stroke-width="1"/>
  <text x="375" y="335" text-anchor="middle" font-size="13" font-weight="bold" fill="#5a5550">ISO 與噪聲的定量關係</text>

  <!-- Analog Gain -->
  <rect x="60" y="350" width="195" height="55" rx="4" fill="#6a8a7a" opacity="0.1" stroke="#6a8a7a" stroke-width="1"/>
  <text x="157" y="370" text-anchor="middle" font-size="10" font-weight="bold" fill="#6a8a7a">Analog Gain (AG)</text>
  <text x="157" y="385" text-anchor="middle" font-size="9" fill="#5a5550">放大訊號 + 噪聲</text>
  <text x="157" y="398" text-anchor="middle" font-size="9" fill="#6a8a7a">SNR 不變（Read NF 前）</text>

  <!-- Digital Gain -->
  <rect x="275" y="350" width="195" height="55" rx="4" fill="#e8a04a" opacity="0.1" stroke="#e8a04a" stroke-width="1"/>
  <text x="372" y="370" text-anchor="middle" font-size="10" font-weight="bold" fill="#e8a04a">Digital Gain (DG)</text>
  <text x="372" y="385" text-anchor="middle" font-size="9" fill="#5a5550">純數位放大</text>
  <text x="372" y="398" text-anchor="middle" font-size="9" fill="#d35050">SNR 不改善（噪聲等比放大）</text>

  <!-- System Gain -->
  <rect x="490" y="350" width="195" height="55" rx="4" fill="#5060b0" opacity="0.1" stroke="#5060b0" stroke-width="1"/>
  <text x="587" y="370" text-anchor="middle" font-size="10" font-weight="bold" fill="#5060b0">System Gain</text>
  <text x="587" y="385" text-anchor="middle" font-size="9" fill="#5a5550">g = AG × DG</text>
  <text x="587" y="398" text-anchor="middle" font-size="9" fill="#5060b0">a = g, b = g²·σ²_read</text>

  <!-- Key formulas -->
  <text x="375" y="430" text-anchor="middle" font-size="12" fill="#6a8a7a">ISO ↑2× → Analog Gain ↑2× → NLF: a ↑2×, b ↑4× → σ_total ↑ ~√2×（暗部更惡化）</text>
  <text x="375" y="455" text-anchor="middle" font-size="11" fill="#8a8580">每升高一檔 ISO（×2），SNR 大約降低 3 dB</text>

  <!-- Formulas -->
  <text x="375" y="478" text-anchor="middle" font-size="11" fill="#5a5550">σ²_total(μ) = a·μ + b = g·μ + g²·σ²_read → 高 ISO 下 Read Noise 項 (g²·σ²_read) 快速增長</text>
</svg>
<div class="caption">圖 3-12：ISO 與噪聲的關係圖 — 包含總噪聲、Shot Noise、Read Noise 分量以及 Dual Conversion Gain 感測器的特殊噪聲行為</div>
</div>

<h3>ISO 的物理意義</h3>
<p>ISO 在數位相機中的本質是控制 <strong>Analog Gain</strong>（類比增益）和/或 <strong>Digital Gain</strong>（數位增益）。當 ISO 從 100 增加到 200 時，相機通常將 Analog Gain 增加一倍。這意味著感測器讀出的類比電壓訊號在 ADC 之前被放大了兩倍。</p>

<p>關鍵區別在於：</p>
<ul>
  <li><strong>Analog Gain</strong>：在 ADC 之前放大訊號。由於 Read Noise 主要在放大之後的讀出電路中引入，Analog Gain 同時放大了光訊號和 Shot Noise，但 Read Noise 只被「翻譯」到 DN 域後等效變小（相對於訊號）。因此，適度的 Analog Gain 實際上可以改善 Read Noise 限制的 SNR。</li>
  <li><strong>Digital Gain</strong>：在 ADC 之後進行純數位乘法。訊號和所有噪聲（包括 Read Noise）等比例放大，SNR 完全不改善。Digital Gain 本質上只是「假 ISO」。</li>
</ul>

<div class="info-box key">
<div class="box-title">重點</div>
<p>對 ISP 降噪而言，區分 Analog Gain 和 Digital Gain 至關重要。NLF 參數中的系統增益 g 應該用實際的 Analog Gain × Digital Gain 來計算。但在噪聲建模和降噪策略上，應該意識到 Digital Gain 並不帶來新的資訊——在 Digital Gain 之前的訊號已經是噪聲的下限。某些 ISP 會在 Digital Gain 階段使用更激進的降噪來補償 DG 放大的噪聲。</p>
</div>

<h3>ISO 倍增對噪聲的定量影響</h3>
<p>假設 ISO 翻倍等同於 Analog Gain g 翻倍。在 NLF 模型 σ²=aμ+b 中：</p>
<div class="formula">a_new = 2·a_old（斜率翻倍，Shot Noise 項）<br/>b_new = 4·b_old（截距翻四倍，Read Noise 項）</div>

<p>這揭示了一個重要事實：<strong>Read Noise 在 DN 域中隨 gain 的平方增長</strong>。這就是為什麼高 ISO 下暗部噪聲特別嚴重——暗部的 Shot Noise 很小，噪聲由 Read Noise 主導，而 Read Noise 被 gain² 放大。具體而言，對於一個 Read Noise 為 3 e⁻ 的感測器：</p>

<table>
<tr><th>ISO</th><th>Gain (DN/e⁻)</th><th>Read Noise (DN)</th><th>Read Noise (e⁻)</th></tr>
<tr><td>100</td><td>1</td><td>3</td><td>3</td></tr>
<tr><td>400</td><td>4</td><td>12</td><td>3</td></tr>
<tr><td>1600</td><td>16</td><td>48</td><td>3</td></tr>
<tr><td>6400</td><td>64</td><td>192</td><td>3</td></tr>
</table>

<p>可以看到，雖然 Read Noise 在電子域保持恆定（3 e⁻），但在 DN 域中被放大到了令人驚訝的水平。</p>

<h3>Dual Conversion Gain (DCG) 感測器</h3>
<p>Dual Conversion Gain 是近年來高階感測器的重要創新（如 Samsung ISOCELL、Sony IMX 系列的某些型號、OmniVision 等）。其原理是在像素的讀出路徑中設置兩個不同大小的電容，通過開關選擇：</p>
<ul>
  <li><strong>HCG（High Conversion Gain）模式</strong>：使用小電容。Conversion Gain（μV/e⁻）高，等效 Read Noise（e⁻）低。適合高 ISO / 暗光場景。</li>
  <li><strong>LCG（Low Conversion Gain）模式</strong>：使用大電容。Conversion Gain 低，Full Well Capacity（滿井容量）大，Dynamic Range 更寬。適合低 ISO / 強光場景。</li>
</ul>

<p>在特定的 ISO 閾值（如 ISO 400 或 ISO 800），感測器從 LCG 切換到 HCG。切換的效果是：在 HCG 模式下，Read Noise（以電子計）顯著降低（可能從 3 e⁻ 降至 1.5 e⁻），使得高 ISO 下的 SNR 得到實質性改善。從 Noise Profile 的角度看，DCG 切換點會導致 NLF 參數的不連續變化。</p>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>DCG 感測器的 Noise Calibration 必須分別對 LCG 和 HCG 兩個模式獨立校準。ISP 的降噪模組需要知道當前使用的是哪個 CG 模式，並切換到對應的 NLF 參數集。某些感測器支持同一幀中同時使用兩種 CG（Split-Pixel HDR），此時需要更複雜的噪聲模型。</p>
</div>

<h3>ISO Invariance 與「暴露右移」</h3>
<p>一個有趣的現象是 <strong>ISO Invariance（ISO 不變性）</strong>：在某些現代感測器上，「ISO 100 拍攝後 +4 EV 數位提亮」與「直接使用 ISO 1600 拍攝」的噪聲水平非常接近。這意味著 Analog Gain 的增加並沒有帶來 SNR 的顯著改善——感測器已經接近「Read Noise Free」的狀態。</p>

<p>在 ISO Invariant 的感測器上，影像品質主要由 Shot Noise 決定（Shot Noise Limited），而 Shot Noise 只取決於收集到的總光子數，與 ISO 無關。因此，「暴露右移」（ETTR, Expose to the Right）策略仍然有效——在不過曝的前提下使用盡可能多的曝光來收集更多光子，事後再降低亮度，可以獲得最低的噪聲。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>對 ISP 降噪工程師而言，理解感測器是否具有 ISO Invariance 性質非常重要。如果感測器高度 ISO Invariant，那麼在夜景模式中可以優先使用較低 ISO + 多幀合成的策略（如 Google Night Sight）；如果感測器在低 ISO 時 Read Noise 較高（非 ISO Invariant），則直接使用高 ISO + 單幀降噪可能更合適。Photon Transfer Curve (PTC) 分析是判斷感測器特性的黃金標準工具。</p>
</div>
`
    }
  ]
};

