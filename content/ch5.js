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
    },
    {
      id: "ch5_11",
      title: "Tone Mapping 硬體架構",
      content: `
<h3>硬體 Pipeline 中的 Tone Mapping</h3>
<p>在硬體 ISP 中，Tone Mapping 模組的架構設計直接影響晶片面積、功耗和即時性。與軟體不同，硬體必須在每個 Clock Cycle 產出一個（或多個）像素的結果，不能使用迴圈或遞迴算法。因此，Tone Mapping 的硬體實現主要分為兩大類：LUT-based（查表法）和 Curve-based（曲線計算法）。</p>

<div class="diagram"><svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="420" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Tone Mapping 硬體架構比較</text>
  <!-- LUT-based -->
  <g transform="translate(20,50)">
    <text x="130" y="0" text-anchor="middle" font-size="11" fill="#c4a064" font-weight="500">LUT-based 架構</text>
    <rect x="0" y="15" width="260" height="160" rx="6" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1.5"/>
    <rect x="20" y="35" width="80" height="30" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
    <text x="60" y="54" text-anchor="middle" font-size="9" fill="#5a5550">Input Pixel</text>
    <line x1="100" y1="50" x2="130" y2="50" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arr11)"/>
    <rect x="130" y="30" width="100" height="40" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="180" y="50" text-anchor="middle" font-size="9" fill="#5a5550">SRAM LUT</text>
    <text x="180" y="62" text-anchor="middle" font-size="7" fill="#8a8580">4096 entries</text>
    <line x1="180" y1="70" x2="180" y2="90" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arr11)"/>
    <rect x="130" y="90" width="100" height="30" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
    <text x="180" y="109" text-anchor="middle" font-size="9" fill="#5a5550">Output Pixel</text>
    <text x="15" y="145" font-size="8" fill="#6a8a7a">優點：1 cycle latency、可任意曲線</text>
    <text x="15" y="160" font-size="8" fill="#c44040">缺點：SRAM 面積大（14-bit=64K entries）</text>
  </g>
  <!-- Curve-based -->
  <g transform="translate(310,50)">
    <text x="130" y="0" text-anchor="middle" font-size="11" fill="#4a7ab5" font-weight="500">Piecewise Linear 架構</text>
    <rect x="0" y="15" width="270" height="160" rx="6" fill="rgba(74,122,181,0.06)" stroke="#4a7ab5" stroke-width="1.5"/>
    <rect x="15" y="35" width="80" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="55" y="54" text-anchor="middle" font-size="9" fill="#5a5550">Input Pixel</text>
    <line x1="95" y1="50" x2="115" y2="50" stroke="#4a7ab5" stroke-width="1.5"/>
    <rect x="115" y="30" width="70" height="40" rx="4" fill="rgba(74,122,181,0.15)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="150" y="48" text-anchor="middle" font-size="8" fill="#5a5550">Segment</text>
    <text x="150" y="60" text-anchor="middle" font-size="8" fill="#5a5550">Select</text>
    <line x1="185" y1="50" x2="200" y2="50" stroke="#4a7ab5" stroke-width="1.5"/>
    <rect x="200" y="30" width="55" height="40" rx="4" fill="rgba(74,122,181,0.2)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="227" y="48" text-anchor="middle" font-size="8" fill="#5a5550">Lerp</text>
    <text x="227" y="60" text-anchor="middle" font-size="7" fill="#8a8580">y=ax+b</text>
    <line x1="227" y1="70" x2="227" y2="90" stroke="#4a7ab5" stroke-width="1.5" marker-end="url(#arr11)"/>
    <rect x="180" y="90" width="80" height="30" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="220" y="109" text-anchor="middle" font-size="9" fill="#5a5550">Output Pixel</text>
    <text x="10" y="145" font-size="8" fill="#6a8a7a">優點：SRAM 小（16~64 segments）</text>
    <text x="10" y="160" font-size="8" fill="#c44040">缺點：精度受限於 segment 數量</text>
  </g>
  <defs><marker id="arr11" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#5a5550"/></marker></defs>
  <!-- SRAM Requirements table -->
  <g transform="translate(20,240)">
    <rect x="0" y="0" width="560" height="160" rx="6" fill="rgba(213,206,199,0.25)" stroke="#d5cec7" stroke-width="1"/>
    <text x="280" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">SRAM 需求比較</text>
    <line x1="20" y1="35" x2="540" y2="35" stroke="#d5cec7" stroke-width="1"/>
    <text x="30" y="50" font-size="9" fill="#5a5550" font-weight="500">方案</text>
    <text x="170" y="50" font-size="9" fill="#5a5550" font-weight="500">Entries</text>
    <text x="280" y="50" font-size="9" fill="#5a5550" font-weight="500">Bit-width</text>
    <text x="400" y="50" font-size="9" fill="#5a5550" font-weight="500">SRAM Size</text>
    <line x1="20" y1="58" x2="540" y2="58" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="30" y="75" font-size="8" fill="#5a5550">12-bit Full LUT</text>
    <text x="170" y="75" font-size="8" fill="#5a5550">4096</text>
    <text x="280" y="75" font-size="8" fill="#5a5550">12-bit output</text>
    <text x="400" y="75" font-size="8" fill="#c44040">6 KB</text>
    <text x="30" y="95" font-size="8" fill="#5a5550">14-bit Full LUT</text>
    <text x="170" y="95" font-size="8" fill="#5a5550">16384</text>
    <text x="280" y="95" font-size="8" fill="#5a5550">14-bit output</text>
    <text x="400" y="95" font-size="8" fill="#c44040">28 KB</text>
    <text x="30" y="115" font-size="8" fill="#5a5550">PWL 32-segment</text>
    <text x="170" y="115" font-size="8" fill="#5a5550">33 (knees)</text>
    <text x="280" y="115" font-size="8" fill="#5a5550">slope+offset</text>
    <text x="400" y="115" font-size="8" fill="#6a8a7a">~130 Bytes</text>
    <text x="30" y="135" font-size="8" fill="#5a5550">PWL 64-segment (non-uniform)</text>
    <text x="170" y="135" font-size="8" fill="#5a5550">65 (knees)</text>
    <text x="280" y="135" font-size="8" fill="#5a5550">slope+offset</text>
    <text x="400" y="135" font-size="8" fill="#6a8a7a">~260 Bytes</text>
    <text x="30" y="152" font-size="7" fill="#8a8580">* 每個 Bayer Channel (R/Gr/Gb/B) 各需一組，總量需 ×4</text>
  </g>
</svg><div class="caption">圖 5-11：LUT-based vs Piecewise Linear Tone Mapping 硬體架構與 SRAM 需求比較</div></div>

<h3>Real-Time 約束</h3>
<p>硬體 Tone Mapping 必須滿足嚴格的即時約束。以 4K@60fps 為例，像素時脈（Pixel Clock）約為 600 MHz，每個 Clock 需處理至少一個像素。這意味著 Tone Mapping 模組的 Pipeline Latency 可以是幾個 Cycle，但 Throughput 必須是 1 pixel/cycle。</p>

<h4>Pipeline 配置</h4>
<p>典型的硬體 Tone Mapping Pipeline 包含以下階段：</p>
<ul>
<li><strong>Stage 1</strong>：Input Parsing — 從 Line Buffer 讀取像素，進行格式轉換</li>
<li><strong>Stage 2</strong>：Segment Lookup — 根據輸入值找到對應的 LUT entry 或 PWL segment</li>
<li><strong>Stage 3</strong>：Interpolation — 線性插值計算最終輸出值</li>
<li><strong>Stage 4</strong>：Output Clamp — 飽和截斷、格式轉換、寫回 Line Buffer</li>
</ul>

<p>整個 Pipeline 的延遲（Latency）為 4 個 Clock Cycle，但由於 Pipeline 化設計，Throughput 仍然是 1 pixel/cycle。</p>

<div class="note">
在實際 ISP 中，GTM（Global Tone Mapping）通常放在 Demosaic 之後、CCM 之前或之後。放在 Demosaic 之前（RAW domain）可以減少 SRAM 需求（只需 1 通道 LUT），但精度會受到 Bayer Pattern 的影響。放在 RGB domain 則需要 3 通道 LUT，但可以獨立控制每個色彩通道。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
Non-Uniform PWL（非均勻分段線性）是目前硬體 ISP 中最常用的 Tone Mapping 方案。它的分段點不是等距的，而是在暗部密集（因為人眼對暗部更敏感）、在亮部稀疏。這樣可以用很少的分段點（32~64 個）達到接近 Full LUT 的精度，同時 SRAM 開銷極小。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
設計硬體 Tone Mapping 時，要特別注意 Double-Buffering 機制。當 CPU/MCU 更新 LUT 參數時，不能直接寫入正在使用的 LUT，否則會導致畫面撕裂。正確做法是準備兩組 LUT Buffer，在 Vertical Blanking（VBlank）期間切換，確保整幀使用同一組參數。
</div>
`,
      keyPoints: [
        "LUT-based 架構精度高但 SRAM 開銷大，14-bit 需 28KB per channel",
        "Piecewise Linear (PWL) 架構用 32~64 segment 即可達到接近 Full LUT 的效果",
        "Non-Uniform PWL 在暗部密集分段、亮部稀疏，符合人眼感知特性",
        "硬體必須保證 1 pixel/cycle 的 Throughput，Pipeline 化設計是關鍵",
        "LUT 更新需要 Double-Buffering，在 VBlank 期間切換以避免畫面撕裂"
      ]
    },
    {
      id: "ch5_12",
      title: "定點 Tone Curve 實現",
      content: `
<h3>從浮點到定點的轉換</h3>
<p>在學術論文和 PC 軟體中，Tone Curve 通常以浮點數表示（0.0~1.0 範圍）。但在硬體 ISP 中，浮點運算的面積和功耗遠大於定點運算。因此，硬體 Tone Mapping 必須使用定點數（Fixed-Point）來實現所有計算。這個從浮點到定點的轉換過程，是 ISP 硬體工程師必須掌握的核心技能。</p>

<h3>Bit-Depth 考量</h3>
<p>現代 ISP 的內部 Pipeline 通常使用 12-bit、14-bit 或 16-bit 的資料寬度。不同的 Bit-Depth 對 Tone Mapping 的精度有直接影響：</p>

<div class="table-container">
<table>
<tr><th>Pipeline Bit-Depth</th><th>動態範圍</th><th>LUT Size (Full)</th><th>量化精度</th><th>典型應用</th></tr>
<tr><td>12-bit</td><td>72 dB</td><td>4096 entries</td><td>~0.024%</td><td>消費級 ISP</td></tr>
<tr><td>14-bit</td><td>84 dB</td><td>16384 entries</td><td>~0.006%</td><td>中高階 ISP</td></tr>
<tr><td>16-bit</td><td>96 dB</td><td>65536 entries</td><td>~0.0015%</td><td>高階/車用 ISP</td></tr>
</table>
</div>

<h3>LUT 插值的定點實現</h3>
<p>當使用非 Full LUT 時（例如 256 entry 的壓縮 LUT），必須透過插值來獲得任意輸入值的輸出。線性插值（Linear Interpolation, Lerp）在硬體中的定點實現如下：</p>

<div class="formula">
output = LUT[idx] + ((LUT[idx+1] - LUT[idx]) × frac) >> frac_bits
</div>

<p>其中 <code>idx</code> 是 LUT 索引（取輸入的高位元），<code>frac</code> 是小數部分（取輸入的低位元），<code>frac_bits</code> 是小數位元數。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="350" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">定點 LUT 插值硬體實現</text>
  <!-- Input decomposition -->
  <g transform="translate(30,50)">
    <text x="0" y="0" font-size="10" fill="#5a5550" font-weight="500">14-bit Input 分解（256-entry LUT）</text>
    <rect x="0" y="12" width="200" height="30" rx="3" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <rect x="0" y="12" width="120" height="30" rx="3" fill="rgba(196,160,100,0.25)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="60" y="32" text-anchor="middle" font-size="9" fill="#5a5550">idx [13:6] = 8-bit</text>
    <text x="160" y="32" text-anchor="middle" font-size="9" fill="#5a5550">frac [5:0] = 6-bit</text>
    <line x1="60" y1="42" x2="60" y2="65" stroke="#c4a064" stroke-width="1.5" marker-end="url(#arr12)"/>
    <line x1="160" y1="42" x2="160" y2="65" stroke="#4a7ab5" stroke-width="1.5"/>
  </g>
  <!-- LUT Read -->
  <g transform="translate(30,120)">
    <rect x="0" y="0" width="120" height="50" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="60" y="20" text-anchor="middle" font-size="9" fill="#5a5550">LUT SRAM</text>
    <text x="60" y="35" text-anchor="middle" font-size="8" fill="#8a8580">Read [idx], [idx+1]</text>
    <text x="60" y="65" text-anchor="middle" font-size="8" fill="#5a5550">LUT[idx] = A</text>
    <text x="60" y="80" text-anchor="middle" font-size="8" fill="#5a5550">LUT[idx+1] = B</text>
  </g>
  <!-- Subtract -->
  <g transform="translate(200,120)">
    <rect x="0" y="0" width="100" height="40" rx="4" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="50" y="15" text-anchor="middle" font-size="9" fill="#5a5550">Subtract</text>
    <text x="50" y="30" text-anchor="middle" font-size="8" fill="#8a8580">diff = B - A</text>
  </g>
  <!-- Multiply -->
  <g transform="translate(350,120)">
    <rect x="0" y="0" width="120" height="40" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="60" y="15" text-anchor="middle" font-size="9" fill="#5a5550">Multiply</text>
    <text x="60" y="30" text-anchor="middle" font-size="8" fill="#8a8580">prod = diff × frac</text>
  </g>
  <!-- Shift + Add -->
  <g transform="translate(350,190)">
    <rect x="0" y="0" width="120" height="40" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1"/>
    <text x="60" y="15" text-anchor="middle" font-size="9" fill="#5a5550">Shift + Add</text>
    <text x="60" y="30" text-anchor="middle" font-size="8" fill="#8a8580">A + (prod >> 6)</text>
  </g>
  <!-- Output -->
  <g transform="translate(350,260)">
    <rect x="0" y="0" width="120" height="30" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="60" y="20" text-anchor="middle" font-size="9" fill="#5a5550">Output (14-bit)</text>
  </g>
  <!-- Arrows -->
  <line x1="120" y1="145" x2="200" y2="135" stroke="#5a5550" stroke-width="1"/>
  <line x1="300" y1="140" x2="350" y2="140" stroke="#5a5550" stroke-width="1"/>
  <line x1="410" y1="160" x2="410" y2="190" stroke="#5a5550" stroke-width="1" marker-end="url(#arr12)"/>
  <line x1="410" y1="230" x2="410" y2="260" stroke="#5a5550" stroke-width="1" marker-end="url(#arr12)"/>
  <defs><marker id="arr12" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#5a5550"/></marker></defs>
  <!-- Precision note -->
  <g transform="translate(30,250)">
    <rect x="0" y="0" width="280" height="80" rx="6" fill="rgba(213,206,199,0.3)" stroke="#d5cec7" stroke-width="1"/>
    <text x="140" y="18" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">精度分析</text>
    <text x="10" y="35" font-size="8" fill="#5a5550">• 256 entries × 14-bit output = 3.5 KB SRAM</text>
    <text x="10" y="50" font-size="8" fill="#5a5550">• 插值精度：6-bit fractional = 1/64 step</text>
    <text x="10" y="65" font-size="8" fill="#5a5550">• 最大誤差：< 0.5 LSB（14-bit 下）</text>
  </g>
</svg><div class="caption">圖 5-12：14-bit 定點 LUT 插值硬體實現流程</div></div>

<h3>量化誤差分析</h3>
<p>定點實現的量化誤差來自兩個部分：</p>
<ul>
<li><strong>LUT 取樣誤差</strong>：由於 LUT entries 有限，非取樣點的值透過插值近似。在曲線曲率大的區域（如 Knee 點附近），誤差較大</li>
<li><strong>乘法截斷誤差</strong>：<code>diff × frac</code> 的結果右移時，低位元被截斷。可透過加 Rounding 改善（加 0.5 LSB 後再截斷）</li>
</ul>

<div class="formula">
output_rounded = A + ((diff × frac + (1 << (frac_bits-1))) >> frac_bits)
</div>

<div class="note">
在 12-bit 到 8-bit 的 Tone Mapping 中，由於輸出位寬較窄，量化階梯（Banding）是常見問題。特別是在平滑漸變區域（如天空），8-bit 的 256 灰階可能不夠平滑。解決方案包括：Temporal Dithering（時域抖動）和 Spatial Dithering（空間抖動）。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
定點 Tone Curve 設計的一個關鍵技巧是「Log-domain LUT」。不使用線性地址的 LUT，而是用對數地址。例如 14-bit 輸入的高 8-bit 經過一個 Log 壓縮後作為 LUT 地址。這樣暗部區域有更多 LUT entries（精度更高），亮部區域的 entries 較少（因為亮部曲線較平緩，不需高精度）。這與人眼的 Weber-Fechner Law 一致。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
驗證定點 Tone Curve 的方法：用 Python/MATLAB 先建立浮點的 Golden Model，然後用定點模型逐像素比較。關注以下指標：(1) 最大絕對誤差（Max Absolute Error）< 1 LSB；(2) 均方根誤差（RMS Error）< 0.3 LSB；(3) 視覺上無可見的 Banding 或 Step Artifact。
</div>
`,
      keyPoints: [
        "硬體 Tone Mapping 必須使用定點數實現，浮點運算面積和功耗不可接受",
        "LUT 插值的定點實現：output = A + ((B-A) × frac) >> frac_bits",
        "Rounding（加 0.5 LSB）可有效降低截斷誤差",
        "Log-domain LUT 地址可在不增加 SRAM 的前提下提高暗部精度",
        "定點驗證需與浮點 Golden Model 逐像素比較，Max Error < 1 LSB"
      ]
    },
    {
      id: "ch5_13",
      title: "Local Tone Mapping 硬體",
      content: `
<h3>LTM 硬體的挑戰</h3>
<p>Local Tone Mapping（LTM）比 Global Tone Mapping（GTM）在硬體實現上困難得多。GTM 只需要一個全域的 LUT，而 LTM 需要根據每個像素的「局部環境」來調整映射曲線。這意味著硬體必須同時考慮當前像素和其周圍區域的亮度資訊，需要大量的 Line Buffer 和統計計算邏輯。</p>

<div class="diagram"><svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="480" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Block-Based LTM 硬體架構</text>
  <!-- Image grid -->
  <g transform="translate(30,50)">
    <text x="100" y="0" font-size="11" fill="#c4a064" font-weight="500">影像分塊統計</text>
    <rect x="0" y="12" width="200" height="150" rx="4" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <!-- Grid lines -->
    <line x1="50" y1="12" x2="50" y2="162" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="100" y1="12" x2="100" y2="162" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="150" y1="12" x2="150" y2="162" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="0" y1="49" x2="200" y2="49" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="0" y1="87" x2="200" y2="87" stroke="#d5cec7" stroke-width="0.5"/>
    <line x1="0" y1="124" x2="200" y2="124" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Highlighted block -->
    <rect x="50" y="49" width="50" height="38" fill="rgba(196,160,100,0.25)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="75" y="72" text-anchor="middle" font-size="7" fill="#c4a064">Block(i,j)</text>
    <!-- Stats per block -->
    <text x="75" y="82" text-anchor="middle" font-size="6" fill="#8a8580">μ=128, σ=32</text>
    <text x="100" y="180" text-anchor="middle" font-size="8" fill="#5a5550">每個 Block 計算局部統計量</text>
    <text x="100" y="195" text-anchor="middle" font-size="8" fill="#8a8580">（平均亮度、直方圖、標準差）</text>
  </g>
  <!-- Processing pipeline -->
  <g transform="translate(280,50)">
    <text x="140" y="0" font-size="11" fill="#4a7ab5" font-weight="500">LTM 處理 Pipeline</text>
    <rect x="10" y="18" width="260" height="35" rx="4" fill="rgba(74,122,181,0.1)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="140" y="40" text-anchor="middle" font-size="9" fill="#5a5550">① Block Statistics Collection</text>
    <line x1="140" y1="53" x2="140" y2="65" stroke="#4a7ab5" stroke-width="1" marker-end="url(#arr13)"/>
    <rect x="10" y="65" width="260" height="35" rx="4" fill="rgba(74,122,181,0.1)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="140" y="87" text-anchor="middle" font-size="9" fill="#5a5550">② Per-Block Gain/Curve Computation</text>
    <line x1="140" y1="100" x2="140" y2="112" stroke="#4a7ab5" stroke-width="1" marker-end="url(#arr13)"/>
    <rect x="10" y="112" width="260" height="35" rx="4" fill="rgba(74,122,181,0.15)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="140" y="134" text-anchor="middle" font-size="9" fill="#5a5550">③ Bilinear Interpolation (Anti-Halo)</text>
    <line x1="140" y1="147" x2="140" y2="159" stroke="#4a7ab5" stroke-width="1" marker-end="url(#arr13)"/>
    <rect x="10" y="159" width="260" height="35" rx="4" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="140" y="181" text-anchor="middle" font-size="9" fill="#5a5550">④ Apply Gain to Each Pixel</text>
  </g>
  <defs><marker id="arr13" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#4a7ab5"/></marker></defs>
  <!-- Line Buffer requirement -->
  <g transform="translate(30,280)">
    <rect x="0" y="0" width="540" height="180" rx="6" fill="rgba(213,206,199,0.25)" stroke="#d5cec7" stroke-width="1"/>
    <text x="270" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">Line Buffer 需求分析</text>
    <text x="20" y="45" font-size="9" fill="#5a5550">假設：4K 影像（3840×2160），Block Size = 120×120</text>
    <text x="20" y="65" font-size="9" fill="#5a5550">• Block Grid：32×18 = 576 blocks</text>
    <text x="20" y="85" font-size="9" fill="#5a5550">• 統計收集需要 <tspan fill="#c44040">120 lines</tspan> 的 Line Buffer = 120 × 3840 × 14-bit ≈ <tspan fill="#c44040">806 KB</tspan></text>
    <text x="20" y="105" font-size="9" fill="#5a5550">• Bilinear 插值需要 <tspan fill="#6a8a7a">2 rows</tspan> 的 Block Gain Map = 2 × 32 × 16-bit = <tspan fill="#6a8a7a">128 Bytes</tspan></text>
    <text x="20" y="130" font-size="9" fill="#c44040" font-weight="500">Line Buffer 是 LTM 硬體最大的成本！</text>
    <text x="20" y="155" font-size="9" fill="#6a8a7a">優化方案：使用較大的 Block Size 減少需要的 Line Buffer 行數，</text>
    <text x="20" y="170" font-size="9" fill="#6a8a7a">或用 2-pass 架構（第一 pass 收集統計，第二 pass 應用 Gain）。</text>
  </g>
</svg><div class="caption">圖 5-13：Block-Based LTM 硬體架構——分塊統計、Gain 計算、插值與應用</div></div>

<h3>Edge-Aware Downsampling</h3>
<p>為了減少 Line Buffer 的需求，一些先進的 LTM 硬體採用 Edge-Aware Downsampling。基本想法是在降取樣 Gain Map 時，考慮邊緣資訊，避免 Gain 值跨越邊緣被平均化（這會導致 Halo）。</p>

<h4>Bilateral Grid 硬體</h4>
<p>Bilateral Grid 是一種高效的 Edge-Aware 方法，將 2D 影像提升到 3D 空間（x, y, intensity），在 3D 空間中做模糊，然後 Slice 回 2D。硬體實現使用 3D SRAM 作為 Grid，面積開銷約為普通 Line Buffer 的 30~50%。</p>

<div class="note">
硬體 LTM 的另一個設計考量是「Two-Pass vs One-Pass」。Two-Pass 方案在第一次掃描影像時收集統計量，第二次掃描時應用 Gain。這需要整幀的 Frame Buffer（數 MB），但品質最佳。One-Pass 方案使用前一幀的統計量來處理當前幀，避免了 Frame Buffer，但在場景快速變化時可能產生一幀的延遲。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
Block-Based LTM 的 Halo Artifact 主要來自相鄰 Block 之間 Gain 值的突變。解決方案是在 Block 邊界做 Bilinear Interpolation：每個像素的 Gain 由其周圍四個 Block 的 Gain 值加權內插得到。這確保了 Gain Map 的平滑過渡，但在強邊緣處（如天空與建築的交界），平滑的 Gain 仍可能產生 Halo。Edge-Aware 插值可以進一步改善。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
評估 LTM 硬體的 Halo 問題時，最好的測試圖案是「黑白半場」（左半黑、右半白）。理想的 LTM 應該只在邊界附近有極小的亮度過渡，沒有可見的光暈。如果 Halo 寬度超過 Block Size 的一半，說明 Gain Map 的平滑不足或 Block Size 太大。
</div>
`,
      keyPoints: [
        "LTM 硬體的核心挑戰是 Line Buffer 需求——4K 下可達數百 KB",
        "Block-Based 架構：分塊統計 → Gain 計算 → Bilinear 插值 → 應用",
        "Bilinear Interpolation 是避免 Block 邊界 Halo 的關鍵",
        "Edge-Aware Downsampling 和 Bilateral Grid 可進一步抑制 Halo",
        "One-Pass 用前一幀統計量避免 Frame Buffer；Two-Pass 品質更佳但需整幀 Buffer"
      ]
    },
    {
      id: "ch5_14",
      title: "HDR Merge 硬體架構",
      content: `
<h3>多曝光融合的硬體挑戰</h3>
<p>HDR Merge（多曝光融合）是將不同曝光時間的影像合成為一張高動態範圍影像的過程。在硬體 ISP 中，HDR Merge 通常位於 Pipeline 的最前端（BLC 之後、Demosaic 之前），因為需要在 RAW Domain 進行融合以避免色彩偏移。硬體的主要挑戰包括：運動偵測（Motion Detection）、Ghost 消除（Deghosting）和 Frame Buffer 管理。</p>

<div class="diagram"><svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="440" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">HDR Merge 硬體 Pipeline</text>
  <!-- Multi-exposure inputs -->
  <g transform="translate(20,50)">
    <rect x="0" y="0" width="110" height="35" rx="4" fill="rgba(196,64,64,0.1)" stroke="#c44040" stroke-width="1.5"/>
    <text x="55" y="15" text-anchor="middle" font-size="9" fill="#5a5550">Long Exposure</text>
    <text x="55" y="28" text-anchor="middle" font-size="7" fill="#c44040">T₁ = 33ms</text>
    <rect x="0" y="50" width="110" height="35" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="55" y="65" text-anchor="middle" font-size="9" fill="#5a5550">Medium Exp</text>
    <text x="55" y="78" text-anchor="middle" font-size="7" fill="#c4a064">T₂ = 4ms</text>
    <rect x="0" y="100" width="110" height="35" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="55" y="115" text-anchor="middle" font-size="9" fill="#5a5550">Short Exposure</text>
    <text x="55" y="128" text-anchor="middle" font-size="7" fill="#4a7ab5">T₃ = 0.5ms</text>
  </g>
  <!-- Motion Detection -->
  <g transform="translate(170,50)">
    <rect x="0" y="20" width="120" height="90" rx="6" fill="rgba(196,64,64,0.06)" stroke="#c44040" stroke-width="1.5"/>
    <text x="60" y="50" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Motion</text>
    <text x="60" y="65" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Detection</text>
    <text x="60" y="85" text-anchor="middle" font-size="7" fill="#8a8580">像素級比對</text>
    <text x="60" y="97" text-anchor="middle" font-size="7" fill="#8a8580">|L×R - S×R| > Th?</text>
  </g>
  <!-- Arrows from exposures to motion detect -->
  <line x1="130" y1="67" x2="170" y2="75" stroke="#5a5550" stroke-width="1"/>
  <line x1="130" y1="87" x2="170" y2="85" stroke="#5a5550" stroke-width="1"/>
  <line x1="130" y1="117" x2="170" y2="100" stroke="#5a5550" stroke-width="1"/>
  <!-- Weight Map -->
  <g transform="translate(330,50)">
    <rect x="0" y="20" width="110" height="90" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="55" y="50" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Weight Map</text>
    <text x="55" y="65" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Generation</text>
    <text x="55" y="85" text-anchor="middle" font-size="7" fill="#8a8580">SNR-based</text>
    <text x="55" y="97" text-anchor="middle" font-size="7" fill="#8a8580">+ Motion Mask</text>
  </g>
  <line x1="290" y1="85" x2="330" y2="85" stroke="#5a5550" stroke-width="1" marker-end="url(#arr14)"/>
  <!-- Merge -->
  <g transform="translate(480,50)">
    <rect x="0" y="20" width="100" height="90" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="50" y="55" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Weighted</text>
    <text x="50" y="70" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Merge</text>
    <text x="50" y="95" text-anchor="middle" font-size="7" fill="#8a8580">Σ(wᵢ × Eᵢ/Tᵢ)</text>
  </g>
  <line x1="440" y1="85" x2="480" y2="85" stroke="#5a5550" stroke-width="1" marker-end="url(#arr14)"/>
  <defs><marker id="arr14" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#5a5550"/></marker></defs>
  <!-- Frame Buffer section -->
  <g transform="translate(20,185)">
    <rect x="0" y="0" width="560" height="110" rx="6" fill="rgba(74,122,181,0.05)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="280" y="22" text-anchor="middle" font-size="11" fill="#4a7ab5" font-weight="500">Frame Buffer 管理策略</text>
    <g transform="translate(15,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">Staggered HDR (Line-interleaved)</text>
      <text x="0" y="27" font-size="8" fill="#6a8a7a">Line Buffer Only — 不需要 Frame Buffer</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">長短曝光行交替排列，ISP 逐行融合</text>
    </g>
    <g transform="translate(200,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">Sequential HDR (Frame-based)</text>
      <text x="0" y="27" font-size="8" fill="#c44040">需要 1~2 Frame Buffer（數 MB DDR）</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">先讀完一幀長曝光，再讀短曝光</text>
    </g>
    <g transform="translate(410,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">Split-Pixel HDR</text>
      <text x="0" y="27" font-size="8" fill="#6a8a7a">Pixel-level 融合，無需額外 Buffer</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">大小光電二極管在同一像素內</text>
    </g>
  </g>
  <!-- Deghosting detail -->
  <g transform="translate(20,315)">
    <rect x="0" y="0" width="560" height="110" rx="6" fill="rgba(196,64,64,0.04)" stroke="#c44040" stroke-width="1"/>
    <text x="280" y="22" text-anchor="middle" font-size="11" fill="#c44040" font-weight="500">Ghost Artifact 與 Deghosting 硬體</text>
    <text x="20" y="45" font-size="9" fill="#5a5550">Ghost 成因：物體在不同曝光之間移動，融合後出現半透明殘影</text>
    <text x="20" y="65" font-size="9" fill="#5a5550">硬體 Deghosting 流程：</text>
    <text x="40" y="82" font-size="8" fill="#5a5550">1. 將短曝光乘以曝光比（T₁/T₃），與長曝光對齊亮度</text>
    <text x="40" y="97" font-size="8" fill="#5a5550">2. 逐像素計算差異 |Long - Short×Ratio|，超過 Threshold 標記為 Motion</text>
    <text x="300" y="82" font-size="8" fill="#5a5550">3. Motion 區域使用單一曝光（通常是短曝光）</text>
    <text x="300" y="97" font-size="8" fill="#5a5550">4. 靜態區域正常融合（SNR-based Weight）</text>
  </g>
</svg><div class="caption">圖 5-14：HDR Merge 硬體 Pipeline——多曝光輸入、運動偵測、權重計算與融合</div></div>

<h3>SNR-Based 融合權重</h3>
<p>HDR Merge 的核心是根據每個像素在不同曝光中的 SNR（Signal-to-Noise Ratio）來分配融合權重。基本原則是：暗部區域優先使用長曝光（SNR 高），亮部區域使用短曝光（避免飽和）。在轉換區域做平滑過渡。</p>

<div class="formula">
weight_long = smoothstep(low_th, high_th, pixel_long) <br/>
merged = weight_long × (long/T₁) + (1 - weight_long) × (short/T₃)
</div>

<p>其中 <code>smoothstep</code> 在硬體中常用 PWL 近似，<code>low_th</code> 和 <code>high_th</code> 是融合過渡區間（通常設在長曝光飽和值的 70%~90%）。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
HDR Merge 硬體的最大瓶頸是 Memory Bandwidth。以 4K@30fps 的 3-exposure HDR 為例，Sensor 輸出的 RAW 數據量約為 3840 × 2160 × 14-bit × 3 × 30 = 約 10.7 Gbps。如果使用 Sequential HDR（需要 Frame Buffer），還需要額外的 DDR 讀寫頻寬。這就是為什麼 Staggered HDR 和 Split-Pixel HDR 在硬體上更受歡迎——它們可以在不需要 Frame Buffer 的情況下完成融合。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
調試 HDR Merge 的 Ghost Artifact 時，一個實用的方法是在融合前後輸出 Motion Mask（運動遮罩）。Motion Mask 是一張二值化的影像，白色表示偵測到運動的區域。理想的 Motion Mask 應該準確標記移動物體，而不會誤標靜態的高對比邊緣。如果 Motion Mask 過於「敏感」，需要調高 Threshold；如果漏標，需要降低 Threshold 或改用多尺度偵測。
</div>
`,
      keyPoints: [
        "HDR Merge 位於 ISP Pipeline 最前端，在 RAW Domain 進行融合",
        "Staggered HDR 只需 Line Buffer，Sequential HDR 需要數 MB 的 Frame Buffer",
        "SNR-based Weight 決定融合權重：暗部用長曝光，亮部用短曝光",
        "Deghosting 透過 Motion Detection 偵測移動物體，在運動區域使用單一曝光",
        "Memory Bandwidth 是 HDR Merge 硬體的最大瓶頸，3-exp 4K 需要 ~10 Gbps"
      ]
    },
    {
      id: "ch5_15",
      title: "Adaptive Tone Curve 自適應色調曲線",
      content: `
<h3>為什麼需要自適應？</h3>
<p>一條固定的 Tone Curve 無法適應所有場景。在低光環境下，影像整體偏暗，需要較強的暗部提升；在高光環境下，影像整體偏亮，需要較強的亮部壓縮；在 HDR 場景中，需要同時壓縮亮部和提升暗部。Adaptive Tone Curve 根據每一幀的實際亮度分佈，動態調整 Tone Curve 的形狀。</p>

<div class="diagram"><svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="400" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Adaptive Tone Curve 生成流程</text>
  <!-- Flow -->
  <g transform="translate(30,55)">
    <rect x="0" y="0" width="130" height="50" rx="6" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">AE Statistics</text>
    <text x="65" y="35" text-anchor="middle" font-size="8" fill="#8a8580">Histogram、Mean</text>
    <text x="65" y="45" text-anchor="middle" font-size="8" fill="#8a8580">Percentile</text>
  </g>
  <line x1="160" y1="80" x2="190" y2="80" stroke="#5a5550" stroke-width="1" marker-end="url(#arr15)"/>
  <g transform="translate(195,55)">
    <rect x="0" y="0" width="130" height="50" rx="6" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Scene Analysis</text>
    <text x="65" y="35" text-anchor="middle" font-size="8" fill="#8a8580">DR 計算、場景分類</text>
    <text x="65" y="45" text-anchor="middle" font-size="8" fill="#8a8580">亮/暗部比例</text>
  </g>
  <line x1="325" y1="80" x2="355" y2="80" stroke="#5a5550" stroke-width="1" marker-end="url(#arr15)"/>
  <g transform="translate(360,55)">
    <rect x="0" y="0" width="130" height="50" rx="6" fill="rgba(106,138,122,0.12)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="65" y="20" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">Curve Generation</text>
    <text x="65" y="35" text-anchor="middle" font-size="8" fill="#8a8580">Knee Point 調整</text>
    <text x="65" y="45" text-anchor="middle" font-size="8" fill="#8a8580">Slope 控制</text>
  </g>
  <defs><marker id="arr15" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><path d="M0,0 L6,2 L0,4Z" fill="#5a5550"/></marker></defs>
  <!-- Histogram examples -->
  <g transform="translate(30,130)">
    <text x="80" y="0" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Histogram → Tone Curve 對應</text>
    <!-- Dark scene -->
    <g transform="translate(0,15)">
      <text x="60" y="10" text-anchor="middle" font-size="8" fill="#4a7ab5">低光場景</text>
      <rect x="0" y="15" width="120" height="60" rx="3" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="0.5"/>
      <rect x="5" y="35" width="8" height="40" fill="rgba(74,122,181,0.4)"/>
      <rect x="15" y="25" width="8" height="50" fill="rgba(74,122,181,0.5)"/>
      <rect x="25" y="30" width="8" height="45" fill="rgba(74,122,181,0.45)"/>
      <rect x="35" y="40" width="8" height="35" fill="rgba(74,122,181,0.3)"/>
      <rect x="45" y="55" width="8" height="20" fill="rgba(74,122,181,0.15)"/>
      <text x="60" y="90" text-anchor="middle" font-size="7" fill="#8a8580">大部分像素集中在暗部</text>
    </g>
    <!-- High DR scene -->
    <g transform="translate(175,15)">
      <text x="60" y="10" text-anchor="middle" font-size="8" fill="#c4a064">HDR 場景</text>
      <rect x="0" y="15" width="120" height="60" rx="3" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="0.5"/>
      <rect x="5" y="35" width="8" height="40" fill="rgba(196,160,100,0.4)"/>
      <rect x="15" y="45" width="8" height="30" fill="rgba(196,160,100,0.25)"/>
      <rect x="35" y="55" width="8" height="20" fill="rgba(196,160,100,0.15)"/>
      <rect x="55" y="50" width="8" height="25" fill="rgba(196,160,100,0.2)"/>
      <rect x="95" y="30" width="8" height="45" fill="rgba(196,160,100,0.45)"/>
      <rect x="105" y="35" width="8" height="40" fill="rgba(196,160,100,0.4)"/>
      <text x="60" y="90" text-anchor="middle" font-size="7" fill="#8a8580">雙峰分佈（暗+亮）</text>
    </g>
    <!-- Bright scene -->
    <g transform="translate(370,15)">
      <text x="60" y="10" text-anchor="middle" font-size="8" fill="#6a8a7a">高光場景</text>
      <rect x="0" y="15" width="120" height="60" rx="3" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="0.5"/>
      <rect x="55" y="55" width="8" height="20" fill="rgba(106,138,122,0.15)"/>
      <rect x="65" y="45" width="8" height="30" fill="rgba(106,138,122,0.25)"/>
      <rect x="75" y="30" width="8" height="45" fill="rgba(106,138,122,0.45)"/>
      <rect x="85" y="25" width="8" height="50" fill="rgba(106,138,122,0.5)"/>
      <rect x="95" y="28" width="8" height="47" fill="rgba(106,138,122,0.48)"/>
      <rect x="105" y="35" width="8" height="40" fill="rgba(106,138,122,0.4)"/>
      <text x="60" y="90" text-anchor="middle" font-size="7" fill="#8a8580">大部分像素集中在亮部</text>
    </g>
  </g>
  <!-- Temporal smoothing -->
  <g transform="translate(30,310)">
    <rect x="0" y="0" width="540" height="70" rx="6" fill="rgba(213,206,199,0.25)" stroke="#d5cec7" stroke-width="1"/>
    <text x="270" y="20" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Temporal Smoothing（時域平滑）</text>
    <text x="20" y="42" font-size="9" fill="#5a5550">curve[n] = α × curve_new + (1-α) × curve[n-1]，α ∈ [0.05, 0.2]</text>
    <text x="20" y="58" font-size="8" fill="#8a8580">避免 Tone Curve 逐幀劇烈變化導致 Flicker。α 太大→閃爍；α 太小→反應慢（隧道出入口延遲）</text>
  </g>
</svg><div class="caption">圖 5-15：Adaptive Tone Curve——從 Histogram 分析到動態曲線生成</div></div>

<h3>Histogram-Based Curve Generation</h3>
<p>一種常用的自適應曲線生成方法是 Histogram Equalization 的變體。基本想法是讓 Tone Curve 的斜率正比於直方圖的密度——像素多的亮度區域分配更多的輸出範圍（更大的斜率），像素少的區域壓縮（更小的斜率）。</p>

<div class="formula">
ToneCurve(x) = CDF(x) × MaxOutput
</div>

<p>其中 CDF 是直方圖的累積分佈函數。但直接使用 CDF 會導致過度均衡化（Over-Equalization），影像看起來不自然。因此實務上會做以下限制：</p>
<ul>
<li><strong>Clip Limit</strong>：限制直方圖每個 Bin 的最大計數（類似 CLAHE 的 Clip Limit），防止局部過度增強</li>
<li><strong>Slope Constraint</strong>：限制 Tone Curve 的最大斜率（如 < 4）和最小斜率（如 > 0.25），避免過度拉伸或壓縮</li>
<li><strong>Blending with Linear</strong>：將 Histogram-based Curve 與線性曲線混合，控制均衡化的「強度」</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
Adaptive Tone Curve 與 AE（Auto Exposure）的協同設計非常重要。AE 控制 Sensor 的曝光量，決定影像的「基準亮度」；Adaptive Tone Curve 在此基礎上做進一步的動態範圍調整。兩者如果不協同，可能出現「AE 想壓暗，Tone Curve 想拉亮」的衝突，導致曝光震盪。因此，在 ISP 調試中，AE Target 和 Adaptive Tone Curve 的 Strength 通常需要聯合調校。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
Temporal Smoothing 的 α 參數（IIR Filter 係數）需要根據場景動態調整。在穩定場景中，α 應較小（0.05~0.1），保持畫面穩定。當偵測到場景切換（Histogram 突變超過閾值）時，α 應暫時增大（0.3~0.5），讓 Tone Curve 快速適應新場景。這種「Scene Change Detection + Adaptive α」策略是避免隧道出入口 Flicker 的關鍵。
</div>
`,
      keyPoints: [
        "Adaptive Tone Curve 根據每幀的 Histogram 動態調整曲線形狀",
        "Histogram CDF 可生成均衡化曲線，但需 Clip Limit 和 Slope Constraint 限制",
        "Temporal Smoothing（IIR Filter）避免逐幀閃爍，α 太大閃爍、α 太小反應慢",
        "AE 和 Adaptive Tone Curve 必須協同設計，避免曝光震盪",
        "Scene Change Detection 可動態調整 Smoothing 係數，加快場景切換適應"
      ]
    },
    {
      id: "ch5_16",
      title: "ACES 與電影色調映射",
      content: `
<h3>Academy Color Encoding System (ACES)</h3>
<p>ACES 是由美國電影藝術與科學學院（Academy of Motion Picture Arts and Sciences）制定的色彩管理標準。它定義了一套從場景捕獲到最終顯示的完整色彩工作流程，其中 Tone Mapping 是核心環節之一。雖然 ACES 最初是為電影後製設計的，但其設計哲學對 ISP 的 Tone Mapping 有重要啟發。</p>

<h4>ACES Pipeline 簡介</h4>
<ul>
<li><strong>IDT (Input Device Transform)</strong>：將 Camera 的 RAW 數據轉換到 ACES 線性色彩空間</li>
<li><strong>RRT (Reference Rendering Transform)</strong>：核心的 Tone Mapping + 色彩轉換，將場景光線轉換為「理想顯示」</li>
<li><strong>ODT (Output Device Transform)</strong>：針對具體顯示裝置（SDR Monitor、HDR TV、Cinema Projector）做最終調整</li>
</ul>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="350" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Filmic Tone Mapping S-Curve 設計</text>
  <!-- Axes -->
  <g transform="translate(60,50)">
    <line x1="0" y1="220" x2="240" y2="220" stroke="#5a5550" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="0" y2="220" stroke="#5a5550" stroke-width="1.5"/>
    <text x="120" y="245" text-anchor="middle" font-size="9" fill="#5a5550">Scene Linear (Log Scale)</text>
    <text x="-20" y="110" text-anchor="middle" font-size="9" fill="#5a5550" transform="rotate(-90,-20,110)">Display Output</text>
    <!-- Linear reference -->
    <line x1="0" y1="220" x2="220" y2="0" stroke="#d5cec7" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="180" y="40" font-size="7" fill="#d5cec7">Linear</text>
    <!-- Filmic S-curve -->
    <path d="M0,220 C20,218 40,210 60,195 C80,175 100,140 130,95 C155,60 180,35 210,18 C230,8 240,5 240,5" fill="none" stroke="#c4a064" stroke-width="2.5"/>
    <!-- Toe region -->
    <rect x="0" y="180" width="60" height="42" fill="rgba(74,122,181,0.08)" stroke="#4a7ab5" stroke-width="0.5" stroke-dasharray="3,2"/>
    <text x="30" y="175" text-anchor="middle" font-size="8" fill="#4a7ab5">Toe</text>
    <text x="30" y="230" text-anchor="middle" font-size="7" fill="#4a7ab5">暗部提升</text>
    <!-- Linear mid -->
    <rect x="60" y="90" width="80" height="95" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="0.5" stroke-dasharray="3,2"/>
    <text x="100" y="85" text-anchor="middle" font-size="8" fill="#6a8a7a">Linear Mid</text>
    <!-- Shoulder -->
    <rect x="150" y="0" width="90" height="90" fill="rgba(196,64,64,0.05)" stroke="#c44040" stroke-width="0.5" stroke-dasharray="3,2"/>
    <text x="195" y="100" text-anchor="middle" font-size="8" fill="#c44040">Shoulder</text>
    <text x="195" y="112" text-anchor="middle" font-size="7" fill="#c44040">高光 Rolloff</text>
    <!-- White point -->
    <circle cx="240" cy="5" r="3" fill="#c44040"/>
    <text x="240" y="18" text-anchor="middle" font-size="7" fill="#c44040">White Pt</text>
  </g>
  <!-- ACES RRT parameters -->
  <g transform="translate(340,50)">
    <rect x="0" y="0" width="230" height="220" rx="6" fill="rgba(213,206,199,0.25)" stroke="#d5cec7" stroke-width="1"/>
    <text x="115" y="22" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">Filmic Curve 關鍵參數</text>
    <line x1="10" y1="30" x2="220" y2="30" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="50" font-size="9" fill="#c4a064" font-weight="500">Toe（暗部）</text>
    <text x="15" y="65" font-size="8" fill="#5a5550">• Toe Strength：黑位提升程度</text>
    <text x="15" y="80" font-size="8" fill="#5a5550">• Black Point：最暗處映射目標</text>
    <text x="15" y="100" font-size="9" fill="#6a8a7a" font-weight="500">Mid-tone（中間調）</text>
    <text x="15" y="115" font-size="8" fill="#5a5550">• Mid Gray：18% gray 映射到的值</text>
    <text x="15" y="130" font-size="8" fill="#5a5550">• Contrast：中間調的斜率</text>
    <text x="15" y="150" font-size="9" fill="#c44040" font-weight="500">Shoulder（高光）</text>
    <text x="15" y="165" font-size="8" fill="#5a5550">• Shoulder Strength：壓縮程度</text>
    <text x="15" y="180" font-size="8" fill="#5a5550">• White Point：映射到白色的值</text>
    <text x="15" y="195" font-size="8" fill="#5a5550">• Highlight Rolloff：漸進壓縮速率</text>
  </g>
  <!-- Application note -->
  <g transform="translate(30,295)">
    <rect x="0" y="0" width="540" height="40" rx="4" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
    <text x="270" y="17" text-anchor="middle" font-size="9" fill="#5a5550" font-weight="500">ISP 應用：手機相機越來越多採用 Filmic Tone Mapping 風格</text>
    <text x="270" y="32" text-anchor="middle" font-size="8" fill="#8a8580">Apple、Google 的 HDR 處理都借鑑了電影色調映射的 S-Curve 設計理念</text>
  </g>
</svg><div class="caption">圖 5-16：Filmic Tone Mapping S-Curve 的 Toe / Linear Mid / Shoulder 三段設計</div></div>

<h3>Filmic Tone Mapping 的數學模型</h3>
<p>John Hable 在 Uncharted 2 中提出的 Filmic Tone Mapping 公式是遊戲/電影界最知名的模型之一：</p>

<div class="formula">
f(x) = ((x × (A×x + C×B) + D×E) / (x × (A×x + B) + D×F)) - E/F
</div>

<p>其中 A=Shoulder Strength, B=Linear Strength, C=Linear Angle, D=Toe Strength, E=Toe Numerator, F=Toe Denominator。這個公式的優點是所有參數都有直觀的物理意義，方便藝術家調校。</p>

<h3>Highlight Rolloff 的重要性</h3>
<p>Highlight Rolloff 是 Filmic Tone Mapping 與傳統 Gamma Curve 最大的差異。傳統 Gamma 在高光處是 Hard Clip（超過白點直接截斷），會產生不自然的「燒焦」感。Filmic 曲線在接近白點時逐漸壓扁（Soft Rolloff），讓高光區域有平滑的過渡，保留更多的高光細節和色彩資訊。</p>

<div class="info-box key">
<div class="box-title">核心概念</div>
ACES RRT 的一個重要特性是「Scene-Referred to Display-Referred」的轉換。輸入是線性的場景光線值（Scene-Referred，理論上無上限），輸出是顯示裝置能呈現的值（Display-Referred，有明確的上下限）。這與 ISP 的 Tone Mapping 目標完全一致：將 Sensor 捕獲的線性 HDR 數據映射到顯示器能呈現的範圍。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
在 ISP 中實現 Filmic Tone Mapping 時，可以不直接計算 Hable 公式（硬體太複雜），而是用該公式預計算一條 LUT，載入到 GTM 模組。這樣既保留了 Filmic 的視覺效果，又不增加硬體複雜度。調校時在 PC 上調整 A~F 參數，重新生成 LUT 燒入即可。
</div>
`,
      keyPoints: [
        "ACES 定義了從場景捕獲到顯示的完整色彩流程（IDT → RRT → ODT）",
        "Filmic S-Curve 分為 Toe（暗部提升）、Linear Mid（中間調）、Shoulder（高光壓縮）三段",
        "Highlight Rolloff 是 Filmic 與傳統 Gamma 的關鍵差異——Soft vs Hard Clip",
        "Hable Filmic 公式的 6 個參數各有直觀物理意義，方便藝術家調校",
        "ISP 硬體可預計算 Filmic 曲線為 LUT，兼顧效果與硬體複雜度"
      ]
    },
    {
      id: "ch5_17",
      title: "Tone Mapping 調參策略",
      content: `
<h3>系統化的調參流程</h3>
<p>Tone Mapping 的調參（Tuning）是 ISP 影像品質工作中最耗時但也最重要的環節之一。一個好的調參工程師需要同時具備影像處理的理論知識和豐富的視覺審美經驗。以下是系統化的調參策略：</p>

<h4>Step 1：確定基礎曲線</h4>
<p>從一條「中性」的基礎曲線開始（例如 sRGB Gamma 2.2 或接近線性的曲線），在標準光源下（D65，1000 lux）拍攝 ColorChecker，確認 Gray Patches 的亮度遞進正確。</p>

<h4>Step 2：暗部調整（Toe Region）</h4>
<p>拍攝低光場景（10~50 lux），調整 Toe 的提升程度。目標是暗部可見但不會過度提亮導致噪聲明顯。典型的暗部增益在 1.5x~3x 之間。</p>

<h4>Step 3：亮部調整（Shoulder Region）</h4>
<p>拍攝 HDR 場景（包含天空、窗戶等高光區域），調整 Shoulder 的壓縮程度。目標是高光不過曝但仍有層次感。White Point 通常設在 Sensor 飽和值的 2~4 倍。</p>

<h4>Step 4：中間調對比（Mid-tone Contrast）</h4>
<p>在正常光源下，調整中間調的斜率。較高的斜率帶來更強的對比度和「通透感」，但可能壓縮暗部和亮部的可用範圍。</p>

<div class="table-container">
<table>
<tr><th>參數</th><th>影響</th><th>增大效果</th><th>減小效果</th><th>典型範圍</th></tr>
<tr><td>Toe Lift</td><td>暗部亮度</td><td>暗部更亮、噪聲更明顯</td><td>暗部更暗、細節不可見</td><td>0 ~ 0.15</td></tr>
<tr><td>Shoulder Compress</td><td>高光壓縮</td><td>高光更多層次、可能偏灰</td><td>高光更亮、容易過曝</td><td>0.7 ~ 0.95</td></tr>
<tr><td>Mid Contrast</td><td>中間調對比</td><td>更通透、可能丟暗部</td><td>更平淡、灰濛</td><td>1.0 ~ 1.8</td></tr>
<tr><td>White Point</td><td>最亮映射值</td><td>高光保留更多、整體偏暗</td><td>高光更亮、細節減少</td><td>2x ~ 8x sensor max</td></tr>
<tr><td>Black Point</td><td>最暗映射值</td><td>暗部提升、對比降低</td><td>黑色更深、暗部丟失</td><td>0 ~ 16 (8-bit)</td></tr>
</table>
</div>

<h3>Per-Scene 調參策略</h3>
<p>不同場景類型需要不同的 Tone Mapping 策略：</p>
<ul>
<li><strong>人像模式</strong>：降低 Shoulder 壓縮、提升暗部、中等對比——讓膚色自然、陰影柔和</li>
<li><strong>風景模式</strong>：增強 Mid Contrast、積極壓縮高光——讓天空和雲層更有層次</li>
<li><strong>夜景模式</strong>：大幅提升 Toe、謹慎壓縮 Shoulder——最大化暗部可見性</li>
<li><strong>逆光模式</strong>：同時提升暗部和壓縮亮部——平衡前景與背景亮度</li>
</ul>

<h3>Day/Night 模式切換</h3>
<p>許多 ISP 支援 Day Mode 和 Night Mode 兩套參數。Day Mode 強調色彩和對比，Night Mode 強調暗部可見性和降噪。切換通常由 AE 統計觸發（環境亮度低於某個閾值時切換到 Night Mode）。切換過程需要 Temporal Smoothing 以避免突變。</p>

<div class="note">
調參的一個常見陷阱是「在螢幕上調好了，但在目標裝置上看起來不一樣」。不同顯示裝置的 Gamma、色域、亮度都不同。務必在目標裝置（手機螢幕、車載螢幕、監控顯示器）上確認最終效果。如果可能，在調參環境中使用與目標裝置相同規格的 Monitor。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
Tone Mapping 調參的黃金法則是「先全局、後局部；先粗調、後精調」。先用 GTM 確定整體的亮度分佈和對比風格，然後用 LTM 處理局部的 HDR 細節。在每個階段，先做大幅度的參數調整確定方向，再做精細的微調。避免一開始就陷入微調陷阱。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
建立一套「標準測試場景」資料庫非常重要。至少包含：(1) 標準色卡（ColorChecker）；(2) 人像（不同膚色、不同光線）；(3) 風景（有天空、有陰影）；(4) 低光（室內 10 lux）；(5) 高反差（室內看窗外）；(6) 夜景（街燈+暗處）。每次調參後用同一套場景驗證，確保沒有「按下葫蘆浮起瓢」的問題。
</div>
`,
      keyPoints: [
        "系統化調參流程：基礎曲線 → 暗部 → 亮部 → 中間調 → 場景驗證",
        "Toe Lift、Shoulder Compress、Mid Contrast、White/Black Point 是核心參數",
        "不同場景模式需要不同的 Tone Mapping 策略（人像/風景/夜景/逆光）",
        "Day/Night 模式切換需要 Temporal Smoothing 避免突變",
        "必須在目標裝置上確認效果，不同顯示器差異可能很大"
      ]
    },
    {
      id: "ch5_18",
      title: "DRC 動態範圍壓縮",
      content: `
<h3>DRC 的概念與定位</h3>
<p>DRC（Dynamic Range Compression，動態範圍壓縮）是 ISP 中一個與 Tone Mapping 密切相關但又有所不同的模組。廣義上，DRC 是 Tone Mapping 的一個子集；狹義上，DRC 特指在 RAW Domain 或線性 Domain 對信號的動態範圍做壓縮，通常使用 Knee Point（拐點）曲線。DRC 在安防、車載和工業相機中特別常見。</p>

<div class="diagram"><svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="380" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">DRC Multi-Knee Curve 設計</text>
  <!-- Axes -->
  <g transform="translate(50,50)">
    <line x1="0" y1="250" x2="300" y2="250" stroke="#5a5550" stroke-width="1.5"/>
    <line x1="0" y1="0" x2="0" y2="250" stroke="#5a5550" stroke-width="1.5"/>
    <text x="150" y="275" text-anchor="middle" font-size="9" fill="#5a5550">Input (Linear, 20-bit)</text>
    <text x="-15" y="125" text-anchor="middle" font-size="9" fill="#5a5550" transform="rotate(-90,-15,125)">Output (Compressed)</text>
    <!-- Linear reference -->
    <line x1="0" y1="250" x2="250" y2="0" stroke="#d5cec7" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="255" y="10" font-size="7" fill="#d5cec7">1:1</text>
    <!-- Single knee -->
    <path d="M0,250 L100,150 L300,50" fill="none" stroke="#4a7ab5" stroke-width="1.5" stroke-dasharray="5,3"/>
    <circle cx="100" cy="150" r="4" fill="#4a7ab5"/>
    <text x="115" y="145" font-size="8" fill="#4a7ab5">Single Knee</text>
    <!-- Multi-knee -->
    <path d="M0,250 L80,170 L160,110 L240,70 L300,50" fill="none" stroke="#c4a064" stroke-width="2.5"/>
    <circle cx="80" cy="170" r="3" fill="#c4a064"/>
    <circle cx="160" cy="110" r="3" fill="#c4a064"/>
    <circle cx="240" cy="70" r="3" fill="#c4a064"/>
    <text x="70" y="185" font-size="7" fill="#c4a064">Knee 1</text>
    <text x="150" y="125" font-size="7" fill="#c4a064">Knee 2</text>
    <text x="230" y="85" font-size="7" fill="#c4a064">Knee 3</text>
    <!-- Compression ratios -->
    <text x="40" y="215" font-size="7" fill="#6a8a7a">Slope=1.0</text>
    <text x="120" y="155" font-size="7" fill="#6a8a7a">Slope=0.6</text>
    <text x="200" y="105" font-size="7" fill="#6a8a7a">Slope=0.35</text>
    <text x="265" y="70" font-size="7" fill="#6a8a7a">Slope=0.2</text>
  </g>
  <!-- Comparison table -->
  <g transform="translate(380,50)">
    <rect x="0" y="0" width="200" height="250" rx="6" fill="rgba(213,206,199,0.25)" stroke="#d5cec7" stroke-width="1"/>
    <text x="100" y="22" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="500">壓縮比設計參考</text>
    <line x1="10" y1="32" x2="190" y2="32" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="52" font-size="9" fill="#5a5550" font-weight="500">亮度區間</text>
    <text x="130" y="52" font-size="9" fill="#5a5550" font-weight="500">壓縮比</text>
    <line x1="10" y1="60" x2="190" y2="60" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="78" font-size="8" fill="#5a5550">暗部 (0~25%)</text>
    <text x="130" y="78" font-size="8" fill="#6a8a7a">1:1 (不壓縮)</text>
    <text x="15" y="98" font-size="8" fill="#5a5550">中低 (25~50%)</text>
    <text x="130" y="98" font-size="8" fill="#5a5550">1:1.2</text>
    <text x="15" y="118" font-size="8" fill="#5a5550">中高 (50~75%)</text>
    <text x="130" y="118" font-size="8" fill="#c4a064">1:1.8</text>
    <text x="15" y="138" font-size="8" fill="#5a5550">亮部 (75~100%)</text>
    <text x="130" y="138" font-size="8" fill="#c44040">1:3.0</text>
    <line x1="10" y1="150" x2="190" y2="150" stroke="#d5cec7" stroke-width="0.5"/>
    <text x="15" y="170" font-size="8" fill="#5a5550">總壓縮效果：</text>
    <text x="15" y="188" font-size="8" fill="#5a5550">20-bit → 12-bit</text>
    <text x="15" y="206" font-size="8" fill="#5a5550">(120dB → 72dB)</text>
    <text x="15" y="230" font-size="8" fill="#8a8580">暗部保留完整精度</text>
    <text x="15" y="245" font-size="8" fill="#8a8580">亮部壓縮換取範圍</text>
  </g>
</svg><div class="caption">圖 5-18：DRC Multi-Knee Curve——不同亮度區間使用不同壓縮比</div></div>

<h3>Knee Point 設計</h3>
<p>Knee Point 是 DRC 曲線上斜率發生變化的轉折點。在 Knee Point 以下的區域，斜率為 1（不壓縮），保留完整的信號精度。在 Knee Point 以上，斜率小於 1，進行壓縮。</p>

<h4>Single-Knee vs Multi-Knee</h4>
<ul>
<li><strong>Single-Knee</strong>：只有一個轉折點，簡單但壓縮過渡不夠平滑。在 Knee Point 處可能出現可見的亮度跳變</li>
<li><strong>Multi-Knee</strong>：多個轉折點，每段使用不同的壓縮比。過渡更平滑，但參數更多。常見使用 3~4 個 Knee Points</li>
</ul>

<h3>Sensor-Specific DRC</h3>
<p>不同 Sensor 的動態範圍和噪聲特性不同，DRC 參數需要針對特定 Sensor 調整：</p>
<ul>
<li><strong>高 DR Sensor（如 120 dB）</strong>：需要較大的壓縮範圍，Knee Point 設得較低（例如 50% 飽和值），壓縮比較高（3:1 ~ 5:1）</li>
<li><strong>標準 DR Sensor（如 72 dB）</strong>：壓縮需求較小，Knee Point 設得較高（例如 80% 飽和值），壓縮比較低（1.5:1 ~ 2:1）</li>
<li><strong>Split-Pixel Sensor</strong>：大小光電二極管有不同的 Noise Floor，DRC 需要分別設定並在融合後再做整體壓縮</li>
</ul>

<div class="formula">
DRC_output = input,  if input ≤ knee_point <br/>
DRC_output = knee_point + (input - knee_point) × compression_ratio,  if input > knee_point
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
DRC 和 Tone Mapping 的主要區別在於：DRC 通常在 RAW Domain（Demosaic 前）操作，使用簡單的 Knee Curve，目的是將 Sensor 的大 Bit-Depth（如 20-bit HDR）壓縮到 Pipeline 能處理的寬度（如 12-bit）。Tone Mapping 在 RGB Domain 操作，使用更複雜的曲線（S-Curve、LUT），目的是為最終顯示優化視覺效果。兩者可以串聯使用：DRC 先做粗壓縮，Tone Mapping 再做精細映射。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
DRC 的 Knee Point 設定與 Sensor 的飽和特性密切相關。一個實用的方法是：用 Sensor 拍攝灰階卡（Step Chart），找到 Sensor 開始出現明顯噪聲的亮度值（SNR = 20 dB 的位置），將 Knee Point 設在該值附近。這樣可以確保 DRC 只壓縮「SNR 夠好」的亮部區域，不會壓縮到噪聲主導的暗部區域。
</div>
`,
      keyPoints: [
        "DRC 在 RAW Domain 使用 Knee Curve 壓縮動態範圍，常用於安防/車載/工業相機",
        "Multi-Knee 設計比 Single-Knee 過渡更平滑，常用 3~4 個 Knee Points",
        "暗部不壓縮（Slope=1），亮部逐段增加壓縮比",
        "DRC 做粗壓縮（20-bit→12-bit），Tone Mapping 做精細映射（12-bit→8-bit）",
        "Knee Point 應設在 Sensor SNR 足夠好的亮度區域，避免壓縮噪聲主導的暗部"
      ]
    },
    {
      id: "ch5_19",
      title: "GTM vs LTM 選擇與混合",
      content: `
<h3>GTM 與 LTM 的本質差異</h3>
<p>GTM（Global Tone Mapping）對整張影像使用同一條 Tone Curve；LTM（Local Tone Mapping）根據每個像素的局部環境使用不同的映射。兩者的選擇和混合策略，是 ISP 架構設計中的關鍵決策。</p>

<div class="diagram"><svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="420" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">GTM vs LTM 比較與混合策略</text>
  <!-- GTM column -->
  <g transform="translate(20,50)">
    <rect x="0" y="0" width="260" height="155" rx="6" fill="rgba(74,122,181,0.06)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="130" y="20" text-anchor="middle" font-size="11" fill="#4a7ab5" font-weight="500">GTM (Global Tone Mapping)</text>
    <text x="15" y="42" font-size="8" fill="#5a5550">✓ 硬體簡單：1 個 LUT</text>
    <text x="15" y="57" font-size="8" fill="#5a5550">✓ 無 Halo Artifact</text>
    <text x="15" y="72" font-size="8" fill="#5a5550">✓ 色彩一致性好</text>
    <text x="15" y="87" font-size="8" fill="#5a5550">✓ 延遲低（1-4 cycles）</text>
    <text x="15" y="107" font-size="8" fill="#c44040">✗ 高 DR 場景效果有限</text>
    <text x="15" y="122" font-size="8" fill="#c44040">✗ 無法同時優化亮暗部</text>
    <text x="15" y="137" font-size="8" fill="#c44040">✗ 局部對比度提升能力弱</text>
  </g>
  <!-- LTM column -->
  <g transform="translate(310,50)">
    <rect x="0" y="0" width="270" height="155" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="135" y="20" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">LTM (Local Tone Mapping)</text>
    <text x="15" y="42" font-size="8" fill="#5a5550">✓ 高 DR 場景效果優異</text>
    <text x="15" y="57" font-size="8" fill="#5a5550">✓ 暗部提亮 + 亮部壓縮同時進行</text>
    <text x="15" y="72" font-size="8" fill="#5a5550">✓ 局部對比度增強</text>
    <text x="15" y="87" font-size="8" fill="#5a5550">✓ 接近人眼的 Local Adaptation</text>
    <text x="15" y="107" font-size="8" fill="#c44040">✗ 硬體複雜：Line Buffer + 統計邏輯</text>
    <text x="15" y="122" font-size="8" fill="#c44040">✗ Halo Artifact 風險</text>
    <text x="15" y="137" font-size="8" fill="#c44040">✗ 可能導致色彩偏移</text>
  </g>
  <!-- Decision tree -->
  <g transform="translate(30,230)">
    <rect x="0" y="0" width="540" height="170" rx="6" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="270" y="22" text-anchor="middle" font-size="11" fill="#c4a064" font-weight="500">選擇決策樹</text>
    <!-- Root -->
    <rect x="180" y="35" width="180" height="25" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
    <text x="270" y="52" text-anchor="middle" font-size="8" fill="#5a5550">場景 DR > 80 dB？</text>
    <!-- Left: No -->
    <line x1="220" y1="60" x2="120" y2="80" stroke="#5a5550" stroke-width="1"/>
    <text x="155" y="72" font-size="7" fill="#6a8a7a">No</text>
    <rect x="40" y="80" width="160" height="22" rx="4" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="120" y="95" text-anchor="middle" font-size="8" fill="#5a5550">GTM Only — 足夠應對</text>
    <!-- Right: Yes -->
    <line x1="320" y1="60" x2="400" y2="80" stroke="#5a5550" stroke-width="1"/>
    <text x="370" y="72" font-size="7" fill="#c44040">Yes</text>
    <rect x="320" y="80" width="180" height="25" rx="4" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1"/>
    <text x="410" y="97" text-anchor="middle" font-size="8" fill="#5a5550">硬體面積/功耗受限？</text>
    <!-- Right-Left: Yes -->
    <line x1="370" y1="105" x2="320" y2="120" stroke="#5a5550" stroke-width="1"/>
    <text x="335" y="115" font-size="7" fill="#c44040">Yes</text>
    <rect x="220" y="120" width="200" height="22" rx="4" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1"/>
    <text x="320" y="135" text-anchor="middle" font-size="8" fill="#5a5550">GTM + Adaptive Curve（折衷）</text>
    <!-- Right-Right: No -->
    <line x1="450" y1="105" x2="480" y2="120" stroke="#5a5550" stroke-width="1"/>
    <text x="475" y="115" font-size="7" fill="#6a8a7a">No</text>
    <rect x="430" y="120" width="100" height="22" rx="4" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="480" y="135" text-anchor="middle" font-size="8" fill="#5a5550">GTM + LTM</text>
    <!-- Hybrid note -->
    <text x="270" y="160" text-anchor="middle" font-size="8" fill="#8a8580">* 高階方案：GTM 做粗映射 + LTM 做局部增強，兩者串聯</text>
  </g>
</svg><div class="caption">圖 5-19：GTM vs LTM 比較與選擇決策樹</div></div>

<h3>Hybrid 混合策略</h3>
<p>在高階 ISP 中，GTM 和 LTM 通常不是二選一，而是串聯使用：</p>

<h4>方案一：GTM 在前，LTM 在後</h4>
<p>GTM 先做全域的動態範圍粗壓縮（例如 20-bit → 12-bit），然後 LTM 在壓縮後的 12-bit 數據上做局部的對比度增強和暗部提升。這是最常見的方案。</p>

<h4>方案二：LTM 在前，GTM 在後</h4>
<p>LTM 先做局部的 Gain Map 調整，然後 GTM 做最終的色調曲線。這種方案的 LTM 本質上是一個「Pre-Processing」階段，對輸入的局部對比度做預調整。</p>

<h4>方案三：Blending</h4>
<p>GTM 和 LTM 分別計算各自的輸出，然後按照一定比例混合：</p>

<div class="formula">
Final = α × GTM_output + (1-α) × LTM_output, α ∈ [0, 1]
</div>

<p>α 可以是固定值，也可以根據場景的動態範圍自適應調整（DR 大時 α 小，LTM 比重大）。</p>

<h3>Computational Cost 比較</h3>
<div class="table-container">
<table>
<tr><th>資源</th><th>GTM Only</th><th>LTM Only</th><th>GTM + LTM</th></tr>
<tr><td>SRAM (4K)</td><td>~1 KB</td><td>~500 KB</td><td>~501 KB</td></tr>
<tr><td>Gate Count</td><td>~5K gates</td><td>~50K gates</td><td>~55K gates</td></tr>
<tr><td>Latency</td><td>1~4 cycles</td><td>Block Size lines</td><td>Block Size lines</td></tr>
<tr><td>Power</td><td>~0.5 mW</td><td>~10 mW</td><td>~10.5 mW</td></tr>
<tr><td>Tuning Complexity</td><td>低</td><td>高</td><td>很高</td></tr>
</table>
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
GTM 和 LTM 的混合比例（α 值）是一個重要的調校參數。α 太大（偏向 GTM），高 DR 場景的局部細節不夠；α 太小（偏向 LTM），容易出現 Halo 和不自然的局部增強。一個好的經驗法則是：低 DR 場景（室內、陰天）用 α=0.7~0.9（偏 GTM），高 DR 場景（逆光、隧道）用 α=0.3~0.5（偏 LTM）。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
評估是否需要 LTM 的最佳方法：拍攝一張高反差場景（如室內看窗外），先只用 GTM 做 Tone Mapping，觀察窗外的高光是否 Clip、室內的暗部是否可見。如果 GTM 無法同時滿足兩者，就需要 LTM。如果 GTM 已經足夠（例如場景 DR < 80 dB），加入 LTM 反而可能引入不必要的 Artifact。
</div>
`,
      keyPoints: [
        "GTM 硬體簡單無 Halo，LTM 效果好但硬體代價大（SRAM ~500KB @4K）",
        "高階 ISP 通常 GTM + LTM 串聯：GTM 粗壓縮 → LTM 局部增強",
        "混合比例 α 可根據場景 DR 自適應：低 DR 偏 GTM，高 DR 偏 LTM",
        "LTM 的主要成本是 SRAM 和 Gate Count，約為 GTM 的 10 倍",
        "並非所有場景都需要 LTM，DR < 80 dB 時 GTM 通常已足夠"
      ]
    },
    {
      id: "ch5_20",
      title: "HDR 視訊處理",
      content: `
<h3>HDR 視訊的特殊要求</h3>
<p>與靜態影像不同，HDR 視訊的 Tone Mapping 必須考慮時間維度的一致性。人眼對時域的亮度變化非常敏感——即使空間上看起來很好的 Tone Mapping，如果逐幀的映射不一致，觀看者會感受到明顯的「Flicker」（閃爍）或「Pumping」（亮度呼吸效應）。</p>

<h3>Temporal Coherence（時域一致性）</h3>
<p>確保 Tone Mapping 在相鄰幀之間的輸出是平滑過渡的，而非突然跳變。實現方式：</p>

<h4>1. Tone Curve 的時域濾波</h4>
<p>對 Tone Curve 的參數做 IIR（Infinite Impulse Response）濾波：</p>
<div class="formula">
curve_param[n] = (1-α) × curve_param[n-1] + α × curve_param_new
</div>
<p>α 的選擇決定了收斂速度：α=0.1 對應約 10 幀的時間常數，α=0.05 對應約 20 幀。</p>

<h4>2. 統計量的時域平滑</h4>
<p>在計算 Adaptive Tone Curve 之前，先對輸入的統計量（Histogram, Mean Brightness 等）做時域濾波，避免統計量的幀間波動傳遞到 Tone Curve。</p>

<h4>3. Gain Map 的時域濾波（LTM）</h4>
<p>對 LTM 的 Gain Map 也做時域平滑，每個 Block 的 Gain 值在相鄰幀之間做 IIR 濾波。這可以有效避免 LTM 導致的局部閃爍。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="350" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">HDR 視訊 Tone Mapping 時域一致性</text>
  <!-- Timeline -->
  <g transform="translate(40,60)">
    <line x1="0" y1="50" x2="520" y2="50" stroke="#5a5550" stroke-width="1.5"/>
    <text x="260" y="75" text-anchor="middle" font-size="9" fill="#5a5550">Time (Frames)</text>
    <!-- Frames -->
    <rect x="20" y="10" width="60" height="35" rx="3" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="50" y="32" text-anchor="middle" font-size="8" fill="#5a5550">Frame N-2</text>
    <rect x="120" y="10" width="60" height="35" rx="3" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="150" y="32" text-anchor="middle" font-size="8" fill="#5a5550">Frame N-1</text>
    <rect x="220" y="10" width="60" height="35" rx="3" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="250" y="32" text-anchor="middle" font-size="8" fill="#5a5550">Frame N</text>
    <rect x="320" y="10" width="60" height="35" rx="3" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="350" y="32" text-anchor="middle" font-size="8" fill="#5a5550">Frame N+1</text>
    <rect x="420" y="10" width="60" height="35" rx="3" fill="rgba(74,122,181,0.12)" stroke="#4a7ab5" stroke-width="1"/>
    <text x="450" y="32" text-anchor="middle" font-size="8" fill="#5a5550">Frame N+2</text>
  </g>
  <!-- Without smoothing -->
  <g transform="translate(40,150)">
    <text x="0" y="0" font-size="10" fill="#c44040" font-weight="500">Without Temporal Smoothing</text>
    <rect x="0" y="10" width="520" height="50" rx="4" fill="rgba(196,64,64,0.04)" stroke="#c44040" stroke-width="0.5"/>
    <polyline points="50,45 150,30 250,50 350,20 450,40" fill="none" stroke="#c44040" stroke-width="2"/>
    <text x="530" y="40" font-size="7" fill="#c44040">Mean</text>
    <text x="530" y="50" font-size="7" fill="#c44040">Luma</text>
    <text x="260" y="72" text-anchor="middle" font-size="8" fill="#c44040">逐幀亮度劇烈變化 → Flicker ✗</text>
  </g>
  <!-- With smoothing -->
  <g transform="translate(40,240)">
    <text x="0" y="0" font-size="10" fill="#6a8a7a" font-weight="500">With Temporal Smoothing (α=0.1)</text>
    <rect x="0" y="10" width="520" height="50" rx="4" fill="rgba(106,138,122,0.04)" stroke="#6a8a7a" stroke-width="0.5"/>
    <polyline points="50,38 150,36 250,39 350,35 450,37" fill="none" stroke="#6a8a7a" stroke-width="2"/>
    <text x="530" y="40" font-size="7" fill="#6a8a7a">Mean</text>
    <text x="530" y="50" font-size="7" fill="#6a8a7a">Luma</text>
    <text x="260" y="72" text-anchor="middle" font-size="8" fill="#6a8a7a">逐幀亮度平滑變化 → 無 Flicker ✓</text>
  </g>
</svg><div class="caption">圖 5-20：時域平滑對 HDR 視訊亮度一致性的影響</div></div>

<h3>Flicker-Free 的硬體設計</h3>
<p>在硬體 ISP 中實現 Flicker-Free Tone Mapping 需要以下機制：</p>
<ul>
<li><strong>Statistics Buffer</strong>：存儲前一幀（或前幾幀）的統計量（Histogram, Block Mean 等），用於時域濾波</li>
<li><strong>Double-Buffered LUT</strong>：在 VBlank 期間切換 LUT，確保一幀內使用同一組參數</li>
<li><strong>Frame Counter</strong>：追蹤幀數，在 Scene Change Detection 時調整 α</li>
<li><strong>Gain Map Buffer（LTM）</strong>：存儲前一幀的 Gain Map，與當前幀做混合</li>
</ul>

<h3>Scene Change 與適應速度的平衡</h3>
<p>Temporal Smoothing 帶來穩定性的同時，也降低了場景切換時的適應速度。當從暗場景切換到亮場景（如走出隧道），如果 α 太小，Tone Mapping 需要很多幀才能適應，導致畫面過曝好幾秒。解決方案：</p>
<ul>
<li>偵測到 Histogram 的劇烈變化（如 Mean Brightness 變化 > 50%）時，增大 α</li>
<li>設定最大適應幀數（如 15 幀），超過後強制使用新參數</li>
<li>使用 Asymmetric α：亮→暗的適應可以快（α=0.2），暗→亮的適應慢一點（α=0.1），因為人眼暗適應比明適應慢</li>
</ul>

<div class="info-box key">
<div class="box-title">核心概念</div>
HDR 視訊 Tone Mapping 的時域一致性問題，本質上是「穩定性」和「響應速度」的 Trade-Off。時域濾波的時間常數越大（α 越小），畫面越穩定，但場景切換時適應越慢。工程上需要根據應用場景做取捨：安防監控可以容忍 0.5~1 秒的適應時間（穩定性優先），車用相機最多只能容忍 3~5 幀的延遲（安全優先）。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
測試 HDR 視訊 Tone Mapping 的 Flicker，可以用固定相機拍攝一個場景 10 秒以上，然後觀察影片中某個固定區域的亮度變化。理想情況下，固定場景的亮度應該完全穩定。如果觀察到週期性的亮度波動，通常是 AE 和 Adaptive Tone Curve 之間的「打架」——兩者都在嘗試調整亮度，但方向或速度不同步。
</div>
`,
      keyPoints: [
        "HDR 視訊的 Tone Mapping 必須保證時域一致性，避免 Flicker 和 Pumping",
        "IIR 時域濾波（α=0.05~0.1）是最基本的穩定性保障",
        "Scene Change Detection 可動態調整 α，在穩定性和響應速度間取得平衡",
        "硬體需要 Statistics Buffer、Double-Buffered LUT、Gain Map Buffer 等資源",
        "Asymmetric α（明暗適應速度不同）可更好地匹配人眼的適應特性"
      ]
    },
    {
      id: "ch5_21",
      title: "Tone Mapping 品質 Debug",
      content: `
<h3>系統化的 Debug 方法論</h3>
<p>Tone Mapping 的品質問題通常表現為：影像過暗/過亮、對比不足/過強、高光 Clipping、暗部噪聲放大、Halo Artifact、Banding（色帶）、Flicker 等。有效的 Debug 需要系統化的分析工具和方法論。</p>

<h3>Histogram 分析</h3>
<p>Histogram 是 Tone Mapping Debug 的最基本工具。透過觀察 Tone Mapping 前後的 Histogram 變化，可以判斷映射是否符合預期：</p>
<ul>
<li><strong>Input Histogram 偏左</strong>：場景偏暗，Tone Curve 的 Toe 需要提升</li>
<li><strong>Output Histogram 在兩端堆積</strong>：Tone Curve 壓縮過度，暗部和亮部都 Clip</li>
<li><strong>Output Histogram 過於集中</strong>：Tone Curve 的某段斜率過大，過度拉伸局部</li>
<li><strong>Output Histogram 缺少某些值</strong>：量化不足導致的 Banding</li>
</ul>

<div class="diagram"><svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="400" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">Tone Mapping Debug 工具鏈</text>
  <!-- Waveform Monitor -->
  <g transform="translate(20,50)">
    <rect x="0" y="0" width="170" height="140" rx="6" fill="rgba(74,122,181,0.06)" stroke="#4a7ab5" stroke-width="1.5"/>
    <text x="85" y="18" text-anchor="middle" font-size="10" fill="#4a7ab5" font-weight="500">Waveform Monitor</text>
    <rect x="10" y="25" width="150" height="85" rx="3" fill="#1a1a20"/>
    <!-- Waveform trace -->
    <polyline points="15,95 25,85 35,70 45,90 55,60 65,50 75,55 85,40 95,35 105,45 115,50 125,65 135,80 145,75 155,85" fill="none" stroke="#4a7ab5" stroke-width="1.5" opacity="0.8"/>
    <polyline points="15,98 25,92 35,88 45,95 55,78 65,65 75,72 85,55 95,50 105,62 115,68 125,82 135,90 145,88 155,92" fill="none" stroke="#6a8a7a" stroke-width="1" opacity="0.5"/>
    <text x="85" y="125" text-anchor="middle" font-size="7" fill="#8a8580">X: 水平位置，Y: 亮度值</text>
    <text x="85" y="137" text-anchor="middle" font-size="7" fill="#8a8580">檢查 Clipping、動態範圍利用率</text>
  </g>
  <!-- False Color Overlay -->
  <g transform="translate(210,50)">
    <rect x="0" y="0" width="170" height="140" rx="6" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="85" y="18" text-anchor="middle" font-size="10" fill="#c4a064" font-weight="500">False Color Overlay</text>
    <rect x="10" y="25" width="150" height="85" rx="3" fill="#303030"/>
    <!-- False color blocks -->
    <rect x="15" y="30" width="35" height="35" fill="#4040c0" opacity="0.8"/>
    <rect x="55" y="30" width="35" height="35" fill="#40a040" opacity="0.8"/>
    <rect x="95" y="30" width="35" height="35" fill="#c0c040" opacity="0.8"/>
    <rect x="15" y="70" width="35" height="35" fill="#c06040" opacity="0.8"/>
    <rect x="55" y="70" width="35" height="35" fill="#c04040" opacity="0.8"/>
    <rect x="95" y="70" width="35" height="35" fill="#ff4040" opacity="0.8"/>
    <text x="32" y="50" text-anchor="middle" font-size="6" fill="#fff">暗部</text>
    <text x="72" y="50" text-anchor="middle" font-size="6" fill="#fff">中灰</text>
    <text x="112" y="50" text-anchor="middle" font-size="6" fill="#fff">亮部</text>
    <text x="112" y="90" text-anchor="middle" font-size="6" fill="#fff">過曝!</text>
    <text x="85" y="125" text-anchor="middle" font-size="7" fill="#8a8580">不同亮度用不同顏色標示</text>
    <text x="85" y="137" text-anchor="middle" font-size="7" fill="#8a8580">快速定位 Clipping 區域</text>
  </g>
  <!-- Histogram Compare -->
  <g transform="translate(400,50)">
    <rect x="0" y="0" width="180" height="140" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="90" y="18" text-anchor="middle" font-size="10" fill="#6a8a7a" font-weight="500">Histogram Compare</text>
    <rect x="10" y="25" width="160" height="85" rx="3" fill="rgba(213,206,199,0.15)"/>
    <!-- Before histogram -->
    <rect x="15" y="60" width="6" height="50" fill="rgba(74,122,181,0.4)"/>
    <rect x="25" y="45" width="6" height="65" fill="rgba(74,122,181,0.5)"/>
    <rect x="35" y="55" width="6" height="55" fill="rgba(74,122,181,0.4)"/>
    <rect x="45" y="70" width="6" height="40" fill="rgba(74,122,181,0.3)"/>
    <!-- After histogram -->
    <rect x="75" y="50" width="6" height="60" fill="rgba(106,138,122,0.5)"/>
    <rect x="85" y="40" width="6" height="70" fill="rgba(106,138,122,0.6)"/>
    <rect x="95" y="45" width="6" height="65" fill="rgba(106,138,122,0.5)"/>
    <rect x="105" y="35" width="6" height="75" fill="rgba(106,138,122,0.6)"/>
    <rect x="115" y="50" width="6" height="60" fill="rgba(106,138,122,0.5)"/>
    <rect x="125" y="55" width="6" height="55" fill="rgba(106,138,122,0.45)"/>
    <text x="35" y="103" text-anchor="middle" font-size="7" fill="#4a7ab5">Before</text>
    <text x="105" y="103" text-anchor="middle" font-size="7" fill="#6a8a7a">After</text>
    <text x="90" y="125" text-anchor="middle" font-size="7" fill="#8a8580">對比 TM 前後分佈變化</text>
    <text x="90" y="137" text-anchor="middle" font-size="7" fill="#8a8580">驗證壓縮和展開效果</text>
  </g>
  <!-- Debug flowchart -->
  <g transform="translate(20,210)">
    <rect x="0" y="0" width="560" height="170" rx="6" fill="rgba(213,206,199,0.2)" stroke="#d5cec7" stroke-width="1"/>
    <text x="280" y="22" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="500">常見問題 Debug 流程</text>
    <text x="20" y="45" font-size="9" fill="#c44040" font-weight="500">問題：高光 Clipping</text>
    <text x="200" y="45" font-size="8" fill="#5a5550">→ 檢查 White Point 設定 → 降低 Shoulder Slope → 確認 Input 未飽和</text>
    <text x="20" y="70" font-size="9" fill="#c44040" font-weight="500">問題：暗部噪聲明顯</text>
    <text x="200" y="70" font-size="8" fill="#5a5550">→ Toe Lift 過大 → 降低暗部增益 → 增強暗部 NR → 確認 Gain 與 NR 聯動</text>
    <text x="20" y="95" font-size="9" fill="#c44040" font-weight="500">問題：Banding（色帶）</text>
    <text x="200" y="95" font-size="8" fill="#5a5550">→ LUT 精度不足 → 增加 LUT entries → 啟用 Dithering → 檢查 Bit-Depth 截斷</text>
    <text x="20" y="120" font-size="9" fill="#c44040" font-weight="500">問題：Halo（LTM）</text>
    <text x="200" y="120" font-size="8" fill="#5a5550">→ Block Size 太大 → 增加 Block 數 → 加強 Edge-Aware 濾波 → 降低 LTM 強度</text>
    <text x="20" y="145" font-size="9" fill="#c44040" font-weight="500">問題：Flicker（視訊）</text>
    <text x="200" y="145" font-size="8" fill="#5a5550">→ Temporal α 太大 → 減小 α → 檢查 AE 與 TM 是否衝突 → 增加幀間平滑</text>
    <text x="20" y="165" font-size="9" fill="#c44040" font-weight="500">問題：色彩偏移</text>
    <text x="200" y="165" font-size="8" fill="#5a5550">→ Tone Mapping 改變了色彩比例 → 使用 Luminance-only TM → 檢查 Saturation 保持</text>
  </g>
</svg><div class="caption">圖 5-21：Tone Mapping Debug 工具鏈與常見問題排查流程</div></div>

<h3>Clipping Detection</h3>
<p>Clipping 是 Tone Mapping 最常見的問題之一。檢測方法：</p>
<ul>
<li><strong>Over-Exposure Mask</strong>：將所有達到最大值（如 255 for 8-bit）的像素標紅。如果紅色區域太大，說明 Shoulder 壓縮不足或 White Point 太低</li>
<li><strong>Under-Exposure Mask</strong>：將所有為 0 的像素標藍。如果藍色區域太大，說明 Toe 提升不足或 Black Point 太高</li>
<li><strong>Saturation Warning</strong>：在輸出影像上疊加 Zebra Pattern（斑馬紋），標示接近飽和的區域</li>
</ul>

<div class="note">
在 ISP 硬體 Debug 中，可以在 Pipeline 中插入 Tap Points（測試點），在 Tone Mapping 前後分別抓取像素數據。透過比較同一像素在 TM 前後的值，可以精確驗證 Tone Curve 是否正確實現。這在 FPGA 原型驗證階段特別有用。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
Tone Mapping Debug 的核心原則是「先看數據、再看影像」。人眼的判斷容易受到顯示裝置、環境光和主觀偏好的影響。Histogram、Waveform 和 False Color 提供了客觀的數據依據。先用數據確認映射是否正確（是否 Clip、動態範圍是否充分利用、對比是否均勻），然後再用眼睛判斷視覺效果是否滿意。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
建議在 ISP 調試工具中建立 A/B Compare 功能：左邊顯示調整前的影像，右邊顯示調整後的。可以用滑桿在兩者之間切換。這比單獨看一張影像更容易發現差異。此外，在做 Tone Mapping 調試時，一定要同時觀察全圖和 1:1 Crop（裁剪放大），因為全圖看起來好的效果在 1:1 下可能有 Banding 或 Noise 問題。
</div>
`,
      keyPoints: [
        "Histogram、Waveform Monitor、False Color 是三大核心 Debug 工具",
        "常見問題依序排查：Clipping → 噪聲 → Banding → Halo → Flicker → 色偏",
        "Clipping Detection 使用 Over/Under-Exposure Mask 和 Zebra Pattern",
        "Debug 原則：先看數據再看影像，避免主觀判斷的偏差",
        "A/B Compare 和 1:1 Crop 是發現細節問題的關鍵方法"
      ]
    },
    {
      id: "ch5_22",
      title: "車用 HDR/LFM 特殊要求",
      content: `
<h3>車用 HDR 的獨特挑戰</h3>
<p>車用相機的 HDR 處理面臨消費級相機所沒有的獨特挑戰。除了前面介紹的基本需求外（高 DR、即時性、功能安全），還有 LED Flicker Mitigation（LFM）、隧道出入口適應、以及多曝光時序等車用特有的技術難題。本節深入探討這些專題。</p>

<h3>LED Flicker Mitigation (LFM)</h3>
<p>現代交通基礎設施大量使用 LED 照明：交通信號燈、LED 路燈、LED 車尾燈、電子廣告看板等。LED 以 PWM（Pulse Width Modulation）驅動，以人眼無法感知的頻率（90~2000 Hz）快速開關。當相機的曝光時間不是 LED 週期的整數倍時，可能拍到 LED 完全熄滅的瞬間。</p>

<div class="diagram"><svg viewBox="0 0 600 430" xmlns="http://www.w3.org/2000/svg">
  <rect fill="#f5f0eb" width="600" height="430" rx="8"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="500">LED Flicker 問題與 LFM 解決方案</text>
  <!-- LED PWM Signal -->
  <g transform="translate(30,55)">
    <text x="0" y="0" font-size="10" fill="#5a5550" font-weight="500">LED PWM Signal (100 Hz)</text>
    <line x1="0" y1="30" x2="540" y2="30" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- PWM pulses -->
    <path d="M10,30 L10,10 L50,10 L50,30 L60,30 L60,10 L100,10 L100,30 L110,30 L110,10 L150,10 L150,30 L160,30 L160,10 L200,10 L200,30 L210,30 L210,10 L250,10 L250,30 L260,30 L260,10 L300,10 L300,30 L310,30 L310,10 L350,10 L350,30 L360,30 L360,10 L400,10 L400,30 L410,30 L410,10 L450,10 L450,30" fill="none" stroke="#c4a064" stroke-width="1.5"/>
    <text x="460" y="25" font-size="7" fill="#c4a064">LED ON/OFF</text>
    <!-- Short exposure window (bad) -->
    <rect x="45" y="35" width="20" height="15" fill="rgba(196,64,64,0.2)" stroke="#c44040" stroke-width="1"/>
    <text x="55" y="62" text-anchor="middle" font-size="7" fill="#c44040">短曝光</text>
    <text x="55" y="72" text-anchor="middle" font-size="7" fill="#c44040">剛好在 OFF</text>
    <!-- Long exposure window (good) -->
    <rect x="210" y="35" width="100" height="15" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1"/>
    <text x="260" y="62" text-anchor="middle" font-size="7" fill="#6a8a7a">長曝光（覆蓋完整週期）</text>
  </g>
  <!-- LFM Solutions -->
  <g transform="translate(30,155)">
    <rect x="0" y="0" width="540" height="130" rx="6" fill="rgba(106,138,122,0.06)" stroke="#6a8a7a" stroke-width="1.5"/>
    <text x="270" y="22" text-anchor="middle" font-size="11" fill="#6a8a7a" font-weight="500">LFM 解決方案</text>
    <g transform="translate(15,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">1. 延長最短曝光</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">短曝光 ≥ 1/LED_freq</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">例：LED 100Hz → T_short ≥ 10ms</text>
      <text x="0" y="57" font-size="8" fill="#c44040">代價：短曝光 DR 降低</text>
    </g>
    <g transform="translate(190,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">2. Chopping 技術</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">一次曝光分成多個子曝光</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">子曝光間隔 = LED 半週期</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">至少一個子曝光會捕捉到 LED ON</text>
    </g>
    <g transform="translate(380,35)">
      <text x="0" y="12" font-size="9" fill="#5a5550" font-weight="500">3. 多次讀出 (DCG+VS)</text>
      <text x="0" y="27" font-size="8" fill="#8a8580">Dual Conversion Gain +</text>
      <text x="0" y="42" font-size="8" fill="#8a8580">Very Short exposure</text>
      <text x="0" y="57" font-size="8" fill="#8a8580">犧牲部分 HDR 換取 LFM</text>
    </g>
    <text x="270" y="108" text-anchor="middle" font-size="8" fill="#8a8580">* OmniVision OX08B40、Sony IMX728 等車用 Sensor 內建 LFM 支援</text>
  </g>
  <!-- Tunnel adaptation -->
  <g transform="translate(30,305)">
    <rect x="0" y="0" width="540" height="110" rx="6" fill="rgba(196,160,100,0.06)" stroke="#c4a064" stroke-width="1.5"/>
    <text x="270" y="22" text-anchor="middle" font-size="11" fill="#c4a064" font-weight="500">隧道出入口適應策略</text>
    <!-- Timeline -->
    <line x1="30" y1="55" x2="510" y2="55" stroke="#5a5550" stroke-width="1"/>
    <rect x="30" y="40" width="100" height="30" rx="3" fill="rgba(196,160,100,0.15)"/>
    <text x="80" y="58" text-anchor="middle" font-size="8" fill="#5a5550">隧道外（明亮）</text>
    <rect x="140" y="40" width="60" height="30" rx="3" fill="rgba(196,160,100,0.3)" stroke="#c4a064" stroke-width="1"/>
    <text x="170" y="58" text-anchor="middle" font-size="7" fill="#5a5550">過渡區</text>
    <rect x="210" y="40" width="140" height="30" rx="3" fill="rgba(90,85,80,0.3)"/>
    <text x="280" y="58" text-anchor="middle" font-size="8" fill="#fff">隧道內（昏暗）</text>
    <rect x="360" y="40" width="60" height="30" rx="3" fill="rgba(196,160,100,0.3)" stroke="#c4a064" stroke-width="1"/>
    <text x="390" y="58" text-anchor="middle" font-size="7" fill="#5a5550">過渡區</text>
    <rect x="430" y="40" width="80" height="30" rx="3" fill="rgba(196,160,100,0.15)"/>
    <text x="470" y="58" text-anchor="middle" font-size="8" fill="#5a5550">隧道外</text>
    <!-- Adaptation curve -->
    <text x="30" y="88" font-size="8" fill="#5a5550">AE + Tone Curve 需在 <tspan fill="#c44040">3~5 幀</tspan>內完成適應</text>
    <text x="30" y="102" font-size="8" fill="#5a5550">使用 <tspan fill="#6a8a7a">預測式</tspan>適應：偵測到亮度急劇變化時，立即載入預設的隧道/戶外參數</text>
  </g>
</svg><div class="caption">圖 5-22：LED Flicker 問題與 LFM 解決方案，以及隧道出入口適應策略</div></div>

<h3>Multi-Exposure Timing 設計</h3>
<p>車用 HDR Sensor 的多曝光時序設計需要同時考慮 HDR 性能和 LFM 需求，這兩個目標往往互相矛盾：</p>

<div class="table-container">
<table>
<tr><th>曝光策略</th><th>HDR 效果</th><th>LFM 效果</th><th>Motion Artifact</th><th>適用場景</th></tr>
<tr><td>T1:T2 = 16:1</td><td>好（~24 dB gain）</td><td>差（T2 太短）</td><td>中等</td><td>一般車用</td></tr>
<tr><td>T1:T2 = 4:1</td><td>中等（~12 dB gain）</td><td>好（T2 夠長）</td><td>低</td><td>LFM 優先</td></tr>
<tr><td>T1:T2:T3 = 16:4:1</td><td>很好（~24 dB）</td><td>中等（T2 LFM OK）</td><td>較高</td><td>高階車用</td></tr>
<tr><td>DCG + T1:T2 = 4:1</td><td>好（DCG+12 dB）</td><td>好</td><td>低</td><td>最新車用 Sensor</td></tr>
</table>
</div>

<h3>Traffic Light Recognition 對 ISP 的要求</h3>
<p>自動駕駛需要準確識別交通信號燈的顏色（紅/黃/綠）和狀態（亮/滅/閃爍）。這對 ISP 的 Tone Mapping 和色彩處理提出了特殊要求：</p>
<ul>
<li><strong>亮度保留</strong>：信號燈通常是場景中最亮的物體之一。Tone Mapping 不能過度壓縮高光，否則信號燈的顏色會變淡或被 Clip 成白色</li>
<li><strong>色彩準確</strong>：紅、黃、綠三色的色度（Chromaticity）必須在 Tone Mapping 後仍然可辨別。使用 Luminance-only Tone Mapping 可以保持色度不變</li>
<li><strong>Flicker-Free</strong>：必須確保 LED 信號燈不會因為 LFM 不足而在影片中出現「熄滅」或「閃爍」</li>
</ul>

<div class="note">
車用 ISP 的另一個重要考量是 Functional Safety（功能安全）。根據 ISO 26262，ISP 需要實現錯誤偵測機制。例如，在 Tone Mapping LUT 中加入 CRC 校驗，確保 LUT 數據沒有被 Bit-Flip 破壞。如果偵測到 LUT 錯誤，ISP 應該切換到 Fallback Mode（使用硬編碼的簡單 Gamma 曲線），而不是輸出錯誤的映射結果。
</div>

<div class="info-box key">
<div class="box-title">核心概念</div>
車用 HDR/LFM 是一個「不可能三角」：HDR 動態範圍、LFM 防閃爍、Motion Artifact 抑制——三者很難同時最優化。增加曝光比（T1/T2）可提高 HDR，但短曝光變得太短導致 LFM 失敗。延長短曝光可改善 LFM，但降低了 HDR 增益。增加曝光數量（3-exposure）可以同時改善 HDR 和 LFM，但增加了 Motion Artifact 風險和硬體成本。車用 ISP 工程師必須根據具體的 ADAS 需求做取捨。
</div>

<div class="info-box tip">
<div class="box-title">實務提示</div>
驗證車用 HDR/LFM 性能的標準測試方法：(1) 在暗室中架設 LED 陣列（紅/黃/綠，90Hz~2kHz PWM 頻率），拍攝 1000 幀以上，確認每一幀 LED 都亮。(2) 在隧道出入口場景實拍，確認 3~5 幀內完成明暗適應。(3) 在夜間拍攝十字路口，確認信號燈顏色正確、車尾燈不閃爍、同時行人和路標仍可辨識。三項測試全過才算合格。
</div>
`,
      keyPoints: [
        "LED Flicker Mitigation 是車用相機的獨特需求——避免拍到 LED 熄滅瞬間",
        "LFM 主要方案：延長最短曝光、Chopping 技術、DCG+VS 多次讀出",
        "車用 HDR 的「不可能三角」：HDR 範圍 vs LFM vs Motion Artifact",
        "隧道出入口需在 3~5 幀內完成明暗適應，可用預測式參數切換",
        "Traffic Light Recognition 要求 Tone Mapping 保留信號燈的亮度和色彩準確性"
      ]
    }
  ]
};
