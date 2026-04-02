const CH1 = {
  title: "Camera ISP 基礎概論",
  sections: [
    {
      id: "ch1_1",
      title: "什麼是 ISP？從光子到像素的旅程",
      content: `<h3>什麼是 ISP？從光子到像素的旅程</h3>

<p>ISP（Image Signal Processor，影像訊號處理器）是數位相機系統中最核心的運算單元之一。它負責將影像感測器輸出的原始電子訊號，經過一系列精密的數位訊號處理演算法，轉換為人眼可接受的高品質數位影像。無論是手機相機、車用攝影鏡頭、安防監控系統，還是專業數位相機，ISP 都扮演著不可或缺的角色。</p>

<p>要理解 ISP 的功能，我們必須先從光的本質談起。自然界中的光線（Photon，光子）以電磁波的形式傳播，攜帶著場景中的亮度與色彩資訊。當光子通過鏡頭（Lens）的光學系統後，會聚焦在影像感測器（Image Sensor）的表面上。感測器上的每個像素（Pixel）中的光電二極體（Photodiode）會將光子轉換為電子（Electron），這個過程稱為光電轉換（Photoelectric Conversion）。</p>

<div class="diagram">
<svg viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:900px">
  <defs>
    <marker id="arrowCh1_1" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#6a8a7a"/></marker>
  </defs>
  <rect x="0" y="0" width="900" height="220" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <!-- Photon -->
  <circle cx="60" cy="100" r="30" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="60" y="96" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">光子</text>
  <text x="60" y="112" text-anchor="middle" font-size="9" fill="#8a8580">Photon</text>
  <line x1="95" y1="100" x2="140" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <!-- Lens -->
  <ellipse cx="170" cy="100" rx="18" ry="45" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="170" y="170" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">鏡頭</text>
  <text x="170" y="185" text-anchor="middle" font-size="9" fill="#8a8580">Lens</text>
  <line x1="195" y1="100" x2="245" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <!-- Sensor -->
  <rect x="255" y="60" width="80" height="80" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <rect x="262" y="67" width="15" height="15" fill="#e74c3c" opacity="0.5"/><rect x="279" y="67" width="15" height="15" fill="#27ae60" opacity="0.5"/>
  <rect x="262" y="84" width="15" height="15" fill="#27ae60" opacity="0.5"/><rect x="279" y="84" width="15" height="15" fill="#2980b9" opacity="0.5"/>
  <rect x="300" y="67" width="15" height="15" fill="#e74c3c" opacity="0.5"/><rect x="317" y="67" width="15" height="15" fill="#27ae60" opacity="0.5"/>
  <rect x="300" y="84" width="15" height="15" fill="#27ae60" opacity="0.5"/><rect x="317" y="84" width="15" height="15" fill="#2980b9" opacity="0.5"/>
  <text x="295" y="170" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">感測器</text>
  <text x="295" y="185" text-anchor="middle" font-size="9" fill="#8a8580">Image Sensor</text>
  <line x1="340" y1="100" x2="390" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <!-- ADC -->
  <rect x="400" y="70" width="80" height="60" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="440" y="96" text-anchor="middle" font-size="13" fill="#5a5550" font-weight="bold">ADC</text>
  <text x="440" y="112" text-anchor="middle" font-size="8" fill="#8a8580">類比→數位</text>
  <text x="440" y="170" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">類比數位轉換</text>
  <text x="440" y="185" text-anchor="middle" font-size="9" fill="#8a8580">ADC</text>
  <line x1="485" y1="100" x2="535" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <!-- ISP -->
  <rect x="545" y="60" width="120" height="80" rx="8" fill="#6a8a7a" stroke="#5a5550" stroke-width="2"/>
  <text x="605" y="96" text-anchor="middle" font-size="15" fill="#fff" font-weight="bold">ISP</text>
  <text x="605" y="114" text-anchor="middle" font-size="9" fill="#f5f0eb">影像訊號處理</text>
  <text x="605" y="170" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">影像訊號處理器</text>
  <text x="605" y="185" text-anchor="middle" font-size="9" fill="#8a8580">ISP</text>
  <line x1="670" y1="100" x2="720" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <!-- Display -->
  <rect x="730" y="65" width="100" height="70" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <rect x="738" y="72" width="84" height="48" rx="2" fill="#e8f5e9"/>
  <text x="780" y="102" text-anchor="middle" font-size="10" fill="#5a5550">🖼️</text>
  <text x="780" y="170" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">顯示器</text>
  <text x="780" y="185" text-anchor="middle" font-size="9" fill="#8a8580">Display</text>
</svg>
<div class="caption">圖 1-1：從光子到像素的完整影像處理路徑 — 光子經由鏡頭聚焦到感測器，經 ADC 數位化後由 ISP 處理，最終輸出至顯示器</div>
</div>

<p>累積在每個像素中的電荷量（Charge）與入射光子的數量成正比。在曝光時間（Exposure Time）結束後，這些類比電荷訊號會被讀出電路（Readout Circuit）逐行讀出，再經由類比數位轉換器（ADC, Analog-to-Digital Converter）將連續的類比電壓轉換為離散的數位數值。這個數位數值就是我們所說的 RAW Data（原始資料）。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>RAW Data 並非我們平常看到的彩色照片。由於大多數感測器使用 Color Filter Array（CFA，色彩濾鏡陣列），每個像素只記錄紅（R）、綠（G）、藍（B）三色中的一種顏色資訊。因此 RAW Data 本質上是一個單通道（Single-channel）的灰度矩陣，需要經過 ISP 的 Demosaic 等處理才能還原為完整的三通道彩色影像。</p>
</div>

<p>ISP 的核心任務可以概括為以下幾個方面：</p>

<table>
<thead>
<tr><th>任務類別</th><th>英文名稱</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>感測器校正</td><td>Sensor Correction</td><td>補償感測器硬體缺陷，如黑階偏移、壞點、Lens Shading 等</td></tr>
<tr><td>色彩還原</td><td>Color Reconstruction</td><td>透過 Demosaic、White Balance、CCM 等還原真實色彩</td></tr>
<tr><td>雜訊抑制</td><td>Noise Reduction</td><td>降低各種雜訊（Shot Noise、Read Noise、FPN）對影像品質的影響</td></tr>
<tr><td>影像增強</td><td>Image Enhancement</td><td>銳化、對比度調整、Tone Mapping 等提升視覺品質</td></tr>
<tr><td>3A 控制</td><td>3A Control</td><td>自動曝光（AE）、自動白平衡（AWB）、自動對焦（AF）的回饋控制</td></tr>
</tbody>
</table>

<p>ISP 的處理可以由專用硬體（Hardware ISP）或軟體演算法（Software ISP）完成。在手機和車用場景中，由於即時性（Real-time）要求嚴格，通常使用硬體 ISP 來實現核心 Pipeline。硬體 ISP 以固定的順序串接多個處理模組，每個模組負責一項特定的影像處理任務，整條處理鏈稱為 ISP Pipeline。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>現代高階手機 SoC（如 Qualcomm Snapdragon、MediaTek Dimensity、Apple A/M 系列）內建的 ISP 通常支援多攝同時處理（Multi-camera concurrent processing），可以同時處理 3 路甚至更多路的影像資料流。車用 ISP（如 Texas Instruments TDA4、Ambarella CV5）則特別強調低延遲（Low Latency）和高可靠性（High Reliability）。</p>
</div>

<p>從工程角度來看，ISP 的設計需要在影像品質（Image Quality, IQ）、功耗（Power Consumption）、處理速度（Throughput）和晶片面積（Die Area）之間取得平衡。這也是 ISP 工程師日常 Tuning 工作的核心挑戰 — 在有限的硬體資源下，透過精確的參數調整，讓影像品質達到最佳表現。</p>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>一個典型的手機相機拍照流程：使用者按下快門 → Sensor 進行曝光（約 1/60 秒）→ Sensor Readout（逐行讀出）→ ADC 轉換為 10-bit RAW → ISP Pipeline 處理（BLC → Demosaic → AWB → CCM → Gamma → NR → Sharpen → Tone Mapping）→ JPEG/HEIF 編碼 → 儲存至記憶體。整個流程在數十毫秒內完成。</p>
</div>

<p>在後續章節中，我們將深入拆解 ISP Pipeline 中的每一個處理模組，了解其背後的演算法原理與實際工程中的調參技巧。掌握這些知識，是成為優秀 ISP 工程師的第一步。</p>`,
      keyPoints: [
        "ISP 負責將感測器的原始 RAW 資料轉換為高品質的數位影像",
        "光子經由光電轉換、ADC 數位化後形成 RAW Data，需要 ISP 處理才能成為可視影像",
        "ISP 的核心任務包含感測器校正、色彩還原、雜訊抑制、影像增強與 3A 控制"
      ]
    },
    {
      id: "ch1_2",
      title: "影像感測器原理",
      content: `<h3>影像感測器原理</h3>

<p>影像感測器（Image Sensor）是數位相機的「眼睛」，負責將光學影像轉換為電子訊號。目前市場上主流的感測器技術為 CMOS（Complementary Metal-Oxide-Semiconductor，互補式金屬氧化物半導體）影像感測器。相較於早期的 CCD（Charge-Coupled Device，電荷耦合元件），CMOS 感測器具有低功耗、高整合度、快速讀取等優勢，已成為手機與車用相機的標準配置。</p>

<h4>CMOS 像素結構</h4>

<p>每個 CMOS 像素（Pixel）是一個微小的光電轉換單元。典型的 CMOS 像素採用 4T（4-Transistor）架構，由光電二極體（Photodiode, PD）和四個電晶體組成：Transfer Gate（TG）、Reset Transistor（RST）、Source Follower（SF）和 Row Select（SEL）。</p>

<div class="diagram">
<svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px">
  <rect x="0" y="0" width="700" height="400" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="350" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">CMOS 像素剖面結構圖 (Cross-Section)</text>
  <!-- Micro lens -->
  <ellipse cx="350" cy="70" rx="120" ry="25" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="350" y="74" text-anchor="middle" font-size="10" fill="#5a5550">Micro Lens（微透鏡）</text>
  <!-- Color Filter -->
  <rect x="250" y="100" width="200" height="30" rx="2" fill="#27ae60" opacity="0.3" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="350" y="120" text-anchor="middle" font-size="10" fill="#5a5550">Color Filter（色彩濾鏡）</text>
  <!-- Metal layers -->
  <rect x="230" y="140" width="240" height="25" rx="2" fill="#bdc3c7" stroke="#8a8580" stroke-width="1"/>
  <text x="350" y="157" text-anchor="middle" font-size="9" fill="#5a5550">Metal Interconnect（金屬走線層）</text>
  <!-- Photodiode -->
  <rect x="280" y="180" width="140" height="100" rx="4" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="350" y="220" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="bold">Photodiode</text>
  <text x="350" y="238" text-anchor="middle" font-size="9" fill="#8a8580">光電二極體</text>
  <text x="350" y="256" text-anchor="middle" font-size="9" fill="#8a8580">（光子 → 電子）</text>
  <!-- Substrate -->
  <rect x="200" y="295" width="300" height="40" rx="2" fill="#e8e0d8" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="350" y="320" text-anchor="middle" font-size="10" fill="#5a5550">Silicon Substrate（矽基板）</text>
  <!-- Transistors on side -->
  <rect x="500" y="180" width="70" height="22" rx="3" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="535" y="195" text-anchor="middle" font-size="8" fill="#5a5550">TG</text>
  <rect x="500" y="210" width="70" height="22" rx="3" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="535" y="225" text-anchor="middle" font-size="8" fill="#5a5550">RST</text>
  <rect x="500" y="240" width="70" height="22" rx="3" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="535" y="255" text-anchor="middle" font-size="8" fill="#5a5550">SF</text>
  <rect x="500" y="270" width="70" height="22" rx="3" fill="#fff" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="535" y="285" text-anchor="middle" font-size="8" fill="#5a5550">SEL</text>
  <text x="535" y="310" text-anchor="middle" font-size="9" fill="#8a8580">4T 電晶體</text>
  <!-- Light arrows -->
  <line x1="310" y1="45" x2="310" y2="60" stroke="#f1c40f" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <line x1="350" y1="45" x2="350" y2="60" stroke="#f1c40f" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <line x1="390" y1="45" x2="390" y2="60" stroke="#f1c40f" stroke-width="2" marker-end="url(#arrowCh1_1)"/>
  <text x="350" y="42" text-anchor="middle" font-size="10" fill="#f1c40f" font-weight="bold">入射光 (Incident Light)</text>
  <!-- Labels -->
  <text x="120" y="78" text-anchor="middle" font-size="9" fill="#8a8580">← BSI 結構下</text>
  <text x="120" y="92" text-anchor="middle" font-size="9" fill="#8a8580">光線直接照射 PD</text>
  <!-- Legend -->
  <rect x="30" y="350" width="640" height="40" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="50" y="375" font-size="9" fill="#5a5550">BSI (Back-Side Illumination)：光線從背面入射，避免金屬走線遮擋，大幅提升量子效率 (QE)。現代手機感測器幾乎全部採用 BSI 架構。</text>
</svg>
<div class="caption">圖 1-2：CMOS 像素剖面結構示意圖 — 光線經微透鏡聚焦、通過色彩濾鏡後被光電二極體吸收轉換為電荷</div>
</div>

<h4>Bayer Color Filter Array</h4>

<p>由於矽材料本身無法區分光的波長（即顏色），感測器需要在每個像素上方放置色彩濾鏡（Color Filter）。最常見的排列方式是由 Kodak 工程師 Bryce Bayer 在 1976 年發明的 Bayer Pattern，採用 RGGB 排列。在一個 2×2 的基本單元中，包含 1 個紅色（R）、2 個綠色（G）、1 個藍色（B）濾鏡。綠色像素數量是其他顏色的兩倍，因為人眼對綠色光最為敏感（亮度感知主要來自綠色通道）。</p>

<div class="diagram">
<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px">
  <rect x="0" y="0" width="600" height="350" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="300" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">Bayer Pattern (RGGB) 排列圖</text>
  <!-- 8x8 Bayer grid -->
  <g transform="translate(100,45)">
    <!-- Row 0: R G R G R G R G -->
    <rect x="0" y="0" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="25" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="50" y="0" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="75" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="100" y="0" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="125" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="150" y="0" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="175" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="200" y="0" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="225" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="250" y="0" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="275" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="300" y="0" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="325" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="350" y="0" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="375" y="30" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <!-- Row 1: G B G B G B G B -->
    <rect x="0" y="50" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="25" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="50" y="50" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="75" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="100" y="50" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="125" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="150" y="50" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="175" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="200" y="50" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="225" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="250" y="50" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="275" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="300" y="50" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="325" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="350" y="50" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="375" y="80" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <!-- Row 2 same as Row 0 -->
    <rect x="0" y="100" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="25" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="50" y="100" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="75" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="100" y="100" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="125" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="150" y="100" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="175" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="200" y="100" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="225" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="250" y="100" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="275" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="300" y="100" width="50" height="50" fill="#e74c3c" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="325" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">R</text>
    <rect x="350" y="100" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="375" y="130" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <!-- Row 3 same as Row 1 -->
    <rect x="0" y="150" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="25" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="50" y="150" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="75" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="100" y="150" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="125" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="150" y="150" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="175" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="200" y="150" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="225" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="250" y="150" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="275" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <rect x="300" y="150" width="50" height="50" fill="#27ae60" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="325" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">G</text>
    <rect x="350" y="150" width="50" height="50" fill="#2980b9" opacity="0.5" stroke="#fff" stroke-width="1"/><text x="375" y="180" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">B</text>
    <!-- Highlight 2x2 unit -->
    <rect x="0" y="0" width="100" height="100" fill="none" stroke="#5a5550" stroke-width="3" stroke-dasharray="6,3"/>
  </g>
  <text x="80" y="65" text-anchor="end" font-size="10" fill="#5a5550">2×2 基本</text>
  <text x="80" y="79" text-anchor="end" font-size="10" fill="#5a5550">單元</text>
  <!-- Legend -->
  <g transform="translate(100,270)">
    <rect x="0" y="0" width="20" height="16" fill="#e74c3c" opacity="0.5"/><text x="28" y="13" font-size="10" fill="#5a5550">Red (25%)</text>
    <rect x="120" y="0" width="20" height="16" fill="#27ae60" opacity="0.5"/><text x="148" y="13" font-size="10" fill="#5a5550">Green (50%)</text>
    <rect x="260" y="0" width="20" height="16" fill="#2980b9" opacity="0.5"/><text x="288" y="13" font-size="10" fill="#5a5550">Blue (25%)</text>
  </g>
  <text x="300" y="315" text-anchor="middle" font-size="10" fill="#8a8580">虛線框為一個 2×2 RGGB 基本重複單元（Bayer Unit Cell）</text>
</svg>
<div class="caption">圖 1-3：Bayer Pattern (RGGB) 排列方式 — 綠色像素佔 50%，因為人眼對綠色最敏感</div>
</div>

<h4>關鍵感測器參數</h4>

<table>
<thead>
<tr><th>參數</th><th>英文</th><th>說明</th><th>典型值</th></tr>
</thead>
<tbody>
<tr><td>像素尺寸</td><td>Pixel Pitch</td><td>單個像素的邊長</td><td>手機 0.6~1.2μm，車用 2~4μm</td></tr>
<tr><td>量子效率</td><td>Quantum Efficiency (QE)</td><td>入射光子被轉換為電子的比率</td><td>60%~80%</td></tr>
<tr><td>滿阱容量</td><td>Full Well Capacity (FWC)</td><td>單個像素能儲存的最大電子數</td><td>4,000~40,000 e⁻</td></tr>
<tr><td>暗電流</td><td>Dark Current</td><td>無光照下像素產生的電子數/秒</td><td>< 10 e⁻/s @ 60°C</td></tr>
<tr><td>讀取雜訊</td><td>Read Noise</td><td>讀出電路引入的等效電子雜訊</td><td>1~3 e⁻ rms</td></tr>
<tr><td>動態範圍</td><td>Dynamic Range (DR)</td><td>FWC / Read Noise 的比值（dB）</td><td>60~80 dB</td></tr>
</tbody>
</table>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>像素尺寸（Pixel Pitch）是影響影像品質的關鍵參數。越大的像素可以收集越多光子，具有更高的 SNR（Signal-to-Noise Ratio）。手機感測器由於尺寸限制，像素越做越小（0.6μm 級別），因此必須依賴更強大的 ISP 演算法（尤其是降噪與 HDR）來彌補硬體上的劣勢。車用感測器通常使用較大像素（3μm 級別）以確保在各種光照條件下的穩定成像。</p>
</div>

<h4>其他 CFA 排列</h4>

<p>除了傳統的 Bayer Pattern 外，部分廠商開發了替代的 CFA 排列方式：RCCC（用於車用，僅 1 個紅色 + 3 個透明 Clear 像素，提升靈敏度）、Quad Bayer / Tetracell（4 合 1 像素技術，如 Samsung ISOCELL、Sony Quad Bayer）、RYYB（Huawei 部分機型使用，以黃色取代綠色以提升進光量）。這些不同的 CFA 排列都需要 ISP 進行對應的 Demosaic 演算法適配。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>感測器的 CFA 類型直接決定了 ISP Pipeline 前端的處理方式。不同的 CFA 需要不同的 Demosaic 演算法、不同的 AWB 統計方式、以及不同的色彩校正矩陣（CCM）。ISP 工程師在開始 Tuning 前，首先要確認感測器的 CFA 排列類型。</p>
</div>`,
      keyPoints: [
        "CMOS 感測器使用光電二極體將光子轉換為電荷，BSI 架構可提升量子效率",
        "Bayer Pattern (RGGB) 是最常見的 CFA 排列，綠色佔 50% 以符合人眼感知特性",
        "像素尺寸直接影響 SNR 和動態範圍，車用感測器通常比手機感測器使用更大的像素"
      ]
    },
    {
      id: "ch1_3",
      title: "ISP Pipeline 總覽",
      content: `<h3>ISP Pipeline 總覽</h3>

<p>ISP Pipeline 是影像訊號處理器的核心架構。它由多個串接的處理模組（Processing Block）組成，每個模組負責一項特定的影像處理任務。RAW Data 從 Pipeline 的入口進入，經過層層處理後，在出口產生高品質的彩色影像。Pipeline 的設計理念是：每個模組只解決一個特定問題，而所有模組按照特定順序串接，最終達成完整的影像處理效果。</p>

<div class="diagram">
<svg viewBox="0 0 950 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:950px">
  <defs>
    <marker id="arrowPipe" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#6a8a7a"/></marker>
  </defs>
  <rect x="0" y="0" width="950" height="480" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="475" y="28" text-anchor="middle" font-size="15" fill="#5a5550" font-weight="bold">ISP Pipeline 完整流程圖</text>

  <!-- RAW Input -->
  <rect x="30" y="55" width="100" height="45" rx="6" fill="#5a5550" stroke="#5a5550" stroke-width="1.5"/>
  <text x="80" y="76" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">RAW Data</text>
  <text x="80" y="90" text-anchor="middle" font-size="8" fill="#d5cec7">Sensor 輸出</text>
  <line x1="135" y1="77" x2="165" y2="77" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- BLC -->
  <rect x="170" y="55" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="220" y="74" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">BLC</text>
  <text x="220" y="90" text-anchor="middle" font-size="8" fill="#8a8580">Black Level</text>
  <line x1="275" y1="77" x2="305" y2="77" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- BPC -->
  <rect x="310" y="55" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="360" y="74" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">BPC</text>
  <text x="360" y="90" text-anchor="middle" font-size="8" fill="#8a8580">Bad Pixel</text>
  <line x1="415" y1="77" x2="445" y2="77" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- LSC -->
  <rect x="450" y="55" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="500" y="74" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">LSC</text>
  <text x="500" y="90" text-anchor="middle" font-size="8" fill="#8a8580">Lens Shading</text>
  <line x1="555" y1="77" x2="585" y2="77" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Anti-Noise (Raw NR) -->
  <rect x="590" y="55" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="640" y="74" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">Raw NR</text>
  <text x="640" y="90" text-anchor="middle" font-size="8" fill="#8a8580">RAW 域降噪</text>
  <line x1="695" y1="77" x2="725" y2="77" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Demosaic -->
  <rect x="730" y="50" width="120" height="55" rx="6" fill="#6a8a7a" stroke="#5a5550" stroke-width="2"/>
  <text x="790" y="74" text-anchor="middle" font-size="12" fill="#fff" font-weight="bold">Demosaic</text>
  <text x="790" y="90" text-anchor="middle" font-size="8" fill="#f5f0eb">色彩插值</text>

  <!-- Arrow down to second row -->
  <line x1="790" y1="110" x2="790" y2="145" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Second row - right to left -->
  <!-- WB -->
  <rect x="730" y="150" width="120" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="790" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">AWB Gain</text>
  <text x="790" y="185" text-anchor="middle" font-size="8" fill="#8a8580">白平衡增益</text>
  <line x1="725" y1="172" x2="695" y2="172" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- CCM -->
  <rect x="590" y="150" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="640" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">CCM</text>
  <text x="640" y="185" text-anchor="middle" font-size="8" fill="#8a8580">色彩校正矩陣</text>
  <line x1="585" y1="172" x2="555" y2="172" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Gamma -->
  <rect x="450" y="150" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="500" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">Gamma</text>
  <text x="500" y="185" text-anchor="middle" font-size="8" fill="#8a8580">伽瑪校正</text>
  <line x1="445" y1="172" x2="415" y2="172" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- NR (YUV) -->
  <rect x="310" y="150" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="360" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">YUV NR</text>
  <text x="360" y="185" text-anchor="middle" font-size="8" fill="#8a8580">YUV 域降噪</text>
  <line x1="305" y1="172" x2="275" y2="172" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Sharpen -->
  <rect x="170" y="150" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="220" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">Sharpen</text>
  <text x="220" y="185" text-anchor="middle" font-size="8" fill="#8a8580">銳化</text>
  <line x1="165" y1="172" x2="135" y2="172" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Tone Mapping -->
  <rect x="30" y="150" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="80" y="169" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">Tone Map</text>
  <text x="80" y="185" text-anchor="middle" font-size="8" fill="#8a8580">色調映射</text>

  <!-- Arrow down to third row -->
  <line x1="80" y1="200" x2="80" y2="235" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Third row -->
  <!-- CSC -->
  <rect x="30" y="240" width="100" height="45" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="80" y="259" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">CSC</text>
  <text x="80" y="275" text-anchor="middle" font-size="8" fill="#8a8580">RGB→YUV</text>
  <line x1="135" y1="262" x2="165" y2="262" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrowPipe)"/>

  <!-- Output -->
  <rect x="170" y="240" width="120" height="45" rx="6" fill="#5a5550" stroke="#5a5550" stroke-width="1.5"/>
  <text x="230" y="259" text-anchor="middle" font-size="11" fill="#fff" font-weight="bold">Output</text>
  <text x="230" y="275" text-anchor="middle" font-size="8" fill="#d5cec7">YUV/RGB 影像</text>

  <!-- 3A Feedback loop -->
  <rect x="450" y="300" width="300" height="100" rx="8" fill="#fff" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="600" y="325" text-anchor="middle" font-size="12" fill="#6a8a7a" font-weight="bold">3A 回饋控制迴路</text>
  <rect x="470" y="340" width="70" height="30" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="505" y="360" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">AE</text>
  <rect x="560" y="340" width="70" height="30" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="595" y="360" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">AWB</text>
  <rect x="650" y="340" width="70" height="30" rx="4" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="685" y="360" text-anchor="middle" font-size="10" fill="#5a5550" font-weight="bold">AF</text>

  <!-- Feedback arrows -->
  <path d="M 600 300 L 600 200 L 555 200" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrowPipe)"/>
  <text x="615" y="250" font-size="8" fill="#8a8580">統計回饋</text>

  <!-- Domain labels -->
  <rect x="30" y="420" width="200" height="40" rx="4" fill="#fff" stroke="#d5cec7"/>
  <rect x="36" y="426" width="12" height="12" fill="#e8e0d8" stroke="#8a8580" stroke-width="1"/>
  <text x="55" y="437" font-size="9" fill="#5a5550">RAW Domain（單通道）</text>
  <rect x="36" y="444" width="12" height="12" fill="#6a8a7a" opacity="0.2" stroke="#6a8a7a" stroke-width="1"/>
  <text x="55" y="455" font-size="9" fill="#5a5550">RGB/YUV Domain（三通道）</text>

  <!-- Section labels -->
  <rect x="165" y="108" width="540" height="18" rx="2" fill="#e8e0d8" opacity="0.5"/>
  <text x="435" y="121" text-anchor="middle" font-size="9" fill="#8a8580">◀ RAW Domain 處理 ▶</text>
  <rect x="25" y="203" width="830" height="18" rx="2" fill="#6a8a7a" opacity="0.1"/>
  <text x="440" y="216" text-anchor="middle" font-size="9" fill="#8a8580">◀ RGB Domain 處理 ▶</text>
</svg>
<div class="caption">圖 1-4：完整 ISP Pipeline 流程圖 — 從 RAW Data 經過 10+ 個處理模組到最終輸出影像，3A 提供回饋控制</div>
</div>

<p>以下逐一簡介 Pipeline 中各主要模組的功能：</p>

<h4>RAW Domain 處理（Demosaic 前）</h4>

<p><strong>1. BLC（Black Level Correction，黑階校正）</strong>：感測器即使在完全黑暗的情況下，讀出值也不會為零，而是存在一個固定的偏移量（Black Level Offset）。BLC 模組的作用是減去這個偏移量，使「真正的黑」對應到數值 0。這是 ISP Pipeline 的第一步，也是後續所有處理的基礎。</p>

<p><strong>2. BPC（Bad Pixel Correction，壞點校正）</strong>：感測器上不可避免地存在一些異常像素（Dead Pixel、Hot Pixel、Stuck Pixel）。BPC 透過檢測演算法找出這些壞點，並用周圍正常像素的值進行插值替代。</p>

<p><strong>3. LSC（Lens Shading Correction，鏡頭陰影校正）</strong>：由於鏡頭的物理特性，影像邊緣的亮度通常低於中心（Vignetting 現象）。LSC 使用預先校準的增益表（Gain Map）對每個像素施加不同的補償增益，使整幅影像的亮度均勻。</p>

<p><strong>4. Raw NR（Raw Domain Noise Reduction）</strong>：在 Demosaic 之前進行的降噪處理，直接在 Bayer 域上操作。由於還未經過色彩插值，不會產生色彩串擾（Color Crosstalk），降噪效果更為乾淨。</p>

<h4>色彩處理</h4>

<p><strong>5. Demosaic（去馬賽克/色彩插值）</strong>：這是 ISP Pipeline 中最關鍵的模組之一。它將 Bayer 格式的單通道 RAW Data 轉換為完整的三通道 RGB 影像。高品質的 Demosaic 演算法需要考慮邊緣方向（Edge Direction），避免產生 Zipper Artifact 和 False Color。</p>

<p><strong>6. AWB Gain（White Balance Gain，白平衡增益）</strong>：根據 AWB 演算法計算出的色溫估計值，對 R/G/B 三個通道分別乘以不同的增益係數，使白色物體在影像中呈現為中性白色。</p>

<p><strong>7. CCM（Color Correction Matrix，色彩校正矩陣）</strong>：一個 3×3 的線性變換矩陣，用於將感測器的色彩空間映射到標準色彩空間（如 sRGB）。CCM 通常針對不同的色溫（Color Temperature）提供多組矩陣，並進行插值混合。</p>

<div class="formula">CCM: [R' G' B']ᵀ = M₃ₓ₃ × [R G B]ᵀ，其中 M 為 3×3 校正矩陣</div>

<h4>影像增強</h4>

<p><strong>8. Gamma Correction（伽瑪校正）</strong>：將線性光域（Linear Domain）的數值映射到非線性的感知域（Perceptual Domain）。標準 sRGB Gamma 約為 2.2 的反函數（即 Gamma ≈ 1/2.2 ≈ 0.4545）。Gamma 校正讓暗部細節更加明顯，符合人眼的非線性亮度感知特性。</p>

<p><strong>9. YUV NR（YUV Domain Noise Reduction）</strong>：在 YUV 色彩空間中進行降噪。將亮度（Y）和色度（U/V）分開處理，可以對色度通道施加更強的降噪力度，同時保持亮度通道的細節。</p>

<p><strong>10. Sharpen（銳化）</strong>：增強影像邊緣的對比度，提升清晰感。常見的銳化方法包括 Unsharp Mask（USM）和 Edge Enhancement。銳化需要與降噪配合，避免放大雜訊。</p>

<p><strong>11. Tone Mapping（色調映射）</strong>：將 HDR（高動態範圍）影像映射到 SDR（標準動態範圍）的顯示範圍。Local Tone Mapping 可以同時保留暗部與亮部的細節。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>ISP Pipeline 中模組的順序至關重要。例如：BLC 必須在所有處理之前執行；Demosaic 必須在 BPC/LSC 之後；CCM 必須在 AWB 之後。錯誤的順序會導致色彩偏差、雜訊放大等嚴重問題。不同 ISP 平台的 Pipeline 順序可能略有差異，但基本原則一致。</p>
</div>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>學習 ISP Pipeline 時，建議先理解每個模組「解決什麼問題」，再深入研究「如何解決」。ISP Tuning 工程師的日常工作就是調整這些模組的參數，在不同場景（室內、室外、夜景、逆光）下取得最佳的畫質平衡。</p>
</div>`,
      keyPoints: [
        "ISP Pipeline 由多個串接的處理模組組成，分為 RAW Domain 和 RGB/YUV Domain 兩大區域",
        "模組的執行順序至關重要，BLC→BPC→LSC→Demosaic→AWB→CCM→Gamma→NR→Sharpen→Tone Map",
        "3A（AE/AWB/AF）透過回饋控制迴路持續調整 ISP 參數以適應場景變化"
      ]
    },
    {
      id: "ch1_4",
      title: "手機 vs 車用相機 ISP 的差異",
      content: `<h3>手機 vs 車用相機 ISP 的差異</h3>

<p>雖然手機相機和車用相機都使用 ISP 進行影像處理，但由於應用場景的根本差異，兩者在設計理念、性能要求、Pipeline 架構和 Tuning 策略上存在顯著不同。理解這些差異對於 ISP 工程師在跨領域工作時非常重要。</p>

<div class="diagram">
<svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <rect x="0" y="0" width="800" height="420" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">手機 vs 車用 ISP 設計差異比較</text>

  <!-- Mobile side -->
  <rect x="30" y="50" width="350" height="340" rx="8" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <rect x="30" y="50" width="350" height="35" rx="8" fill="#6a8a7a"/>
  <rect x="30" y="70" width="350" height="15" fill="#6a8a7a"/>
  <text x="205" y="73" text-anchor="middle" font-size="13" fill="#fff" font-weight="bold">📱 手機相機 ISP</text>

  <text x="50" y="110" font-size="11" fill="#5a5550" font-weight="bold">目標：拍照好看</text>
  <text x="50" y="130" font-size="10" fill="#8a8580">▸ 追求視覺主觀品質 (Perceptual Quality)</text>
  <text x="50" y="148" font-size="10" fill="#8a8580">▸ 色彩飽和度高、銳化較強</text>
  <text x="50" y="166" font-size="10" fill="#8a8580">▸ 大量使用 AI/ML 後處理</text>

  <text x="50" y="195" font-size="11" fill="#5a5550" font-weight="bold">感測器特性</text>
  <text x="50" y="215" font-size="10" fill="#8a8580">▸ 小像素 (0.6~1.2μm)</text>
  <text x="50" y="233" font-size="10" fill="#8a8580">▸ 高解析度 (48MP~200MP)</text>
  <text x="50" y="251" font-size="10" fill="#8a8580">▸ Quad/Nona Bayer 技術</text>

  <text x="50" y="280" font-size="11" fill="#5a5550" font-weight="bold">處理特點</text>
  <text x="50" y="300" font-size="10" fill="#8a8580">▸ 多幀合成 (Multi-frame Fusion)</text>
  <text x="50" y="318" font-size="10" fill="#8a8580">▸ AI 降噪、Night Mode</text>
  <text x="50" y="336" font-size="10" fill="#8a8580">▸ 計算攝影 (Computational Photography)</text>
  <text x="50" y="354" font-size="10" fill="#8a8580">▸ 延遲容忍度高 (~200ms)</text>
  <text x="50" y="372" font-size="10" fill="#8a8580">▸ 可接受偶發錯誤</text>

  <!-- Automotive side -->
  <rect x="420" y="50" width="350" height="340" rx="8" fill="#fff" stroke="#5a5550" stroke-width="2"/>
  <rect x="420" y="50" width="350" height="35" rx="8" fill="#5a5550"/>
  <rect x="420" y="70" width="350" height="15" fill="#5a5550"/>
  <text x="595" y="73" text-anchor="middle" font-size="13" fill="#fff" font-weight="bold">🚗 車用相機 ISP</text>

  <text x="440" y="110" font-size="11" fill="#5a5550" font-weight="bold">目標：看清真實場景</text>
  <text x="440" y="130" font-size="10" fill="#8a8580">▸ 追求影像保真度 (Fidelity)</text>
  <text x="440" y="148" font-size="10" fill="#8a8580">▸ 色彩準確、避免過度處理</text>
  <text x="440" y="166" font-size="10" fill="#8a8580">▸ 需符合功能安全 (ISO 26262)</text>

  <text x="440" y="195" font-size="11" fill="#5a5550" font-weight="bold">感測器特性</text>
  <text x="440" y="215" font-size="10" fill="#8a8580">▸ 大像素 (2~4μm)</text>
  <text x="440" y="233" font-size="10" fill="#8a8580">▸ 中等解析度 (1~8MP)</text>
  <text x="440" y="251" font-size="10" fill="#8a8580">▸ HDR 感測器 (LED Flicker Free)</text>

  <text x="440" y="280" font-size="11" fill="#5a5550" font-weight="bold">處理特點</text>
  <text x="440" y="300" font-size="10" fill="#8a8580">▸ 單幀即時處理為主</text>
  <text x="440" y="318" font-size="10" fill="#8a8580">▸ 硬體降噪、低延遲</text>
  <text x="440" y="336" font-size="10" fill="#8a8580">▸ 同時服務顯示 + 感知 (CV)</text>
  <text x="440" y="354" font-size="10" fill="#8a8580">▸ 超低延遲 (&lt;30ms)</text>
  <text x="440" y="372" font-size="10" fill="#8a8580">▸ 零容錯 (Safety-critical)</text>
</svg>
<div class="caption">圖 1-5：手機相機 ISP 與車用相機 ISP 的設計理念與特性比較</div>
</div>

<h4>詳細比較</h4>

<table>
<thead>
<tr><th>比較項目</th><th>手機相機 ISP</th><th>車用相機 ISP</th></tr>
</thead>
<tbody>
<tr><td>核心目標</td><td>影像主觀品質最佳化</td><td>影像保真度 + 功能安全</td></tr>
<tr><td>動態範圍需求</td><td>60~80 dB（HDR 合成可達 100+ dB）</td><td>120~140 dB（需看清隧道口場景）</td></tr>
<tr><td>幀率要求</td><td>30 fps 預覽，拍照可延遲</td><td>30~60 fps 持續即時輸出</td></tr>
<tr><td>延遲容忍</td><td>100~300 ms 可接受</td><td>&lt; 30 ms（Frame-to-Display Latency）</td></tr>
<tr><td>工作溫度</td><td>0°C ~ 45°C</td><td>-40°C ~ 105°C（AEC-Q100）</td></tr>
<tr><td>使用壽命</td><td>2~3 年</td><td>10~15 年</td></tr>
<tr><td>多幀處理</td><td>廣泛使用（Night Mode 可合成 10+ 幀）</td><td>以單幀為主，部分用雙幀 HDR</td></tr>
<tr><td>AI/ML</td><td>大量使用（Scene Detection、AI NR、Bokeh）</td><td>有限使用，需可驗證性</td></tr>
<tr><td>ISP 輸出用途</td><td>人眼觀看為主</td><td>人眼觀看 + CV/DL 感知演算法</td></tr>
<tr><td>LED 防閃爍</td><td>非必要功能</td><td>必要功能（LED Traffic Light）</td></tr>
<tr><td>色彩 Tuning 策略</td><td>偏暖、飽和度高、膚色優化</td><td>色彩準確、避免過飽和</td></tr>
<tr><td>功能安全認證</td><td>不需要</td><td>需要（ISO 26262 ASIL-B/C/D）</td></tr>
</tbody>
</table>

<h4>車用 ISP 的特殊挑戰</h4>

<p><strong>1. 超高動態範圍（HDR）需求</strong>：車用場景中，一個典型的挑戰是隧道出入口 — 隧道內部可能只有 1 lux，而隧道出口的天空亮度可達 100,000 lux，動態範圍跨度超過 120 dB。車用感測器通常使用 Split-pixel HDR 或 Staggered HDR 技術，在單一幀內捕捉多個曝光，由 ISP 進行 HDR Merge。</p>

<p><strong>2. LED 防閃爍（LED Flicker Mitigation, LFM）</strong>：現代 LED 交通號誌和 LED 車尾燈使用 PWM 調光，在特定曝光時間下可能出現閃爍（Flicker）甚至完全不可見。車用 ISP 必須確保 LED 在任何曝光條件下都能被正確捕捉，這需要感測器和 ISP 的協同設計。</p>

<p><strong>3. 雙路輸出（Dual Output）</strong>：車用 ISP 通常需要同時輸出兩路影像 — 一路經過完整 ISP 處理供駕駛者在螢幕上觀看（Human Vision Path），另一路經過最小化處理（或特殊處理）供 ADAS/AD 感知演算法使用（Machine Vision Path）。這兩路的 Tuning 目標完全不同。</p>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>車用 ISP 的「美化」處理（如過度銳化、過飽和色彩）可能對下游的 CV 感知演算法（如物件偵測、語義分割）造成負面影響。ISP Tuning 時必須同時考慮人眼和機器視覺的需求，這是車用 ISP 工程師面臨的獨特挑戰。</p>
</div>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>車用 ISP 平台典型代表：TI TDA4（Jacinto 7）內建 VPAC（Vision Processing Accelerator Core）支援 RAW→YUV 的完整 ISP Pipeline，同時提供 DMPAC（Depth and Motion Perception）用於立體視覺。ISP 可配置雙路輸出，一路 H.264 壓縮供 DVR 錄影，一路 NV12 格式供 DNN 推理。</p>
</div>

<h4>ISP Tuning 策略差異</h4>

<p>在手機領域，ISP Tuning 的目標是讓使用者「哇，拍得真好看！」— 強調討喜的色彩（Pleasing Color）、自然的膚色、乾淨的夜景降噪。Tuning 工程師會花大量時間在人像模式、夜景模式等特殊場景的優化上。</p>

<p>在車用領域，ISP Tuning 的目標是讓駕駛者和演算法「看清楚場景中的一切」— 強調色彩保真（Color Fidelity）、高對比度目標（如行人、車輛）的可辨識度、極端光照下的穩定性。Tuning 工程師需要在各種天候條件（晴天、雨天、霧天、夜間、逆光）下反覆驗證。</p>`,
      keyPoints: [
        "手機 ISP 追求主觀視覺品質，車用 ISP 追求影像保真度與功能安全",
        "車用場景對 HDR、低延遲、LED 防閃爍有極嚴格要求",
        "車用 ISP 通常需要雙路輸出，同時服務人眼觀看和機器視覺感知"
      ]
    },
    {
      id: "ch1_5",
      title: "RAW 資料格式與 Bit Depth",
      content: `<h3>RAW 資料格式與 Bit Depth</h3>

<p>RAW Data 是影像感測器經過 ADC（類比數位轉換器）後直接輸出的數位資料，保留了感測器捕捉到的原始光學資訊，未經過任何 ISP 處理（如白平衡、Gamma、降噪等）。理解 RAW 資料的格式與 Bit Depth 是 ISP 工程師的基本功。</p>

<h4>Bit Depth 的意義</h4>

<p>Bit Depth（位元深度）決定了每個像素可以表示的灰度等級數量。N-bit 的 ADC 可以將類比訊號量化為 2^N 個離散等級。更高的 Bit Depth 意味著更精細的量化步階、更大的動態範圍、更豐富的色彩過渡。</p>

<div class="formula">量化等級數 = 2^N，其中 N 為 Bit Depth。8-bit = 256 級、10-bit = 1024 級、12-bit = 4096 級、14-bit = 16384 級</div>

<div class="diagram">
<svg viewBox="0 0 750 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:750px">
  <rect x="0" y="0" width="750" height="340" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="375" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">Bit Depth 與動態範圍比較</text>

  <!-- 8-bit bar -->
  <text x="30" y="72" font-size="11" fill="#5a5550" font-weight="bold">8-bit</text>
  <text x="30" y="86" font-size="9" fill="#8a8580">256 levels</text>
  <rect x="120" y="60" width="180" height="30" rx="4" fill="#8a8580" opacity="0.4"/>
  <text x="210" y="80" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">~48 dB</text>
  <text x="315" y="80" font-size="9" fill="#8a8580">JPEG 標準，消費級</text>

  <!-- 10-bit bar -->
  <text x="30" y="127" font-size="11" fill="#5a5550" font-weight="bold">10-bit</text>
  <text x="30" y="141" font-size="9" fill="#8a8580">1024 levels</text>
  <rect x="120" y="115" width="330" height="30" rx="4" fill="#6a8a7a" opacity="0.5"/>
  <text x="285" y="135" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">~60 dB</text>
  <text x="465" y="135" font-size="9" fill="#8a8580">手機主流 RAW 格式</text>

  <!-- 12-bit bar -->
  <text x="30" y="182" font-size="11" fill="#5a5550" font-weight="bold">12-bit</text>
  <text x="30" y="196" font-size="9" fill="#8a8580">4096 levels</text>
  <rect x="120" y="170" width="470" height="30" rx="4" fill="#6a8a7a" opacity="0.7"/>
  <text x="355" y="190" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">~72 dB</text>
  <text x="605" y="190" font-size="9" fill="#8a8580">車用 / 專業相機</text>

  <!-- 14-bit bar -->
  <text x="30" y="237" font-size="11" fill="#5a5550" font-weight="bold">14-bit</text>
  <text x="30" y="251" font-size="9" fill="#8a8580">16384 levels</text>
  <rect x="120" y="225" width="590" height="30" rx="4" fill="#6a8a7a" opacity="0.9"/>
  <text x="415" y="245" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">~84 dB</text>
  <text x="605" y="270" font-size="9" fill="#8a8580">高階 DSLR / Cinema</text>

  <!-- Scale -->
  <line x1="120" y1="285" x2="710" y2="285" stroke="#d5cec7" stroke-width="1"/>
  <text x="120" y="303" text-anchor="middle" font-size="9" fill="#8a8580">0 dB</text>
  <text x="415" y="303" text-anchor="middle" font-size="9" fill="#8a8580">Dynamic Range</text>
  <text x="710" y="303" text-anchor="middle" font-size="9" fill="#8a8580">84 dB</text>

  <!-- Note -->
  <text x="375" y="330" text-anchor="middle" font-size="9" fill="#8a8580">每增加 1-bit，動態範圍增加約 6 dB（量化等級加倍）</text>
</svg>
<div class="caption">圖 1-6：不同 Bit Depth 對應的量化等級與動態範圍比較 — 高 Bit Depth 提供更大的後處理空間</div>
</div>

<h4>常見 RAW 資料封裝格式</h4>

<p>RAW Data 的二進位資料需要特定的封裝格式（Packing Format）來儲存和傳輸。常見的格式包括：</p>

<table>
<thead>
<tr><th>格式名稱</th><th>說明</th><th>儲存效率</th><th>應用場景</th></tr>
</thead>
<tbody>
<tr><td>Unpacked (16-bit)</td><td>每個像素佔 16-bit（高位補零）</td><td>低（浪費 bit）</td><td>偵錯、PC 端處理</td></tr>
<tr><td>MIPI RAW10</td><td>每 4 個 10-bit 像素打包為 5 bytes</td><td>高</td><td>手機 MIPI CSI-2 傳輸</td></tr>
<tr><td>MIPI RAW12</td><td>每 2 個 12-bit 像素打包為 3 bytes</td><td>高</td><td>車用 MIPI CSI-2 傳輸</td></tr>
<tr><td>P010 / P012</td><td>16-bit 容器中儲存 10/12-bit 資料</td><td>中等</td><td>ISP 內部處理</td></tr>
<tr><td>Compressed RAW</td><td>壓縮格式（如 Samsung SRA、Apple ProRAW）</td><td>最高</td><td>手機拍照存儲</td></tr>
</tbody>
</table>

<div class="info-box example">
<div class="box-title">📝 範例</div>
<p>MIPI RAW10 Packing 格式：假設有 4 個連續像素值分別為 P0、P1、P2、P3（各 10-bit），封裝方式為：</p>
<pre>
Byte 0: P0[9:2]         (P0 的高 8 bits)
Byte 1: P1[9:2]         (P1 的高 8 bits)
Byte 2: P2[9:2]         (P2 的高 8 bits)
Byte 3: P3[9:2]         (P3 的高 8 bits)
Byte 4: P3[1:0] P2[1:0] P1[1:0] P0[1:0]  (4 個像素的低 2 bits)
</pre>
<p>4 個 10-bit 像素共使用 5 bytes = 40 bits，而 unpacked 需要 8 bytes = 64 bits，節省 37.5% 頻寬。</p>
</div>

<h4>Bit Depth 對 ISP 處理的影響</h4>

<p>ISP 內部的處理精度通常高於輸入的 Bit Depth，以避免因中間計算的截斷誤差（Truncation Error）而降低影像品質。例如，即使感測器輸出 10-bit RAW，ISP 內部可能使用 12-bit 或 14-bit 精度進行運算。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>更高的 Bit Depth 不僅意味著更大的動態範圍，還意味著更豐富的色彩層次和更大的後處理空間。在 ISP 的 Gamma 校正步驟中，低 Bit Depth 容易在暗部產生色帶現象（Banding），因為 Gamma 曲線會拉伸暗部的灰階。10-bit 以上的 RAW Data 可以有效避免這個問題。</p>
</div>

<h4>RAW 影像的基本屬性</h4>

<p>一個完整的 RAW 影像檔案除了像素資料外，通常還包含以下 Metadata（後設資料）：</p>

<table>
<thead>
<tr><th>Metadata</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>Image Width / Height</td><td>影像寬度和高度（像素數）</td></tr>
<tr><td>Bit Depth</td><td>位元深度（8/10/12/14）</td></tr>
<tr><td>Bayer Pattern</td><td>CFA 排列（RGGB/BGGR/GRBG/GBRG）</td></tr>
<tr><td>Black Level</td><td>感測器黑階值</td></tr>
<tr><td>White Level</td><td>感測器飽和值</td></tr>
<tr><td>Exposure Time</td><td>曝光時間</td></tr>
<tr><td>Analog Gain / Digital Gain</td><td>類比增益 / 數位增益</td></tr>
<tr><td>Color Temperature</td><td>AWB 估計的色溫</td></tr>
</tbody>
</table>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>在實際的 ISP 開發和偵錯中，工程師經常需要直接讀取和分析 RAW 檔案。常用的工具包括：RawTherapee、dcraw（開源 RAW 解碼器）、MATLAB/Python 腳本。掌握 RAW 資料的讀取和解析能力，是 ISP 工程師的必備技能。在 Python 中可以使用 <code>numpy.fromfile()</code> 搭配 <code>dtype</code> 參數來讀取 packed RAW 資料。</p>
</div>`,
      keyPoints: [
        "Bit Depth 決定量化精度，每增加 1-bit 動態範圍增加約 6 dB",
        "MIPI RAW10/RAW12 是手機和車用領域最常用的 RAW 封裝格式，兼顧傳輸效率與精度",
        "ISP 內部運算精度通常高於感測器輸出 Bit Depth，以避免中間計算的截斷誤差"
      ]
    },
    {
      id: "ch1_6",
      title: "3A 簡介（AE/AWB/AF 與 ISP 的關係）",
      content: `<h3>3A 簡介（AE/AWB/AF 與 ISP 的關係）</h3>

<p>3A 是指自動曝光（Auto Exposure, AE）、自動白平衡（Auto White Balance, AWB）和自動對焦（Auto Focus, AF）三大自動控制演算法的統稱。3A 與 ISP 之間形成一個閉迴路控制系統（Closed-loop Control System）：ISP 從影像中提取統計資訊（Statistics），3A 演算法根據這些統計資訊計算出控制參數，再回饋給感測器和 ISP Pipeline 進行調整。</p>

<div class="diagram">
<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <defs>
    <marker id="arrow3A" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#6a8a7a"/></marker>
    <marker id="arrow3A_r" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#e74c3c"/></marker>
  </defs>
  <rect x="0" y="0" width="800" height="400" rx="8" fill="#f5f0eb" stroke="#d5cec7"/>
  <text x="400" y="28" text-anchor="middle" font-size="14" fill="#5a5550" font-weight="bold">3A 回饋控制迴路與 ISP 的關係</text>

  <!-- Scene -->
  <rect x="30" y="70" width="90" height="60" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="75" y="97" text-anchor="middle" font-size="10" fill="#5a5550">場景</text>
  <text x="75" y="113" text-anchor="middle" font-size="8" fill="#8a8580">Scene</text>
  <line x1="125" y1="100" x2="165" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow3A)"/>

  <!-- Lens + Sensor -->
  <rect x="170" y="55" width="130" height="90" rx="6" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="235" y="82" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">Lens + Sensor</text>
  <text x="235" y="100" text-anchor="middle" font-size="9" fill="#8a8580">曝光控制</text>
  <text x="235" y="115" text-anchor="middle" font-size="9" fill="#8a8580">對焦馬達</text>
  <text x="235" y="130" text-anchor="middle" font-size="9" fill="#8a8580">Gain 控制</text>
  <line x1="305" y1="100" x2="355" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow3A)"/>

  <!-- ISP -->
  <rect x="360" y="50" width="160" height="100" rx="8" fill="#6a8a7a" stroke="#5a5550" stroke-width="2"/>
  <text x="440" y="82" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">ISP Pipeline</text>
  <text x="440" y="102" text-anchor="middle" font-size="9" fill="#f5f0eb">影像處理 + 統計收集</text>
  <text x="440" y="118" text-anchor="middle" font-size="9" fill="#f5f0eb">AE/AWB/AF Statistics</text>
  <line x1="525" y1="100" x2="575" y2="100" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow3A)"/>

  <!-- Output -->
  <rect x="580" y="70" width="90" height="60" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="625" y="97" text-anchor="middle" font-size="10" fill="#5a5550">輸出影像</text>
  <text x="625" y="113" text-anchor="middle" font-size="8" fill="#8a8580">Output</text>

  <!-- 3A Algorithm Block -->
  <rect x="250" y="230" width="300" height="130" rx="8" fill="#fff" stroke="#6a8a7a" stroke-width="2"/>
  <text x="400" y="258" text-anchor="middle" font-size="13" fill="#6a8a7a" font-weight="bold">3A 演算法引擎</text>

  <!-- AE -->
  <rect x="270" y="275" width="75" height="55" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="307" y="298" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">AE</text>
  <text x="307" y="315" text-anchor="middle" font-size="8" fill="#8a8580">自動曝光</text>

  <!-- AWB -->
  <rect x="362" y="275" width="75" height="55" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="400" y="298" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">AWB</text>
  <text x="400" y="315" text-anchor="middle" font-size="8" fill="#8a8580">自動白平衡</text>

  <!-- AF -->
  <rect x="455" y="275" width="75" height="55" rx="4" fill="#6a8a7a" opacity="0.15" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="492" y="298" text-anchor="middle" font-size="11" fill="#5a5550" font-weight="bold">AF</text>
  <text x="492" y="315" text-anchor="middle" font-size="8" fill="#8a8580">自動對焦</text>

  <!-- Stats arrow: ISP → 3A -->
  <path d="M 440 155 L 440 225" fill="none" stroke="#6a8a7a" stroke-width="2" marker-end="url(#arrow3A)"/>
  <text x="465" y="193" font-size="9" fill="#6a8a7a" font-weight="bold">統計資料</text>
  <text x="465" y="206" font-size="8" fill="#8a8580">Statistics</text>

  <!-- Feedback arrows: 3A → Sensor -->
  <path d="M 300 275 L 300 195 L 235 195 L 235 150" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow3A_r)"/>
  <text x="200" y="195" font-size="8" fill="#e74c3c">AE: Exposure/Gain</text>

  <path d="M 400 230 L 370 195 L 370 155" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow3A_r)"/>
  <text x="353" y="184" font-size="8" fill="#e74c3c">AWB: R/B Gain</text>

  <path d="M 492 275 L 492 195 L 220 195" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3" marker-end="url(#arrow3A_r)" opacity="0.6"/>
  <text x="520" y="210" font-size="8" fill="#e74c3c">AF: Lens Position</text>

  <!-- Legend -->
  <line x1="600" y1="370" x2="640" y2="370" stroke="#6a8a7a" stroke-width="2"/>
  <text x="648" y="374" font-size="9" fill="#5a5550">資料流</text>
  <line x1="600" y1="390" x2="640" y2="390" stroke="#e74c3c" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="648" y="394" font-size="9" fill="#5a5550">回饋控制</text>
</svg>
<div class="caption">圖 1-7：3A 回饋控制迴路 — ISP 提供統計資料給 3A 演算法，3A 將控制參數回饋給感測器和 ISP</div>
</div>

<h4>AE（Auto Exposure，自動曝光）</h4>

<p>AE 的目標是控制影像的整體亮度，使其處於合適的範圍。AE 演算法從 ISP 的統計模組中獲取每幀影像的亮度直方圖（Brightness Histogram）和區域亮度均值（Zone-based Average），然後計算目標曝光值（Target Exposure Value, Target EV）。</p>

<p>AE 控制的參數包括：曝光時間（Exposure Time / Shutter Speed）、類比增益（Analog Gain）和數位增益（Digital Gain）。三者的乘積決定了影像的總增益：</p>

<div class="formula">Total Gain = Exposure Time × Analog Gain × Digital Gain</div>

<p>AE 的增益分配策略（Gain Allocation Strategy）非常重要：優先使用曝光時間（不增加雜訊），其次類比增益（雜訊增加較少），最後才使用數位增益（直接放大雜訊）。在車用場景中，曝光時間還需要考慮 LED 閃爍的限制。</p>

<div class="info-box tip">
<div class="box-title">💡 提示</div>
<p>AE 收斂速度是用戶體驗的關鍵指標。手機相機通常要求 AE 在 5~10 幀（約 200~300ms）內收斂到目標亮度。收斂太慢會讓預覽畫面忽明忽暗，收斂太快則可能產生亮度震盪（Oscillation）。PID 控制器或查表法是常見的 AE 收斂演算法。</p>
</div>

<h4>AWB（Auto White Balance，自動白平衡）</h4>

<p>AWB 的目標是消除光源色溫（Color Temperature）對影像色彩的影響，使白色物體在影像中呈現為中性白色。不同色溫的光源（如日光 ~5500K、鎢絲燈 ~2700K、螢光燈 ~4000K）會導致影像偏藍或偏黃。</p>

<p>AWB 演算法從 ISP 統計中獲取 R/G 和 B/G 的比值分佈，在色溫空間中找到最可能的光源色溫，然後計算 R/G/B 三通道的增益係數（WB Gain）進行校正。常見的 AWB 演算法包括：Gray World（灰度世界假設）、White Patch（最亮點假設）、Planckian Locus（黑體軌跡）等。</p>

<h4>AF（Auto Focus，自動對焦）</h4>

<p>AF 的目標是驅動鏡頭馬達（VCM, Voice Coil Motor）到正確的位置，使被攝主體清晰對焦。AF 主要有兩種技術路線：</p>

<table>
<thead>
<tr><th>AF 類型</th><th>原理</th><th>優點</th><th>缺點</th></tr>
</thead>
<tbody>
<tr><td>Contrast AF (CDAF)</td><td>分析影像對比度，尋找最大銳度位置</td><td>成本低、無需特殊感測器</td><td>速度慢、需要搜尋過程</td></tr>
<tr><td>Phase Detection AF (PDAF)</td><td>透過相位差像素計算離焦量和方向</td><td>速度快、一次到位</td><td>需要特殊像素設計</td></tr>
<tr><td>Laser AF</td><td>紅外線 ToF 測距</td><td>暗場景下快速</td><td>距離有限（~2m）</td></tr>
<tr><td>Dual Pixel AF (DPAF)</td><td>每個像素分為兩半，自帶相位資訊</td><td>全像素覆蓋、精度高</td><td>像素設計複雜</td></tr>
</tbody>
</table>

<p>ISP 在 AF 中的角色是提供對焦統計資訊。對於 CDAF，ISP 計算指定 ROI（Region of Interest）區域的銳度值（Sharpness Score），通常使用高通濾波器（如 Sobel、Laplacian）的能量作為指標。對於 PDAF，ISP 解析 Phase Detection 像素的左右子像素資料，計算相位差（Phase Difference）。</p>

<div class="info-box key">
<div class="box-title">重點</div>
<p>3A 不是獨立運作的，三者之間存在交互影響：AE 改變曝光會影響 AWB 的色溫判斷；AF 的對焦狀態會影響 AE 的亮度統計（對焦模糊時對比度降低）；AWB 的增益調整會影響 AE 的亮度計算。因此，3A 演算法的設計需要考慮三者之間的協調，避免相互干擾導致系統不穩定。</p>
</div>

<h4>3A 統計硬體</h4>

<p>現代 ISP 通常內建專用的 3A 統計收集硬體（Statistics Engine），它可以在 Pipeline 處理過程中同步收集以下統計資訊：</p>

<table>
<thead>
<tr><th>統計類型</th><th>用途</th><th>典型配置</th></tr>
</thead>
<tbody>
<tr><td>AE Statistics</td><td>亮度直方圖、區域均值</td><td>32×32 或 64×64 個統計區域</td></tr>
<tr><td>AWB Statistics</td><td>R/G/B 通道均值、色度分佈</td><td>帶白點篩選條件的統計</td></tr>
<tr><td>AF Statistics</td><td>銳度值、FIR/IIR 濾波器輸出</td><td>可配置多個 ROI</td></tr>
<tr><td>AE Histogram</td><td>全域或區域亮度直方圖</td><td>256 bins（8-bit 量化後）</td></tr>
</tbody>
</table>

<div class="info-box warn">
<div class="box-title">⚠️ 注意</div>
<p>3A 統計的收集位置（Pipeline 中的哪個節點）會影響統計結果的品質。例如，AE 統計通常在 BLC 之後、Gamma 之前的線性域收集，這樣才能準確反映真實的光照亮度。AWB 統計則需要在 BLC 和 LSC 校正之後收集，否則 Lens Shading 造成的邊緣偏色會干擾色溫估計。</p>
</div>`,
      keyPoints: [
        "3A（AE/AWB/AF）與 ISP 形成閉迴路控制系統，ISP 提供統計，3A 提供控制參數",
        "AE 控制曝光時間、類比增益和數位增益，優先使用雜訊最小的控制方式",
        "3A 之間存在交互影響，需要協調設計以避免系統不穩定"
      ]
    }
  ]
};

