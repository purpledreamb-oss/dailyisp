const CH8 = {
  title: "進階主題與實戰",
  sections: [
    {
      id: "ch8_1",
      title: "ISP Pipeline 整體調適",
      content: `
<h3>全局觀：Pipeline 是一個系統</h3>
<p>ISP Pipeline 中的每一個模組都不是獨立存在的 — 它們彼此之間有著緊密的<strong>交互影響</strong>。BLC 的精確度影響 LSC 的計算；Demosaic 的品質影響後續 NR 和銳化的效果；Gamma/Tone Curve 的形狀影響 NR 在不同亮度下的行為。</p>

<p>因此，ISP Tuning 不能只是「逐模組獨立調好」，而是需要以<strong>系統觀</strong>來理解和優化整個 Pipeline。</p>

<div class="diagram"><svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="400" fill="#f5f0eb" rx="8"/>
  <text x="350" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">ISP Pipeline 整體調適 — 模組間交互影響</text>
  <defs>
    <marker id="arrowPL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
    <marker id="arrowR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#c4a064"/></marker>
  </defs>
  <!-- Pipeline blocks -->
  <rect x="15" y="45" width="70" height="40" rx="5" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="50" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">BLC</text>
  <text x="50" y="76" fill="#8a8580" font-size="7" text-anchor="middle">黑電平</text>
  <line x1="85" y1="65" x2="100" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="103" y="45" width="70" height="40" rx="5" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="138" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">DPC</text>
  <text x="138" y="76" fill="#8a8580" font-size="7" text-anchor="middle">壞點校正</text>
  <line x1="173" y1="65" x2="188" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="191" y="45" width="70" height="40" rx="5" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="226" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">LSC</text>
  <text x="226" y="76" fill="#8a8580" font-size="7" text-anchor="middle">鏡頭校正</text>
  <line x1="261" y1="65" x2="276" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="279" y="45" width="70" height="40" rx="5" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="314" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">AWB</text>
  <text x="314" y="76" fill="#8a8580" font-size="7" text-anchor="middle">白平衡</text>
  <line x1="349" y1="65" x2="364" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="367" y="45" width="75" height="40" rx="5" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="404" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">Demosaic</text>
  <text x="404" y="76" fill="#8a8580" font-size="7" text-anchor="middle">去馬賽克</text>
  <line x1="442" y1="65" x2="457" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="460" y="45" width="70" height="40" rx="5" fill="rgba(100,140,180,0.15)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="495" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">CCM</text>
  <text x="495" y="76" fill="#8a8580" font-size="7" text-anchor="middle">色彩校正</text>
  <line x1="530" y1="65" x2="545" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="548" y="45" width="70" height="40" rx="5" fill="rgba(100,140,180,0.15)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="583" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">Gamma</text>
  <text x="583" y="76" fill="#8a8580" font-size="7" text-anchor="middle">伽馬曲線</text>
  <line x1="618" y1="65" x2="633" y2="65" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="636" y="45" width="55" height="40" rx="5" fill="rgba(160,130,180,0.15)" stroke="#a082b4" stroke-width="1.5"/>
  <text x="663" y="63" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">NR</text>
  <text x="663" y="76" fill="#8a8580" font-size="7" text-anchor="middle">降噪</text>
  <!-- Second row continuation -->
  <line x1="663" y1="85" x2="663" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="636" y="108" width="55" height="40" rx="5" fill="rgba(160,130,180,0.15)" stroke="#a082b4" stroke-width="1.5"/>
  <text x="663" y="126" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">Sharp</text>
  <text x="663" y="139" fill="#8a8580" font-size="7" text-anchor="middle">銳化</text>
  <line x1="636" y1="128" x2="620" y2="128" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="548" y="108" width="70" height="40" rx="5" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="583" y="126" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">Tone Map</text>
  <text x="583" y="139" fill="#8a8580" font-size="7" text-anchor="middle">色調映射</text>
  <line x1="548" y1="128" x2="530" y2="128" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowPL)"/>
  <rect x="460" y="108" width="70" height="40" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="495" y="126" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">Output</text>
  <text x="495" y="139" fill="#8a8580" font-size="7" text-anchor="middle">YUV/RGB</text>
  <!-- Interaction arrows (cross-module) -->
  <path d="M50,85 Q50,175 225,175 L225,85" fill="none" stroke="#c4a064" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrowR)"/>
  <text x="137" y="185" fill="#c4a064" font-size="8" text-anchor="middle">BLC 精度影響 LSC</text>
  <path d="M583,85 Q583,170 663,170 L663,108" fill="none" stroke="#c4a064" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrowR)"/>
  <text x="630" y="180" fill="#c4a064" font-size="8" text-anchor="middle">Gamma 影響 NR 行為</text>
  <path d="M404,85 Q404,200 660,200 L660,148" fill="none" stroke="#c4a064" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrowR)"/>
  <text x="530" y="210" fill="#c4a064" font-size="8" text-anchor="middle">Demosaic 品質影響銳化效果</text>
  <!-- Tuning parameter areas -->
  <text x="350" y="242" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">各模組關鍵調適參數</text>
  <rect x="20" y="255" width="200" height="130" rx="6" fill="rgba(106,138,122,0.05)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="120" y="273" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">前端（RAW 域）</text>
  <text x="120" y="290" fill="#5a5550" font-size="9" text-anchor="middle">• BLC: per-channel offset</text>
  <text x="120" y="305" fill="#5a5550" font-size="9" text-anchor="middle">• LSC: radial gain table</text>
  <text x="120" y="320" fill="#5a5550" font-size="9" text-anchor="middle">• DPC: threshold, method</text>
  <text x="120" y="335" fill="#5a5550" font-size="9" text-anchor="middle">• RAW NR: per-ISO strength</text>
  <text x="120" y="350" fill="#5a5550" font-size="9" text-anchor="middle">• HDR merge: weight curve</text>
  <rect x="240" y="255" width="200" height="130" rx="6" fill="rgba(196,160,100,0.05)" stroke="#c4a064" stroke-width="1"/>
  <text x="340" y="273" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">中段（色彩域）</text>
  <text x="340" y="290" fill="#5a5550" font-size="9" text-anchor="middle">• AWB: grey-world / model</text>
  <text x="340" y="305" fill="#5a5550" font-size="9" text-anchor="middle">• CCM: 3×3 matrix per illum.</text>
  <text x="340" y="320" fill="#5a5550" font-size="9" text-anchor="middle">• Gamma: curve points (LUT)</text>
  <text x="340" y="335" fill="#5a5550" font-size="9" text-anchor="middle">• Saturation: per-hue gain</text>
  <text x="340" y="350" fill="#5a5550" font-size="9" text-anchor="middle">• Tone curve: S-curve shape</text>
  <rect x="460" y="255" width="220" height="130" rx="6" fill="rgba(160,130,180,0.05)" stroke="#a082b4" stroke-width="1"/>
  <text x="570" y="273" fill="#a082b4" font-size="10" text-anchor="middle" font-weight="500">後端（增強域）</text>
  <text x="570" y="290" fill="#5a5550" font-size="9" text-anchor="middle">• NR: spatial/temporal strength</text>
  <text x="570" y="305" fill="#5a5550" font-size="9" text-anchor="middle">• Sharp: Amount, Radius, Coring</text>
  <text x="570" y="320" fill="#5a5550" font-size="9" text-anchor="middle">• LTM: local contrast, clip limit</text>
  <text x="570" y="335" fill="#5a5550" font-size="9" text-anchor="middle">• Edge enhance: per-region</text>
  <text x="570" y="350" fill="#5a5550" font-size="9" text-anchor="middle">• Chroma NR: UV filtering</text>
</svg><div class="caption">圖 8-1：ISP Pipeline 整體 — 模組間交互影響與各模組關鍵調適參數</div></div>

<h3>模組間的關鍵交互影響</h3>
<table>
  <tr><th>上游模組</th><th>下游影響</th><th>說明</th></tr>
  <tr><td>BLC</td><td>LSC、NR、所有後續</td><td>BLC 不準確會導致暗區偏色和噪聲估計偏差</td></tr>
  <tr><td>LSC</td><td>AWB、CCM</td><td>LSC 不足會導致畫面周邊色偏，AWB 對中心和四角計算不一致</td></tr>
  <tr><td>Demosaic</td><td>NR、Sharpening</td><td>Demosaic 產生的 Zipper artifact 會被銳化放大</td></tr>
  <tr><td>Gamma</td><td>NR、Sharpening</td><td>Gamma 後暗區被拉伸，NR 需在暗區更強；銳化的 Coring 閾值也要調整</td></tr>
  <tr><td>NR</td><td>Sharpening</td><td>NR 過強 → 紋理被抹除 → 銳化無法恢復</td></tr>
  <tr><td>Tone Map</td><td>色彩飽和度、噪聲</td><td>LTM 改變局部對比度，影響色彩表現和暗區噪聲可見度</td></tr>
</table>

<h3>整體調適策略</h3>
<ol>
  <li><strong>建立 Baseline</strong>：先用保守的默認參數跑通整個 Pipeline，確保基本正確</li>
  <li><strong>前端優先</strong>：先校準 BLC、DPC、LSC，確保 RAW 數據的乾淨和均勻</li>
  <li><strong>色彩管線</strong>：接著調 AWB 和 CCM，在 D65/TL84/A 三個光源下達到可接受的 ΔE</li>
  <li><strong>Tone/Gamma</strong>：確定 Gamma 曲線和 Tone Mapping 策略，這會固定後續 NR/銳化的工作空間</li>
  <li><strong>NR + Sharpening 聯合</strong>：在每個 ISO 下同時調適 NR 和銳化，找到最佳平衡</li>
  <li><strong>交叉驗證</strong>：改完後段回去檢查前段的效果是否受影響</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  ISP Pipeline 調適的核心是理解模組間的<strong>因果鏈</strong>。改動任何一個模組都要思考：「這個改動會如何影響下游模組？」以及「下游模組現在的參數還合適嗎？」。好的 Tuning 工程師腦中有一張完整的交互影響圖。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議在每個 Phase 調適完成後，拍攝一組標準場景並記錄所有 IQ 指標（SNR、MTF、ΔE 等）。這樣當後續調適導致某項指標退步時，可以快速定位是哪個 Phase 的改動造成的。
</div>
`,
      keyPoints: [
        "ISP 各模組有緊密的交互影響，需以系統觀來優化",
        "BLC → LSC → AWB/CCM → Gamma → NR → Sharp 的因果鏈",
        "調適順序：前端校準 → 色彩 → Tone → NR+Sharp → 交叉驗證",
        "改動任何模組都要考慮對下游的影響",
        "每個 Phase 完成後記錄標準場景的 IQ 指標用於追蹤"
      ]
    },
    {
      id: "ch8_2",
      title: "手機多鏡頭系統",
      content: `
<h3>多鏡頭的演進</h3>
<p>現代智慧手機已從單鏡頭演進到<strong>多鏡頭系統（Multi-camera System）</strong>。典型的旗艦手機配備 3-4 顆相機模組，涵蓋不同的焦段和功能。多鏡頭系統帶來了超越單一模組物理極限的影像能力，但也引入了全新的 ISP 挑戰。</p>

<div class="diagram"><svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="380" fill="#f5f0eb" rx="8"/>
  <text x="350" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">手機多鏡頭系統架構</text>
  <defs><marker id="arrowMC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Phone body outline -->
  <rect x="20" y="40" width="200" height="330" rx="20" fill="#fff" stroke="#d5cec7" stroke-width="2"/>
  <!-- Camera module area -->
  <rect x="40" y="60" width="160" height="240" rx="12" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <!-- Ultra-wide -->
  <circle cx="85" cy="100" r="28" fill="rgba(100,140,180,0.15)" stroke="#648cb4" stroke-width="2"/>
  <circle cx="85" cy="100" r="16" fill="rgba(100,140,180,0.1)" stroke="#648cb4" stroke-width="1"/>
  <text x="85" y="103" fill="#648cb4" font-size="8" text-anchor="middle" font-weight="bold">UW</text>
  <text x="85" y="140" fill="#648cb4" font-size="8" text-anchor="middle">0.6x 超廣角</text>
  <text x="85" y="152" fill="#8a8580" font-size="7" text-anchor="middle">12MP f/2.2</text>
  <!-- Main -->
  <circle cx="155" cy="100" r="32" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="2.5"/>
  <circle cx="155" cy="100" r="20" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="155" y="103" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="bold">Main</text>
  <text x="155" y="144" fill="#6a8a7a" font-size="8" text-anchor="middle">1x 主鏡頭</text>
  <text x="155" y="156" fill="#8a8580" font-size="7" text-anchor="middle">50MP f/1.8</text>
  <!-- Tele 3x -->
  <circle cx="85" cy="210" r="25" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="2"/>
  <circle cx="85" cy="210" r="14" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="85" y="213" fill="#c4a064" font-size="8" text-anchor="middle" font-weight="bold">Tele</text>
  <text x="85" y="246" fill="#c4a064" font-size="8" text-anchor="middle">3x 長焦</text>
  <text x="85" y="258" fill="#8a8580" font-size="7" text-anchor="middle">12MP f/2.4</text>
  <!-- Tele 5x / Periscope -->
  <circle cx="155" cy="210" r="25" fill="rgba(160,130,180,0.15)" stroke="#a082b4" stroke-width="2"/>
  <circle cx="155" cy="210" r="14" fill="rgba(160,130,180,0.08)" stroke="#a082b4" stroke-width="1"/>
  <text x="155" y="213" fill="#a082b4" font-size="8" text-anchor="middle" font-weight="bold">Peri</text>
  <text x="155" y="246" fill="#a082b4" font-size="8" text-anchor="middle">5x 潛望式</text>
  <text x="155" y="258" fill="#8a8580" font-size="7" text-anchor="middle">12MP f/3.4</text>
  <!-- FOV illustration -->
  <text x="120" y="292" fill="#8a8580" font-size="8" text-anchor="middle">ToF / LiDAR（選配）</text>
  <!-- Processing pipeline (right side) -->
  <line x1="220" y1="100" x2="260" y2="100" stroke="#6a8a7a" stroke-width="1.2" marker-end="url(#arrowMC)"/>
  <line x1="220" y1="100" x2="260" y2="160" stroke="#648cb4" stroke-width="1" stroke-dasharray="3" marker-end="url(#arrowMC)"/>
  <line x1="220" y1="210" x2="260" y2="220" stroke="#c4a064" stroke-width="1" marker-end="url(#arrowMC)"/>
  <line x1="220" y1="210" x2="260" y2="280" stroke="#a082b4" stroke-width="1" marker-end="url(#arrowMC)"/>
  <!-- Per-camera ISP -->
  <rect x="265" y="75" width="120" height="40" rx="5" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="325" y="93" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">ISP Pipeline (Main)</text>
  <text x="325" y="107" fill="#8a8580" font-size="8" text-anchor="middle">Per-lens 校準參數</text>
  <rect x="265" y="140" width="120" height="35" rx="5" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1"/>
  <text x="325" y="158" fill="#648cb4" font-size="9" text-anchor="middle">ISP Pipeline (UW)</text>
  <text x="325" y="170" fill="#8a8580" font-size="8" text-anchor="middle">畸變校正更強</text>
  <rect x="265" y="200" width="120" height="35" rx="5" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="325" y="218" fill="#c4a064" font-size="9" text-anchor="middle">ISP Pipeline (3x)</text>
  <text x="325" y="230" fill="#8a8580" font-size="8" text-anchor="middle">銳化需求高</text>
  <rect x="265" y="260" width="120" height="35" rx="5" fill="rgba(160,130,180,0.08)" stroke="#a082b4" stroke-width="1"/>
  <text x="325" y="278" fill="#a082b4" font-size="9" text-anchor="middle">ISP Pipeline (5x)</text>
  <text x="325" y="290" fill="#8a8580" font-size="8" text-anchor="middle">NR 更強</text>
  <!-- Multi-cam fusion -->
  <line x1="385" y1="95" x2="430" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowMC)"/>
  <line x1="385" y1="157" x2="430" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowMC)"/>
  <line x1="385" y1="217" x2="430" y2="190" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowMC)"/>
  <line x1="385" y1="277" x2="430" y2="200" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowMC)"/>
  <rect x="435" y="150" width="130" height="65" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="500" y="172" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Multi-cam Fusion</text>
  <text x="500" y="188" fill="#5a5550" font-size="9" text-anchor="middle">Depth / Bokeh / Zoom</text>
  <text x="500" y="202" fill="#5a5550" font-size="9" text-anchor="middle">色彩一致性對齊</text>
  <!-- Output -->
  <line x1="565" y1="183" x2="600" y2="183" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowMC)"/>
  <rect x="605" y="160" width="75" height="45" rx="6" fill="#6a8a7a" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="642" y="180" fill="#fff" font-size="10" text-anchor="middle" font-weight="500">Final</text>
  <text x="642" y="195" fill="rgba(255,255,255,0.8)" font-size="8" text-anchor="middle">Output</text>
  <!-- Key challenges -->
  <rect x="420" y="240" width="260" height="120" rx="6" fill="rgba(196,160,100,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="550" y="258" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">多鏡頭關鍵挑戰</text>
  <text x="440" y="278" fill="#5a5550" font-size="9">• 鏡頭切換時的色彩/亮度一致性</text>
  <text x="440" y="296" fill="#5a5550" font-size="9">• Digital Zoom 的品質保持</text>
  <text x="440" y="314" fill="#5a5550" font-size="9">• Depth Map 精度與 Bokeh 自然度</text>
  <text x="440" y="332" fill="#5a5550" font-size="9">• 多 ISP 同時處理的功耗管理</text>
  <text x="440" y="350" fill="#5a5550" font-size="9">• 多 Sensor 校準的產線效率</text>
</svg><div class="caption">圖 8-2：手機多鏡頭系統架構 — 從各模組 ISP 到 Multi-cam Fusion</div></div>

<h3>核心挑戰：色彩一致性</h3>
<p>當用戶在不同焦段之間切換（例如從 1x 到 3x），如果兩個鏡頭的色彩表現不一致（色溫不同、飽和度不同、亮度不同），會造成非常差的用戶體驗。</p>
<p>色彩一致性需要：</p>
<ul>
  <li>各鏡頭獨立的 CCM 校準，但目標色彩空間統一</li>
  <li>AWB 算法在多鏡頭間共享參考信息</li>
  <li>Gamma/Tone Curve 的一致性調整</li>
  <li>切換過程中的平滑過渡（Cross-fade）</li>
</ul>

<h3>Digital Zoom 品質</h3>
<p>在焦段之間（例如 1x~3x），手機使用 Digital Zoom。數位放大的品質取決於：</p>
<ul>
  <li><strong>主 Sensor 解析度</strong>：50MP 裁切到 12MP 等效約 2x 光學放大</li>
  <li><strong>Super Resolution</strong>：AI 模型從低解析度重建高解析度細節</li>
  <li><strong>Multi-frame Fusion</strong>：利用多幀拍攝合成更高解析度的結果</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  多鏡頭手機的 IQ Tuning 工作量不是「鏡頭數 × 單鏡頭工作量」那麼簡單 — 除了每顆鏡頭的獨立調適，還有鏡頭間一致性、切換過渡、融合算法等額外維度。一台三鏡頭手機的 IQ Tuning 工作量可能是單鏡頭的 5-8 倍。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在多鏡頭色彩一致性調適中，建議先選定一顆「參考鏡頭」（通常是主鏡頭），將其 IQ 調到最佳狀態。然後以它為基準，調整其他鏡頭的 CCM、Gamma 和 Saturation，使它們在標準場景下的輸出盡可能接近參考鏡頭。
</div>
`,
      keyPoints: [
        "現代旗艦手機配備 3-4 顆鏡頭覆蓋不同焦段",
        "每顆鏡頭需要獨立的 ISP 參數，但色彩需保持一致",
        "鏡頭切換的色彩/亮度一致性是最核心的用戶體驗挑戰",
        "Digital Zoom 依賴高 Sensor 解析度、Super Resolution 和 Multi-frame Fusion",
        "多鏡頭 IQ Tuning 工作量可能是單鏡頭的 5-8 倍"
      ]
    },
    {
      id: "ch8_3",
      title: "車用相機特殊需求",
      content: `
<h3>LED Flicker 問題</h3>
<p>LED 交通號誌和 LED 車燈以<strong>PWM（Pulse Width Modulation）</strong>方式驅動，頻率通常在 60Hz~2kHz 之間。在使用<strong>Rolling Shutter</strong> 的 Sensor 拍攝時，由於每一行像素的曝光時機不同，可能出現：</p>
<ul>
  <li><strong>部分暗帶</strong>：LED 在某些行曝光期間處於關閉狀態，形成暗色條紋</li>
  <li><strong>完全不可見</strong>：如果曝光時間恰好是 LED 關閉期的整數倍，LED 可能完全不亮</li>
  <li><strong>Color Shift</strong>：RGB LED 的各色可能有不同的 PWM 時序，導致色彩偏移</li>
</ul>

<div class="diagram"><svg viewBox="0 0 650 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="340" fill="#f5f0eb" rx="8"/>
  <text x="325" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">LED Flicker 時序與 Rolling Shutter 交互</text>
  <!-- Time axis -->
  <line x1="60" y1="300" x2="620" y2="300" stroke="#5a5550" stroke-width="1.2"/>
  <text x="340" y="320" fill="#8a8580" font-size="11" text-anchor="middle">時間 →</text>
  <!-- LED PWM signal -->
  <text x="40" y="68" fill="#c4a064" font-size="10" text-anchor="end">LED</text>
  <text x="40" y="82" fill="#8a8580" font-size="8" text-anchor="end">PWM</text>
  <!-- PWM pulses -->
  <path d="M70,90 L70,55 L140,55 L140,90 L210,90 L210,55 L280,55 L280,90 L350,90 L350,55 L420,55 L420,90 L490,90 L490,55 L560,55 L560,90 L610,90" fill="none" stroke="#c4a064" stroke-width="2"/>
  <text x="105" y="50" fill="#c4a064" font-size="8" text-anchor="middle">ON</text>
  <text x="175" y="100" fill="#8a8580" font-size="8" text-anchor="middle">OFF</text>
  <!-- Rolling shutter exposure rows -->
  <text x="40" y="140" fill="#6a8a7a" font-size="10" text-anchor="end">Row 1</text>
  <rect x="80" y="125" width="180" height="15" rx="2" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="170" y="137" fill="#6a8a7a" font-size="8" text-anchor="middle">曝光期</text>
  <text x="40" y="165" fill="#6a8a7a" font-size="10" text-anchor="end">Row N/4</text>
  <rect x="120" y="152" width="180" height="15" rx="2" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="40" y="190" fill="#6a8a7a" font-size="10" text-anchor="end">Row N/2</text>
  <rect x="160" y="177" width="180" height="15" rx="2" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="40" y="215" fill="#6a8a7a" font-size="10" text-anchor="end">Row 3N/4</text>
  <rect x="200" y="202" width="180" height="15" rx="2" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="40" y="240" fill="#6a8a7a" font-size="10" text-anchor="end">Row N</text>
  <rect x="240" y="227" width="180" height="15" rx="2" fill="rgba(106,138,122,0.3)" stroke="#6a8a7a" stroke-width="1"/>
  <!-- Flicker effect illustration -->
  <rect x="490" y="120" width="80" height="130" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="530" y="115" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">拍攝結果</text>
  <!-- Bright/dark bands -->
  <rect x="495" y="125" width="70" height="20" fill="#6a8a7a" opacity="0.7"/>
  <rect x="495" y="145" width="70" height="20" fill="#ddd"/>
  <rect x="495" y="165" width="70" height="20" fill="#6a8a7a" opacity="0.7"/>
  <rect x="495" y="185" width="70" height="20" fill="#ddd"/>
  <rect x="495" y="205" width="70" height="20" fill="#6a8a7a" opacity="0.7"/>
  <rect x="495" y="225" width="70" height="20" fill="#ddd"/>
  <text x="530" y="263" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">明暗條紋！</text>
  <!-- HDR solution area -->
  <rect x="60" y="268" width="420" height="28" rx="5" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="270" y="287" fill="#6a8a7a" font-size="10" text-anchor="middle">解法：曝光時間 = LED 週期整數倍 | 多曝光取得完整週期 | Chopping 技術</text>
</svg><div class="caption">圖 8-3：LED PWM 信號與 Rolling Shutter 曝光的時序交互 — 產生明暗條紋</div></div>

<h3>LED Flicker Mitigation 方法</h3>
<table>
  <tr><th>方法</th><th>原理</th><th>優缺點</th></tr>
  <tr><td>曝光時間控制</td><td>將曝光時間設為 LED 週期的整數倍</td><td>簡單有效但限制了曝光靈活性</td></tr>
  <tr><td>多曝光合成</td><td>長短曝光各取所需再合成</td><td>可同時解決 HDR，但需更多帶寬</td></tr>
  <tr><td>Chopping / Sub-frame</td><td>將一次曝光分成多個短曝光段</td><td>Sensor 硬體支援需求</td></tr>
  <tr><td>軟體後處理</td><td>偵測條紋位置並修復</td><td>修復品質有限，不可靠</td></tr>
</table>

<h3>車用 HDR 場景</h3>
<p>車用 HDR 的需求比消費相機更嚴格：</p>
<ul>
  <li><strong>動態範圍需求 > 120dB</strong>：隧道口的暗區到亮區跨度可達 120-140dB</li>
  <li><strong>無鬼影</strong>：多幀合成的 Motion Artifact 在車用場景中不可接受（可能影響物體偵測）</li>
  <li><strong>低延遲</strong>：ADAS 需要即時處理，不能等待多幀合成的延遲</li>
</ul>
<p>因此，車用 Sensor 多採用<strong>Single-frame HDR</strong>技術：</p>
<ul>
  <li><strong>Split-pixel</strong>：將像素分為大小不同的子像素，同時曝光但靈敏度不同</li>
  <li><strong>DCG（Dual Conversion Gain）</strong>：同一像素以高低兩種增益讀出</li>
  <li><strong>Staggered HDR</strong>：極短間隔的多次曝光（< 1ms），減少 Motion Artifact</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  車用相機的 LED Flicker 和 HDR 需求直接關係到行車安全。LED 紅綠燈無法被正確拍攝 = ADAS 可能做出錯誤判斷。這不是「畫面好不好看」的問題，而是「會不會造成事故」的問題。車用 ISP 的設計必須將 Flicker-free 和 Artifact-free HDR 作為最高優先級。
</div>

<h3>其他車用特殊需求</h3>
<ul>
  <li><strong>紅外截止濾波器（IR Cut Filter）的選擇</strong>：車用可能需要特殊的 IR 響應來適應不同光源</li>
  <li><strong>EMC（電磁兼容性）</strong>：車用環境電磁干擾強烈，ISP 需要抗干擾設計</li>
  <li><strong>功能安全（Functional Safety / ISO 26262）</strong>：ISP 需要有自我診斷和故障安全機制</li>
</ul>

<div class="info-box warn">
  <div class="box-title">⚠️ 安全等級</div>
  車用相機系統通常需要達到 ISO 26262 的 ASIL B 或 ASIL C 安全等級。這意味著 ISP 不只要「處理正確」，還需要能「偵測自己的故障」（如 Sensor 斷線、ISP 輸出異常）並在故障時觸發安全回退機制。
</div>
`,
      keyPoints: [
        "LED Flicker 是車用相機的安全攸關問題 — PWM 與 Rolling Shutter 交互產生條紋",
        "解法包括曝光時間控制、多曝光合成、Chopping 技術",
        "車用 HDR 需 >120dB 且不能有鬼影，多用 Single-frame HDR（Split-pixel、DCG）",
        "車用 ISP 需符合 ISO 26262 功能安全標準",
        "LED Flicker-free 和 Artifact-free HDR 是最高優先級"
      ]
    },
    {
      id: "ch8_4",
      title: "AI-ISP 人工智慧 ISP",
      content: `
<h3>AI 如何改變 ISP？</h3>
<p>傳統 ISP 是由人工設計的模組化管線（Pipeline），每個模組有明確的數學模型和可調參數。而 <strong>AI-ISP（Neural ISP）</strong>的革命性在於：讓神經網路<strong>直接從 RAW 數據學習到最終影像的映射</strong>，取代部分或全部的手動設計模組。</p>

<p>AI 在 ISP 中的應用可分為三個層次：</p>
<ol>
  <li><strong>模組增強</strong>：用 AI 增強某個特定模組（如 AI 降噪、AI 超解析度）</li>
  <li><strong>模組替換</strong>：用神經網路替換某個模組（如用 CNN 做 Demosaic）</li>
  <li><strong>端到端學習</strong>：整個 RAW → RGB 映射由一個大型網路完成</li>
</ol>

<div class="diagram"><svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="360" fill="#f5f0eb" rx="8"/>
  <text x="350" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">AI-ISP 架構 — 從模組增強到端到端學習</text>
  <defs><marker id="arrowAI" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Level 1: Module Enhancement -->
  <text x="60" y="52" fill="#648cb4" font-size="11" font-weight="500">Level 1：模組增強</text>
  <rect x="60" y="58" width="580" height="45" rx="6" fill="rgba(100,140,180,0.05)" stroke="#648cb4" stroke-width="1"/>
  <rect x="75" y="66" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="102" y="84" fill="#5a5550" font-size="8" text-anchor="middle">BLC</text>
  <rect x="140" y="66" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="167" y="84" fill="#5a5550" font-size="8" text-anchor="middle">Demosaic</text>
  <rect x="205" y="66" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="232" y="84" fill="#5a5550" font-size="8" text-anchor="middle">AWB</text>
  <rect x="270" y="66" width="55" height="28" rx="4" fill="rgba(100,140,180,0.2)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="297" y="81" fill="#648cb4" font-size="8" text-anchor="middle" font-weight="500">AI NR</text>
  <rect x="335" y="66" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="362" y="84" fill="#5a5550" font-size="8" text-anchor="middle">CCM</text>
  <rect x="400" y="66" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="427" y="84" fill="#5a5550" font-size="8" text-anchor="middle">Gamma</text>
  <rect x="465" y="66" width="75" height="28" rx="4" fill="rgba(100,140,180,0.2)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="502" y="81" fill="#648cb4" font-size="8" text-anchor="middle" font-weight="500">AI Super-Res</text>
  <rect x="550" y="66" width="75" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="587" y="84" fill="#5a5550" font-size="8" text-anchor="middle">Sharp</text>
  <!-- Level 2: Module Replacement -->
  <text x="60" y="128" fill="#c4a064" font-size="11" font-weight="500">Level 2：模組替換</text>
  <rect x="60" y="134" width="580" height="45" rx="6" fill="rgba(196,160,100,0.05)" stroke="#c4a064" stroke-width="1"/>
  <rect x="75" y="142" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="102" y="160" fill="#5a5550" font-size="8" text-anchor="middle">BLC</text>
  <rect x="140" y="142" width="120" height="28" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="200" y="157" fill="#c4a064" font-size="8" text-anchor="middle" font-weight="500">CNN Demosaic+NR</text>
  <rect x="270" y="142" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="297" y="160" fill="#5a5550" font-size="8" text-anchor="middle">AWB</text>
  <rect x="335" y="142" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="362" y="160" fill="#5a5550" font-size="8" text-anchor="middle">CCM</text>
  <rect x="400" y="142" width="55" height="28" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="427" y="160" fill="#5a5550" font-size="8" text-anchor="middle">Gamma</text>
  <rect x="465" y="142" width="155" height="28" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="542" y="157" fill="#c4a064" font-size="8" text-anchor="middle" font-weight="500">AI Detail Enhancement</text>
  <!-- Level 3: End-to-End -->
  <text x="60" y="205" fill="#6a8a7a" font-size="11" font-weight="500">Level 3：端到端學習</text>
  <rect x="60" y="211" width="580" height="50" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <!-- RAW input -->
  <rect x="75" y="218" width="60" height="35" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="105" y="234" fill="#5a5550" font-size="9" text-anchor="middle">RAW</text>
  <text x="105" y="247" fill="#8a8580" font-size="7" text-anchor="middle">Bayer</text>
  <line x1="135" y1="236" x2="160" y2="236" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowAI)"/>
  <!-- Big neural network -->
  <rect x="165" y="218" width="370" height="35" rx="6" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="2"/>
  <text x="350" y="233" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="600">End-to-End Neural Network</text>
  <text x="350" y="248" fill="#5a5550" font-size="9" text-anchor="middle">U-Net / Transformer / Custom Architecture</text>
  <line x1="535" y1="236" x2="560" y2="236" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowAI)"/>
  <!-- RGB output -->
  <rect x="565" y="218" width="60" height="35" rx="4" fill="#6a8a7a" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="595" y="234" fill="#fff" font-size="9" text-anchor="middle">sRGB</text>
  <text x="595" y="247" fill="rgba(255,255,255,0.8)" font-size="7" text-anchor="middle">Output</text>
  <!-- Comparison table -->
  <rect x="60" y="278" width="580" height="70" rx="6" fill="rgba(106,138,122,0.03)" stroke="#d5cec7" stroke-width="1"/>
  <text x="170" y="296" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">特性比較</text>
  <text x="370" y="296" fill="#648cb4" font-size="10" text-anchor="middle">Module-level AI</text>
  <text x="530" y="296" fill="#6a8a7a" font-size="10" text-anchor="middle">End-to-End AI</text>
  <text x="170" y="314" fill="#8a8580" font-size="9" text-anchor="middle">可解釋性</text>
  <text x="370" y="314" fill="#5a5550" font-size="9" text-anchor="middle">高（各模組可獨立分析）</text>
  <text x="530" y="314" fill="#5a5550" font-size="9" text-anchor="middle">低（黑箱）</text>
  <text x="170" y="330" fill="#8a8580" font-size="9" text-anchor="middle">計算量</text>
  <text x="370" y="330" fill="#5a5550" font-size="9" text-anchor="middle">中等</text>
  <text x="530" y="330" fill="#5a5550" font-size="9" text-anchor="middle">高</text>
  <text x="170" y="346" fill="#8a8580" font-size="9" text-anchor="middle">IQ 上限</text>
  <text x="370" y="346" fill="#5a5550" font-size="9" text-anchor="middle">受傳統架構限制</text>
  <text x="530" y="346" fill="#5a5550" font-size="9" text-anchor="middle">潛力更高</text>
</svg><div class="caption">圖 8-4：AI-ISP 三個層次 — 從模組增強到端到端 Neural ISP</div></div>

<h3>已在量產中的 AI-ISP 應用</h3>
<table>
  <tr><th>應用</th><th>技術</th><th>代表產品</th></tr>
  <tr><td>AI 降噪</td><td>U-Net based temporal/spatial NR</td><td>Apple Deep Fusion, Google HDRnet</td></tr>
  <tr><td>AI 超解析度</td><td>ESRGAN / Real-ESRGAN 變體</td><td>Samsung, Xiaomi 數位變焦</td></tr>
  <tr><td>AI Scene Detection</td><td>Lightweight CNN classifier</td><td>幾乎所有旗艦手機</td></tr>
  <tr><td>AI HDR</td><td>Multi-frame fusion with CNN</td><td>Google Night Sight, Apple Smart HDR</td></tr>
  <tr><td>AI Portrait</td><td>Depth estimation + Bokeh rendering</td><td>所有主流手機的人像模式</td></tr>
</table>

<h3>端到端 Neural ISP 的挑戰</h3>
<ul>
  <li><strong>訓練數據</strong>：需要大量成對的 RAW-sRGB 數據，且需要高品質的 Ground Truth</li>
  <li><strong>泛化性</strong>：在訓練場景之外的未知場景可能表現不佳</li>
  <li><strong>計算成本</strong>：需要強大的 NPU/GPU 支援，功耗是關鍵瓶頸</li>
  <li><strong>可控性</strong>：端到端網路的輸出不像傳統 ISP 那樣可以「調」某個特定維度（如只調色溫或只調銳度）</li>
  <li><strong>安全性</strong>：車用等安全場景中，黑箱的 AI 處理難以通過功能安全認證</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  AI-ISP 不會完全取代傳統 ISP，而是<strong>與傳統 ISP 融合</strong>。最務實的做法是用 AI 增強傳統 Pipeline 中的瓶頸模組（如降噪和超解析度），同時保留傳統模組的可控性和可解釋性。純端到端的 Neural ISP 目前仍主要停留在學術研究階段。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在部署 AI-ISP 模型時，模型量化（Quantization）和剪枝（Pruning）是控制計算成本的關鍵。INT8 量化可以將模型大小和推理時間減少 4 倍以上，且在大多數 ISP 任務中精度損失 < 1dB PSNR。建議先在 FP32 下訓練到收斂，再做 Quantization-Aware Training。
</div>
`,
      keyPoints: [
        "AI-ISP 分三個層次：模組增強、模組替換、端到端學習",
        "AI 降噪和 AI 超解析度已在量產手機中廣泛應用",
        "端到端 Neural ISP 潛力高但面臨泛化性、計算成本和可控性挑戰",
        "最務實的做法是 AI 增強傳統 Pipeline 的瓶頸模組",
        "模型量化（INT8）可大幅降低部署成本，精度損失可控"
      ]
    },
    {
      id: "ch8_5",
      title: "ISP 效能優化",
      content: `
<h3>ISP 的實作平台</h3>
<p>ISP 演算法的執行平台決定了其效能上限和設計取捨。主要的平台包括：</p>

<div class="diagram"><svg viewBox="0 0 650 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="340" fill="#f5f0eb" rx="8"/>
  <text x="325" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">ISP 實作平台比較</text>
  <!-- ASIC -->
  <rect x="30" y="45" width="175" height="130" rx="8" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="117" y="68" fill="#6a8a7a" font-size="13" text-anchor="middle" font-weight="600">ASIC ISP</text>
  <text x="117" y="88" fill="#5a5550" font-size="10" text-anchor="middle">專用硬體 IC</text>
  <rect x="45" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="75" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">功耗最低</text>
  <rect x="115" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="145" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">速度最快</text>
  <rect x="45" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="75" y="138" fill="#c4a064" font-size="8" text-anchor="middle">靈活性低</text>
  <rect x="115" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="145" y="138" fill="#c4a064" font-size="8" text-anchor="middle">NRE 高</text>
  <text x="117" y="165" fill="#8a8580" font-size="9" text-anchor="middle">手機 SoC、車用 SoC</text>
  <!-- FPGA -->
  <rect x="230" y="45" width="175" height="130" rx="8" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="317" y="68" fill="#c4a064" font-size="13" text-anchor="middle" font-weight="600">FPGA ISP</text>
  <text x="317" y="88" fill="#5a5550" font-size="10" text-anchor="middle">可程式化邏輯</text>
  <rect x="245" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="275" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">速度快</text>
  <rect x="315" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="345" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">可重配</text>
  <rect x="245" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="275" y="138" fill="#c4a064" font-size="8" text-anchor="middle">功耗中等</text>
  <rect x="315" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="345" y="138" fill="#c4a064" font-size="8" text-anchor="middle">成本較高</text>
  <text x="317" y="165" fill="#8a8580" font-size="9" text-anchor="middle">原型、監控、工業</text>
  <!-- Software -->
  <rect x="430" y="45" width="190" height="130" rx="8" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="525" y="68" fill="#648cb4" font-size="13" text-anchor="middle" font-weight="600">Software ISP</text>
  <text x="525" y="88" fill="#5a5550" font-size="10" text-anchor="middle">CPU / GPU / NPU</text>
  <rect x="445" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="475" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">最靈活</text>
  <rect x="515" y="98" width="60" height="20" rx="3" fill="rgba(106,138,122,0.15)"/>
  <text x="545" y="112" fill="#6a8a7a" font-size="8" text-anchor="middle">易更新</text>
  <rect x="445" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="475" y="138" fill="#c4a064" font-size="8" text-anchor="middle">功耗高</text>
  <rect x="515" y="124" width="60" height="20" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="545" y="138" fill="#c4a064" font-size="8" text-anchor="middle">延遲較大</text>
  <text x="525" y="165" fill="#8a8580" font-size="9" text-anchor="middle">AI-ISP、研發原型</text>
  <!-- Comparison chart -->
  <rect x="40" y="195" width="570" height="130" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="218" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">效能比較（以 4K@30fps ISP 為例）</text>
  <!-- Bars -->
  <text x="130" y="242" fill="#8a8580" font-size="9" text-anchor="end">吞吐量</text>
  <rect x="140" y="232" width="200" height="14" rx="2" fill="#6a8a7a" opacity="0.7"/>
  <text x="345" y="243" fill="#5a5550" font-size="8">ASIC: 4K@120fps</text>
  <rect x="140" y="248" width="150" height="14" rx="2" fill="#c4a064" opacity="0.7"/>
  <text x="295" y="259" fill="#5a5550" font-size="8">FPGA: 4K@60fps</text>
  <rect x="140" y="264" width="60" height="14" rx="2" fill="#648cb4" opacity="0.7"/>
  <text x="205" y="275" fill="#5a5550" font-size="8">SW: 4K@15fps (GPU)</text>
  <text x="130" y="298" fill="#8a8580" font-size="9" text-anchor="end">功耗效率</text>
  <rect x="140" y="288" width="200" height="14" rx="2" fill="#6a8a7a" opacity="0.7"/>
  <text x="345" y="299" fill="#5a5550" font-size="8">ASIC: ~0.5W</text>
  <rect x="140" y="304" width="100" height="14" rx="2" fill="#c4a064" opacity="0.7"/>
  <text x="245" y="315" fill="#5a5550" font-size="8">FPGA: ~3W</text>
  <rect x="140" y="320" width="40" height="14" rx="2" fill="#648cb4" opacity="0.7"/>
  <text x="185" y="331" fill="#5a5550" font-size="8">SW: ~10W</text>
</svg><div class="caption">圖 8-5：ASIC / FPGA / Software ISP 平台比較</div></div>

<h3>ASIC ISP 的優化策略</h3>
<ul>
  <li><strong>Line Buffer vs Frame Buffer</strong>：盡量使用 Line Buffer（只存幾行數據）而非 Frame Buffer（存整張影像），大幅降低記憶體需求</li>
  <li><strong>Pipeline 架構</strong>：各模組以流水線方式串接，每個時鐘週期處理一個像素，最大化吞吐量</li>
  <li><strong>定點運算</strong>：用定點數（Fixed-point）替代浮點數，節省硬體面積和功耗</li>
  <li><strong>LUT 替代複雜運算</strong>：將 Gamma、Tone Curve 等非線性函數用 LUT 實作</li>
  <li><strong>乘法器共享</strong>：多個模組的卷積運算共享乘法器資源</li>
</ul>

<h3>Software ISP 的優化策略</h3>
<ul>
  <li><strong>SIMD 指令</strong>：使用 NEON（ARM）或 SSE/AVX（x86）等向量指令，單指令處理多像素</li>
  <li><strong>GPU Compute</strong>：用 OpenCL 或 Vulkan Compute Shader 將並行度高的模組轉移到 GPU</li>
  <li><strong>NPU 加速</strong>：將 AI 模組（如 AI-NR）部署到專用神經網路加速器</li>
  <li><strong>記憶體存取優化</strong>：Cache-friendly 的數據佈局、Tile-based 處理減少 Cache Miss</li>
  <li><strong>多執行緒</strong>：將影像分塊並行處理，利用多核 CPU</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  ISP 效能優化的核心不是「讓演算法更快」，而是「選擇合適的演算法和平台組合」。在 ASIC 上，簡單的 3×3 Kernel 就能達到 4K@120fps；而複雜的 AI 模型可能需要 NPU 加速才能達到即時處理。好的系統設計是根據效能預算分配不同的演算法到最適合的硬體單元。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在評估 ISP 演算法的硬體可行性時，一個有用的指標是 <strong>Operations per Pixel (OPP)</strong> — 每個輸出像素需要多少次乘法和加法。例如，3×3 卷積 ≈ 9 MAC/pixel，5×5 卷積 ≈ 25 MAC/pixel。將 OPP 乘以像素數和幀率，就能估算所需的計算能力（GOPS）。
</div>
`,
      keyPoints: [
        "ISP 平台包括 ASIC（最快最省電）、FPGA（可重配）、Software（最靈活）",
        "ASIC 優化：Line Buffer、Pipeline 架構、定點運算、LUT",
        "Software 優化：SIMD、GPU Compute、NPU 加速、Cache 優化",
        "核心是選擇合適的演算法-平台組合，而非單純加速",
        "Operations per Pixel (OPP) 是評估硬體可行性的實用指標"
      ]
    },
    {
      id: "ch8_6",
      title: "IQ 問題 Debug 案例",
      content: `
<h3>IQ Debug 的系統方法</h3>
<p>在 ISP 開發和調適過程中，遇到 IQ 問題是家常便飯。關鍵是要有<strong>系統化的 Debug 方法</strong>，而不是盲目猜測和嘗試。好的 Debug 流程包括：準確描述症狀 → 縮小問題範圍 → 定位根因 → 驗證修復。</p>

<div class="diagram"><svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="420" fill="#f5f0eb" rx="8"/>
  <text x="350" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ 問題 Debug 流程圖</text>
  <defs>
    <marker id="arrowDB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
    <marker id="arrowGn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6a8a7a"/></marker>
  </defs>
  <!-- Start: Symptom -->
  <rect x="260" y="35" width="180" height="40" rx="20" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="350" y="60" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">發現 IQ 異常</text>
  <line x1="350" y1="75" x2="350" y2="95" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowDB)"/>
  <!-- Step 1: Classify -->
  <rect x="220" y="98" width="260" height="35" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="350" y="120" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Step 1：症狀分類</text>
  <line x1="350" y1="133" x2="350" y2="148" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <!-- Branch: symptom types -->
  <rect x="25" y="152" width="110" height="35" rx="5" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="80" y="174" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">色彩異常</text>
  <rect x="155" y="152" width="110" height="35" rx="5" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1"/>
  <text x="210" y="174" fill="#648cb4" font-size="9" text-anchor="middle" font-weight="500">噪聲/顆粒</text>
  <rect x="285" y="152" width="110" height="35" rx="5" fill="rgba(160,130,180,0.08)" stroke="#a082b4" stroke-width="1"/>
  <text x="340" y="174" fill="#a082b4" font-size="9" text-anchor="middle" font-weight="500">銳度/模糊</text>
  <rect x="415" y="152" width="110" height="35" rx="5" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="470" y="174" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">Artifact</text>
  <rect x="545" y="152" width="130" height="35" rx="5" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="610" y="174" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">亮度/動態範圍</text>
  <!-- Step 2: Root cause per symptom -->
  <line x1="80" y1="187" x2="80" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <rect x="15" y="208" width="130" height="80" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="80" y="224" fill="#c4a064" font-size="8" text-anchor="middle" font-weight="500">可能根因：</text>
  <text x="80" y="240" fill="#5a5550" font-size="8" text-anchor="middle">• AWB 偏差</text>
  <text x="80" y="254" fill="#5a5550" font-size="8" text-anchor="middle">• CCM 不準確</text>
  <text x="80" y="268" fill="#5a5550" font-size="8" text-anchor="middle">• LSC 色偏</text>
  <text x="80" y="282" fill="#5a5550" font-size="8" text-anchor="middle">• Saturation 異常</text>
  <line x1="210" y1="187" x2="210" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <rect x="145" y="208" width="130" height="80" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="210" y="224" fill="#648cb4" font-size="8" text-anchor="middle" font-weight="500">可能根因：</text>
  <text x="210" y="240" fill="#5a5550" font-size="8" text-anchor="middle">• NR 不足</text>
  <text x="210" y="254" fill="#5a5550" font-size="8" text-anchor="middle">• 銳化放大噪聲</text>
  <text x="210" y="268" fill="#5a5550" font-size="8" text-anchor="middle">• BLC 偏差</text>
  <text x="210" y="282" fill="#5a5550" font-size="8" text-anchor="middle">• Sensor FPN</text>
  <line x1="340" y1="187" x2="340" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <rect x="275" y="208" width="130" height="80" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="340" y="224" fill="#a082b4" font-size="8" text-anchor="middle" font-weight="500">可能根因：</text>
  <text x="340" y="240" fill="#5a5550" font-size="8" text-anchor="middle">• 對焦問題</text>
  <text x="340" y="254" fill="#5a5550" font-size="8" text-anchor="middle">• NR 過度（塗抹）</text>
  <text x="340" y="268" fill="#5a5550" font-size="8" text-anchor="middle">• 銳化不足</text>
  <text x="340" y="282" fill="#5a5550" font-size="8" text-anchor="middle">• Demosaic 品質</text>
  <line x1="470" y1="187" x2="470" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <rect x="405" y="208" width="130" height="80" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="470" y="224" fill="#6a8a7a" font-size="8" text-anchor="middle" font-weight="500">可能根因：</text>
  <text x="470" y="240" fill="#5a5550" font-size="8" text-anchor="middle">• Halo（銳化過度）</text>
  <text x="470" y="254" fill="#5a5550" font-size="8" text-anchor="middle">• Moiré（OLPF 不足）</text>
  <text x="470" y="268" fill="#5a5550" font-size="8" text-anchor="middle">• Purple Fringe</text>
  <text x="470" y="282" fill="#5a5550" font-size="8" text-anchor="middle">• HDR Ghost</text>
  <line x1="610" y1="187" x2="610" y2="205" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <rect x="545" y="208" width="130" height="80" rx="4" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="610" y="224" fill="#c4a064" font-size="8" text-anchor="middle" font-weight="500">可能根因：</text>
  <text x="610" y="240" fill="#5a5550" font-size="8" text-anchor="middle">• AE 不準確</text>
  <text x="610" y="254" fill="#5a5550" font-size="8" text-anchor="middle">• Gamma/Tone 不當</text>
  <text x="610" y="268" fill="#5a5550" font-size="8" text-anchor="middle">• HDR 合成問題</text>
  <text x="610" y="282" fill="#5a5550" font-size="8" text-anchor="middle">• Sensor 飽和</text>
  <!-- Step 3: Isolation & Fix -->
  <rect x="120" y="310" width="460" height="40" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="350" y="330" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Step 2：隔離驗證 — 逐模組 Bypass 定位問題所在</text>
  <text x="350" y="345" fill="#8a8580" font-size="9" text-anchor="middle">關閉可疑模組觀察症狀是否消失 → 確認根因模組</text>
  <line x1="350" y1="350" x2="350" y2="370" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowDB)"/>
  <!-- Fix -->
  <rect x="200" y="373" width="300" height="35" rx="6" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="350" y="395" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="500">Step 3：調參修復 → 回歸測試 → 驗收</text>
</svg><div class="caption">圖 8-6：IQ 問題 Debug 流程 — 症狀分類 → 根因分析 → 隔離驗證 → 修復</div></div>

<h3>常見 IQ 問題與解法速查</h3>
<table>
  <tr><th>症狀</th><th>可能根因</th><th>檢查方法</th><th>修復方向</th></tr>
  <tr><td>畫面整體偏綠/偏紅</td><td>AWB 偏差</td><td>拍灰卡檢查 RGB 比例</td><td>調整 AWB 演算法或手動白平衡</td></tr>
  <tr><td>四角偏暗或偏色</td><td>LSC 不足</td><td>拍均勻白光場</td><td>重新校準 LSC 表</td></tr>
  <tr><td>暗區顆粒感重</td><td>NR 不足 / BLC 偏差</td><td>拍暗場分析</td><td>增強暗區 NR、修正 BLC</td></tr>
  <tr><td>紋理被「抹平」</td><td>NR 過度</td><td>比較 NR 前後</td><td>降低 NR 強度或改用 Edge-aware NR</td></tr>
  <tr><td>邊緣有白色亮帶</td><td>銳化 Overshoot</td><td>關閉銳化對比</td><td>降低 Amount、加強 O/U 限制</td></tr>
  <tr><td>高光處出現紫邊</td><td>Sensor 溢出 / 色差</td><td>檢查 RAW 飽和</td><td>Purple Fringe 校正、鏡頭色差補償</td></tr>
  <tr><td>HDR 場景有鬼影</td><td>多幀合成 Motion</td><td>檢查單幀和合成幀</td><td>改善 Motion Detection、增加 Ghost 抑制</td></tr>
</table>

<h3>Debug 的關鍵工具</h3>
<ul>
  <li><strong>RAW Dump</strong>：保存 ISP 各個階段的中間結果（RAW、Demosaic 後、NR 後等），用於定位問題出在哪個模組</li>
  <li><strong>模組 Bypass</strong>：逐個關閉 ISP 模組，觀察症狀是否消失。這是最有效的隔離手段</li>
  <li><strong>Histogram 分析</strong>：查看各通道的直方圖分布，快速發現 Clipping、偏移等問題</li>
  <li><strong>像素級 Inspector</strong>：在可疑區域檢查單一像素的 RGB 值，與預期值比較</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Debug 的黃金法則是<strong>「先 RAW 後 ISP」</strong>— 首先確認 RAW 數據本身是否正常（Sensor、鏡頭、機構），如果 RAW 就有問題，ISP 調適無法修復。只有確認 RAW 正常後，才進入 ISP Pipeline 的逐模組排查。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議維護一份「IQ Bug 知識庫」— 記錄每次遇到的 IQ 問題、症狀描述、根因分析、解決方案和教訓。隨著時間累積，這份知識庫會成為團隊最寶貴的資產，讓新成員快速學習，也避免重複踩坑。
</div>
`,
      keyPoints: [
        "系統化 Debug：症狀分類 → 根因列舉 → 模組隔離 → 驗證修復",
        "黃金法則：先確認 RAW 正常，再排查 ISP 模組",
        "模組 Bypass 是最有效的問題隔離手段",
        "常見問題可建立速查表，快速對應症狀與根因",
        "維護團隊 IQ Bug 知識庫，累積經驗避免重複踩坑"
      ]
    },
    {
      id: "ch8_7",
      title: "RAW 到最終影像實作",
      content: `
<h3>完整處理鏈概覽</h3>
<p>本節以一張 RAW 影像為例，走過完整的 ISP 處理鏈，展示每一步處理的效果和注意事項。這是將所有前面章節的知識串聯起來的實戰演練。</p>

<div class="diagram"><svg viewBox="0 0 700 450" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="450" fill="#f5f0eb" rx="8"/>
  <text x="350" y="22" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">RAW → 最終影像：完整處理鏈與各階段效果</text>
  <defs><marker id="arrowFL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Stage 1: RAW -->
  <rect x="20" y="40" width="90" height="55" rx="6" fill="#555" stroke="#444" stroke-width="1.5"/>
  <text x="65" y="62" fill="#aaa" font-size="10" text-anchor="middle" font-weight="500">RAW Bayer</text>
  <text x="65" y="78" fill="#888" font-size="8" text-anchor="middle">12-bit, 暗沉</text>
  <text x="65" y="90" fill="#888" font-size="7" text-anchor="middle">有壞點和暗電流</text>
  <line x1="110" y1="67" x2="130" y2="67" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 2: BLC+DPC -->
  <rect x="133" y="40" width="80" height="55" rx="6" fill="#666" stroke="#555" stroke-width="1.5"/>
  <text x="173" y="58" fill="#bbb" font-size="9" text-anchor="middle" font-weight="500">BLC + DPC</text>
  <text x="173" y="74" fill="#999" font-size="8" text-anchor="middle">移除黑電平</text>
  <text x="173" y="88" fill="#999" font-size="7" text-anchor="middle">修復壞點</text>
  <line x1="213" y1="67" x2="233" y2="67" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 3: LSC -->
  <rect x="236" y="40" width="80" height="55" rx="6" fill="#777" stroke="#666" stroke-width="1.5"/>
  <text x="276" y="58" fill="#ccc" font-size="9" text-anchor="middle" font-weight="500">LSC</text>
  <text x="276" y="74" fill="#aaa" font-size="8" text-anchor="middle">亮度均勻化</text>
  <text x="276" y="88" fill="#aaa" font-size="7" text-anchor="middle">四角提亮</text>
  <line x1="316" y1="67" x2="336" y2="67" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 4: AWB + Demosaic -->
  <rect x="339" y="40" width="95" height="55" rx="6" fill="rgba(150,160,140,0.8)" stroke="#8a9a7a" stroke-width="1.5"/>
  <text x="386" y="58" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">AWB+Demosaic</text>
  <text x="386" y="74" fill="#ddd" font-size="8" text-anchor="middle">白平衡校正</text>
  <text x="386" y="88" fill="#ddd" font-size="7" text-anchor="middle">Bayer→RGB（偏暗）</text>
  <line x1="434" y1="67" x2="454" y2="67" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 5: CCM -->
  <rect x="457" y="40" width="70" height="55" rx="6" fill="rgba(130,160,140,0.9)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="492" y="58" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">CCM</text>
  <text x="492" y="74" fill="#eee" font-size="8" text-anchor="middle">色彩校正</text>
  <text x="492" y="88" fill="#ddd" font-size="7" text-anchor="middle">色彩更準確</text>
  <line x1="527" y1="67" x2="547" y2="67" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 6: Gamma -->
  <rect x="550" y="40" width="70" height="55" rx="6" fill="rgba(140,170,150,1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="585" y="58" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">Gamma</text>
  <text x="585" y="74" fill="#eee" font-size="8" text-anchor="middle">亮度提升</text>
  <text x="585" y="88" fill="#ddd" font-size="7" text-anchor="middle">暗部可見</text>
  <line x1="620" y1="67" x2="632" y2="67" stroke="#5a5550" stroke-width="1"/>
  <line x1="632" y1="67" x2="632" y2="130" stroke="#5a5550" stroke-width="1"/>
  <line x1="632" y1="130" x2="622" y2="130" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Row 2 -->
  <!-- Stage 7: NR -->
  <rect x="550" y="110" width="70" height="55" rx="6" fill="rgba(150,180,160,1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="585" y="128" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">NR</text>
  <text x="585" y="144" fill="#eee" font-size="8" text-anchor="middle">噪聲抑制</text>
  <text x="585" y="158" fill="#ddd" font-size="7" text-anchor="middle">更乾淨</text>
  <line x1="550" y1="137" x2="530" y2="137" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 8: Sharpening -->
  <rect x="457" y="110" width="70" height="55" rx="6" fill="rgba(140,175,155,1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="492" y="128" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">Sharp</text>
  <text x="492" y="144" fill="#eee" font-size="8" text-anchor="middle">銳化增強</text>
  <text x="492" y="158" fill="#ddd" font-size="7" text-anchor="middle">邊緣清晰</text>
  <line x1="457" y1="137" x2="437" y2="137" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 9: Tone/LTM -->
  <rect x="339" y="110" width="95" height="55" rx="6" fill="rgba(145,178,158,1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="386" y="128" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">Tone/LTM</text>
  <text x="386" y="144" fill="#eee" font-size="8" text-anchor="middle">色調優化</text>
  <text x="386" y="158" fill="#ddd" font-size="7" text-anchor="middle">動態範圍調整</text>
  <line x1="339" y1="137" x2="319" y2="137" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Stage 10: Saturation + Edge Enhancement -->
  <rect x="236" y="110" width="80" height="55" rx="6" fill="rgba(140,180,155,1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="276" y="128" fill="#fff" font-size="9" text-anchor="middle" font-weight="500">Sat + EE</text>
  <text x="276" y="144" fill="#eee" font-size="8" text-anchor="middle">飽和度微調</text>
  <text x="276" y="158" fill="#ddd" font-size="7" text-anchor="middle">色彩更鮮豔</text>
  <line x1="236" y1="137" x2="216" y2="137" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowFL)"/>
  <!-- Final output -->
  <rect x="133" y="112" width="80" height="50" rx="6" fill="#6a8a7a" stroke="#5a7a6a" stroke-width="2"/>
  <text x="173" y="132" fill="#fff" font-size="10" text-anchor="middle" font-weight="600">Final</text>
  <text x="173" y="148" fill="rgba(255,255,255,0.8)" font-size="8" text-anchor="middle">sRGB Output</text>
  <!-- Quality metrics at each stage -->
  <text x="350" y="195" fill="#5a5550" font-size="13" text-anchor="middle" font-weight="500">各階段品質指標追蹤</text>
  <rect x="30" y="205" width="640" height="230" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <!-- Table header -->
  <rect x="30" y="205" width="640" height="25" rx="0" fill="rgba(106,138,122,0.1)"/>
  <text x="85" y="222" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">處理階段</text>
  <text x="190" y="222" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">SNR 變化</text>
  <text x="300" y="222" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">MTF 變化</text>
  <text x="410" y="222" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">ΔE 變化</text>
  <text x="550" y="222" fill="#5a5550" font-size="9" text-anchor="middle" font-weight="500">注意事項</text>
  <!-- Rows -->
  <text x="85" y="248" fill="#5a5550" font-size="9" text-anchor="middle">RAW (input)</text>
  <text x="190" y="248" fill="#8a8580" font-size="9" text-anchor="middle">基準值</text>
  <text x="300" y="248" fill="#8a8580" font-size="9" text-anchor="middle">基準值</text>
  <text x="410" y="248" fill="#8a8580" font-size="9" text-anchor="middle">N/A</text>
  <text x="550" y="248" fill="#8a8580" font-size="9" text-anchor="middle">確認無壞點、無飽和</text>
  <line x1="35" y1="255" x2="665" y2="255" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="273" fill="#5a5550" font-size="9" text-anchor="middle">BLC + DPC</text>
  <text x="190" y="273" fill="#6a8a7a" font-size="9" text-anchor="middle">略微改善</text>
  <text x="300" y="273" fill="#8a8580" font-size="9" text-anchor="middle">不變</text>
  <text x="410" y="273" fill="#8a8580" font-size="9" text-anchor="middle">N/A</text>
  <text x="550" y="273" fill="#8a8580" font-size="9" text-anchor="middle">DPC 不要過度校正</text>
  <line x1="35" y1="280" x2="665" y2="280" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="298" fill="#5a5550" font-size="9" text-anchor="middle">Demosaic</text>
  <text x="190" y="298" fill="#c4a064" font-size="9" text-anchor="middle">略微下降</text>
  <text x="300" y="298" fill="#c4a064" font-size="9" text-anchor="middle">略微下降</text>
  <text x="410" y="298" fill="#8a8580" font-size="9" text-anchor="middle">N/A</text>
  <text x="550" y="298" fill="#8a8580" font-size="9" text-anchor="middle">注意 Zipper artifact</text>
  <line x1="35" y1="305" x2="665" y2="305" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="323" fill="#5a5550" font-size="9" text-anchor="middle">CCM + Gamma</text>
  <text x="190" y="323" fill="#8a8580" font-size="9" text-anchor="middle">不變</text>
  <text x="300" y="323" fill="#8a8580" font-size="9" text-anchor="middle">不變</text>
  <text x="410" y="323" fill="#6a8a7a" font-size="9" text-anchor="middle">大幅改善</text>
  <text x="550" y="323" fill="#8a8580" font-size="9" text-anchor="middle">Gamma 後暗區噪聲更可見</text>
  <line x1="35" y1="330" x2="665" y2="330" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="348" fill="#5a5550" font-size="9" text-anchor="middle">NR</text>
  <text x="190" y="348" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">大幅改善 ↑</text>
  <text x="300" y="348" fill="#c4a064" font-size="9" text-anchor="middle">可能下降 ↓</text>
  <text x="410" y="348" fill="#8a8580" font-size="9" text-anchor="middle">略微影響</text>
  <text x="550" y="348" fill="#8a8580" font-size="9" text-anchor="middle">平衡 SNR 和紋理保留</text>
  <line x1="35" y1="355" x2="665" y2="355" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="373" fill="#5a5550" font-size="9" text-anchor="middle">Sharpening</text>
  <text x="190" y="373" fill="#c4a064" font-size="9" text-anchor="middle">可能下降 ↓</text>
  <text x="300" y="373" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">大幅改善 ↑</text>
  <text x="410" y="373" fill="#8a8580" font-size="9" text-anchor="middle">略微影響</text>
  <text x="550" y="373" fill="#8a8580" font-size="9" text-anchor="middle">控制 Overshoot、Coring</text>
  <line x1="35" y1="380" x2="665" y2="380" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="398" fill="#5a5550" font-size="9" text-anchor="middle">Tone + Sat</text>
  <text x="190" y="398" fill="#8a8580" font-size="9" text-anchor="middle">略微影響</text>
  <text x="300" y="398" fill="#8a8580" font-size="9" text-anchor="middle">不變</text>
  <text x="410" y="398" fill="#c4a064" font-size="9" text-anchor="middle">可能增大</text>
  <text x="550" y="398" fill="#8a8580" font-size="9" text-anchor="middle">主觀偏好 vs 客觀準確</text>
  <line x1="35" y1="405" x2="665" y2="405" stroke="#d5cec7" stroke-width="0.5"/>
  <text x="85" y="423" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">最終輸出</text>
  <text x="190" y="423" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">SNR ≥ 32dB</text>
  <text x="300" y="423" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">MTF50 ≥ 0.3 c/p</text>
  <text x="410" y="423" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">Mean ΔE ≤ 3</text>
  <text x="550" y="423" fill="#6a8a7a" font-size="9" text-anchor="middle" font-weight="500">主觀驗收通過</text>
</svg><div class="caption">圖 8-7：完整處理鏈 — 每一階段的視覺效果變化與品質指標追蹤</div></div>

<h3>實作步驟詳解</h3>

<h4>Step 1：RAW 數據載入與分析</h4>
<p>拿到 RAW 檔後，首先要做的基本分析：</p>
<ul>
  <li>確認 Bayer Pattern（RGGB/BGGR/GRBG/GBRG）</li>
  <li>確認 Bit Depth（10-bit / 12-bit / 14-bit）</li>
  <li>檢查 Histogram — 確認無飽和（Clipping），確認暗區有足夠的信號</li>
  <li>檢查有無明顯的壞點或行/列雜訊</li>
</ul>

<h4>Step 2：BLC + DPC</h4>
<p>減去黑電平（通常各通道不同），修復壞點。BLC 值可以從 OB（Optical Black）區域獲取，或從 Dark Frame 量測。</p>

<h4>Step 3：LSC + AWB</h4>
<p>LSC 校正使畫面亮度均勻。AWB 根據場景估計色溫，對 RAW 做 R/B 通道增益。</p>

<h4>Step 4：Demosaic</h4>
<p>從 Bayer Pattern 重建完整的 RGB 影像。此步驟後影像仍在線性空間，看起來很暗。</p>

<h4>Step 5：CCM + Gamma</h4>
<p>CCM 將 Sensor 原始色彩映射到標準色彩空間（如 sRGB）。Gamma 將線性亮度轉換為知覺均勻的亮度，影像從此「看起來正常」。</p>

<h4>Step 6：NR + Sharpening</h4>
<p>降噪讓影像更乾淨，銳化恢復邊緣對比。這兩個步驟需要聯合調適。</p>

<h4>Step 7：Tone/Saturation 微調</h4>
<p>最後的全域色調和飽和度調整，讓影像的視覺風格符合目標。</p>

<pre>
// 簡化的 ISP Pipeline 虛擬碼
function processRAW(rawData, params) {
  let img = rawData;

  // Stage 1: 基礎校準
  img = subtractBLC(img, params.blc);
  img = correctDeadPixels(img, params.dpcThreshold);
  img = applyLSC(img, params.lscTable);

  // Stage 2: 色彩重建
  img = applyAWB(img, params.awbGains);
  img = demosaic(img, 'ACPI');  // Adaptive Color Plane Interpolation

  // Stage 3: 色彩校正
  img = applyCCM(img, params.ccm3x3);
  img = applyGamma(img, params.gammaLUT);

  // Stage 4: 增強
  img = denoiseNLM(img, params.nrStrength);
  img = sharpenUSM(img, params.sharpAmount, params.sharpRadius, params.sharpThreshold);

  // Stage 5: 最終調整
  img = applyToneCurve(img, params.toneCurve);
  img = adjustSaturation(img, params.satGain);

  return clipAndQuantize(img, 8);  // Output 8-bit sRGB
}
</pre>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  從 RAW 到最終影像，每一步都在改善某個維度的同時可能犧牲另一個維度。好的 ISP 工程師需要在每一步都清楚知道「此步驟的目的是什麼」「它會帶來什麼副作用」「如何將副作用控制在可接受範圍內」。這就是從理論到實戰的核心差異。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在學習和實驗 ISP Pipeline 時，強烈建議從 Python（使用 rawpy + OpenCV + NumPy）開始。先用軟體實作每個模組，理解其效果，再考慮優化和硬體實作。開源的 RAW 處理工具如 LibRaw、darktable 也是很好的學習資源。
</div>
`,
      keyPoints: [
        "完整 Pipeline：RAW → BLC → DPC → LSC → AWB → Demosaic → CCM → Gamma → NR → Sharp → Tone → Output",
        "每一步都要追蹤 SNR、MTF、ΔE 等關鍵品質指標",
        "NR 改善 SNR 但可能降低 MTF；Sharpening 改善 MTF 但可能降低 SNR",
        "先用 Python 原型理解每個模組，再考慮優化和硬體部署",
        "從理論到實戰的核心是理解每步的目的、副作用和控制方法"
      ]
    }
  ]
};
