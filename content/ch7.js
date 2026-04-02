const CH7 = {
  title: "IQ 調適與評估",
  sections: [
    {
      id: "ch7_1",
      title: "IQ Tuning 方法論",
      content: `
<h3>什麼是 IQ Tuning？</h3>
<p><strong>IQ Tuning（影像品質調適）</strong>是 ISP 開發中最關鍵也最耗時的環節。一套 ISP 硬體和演算法的設計再好，如果參數沒有調好，影像品質可能還不如基礎但調適優良的方案。IQ Tuning 的目標是在特定的相機系統（鏡頭 + Sensor + ISP）上，找到一組最佳的 ISP 參數設定，使影像品質在各種場景和光照條件下都達到令人滿意的水準。</p>

<p>IQ Tuning 涉及 ISP Pipeline 中的數十到數百個參數，包括但不限於：Black Level、Lens Shading Correction、White Balance、Color Correction Matrix、Gamma/Tone Curve、Noise Reduction、Sharpening、Saturation、Contrast 等。每個參數都可能隨 ISO / 光照 / 色溫 / 場景而變，組合空間極其龐大。</p>

<div class="diagram"><svg viewBox="0 0 650 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="380" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">系統化 IQ Tuning 工作流程</text>
  <defs>
    <marker id="arrowT" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker>
    <marker id="arrowG" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6a8a7a"/></marker>
  </defs>
  <!-- Phase 1: Calibration -->
  <rect x="30" y="45" width="180" height="65" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="120" y="67" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Phase 1：基礎校準</text>
  <text x="120" y="82" fill="#5a5550" font-size="10" text-anchor="middle">BLC · LSC · DPC</text>
  <text x="120" y="96" fill="#8a8580" font-size="9" text-anchor="middle">Dark Frame / Flat Field 量測</text>
  <line x1="210" y1="78" x2="240" y2="78" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 2: Color -->
  <rect x="245" y="45" width="180" height="65" rx="8" fill="rgba(196,160,100,0.12)" stroke="#c4a064" stroke-width="1.5"/>
  <text x="335" y="67" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Phase 2：色彩校準</text>
  <text x="335" y="82" fill="#5a5550" font-size="10" text-anchor="middle">AWB · CCM · Gamma</text>
  <text x="335" y="96" fill="#8a8580" font-size="9" text-anchor="middle">Macbeth Chart 量測</text>
  <line x1="425" y1="78" x2="455" y2="78" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 3: NR+Sharp -->
  <rect x="460" y="45" width="160" height="65" rx="8" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.5"/>
  <text x="540" y="67" fill="#648cb4" font-size="12" text-anchor="middle" font-weight="500">Phase 3：NR + 銳化</text>
  <text x="540" y="82" fill="#5a5550" font-size="10" text-anchor="middle">NR · Sharpening · Coring</text>
  <text x="540" y="96" fill="#8a8580" font-size="9" text-anchor="middle">各 ISO / 亮度分別調適</text>
  <!-- Arrow down -->
  <line x1="540" y1="110" x2="540" y2="140" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 4: Tone & HDR -->
  <rect x="420" y="145" width="200" height="65" rx="8" fill="rgba(160,130,180,0.12)" stroke="#a082b4" stroke-width="1.5"/>
  <text x="520" y="167" fill="#a082b4" font-size="12" text-anchor="middle" font-weight="500">Phase 4：Tone / HDR</text>
  <text x="520" y="182" fill="#5a5550" font-size="10" text-anchor="middle">Tone Curve · LTM · HDR merge</text>
  <text x="520" y="196" fill="#8a8580" font-size="9" text-anchor="middle">動態範圍與對比度調整</text>
  <line x1="420" y1="178" x2="390" y2="178" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 5: Scene-adaptive -->
  <rect x="180" y="145" width="205" height="65" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="282" y="167" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Phase 5：場景自適應</text>
  <text x="282" y="182" fill="#5a5550" font-size="10" text-anchor="middle">場景偵測 · 人臉 · 夜景 · 逆光</text>
  <text x="282" y="196" fill="#8a8580" font-size="9" text-anchor="middle">Per-scene 參數切換</text>
  <line x1="282" y1="210" x2="282" y2="240" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowT)"/>
  <!-- Phase 6: Subjective tuning -->
  <rect x="130" y="245" width="300" height="55" rx="8" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="280" y="267" fill="#c4a064" font-size="12" text-anchor="middle" font-weight="500">Phase 6：主觀微調與驗收</text>
  <text x="280" y="286" fill="#5a5550" font-size="10" text-anchor="middle">A/B Test · 真實場景拍攝 · 盲測比較 · 客戶 Review</text>
  <!-- Feedback loops -->
  <path d="M130,270 Q50,270 50,178 Q50,78 30,78" fill="none" stroke="#6a8a7a" stroke-width="1.2" stroke-dasharray="5,3" marker-end="url(#arrowG)"/>
  <text x="40" y="180" fill="#6a8a7a" font-size="9" transform="rotate(-90,40,180)">迭代回饋</text>
  <!-- Bottom notes -->
  <rect x="80" y="320" width="490" height="45" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="338" fill="#5a5550" font-size="11" text-anchor="middle">每個 Phase 都需要在多個光照條件下測試（D65, TL84, A, CWF, Outdoor, ...）</text>
  <text x="325" y="355" fill="#8a8580" font-size="10" text-anchor="middle">典型的 IQ Tuning 週期：初始 2~4 週 → 迭代優化 4~8 週 → 驗收 1~2 週</text>
</svg><div class="caption">圖 7-1：系統化 IQ Tuning 工作流程 — 從基礎校準到主觀驗收的完整循環</div></div>

<h3>IQ Tuning 的核心原則</h3>
<ol>
  <li><strong>由粗到細</strong>：先確保基礎校準正確（BLC、LSC），再調色彩，再調 NR/銳化，最後做場景微調</li>
  <li><strong>先客觀後主觀</strong>：先用測試圖卡和量測工具達到客觀指標，再進行主觀評價和調整</li>
  <li><strong>交叉驗證</strong>：每調完一個模組，都要回去檢查之前調好的模組是否被影響</li>
  <li><strong>多場景覆蓋</strong>：不要只在實驗室中調適，需要大量真實場景的驗證</li>
  <li><strong>記錄與版本管理</strong>：每次調整都要記錄參數變動和效果對比，便於回溯</li>
</ol>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 不是簡單的「調參數」，它是一個系統性的工程過程。好的 Tuning 工程師需要深入理解 ISP 每個模組的原理、它們之間的交互影響、人眼的視覺特性、以及目標應用場景的需求。
</div>

<h3>常見的 IQ Tuning 挑戰</h3>
<ul>
  <li><strong>參數交互耦合</strong>：改動一個模組的參數，可能連帶影響其他模組的效果（如改 Gamma 會影響 NR 和銳化的表現）</li>
  <li><strong>場景多樣性</strong>：實驗室中調好的參數，在真實場景中可能不理想</li>
  <li><strong>主觀差異</strong>：不同的人（客戶、使用者）對「好的影像」有不同的偏好</li>
  <li><strong>平台差異</strong>：同一影像在不同螢幕上看起來會不同</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議建立一套標準化的 Tuning 檢查清單（Checklist），涵蓋每個 Phase 需要檢查的項目、使用的測試圖卡、量測指標和通過標準。這可以大幅提升 Tuning 的效率和一致性，特別是在團隊協作時。
</div>
`,
      keyPoints: [
        "IQ Tuning 是 ISP 開發中最關鍵也最耗時的環節",
        "工作流程分為 6 個 Phase：基礎校準 → 色彩 → NR/銳化 → Tone → 場景自適應 → 主觀微調",
        "核心原則：由粗到細、先客觀後主觀、交叉驗證、多場景覆蓋",
        "參數交互耦合是最大挑戰 — 需要系統性的迭代方法",
        "標準化 Checklist 能大幅提升 Tuning 效率"
      ]
    },
    {
      id: "ch7_2",
      title: "測試圖卡 Test Charts",
      content: `
<h3>標準測試圖卡的重要性</h3>
<p>在 IQ Tuning 和評估中，使用<strong>標準化的測試圖卡（Test Charts）</strong>是客觀量測的基礎。測試圖卡提供了已知的、可重現的測試目標，使得量測結果具有可比較性和可追溯性。</p>

<h3>Macbeth ColorChecker（24 色卡）</h3>
<p><strong>X-Rite ColorChecker Classic（Macbeth 24-patch）</strong>是色彩校準中最廣泛使用的圖卡。它包含 24 個精心選擇的色塊，涵蓋了自然色彩、灰階、飽和色等。</p>

<div class="diagram"><svg viewBox="0 0 620 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="620" height="350" fill="#f5f0eb" rx="8"/>
  <text x="310" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Macbeth ColorChecker 24-patch 色卡佈局</text>
  <!-- Card background -->
  <rect x="35" y="40" width="550" height="230" rx="6" fill="#3a3530" stroke="#5a5550" stroke-width="1.5"/>
  <!-- 4 rows x 6 columns -->
  <!-- Row 1: Natural colors -->
  <rect x="55" y="55" width="75" height="45" rx="3" fill="#735244"/>
  <text x="92" y="90" fill="#ddd" font-size="7" text-anchor="middle">Dark Skin</text>
  <rect x="140" y="55" width="75" height="45" rx="3" fill="#c29682"/>
  <text x="177" y="90" fill="#444" font-size="7" text-anchor="middle">Light Skin</text>
  <rect x="225" y="55" width="75" height="45" rx="3" fill="#627a9d"/>
  <text x="262" y="90" fill="#ddd" font-size="7" text-anchor="middle">Blue Sky</text>
  <rect x="310" y="55" width="75" height="45" rx="3" fill="#576c43"/>
  <text x="347" y="90" fill="#ddd" font-size="7" text-anchor="middle">Foliage</text>
  <rect x="395" y="55" width="75" height="45" rx="3" fill="#8580b1"/>
  <text x="432" y="90" fill="#ddd" font-size="7" text-anchor="middle">Blue Flower</text>
  <rect x="480" y="55" width="75" height="45" rx="3" fill="#67bdaa"/>
  <text x="517" y="90" fill="#444" font-size="7" text-anchor="middle">Bluish Green</text>
  <!-- Row 2: Miscellaneous -->
  <rect x="55" y="110" width="75" height="45" rx="3" fill="#d67e2c"/>
  <text x="92" y="145" fill="#444" font-size="7" text-anchor="middle">Orange</text>
  <rect x="140" y="110" width="75" height="45" rx="3" fill="#505ba6"/>
  <text x="177" y="145" fill="#ddd" font-size="7" text-anchor="middle">Purplish Blue</text>
  <rect x="225" y="110" width="75" height="45" rx="3" fill="#c15a63"/>
  <text x="262" y="145" fill="#ddd" font-size="7" text-anchor="middle">Moderate Red</text>
  <rect x="310" y="110" width="75" height="45" rx="3" fill="#5e3c6c"/>
  <text x="347" y="145" fill="#ddd" font-size="7" text-anchor="middle">Purple</text>
  <rect x="395" y="110" width="75" height="45" rx="3" fill="#9dbc40"/>
  <text x="432" y="145" fill="#444" font-size="7" text-anchor="middle">Yellow Green</text>
  <rect x="480" y="110" width="75" height="45" rx="3" fill="#e0a32e"/>
  <text x="517" y="145" fill="#444" font-size="7" text-anchor="middle">Orange Yellow</text>
  <!-- Row 3: Saturated -->
  <rect x="55" y="165" width="75" height="45" rx="3" fill="#383d96"/>
  <text x="92" y="200" fill="#ddd" font-size="7" text-anchor="middle">Blue</text>
  <rect x="140" y="165" width="75" height="45" rx="3" fill="#469449"/>
  <text x="177" y="200" fill="#ddd" font-size="7" text-anchor="middle">Green</text>
  <rect x="225" y="165" width="75" height="45" rx="3" fill="#af363c"/>
  <text x="262" y="200" fill="#ddd" font-size="7" text-anchor="middle">Red</text>
  <rect x="310" y="165" width="75" height="45" rx="3" fill="#e7c71f"/>
  <text x="347" y="200" fill="#444" font-size="7" text-anchor="middle">Yellow</text>
  <rect x="395" y="165" width="75" height="45" rx="3" fill="#bb5695"/>
  <text x="432" y="200" fill="#ddd" font-size="7" text-anchor="middle">Magenta</text>
  <rect x="480" y="165" width="75" height="45" rx="3" fill="#0885a1"/>
  <text x="517" y="200" fill="#ddd" font-size="7" text-anchor="middle">Cyan</text>
  <!-- Row 4: Grayscale -->
  <rect x="55" y="220" width="75" height="40" rx="3" fill="#f3f3f2"/>
  <text x="92" y="248" fill="#888" font-size="7" text-anchor="middle">White</text>
  <rect x="140" y="220" width="75" height="40" rx="3" fill="#c8c8c8"/>
  <text x="177" y="248" fill="#888" font-size="7" text-anchor="middle">Neutral 8</text>
  <rect x="225" y="220" width="75" height="40" rx="3" fill="#a0a0a0"/>
  <text x="262" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 6.5</text>
  <rect x="310" y="220" width="75" height="40" rx="3" fill="#7a7a79"/>
  <text x="347" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 5</text>
  <rect x="395" y="220" width="75" height="40" rx="3" fill="#555555"/>
  <text x="432" y="248" fill="#ddd" font-size="7" text-anchor="middle">Neutral 3.5</text>
  <rect x="480" y="220" width="75" height="40" rx="3" fill="#343434"/>
  <text x="517" y="248" fill="#ddd" font-size="7" text-anchor="middle">Black</text>
  <!-- Labels -->
  <text x="30" y="82" fill="#8a8580" font-size="9" text-anchor="end">自然色</text>
  <text x="30" y="137" fill="#8a8580" font-size="9" text-anchor="end">混合色</text>
  <text x="30" y="192" fill="#8a8580" font-size="9" text-anchor="end">飽和色</text>
  <text x="30" y="245" fill="#8a8580" font-size="9" text-anchor="end">灰階</text>
  <!-- Usage notes -->
  <text x="310" y="295" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">主要用途：AWB 校準、CCM 計算、ΔE 量測、灰階線性度</text>
  <rect x="60" y="305" width="250" height="30" rx="4" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="185" y="324" fill="#6a8a7a" font-size="10" text-anchor="middle">底排灰階：驗證 Gamma / Tone Curve</text>
  <rect x="330" y="305" width="250" height="30" rx="4" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1"/>
  <text x="455" y="324" fill="#c4a064" font-size="10" text-anchor="middle">前三排色塊：色彩準確性評估</text>
</svg><div class="caption">圖 7-2：Macbeth ColorChecker 24-patch 色卡佈局與用途</div></div>

<h3>ISO 12233 解析力測試圖</h3>
<p><strong>ISO 12233</strong> 是量測相機空間解析力的國際標準。常見的測試圖卡包含：</p>
<ul>
  <li><strong>Slanted Edge</strong>：傾斜 5° 的黑白邊緣，用於計算 SFR/MTF（最常用）</li>
  <li><strong>Siemens Star</strong>：放射狀的黑白扇形，可觀察不同方向的解析力</li>
  <li><strong>Hyperbolic Wedge</strong>：漸變的線對，可直觀看出解析力極限</li>
  <li><strong>Dead Leaves</strong>：模擬自然紋理的圖案，評估 Texture MTF</li>
</ul>

<h3>其他重要測試圖卡</h3>
<table>
  <tr><th>圖卡</th><th>用途</th><th>關鍵指標</th></tr>
  <tr><td>TE42 (Imatest)</td><td>綜合 IQ 評估</td><td>MTF、色彩、噪聲、動態範圍</td></tr>
  <tr><td>DNP Chart</td><td>動態範圍量測</td><td>SNR、Dynamic Range</td></tr>
  <tr><td>Distortion Grid</td><td>鏡頭畸變量測</td><td>TV Distortion %</td></tr>
  <tr><td>Uniformity Chart</td><td>均勻性量測</td><td>亮度 / 色彩均勻性</td></tr>
  <tr><td>Skin Tone Chart</td><td>膚色準確性</td><td>膚色 ΔE</td></tr>
</table>

<div class="info-box warn">
  <div class="box-title">⚠️ 注意事項</div>
  <ul>
    <li>圖卡需要在<strong>均勻照明</strong>下拍攝，避免光線不均勻導致量測偏差</li>
    <li>圖卡應佔畫面的<strong>適當比例</strong>（通常 60-80%），不要太近也不要太遠</li>
    <li>確保圖卡<strong>平整無翹曲</strong>，且與相機平面平行</li>
    <li>定期<strong>更換或校驗</strong>圖卡，因為色塊會隨時間褪色</li>
  </ul>
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在團隊合作中，建議建立統一的圖卡拍攝 SOP（Standard Operating Procedure），包括光源類型、照度要求、曝光設定、拍攝角度和距離等。這確保了不同工程師、不同時間的量測結果具有可比較性。
</div>
`,
      keyPoints: [
        "Macbeth 24-patch 是色彩校準的基礎圖卡，用於 AWB、CCM、ΔE",
        "ISO 12233 用於解析力量測，Slanted Edge 法最為常用",
        "不同測試項目需要不同的專用圖卡",
        "圖卡拍攝需嚴格控制照明、距離和角度",
        "標準化 SOP 確保量測結果的可重現性和可比較性"
      ]
    },
    {
      id: "ch7_3",
      title: "SNR 與 Dynamic Range 量測",
      content: `
<h3>SNR（Signal-to-Noise Ratio）</h3>
<p><strong>SNR（信噪比）</strong>是衡量影像品質最基本的指標之一。它定義為信號功率與噪聲功率之比，通常以 dB 表示：</p>
<div class="formula">SNR (dB) = 20 × log₁₀(Signal / Noise) = 20 × log₁₀(μ / σ)</div>
<p>其中 μ 是均值（信號），σ 是標準差（噪聲）。</p>

<h3>SNR 量測方法</h3>
<p>標準的 SNR 量測方法是拍攝均勻灰度圖卡（或使用 Macbeth 灰階色塊），在每個灰度級別上測量均值和標準差。</p>

<div class="diagram"><svg viewBox="0 0 650 330" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="330" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">SNR 量測設定與 SNR 曲線</text>
  <!-- Left: Setup -->
  <rect x="25" y="45" width="240" height="150" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="145" y="68" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">量測設定</text>
  <!-- Light source -->
  <rect x="45" y="82" width="60" height="30" rx="4" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="1"/>
  <text x="75" y="101" fill="#c4a064" font-size="9" text-anchor="middle">Light</text>
  <!-- Chart -->
  <rect x="125" y="78" width="50" height="40" rx="3" fill="#aaa" stroke="#888" stroke-width="1"/>
  <text x="150" y="102" fill="#fff" font-size="8" text-anchor="middle">Gray</text>
  <!-- Camera -->
  <rect x="195" y="82" width="50" height="30" rx="4" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="220" y="101" fill="#6a8a7a" font-size="9" text-anchor="middle">Camera</text>
  <!-- Steps -->
  <text x="145" y="140" fill="#5a5550" font-size="10" text-anchor="middle">1. 拍攝 N 張相同灰度</text>
  <text x="145" y="155" fill="#5a5550" font-size="10" text-anchor="middle">2. 計算 ROI 內 μ 和 σ</text>
  <text x="145" y="170" fill="#5a5550" font-size="10" text-anchor="middle">3. SNR = 20 log₁₀(μ/σ)</text>
  <text x="145" y="185" fill="#8a8580" font-size="9" text-anchor="middle">或拍單張多灰度圖卡</text>
  <!-- Right: SNR curve -->
  <rect x="290" y="45" width="340" height="260" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <!-- Axes -->
  <line x1="340" y1="70" x2="340" y2="270" stroke="#5a5550" stroke-width="1"/>
  <line x1="340" y1="270" x2="600" y2="270" stroke="#5a5550" stroke-width="1"/>
  <text x="320" y="170" fill="#8a8580" font-size="10" text-anchor="middle" transform="rotate(-90,320,170)">SNR (dB)</text>
  <text x="470" y="290" fill="#8a8580" font-size="10" text-anchor="middle">信號水準 (DN / Lux)</text>
  <!-- Y axis labels -->
  <text x="333" y="85" fill="#8a8580" font-size="9" text-anchor="end">40</text>
  <text x="333" y="135" fill="#8a8580" font-size="9" text-anchor="end">30</text>
  <text x="333" y="185" fill="#8a8580" font-size="9" text-anchor="end">20</text>
  <text x="333" y="235" fill="#8a8580" font-size="9" text-anchor="end">10</text>
  <text x="333" y="273" fill="#8a8580" font-size="9" text-anchor="end">0</text>
  <!-- Grid lines -->
  <line x1="340" y1="80" x2="600" y2="80" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="130" x2="600" y2="130" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="180" x2="600" y2="180" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="340" y1="230" x2="600" y2="230" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="4"/>
  <!-- Shot noise limited line (ideal) -->
  <path d="M360,260 Q420,190 500,120 Q560,80 590,70" fill="none" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="6,3"/>
  <!-- Real SNR curve (with read noise floor) -->
  <path d="M360,265 Q400,230 440,190 Q490,140 530,110 Q560,95 590,88" fill="none" stroke="#5a5550" stroke-width="2.5"/>
  <!-- After NR -->
  <path d="M360,255 Q400,210 440,170 Q490,120 530,95 Q560,82 590,76" fill="none" stroke="#c4a064" stroke-width="2" stroke-dasharray="4,3"/>
  <!-- Read noise floor -->
  <line x1="340" y1="258" x2="380" y2="258" stroke="#8a8580" stroke-width="1" stroke-dasharray="3"/>
  <text x="385" y="262" fill="#8a8580" font-size="8">Read Noise Floor</text>
  <!-- Legend -->
  <line x1="360" y1="300" x2="380" y2="300" stroke="#6a8a7a" stroke-width="2" stroke-dasharray="6,3"/>
  <text x="385" y="304" fill="#5a5550" font-size="9">Shot Noise Limited (Ideal)</text>
  <line x1="490" y1="300" x2="510" y2="300" stroke="#5a5550" stroke-width="2.5"/>
  <text x="515" y="304" fill="#5a5550" font-size="9">Real (before NR)</text>
</svg><div class="caption">圖 7-3：SNR 量測設定（左）與 SNR vs 信號水準曲線（右）</div></div>

<h3>SNR 曲線的解讀</h3>
<ul>
  <li><strong>低信號區</strong>：SNR 由 Read Noise 主導，隨信號緩慢上升</li>
  <li><strong>中信號區</strong>：SNR 受 Shot Noise 主導，與 √Signal 成正比，曲線斜率約 10 dB/decade</li>
  <li><strong>高信號區</strong>：接近飽和，SNR 趨近於最大值或因非線性開始下降</li>
  <li>ISP 降噪後的 SNR 曲線應整體上移（改善），但要注意是否同時損失了紋理細節</li>
</ul>

<h3>Dynamic Range（動態範圍）</h3>
<p><strong>Dynamic Range</strong> 定義為系統能記錄的最大與最小信號之比：</p>
<div class="formula">DR (dB) = 20 × log₁₀(Signal_max / Noise_floor)</div>

<p>或以 EV（Exposure Value，即「檔」）表示：</p>
<div class="formula">DR (EV) = log₂(Signal_max / Noise_floor)</div>

<p>在 ISP 量測中，Dynamic Range 通常用 SNR = 0 dB（或 1 dB）作為截止點 — 即信號等於噪聲的位置。</p>

<h3>量測方法</h3>
<table>
  <tr><th>方法</th><th>說明</th><th>優缺點</th></tr>
  <tr><td>漸變灰階圖卡</td><td>拍攝多個灰度級別，計算每級的 SNR</td><td>簡單直觀，但灰階級數有限</td></tr>
  <tr><td>多曝光法</td><td>固定場景，改變曝光時間，合成完整曲線</td><td>可涵蓋完整範圍，但需穩定光源</td></tr>
  <tr><td>透光密度梯度圖卡</td><td>連續密度變化的圖卡，一次拍攝涵蓋大範圍</td><td>效率高，但圖卡品質要求高</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  SNR 是 IQ 的基石。ISP 中的每一步處理（降噪、銳化、Tone Mapping、JPEG 壓縮）都會影響最終的 SNR。好的 ISP Tuning 要確保在每一步中盡可能保留甚至改善 SNR，而不是只看最終的視覺效果。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在量測 SNR 時，建議同時拍攝多張相同設定的影像（至少 8-16 張），使用時間平均法（Temporal Mean/Variance）來分離固定模式噪聲（FPN）和隨機噪聲。單張影像的 ROI 方法雖然簡便，但容易受到圖卡不均勻和 Lens Shading 的影響。
</div>
`,
      keyPoints: [
        "SNR = 20 × log₁₀(μ/σ)，是影像品質最基本的指標",
        "SNR 曲線受 Read Noise（低信號）和 Shot Noise（中信號）主導",
        "Dynamic Range 定義為最大信號與噪聲底限之比",
        "量測時需嚴格控制照明、曝光，建議多張取平均",
        "ISP 每一步處理都會影響 SNR，需全程監控"
      ]
    },
    {
      id: "ch7_4",
      title: "MTF/SFR 量測",
      content: `
<h3>SFR（Spatial Frequency Response）</h3>
<p><strong>SFR</strong> 與 <strong>MTF</strong> 在概念上等價，都描述系統在不同空間頻率下的響應。SFR 這個術語在 ISO 12233 標準中使用，強調的是「整個系統」（鏡頭 + Sensor + ISP）的空間頻率響應，而非單一元件的 MTF。</p>

<h3>Slanted Edge 量測法</h3>
<p>Slanted Edge（傾斜邊緣）法是目前最主流的 MTF/SFR 量測方法，被 ISO 12233 標準採用。其原理是：</p>

<div class="diagram"><svg viewBox="0 0 650 340" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="340" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">Slanted Edge MTF 量測方法</text>
  <defs><marker id="arrowS" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Step 1: Slanted Edge -->
  <rect x="20" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="85" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 1: 拍攝</text>
  <!-- Slanted edge illustration -->
  <rect x="35" y="80" width="100" height="70" rx="2" fill="#eee" stroke="#ccc" stroke-width="1"/>
  <polygon points="35,80 95,80 95,150 35,150" fill="#333"/>
  <!-- ~5 degree slant -->
  <polygon points="35,80 90,80 90,150 35,140" fill="#333"/>
  <text x="85" y="100" fill="#fff" font-size="8" text-anchor="middle">Dark</text>
  <text x="115" y="130" fill="#888" font-size="8" text-anchor="middle">Light</text>
  <text x="65" y="158" fill="#8a8580" font-size="8" text-anchor="middle">~5° 傾斜邊緣</text>
  <!-- Arrow -->
  <line x1="150" y1="105" x2="180" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 2: ESF -->
  <rect x="185" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="250" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 2: ESF</text>
  <!-- ESF curve -->
  <path d="M200,140 L220,140 Q240,140 250,100 Q260,80 270,80 L300,80" fill="none" stroke="#6a8a7a" stroke-width="2"/>
  <text x="250" y="155" fill="#8a8580" font-size="8" text-anchor="middle">Edge Spread Function</text>
  <!-- Arrow -->
  <line x1="315" y1="105" x2="345" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 3: LSF (derivative) -->
  <rect x="350" y="50" width="130" height="110" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="415" y="70" fill="#5a5550" font-size="10" text-anchor="middle" font-weight="500">Step 3: LSF</text>
  <!-- LSF curve (bell-like) -->
  <path d="M365,140 L385,140 Q400,140 410,90 Q415,75 420,90 Q430,140 445,140 L465,140" fill="none" stroke="#c4a064" stroke-width="2"/>
  <text x="415" y="155" fill="#8a8580" font-size="8" text-anchor="middle">= d(ESF)/dx</text>
  <!-- Arrow -->
  <line x1="480" y1="105" x2="510" y2="105" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowS)"/>
  <!-- Step 4: MTF (FFT) -->
  <rect x="515" y="50" width="120" height="110" rx="6" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="575" y="70" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">Step 4: MTF</text>
  <!-- MTF curve -->
  <path d="M530,80 Q560,85 580,110 Q600,135 620,145" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <text x="575" y="155" fill="#8a8580" font-size="8" text-anchor="middle">= |FFT(LSF)|</text>
  <!-- Bottom: MTF curve detail -->
  <rect x="50" y="185" width="550" height="140" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.2"/>
  <text x="325" y="205" fill="#5a5550" font-size="12" text-anchor="middle" font-weight="500">MTF 曲線與關鍵指標</text>
  <!-- Axes -->
  <line x1="100" y1="215" x2="100" y2="305" stroke="#5a5550" stroke-width="1"/>
  <line x1="100" y1="305" x2="560" y2="305" stroke="#5a5550" stroke-width="1"/>
  <text x="80" y="225" fill="#8a8580" font-size="9" text-anchor="end">1.0</text>
  <text x="80" y="265" fill="#8a8580" font-size="9" text-anchor="end">0.5</text>
  <text x="80" y="295" fill="#8a8580" font-size="9" text-anchor="end">0.1</text>
  <text x="330" y="320" fill="#8a8580" font-size="9" text-anchor="middle">空間頻率 (cycles/pixel)</text>
  <!-- Grid -->
  <line x1="100" y1="260" x2="560" y2="260" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <line x1="100" y1="290" x2="560" y2="290" stroke="#d5cec7" stroke-width="0.5" stroke-dasharray="3"/>
  <!-- MTF curve -->
  <path d="M100,218 Q200,225 280,260 Q380,288 480,300 Q530,303 560,305" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- MTF50 marker -->
  <line x1="280" y1="255" x2="280" y2="310" stroke="#c4a064" stroke-width="1.2" stroke-dasharray="4"/>
  <text x="280" y="318" fill="#c4a064" font-size="9" text-anchor="middle" font-weight="500">MTF50</text>
  <!-- MTF10 marker -->
  <line x1="450" y1="288" x2="450" y2="310" stroke="#648cb4" stroke-width="1.2" stroke-dasharray="4"/>
  <text x="450" y="318" fill="#648cb4" font-size="9" text-anchor="middle" font-weight="500">MTF10</text>
  <!-- Nyquist -->
  <line x1="520" y1="215" x2="520" y2="310" stroke="#8a8580" stroke-width="1" stroke-dasharray="3"/>
  <text x="520" y="213" fill="#8a8580" font-size="8" text-anchor="middle">Nyquist (0.5 c/p)</text>
</svg><div class="caption">圖 7-4：Slanted Edge MTF 量測法 — 從傾斜邊緣到 MTF 曲線的四步流程</div></div>

<h3>量測流程詳解</h3>
<ol>
  <li><strong>拍攝 Slanted Edge</strong>：邊緣傾斜約 5°（不要整數角度如 0° 或 45°）以利用 Sub-pixel 取樣</li>
  <li><strong>計算 ESF</strong>：將多行的像素投影到垂直邊緣的方向上，得到超取樣的 Edge Spread Function</li>
  <li><strong>求 LSF</strong>：對 ESF 做微分得到 Line Spread Function（即系統的一維 PSF）</li>
  <li><strong>FFT 得 MTF</strong>：對 LSF 做傅立葉轉換，取模值並正規化到 0 頻率為 1.0</li>
</ol>

<h3>關鍵指標</h3>
<table>
  <tr><th>指標</th><th>定義</th><th>意義</th></tr>
  <tr><td><strong>MTF50</strong></td><td>MTF = 0.5 的頻率</td><td>「銳度」的主要指標，與感知銳度高度相關</td></tr>
  <tr><td><strong>MTF10</strong></td><td>MTF = 0.1 的頻率</td><td>系統的極限解析力</td></tr>
  <tr><td><strong>MTF50P</strong></td><td>以 Picture Height 歸一化的 MTF50</td><td>不同解析度相機的公平比較</td></tr>
  <tr><td><strong>Nyquist MTF</strong></td><td>在 0.5 c/p 處的 MTF 值</td><td>Aliasing 風險評估</td></tr>
  <tr><td><strong>Overshoot</strong></td><td>邊緣 Overshoot 百分比</td><td>銳化過度的指標</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  MTF 量測反映的是「整個系統」的解析力，包含鏡頭、Sensor、ISP 所有處理的綜合效果。在 ISP Tuning 中，我們通常比較 RAW 域的 MTF（反映光學+Sensor）和最終輸出的 MTF（加上 ISP 處理），差值就是 ISP 銳化的貢獻。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  量測 MTF 時，建議在畫面中心和四角都放置 Slanted Edge，分別量測各區域的 MTF。中心和四角的 MTF 差異反映了鏡頭的 Field Curvature 和像差特性。ISP 可以透過空間自適應銳化來部分補償這個差異。
</div>
`,
      keyPoints: [
        "Slanted Edge 法是 ISO 12233 標準的 MTF 量測方法",
        "流程：拍攝傾斜邊緣 → ESF → 微分得 LSF → FFT 得 MTF",
        "MTF50 是銳度的主要指標，MTF10 代表極限解析力",
        "MTF 反映鏡頭 + Sensor + ISP 的綜合效果",
        "應量測中心和四角的 MTF 以評估全畫面一致性"
      ]
    },
    {
      id: "ch7_5",
      title: "色彩準確性 ΔE",
      content: `
<h3>什麼是 ΔE？</h3>
<p><strong>ΔE（Delta E）</strong>是量化兩個色彩之間「知覺差異」的指標。它在 CIE Lab 色彩空間中計算，因為 Lab 空間被設計為「知覺均勻」— 在 Lab 空間中相同的歐幾里得距離對應相似的知覺差異。</p>

<div class="formula">ΔE₀₀ = √[(ΔL'/kL·SL)² + (ΔC'/kC·SC)² + (ΔH'/kH·SH)² + RT·(ΔC'/kC·SC)·(ΔH'/kH·SH)]</div>

<p>上式是 CIEDE2000（ΔE00）的簡化表達。在實務中，有幾個版本的 ΔE 公式：</p>
<table>
  <tr><th>版本</th><th>年代</th><th>特點</th></tr>
  <tr><td>ΔE*ab (CIE76)</td><td>1976</td><td>最簡單的歐幾里得距離，但知覺均勻性不夠好</td></tr>
  <tr><td>ΔE*94 (CIE94)</td><td>1994</td><td>加入了亮度和彩度的加權</td></tr>
  <tr><td>ΔE00 (CIEDE2000)</td><td>2000</td><td>最準確，加入了旋轉項和更複雜的加權，業界標準</td></tr>
</table>

<h3>ΔE 的知覺含義</h3>
<table>
  <tr><th>ΔE00 值</th><th>知覺差異</th><th>IQ 評價</th></tr>
  <tr><td>0 ~ 1</td><td>幾乎不可察覺</td><td>優秀</td></tr>
  <tr><td>1 ~ 2</td><td>仔細比較可察覺</td><td>良好</td></tr>
  <tr><td>2 ~ 3.5</td><td>一般人可察覺</td><td>尚可</td></tr>
  <tr><td>3.5 ~ 5</td><td>明顯差異</td><td>需要改善</td></tr>
  <tr><td>&gt; 5</td><td>差異非常明顯</td><td>不可接受</td></tr>
</table>

<div class="diagram"><svg viewBox="0 0 650 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="300" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">ΔE 分布圖 — Macbeth 24-patch 量測結果</text>
  <!-- Bar chart -->
  <line x1="60" y1="40" x2="60" y2="240" stroke="#5a5550" stroke-width="1"/>
  <line x1="60" y1="240" x2="620" y2="240" stroke="#5a5550" stroke-width="1"/>
  <text x="50" y="60" fill="#8a8580" font-size="9" text-anchor="end">10</text>
  <text x="50" y="100" fill="#8a8580" font-size="9" text-anchor="end">8</text>
  <text x="50" y="140" fill="#8a8580" font-size="9" text-anchor="end">6</text>
  <text x="50" y="180" fill="#8a8580" font-size="9" text-anchor="end">4</text>
  <text x="50" y="200" fill="#8a8580" font-size="9" text-anchor="end">3</text>
  <text x="50" y="220" fill="#8a8580" font-size="9" text-anchor="end">2</text>
  <text x="50" y="240" fill="#8a8580" font-size="9" text-anchor="end">0</text>
  <text x="30" y="150" fill="#8a8580" font-size="10" text-anchor="middle" transform="rotate(-90,30,150)">ΔE00</text>
  <!-- Threshold lines -->
  <line x1="60" y1="200" x2="620" y2="200" stroke="#6a8a7a" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="622" y="198" fill="#6a8a7a" font-size="8">Good (ΔE≤3)</text>
  <line x1="60" y1="140" x2="620" y2="140" stroke="#c4a064" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="622" y="138" fill="#c4a064" font-size="8">Warn (ΔE=6)</text>
  <!-- Bars for 18 color patches (skip 6 grays) -->
  <rect x="72" y="190" width="20" height="50" rx="2" fill="#6a8a7a"/>
  <rect x="97" y="210" width="20" height="30" rx="2" fill="#6a8a7a"/>
  <rect x="122" y="185" width="20" height="55" rx="2" fill="#6a8a7a"/>
  <rect x="147" y="200" width="20" height="40" rx="2" fill="#6a8a7a"/>
  <rect x="172" y="175" width="20" height="65" rx="2" fill="#6a8a7a"/>
  <rect x="197" y="195" width="20" height="45" rx="2" fill="#6a8a7a"/>
  <rect x="222" y="160" width="20" height="80" rx="2" fill="#c4a064"/>
  <rect x="247" y="205" width="20" height="35" rx="2" fill="#6a8a7a"/>
  <rect x="272" y="170" width="20" height="70" rx="2" fill="#6a8a7a"/>
  <rect x="297" y="130" width="20" height="110" rx="2" fill="#c4a064"/>
  <rect x="322" y="188" width="20" height="52" rx="2" fill="#6a8a7a"/>
  <rect x="347" y="205" width="20" height="35" rx="2" fill="#6a8a7a"/>
  <rect x="372" y="215" width="20" height="25" rx="2" fill="#6a8a7a"/>
  <rect x="397" y="195" width="20" height="45" rx="2" fill="#6a8a7a"/>
  <rect x="422" y="178" width="20" height="62" rx="2" fill="#6a8a7a"/>
  <rect x="447" y="200" width="20" height="40" rx="2" fill="#6a8a7a"/>
  <rect x="472" y="210" width="20" height="30" rx="2" fill="#6a8a7a"/>
  <rect x="497" y="188" width="20" height="52" rx="2" fill="#6a8a7a"/>
  <!-- Summary stats -->
  <rect x="100" y="255" width="430" height="35" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1"/>
  <text x="315" y="273" fill="#5a5550" font-size="11" text-anchor="middle">Mean ΔE00 = 2.8 | Max ΔE00 = 5.5 (Purple patch) | 16/18 patches ΔE < 3.5</text>
</svg><div class="caption">圖 7-5：ΔE 分布圖 — 18 個色塊的 ΔE00 值（綠色：良好 / 橘色：需注意）</div></div>

<h3>量測流程</h3>
<ol>
  <li>在 D65 標準光源下拍攝 Macbeth 24-patch 色卡</li>
  <li>使用自動化工具（如 Imatest）定位並擷取每個色塊的 ROI</li>
  <li>計算每個色塊的平均 RGB 值，轉換到 CIE Lab 空間</li>
  <li>與色卡的標準 Lab 值比較，計算每個色塊的 ΔE00</li>
  <li>統計 Mean ΔE、Max ΔE、各色塊分布</li>
</ol>

<h3>影響 ΔE 的 ISP 模組</h3>
<ul>
  <li><strong>White Balance</strong>：若 AWB 不準，灰色色塊的 ΔE 會偏高</li>
  <li><strong>CCM（Color Correction Matrix）</strong>：CCM 是色彩準確性的核心控制，直接影響所有色塊的 ΔE</li>
  <li><strong>Gamma/Tone Curve</strong>：影響亮度映射，間接影響 Lab 空間的 L 分量</li>
  <li><strong>Saturation</strong>：過度飽和會增加 ΔE</li>
  <li><strong>Lens Shading</strong>：若 LSC 不足，圖卡邊緣的色塊 ΔE 可能偏高</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  ΔE 追求的是色彩的「準確性」，但在消費性相機中，「好看」往往比「準確」更重要。許多手機相機故意讓天空更藍、草地更綠、膚色更暖，犧牲了 ΔE 數字來換取更討喜的視覺效果。這就是 IQ Tuning 中「科學」與「藝術」的平衡。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在評估膚色準確性時，不要只依賴 Macbeth 色卡的 Skin Tone patch。建議額外使用 Skin Tone Chart（如 X-Rite SG）或拍攝真人，因為膚色的微小偏差比一般色彩更容易被人眼察覺。特別是亞洲膚色（偏黃-橘），CCM 需要特別注意紅-黃方向的精準度。
</div>
`,
      keyPoints: [
        "ΔE 量化兩色之間的知覺差異，CIEDE2000 (ΔE00) 是業界標準",
        "ΔE00 < 1 幾乎不可察覺，> 5 差異非常明顯",
        "量測使用 Macbeth 色卡在 D65 光源下拍攝",
        "CCM 是色彩準確性的核心控制模組",
        "消費相機中「好看」可能比「準確」更重要 — 需要平衡"
      ]
    },
    {
      id: "ch7_6",
      title: "主觀 vs 客觀品質",
      content: `
<h3>客觀指標的局限性</h3>
<p>客觀指標（如 SNR、MTF、ΔE）雖然精確且可重現，但它們<strong>無法完全代表人眼的品質感知</strong>。一個典型的例子：強力降噪後再強力銳化，可以得到很好的 SNR 和 MTF50 數字，但影像可能呈現「蠟像般」的不自然質感。</p>

<p>這就是為什麼 IQ 評估必須同時結合<strong>客觀量測</strong>和<strong>主觀評價</strong>。</p>

<h3>主觀評價方法</h3>

<h4>1. MOS（Mean Opinion Score）</h4>
<p>最常用的主觀品質評估方法。邀請多名受試者（通常 15-30 人）對影像品質打分，取平均：</p>
<ul>
  <li>5 分：優秀（Excellent）</li>
  <li>4 分：好（Good）</li>
  <li>3 分：尚可（Fair）</li>
  <li>2 分：差（Poor）</li>
  <li>1 分：很差（Bad）</li>
</ul>

<h4>2. A/B 比較法</h4>
<p>同時展示兩張影像（不同參數設定），讓受試者選擇偏好的一張。簡單直觀，但需要大量的 pair 比較。</p>

<h4>3. JND（Just Noticeable Difference）</h4>
<p>逐步調整參數，找到受試者「剛好能察覺差異」的點。這個方法特別適合確定參數的「安全範圍」。</p>

<div class="diagram"><svg viewBox="0 0 650 310" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="310" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">主觀與客觀品質的相關性</text>
  <!-- Axes -->
  <line x1="80" y1="50" x2="80" y2="260" stroke="#5a5550" stroke-width="1.2"/>
  <line x1="80" y1="260" x2="580" y2="260" stroke="#5a5550" stroke-width="1.2"/>
  <text x="55" y="155" fill="#8a8580" font-size="11" text-anchor="middle" transform="rotate(-90,55,155)">主觀品質 (MOS)</text>
  <text x="330" y="285" fill="#8a8580" font-size="11" text-anchor="middle">客觀指標 (e.g. PSNR, SSIM)</text>
  <!-- Y labels -->
  <text x="72" y="75" fill="#8a8580" font-size="9" text-anchor="end">5</text>
  <text x="72" y="122" fill="#8a8580" font-size="9" text-anchor="end">4</text>
  <text x="72" y="169" fill="#8a8580" font-size="9" text-anchor="end">3</text>
  <text x="72" y="216" fill="#8a8580" font-size="9" text-anchor="end">2</text>
  <text x="72" y="260" fill="#8a8580" font-size="9" text-anchor="end">1</text>
  <!-- Scatter points (showing imperfect correlation) -->
  <circle cx="130" cy="230" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="160" cy="210" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="180" cy="220" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="210" cy="185" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="240" cy="170" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="260" cy="145" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="280" cy="160" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="310" cy="130" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="330" cy="115" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="350" cy="140" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="380" cy="105" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="400" cy="95" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="430" cy="100" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="460" cy="85" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="490" cy="80" r="5" fill="#6a8a7a" opacity="0.6"/>
  <circle cx="520" cy="90" r="5" fill="#6a8a7a" opacity="0.6"/>
  <!-- Outliers (where subjective != objective) -->
  <circle cx="420" cy="170" r="6" fill="#c4a064" opacity="0.8" stroke="#c4a064" stroke-width="1.5"/>
  <text x="430" y="183" fill="#c4a064" font-size="8">Over-processed</text>
  <circle cx="200" cy="130" r="6" fill="#648cb4" opacity="0.8" stroke="#648cb4" stroke-width="1.5"/>
  <text x="210" y="123" fill="#648cb4" font-size="8">Natural feel</text>
  <!-- Trend line -->
  <path d="M110,240 Q300,155 540,80" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="6,3"/>
  <!-- Annotations -->
  <rect x="120" y="290" width="200" height="15" rx="3" fill="rgba(196,160,100,0.15)"/>
  <text x="220" y="300" fill="#c4a064" font-size="9" text-anchor="middle">高客觀分但主觀差 = 過度處理</text>
  <rect x="350" y="290" width="200" height="15" rx="3" fill="rgba(100,140,180,0.15)"/>
  <text x="450" y="300" fill="#648cb4" font-size="9" text-anchor="middle">低客觀分但主觀好 = 自然質感</text>
</svg><div class="caption">圖 7-6：主觀品質（MOS）與客觀指標的相關性 — 存在離群點</div></div>

<h3>不一致的常見原因</h3>
<table>
  <tr><th>情況</th><th>客觀表現</th><th>主觀感受</th><th>原因</th></tr>
  <tr><td>強 NR + 強銳化</td><td>SNR↑ MTF50↑</td><td>「蠟像感」不自然</td><td>紋理被破壞後人工重建</td></tr>
  <tr><td>輕微噪聲保留</td><td>SNR↓</td><td>感覺更自然</td><td>Film Grain 般的噪聲反而增加質感</td></tr>
  <tr><td>過度飽和</td><td>ΔE↑（差）</td><td>某些場景更討喜</td><td>鮮豔色彩的偏好勝過準確性</td></tr>
  <tr><td>銳度適中</td><td>MTF50 普通</td><td>「剛好」的清晰感</td><td>沒有 Overshoot 的自然銳度</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  客觀指標是 IQ Tuning 的<strong>必要條件</strong>，但不是<strong>充分條件</strong>。一個好的 IQ Tuning 結果必須同時達到合理的客觀指標<strong>和</strong>良好的主觀感受。當兩者衝突時，通常以主觀感受為準 — 因為最終用戶看到的是影像，不是數字。
</div>

<h3>進階客觀指標</h3>
<p>為了更好地預測主觀品質，學術界開發了多種「知覺品質指標」：</p>
<ul>
  <li><strong>SSIM（Structural Similarity）</strong>：考慮了結構資訊，比 PSNR 更符合人眼感知</li>
  <li><strong>VMAF（Video Multimethod Assessment Fusion）</strong>：Netflix 開發的融合多指標的品質預測模型</li>
  <li><strong>LPIPS（Learned Perceptual Image Patch Similarity）</strong>：基於深度學習的知覺相似度</li>
  <li><strong>NIQE / BRISQUE</strong>：無參考（No-Reference）品質指標，不需要原始影像</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議在 IQ Tuning 流程中設立兩道關卡：(1) 客觀指標門檻 — 必須通過最低標準；(2) 主觀盲測 — 由不知道參數設定的人員進行 A/B 比較。這兩道關卡都通過才算調適完成。
</div>
`,
      keyPoints: [
        "客觀指標無法完全代表人眼的品質感知",
        "主觀評價方法包括 MOS 評分、A/B 比較、JND 測試",
        "主觀與客觀不一致的常見原因：過度處理、自然質感偏好",
        "進階指標如 SSIM、VMAF、LPIPS 更接近人眼感知",
        "IQ Tuning 應設立客觀門檻和主觀盲測的雙重關卡"
      ]
    },
    {
      id: "ch7_7",
      title: "IQ Trade-offs",
      content: `
<h3>影像品質的不可能三角</h3>
<p>在 ISP Tuning 中，存在一個根本性的矛盾：你不可能同時將<strong>銳度（Detail/Sharpness）</strong>、<strong>乾淨度（Noise）</strong>、和<strong>自然度（Artifact-free）</strong>三者都推到極致。提升其中一個維度，幾乎必然會犧牲另外一個或兩個維度。</p>

<div class="diagram"><svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="380" fill="#f5f0eb" rx="8"/>
  <text x="300" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ Trade-off 三角</text>
  <!-- Triangle -->
  <polygon points="300,55 90,310 510,310" fill="none" stroke="#6a8a7a" stroke-width="2.5"/>
  <!-- Vertices -->
  <circle cx="300" cy="55" r="30" fill="rgba(106,138,122,0.2)" stroke="#6a8a7a" stroke-width="2"/>
  <text x="300" y="52" fill="#6a8a7a" font-size="11" text-anchor="middle" font-weight="600">Detail</text>
  <text x="300" y="66" fill="#6a8a7a" font-size="9" text-anchor="middle">銳度/細節</text>
  <circle cx="90" cy="310" r="30" fill="rgba(100,140,180,0.2)" stroke="#648cb4" stroke-width="2"/>
  <text x="90" y="307" fill="#648cb4" font-size="11" text-anchor="middle" font-weight="600">Clean</text>
  <text x="90" y="321" fill="#648cb4" font-size="9" text-anchor="middle">乾淨/低噪聲</text>
  <circle cx="510" cy="310" r="30" fill="rgba(196,160,100,0.2)" stroke="#c4a064" stroke-width="2"/>
  <text x="510" y="307" fill="#c4a064" font-size="11" text-anchor="middle" font-weight="600">Natural</text>
  <text x="510" y="321" fill="#c4a064" font-size="9" text-anchor="middle">自然/無偽影</text>
  <!-- Edge labels -->
  <text x="170" y="170" fill="#5a5550" font-size="10" text-anchor="middle" transform="rotate(-60,170,170)">銳化放大噪聲</text>
  <text x="430" y="170" fill="#5a5550" font-size="10" text-anchor="middle" transform="rotate(60,430,170)">銳化產生 Halo</text>
  <text x="300" y="330" fill="#5a5550" font-size="10" text-anchor="middle">降噪損失紋理</text>
  <!-- Operating points -->
  <circle cx="250" cy="180" r="8" fill="#6a8a7a" stroke="#fff" stroke-width="2"/>
  <text x="220" y="178" fill="#6a8a7a" font-size="9" text-anchor="end">手機</text>
  <circle cx="350" cy="200" r="8" fill="#c4a064" stroke="#fff" stroke-width="2"/>
  <text x="380" y="198" fill="#c4a064" font-size="9">車用</text>
  <circle cx="300" cy="230" r="8" fill="#648cb4" stroke="#fff" stroke-width="2"/>
  <text x="330" y="226" fill="#648cb4" font-size="9">專業</text>
  <!-- Center label -->
  <text x="300" y="265" fill="#8a8580" font-size="10" text-anchor="middle" font-style="italic">「理想」= 三者完美平衡</text>
  <text x="300" y="280" fill="#8a8580" font-size="9" text-anchor="middle">但實際上必須根據應用做取捨</text>
  <!-- Legend -->
  <rect x="120" y="350" width="360" height="22" rx="4" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <circle cx="160" cy="361" r="5" fill="#6a8a7a"/>
  <text x="170" y="365" fill="#5a5550" font-size="9">手機（偏銳利）</text>
  <circle cx="290" cy="361" r="5" fill="#c4a064"/>
  <text x="300" y="365" fill="#5a5550" font-size="9">車用（偏自然）</text>
  <circle cx="400" cy="361" r="5" fill="#648cb4"/>
  <text x="410" y="365" fill="#5a5550" font-size="9">專業（平衡）</text>
</svg><div class="caption">圖 7-7：IQ Trade-off 三角 — Detail / Clean / Natural 的平衡取捨</div></div>

<h3>主要的 Trade-off 對</h3>

<h4>1. 銳度 vs 噪聲</h4>
<p>這是最核心的 Trade-off。銳化增強高頻 → 噪聲被放大；降噪壓制高頻 → 紋理被破壞。兩者的平衡點取決於 ISO（SNR）。</p>

<h4>2. 降噪強度 vs 紋理保留</h4>
<p>降噪越強，平坦區越乾淨，但紋理（如草地、布料）越模糊。「塗抹感」（Smearing）是過度降噪的典型 artifact。</p>

<h4>3. 銳度 vs Artifact（Halo/Ringing）</h4>
<p>銳化越強，邊緣越清晰，但 Overshoot/Undershoot（Halo）越明顯。特別是在高對比度邊緣處。</p>

<h4>4. Dynamic Range vs 噪聲</h4>
<p>HDR 合成擴大了動態範圍，但在暗區提亮時會放大噪聲；在亮區壓暗時可能降低 SNR。</p>

<h4>5. 色彩準確性 vs 色彩偏好</h4>
<p>精確的色彩（低 ΔE）不一定是最討喜的。消費者通常偏好更鮮豔的天空、更紅潤的膚色。</p>

<h3>不同應用場景的取捨策略</h3>
<table>
  <tr><th>應用</th><th>優先級排序</th><th>說明</th></tr>
  <tr><td>手機社交分享</td><td>銳度 > 色彩討喜 > 乾淨</td><td>小螢幕觀看，銳度和色彩更重要</td></tr>
  <tr><td>專業攝影</td><td>自然度 > 細節 > 準確色彩</td><td>後期空間大，不希望過度處理</td></tr>
  <tr><td>車用 ADAS</td><td>自然度 > 動態範圍 > 銳度</td><td>不能有 artifact 影響演算法判斷</td></tr>
  <tr><td>監控</td><td>乾淨 > 動態範圍 > 細節</td><td>低光下辨識能力最重要</td></tr>
  <tr><td>醫療影像</td><td>準確色彩 > 自然度 > 細節</td><td>診斷準確性為最高優先</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 的本質是<strong>在有限的物理條件下做最佳的取捨</strong>。沒有「萬能」的參數設定，只有「最適合特定應用和場景」的設定。好的 Tuning 工程師不只是調參數的技術人員，更是理解應用需求的「品質策略師」。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  在項目初期就與客戶明確「IQ Priority」（品質優先級排序），並用參考影像（Golden Reference）達成共識。這可以避免後期無止境的修改循環。一個有效的方法是提供 3~4 組不同取捨策略的樣張，讓客戶選擇偏好的方向。
</div>
`,
      keyPoints: [
        "Detail、Clean、Natural 三者構成不可能三角",
        "核心 Trade-off：銳度 vs 噪聲、降噪 vs 紋理、銳化 vs Halo",
        "不同應用有不同的優先級排序",
        "好的 Tuning 是在物理限制下做最佳取捨，沒有萬能設定",
        "項目初期應與客戶明確 IQ Priority 和 Golden Reference"
      ]
    },
    {
      id: "ch7_8",
      title: "場景調適策略 Scene-adaptive Tuning",
      content: `
<h3>為什麼需要場景調適？</h3>
<p>不同的拍攝場景有截然不同的特性和品質需求。例如：夜景需要更強的降噪但要保留燈光細節；人像需要柔和的皮膚但清晰的五官；風景需要豐富的紋理和鮮豔的色彩。如果用同一組 ISP 參數處理所有場景，必然無法在每個場景都達到最佳效果。</p>

<p><strong>場景調適（Scene-adaptive Tuning）</strong>就是根據自動辨識的場景類型，動態切換或調整 ISP 參數。</p>

<div class="diagram"><svg viewBox="0 0 650 370" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="370" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">場景分類與調適流程</text>
  <defs><marker id="arrowSC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Input -->
  <rect x="30" y="50" width="100" height="60" rx="6" fill="#fff" stroke="#d5cec7" stroke-width="1.5"/>
  <text x="80" y="77" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">輸入影像</text>
  <text x="80" y="95" fill="#8a8580" font-size="9" text-anchor="middle">RAW / YUV</text>
  <line x1="130" y1="80" x2="165" y2="80" stroke="#5a5550" stroke-width="1.2" marker-end="url(#arrowSC)"/>
  <!-- Scene Classifier -->
  <rect x="170" y="40" width="140" height="80" rx="8" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.5"/>
  <text x="240" y="65" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Scene Classifier</text>
  <text x="240" y="82" fill="#5a5550" font-size="9" text-anchor="middle">亮度 / 色溫 / 紋理</text>
  <text x="240" y="96" fill="#5a5550" font-size="9" text-anchor="middle">人臉 / 動態 / 天空佔比</text>
  <text x="240" y="108" fill="#8a8580" font-size="8" text-anchor="middle">（規則或 AI 模型）</text>
  <!-- Scene types -->
  <line x1="310" y1="60" x2="370" y2="50" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="75" x2="370" y2="90" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="90" x2="370" y2="130" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="310" y1="105" x2="370" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <!-- Scene boxes -->
  <rect x="375" y="35" width="115" height="30" rx="5" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="432" y="55" fill="#c4a064" font-size="10" text-anchor="middle" font-weight="500">🌙 夜景 Night</text>
  <rect x="375" y="75" width="115" height="30" rx="5" fill="rgba(200,120,120,0.12)" stroke="#c87878" stroke-width="1.2"/>
  <text x="432" y="95" fill="#c87878" font-size="10" text-anchor="middle" font-weight="500">👤 人像 Portrait</text>
  <rect x="375" y="115" width="115" height="30" rx="5" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="432" y="135" fill="#6a8a7a" font-size="10" text-anchor="middle" font-weight="500">🏔️ 風景 Landscape</text>
  <rect x="375" y="155" width="115" height="30" rx="5" fill="rgba(100,140,180,0.12)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="432" y="175" fill="#648cb4" font-size="10" text-anchor="middle" font-weight="500">📝 文件 Document</text>
  <!-- Per-scene parameters -->
  <line x1="490" y1="50" x2="520" y2="50" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="90" x2="520" y2="90" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="130" x2="520" y2="130" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <line x1="490" y1="170" x2="520" y2="170" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowSC)"/>
  <rect x="525" y="30" width="105" height="165" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="577" y="50" fill="#c4a064" font-size="9" text-anchor="middle">NR↑ Sharp↓</text>
  <text x="577" y="65" fill="#c4a064" font-size="8" text-anchor="middle">HDR=ON Sat↓</text>
  <text x="577" y="93" fill="#c87878" font-size="9" text-anchor="middle">SkinNR↑ Eye↑</text>
  <text x="577" y="108" fill="#c87878" font-size="8" text-anchor="middle">Bokeh WB暖</text>
  <text x="577" y="135" fill="#6a8a7a" font-size="9" text-anchor="middle">Sharp↑ Sat↑</text>
  <text x="577" y="150" fill="#6a8a7a" font-size="8" text-anchor="middle">Clarity↑ Sky↑</text>
  <text x="577" y="175" fill="#648cb4" font-size="9" text-anchor="middle">Sharp MAX</text>
  <text x="577" y="190" fill="#648cb4" font-size="8" text-anchor="middle">Contrast↑ BW</text>
  <!-- Blending -->
  <rect x="130" y="225" width="400" height="55" rx="8" fill="rgba(106,138,122,0.1)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="330" y="248" fill="#6a8a7a" font-size="12" text-anchor="middle" font-weight="500">Parameter Blending / Interpolation</text>
  <text x="330" y="268" fill="#5a5550" font-size="10" text-anchor="middle">多場景混合時使用加權插值，確保參數切換不會產生可見跳變</text>
  <!-- Smooth transition note -->
  <rect x="100" y="300" width="450" height="55" rx="6" fill="rgba(196,160,100,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="318" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">關鍵挑戰：場景轉換時的平滑過渡</text>
  <text x="325" y="338" fill="#8a8580" font-size="10" text-anchor="middle">連續影像中場景變化時，參數需要逐幀漸變（Temporal Smoothing）</text>
  <text x="325" y="352" fill="#8a8580" font-size="10" text-anchor="middle">避免相鄰幀之間出現突兀的亮度、色彩或銳度跳變</text>
</svg><div class="caption">圖 7-8：場景分類與 Per-scene 調適流程</div></div>

<h3>常見場景及其調適策略</h3>
<table>
  <tr><th>場景</th><th>特徵</th><th>NR</th><th>銳化</th><th>色彩</th><th>其他</th></tr>
  <tr><td>夜景</td><td>低光、高 ISO</td><td>強</td><td>弱</td><td>低飽和</td><td>HDR merge、長曝</td></tr>
  <tr><td>人像</td><td>有人臉</td><td>皮膚區強 NR</td><td>眼/唇強化</td><td>膚色暖調</td><td>Bokeh、美顏</td></tr>
  <tr><td>風景</td><td>遠景、天空多</td><td>中等</td><td>強</td><td>高飽和</td><td>Clarity↑、天空增強</td></tr>
  <tr><td>文件</td><td>文字/圖表</td><td>極弱</td><td>極強</td><td>低飽和</td><td>高對比度、二值化</td></tr>
  <tr><td>逆光</td><td>高 DR 場景</td><td>中等</td><td>中等</td><td>標準</td><td>HDR、LTM 增強</td></tr>
  <tr><td>動態</td><td>快速移動</td><td>時域 NR 關閉</td><td>中等</td><td>標準</td><td>短曝光、防手震</td></tr>
</table>

<h3>場景分類技術</h3>
<p>場景分類可以使用規則式或 AI 式方法：</p>
<ul>
  <li><strong>規則式</strong>：根據曝光參數（ISO、曝光時間）、AWB 色溫、人臉偵測結果、3A 統計資訊等，用手動設定的規則來判斷場景。簡單可靠但不夠精細</li>
  <li><strong>AI 式</strong>：使用輕量級的 CNN 或 Decision Tree 模型，從影像特徵自動分類場景。更精確但需要訓練數據和計算資源</li>
  <li><strong>混合式</strong>：AI 模型輔助 + 規則兜底，是目前主流的做法</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  場景調適的關鍵挑戰不在於「分類正確」，而在於「過渡平滑」。在錄影模式下，場景可能在幾幀內快速變化（例如從室內走到室外），如果參數瞬間切換，用戶會看到明顯的跳變。因此，所有場景自適應參數都需要<strong>時間域平滑（Temporal Smoothing）</strong>。
</div>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  設計場景調適時，建議使用「Base + Delta」的架構：先有一組在所有場景都「還不錯」的基礎參數（Base），然後每個場景只定義相對於 Base 的調整量（Delta）。這樣管理起來更清晰，也更容易做場景間的混合插值。
</div>
`,
      keyPoints: [
        "不同場景有不同的 IQ 需求，需要動態調整 ISP 參數",
        "常見場景：夜景、人像、風景、文件、逆光、動態",
        "場景分類使用規則式、AI 式或混合式方法",
        "關鍵挑戰是場景轉換時的平滑過渡（Temporal Smoothing）",
        "建議使用 Base + Delta 架構管理 Per-scene 參數"
      ]
    },
    {
      id: "ch7_9",
      title: "車用相機 IQ 要求",
      content: `
<h3>車用相機的特殊需求</h3>
<p><strong>車用相機（Automotive Camera）</strong>的 IQ 要求與消費性相機有本質的不同。消費相機的目標是「讓人看了覺得好看」，而車用相機的目標是「讓演算法能正確識別」— 無論是 ADAS（Advanced Driver Assistance Systems）還是自動駕駛系統。</p>

<p>這意味著車用 IQ Tuning 的首要原則是：<strong>不能引入會誤導感知演算法的 artifact</strong>。</p>

<div class="diagram"><svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f5f0eb" rx="8"/>
  <text x="300" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">車用相機 IQ 需求雷達圖</text>
  <!-- Radar chart -->
  <g transform="translate(300,190)">
    <!-- Axes (6 dimensions) -->
    <line x1="0" y1="0" x2="0" y2="-130" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="112" y2="-65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="112" y2="65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2="130" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="-112" y2="65" stroke="#d5cec7" stroke-width="1"/>
    <line x1="0" y1="0" x2="-112" y2="-65" stroke="#d5cec7" stroke-width="1"/>
    <!-- Grid rings -->
    <polygon points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <polygon points="0,-91 79,-45 79,45 0,91 -79,45 -79,-45" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <polygon points="0,-130 112,-65 112,65 0,130 -112,65 -112,-65" fill="none" stroke="#d5cec7" stroke-width="0.5"/>
    <!-- Labels -->
    <text x="0" y="-140" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">Dynamic Range</text>
    <text x="130" y="-68" fill="#5a5550" font-size="11" font-weight="500">LED Flicker</text>
    <text x="130" y="75" fill="#5a5550" font-size="11" font-weight="500">Low-light SNR</text>
    <text x="0" y="148" fill="#5a5550" font-size="11" text-anchor="middle" font-weight="500">色彩一致性</text>
    <text x="-130" y="75" fill="#5a5550" font-size="11" text-anchor="end" font-weight="500">Artifact-free</text>
    <text x="-130" y="-68" fill="#5a5550" font-size="11" text-anchor="end" font-weight="500">MTF 均勻性</text>
    <!-- Consumer camera profile -->
    <polygon points="0,-78 90,-35 67,50 0,65 -56,35 -90,-45" fill="rgba(196,160,100,0.15)" stroke="#c4a064" stroke-width="1.5"/>
    <!-- Automotive camera profile -->
    <polygon points="0,-117 101,-55 90,55 0,104 -101,55 -101,-52" fill="rgba(106,138,122,0.15)" stroke="#6a8a7a" stroke-width="2"/>
  </g>
  <!-- Legend -->
  <line x1="140" y1="340" x2="170" y2="340" stroke="#6a8a7a" stroke-width="2"/>
  <text x="175" y="344" fill="#5a5550" font-size="10">車用相機要求</text>
  <line x1="310" y1="340" x2="340" y2="340" stroke="#c4a064" stroke-width="1.5"/>
  <text x="345" y="344" fill="#5a5550" font-size="10">消費相機要求</text>
</svg><div class="caption">圖 7-9：車用 vs 消費相機 IQ 需求雷達圖 — 車用在多個維度要求更高</div></div>

<h3>關鍵需求分析</h3>

<h4>1. 超高動態範圍（HDR）</h4>
<p>車用場景的動態範圍需求遠超消費相機：</p>
<ul>
  <li>隧道出口：暗處需要看到路面，亮處需要看到天空和對向車輛（> 120 dB）</li>
  <li>夜間逆光：對向車燈 + 陰暗路面（> 100 dB）</li>
  <li>車用 Sensor 通常使用 Split-pixel HDR 或 Multi-exposure HDR 來達到 120+ dB</li>
</ul>

<h4>2. LED Flicker Mitigation（LED 閃爍抑制）</h4>
<p>LED 交通號誌和 LED 車燈以高頻脈衝方式驅動。如果曝光時間不是 LED 週期的整數倍，拍攝到的影像會出現 LED 部分暗或完全不亮的現象，這可能導致 ADAS 系統<strong>無法辨識紅綠燈狀態</strong>— 這是安全攸關的問題。</p>

<h4>3. Artifact-free 處理</h4>
<p>車用 ISP 對 Artifact 的容忍度極低：</p>
<ul>
  <li>Halo / Ringing：可能被物件偵測網路誤判為物體邊緣</li>
  <li>Color Fringing：可能影響交通號誌的色彩判讀</li>
  <li>Motion Artifact：HDR 合成時的鬼影可能被誤判為行人</li>
</ul>

<h4>4. 溫度穩定性</h4>
<p>車用相機需要在 -40°C ~ +85°C 的範圍內保持穩定的 IQ。Sensor 的噪聲特性和 Dark Current 會隨溫度大幅變化，ISP 參數需要有溫度補償機制。</p>

<h3>車用 IQ 標準</h3>
<table>
  <tr><th>標準/規範</th><th>涵蓋範圍</th></tr>
  <tr><td>IEEE 2020</td><td>車用影像品質評估標準</td></tr>
  <tr><td>AIS (Automotive Image Standard)</td><td>車用相機性能指標定義</td></tr>
  <tr><td>ISO 16505</td><td>電子後視鏡的影像品質要求</td></tr>
  <tr><td>NCAP 評分</td><td>ADAS 系統的安全性評估（間接影響 IQ 要求）</td></tr>
</table>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  車用相機的 IQ Tuning 首要原則是「安全第一」— 任何 ISP 處理都不能引入可能誤導 ADAS 演算法的 artifact。這與消費相機「好看第一」的原則完全不同。在車用 IQ 中，保守、穩定的處理往往優於激進、華麗的效果。
</div>

<div class="info-box warn">
  <div class="box-title">⚠️ 安全注意</div>
  車用 ISP 的 Tuning 錯誤可能導致嚴重後果。例如：過度降噪導致行人在低光下被「抹除」；HDR 合成的鬼影被誤判為障礙物導致急剎車。車用 IQ Tuning 必須經過嚴格的場景覆蓋測試和安全審查。
</div>
`,
      keyPoints: [
        "車用 IQ 的首要原則是「安全第一」— 不能引入誤導演算法的 artifact",
        "超高 HDR（>120dB）是核心需求，隧道和夜間逆光場景",
        "LED Flicker 抑制是安全攸關的問題（交通號誌辨識）",
        "對 Halo、Color Fringing、Motion Artifact 的容忍度極低",
        "需要在 -40°C~+85°C 範圍內保持穩定 IQ"
      ]
    },
    {
      id: "ch7_10",
      title: "IQ Tuning 工具與流程",
      content: `
<h3>IQ Tuning 工具鏈</h3>
<p>完整的 IQ Tuning 工作需要一系列的軟硬體工具。從拍攝環境到分析軟體，每個環節都有專門的工具。</p>

<div class="diagram"><svg viewBox="0 0 650 380" xmlns="http://www.w3.org/2000/svg">
  <rect width="650" height="380" fill="#f5f0eb" rx="8"/>
  <text x="325" y="25" fill="#5a5550" font-size="14" text-anchor="middle" font-weight="500">IQ Tuning 完整工具鏈</text>
  <defs><marker id="arrowTL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#5a5550"/></marker></defs>
  <!-- Layer 1: Environment -->
  <rect x="25" y="42" width="600" height="55" rx="6" fill="rgba(196,160,100,0.08)" stroke="#c4a064" stroke-width="1.2"/>
  <text x="55" y="62" fill="#c4a064" font-size="11" font-weight="500">拍攝環境</text>
  <rect x="55" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="97" y="85" fill="#5a5550" font-size="9" text-anchor="middle">光箱 Light Box</text>
  <rect x="150" y="70" width="90" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="195" y="85" fill="#5a5550" font-size="9" text-anchor="middle">色溫可調光源</text>
  <rect x="250" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="292" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Spectrometer</text>
  <rect x="345" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="387" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Lux Meter</text>
  <rect x="440" y="70" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="477" y="85" fill="#5a5550" font-size="9" text-anchor="middle">測試圖卡</text>
  <rect x="525" y="70" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="567" y="85" fill="#5a5550" font-size="9" text-anchor="middle">Integrating Sphere</text>
  <line x1="325" y1="97" x2="325" y2="112" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 2: Capture -->
  <rect x="25" y="115" width="600" height="55" rx="6" fill="rgba(106,138,122,0.08)" stroke="#6a8a7a" stroke-width="1.2"/>
  <text x="55" y="135" fill="#6a8a7a" font-size="11" font-weight="500">影像擷取</text>
  <rect x="55" y="143" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="110" y="158" fill="#5a5550" font-size="9" text-anchor="middle">RAW Capture Tool</text>
  <rect x="175" y="143" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="230" y="158" fill="#5a5550" font-size="9" text-anchor="middle">Vendor ISP Tool</text>
  <rect x="295" y="143" width="120" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="355" y="158" fill="#5a5550" font-size="9" text-anchor="middle">Register Read/Write</text>
  <rect x="425" y="143" width="100" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="475" y="158" fill="#5a5550" font-size="9" text-anchor="middle">ADB / UART</text>
  <line x1="325" y1="170" x2="325" y2="185" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 3: Tuning -->
  <rect x="25" y="188" width="600" height="55" rx="6" fill="rgba(100,140,180,0.08)" stroke="#648cb4" stroke-width="1.2"/>
  <text x="55" y="208" fill="#648cb4" font-size="11" font-weight="500">參數調適</text>
  <rect x="55" y="216" width="120" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="115" y="231" fill="#5a5550" font-size="9" text-anchor="middle">ISP Tuning GUI</text>
  <rect x="185" y="216" width="100" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="235" y="231" fill="#5a5550" font-size="9" text-anchor="middle">XML/JSON 參數</text>
  <rect x="295" y="216" width="110" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="350" y="231" fill="#5a5550" font-size="9" text-anchor="middle">自動校準腳本</text>
  <rect x="415" y="216" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="462" y="231" fill="#5a5550" font-size="9" text-anchor="middle">版本管理 Git</text>
  <rect x="520" y="216" width="90" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="565" y="231" fill="#5a5550" font-size="9" text-anchor="middle">即時預覽</text>
  <line x1="325" y1="243" x2="325" y2="258" stroke="#5a5550" stroke-width="1" marker-end="url(#arrowTL)"/>
  <!-- Layer 4: Analysis -->
  <rect x="25" y="261" width="600" height="55" rx="6" fill="rgba(160,130,180,0.08)" stroke="#a082b4" stroke-width="1.2"/>
  <text x="55" y="281" fill="#a082b4" font-size="11" font-weight="500">分析評估</text>
  <rect x="55" y="289" width="80" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="95" y="304" fill="#5a5550" font-size="9" text-anchor="middle">Imatest</text>
  <rect x="145" y="289" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="192" y="304" fill="#5a5550" font-size="9" text-anchor="middle">DxO Analyzer</text>
  <rect x="250" y="289" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="287" y="304" fill="#5a5550" font-size="9" text-anchor="middle">MATLAB</text>
  <rect x="335" y="289" width="75" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="372" y="304" fill="#5a5550" font-size="9" text-anchor="middle">Python</text>
  <rect x="420" y="289" width="95" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="467" y="304" fill="#5a5550" font-size="9" text-anchor="middle">自動化報告</text>
  <rect x="525" y="289" width="85" height="22" rx="3" fill="#fff" stroke="#d5cec7" stroke-width="1"/>
  <text x="567" y="304" fill="#5a5550" font-size="9" text-anchor="middle">主觀評價 App</text>
  <!-- Feedback loop -->
  <path d="M625,280 Q640,200 625,130 Q620,115 600,115" fill="none" stroke="#6a8a7a" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arrowTL)"/>
  <text x="640" y="200" fill="#6a8a7a" font-size="9" transform="rotate(90,640,200)">迭代回饋</text>
  <!-- Bottom summary -->
  <rect x="80" y="335" width="490" height="35" rx="6" fill="rgba(106,138,122,0.05)" stroke="#d5cec7" stroke-width="1"/>
  <text x="325" y="350" fill="#5a5550" font-size="10" text-anchor="middle">完整的工具鏈實現：拍攝 → 擷取 RAW → 調參 → 即時預覽 → 客觀量測 → 主觀評估 → 迭代</text>
  <text x="325" y="365" fill="#8a8580" font-size="9" text-anchor="middle">自動化程度越高，Tuning 效率越高。目標：每次迭代 < 1 小時</text>
</svg><div class="caption">圖 7-10：IQ Tuning 完整工具鏈 — 從拍攝環境到分析評估的四層架構</div></div>

<h3>商業 IQ 分析工具</h3>
<table>
  <tr><th>工具</th><th>特色</th><th>主要用途</th></tr>
  <tr><td><strong>Imatest</strong></td><td>業界最廣泛使用，支援多種圖卡</td><td>MTF、色彩、噪聲、畸變等全方位評估</td></tr>
  <tr><td><strong>DxO Analyzer</strong></td><td>DxOMark 評分背後的工具</td><td>標準化的 IQ Benchmarking</td></tr>
  <tr><td><strong>Image Engineering</strong></td><td>德國精密量測</td><td>高精度色彩和解析力量測</td></tr>
  <tr><td><strong>HGH ADAS Test</strong></td><td>車用專用</td><td>LED Flicker、HDR、車用場景</td></tr>
</table>

<h3>自動化 Tuning 趨勢</h3>
<p>傳統的 IQ Tuning 高度依賴工程師的經驗和手動調整，效率低且難以規模化。現代趨勢是引入<strong>自動化 Tuning</strong>：</p>
<ul>
  <li><strong>Auto-calibration</strong>：BLC、LSC、DPC 等校準步驟完全自動化（已成熟）</li>
  <li><strong>Guided Tuning</strong>：工具提供建議值和自動搜尋最佳參數的功能</li>
  <li><strong>ML-based Tuning</strong>：使用機器學習模型預測最佳 ISP 參數（研究前沿）</li>
  <li><strong>CI/CD Pipeline</strong>：將 IQ 評估整合到持續整合流程中，每次軟體更新自動跑 IQ Regression Test</li>
</ul>

<div class="info-box key">
  <div class="box-title">🔑 核心觀念</div>
  IQ Tuning 工具鏈的成熟度直接影響開發效率。一個好的工具鏈能讓「拍攝→調參→驗證」的單次迭代控制在 1 小時以內，而非手動操作時的半天到一天。投資建設自動化工具鏈，在多項目、多產品的環境中回報極高。
</div>

<h3>版本管理與追溯</h3>
<p>ISP 參數的版本管理非常重要：</p>
<ul>
  <li>使用 Git 管理所有參數檔案（XML、JSON、Binary）</li>
  <li>每次調整附帶變更說明和效果對比截圖</li>
  <li>維護 IQ Regression Test Suite — 一組標準場景影像和期望的品質指標</li>
  <li>在 CI/CD 中自動執行 Regression Test，防止品質回退</li>
</ul>

<div class="info-box tip">
  <div class="box-title">💡 實務技巧</div>
  建議建立一個「IQ Dashboard」— 一個集中顯示所有 IQ 指標歷史趨勢的網頁或工具。這樣團隊成員可以隨時追蹤 IQ 的變化趨勢，快速發現品質回退，並將 IQ 狀態可視化地呈現給管理層和客戶。
</div>
`,
      keyPoints: [
        "完整工具鏈包含拍攝環境、影像擷取、參數調適、分析評估四層",
        "Imatest 和 DxO Analyzer 是業界最主流的商業 IQ 分析工具",
        "自動化 Tuning 是趨勢：Auto-calibration → Guided → ML-based",
        "使用 Git 管理參數版本，CI/CD 整合 IQ Regression Test",
        "投資自動化工具鏈在多項目環境中回報極高"
      ]
    }
  ]
};
