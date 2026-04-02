const CH5 = {
  title: "Tone Mapping",
  sections: [
    {
      id: "ch5_1",
      title: "什麼是 Tone Mapping？",
      content: `
<h3>從 HDR 到 LDR 的橋樑</h3>
<p>Tone Mapping（色調映射）是將高動態範圍（HDR, High Dynamic Range）場景的亮度資訊，壓縮到低動態範圍（LDR, Low Dynamic Range）顯示裝置可呈現範圍的過程。現實世界的亮度範圍可達 10<sup>14</sup>:1（從星光到直射陽光），而一般顯示器的動態範圍僅約 1000:1（SDR）到 10000:1（HDR Display）。Tone Mapping 的核心挑戰就是在壓縮過程中，盡可能保留場景的視覺資訊和感知品質。</p>

<p>在 ISP 中，Tone Mapping 是決定影像「觀感」的最關鍵模組之一。它直接影響影像的對比度、亮部細節、暗部細節和整體氛圍。一個好的 Tone Mapping 演算法能讓逆光場景中的人臉清晰可見，同時保留天空的雲層細節；而糟糕的 Tone Mapping 會讓影像看起來灰濛濛或過度對比。</p>

<div class="diagram"><svg viewBox="0 0 700 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="350" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">HDR 場景 → Tone Mapping → LDR 顯示</text>
  <!-- HDR Scene -->
  <g transform="translate(20,55)">
    <rect x="0" y="0" width="180" height="130" rx="8" fill="rgba(196,160,100,0.1)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="90" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">HDR 場景</text>
    <!-- Sun area - bright -->
    <circle cx="140" cy="50" r="20" fill="#f0e060" opacity="0.7"/>
    <text x="140" y="53" text-anchor="middle" font-size="7" fill="#5a5550">10⁵ cd/m²</text>
    <!-- Sky -->
    <rect x="10" y="35" width="160" height="30" rx="2" fill="#a0c0e0" opacity="0.3"/>
    <!-- Building shadow -->
    <rect x="10" y="70" width="70" height="50" rx="2" fill="#3a3530" opacity="0.6"/>
    <text x="45" y="98" text-anchor="middle" font-size="7" fill="#f5f0eb">0.1 cd/m²</text>
    <!-- Ground -->
    <rect x="80" y="85" width="90" height="35" rx="2" fill="#8a8a60" opacity="0.4"/>
    <!-- Dynamic range bar -->
    <text x="90" y="148" text-anchor="middle" font-size="9" fill="#c4a064">Dynamic Range: 10⁶:1</text>
  </g>
  <!-- Arrow -->
  <g transform="translate(210,95)">
    <rect x="0" y="0" width="260" height="100" rx="10" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="130" y="22" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">Tone Mapping</text>
    <!-- TMO curve inside -->
    <g transform="translate(30,30)">
      <rect x="0" y="0" width="200" height="60" rx="4" fill="rgba(245,240,235,0.8)" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="5" y1="55" x2="195" y2="55" stroke="#d5cec7" stroke-width="0.5"/>
      <line x1="5" y1="55" x2="5" y2="5" stroke="#d5cec7" stroke-width="0.5"/>
      <!-- S-curve -->
      <path d="M5,55 Q20,54 40,50 Q80,38 100,28 Q130,16 160,10 Q180,7 195,6" fill="none" stroke="#6a8a7a" stroke-width="2"/>
      <text x="100" y="-4" text-anchor="middle" font-size="8" fill="#6a8a7a">Compression Curve</text>
    </g>
    <!-- Labels -->
    <text x="40" y="97" font-size="8" fill="#8a8580">HDR Input</text>
    <text x="170" y="97" font-size="8" fill="#8a8580">LDR Output</text>
  </g>
  <!-- LDR Display -->
  <g transform="translate(490,55)">
    <rect x="0" y="0" width="180" height="130" rx="8" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="90" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">LDR 顯示</text>
    <!-- Sun area - compressed -->
    <circle cx="140" cy="50" r="20" fill="#e8d878" opacity="0.5"/>
    <text x="140" y="53" text-anchor="middle" font-size="7" fill="#5a5550">亮部保留</text>
    <!-- Sky with detail -->
    <rect x="10" y="35" width="160" height="30" rx="2" fill="#88b0d0" opacity="0.4"/>
    <!-- Shadow - lifted -->
    <rect x="10" y="70" width="70" height="50" rx="2" fill="#5a5550" opacity="0.5"/>
    <text x="45" y="98" text-anchor="middle" font-size="7" fill="#f5f0eb">暗部提亮</text>
    <!-- Ground -->
    <rect x="80" y="85" width="90" height="35" rx="2" fill="#9a9a70" opacity="0.4"/>
    <!-- Dynamic range bar -->
    <text x="90" y="148" text-anchor="middle" font-size="9" fill="#648cb4">Dynamic Range: 1000:1</text>
  </g>
  <!-- Flow arrows -->
  <line x1="200" y1="120" x2="210" y2="120" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow5a)"/>
  <line x1="470" y1="120" x2="490" y2="120" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow5a)"/>
  <!-- Bottom comparison -->
  <g transform="translate(20,230)">
    <rect x="0" y="0" width="660" height="90" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="330" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Tone Mapping 的核心挑戰</text>
    <text x="20" y="45" font-size="9" fill="#5a5550">1. 壓縮動態範圍，同時保留亮部與暗部細節</text>
    <text x="20" y="62" font-size="9" fill="#5a5550">2. 維持自然的對比度，避免「HDR 感」過重（Halo、色彩失真）</text>
    <text x="20" y="79" font-size="9" fill="#5a5550">3. 適應不同場景（逆光、夜景、高對比），提供一致的視覺品質</text>
  </g>
  <defs><marker id="arrow5a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 5-1：HDR 場景經 Tone Mapping 壓縮到 LDR 顯示範圍的流程</div></div>

<h3>Tone Mapping 的分類</h3>
<p>Tone Mapping 演算法可以分為兩大類：</p>
<ul>
<li><strong>Global Tone Mapping (GTM)</strong>：對整張影像套用相同的映射函數。每個像素的輸出僅取決於自身的輸入值。計算簡單、無 Artifact，但可能無法同時兼顧亮暗區域的細節</li>
<li><strong>Local Tone Mapping (LTM)</strong>：根據像素周圍的局部特性調整映射。能同時保留亮暗區域的細節，但可能產生 Halo Artifact 和不自然的外觀</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
在手機 ISP 中，Tone Mapping 通常不是單一模組，而是由多個模組協同完成：Gamma Curve 提供基礎的全域映射、Local Tone Mapping 增強局部對比、AE（Auto Exposure）決定整體亮度、Face Detection 保護人臉曝光。這些模組共同構成了「Tone 管理系統」。
</div>

<h3>ISP 中 Tone Mapping 的位置</h3>
<p>Tone Mapping 在 ISP Pipeline 中的位置取決於其類型。Global Tone Mapping 通常與 Gamma Correction 合併，使用同一張 1D LUT 實現。Local Tone Mapping 則是獨立模組，位置可以在 Demosaic 之後、Gamma 之前（線性域），或在 Gamma 之後（非線性域）。線性域 LTM 的物理意義更正確，但非線性域 LTM 的視覺效果更易控制。</p>

<div class="info-box tip">
<div class="box-title">實務提示</div>
判斷一個 ISP 的 Tone Mapping 品質，最好的測試場景是「室內窗戶逆光」——窗戶外的天空是高亮部，室內是低亮部。好的 Tone Mapping 應該讓室外的雲層和室內的傢俱同時可見，且過渡自然，不出現 Halo。
</div>
`,
      keyPoints: [
        "Tone Mapping 將 HDR 場景壓縮到 LDR 顯示範圍，是影像觀感的關鍵",
        "分為 Global Tone Mapping（全域映射）和 Local Tone Mapping（局部映射）",
        "GTM 簡單無 Artifact，LTM 細節更好但可能產生 Halo",
        "手機 ISP 的 Tone 管理由 Gamma、LTM、AE、Face Detection 協同完成",
        "最佳測試場景是室內窗戶逆光"
      ]
    },
    {
      id: "ch5_2",
      title: "Global Tone Mapping 全域色調映射",
      content: `
<h3>Global Tone Mapping 的原理</h3>
<p>Global Tone Mapping（GTM）對整張影像的每個像素套用相同的映射函數 <code>L_out = f(L_in)</code>。這個函數通常是一條單調遞增的曲線，將輸入的 HDR 亮度值映射到 LDR 輸出範圍。GTM 的優點是計算高效、不產生空間域 Artifact，但缺點是無法根據局部內容做適應性調整。</p>

<p>多年來，研究者提出了許多經典的 GTM 演算法。每個演算法都有不同的設計哲學和適用場景。了解它們的特性和差異，有助於在 ISP 設計中做出正確的選擇。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">經典 Global Tone Mapping 曲線比較</text>
  <!-- Axes -->
  <g transform="translate(80,55)">
    <line x1="0" y1="290" x2="520" y2="290" stroke="#d5cec7" stroke-width="1.5"/>
    <line x1="0" y1="290" x2="0" y2="0" stroke="#d5cec7" stroke-width="1.5"/>
    <text x="260" y="325" text-anchor="middle" font-size="11" fill="#8a8580">Input Luminance (HDR, log scale)</text>
    <text x="-15" y="145" text-anchor="middle" font-size="11" fill="#8a8580" transform="rotate(-90,-15,145)">Output (LDR)</text>
    <!-- Grid lines -->
    <line x1="0" y1="0" x2="520" y2="0" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="0" y1="72" x2="520" y2="72" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="0" y1="145" x2="520" y2="145" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="0" y1="218" x2="520" y2="218" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="130" y1="0" x2="130" y2="290" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="260" y1="0" x2="260" y2="290" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="390" y1="0" x2="390" y2="290" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <!-- Scale labels -->
    <text x="-8" y="294" font-size="8" fill="#8a8580">0</text>
    <text x="-12" y="5" font-size="8" fill="#8a8580">1.0</text>
    <text x="515" y="304" font-size="8" fill="#8a8580">High</text>
    <text x="-5" y="304" font-size="8" fill="#8a8580">Low</text>
    <!-- Linear (clipping) -->
    <line x1="0" y1="290" x2="260" y2="0" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="260" y1="0" x2="520" y2="0" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="290" y="32" font-size="10" fill="#d5cec7">Linear (Clip)</text>
    <!-- Reinhard -->
    <path d="M0,290 Q40,260 80,215 Q130,160 200,100 Q280,55 370,30 Q440,15 520,8" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
    <text x="430" y="40" font-size="11" fill="#6a8a7a" font-weight="500">Reinhard</text>
    <!-- Drago (Logarithmic) -->
    <path d="M0,290 Q30,240 70,190 Q120,135 190,90 Q270,52 370,28 Q440,15 520,5" fill="none" stroke="#648cb4" stroke-width="2" stroke-dasharray="8,4"/>
    <text x="420" y="55" font-size="11" fill="#648cb4" font-weight="500">Drago (Log)</text>
    <!-- ACES Filmic -->
    <path d="M0,290 Q20,288 50,275 Q100,240 160,170 Q220,100 300,48 Q380,18 460,6 L520,3" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="420" y="72" font-size="11" fill="#c4a064" font-weight="500">ACES Filmic</text>
    <!-- Annotation: shoulder region -->
    <rect x="350" y="100" width="130" height="50" rx="4" fill="rgba(245,240,235,0.9)" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="415" y="118" text-anchor="middle" font-size="9" fill="#5a5550">Shoulder Region</text>
    <text x="415" y="133" text-anchor="middle" font-size="8" fill="#8a8580">高光壓縮區域</text>
    <text x="415" y="145" text-anchor="middle" font-size="8" fill="#8a8580">曲線越平=壓縮越強</text>
    <!-- Annotation: toe region -->
    <rect x="30" y="220" width="120" height="50" rx="4" fill="rgba(245,240,235,0.9)" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="90" y="238" text-anchor="middle" font-size="9" fill="#5a5550">Toe Region</text>
    <text x="90" y="253" text-anchor="middle" font-size="8" fill="#8a8580">暗部提升區域</text>
    <text x="90" y="265" text-anchor="middle" font-size="8" fill="#8a8580">ACES toe 最強</text>
  </g>
</svg><div class="caption">圖 5-2：Reinhard、Drago (Logarithmic)、ACES Filmic 三種 Global Tone Mapping 曲線比較</div></div>

<h3>經典 GTM 演算法</h3>

<h4>1. Reinhard Tone Mapping</h4>
<p>Reinhard (2002) 是最經典的 GTM 演算法，靈感來自攝影中的 Zone System。其基本公式為：</p>
<div class="formula">L_out = L_in / (1 + L_in)</div>
<p>這個簡單的公式將 [0, ∞) 映射到 [0, 1)，自動壓縮高亮度值。改進版本加入了 White Point 參數：</p>
<div class="formula">L_out = L_in × (1 + L_in / L_white²) / (1 + L_in)</div>
<p>Reinhard 的優點是簡單優雅，但暗部提升不足，影像可能偏暗。</p>

<h4>2. Drago Logarithmic</h4>
<p>Drago (2003) 使用自適應對數基底（Adaptive Logarithmic Base），在不同亮度區域使用不同的壓縮程度：</p>
<div class="formula">L_out = log(1 + L_in) / log(1 + L_max) × (1 / log₂(b))</div>
<p>其中 b 為偏差因子（Bias），控制暗部到亮部的壓縮比例。Drago 的暗部保留優於 Reinhard。</p>

<h4>3. ACES Filmic Tone Mapping</h4>
<p>ACES（Academy Color Encoding System）的 Filmic Tone Mapping 是電影工業的標準。它模擬了底片（Film）的 S 曲線特性，同時具有漂亮的 Shoulder（高光滾降）和 Toe（暗部提升）。常用的近似公式（Narkowicz 2015）：</p>
<div class="formula">L_out = (L × (2.51L + 0.03)) / (L × (2.43L + 0.59) + 0.14)</div>
<p>ACES Filmic 的色彩表現最好，產生的影像最具「電影感」，是近年手機 ISP 的主流選擇。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
所有 GTM 曲線都有三個關鍵區域：Toe（暗部，控制黑色的深度和暗部細節）、Mid-tone（中間調，決定整體亮度和對比感）、Shoulder（高光，控制高光的壓縮和滾降方式）。不同的演算法在這三個區域的處理方式不同，產生不同的視覺風格。
</div>

<h3>GTM 在 ISP 中的實作</h3>
<p>在硬體 ISP 中，GTM 通常不會直接使用上述數學公式，而是將曲線預計算（Pre-compute）後存入 1D LUT。這是因為硬體 LUT 的查表速度遠快於即時計算複雜的數學函數。</p>

<pre>
// 預計算 Reinhard Tone Curve 到 LUT
void compute_reinhard_lut(uint16_t* lut, int size, float white_point) {
    for (int i = 0; i < size; i++) {
        float lin = (float)i / (size - 1);
        float mapped = lin * (1.0 + lin / (white_point * white_point)) / (1.0 + lin);
        lut[i] = (uint16_t)(mapped * (size - 1) + 0.5);
    }
}
</pre>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在選擇 GTM 演算法時，需要考慮目標平台和應用場景。手機相機通常偏好 ACES-like 的 Filmic 曲線，因為它產生的影像色彩豐富且自然。監控攝像頭則可能偏好 Reinhard 或線性映射，因為它更重視資訊的完整性而非美感。車用攝像頭需要特殊的 WDR 曲線，優先保證辨識度。
</div>
`,
      keyPoints: [
        "Global Tone Mapping 對每個像素套用相同的映射函數",
        "Reinhard 簡單優雅但暗部不足，Drago 暗部保留更好，ACES Filmic 最具電影感",
        "GTM 曲線的三個關鍵區域：Toe（暗部）、Mid-tone（中間調）、Shoulder（高光）",
        "硬體 ISP 中 GTM 通常預計算後存入 1D LUT",
        "不同應用場景（手機、監控、車用）需要不同的 GTM 策略"
      ]
    },
    {
      id: "ch5_3",
      title: "Local Tone Mapping 局部色調映射",
      content: `
<h3>為什麼需要 Local Tone Mapping？</h3>
<p>Global Tone Mapping 的根本限制是：同一條曲線無法同時最佳化亮區和暗區的細節。當場景的動態範圍非常大（如逆光場景），GTM 要麼犧牲暗部（暗部太黑看不到細節），要麼犧牲亮部（亮部過度壓縮失去層次）。Local Tone Mapping（LTM）通過根據像素的局部鄰域特性，為不同區域提供不同的映射，解決了這個問題。</p>

<p>LTM 的核心思想借鑒了人眼的視覺適應機制——人眼在觀看不同亮度區域時，會自動調整局部的敏感度。當你看暗處時，瞳孔放大、視網膜適應暗部；看亮處時則相反。LTM 模擬這個過程，讓每個區域都能呈現最佳的細節。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Global vs Local Tone Mapping 效果比較</text>
  <!-- Original HDR scene -->
  <g transform="translate(20,55)">
    <text x="100" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">HDR 原始場景</text>
    <rect x="0" y="15" width="200" height="120" rx="6" stroke="#d5cec7" stroke-width="1"/>
    <!-- Sky (very bright) -->
    <rect x="1" y="16" width="198" height="40" rx="5" fill="#d0e8f8"/>
    <circle cx="160" cy="35" r="15" fill="#fff8d0" opacity="0.9"/>
    <!-- Building -->
    <rect x="30" y="55" width="60" height="79" rx="1" fill="#252520"/>
    <rect x="35" y="60" width="15" height="15" fill="#404038"/>
    <rect x="55" y="60" width="15" height="15" fill="#404038"/>
    <rect x="35" y="80" width="15" height="15" fill="#353530"/>
    <rect x="55" y="80" width="15" height="15" fill="#353530"/>
    <!-- Trees -->
    <rect x="110" y="65" width="80" height="69" rx="1" fill="#354530"/>
    <text x="100" y="155" text-anchor="middle" font-size="8" fill="#8a8580">DR: 100,000:1</text>
  </g>
  <!-- GTM result -->
  <g transform="translate(245,55)">
    <text x="100" y="0" text-anchor="middle" font-size="11" fill="#648cb4" font-weight="500">Global Tone Mapping</text>
    <rect x="0" y="15" width="200" height="120" rx="6" stroke="#648cb4" stroke-width="1.5"/>
    <!-- Sky OK -->
    <rect x="1" y="16" width="198" height="40" rx="5" fill="#a8c8e0"/>
    <circle cx="160" cy="35" r="15" fill="#e8e0b0" opacity="0.8"/>
    <!-- Building very dark -->
    <rect x="30" y="55" width="60" height="79" rx="1" fill="#1a1a18"/>
    <rect x="35" y="60" width="15" height="15" fill="#222220"/>
    <rect x="55" y="60" width="15" height="15" fill="#222220"/>
    <rect x="35" y="80" width="15" height="15" fill="#1e1e1c"/>
    <rect x="55" y="80" width="15" height="15" fill="#1e1e1c"/>
    <!-- Trees dark -->
    <rect x="110" y="65" width="80" height="69" rx="1" fill="#202a1c"/>
    <!-- Problem annotation -->
    <text x="100" y="155" text-anchor="middle" font-size="8" fill="#c44040">暗部細節不足</text>
    <line x1="30" y1="140" x2="90" y2="140" stroke="#c44040" stroke-width="1" stroke-dasharray="3,2"/>
    <text x="100" y="170" text-anchor="middle" font-size="8" fill="#648cb4">亮部保留良好</text>
  </g>
  <!-- LTM result -->
  <g transform="translate(470,55)">
    <text x="100" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Local Tone Mapping</text>
    <rect x="0" y="15" width="200" height="120" rx="6" stroke="#6a8a7a" stroke-width="2"/>
    <!-- Sky slightly compressed -->
    <rect x="1" y="16" width="198" height="40" rx="5" fill="#90b8d0"/>
    <circle cx="160" cy="35" r="15" fill="#d8d0a0" opacity="0.7"/>
    <!-- Building visible -->
    <rect x="30" y="55" width="60" height="79" rx="1" fill="#4a4a45"/>
    <rect x="35" y="60" width="15" height="15" fill="#606058"/>
    <rect x="55" y="60" width="15" height="15" fill="#606058"/>
    <rect x="35" y="80" width="15" height="15" fill="#555550"/>
    <rect x="55" y="80" width="15" height="15" fill="#555550"/>
    <!-- Trees visible -->
    <rect x="110" y="65" width="80" height="69" rx="1" fill="#4a6040"/>
    <!-- Good annotation -->
    <text x="100" y="155" text-anchor="middle" font-size="8" fill="#6a8a7a">暗部細節可見</text>
    <text x="100" y="170" text-anchor="middle" font-size="8" fill="#6a8a7a">亮部仍有層次</text>
  </g>
  <!-- Comparison analysis -->
  <g transform="translate(20,260)">
    <rect x="0" y="0" width="320" height="110" rx="6" fill="rgba(100,140,180,0.06)" stroke="#648cb4" stroke-width="1"/>
    <text x="160" y="22" text-anchor="middle" font-size="10" fill="#648cb4" font-weight="500">GTM 特性</text>
    <text x="15" y="42" font-size="9" fill="#5a5550">+ 無空間 Artifact（Halo-free）</text>
    <text x="15" y="58" font-size="9" fill="#5a5550">+ 計算效率高（1D LUT）</text>
    <text x="15" y="74" font-size="9" fill="#5a5550">+ 色彩一致性好</text>
    <text x="15" y="92" font-size="9" fill="#c44040">- 無法同時最佳化亮暗區域</text>
    <text x="15" y="106" font-size="9" fill="#c44040">- 高 DR 場景效果有限</text>
  </g>
  <g transform="translate(360,260)">
    <rect x="0" y="0" width="320" height="110" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="160" y="22" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">LTM 特性</text>
    <text x="15" y="42" font-size="9" fill="#5a5550">+ 暗部和亮部細節同時保留</text>
    <text x="15" y="58" font-size="9" fill="#5a5550">+ 適應高動態範圍場景</text>
    <text x="15" y="74" font-size="9" fill="#5a5550">+ 更接近人眼視覺體驗</text>
    <text x="15" y="92" font-size="9" fill="#c44040">- 可能產生 Halo Artifact</text>
    <text x="15" y="106" font-size="9" fill="#c44040">- 計算量大、調參複雜</text>
  </g>
</svg><div class="caption">圖 5-3：同一 HDR 場景下 Global 與 Local Tone Mapping 效果的差異</div></div>

<h3>LTM 的核心演算法</h3>

<h4>1. 雙邊濾波法 (Bilateral Filter)</h4>
<p>Durand & Dorsey (2002) 提出的經典方法：將亮度分解為 Base Layer（低頻，整體亮度）和 Detail Layer（高頻，細節紋理），只壓縮 Base Layer，保留 Detail Layer。雙邊濾波器（Bilateral Filter）用於分離兩層，因為它能保邊緣。</p>
<div class="formula">L = Base × Detail<br>Base = BilateralFilter(L)<br>Detail = L / Base<br>L_out = Compress(Base) × Detail</div>

<h4>2. 局部直方圖法</h4>
<p>將影像分成多個區塊（Block），對每個區塊做獨立的直方圖均衡化（Histogram Equalization），再在區塊之間做雙線性插值（Bilinear Interpolation）以避免邊界不連續。這就是 CLAHE（Contrast Limited Adaptive Histogram Equalization）的基本原理。</p>

<h4>3. 多尺度方法</h4>
<p>使用高斯金字塔（Gaussian Pyramid）或拉普拉斯金字塔（Laplacian Pyramid）在不同尺度上處理亮度。大尺度壓縮動態範圍，小尺度保留細節。</p>

<div class="info-box warn">
<div class="box-title">注意事項</div>
LTM 最常見的問題是 Halo Artifact——在高對比邊緣（如建築物與天空的交界處）出現不自然的亮帶或暗帶。這是因為局部亮度估計在邊緣處不準確。解決方法包括：使用 Edge-preserving Filter（如 Bilateral Filter、Guided Filter）、減小 LTM 強度、增加 Halo 抑制機制。
</div>

<h3>現代 ISP 中的 LTM 實作</h3>
<p>手機 ISP 中的 LTM 通常使用以下策略：</p>
<ol>
<li>將影像下采樣（Downsample）到較小解析度（如 1/8 或 1/16）</li>
<li>在小影像上計算局部亮度估計（Local Brightness Map）</li>
<li>使用 Guided Filter 或 Bilateral Filter 進行邊緣保持平滑</li>
<li>將 Brightness Map 上采樣（Upsample）回原始解析度</li>
<li>根據 Brightness Map 調整每個像素的 Tone Curve</li>
</ol>

<div class="info-box example">
<div class="box-title">設計範例</div>
Qualcomm Spectra ISP 的 LTM 使用 16×12 的 Grid 將影像分割為小區塊，每個區塊計算一個目標亮度值。然後在區塊之間做雙線性插值，生成平滑的 Gain Map。最後將 Gain Map 與原始亮度相乘，實現局部亮度調整。Grid 的大小可以根據場景動態調整。
</div>

<p>在實務中，LTM 的強度通常是場景自適應的。平坦場景（如藍天白雲）不需要太強的 LTM，否則會看起來不自然；高對比場景（如逆光、室內窗戶）則需要較強的 LTM。AE 統計資訊中的場景動態範圍估計可以用來控制 LTM 的強度。</p>
`,
      keyPoints: [
        "LTM 根據像素局部鄰域特性提供不同的映射，模擬人眼的局部適應",
        "經典方法包括雙邊濾波分層法、CLAHE、多尺度金字塔法",
        "Halo Artifact 是 LTM 最常見的問題，需使用 Edge-preserving Filter 抑制",
        "手機 ISP 的 LTM 通常使用下采樣 + Gain Map + 上采樣的策略",
        "LTM 強度應根據場景動態範圍自適應調整"
      ]
    },
    {
      id: "ch5_4",
      title: "Gamma Curve 與 Tone Curve 設計",
      content: `
<h3>Gamma Curve 與 Tone Curve 的關係</h3>
<p>在第四章中我們已經介紹了 Gamma Correction 的基本原理。在 Tone Mapping 的語境下，Gamma Curve 只是 Tone Curve 的一種特殊形式。Tone Curve（色調曲線）是更通用的概念——它可以是任意形狀的單調映射函數，用來控制影像的整體亮度分佈和對比度。</p>

<p>在 ISP 設計中，Tone Curve 通常結合了 Gamma 校正和 Global Tone Mapping 的功能。一條精心設計的 Tone Curve 不僅實現了線性到非線性的轉換，還可以壓縮高光、提升暗部、增強中間調對比，一步到位地完成多個處理目標。</p>

<div class="diagram"><svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="380" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">S-Curve Tone Curve 設計與控制點</text>
  <!-- Main curve plot -->
  <g transform="translate(80,55)">
    <rect x="0" y="0" width="350" height="280" rx="4" fill="rgba(245,240,235,0.5)" stroke="#d5cec7" stroke-width="1"/>
    <!-- Grid -->
    <line x1="0" y1="70" x2="350" y2="70" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="0" y1="140" x2="350" y2="140" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="0" y1="210" x2="350" y2="210" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="87" y1="0" x2="87" y2="280" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="175" y1="0" x2="175" y2="280" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <line x1="262" y1="0" x2="262" y2="280" stroke="#d5cec7" stroke-width="0.3" stroke-dasharray="3,4"/>
    <!-- Diagonal reference -->
    <line x1="0" y1="280" x2="350" y2="0" stroke="#d5cec7" stroke-width="1" stroke-dasharray="5,3"/>
    <!-- Gamma 2.2 curve -->
    <path d="M0,280 Q20,195 50,160 Q100,100 175,55 Q250,22 350,0" fill="none" stroke="#8a8580" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="280" y="30" font-size="9" fill="#8a8580">Gamma 1/2.2</text>
    <!-- S-curve tone curve -->
    <path d="M0,280 Q10,278 25,270 Q50,252 80,215 Q115,160 155,110 Q195,65 240,32 Q280,14 320,6 Q340,3 350,2" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
    <text x="250" y="50" font-size="10" fill="#6a8a7a" font-weight="500">S-Curve</text>
    <!-- Control points -->
    <circle cx="25" cy="270" r="6" fill="#c4a064" stroke="#fff" stroke-width="1.5"/>
    <text x="40" y="268" font-size="8" fill="#c4a064">Toe Point</text>
    <circle cx="155" cy="110" r="6" fill="#6a8a7a" stroke="#fff" stroke-width="1.5"/>
    <text x="170" y="108" font-size="8" fill="#6a8a7a">Mid-tone</text>
    <circle cx="300" cy="8" r="6" fill="#648cb4" stroke="#fff" stroke-width="1.5"/>
    <text x="280" y="22" font-size="8" fill="#648cb4">Shoulder</text>
    <!-- Black point -->
    <circle cx="0" cy="280" r="4" fill="#5a5550"/>
    <text x="8" y="275" font-size="8" fill="#5a5550">Black</text>
    <!-- White point -->
    <circle cx="350" cy="2" r="4" fill="#5a5550"/>
    <!-- Axes labels -->
    <text x="175" y="305" text-anchor="middle" font-size="10" fill="#8a8580">Input (Linear)</text>
    <text x="-18" y="140" text-anchor="middle" font-size="10" fill="#8a8580" transform="rotate(-90,-18,140)">Output</text>
    <!-- Region annotations -->
    <rect x="2" y="215" width="80" height="63" fill="rgba(196,160,100,0.06)" stroke="none"/>
    <text x="42" y="260" text-anchor="middle" font-size="8" fill="#c4a064">Toe</text>
    <rect x="82" y="68" width="180" height="148" fill="rgba(106,138,122,0.04)" stroke="none"/>
    <text x="172" y="200" text-anchor="middle" font-size="8" fill="#6a8a7a">Mid-tone</text>
    <rect x="262" y="2" width="86" height="68" fill="rgba(100,140,180,0.06)" stroke="none"/>
    <text x="305" y="60" text-anchor="middle" font-size="8" fill="#648cb4">Shoulder</text>
  </g>
  <!-- Parameter descriptions -->
  <g transform="translate(470,60)">
    <text x="0" y="0" font-size="11" fill="#5a5550" font-weight="500">Tone Curve 參數</text>
    <rect x="0" y="15" width="200" height="255" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <circle cx="18" cy="40" r="5" fill="#c4a064"/>
    <text x="30" y="44" font-size="9" fill="#5a5550" font-weight="500">Toe（暗部）</text>
    <text x="30" y="58" font-size="8" fill="#8a8580">控制暗部提升程度</text>
    <text x="30" y="72" font-size="8" fill="#8a8580">影響暗部對比度和噪聲</text>
    <circle cx="18" cy="100" r="5" fill="#6a8a7a"/>
    <text x="30" y="104" font-size="9" fill="#5a5550" font-weight="500">Mid-tone（中間調）</text>
    <text x="30" y="118" font-size="8" fill="#8a8580">控制整體亮度</text>
    <text x="30" y="132" font-size="8" fill="#8a8580">影響 18% 灰的輸出</text>
    <circle cx="18" cy="160" r="5" fill="#648cb4"/>
    <text x="30" y="164" font-size="9" fill="#5a5550" font-weight="500">Shoulder（高光）</text>
    <text x="30" y="178" font-size="8" fill="#8a8580">控制高光壓縮/滾降</text>
    <text x="30" y="192" font-size="8" fill="#8a8580">越平 = 壓縮越強</text>
    <line x1="15" y1="210" x2="185" y2="210" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="230" font-size="9" fill="#5a5550" font-weight="500">S-Curve 效果：</text>
    <text x="15" y="248" font-size="8" fill="#8a8580">暗部壓縮 + 亮部壓縮</text>
    <text x="15" y="262" font-size="8" fill="#8a8580">= 中間調對比度增強</text>
  </g>
</svg><div class="caption">圖 5-4：S-Curve Tone Curve 的設計，展示 Toe、Mid-tone、Shoulder 三個控制區域</div></div>

<h3>Tone Curve 的設計方法</h3>
<p>在 ISP 中，Tone Curve 的設計有幾種常見方法：</p>

<h4>方法一：控制點插值</h4>
<p>定義若干控制點（如 Toe、Mid-tone、Shoulder），用 Cubic Spline 或 Catmull-Rom Spline 插值生成平滑曲線。這是最直覺的方法，設計師可以用圖形化工具調整控制點。</p>

<h4>方法二：參數化公式</h4>
<p>使用帶參數的數學公式定義曲線。例如 Filmic Tone Curve 可以用以下參數控制：</p>

<pre>
// Hable (Uncharted 2) Filmic Tone Curve
float hable(float x, float A, float B, float C, float D, float E, float F) {
    return ((x * (A*x + C*B) + D*E) / (x * (A*x + B) + D*F)) - E/F;
}
// A=shoulder strength, B=linear strength, C=linear angle
// D=toe strength, E=toe numerator, F=toe denominator
</pre>

<h4>方法三：基於直方圖的自適應曲線</h4>
<p>根據影像的亮度直方圖動態調整 Tone Curve。例如，暗部像素多時，自動提升暗部；亮部像素多時，自動壓縮亮部。這是 Auto Tone 演算法的基礎，將在後續章節詳述。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
Tone Curve 的斜率決定了該亮度區域的對比度。斜率 > 1 表示增強對比度，斜率 < 1 表示壓縮對比度，斜率 = 1 表示不改變。S-Curve 之所以能增強整體對比感，是因為它在中間調的斜率 > 1，而在暗部和亮部的斜率 < 1。
</div>

<h3>場景自適應 Tone Curve</h3>
<p>固定的 Tone Curve 無法適應所有場景。現代 ISP 使用場景自適應（Scene-Adaptive）的 Tone Curve：</p>
<ul>
<li><strong>逆光場景</strong>：增強 Toe 區域，大幅提亮暗部</li>
<li><strong>夜景</strong>：整體提亮但保持暗部黑色深度</li>
<li><strong>高對比場景</strong>：S 曲線壓縮亮暗兩端，保留中間調</li>
<li><strong>低對比場景（霧天）</strong>：增加 S 曲線強度，增強對比</li>
</ul>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在設計 Tone Curve 時，一個重要的約束是保持單調性（Monotonicity）——輸入增加時，輸出也必須增加或至少不減少。如果 Tone Curve 出現非單調區域，會導致色彩反轉（Tone Reversal），在影像中產生非常不自然的效果。此外，曲線的一階導數應該是連續的，避免出現斜率突變導致的色彩斷帶。
</div>
`,
      keyPoints: [
        "Tone Curve 是 Gamma Curve 的通用化，結合了 Gamma 校正與 GTM 功能",
        "三個關鍵區域：Toe（暗部提升）、Mid-tone（整體亮度）、Shoulder（高光壓縮）",
        "S-Curve 在中間調斜率 > 1，增強對比度；暗部亮部斜率 < 1，壓縮動態範圍",
        "設計方法包括控制點插值、參數化公式、直方圖自適應",
        "Tone Curve 必須保持單調性和一階導數連續性"
      ]
    },
    {
      id: "ch5_5",
      title: "HDR Merge 多曝光融合",
      content: `
<h3>HDR Merge 的原理</h3>
<p>HDR Merge（多曝光融合）是通過合併不同曝光時間拍攝的多張影像，來擴展 Sensor 的有效動態範圍。單次曝光的動態範圍受限於 Sensor 的 Full Well Capacity 和 Read Noise，典型值約為 60-70 dB。通過融合短曝光（保留亮部）、中曝光（保留中間調）和長曝光（保留暗部）的影像，可以將有效動態範圍擴展到 100 dB 以上。</p>

<p>在手機 ISP 中，HDR Merge 是最常用的 HDR 技術。它通常使用 Sensor 的 Staggered HDR 模式——在一個幀週期內交錯採集不同曝光時間的行，然後在 ISP 中即時融合。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Multi-Exposure HDR Merge Pipeline</text>
  <!-- Short exposure -->
  <g transform="translate(20,60)">
    <rect x="0" y="0" width="130" height="85" rx="6" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="10" fill="#648cb4" font-weight="500">Short Exposure</text>
    <text x="65" y="36" text-anchor="middle" font-size="8" fill="#8a8580">T = T₀/4</text>
    <!-- Bright scene: sky visible -->
    <rect x="10" y="42" width="110" height="35" rx="3" fill="#b8d0e8"/>
    <circle cx="95" cy="55" r="10" fill="#f0e8c0"/>
    <rect x="10" y="58" width="50" height="19" rx="1" fill="#1a1a18"/>
    <rect x="65" y="58" width="55" height="19" rx="1" fill="#252520"/>
    <text x="65" y="90" text-anchor="middle" font-size="7" fill="#648cb4">亮部細節佳，暗部全黑</text>
  </g>
  <!-- Medium exposure -->
  <g transform="translate(20,165)">
    <rect x="0" y="0" width="130" height="85" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Medium Exposure</text>
    <text x="65" y="36" text-anchor="middle" font-size="8" fill="#8a8580">T = T₀</text>
    <rect x="10" y="42" width="110" height="35" rx="3" fill="#d8e8f0"/>
    <circle cx="95" cy="55" r="10" fill="#fff8e0" opacity="0.9"/>
    <rect x="10" y="58" width="50" height="19" rx="1" fill="#404040"/>
    <rect x="65" y="58" width="55" height="19" rx="1" fill="#505840"/>
    <text x="65" y="90" text-anchor="middle" font-size="7" fill="#6a8a7a">中間調最佳曝光</text>
  </g>
  <!-- Long exposure -->
  <g transform="translate(20,270)">
    <rect x="0" y="0" width="130" height="85" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="10" fill="#c4a064" font-weight="500">Long Exposure</text>
    <text x="65" y="36" text-anchor="middle" font-size="8" fill="#8a8580">T = T₀×4</text>
    <rect x="10" y="42" width="110" height="35" rx="3" fill="#f0f0f0"/>
    <circle cx="95" cy="55" r="10" fill="#fff" opacity="0.9"/>
    <rect x="10" y="58" width="50" height="19" rx="1" fill="#707068"/>
    <rect x="65" y="58" width="55" height="19" rx="1" fill="#80906a"/>
    <text x="65" y="90" text-anchor="middle" font-size="7" fill="#c4a064">暗部細節佳，亮部過曝</text>
  </g>
  <!-- Merge arrows -->
  <line x1="150" y1="100" x2="210" y2="185" stroke="#648cb4" stroke-width="1.5" marker-end="url(#arrow5m)"/>
  <line x1="150" y1="207" x2="210" y2="195" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow5m)"/>
  <line x1="150" y1="310" x2="210" y2="205" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arrow5m)"/>
  <!-- Merge module -->
  <g transform="translate(210,155)">
    <rect x="0" y="0" width="170" height="100" rx="10" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="85" y="25" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="500">HDR Merge</text>
    <text x="85" y="45" text-anchor="middle" font-size="8" fill="#5a5550">Weight Map 計算</text>
    <text x="85" y="60" text-anchor="middle" font-size="8" fill="#5a5550">Alignment（對齊）</text>
    <text x="85" y="75" text-anchor="middle" font-size="8" fill="#5a5550">Ghost Detection</text>
    <text x="85" y="90" text-anchor="middle" font-size="8" fill="#5a5550">Weighted Blend</text>
  </g>
  <!-- Arrow to TMO -->
  <line x1="380" y1="205" x2="420" y2="205" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow5m)"/>
  <!-- Tone Mapping -->
  <g transform="translate(420,170)">
    <rect x="0" y="0" width="120" height="70" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="60" y="25" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Tone Mapping</text>
    <text x="60" y="42" text-anchor="middle" font-size="8" fill="#8a8580">GTM + LTM</text>
    <text x="60" y="57" text-anchor="middle" font-size="8" fill="#8a8580">HDR → LDR</text>
  </g>
  <!-- Arrow to output -->
  <line x1="540" y1="205" x2="570" y2="205" stroke="#6a8a7a" stroke-width="1.5" marker-end="url(#arrow5m)"/>
  <!-- Output HDR image -->
  <g transform="translate(570,160)">
    <rect x="0" y="0" width="110" height="90" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="55" y="18" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">HDR Output</text>
    <rect x="8" y="25" width="94" height="32" rx="2" fill="#90b0d0"/>
    <circle cx="82" cy="38" r="8" fill="#e0d8a0" opacity="0.7"/>
    <rect x="8" y="42" width="42" height="20" rx="1" fill="#555550"/>
    <rect x="52" y="42" width="50" height="20" rx="1" fill="#607050"/>
    <text x="55" y="78" text-anchor="middle" font-size="7" fill="#6a8a7a">亮暗細節俱佳</text>
  </g>
  <!-- Weight curve -->
  <g transform="translate(210,280)">
    <rect x="0" y="0" width="350" height="90" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="175" y="18" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Weight Map 設計原則</text>
    <text x="15" y="38" font-size="8" fill="#648cb4">Short Exp: 高亮度區域權重高（保留亮部細節）</text>
    <text x="15" y="54" font-size="8" fill="#6a8a7a">Medium Exp: 中間亮度區域權重高（最佳 SNR）</text>
    <text x="15" y="70" font-size="8" fill="#c4a064">Long Exp: 低亮度區域權重高（保留暗部細節）</text>
    <text x="15" y="86" font-size="8" fill="#5a5550">飽和/過暗像素的權重應降為 0，避免引入錯誤數據</text>
  </g>
  <defs><marker id="arrow5m" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#6a8a7a"/></marker></defs>
</svg><div class="caption">圖 5-5：多曝光 HDR Merge Pipeline——短/中/長曝光影像經權重融合產生 HDR 影像</div></div>

<h3>HDR Merge 的關鍵技術</h3>

<h4>1. Weight Map 設計</h4>
<p>每張曝光影像中，只有「適當曝光」的像素是可信的。過曝（Saturated）和嚴重欠曝的像素應被排除。常見的權重函數是三角形或高斯形：</p>
<div class="formula">w(z) = 1 - (2z/Z_max - 1)², 其中 z 為像素值，Z_max 為最大值</div>

<h4>2. Motion Alignment</h4>
<p>如果多張曝光之間有物體運動或手持晃動，直接融合會產生鬼影（Ghosting）。解決方法包括：光流法（Optical Flow）對齊、Block Matching 對齊、或使用 Sensor 內建的 Staggered HDR 模式來減少時間差。</p>

<h4>3. Ghost Detection & Removal</h4>
<p>即使對齊後，運動物體（如行人、車輛）仍會在不同曝光中有不同姿態。Ghost Detection 演算法需要偵測這些不一致的區域，並在融合時只採用單一曝光的數據。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
HDR Merge 的融合結果是一張 High Bit-depth（如 16-bit 或 20-bit）的 HDR 影像，其動態範圍遠超顯示器能力。這張 HDR 影像仍需經過 Tone Mapping 才能在 LDR 或 HDR 顯示器上正確呈現。因此，HDR Merge 和 Tone Mapping 是前後搭配的兩個模組。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
Staggered HDR 的一個重要問題是行間的色溫不一致。如果場景光源在一幀內發生變化（如日光燈的 50/60Hz 閃爍），不同曝光的行可能有不同的色溫。ISP 需要在 HDR Merge 前或後進行 Anti-Flicker 處理，否則融合後的影像會出現水平條紋。
</div>
`,
      keyPoints: [
        "HDR Merge 通過融合不同曝光的影像來擴展有效動態範圍",
        "Weight Map 決定每張曝光的貢獻權重，過曝和嚴重欠曝像素權重為 0",
        "Motion Alignment 和 Ghost Detection 是處理運動場景的關鍵",
        "Staggered HDR 在 Sensor 端交錯採集不同曝光，減少時間差",
        "HDR Merge 產出 High Bit-depth 影像，仍需 Tone Mapping 才能顯示"
      ]
    },
    {
      id: "ch5_6",
      title: "Dynamic Range 動態範圍概念",
      content: `
<h3>Dynamic Range 的定義</h3>
<p>Dynamic Range（DR，動態範圍）是一個系統能夠處理的最大信號與最小可分辨信號之比。在影像系統中，它描述了從最暗到最亮能同時捕捉或顯示的亮度範圍。單位通常用分貝（dB）或「Stop」（EV，每增加 1 Stop 表示亮度加倍）表示。</p>

<div class="formula">DR(dB) = 20 × log₁₀(Signal_max / Noise_floor)<br>DR(Stop) = log₂(Signal_max / Noise_floor)</div>

<p>在 Camera Sensor 中，Dynamic Range 取決於兩個因素：Full Well Capacity（飽和電子數，決定最大信號）和 Read Noise（讀出噪聲，決定最小可分辨信號）。典型的手機 Sensor DR 約為 60-75 dB（10-12.5 Stops），而高階 DSLR 可達 80-90 dB（13-15 Stops）。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Dynamic Range 比較：場景 vs Sensor vs 顯示器</text>
  <!-- Scene DR bar -->
  <g transform="translate(40,65)">
    <text x="0" y="0" font-size="11" fill="#5a5550" font-weight="500">Real World Scene</text>
    <rect x="0" y="12" width="620" height="40" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="310" y="37" text-anchor="middle" font-size="10" fill="#c4a064" font-weight="500">~280 dB (46+ Stops)</text>
    <!-- Gradient -->
    <defs>
      <linearGradient id="drGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#1a1a1a"/>
        <stop offset="30%" style="stop-color:#5a5550"/>
        <stop offset="60%" style="stop-color:#c4a064"/>
        <stop offset="100%" style="stop-color:#fffce0"/>
      </linearGradient>
    </defs>
    <rect x="2" y="14" width="616" height="36" rx="5" fill="url(#drGrad1)" opacity="0.3"/>
    <text x="20" y="65" font-size="8" fill="#8a8580">10⁻⁶ cd/m² (星光)</text>
    <text x="250" y="65" font-size="8" fill="#8a8580">10² cd/m² (室內)</text>
    <text x="520" y="65" font-size="8" fill="#8a8580">10⁸ cd/m² (太陽)</text>
  </g>
  <!-- Sensor DR bars -->
  <g transform="translate(40,150)">
    <text x="0" y="0" font-size="11" fill="#5a5550" font-weight="500">Camera Sensor</text>
    <!-- Phone sensor -->
    <rect x="100" y="15" width="200" height="28" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="200" y="34" text-anchor="middle" font-size="9" fill="#6a8a7a">手機 Sensor: ~72 dB (12 Stops)</text>
    <!-- DSLR -->
    <rect x="80" y="48" width="280" height="28" rx="5" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="220" y="67" text-anchor="middle" font-size="9" fill="#6a8a7a">DSLR Sensor: ~84 dB (14 Stops)</text>
    <!-- HDR merged -->
    <rect x="50" y="81" width="400" height="28" rx="5" fill="rgba(106,138,122,0.25)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="250" y="100" text-anchor="middle" font-size="9" fill="#6a8a7a" font-weight="500">HDR Merge: ~100+ dB (16+ Stops)</text>
  </g>
  <!-- Display DR bars -->
  <g transform="translate(40,260)">
    <text x="0" y="0" font-size="11" fill="#5a5550" font-weight="500">Display</text>
    <!-- SDR display -->
    <rect x="150" y="15" width="120" height="28" rx="5" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="210" y="34" text-anchor="middle" font-size="9" fill="#648cb4">SDR: ~54 dB (9 Stops)</text>
    <!-- HDR display -->
    <rect x="120" y="48" width="200" height="28" rx="5" fill="rgba(100,140,180,0.18)" stroke="#648cb4" stroke-width="1.5"/>
    <text x="220" y="67" text-anchor="middle" font-size="9" fill="#648cb4">HDR Display: ~60-66 dB (10-11 Stops)</text>
    <!-- HDR10+ display -->
    <rect x="100" y="81" width="260" height="28" rx="5" fill="rgba(100,140,180,0.25)" stroke="#648cb4" stroke-width="2"/>
    <text x="230" y="100" text-anchor="middle" font-size="9" fill="#648cb4" font-weight="500">HDR10+ Peak: ~72 dB (12 Stops)</text>
  </g>
  <!-- Scale bar -->
  <g transform="translate(40,370)">
    <line x1="0" y1="0" x2="620" y2="0" stroke="#d5cec7" stroke-width="1"/>
    <text x="0" y="15" font-size="8" fill="#8a8580">0 dB</text>
    <text x="150" y="15" font-size="8" fill="#8a8580">60 dB</text>
    <text x="310" y="15" font-size="8" fill="#8a8580">120 dB</text>
    <text x="460" y="15" font-size="8" fill="#8a8580">200 dB</text>
    <text x="600" y="15" font-size="8" fill="#8a8580">280 dB</text>
    <!-- tick marks -->
    <line x1="0" y1="-3" x2="0" y2="3" stroke="#8a8580" stroke-width="1"/>
    <line x1="155" y1="-3" x2="155" y2="3" stroke="#8a8580" stroke-width="1"/>
    <line x1="310" y1="-3" x2="310" y2="3" stroke="#8a8580" stroke-width="1"/>
    <line x1="465" y1="-3" x2="465" y2="3" stroke="#8a8580" stroke-width="1"/>
    <line x1="620" y1="-3" x2="620" y2="3" stroke="#8a8580" stroke-width="1"/>
  </g>
</svg><div class="caption">圖 5-6：真實場景、Camera Sensor、顯示器的動態範圍比較</div></div>

<h3>Dynamic Range 的量測</h3>
<p>Sensor 的動態範圍通常使用 EMVA 1288 標準量測。基本方法是在不同曝光量下測量 Signal 和 Noise：</p>

<table>
<tr><th>參數</th><th>定義</th><th>典型值（手機 Sensor）</th></tr>
<tr><td>Full Well Capacity</td><td>飽和電子數</td><td>5,000 - 15,000 e⁻</td></tr>
<tr><td>Read Noise</td><td>讀出噪聲（rms）</td><td>1.0 - 3.0 e⁻ rms</td></tr>
<tr><td>Dynamic Range</td><td>FWC / Read Noise</td><td>60 - 75 dB</td></tr>
<tr><td>SNR max</td><td>Shot Noise Limited</td><td>37 - 42 dB</td></tr>
</table>

<h3>Stop 與 dB 的關係</h3>
<p>攝影中常用「Stop」（或 EV）來描述動態範圍。每 1 Stop 等於亮度加倍，約等於 6.02 dB。轉換關係為：</p>
<div class="formula">Stops = DR(dB) / 6.02 = log₂(Signal_max / Noise_floor)</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
場景的動態範圍、Sensor 的捕獲能力、和顯示器的呈現能力之間存在巨大的 Gap。ISP 的角色就是通過 HDR Merge 擴展捕獲範圍，再通過 Tone Mapping 壓縮到顯示範圍，同時盡可能保留人眼關注的視覺資訊。這就是 HDR/Tone Mapping 存在的根本原因。
</div>

<h3>影響 Dynamic Range 的因素</h3>
<ul>
<li><strong>Pixel Size</strong>：更大的像素有更高的 FWC 和更低的相對 Read Noise，DR 更大</li>
<li><strong>ISO/Gain</strong>：增加 Analog Gain 會放大 Read Noise，減少有效 DR</li>
<li><strong>ADC Bit Depth</strong>：10-bit ADC 最多記錄 60 dB，12-bit 最多 72 dB，14-bit 最多 84 dB</li>
<li><strong>溫度</strong>：高溫增加暗電流噪聲，降低 DR</li>
</ul>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在評估 ISP 的 HDR 性能時，不要只看 Sensor 規格中的 DR 數值。更重要的是實際場景中 ISP 能呈現的「可用動態範圍」（Usable Dynamic Range）。這包括了 HDR Merge 的效率、Tone Mapping 的品質、以及最終顯示器的能力。一個 100 dB 的 HDR Merge 如果 Tone Mapping 做得差，輸出可能還不如一個 70 dB 但 Tone Mapping 優秀的系統。
</div>
`,
      keyPoints: [
        "Dynamic Range 是最大信號與最小可辨信號之比，單位為 dB 或 Stop",
        "手機 Sensor DR 約 60-75 dB，HDR Merge 可擴展至 100+ dB",
        "SDR 顯示器約 54 dB，HDR 顯示器約 60-72 dB",
        "每 1 Stop = 6.02 dB = 亮度加倍",
        "ISP 的角色是通過 HDR Merge 和 Tone Mapping 橋接場景與顯示器的 DR Gap"
      ]
    },
    {
      id: "ch5_7",
      title: "HDR 標準：HDR10、Dolby Vision、HLG",
      content: `
<h3>HDR 標準概覽</h3>
<p>隨著顯示技術的進步，多種 HDR 標準被制定來定義 HDR 內容的編碼、傳輸和顯示方式。對 ISP 工程師而言，理解這些標準至關重要，因為 Camera 輸出的 HDR 內容需要符合特定標準才能在目標裝置上正確呈現。三個最重要的 HDR 標準是 HDR10、Dolby Vision 和 HLG。</p>

<div class="diagram"><svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="420" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">HDR 標準比較：HDR10 vs Dolby Vision vs HLG</text>
  <!-- HDR10 -->
  <g transform="translate(20,55)">
    <rect x="0" y="0" width="210" height="330" rx="8" fill="rgba(100,140,180,0.06)" stroke="#648cb4" stroke-width="2"/>
    <text x="105" y="25" text-anchor="middle" font-size="13" fill="#648cb4" font-weight="500">HDR10</text>
    <text x="105" y="42" text-anchor="middle" font-size="8" fill="#8a8580">CTA 標準 | 開放免費</text>
    <line x1="15" y1="52" x2="195" y2="52" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="72" font-size="9" fill="#5a5550" font-weight="500">色域：</text>
    <text x="65" y="72" font-size="9" fill="#648cb4">BT.2020</text>
    <text x="15" y="92" font-size="9" fill="#5a5550" font-weight="500">位深：</text>
    <text x="65" y="92" font-size="9" fill="#648cb4">10-bit</text>
    <text x="15" y="112" font-size="9" fill="#5a5550" font-weight="500">EOTF：</text>
    <text x="65" y="112" font-size="9" fill="#648cb4">PQ (ST 2084)</text>
    <text x="15" y="132" font-size="9" fill="#5a5550" font-weight="500">峰值亮度：</text>
    <text x="90" y="132" font-size="9" fill="#648cb4">1,000+ nits</text>
    <text x="15" y="152" font-size="9" fill="#5a5550" font-weight="500">Metadata：</text>
    <text x="90" y="152" font-size="9" fill="#648cb4">Static (整部影片)</text>
    <line x1="15" y1="165" x2="195" y2="165" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="185" font-size="8" fill="#6a8a7a">優點：</text>
    <text x="15" y="200" font-size="8" fill="#8a8580">• 開放標準，免授權費</text>
    <text x="15" y="215" font-size="8" fill="#8a8580">• 廣泛支援（電視/手機）</text>
    <text x="15" y="230" font-size="8" fill="#8a8580">• 實作簡單</text>
    <text x="15" y="255" font-size="8" fill="#c44040">缺點：</text>
    <text x="15" y="270" font-size="8" fill="#8a8580">• Static Metadata 無法適應</text>
    <text x="15" y="285" font-size="8" fill="#8a8580">  每個場景的亮度變化</text>
    <text x="15" y="300" font-size="8" fill="#8a8580">• 低階 HDR 顯示器可能</text>
    <text x="15" y="315" font-size="8" fill="#8a8580">  tone map 不佳</text>
  </g>
  <!-- Dolby Vision -->
  <g transform="translate(245,55)">
    <rect x="0" y="0" width="210" height="330" rx="8" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="2"/>
    <text x="105" y="25" text-anchor="middle" font-size="13" fill="#6a8a7a" font-weight="500">Dolby Vision</text>
    <text x="105" y="42" text-anchor="middle" font-size="8" fill="#8a8580">Dolby 專利 | 需授權</text>
    <line x1="15" y1="52" x2="195" y2="52" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="72" font-size="9" fill="#5a5550" font-weight="500">色域：</text>
    <text x="65" y="72" font-size="9" fill="#6a8a7a">BT.2020 / P3</text>
    <text x="15" y="92" font-size="9" fill="#5a5550" font-weight="500">位深：</text>
    <text x="65" y="92" font-size="9" fill="#6a8a7a">12-bit</text>
    <text x="15" y="112" font-size="9" fill="#5a5550" font-weight="500">EOTF：</text>
    <text x="65" y="112" font-size="9" fill="#6a8a7a">PQ (ST 2084)</text>
    <text x="15" y="132" font-size="9" fill="#5a5550" font-weight="500">峰值亮度：</text>
    <text x="90" y="132" font-size="9" fill="#6a8a7a">4,000+ nits</text>
    <text x="15" y="152" font-size="9" fill="#5a5550" font-weight="500">Metadata：</text>
    <text x="90" y="152" font-size="9" fill="#6a8a7a">Dynamic (每場景)</text>
    <line x1="15" y1="165" x2="195" y2="165" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="185" font-size="8" fill="#6a8a7a">優點：</text>
    <text x="15" y="200" font-size="8" fill="#8a8580">• 12-bit 更精細的量化</text>
    <text x="15" y="215" font-size="8" fill="#8a8580">• Dynamic Metadata 適應</text>
    <text x="15" y="230" font-size="8" fill="#8a8580">  每個場景</text>
    <text x="15" y="245" font-size="8" fill="#8a8580">• 向下相容 HDR10</text>
    <text x="15" y="270" font-size="8" fill="#c44040">缺點：</text>
    <text x="15" y="285" font-size="8" fill="#8a8580">• 需 Dolby 授權費</text>
    <text x="15" y="300" font-size="8" fill="#8a8580">• 需專用硬體解碼晶片</text>
    <text x="15" y="315" font-size="8" fill="#8a8580">• 實作較複雜</text>
  </g>
  <!-- HLG -->
  <g transform="translate(470,55)">
    <rect x="0" y="0" width="210" height="330" rx="8" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="2"/>
    <text x="105" y="25" text-anchor="middle" font-size="13" fill="#c4a064" font-weight="500">HLG</text>
    <text x="105" y="42" text-anchor="middle" font-size="8" fill="#8a8580">BBC/NHK | 廣播專用</text>
    <line x1="15" y1="52" x2="195" y2="52" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="72" font-size="9" fill="#5a5550" font-weight="500">色域：</text>
    <text x="65" y="72" font-size="9" fill="#c4a064">BT.2020</text>
    <text x="15" y="92" font-size="9" fill="#5a5550" font-weight="500">位深：</text>
    <text x="65" y="92" font-size="9" fill="#c4a064">10-bit</text>
    <text x="15" y="112" font-size="9" fill="#5a5550" font-weight="500">EOTF：</text>
    <text x="65" y="112" font-size="9" fill="#c4a064">HLG (ARIB STD-B67)</text>
    <text x="15" y="132" font-size="9" fill="#5a5550" font-weight="500">峰值亮度：</text>
    <text x="90" y="132" font-size="9" fill="#c4a064">1,000 nits</text>
    <text x="15" y="152" font-size="9" fill="#5a5550" font-weight="500">Metadata：</text>
    <text x="90" y="152" font-size="9" fill="#c4a064">無（Scene-referred）</text>
    <line x1="15" y1="165" x2="195" y2="165" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="185" font-size="8" fill="#6a8a7a">優點：</text>
    <text x="15" y="200" font-size="8" fill="#8a8580">• 向下相容 SDR 電視</text>
    <text x="15" y="215" font-size="8" fill="#8a8580">• 不需 Metadata</text>
    <text x="15" y="230" font-size="8" fill="#8a8580">• 適合即時廣播</text>
    <text x="15" y="245" font-size="8" fill="#8a8580">• 免授權費</text>
    <text x="15" y="270" font-size="8" fill="#c44040">缺點：</text>
    <text x="15" y="285" font-size="8" fill="#8a8580">• 動態範圍不如 PQ</text>
    <text x="15" y="300" font-size="8" fill="#8a8580">• SDR 相容模式畫質</text>
    <text x="15" y="315" font-size="8" fill="#8a8580">  可能較差</text>
  </g>
</svg><div class="caption">圖 5-7：三大 HDR 標準特性比較——HDR10、Dolby Vision、HLG</div></div>

<h3>PQ vs HLG Transfer Function</h3>
<p>PQ（Perceptual Quantizer，ST 2084）和 HLG 是兩種根本不同的 HDR 傳輸函數：</p>

<table>
<tr><th>特性</th><th>PQ (ST 2084)</th><th>HLG (ARIB STD-B67)</th></tr>
<tr><td>設計哲學</td><td>Display-referred（絕對亮度）</td><td>Scene-referred（相對亮度）</td></tr>
<tr><td>亮度範圍</td><td>0 - 10,000 nits（絕對）</td><td>相對於顯示器能力</td></tr>
<tr><td>SDR 相容</td><td>不直接相容，需 Tone Mapping</td><td>低亮度區域接近 Gamma，直接相容</td></tr>
<tr><td>適合場景</td><td>串流、電影、預錄內容</td><td>即時廣播、直播</td></tr>
</table>

<div class="info-box key">
<div class="box-title">核心概念</div>
PQ 的設計基於人眼的亮度感知模型（Barten Model），確保在整個亮度範圍內（0.0001 到 10,000 nits）都不會產生可見的量化帶。10-bit PQ 可以涵蓋人眼在任何亮度下都無法察覺的最小亮度差異。而 HLG 的設計更實用，它的下半段是傳統的 Gamma 曲線（相容 SDR），上半段是對數曲線（擴展 HDR）。
</div>

<h3>對 ISP 的影響</h3>
<p>ISP 輸出 HDR 內容時，需要根據目標標準選擇正確的 Pipeline 配置：</p>
<ul>
<li><strong>HDR10 輸出</strong>：BT.2020 色域、10-bit、PQ Transfer Function、Static Metadata</li>
<li><strong>Dolby Vision 輸出</strong>：需要 Dolby 認證的硬體、12-bit Processing、Dynamic Metadata Generator</li>
<li><strong>HLG 輸出</strong>：BT.2020 色域、10-bit、HLG Transfer Function、不需 Metadata</li>
</ul>

<div class="info-box tip">
<div class="box-title">實務提示</div>
手機拍攝 HDR 影片時，通常會使用 HDR10 或 HLG 格式。Apple 的 iPhone 使用 Dolby Vision Profile 8.4（HLG + Dynamic Metadata 的混合方案），這是一種創新做法。Samsung 則主要使用 HDR10+。對 ISP 工程師來說，最重要的是確保 Pipeline 的 Bit Depth、色域、Transfer Function 端到端一致，避免任何截斷或轉換錯誤。
</div>
`,
      keyPoints: [
        "HDR10 開放免費、Static Metadata；Dolby Vision 12-bit Dynamic Metadata；HLG 向下相容 SDR",
        "PQ 是 Display-referred（絕對亮度），HLG 是 Scene-referred（相對亮度）",
        "PQ 基於人眼 Barten Model 設計，10-bit 涵蓋無可見量化差異",
        "ISP 輸出 HDR 需確保 Bit Depth、色域、Transfer Function 端到端一致",
        "iPhone 使用 Dolby Vision Profile 8.4，Samsung 使用 HDR10+"
      ]
    },
    {
      id: "ch5_8",
      title: "Tone Mapping 與細節保留",
      content: `
<h3>壓縮與細節的矛盾</h3>
<p>Tone Mapping 的本質是壓縮——將大範圍的亮度壓縮到小範圍。但壓縮不可避免地會損失某些區域的細節。當 Tone Curve 的斜率小於 1 時，該區域的對比度被降低，細節的可見性隨之下降。如果壓縮過度，影像會看起來「平淡」（Flat），失去立體感和紋理。</p>

<p>好的 Tone Mapping 必須在「壓縮動態範圍」和「保留細節」之間找到平衡。這是 ISP 調試中最需要經驗和審美判斷的環節之一。</p>

<div class="diagram"><svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="380" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">過度壓縮 vs 均衡 Tone Mapping 的細節比較</text>
  <!-- Over-compressed -->
  <g transform="translate(30,55)">
    <text x="145" y="0" text-anchor="middle" font-size="11" fill="#c44040" font-weight="500">Over-Compressed（過度壓縮）</text>
    <rect x="0" y="15" width="290" height="130" rx="6" stroke="#c44040" stroke-width="1.5" fill="rgba(196,64,64,0.04)"/>
    <!-- Flat sky (no cloud detail) -->
    <rect x="5" y="20" width="280" height="45" rx="3" fill="#a0b8c8"/>
    <text x="145" y="48" text-anchor="middle" font-size="8" fill="#fff">雲層細節消失 (Shoulder 太平)</text>
    <!-- Flat building -->
    <rect x="5" y="65" width="130" height="75" rx="1" fill="#787872"/>
    <rect x="15" y="72" width="25" height="20" fill="#808078"/>
    <rect x="50" y="72" width="25" height="20" fill="#808078"/>
    <rect x="15" y="100" width="25" height="20" fill="#7a7a74"/>
    <rect x="50" y="100" width="25" height="20" fill="#7a7a74"/>
    <text x="67" y="152" text-anchor="middle" font-size="8" fill="#c44040">暗部紋理不清</text>
    <!-- Flat landscape -->
    <rect x="140" y="80" width="140" height="60" rx="1" fill="#889880"/>
    <text x="210" y="115" text-anchor="middle" font-size="8" fill="#fff">草地/樹木缺乏層次</text>
    <!-- Problem annotations -->
    <rect x="0" y="160" width="290" height="55" rx="4" fill="rgba(196,64,64,0.06)" stroke="#c44040" stroke-width="0.5"/>
    <text x="10" y="178" font-size="8" fill="#c44040" font-weight="500">問題：</text>
    <text x="10" y="193" font-size="8" fill="#5a5550">• 影像灰濛（Flat/Washed-out）</text>
    <text x="10" y="208" font-size="8" fill="#5a5550">• 亮暗區域都缺乏對比度和紋理</text>
  </g>
  <!-- Balanced -->
  <g transform="translate(370,55)">
    <text x="145" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Balanced（均衡映射）</text>
    <rect x="0" y="15" width="290" height="130" rx="6" stroke="#6a8a7a" stroke-width="2" fill="rgba(106,138,122,0.04)"/>
    <!-- Sky with cloud detail -->
    <rect x="5" y="20" width="280" height="45" rx="3" fill="#88b0d0"/>
    <ellipse cx="80" cy="35" rx="40" ry="10" fill="#a0c0e0" opacity="0.7"/>
    <ellipse cx="200" cy="40" rx="50" ry="8" fill="#98b8d8" opacity="0.6"/>
    <text x="145" y="60" text-anchor="middle" font-size="8" fill="#fff">雲層細節可見</text>
    <!-- Building with texture -->
    <rect x="5" y="65" width="130" height="75" rx="1" fill="#5a5a55"/>
    <rect x="15" y="72" width="25" height="20" fill="#706a60" stroke="#585550" stroke-width="0.5"/>
    <rect x="50" y="72" width="25" height="20" fill="#706a60" stroke="#585550" stroke-width="0.5"/>
    <rect x="15" y="100" width="25" height="20" fill="#605a52" stroke="#504a45" stroke-width="0.5"/>
    <rect x="50" y="100" width="25" height="20" fill="#605a52" stroke="#504a45" stroke-width="0.5"/>
    <text x="67" y="152" text-anchor="middle" font-size="8" fill="#6a8a7a">暗部紋理清晰</text>
    <!-- Landscape with detail -->
    <rect x="140" y="80" width="140" height="60" rx="1" fill="#607848"/>
    <rect x="145" y="85" width="30" height="50" rx="1" fill="#506838"/>
    <rect x="185" y="90" width="25" height="45" rx="1" fill="#587040"/>
    <rect x="220" y="88" width="30" height="47" rx="1" fill="#4a6030"/>
    <rect x="260" y="92" width="22" height="43" rx="1" fill="#587840"/>
    <!-- Good annotations -->
    <rect x="0" y="160" width="290" height="55" rx="4" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="0.5"/>
    <text x="10" y="178" font-size="8" fill="#6a8a7a" font-weight="500">效果：</text>
    <text x="10" y="193" font-size="8" fill="#5a5550">• 暗部提亮且保留紋理</text>
    <text x="10" y="208" font-size="8" fill="#5a5550">• 亮部壓縮但雲層細節可見</text>
  </g>
  <!-- Technical explanation -->
  <g transform="translate(30,285)">
    <rect x="0" y="0" width="640" height="75" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="320" y="20" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">細節保留的技術關鍵</text>
    <text x="15" y="40" font-size="9" fill="#5a5550">1. <tspan fill="#6a8a7a">Local Contrast</tspan>：保留局部對比度（微觀紋理），壓縮全域動態範圍（宏觀亮度）</text>
    <text x="15" y="57" font-size="9" fill="#5a5550">2. <tspan fill="#6a8a7a">Base-Detail 分離</tspan>：只壓縮 Base Layer，完整保留 Detail Layer</text>
    <text x="15" y="74" font-size="9" fill="#5a5550">3. <tspan fill="#6a8a7a">適度的 Tone Curve 斜率</tspan>：任何區域的斜率不應過低（建議 > 0.3），否則細節不可見</text>
  </g>
</svg><div class="caption">圖 5-8：過度壓縮導致細節損失 vs 均衡 Tone Mapping 保留暗部與亮部細節</div></div>

<h3>細節保留的策略</h3>

<h4>1. Base-Detail 分離</h4>
<p>這是 LTM 中最核心的細節保留策略。將影像分解為低頻的 Base Layer 和高頻的 Detail Layer，只對 Base Layer 做動態範圍壓縮，Detail Layer 原封不動地保留或甚至增強。重組後的影像既壓縮了動態範圍，又保留了所有的細節紋理。</p>

<div class="formula">Output = ToneMap(Base) × Detail × Enhancement_Factor</div>

<h4>2. 多尺度細節增強</h4>
<p>在不同尺度上分析和增強細節。大尺度（Low Frequency）做動態範圍壓縮，中尺度保持局部對比度，小尺度增強微觀紋理。使用拉普拉斯金字塔（Laplacian Pyramid）是常見的多尺度方法。</p>

<h4>3. 自適應 Gain Map</h4>
<p>根據像素的局部亮度決定增益。暗部區域使用較高的增益（提亮），亮部使用較低的增益（壓縮）。增益的平滑程度決定了 Halo 的嚴重性。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
「Local Contrast」和「Global Contrast」是兩個不同的概念。Global Contrast 指的是影像整體的亮暗比，由 Tone Curve 的整體形狀決定。Local Contrast 指的是相鄰像素之間的亮度差異，即紋理和細節。好的 Tone Mapping 壓縮 Global Contrast 的同時保持或增強 Local Contrast。
</div>

<h3>常見的細節損失問題</h3>
<ul>
<li><strong>Shoulder Clipping</strong>：高光區域被壓到接近白色，雲層等亮部紋理消失</li>
<li><strong>Toe Crushing</strong>：暗部被壓到接近黑色，陰影中的細節不可見</li>
<li><strong>Mid-tone Flattening</strong>：中間調的 Tone Curve 斜率過低，導致整體「灰濛」感</li>
<li><strong>Color Desaturation</strong>：Tone Mapping 可能導致色彩飽和度下降，尤其在高光壓縮區域</li>
</ul>

<div class="info-box warn">
<div class="box-title">注意事項</div>
在 Tone Mapping 中增強細節時，噪聲也會被放大。特別是暗部提亮（Toe 提升）的過程中，暗部的噪聲會變得非常明顯。因此，Tone Mapping 和降噪（Noise Reduction）必須協同設計。在暗部提亮區域需要更強的降噪，而亮部壓縮區域的降噪可以減弱以保留更多紋理。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
評估 Tone Mapping 細節保留品質的一個好方法是觀察「棋盤格圖案」（Checkerboard Pattern）在不同亮度區域的可見性。如果某個亮度區域的棋盤格變得模糊或消失，說明該區域的 Tone Curve 斜率過低，需要調整。
</div>
`,
      keyPoints: [
        "Tone Mapping 的核心挑戰是在壓縮動態範圍的同時保留細節",
        "Base-Detail 分離是最核心的細節保留策略——只壓縮 Base Layer",
        "保持 Local Contrast（紋理）的同時壓縮 Global Contrast（動態範圍）",
        "Tone Curve 任何區域的斜率不應過低（建議 > 0.3），否則細節不可見",
        "暗部提亮會放大噪聲，Tone Mapping 和 NR 必須協同設計"
      ]
    },
    {
      id: "ch5_9",
      title: "Auto Tone 演算法",
      content: `
<h3>Auto Tone 的目標</h3>
<p>Auto Tone（自動色調調整）是指根據影像的亮度分佈自動選擇最佳的 Tone Curve，無需人工干預。在手機 ISP 中，Auto Tone 與 Auto Exposure（AE）密切配合，確保每張照片都有適當的亮度和對比度。AE 決定了 Sensor 的曝光量，而 Auto Tone 則在 AE 決定的曝光基礎上進一步優化亮度分佈。</p>

<p>Auto Tone 的核心輸入是影像的亮度直方圖（Luminance Histogram）。通過分析直方圖的分佈特性，演算法可以判斷影像是偏亮、偏暗、低對比、高對比，還是逆光，並據此調整 Tone Curve。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="400" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Histogram-Based Auto Tone 調整流程</text>
  <!-- Input histogram -->
  <g transform="translate(30,55)">
    <text x="90" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Step 1: 分析直方圖</text>
    <rect x="0" y="15" width="180" height="110" rx="6" fill="rgba(245,240,235,0.8)" stroke="#d5cec7" stroke-width="1"/>
    <!-- Histogram bars (bimodal - backlit) -->
    <rect x="10" y="90" width="8" height="30" fill="#6a8a7a" opacity="0.7"/>
    <rect x="20" y="60" width="8" height="60" fill="#6a8a7a" opacity="0.7"/>
    <rect x="30" y="45" width="8" height="75" fill="#6a8a7a" opacity="0.7"/>
    <rect x="40" y="55" width="8" height="65" fill="#6a8a7a" opacity="0.7"/>
    <rect x="50" y="75" width="8" height="45" fill="#6a8a7a" opacity="0.7"/>
    <rect x="60" y="95" width="8" height="25" fill="#6a8a7a" opacity="0.4"/>
    <rect x="70" y="100" width="8" height="20" fill="#6a8a7a" opacity="0.3"/>
    <rect x="80" y="105" width="8" height="15" fill="#6a8a7a" opacity="0.3"/>
    <rect x="90" y="100" width="8" height="20" fill="#6a8a7a" opacity="0.3"/>
    <rect x="100" y="95" width="8" height="25" fill="#6a8a7a" opacity="0.4"/>
    <rect x="110" y="80" width="8" height="40" fill="#6a8a7a" opacity="0.5"/>
    <rect x="120" y="65" width="8" height="55" fill="#6a8a7a" opacity="0.6"/>
    <rect x="130" y="50" width="8" height="70" fill="#6a8a7a" opacity="0.7"/>
    <rect x="140" y="40" width="8" height="80" fill="#6a8a7a" opacity="0.8"/>
    <rect x="150" y="55" width="8" height="65" fill="#6a8a7a" opacity="0.7"/>
    <rect x="160" y="80" width="8" height="40" fill="#6a8a7a" opacity="0.5"/>
    <text x="90" y="135" text-anchor="middle" font-size="8" fill="#8a8580">Bimodal → 逆光場景</text>
  </g>
  <!-- Scene analysis -->
  <g transform="translate(230,55)">
    <text x="90" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Step 2: 場景判斷</text>
    <rect x="0" y="15" width="180" height="110" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="15" y="40" font-size="9" fill="#5a5550" font-weight="500">直方圖特徵分析：</text>
    <text x="15" y="58" font-size="8" fill="#8a8580">• Mean / Median 亮度</text>
    <text x="15" y="72" font-size="8" fill="#8a8580">• Percentile (P5, P95)</text>
    <text x="15" y="86" font-size="8" fill="#8a8580">• 偏度 (Skewness)</text>
    <text x="15" y="100" font-size="8" fill="#8a8580">• 雙峰特性 (Bimodal)</text>
    <text x="15" y="114" font-size="8" fill="#6a8a7a">判定：逆光、高 DR</text>
  </g>
  <!-- Tone curve generation -->
  <g transform="translate(430,55)">
    <text x="120" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">Step 3: 生成 Tone Curve</text>
    <rect x="0" y="15" width="240" height="110" rx="6" fill="rgba(245,240,235,0.8)" stroke="#d5cec7" stroke-width="1"/>
    <!-- Axes -->
    <line x1="15" y1="110" x2="225" y2="110" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="15" y1="110" x2="15" y2="25" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Default curve (dashed) -->
    <path d="M15,110 Q50,90 80,70 Q120,45 160,30 Q200,22 225,20" fill="none" stroke="#d5cec7" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- Adjusted curve -->
    <path d="M15,110 Q30,100 45,82 Q65,58 90,42 Q130,24 170,16 Q200,12 225,10" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
    <text x="170" y="50" font-size="8" fill="#d5cec7">預設</text>
    <text x="100" y="30" font-size="8" fill="#6a8a7a">調整後</text>
    <text x="80" y="75" font-size="8" fill="#c4a064">暗部提升</text>
    <path d="M60,85 L60,55" fill="none" stroke="#c4a064" stroke-width="1" marker-end="url(#arrow5at)"/>
  </g>
  <!-- Output result -->
  <g transform="translate(30,210)">
    <rect x="0" y="0" width="640" height="75" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="320" y="20" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Step 4: 時域平滑 (Temporal Smoothing)</text>
    <text x="15" y="42" font-size="9" fill="#5a5550">避免 Tone Curve 在連續幀之間劇烈跳變（Flickering）</text>
    <text x="15" y="60" font-size="9" fill="#8a8580">Curve_t = α × Curve_new + (1-α) × Curve_(t-1)，α 通常為 0.05-0.15</text>
  </g>
  <!-- Auto Tone flow -->
  <g transform="translate(30,310)">
    <rect x="0" y="0" width="640" height="65" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="320" y="18" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Auto Tone 典型決策邏輯</text>
    <text x="15" y="38" font-size="8" fill="#5a5550">暗影像 (Mean < 30%) → 提升 Mid-tone & Toe | 亮影像 (Mean > 70%) → 壓制 Shoulder</text>
    <text x="15" y="54" font-size="8" fill="#5a5550">低對比 (P95-P5 < 40%) → 增強 S-Curve | 逆光 (Bimodal) → 大幅提升 Toe + 壓制 Shoulder</text>
  </g>
  <defs><marker id="arrow5at" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#c4a064"/></marker></defs>
</svg><div class="caption">圖 5-9：基於直方圖分析的 Auto Tone 四步調整流程</div></div>

<h3>直方圖分析指標</h3>
<p>Auto Tone 演算法通常從直方圖中提取以下特徵：</p>

<table>
<tr><th>指標</th><th>計算方法</th><th>意義</th></tr>
<tr><td>Mean</td><td>所有像素亮度的平均值</td><td>整體亮度偏亮或偏暗</td></tr>
<tr><td>Median</td><td>50th Percentile</td><td>比 Mean 更 Robust 的亮度指標</td></tr>
<tr><td>P5 / P95</td><td>5th / 95th Percentile</td><td>有效亮度範圍的上下界</td></tr>
<tr><td>Contrast</td><td>P95 - P5</td><td>影像的對比度</td></tr>
<tr><td>Skewness</td><td>三階中心矩</td><td>分佈的偏斜方向（偏亮/偏暗）</td></tr>
<tr><td>Bimodality</td><td>雙峰檢測</td><td>是否為逆光場景</td></tr>
</table>

<h3>Auto Tone 的實作策略</h3>

<h4>策略一：目標直方圖法</h4>
<p>定義一個「理想直方圖」（Target Histogram），然後計算從實際直方圖到目標直方圖的映射函數（即 Tone Curve）。Histogram Equalization 是這種方法的極端形式（目標為均勻分佈）。</p>

<h4>策略二：分區調整法</h4>
<p>將亮度範圍分為暗部、中間調、亮部三個區域，分別設定各區域的目標亮度和對比度，然後用 Spline 插值生成平滑的 Tone Curve。</p>

<h4>策略三：場景分類 + 預設曲線</h4>
<p>利用 AI 場景分類（Scene Detection），識別場景類型（如風景、人像、夜景、逆光），然後套用對應的預設 Tone Curve。每個預設曲線都是針對該場景類型優化過的。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
Auto Tone 在錄影模式下有一個額外的要求：時域穩定性（Temporal Stability）。Tone Curve 不能在連續幀之間劇烈變化，否則畫面會閃爍。解決方法是使用 IIR（Infinite Impulse Response）低通濾波器對 Tone Curve 做時域平滑。平滑係數的選擇是一個 trade-off：太快會閃爍，太慢會延遲適應。
</div>

<div class="info-box example">
<div class="box-title">設計範例</div>
一個實用的 Auto Tone 邏輯：(1) 計算直方圖的 P5 和 P95 作為有效範圍。(2) 設定 Toe 點：使 P5 映射到 Output 的 5%-10%。(3) 設定 Shoulder 點：使 P95 映射到 Output 的 90%-95%。(4) 設定 Mid-tone：使 Median 映射到 Output 的 45%-55%。(5) 用 Cubic Spline 插值生成完整 Tone Curve。(6) 對 Curve 做時域平滑。
</div>

<div class="info-box warn">
<div class="box-title">注意事項</div>
Auto Tone 需要特別注意「人臉保護」。在逆光人像場景中，Auto Tone 可能會過度壓縮亮部以提亮人臉。但這樣做可能讓背景天空完全過曝。因此，Auto Tone 應與 Face Detection 結合——當偵測到人臉時，調整 Tone Curve 使人臉亮度落在合適的範圍，同時盡可能保留背景。
</div>
`,
      keyPoints: [
        "Auto Tone 根據亮度直方圖自動選擇最佳 Tone Curve",
        "分析指標包括 Mean、Percentile、Contrast、Skewness、Bimodality",
        "實作策略包括目標直方圖法、分區調整法、AI 場景分類 + 預設曲線",
        "錄影模式需要時域平滑（IIR 低通濾波），避免幀間 Tone 閃爍",
        "Auto Tone 應與 Face Detection 結合，在逆光場景保護人臉曝光"
      ]
    },
    {
      id: "ch5_10",
      title: "車用相機 WDR/HDR",
      content: `
<h3>車用相機的特殊挑戰</h3>
<p>車用相機（Automotive Camera）對 HDR/WDR（Wide Dynamic Range）的需求遠超消費級相機。車輛在行駛中會遭遇極端的動態範圍場景：從隧道出口的強烈陽光（10⁵ lux 以上）到隧道內的昏暗環境（1 lux 以下），動態範圍可達 120 dB 以上。在這些場景中，相機必須同時看清道路標誌、交通信號燈、前方車輛和行人——任何一個目標的遺失都可能導致安全事故。</p>

<p>因此，車用相機的 Tone Mapping 設計哲學與手機相機截然不同。手機追求「好看」，車用追求「看清」。功能安全（Functional Safety，ISO 26262）是最高優先級。</p>

<div class="diagram"><svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="700" height="420" rx="8"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">車用相機 HDR 典型場景</text>
  <!-- Tunnel exit scene -->
  <g transform="translate(20,55)">
    <text x="155" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">場景一：隧道出口</text>
    <rect x="0" y="15" width="310" height="150" rx="6" fill="#2a2820" stroke="#d5cec7" stroke-width="1"/>
    <!-- Tunnel walls -->
    <rect x="5" y="20" width="60" height="140" rx="1" fill="#1a1818"/>
    <rect x="245" y="20" width="60" height="140" rx="1" fill="#1a1818"/>
    <!-- Bright exit -->
    <rect x="75" y="25" width="160" height="80" rx="4" fill="#e8e0c0"/>
    <circle cx="155" cy="50" r="20" fill="#fff8d0" opacity="0.8"/>
    <!-- Road -->
    <rect x="75" y="105" width="160" height="55" rx="1" fill="#404038"/>
    <line x1="155" y1="110" x2="155" y2="155" stroke="#c4c0a0" stroke-width="2" stroke-dasharray="8,6"/>
    <!-- Car ahead (small) -->
    <rect x="125" y="95" width="30" height="15" rx="2" fill="#606058"/>
    <!-- Labels -->
    <text x="155" y="48" text-anchor="middle" font-size="8" fill="#5a5550">10⁵ lux</text>
    <text x="30" y="100" text-anchor="middle" font-size="8" fill="#8a8580">1 lux</text>
    <text x="155" y="180" text-anchor="middle" font-size="8" fill="#8a8580">DR &gt; 120 dB</text>
  </g>
  <!-- Night headlights scene -->
  <g transform="translate(370,55)">
    <text x="155" y="0" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">場景二：夜間對向車燈</text>
    <rect x="0" y="15" width="310" height="150" rx="6" fill="#1a1a20" stroke="#d5cec7" stroke-width="1"/>
    <!-- Road -->
    <rect x="5" y="105" width="300" height="55" rx="1" fill="#303038"/>
    <line x1="155" y1="110" x2="155" y2="155" stroke="#a0a070" stroke-width="1.5" stroke-dasharray="6,5"/>
    <!-- Oncoming car headlights -->
    <circle cx="100" cy="90" r="18" fill="#f0f0d0" opacity="0.7"/>
    <circle cx="100" cy="90" r="8" fill="#fff" opacity="0.9"/>
    <circle cx="140" cy="90" r="18" fill="#f0f0d0" opacity="0.7"/>
    <circle cx="140" cy="90" r="8" fill="#fff" opacity="0.9"/>
    <!-- Light glare lines -->
    <line x1="80" y1="85" x2="40" y2="80" stroke="#e0e0b0" stroke-width="1" opacity="0.5"/>
    <line x1="160" y1="85" x2="200" y2="80" stroke="#e0e0b0" stroke-width="1" opacity="0.5"/>
    <!-- Pedestrian (barely visible) -->
    <rect x="230" y="85" width="8" height="25" rx="2" fill="#505058"/>
    <circle cx="234" cy="82" r="4" fill="#505058"/>
    <text x="234" y="120" text-anchor="middle" font-size="7" fill="#c44040">行人！</text>
    <!-- Traffic sign -->
    <rect x="260" y="40" width="25" height="25" rx="3" fill="#3060a0" stroke="#8080a0" stroke-width="1"/>
    <text x="272" y="57" text-anchor="middle" font-size="8" fill="#fff">60</text>
    <!-- Labels -->
    <text x="120" y="78" text-anchor="middle" font-size="8" fill="#e0e0b0">10⁶ cd/m²</text>
    <text x="235" y="70" text-anchor="middle" font-size="8" fill="#8a8580">0.01 lux</text>
    <text x="155" y="180" text-anchor="middle" font-size="8" fill="#8a8580">車燈 vs 行人：10⁸:1</text>
  </g>
  <!-- Technical requirements -->
  <g transform="translate(20,260)">
    <rect x="0" y="0" width="660" height="130" rx="8" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="330" y="22" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">車用 WDR/HDR 技術要求</text>
    <g transform="translate(15,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">1. Sensor 技術</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">Split-pixel HDR、DOL-HDR</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">Staggered HDR (T1:T2:T3)</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">LFM (LED Flicker Mitigation)</text>
    </g>
    <g transform="translate(175,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">2. Tone Mapping 策略</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">優先辨識度 &gt; 美觀</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">線性段保留（便於 CV 演算法）</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">Anti-Flicker 處理 LED 信號燈</text>
    </g>
    <g transform="translate(380,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">3. 安全要求</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">ISO 26262 ASIL-B/D</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">120 dB+ Dynamic Range</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">即時處理延遲 &lt; 1 frame</text>
    </g>
    <g transform="translate(540,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">4. 輸出需求</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">同時支援 HDR 顯示</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">與 CV/DNN 處理</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">多路輸出 (20-bit)</text>
    </g>
  </g>
</svg><div class="caption">圖 5-10：車用相機典型 HDR 場景——隧道出口與夜間對向車燈，以及技術要求</div></div>

<h3>車用 HDR Sensor 技術</h3>
<p>車用相機的 HDR 需求推動了 Sensor 技術的創新：</p>

<h4>1. Staggered HDR (DOL-HDR)</h4>
<p>在一幀週期內交替曝光不同時間的行。例如長曝光行→短曝光行→長曝光行...。ISP 端做行間融合。這是目前最常用的車用 HDR 方式。</p>

<h4>2. Split-Pixel HDR</h4>
<p>Sony 的 Split-Pixel 技術（如 IMX490）在每個像素中整合大小兩個光電二極管。大的有高靈敏度（暗部），小的有高飽和度（亮部），兩者的數據在片上融合。可達 130+ dB。</p>

<h4>3. Sub-Exposure HDR</h4>
<p>Samsung ISOCELL 使用的技術，在單一曝光週期內進行多次 ADC 讀取，每次讀取對應不同的曝光量。避免了 Staggered HDR 的運動偽影問題。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
車用相機的一個獨特需求是 LED Flicker Mitigation（LFM，LED 閃爍消除）。現代交通信號燈和車尾燈使用 LED，以高頻率（通常 90-1000 Hz）開關。如果 Sensor 的曝光時間（特別是 HDR 的短曝光）與 LED 開關週期不匹配，拍到的信號燈可能是「熄滅」狀態。LFM 要求短曝光時間足夠長（通常 > 1/500s），或使用 Chopping 技術來避免這個問題。
</div>

<h3>車用 Tone Mapping 的設計差異</h3>
<table>
<tr><th>特性</th><th>手機相機</th><th>車用相機</th></tr>
<tr><td>目標</td><td>好看、討喜</td><td>看清、辨識</td></tr>
<tr><td>DR 需求</td><td>80-100 dB</td><td>120+ dB</td></tr>
<tr><td>Tone Curve</td><td>S-curve，強調美感</td><td>接近線性，保留辨識度</td></tr>
<tr><td>LTM</td><td>積極使用</td><td>保守使用（避免 Artifact）</td></tr>
<tr><td>色彩風格</td><td>品牌風格化</td><td>中性準確</td></tr>
<tr><td>延遲要求</td><td>可容忍數幀</td><td>&lt; 1 幀（安全關鍵）</td></tr>
<tr><td>輸出</td><td>8-bit sRGB</td><td>20-bit Linear + 8-bit Display</td></tr>
</table>

<h3>車用 ISP 的雙輸出架構</h3>
<p>車用 ISP 通常有兩條輸出路徑：</p>
<ul>
<li><strong>Human View Path</strong>：給駕駛員看的畫面。經過完整的 Tone Mapping、色彩處理、銳化。輸出 8-bit sRGB 到車內螢幕</li>
<li><strong>Machine View Path</strong>：給 ADAS/自駕 CV 演算法用的數據。保持高 Bit-depth 的線性或接近線性的數據。Tone Mapping 很輕或完全不做，以保留物理亮度資訊供 DNN 處理</li>
</ul>

<div class="info-box warn">
<div class="box-title">注意事項</div>
車用相機的 HDR 處理必須滿足嚴格的實時性要求。整個 ISP Pipeline（包括 HDR Merge 和 Tone Mapping）的延遲不能超過一幀（通常 33ms @30fps）。任何延遲都會影響 ADAS 系統的反應時間。此外，ISP 必須通過 ISO 26262 的功能安全認證，確保在任何故障情況下都不會輸出誤導性的影像。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在車用 HDR Tone Mapping 的調試中，一個常用的測試方法是在隧道出入口場景中，確認以下目標同時可見：(1) 隧道外的交通標誌文字可讀；(2) 隧道內的車輛輪廓清晰；(3) 路面標線可辨識；(4) LED 交通燈不閃爍且顏色正確。這四個條件同時滿足，才算合格的車用 HDR 性能。
</div>
`,
      keyPoints: [
        "車用相機追求「看清辨識」而非「好看」，安全是最高優先級",
        "車用場景 DR 可達 120+ dB，需要 Split-pixel 或 Staggered HDR 技術",
        "LED Flicker Mitigation 是車用特有的需求，避免信號燈拍到「熄滅」狀態",
        "車用 ISP 需雙輸出：Human View（Tone Mapped）和 Machine View（Linear）",
        "整個 Pipeline 延遲不超過 1 幀，需通過 ISO 26262 功能安全認證"
      ]
    }
  ]
};
